import {
  type ConfigLayer,
  type MergedAgentGuardConfig,
  mergeConfig,
} from "@agentguard/config";
import {
  type AgentGuardReportAssemblyInput,
  type AssembledAgentGuardReport,
  assembleAgentGuardReport,
  type CheckRepositoryDependencies,
  CheckRepositoryUseCase,
} from "@agentguard/core";
import { BUILT_IN_RULES } from "@agentguard/rules";
import {
  NodeFileSystem,
  NodeGitProvider,
  NodeProcessRunner,
  SystemClock,
} from "@agentguard/runtime-node";
import type { GitHubEventContext } from "./event-context.js";
import { resolveBaseSha, resolveHeadSha } from "./revisions.js";

export interface GitHubActionReportPort {
  assemble(input: AgentGuardReportAssemblyInput): AssembledAgentGuardReport;
}

export interface GitHubActionCompositionOptions {
  readonly context: GitHubEventContext;
  readonly config?: ConfigLayer;
  readonly runtime?: Partial<CheckRepositoryDependencies>;
  readonly report?: GitHubActionReportPort;
}

export interface GitHubActionComposition {
  readonly checker: CheckRepositoryUseCase;
  readonly config: MergedAgentGuardConfig;
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
  assemble: assembleAgentGuardReport,
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
