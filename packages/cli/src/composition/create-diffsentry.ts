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

export interface DiffSentryReportPort {
  assemble(input: DiffSentryReportAssemblyInput): AssembledDiffSentryReport;
}

export interface DiffSentryCompositionOptions {
  readonly config?: ConfigLayer;
  readonly cli?: ConfigLayer;
  readonly runtime?: Partial<CheckRepositoryDependencies>;
  readonly report?: DiffSentryReportPort;
}

export interface DiffSentryComposition {
  readonly checker: CheckRepositoryUseCase;
  readonly config: MergedDiffSentryConfig;
  readonly report: DiffSentryReportPort;
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

const DEFAULT_REPORT: DiffSentryReportPort = {
  assemble: assembleDiffSentryReport,
};

export function createDiffSentry(
  options: DiffSentryCompositionOptions = {},
): DiffSentryComposition {
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
