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

export interface AgentGuardReportPort {
  assemble(input: AgentGuardReportAssemblyInput): AssembledAgentGuardReport;
}

export interface AgentGuardCompositionOptions {
  readonly config?: ConfigLayer;
  readonly cli?: ConfigLayer;
  readonly runtime?: Partial<CheckRepositoryDependencies>;
  readonly report?: AgentGuardReportPort;
}

export interface AgentGuardComposition {
  readonly checker: CheckRepositoryUseCase;
  readonly config: MergedAgentGuardConfig;
  readonly report: AgentGuardReportPort;
  readonly rules: typeof BUILT_IN_RULES;
  readonly runtime: CheckRepositoryDependencies;
}

function createDefaultRuntime(): CheckRepositoryDependencies {
  return {
    clock: new SystemClock(),
    fileSystem: new NodeFileSystem(),
    gitProvider: new NodeGitProvider(),
    processRunner: new NodeProcessRunner(),
  };
}

const DEFAULT_REPORT: AgentGuardReportPort = {
  assemble: assembleAgentGuardReport,
};

export function createAgentGuard(
  options: AgentGuardCompositionOptions = {},
): AgentGuardComposition {
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
    config: mergeConfig(options.config, options.cli),
    report: options.report ?? DEFAULT_REPORT,
    rules: BUILT_IN_RULES,
    runtime,
  };
}
