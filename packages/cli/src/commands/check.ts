import { join } from "node:path";
import {
  type ConfigLayer,
  type MergedDiffSentryConfig,
  parseConfigJson,
  validateConfig,
} from "@felyx-fu/diffsentry-config";
import type { DiffSentryReport } from "@felyx-fu/diffsentry-contracts";
import {
  type AssembledChangeSet,
  applySeverityOverrides,
  assembleChangeSet,
  assembleProjectContext,
  type CheckRepositoryDependencies,
  calculateRiskScore,
  calculateVerdict,
  detectPackageManager,
  isNodeProjectCandidate,
  isTypeScriptProject,
  planVerifications,
  readKnownPackageScripts,
  VerificationExecutionCoordinator,
} from "@felyx-fu/diffsentry-core";
import {
  renderJsonReport,
  renderMarkdownReport,
  renderTerminalReport,
} from "@felyx-fu/diffsentry-report";
import {
  authWithoutTestsRule,
  runtimeDependencyAddedRule,
  secretExposureRule,
  sourceWithoutTestsRule,
  workflowPermissionChangeRule,
} from "@felyx-fu/diffsentry-rules";
import type { DiffSentryComposition } from "../composition/create-diffsentry.js";
import { createDiffSentry } from "../composition/create-diffsentry.js";

type CheckGitStatus = Awaited<
  ReturnType<CheckRepositoryDependencies["gitProvider"]["getStatus"]>
>;

export const CHECK_FORMATS = ["terminal", "json", "markdown"] as const;
export type CheckFormat = (typeof CHECK_FORMATS)[number];
export const CHECK_CI_DEFAULT_FORMAT: CheckFormat = "json";

type CheckReportRenderer = (report: DiffSentryReport) => string;

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
  readonly composition?: DiffSentryComposition;
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

export class CheckCommandProjectError extends Error {
  readonly code = "project-detection-failed" as const;

