import {
  type ConfigLayer,
  type MergedAgentGuardConfig,
  parseConfigJson,
  validateConfig,
} from "@agentguard/config";
import type { AgentGuardReport } from "@agentguard/contracts";
import type { CheckRepositoryDependencies } from "@agentguard/core";
import {
  renderJsonReport,
  renderMarkdownReport,
  renderTerminalReport,
} from "@agentguard/report";
import type { AgentGuardComposition } from "../composition/create-agentguard.js";
import { createAgentGuard } from "../composition/create-agentguard.js";

type CheckGitStatus = Awaited<
  ReturnType<CheckRepositoryDependencies["gitProvider"]["getStatus"]>
>;

export const CHECK_FORMATS = ["terminal", "json", "markdown"] as const;
export type CheckFormat = (typeof CHECK_FORMATS)[number];
export const CHECK_CI_DEFAULT_FORMAT: CheckFormat = "json";

type CheckReportRenderer = (report: AgentGuardReport) => string;

const REPORT_RENDERERS: Readonly<Record<CheckFormat, CheckReportRenderer>> = {
  json: renderJsonReport,
  markdown: renderMarkdownReport,
  terminal: renderTerminalReport,
};

export interface CheckCommandOptions {
  readonly baseRef?: string;
  readonly ci?: boolean;
  readonly configPath?: string;
  readonly cwd?: string;
  readonly composition?: AgentGuardComposition;
  readonly format?: string;
  readonly headRef?: string;
}

export class CheckCommandFormatError extends Error {
  readonly code = "invalid-format" as const;
  readonly value: string;

  constructor(value: string) {
    super(
      `Unsupported check format "${value}". Expected terminal, json, or markdown.`,
    );
    this.name = "CheckCommandFormatError";
    this.value = value;
  }
}

export type CheckCommandConfigErrorCode =
  | "read-failed"
  | "invalid-json"
  | "invalid-shape";

export class CheckCommandConfigError extends Error {
  readonly code: CheckCommandConfigErrorCode;
  readonly path: string;

  constructor(code: CheckCommandConfigErrorCode, path: string) {
    super(`Configuration ${code} for ${path}`);
    this.name = "CheckCommandConfigError";
    this.code = code;
    this.path = path;
  }
}

export type CheckDiffSelection =
  | { readonly kind: "working-tree" }
  | {
      readonly baseRef: string;
      readonly headRef: string;
      readonly kind: "base-to-head";
    };

export interface CheckCommandSuccess {
  readonly kind: "checked";
  readonly repositoryRoot: string;
  readonly status: CheckGitStatus;
  readonly diff: string;
  readonly diffSelection: CheckDiffSelection;
  readonly config: MergedAgentGuardConfig;
  readonly format: CheckFormat;
}

export interface CheckCommandNotRepository {
  readonly kind: "not-a-repository";
  readonly repositoryRoot: null;
  readonly status: null;
  readonly diff: null;
  readonly diffSelection: null;
  readonly config: MergedAgentGuardConfig;
  readonly format: CheckFormat;
}

export type CheckCommandOutcome =
  | CheckCommandNotRepository
  | CheckCommandSuccess;

export function parseCheckFormat(value: string | undefined): CheckFormat {
  if (value === undefined) {
    return "terminal";
  }

  if ((CHECK_FORMATS as readonly string[]).includes(value)) {
    return value as CheckFormat;
  }

  throw new CheckCommandFormatError(value);
}

/** CI selects stable JSON output by default while preserving explicit formats. */
export function resolveCheckFormat(
  value: string | undefined,
  ci = false,
): CheckFormat {
  return parseCheckFormat(value ?? (ci ? CHECK_CI_DEFAULT_FORMAT : undefined));
}

export function renderCheckReport(
  format: CheckFormat,
  report: AgentGuardReport,
): string {
  return REPORT_RENDERERS[format](report);
}

async function loadConfigLayer(
  composition: AgentGuardComposition,
  configPath: string,
): Promise<ConfigLayer> {
  let contents: string;
  try {
    contents =
      await composition.checker.dependencies.fileSystem.readText(configPath);
  } catch {
    throw new CheckCommandConfigError("read-failed", configPath);
  }

  let parsed: unknown;
  try {
    parsed = parseConfigJson(contents);
  } catch {
    throw new CheckCommandConfigError("invalid-json", configPath);
  }

  if (!validateConfig(parsed)) {
    throw new CheckCommandConfigError("invalid-shape", configPath);
  }

  return parsed;
}

async function resolveComposition(
  options: CheckCommandOptions,
): Promise<AgentGuardComposition> {
  const composition = options.composition ?? createAgentGuard();
  if (options.configPath === undefined) {
    return composition;
  }

  const config = await loadConfigLayer(composition, options.configPath);
  return createAgentGuard({
    config,
    report: composition.report,
    runtime: composition.runtime,
  });
}

export async function runCheckCommand(
  options: CheckCommandOptions = {},
): Promise<CheckCommandOutcome> {
  const cwd = options.cwd ?? process.cwd();
  const format = resolveCheckFormat(options.format, options.ci);
  const composition = await resolveComposition(options);
  const { gitProvider } = composition.checker.dependencies;
  const repositoryRoot = await gitProvider.getRepositoryRoot(cwd);

  if (repositoryRoot === null) {
    return {
      kind: "not-a-repository",
      repositoryRoot: null,
      status: null,
      diff: null,
      diffSelection: null,
      config: composition.config,
      format,
    };
  }

  const status = await gitProvider.getStatus(repositoryRoot);
  const baseRef = options.baseRef;
  const headRef = options.headRef;
  const usesRefDiff = baseRef !== undefined || headRef !== undefined;
  const selectedBaseRef = baseRef ?? "HEAD";
  const selectedHeadRef = headRef ?? "HEAD";
  const diff = usesRefDiff
    ? await gitProvider.getDiff(
        repositoryRoot,
        selectedBaseRef,
        selectedHeadRef,
      )
    : await gitProvider.getWorkingTreeDiff(repositoryRoot);

  return {
    kind: "checked",
    repositoryRoot,
    status,
    diff,
    diffSelection: usesRefDiff
      ? {
          baseRef: selectedBaseRef,
          headRef: selectedHeadRef,
          kind: "base-to-head",
        }
      : { kind: "working-tree" },
    config: composition.config,
    format,
  };
}
