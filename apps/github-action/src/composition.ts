import {
  type ConfigLayer,
  type MergedDiffSentryConfig,
  mergeConfig,
} from "@felyx-fu/diffsentry-config";
import {
  type AssembledDiffSentryReport,
  assembleDiffSentryReport,
  type CheckRepositoryDependencies,
  CheckRepositoryUseCase,
  type DiffSentryReportAssemblyInput,
} from "@felyx-fu/diffsentry-core";
import { BUILT_IN_RULES } from "@felyx-fu/diffsentry-rules";
import {
  NodeFileSystem,
  NodeGitProvider,
  NodeProcessRunner,
  SystemClock,
} from "@felyx-fu/diffsentry-runtime-node";
import type { GitHubEventContext } from "./event-context.js";
import { resolveBaseSha, resolveHeadSha } from "./revisions.js";

export interface GitHubActionReportPort {
  assemble(input: DiffSentryReportAssemblyInput): AssembledDiffSentryReport;
}

export interface GitHubActionCompositionOptions {
  readonly context: GitHubEventContext;
  readonly config?: ConfigLayer;
  readonly runtime?: Partial<CheckRepositoryDependencies>;
  readonly report?: GitHubActionReportPort;
}

export interface GitHubActionComposition {
  readonly checker: CheckRepositoryUseCase;
  readonly config: MergedDiffSentryConfig;
  readonly report: GitHubActionReportPort;
  readonly rules: typeof BUILT_IN_RULES;
  readonly runtime: CheckRepositoryDependencies;
  readonly baseSha: string;
  readonly headSha: string;
}

function createDefaultRuntime(): CheckRepositoryDependencies {
  return {
    clock: new SystemClock(),
    fileSystem: new NodeFileSystem(),
    gitProvider: new NodeGitProvider(),
    processRunner: new NodeProcessRunner(),
  };
}

const DEFAULT_REPORT: GitHubActionReportPort = {
  assemble: assembleDiffSentryReport,
};

export function createGitHubActionComposition(
  options: GitHubActionCompositionOptions,
): GitHubActionComposition {
  const defaultRuntime = createDefaultRuntime();
  const runtime: CheckRepositoryDependencies = {
    clock: options.runtime?.clock ?? defaultRuntime.clock,
    fileSystem: options.runtime?.fileSystem ?? defaultRuntime.fileSystem,
    gitProvider: options.runtime?.gitProvider ?? defaultRuntime.gitProvider,
    processRunner:
      options.runtime?.processRunner ?? defaultRuntime.processRunner,
  };

  return {
    checker: new CheckRepositoryUseCase(runtime),
    config: mergeConfig(options.config),
    report: options.report ?? DEFAULT_REPORT,
    rules: BUILT_IN_RULES,
    runtime,
    baseSha: resolveBaseSha(options.context),
    headSha: resolveHeadSha(options.context),
  };
}