  constructor(message: string) {
    super(message);
    this.name = "CheckCommandProjectError";
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
  readonly config: MergedDiffSentryConfig;
  readonly format: CheckFormat;
}

export interface CheckPipelineSuccess {
  readonly kind: "checked";
  readonly format: CheckFormat;
  readonly report: DiffSentryReport;
}

export interface CheckPipelineNotRepository {
  readonly kind: "not-a-repository";
  readonly format: CheckFormat;
}

export type CheckPipelineOutcome =
  | CheckPipelineNotRepository
  | CheckPipelineSuccess;

export interface CheckCommandNotRepository {
  readonly kind: "not-a-repository";
  readonly repositoryRoot: null;
  readonly status: null;
  readonly diff: null;
  readonly diffSelection: null;
  readonly config: MergedDiffSentryConfig;
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
  report: DiffSentryReport,
): string {
  return REPORT_RENDERERS[format](report);
}

async function loadConfigLayer(
  composition: DiffSentryComposition,
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
): Promise<DiffSentryComposition> {
  const composition = options.composition ?? createDiffSentry();
  if (options.configPath === undefined) {
    return composition;
  }

  const config = await loadConfigLayer(composition, options.configPath);
  return createDiffSentry({
    config,
    report: composition.report,
    runtime: composition.runtime,
  });
}

interface ChangedFileSnapshot {
  readonly afterContents: string;
  readonly beforeContents: string;
  readonly category: AssembledChangeSet["files"][number]["category"];
  readonly path: string;
}

const FILE_CONTENT_READ_OPTIONS = Object.freeze({
  stderrLimitBytes: 64 * 1024,
  stdoutLimitBytes: 1024 * 1024,
  timeoutMs: 5_000,
});

const VERIFICATION_EXECUTION_OPTIONS = Object.freeze({
  stderrLimitBytes: 64 * 1024,
  stdoutLimitBytes: 64 * 1024,
  timeoutMs: 120_000,
});

async function readFileAtRevision(
  dependencies: CheckRepositoryDependencies,
  repositoryRoot: string,
  revision: string,
  relativePath: string,
): Promise<string> {
  const result = await dependencies.processRunner.run({
    command: {
      args: [
        "-C",
        repositoryRoot,
        "show",
        "--no-ext-diff",
        "--no-color",
        "--end-of-options",
        `${revision}:${relativePath}`,
      ],
      executable: "git",
    },
    cwd: repositoryRoot,
    ...FILE_CONTENT_READ_OPTIONS,
  });

  if (result.exitCode !== 0) {
    const detail = result.stderr.text.trim();
    throw new Error(
      `Unable to read ${relativePath} at ${revision}${detail.length > 0 ? `: ${detail}` : "."}`,
    );
  }

  return result.stdout.text;
}

async function readCurrentFile(
  fileSystem: CheckRepositoryDependencies["fileSystem"],
  repositoryRoot: string,
  relativePath: string,
  status: AssembledChangeSet["files"][number]["status"],
): Promise<string> {
  if (status === "deleted") {
    return "";
  }

  return fileSystem.readText(join(repositoryRoot, relativePath));
}

async function loadChangedFileSnapshots(
  check: CheckCommandSuccess,
  composition: DiffSentryComposition,
  changeSet: AssembledChangeSet,
): Promise<readonly ChangedFileSnapshot[]> {
  const beforeRevision =
    check.diffSelection.kind === "base-to-head"
      ? check.diffSelection.baseRef
      : "HEAD";
  const afterRevision =
    check.diffSelection.kind === "base-to-head"
      ? check.diffSelection.headRef
      : null;

  return Promise.all(
    changeSet.files.map(async (file) => {
      const beforeContents =
        file.status === "added" || file.status === "renamed"
          ? ""
          : await readFileAtRevision(
              composition.runtime,
              check.repositoryRoot,
              beforeRevision,
              file.path,
            );
      const afterContents =
        file.status === "deleted"
          ? ""
          : afterRevision === null
            ? await readCurrentFile(
                composition.runtime.fileSystem,
                check.repositoryRoot,
                file.path,
                file.status,
              )
            : await readFileAtRevision(
                composition.runtime,
                check.repositoryRoot,
                afterRevision,
                file.path,
              );

      return {
        afterContents,
        beforeContents,
        category: file.category,
        path: file.path,
      };
    }),
  );
}

function isEnabled(config: MergedDiffSentryConfig, ruleId: string): boolean {
  return config.rules[ruleId]?.enabled !== false;
}

async function executeBuiltInRules(
  changeSet: AssembledChangeSet,
  snapshots: readonly ChangedFileSnapshot[],
  config: MergedDiffSentryConfig,
) {
  const findings = [];

  if (isEnabled(config, workflowPermissionChangeRule.id)) {
    for (const snapshot of snapshots) {
      if (snapshot.category !== "ci") {
        continue;
      }

      findings.push(
        ...(await workflowPermissionChangeRule.run({
          afterContents: snapshot.afterContents,
          beforeContents: snapshot.beforeContents,
          workflowPath: snapshot.path,
        })),
      );
    }
  }

  if (isEnabled(config, runtimeDependencyAddedRule.id)) {
    for (const snapshot of snapshots) {
      if (
        !snapshot.path.replaceAll("\\", "/").endsWith("/package.json") &&
        snapshot.path !== "package.json"
      ) {
        continue;
      }

      findings.push(
        ...(await runtimeDependencyAddedRule.run({
          afterContents: snapshot.afterContents,
          beforeContents: snapshot.beforeContents,
          packagePath: snapshot.path,
        })),
      );
    }
  }

  if (isEnabled(config, secretExposureRule.id)) {
    findings.push(
      ...(await secretExposureRule.run({
        changedFiles: snapshots.map(({ afterContents, path }) => ({
          contents: afterContents,
          path,
        })),
      })),
    );
  }

  const changedFiles = changeSet.files.map(({ category, path }) => ({
    category,
    path,
  }));

  if (isEnabled(config, authWithoutTestsRule.id)) {
    findings.push(...(await authWithoutTestsRule.run({ files: changedFiles })));
  }

  if (isEnabled(config, sourceWithoutTestsRule.id)) {
    findings.push(
      ...(await sourceWithoutTestsRule.run({ files: changedFiles })),
    );
  }

  return applySeverityOverrides(findings, config.rules);
}

async function detectProject(
  composition: DiffSentryComposition,
  repositoryRoot: string,
) {
  const fileSystem = composition.runtime.fileSystem;
  if (!(await isNodeProjectCandidate(fileSystem, repositoryRoot))) {
    throw new CheckCommandProjectError(
      `No Node project package.json was found from ${repositoryRoot}.`,
    );
  }

  const packageManager = await detectPackageManager(fileSystem, repositoryRoot);
  const packageJsonPath = await fileSystem.findUp(
    repositoryRoot,
    "package.json",
  );
  const project = assembleProjectContext({
    hasPackageJson: packageJsonPath !== null,
    isTypeScriptProject: await isTypeScriptProject(fileSystem, repositoryRoot),
    packageManager,
    repositoryRoot,
  });

  if (project === null) {
    const candidates = packageManager.candidates.join(", ");
    throw new CheckCommandProjectError(
      candidates.length === 0
        ? "Could not determine a supported package manager."
        : `Could not resolve a single package manager from: ${candidates}.`,
    );
  }

  return project;
}

function mapVerificationResults(
  results: readonly Awaited<
    ReturnType<VerificationExecutionCoordinator["execute"]>
  >[number][],
) {
  return results.map((result) => ({
    command:
      result.command === null
        ? { args: [], executable: "" }
        : { args: result.command.args, executable: result.command.executable },
    durationMs: result.durationMs,
    exitCode: result.exitCode,
    id: result.id,
    status: result.status,
    stderr: result.stderr,
    stdout: result.stdout,
  }));
}

export async function runCheckPipeline(
  options: CheckCommandOptions = {},
): Promise<CheckPipelineOutcome> {
  const composition = await resolveComposition(options);
  const check = await runCheckCommand({
    ...(options.baseRef === undefined ? {} : { baseRef: options.baseRef }),
    ...(options.ci === undefined ? {} : { ci: options.ci }),
    ...(options.cwd === undefined ? {} : { cwd: options.cwd }),
    composition,
    ...(options.format === undefined ? {} : { format: options.format }),
    ...(options.headRef === undefined ? {} : { headRef: options.headRef }),
  });
  if (check.kind === "not-a-repository") {
    return { format: check.format, kind: "not-a-repository" };
  }

  const diffSelection = check.diffSelection;
  const changeSet = assembleChangeSet(
    check.diff,
    diffSelection.kind === "base-to-head" ? diffSelection.baseRef : "HEAD",
    diffSelection.kind === "base-to-head" ? diffSelection.headRef : "WORKTREE",
  );
  const project = await detectProject(composition, check.repositoryRoot);
  const scripts = await readKnownPackageScripts(
    composition.runtime.fileSystem,
    check.repositoryRoot,
  );

  if (scripts === null) {
    throw new CheckCommandProjectError(
      `No package.json scripts could be read from ${check.repositoryRoot}.`,
    );
  }

  const isTypeScript = project.languages.includes("typescript");
  const plan = planVerifications({
    isTypeScriptProject: isTypeScript,
    scripts,
    toggles: composition.config.verification,
  });
  const verifications = await new VerificationExecutionCoordinator(
    composition.runtime.processRunner,
    VERIFICATION_EXECUTION_OPTIONS,
  ).execute({
    packageManager: project.packageManager,
    plan,
    repositoryRoot: check.repositoryRoot,
  });
  const snapshots = await loadChangedFileSnapshots(
    check,
    composition,
    changeSet,
  );
  const findings = await executeBuiltInRules(
    changeSet,
    snapshots,
    composition.config,
  );
  const reportVerifications = mapVerificationResults(verifications);
  const riskScore = calculateRiskScore({
    findings,
    verifications,
  });
  const report: DiffSentryReport = composition.report.assemble({
    changes: changeSet,
    findings,
    project,
    riskScore,
    verifications: reportVerifications,
    verdict: calculateVerdict(riskScore, composition.config.thresholds),
    version: "0.1.0",
  });

  return { format: check.format, kind: "checked", report };
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
