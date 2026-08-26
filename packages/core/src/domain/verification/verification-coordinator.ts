import type {
  ProcessRequest,
  ProcessResult,
  ProcessRunner,
} from "../../ports/process-runner.js";
import type { SupportedPackageManager } from "../project/package-manager-resolution.js";
import {
  type ResolvedVerificationCommand,
  resolveVerificationCommand,
} from "./command-resolver.js";
import type {
  PlannedVerification,
  VerificationIntentId,
} from "./verification-planner.js";

export type VerificationExecutionStatus =
  | "passed"
  | "failed"
  | "skipped"
  | "error";

export interface VerificationOutputSummary {
  readonly text: string;
  readonly truncated: boolean;
}

export interface VerificationExecutionResult {
  readonly id: VerificationIntentId;
  readonly status: VerificationExecutionStatus;
  readonly command: ResolvedVerificationCommand | null;
  readonly durationMs: number;
  readonly exitCode: number | null;
  readonly stdout: VerificationOutputSummary;
  readonly stderr: VerificationOutputSummary;
}

export interface VerificationExecutionOptions {
  readonly timeoutMs: number;
  readonly stdoutLimitBytes: number;
  readonly stderrLimitBytes: number;
}

export interface VerificationExecutionRequest {
  readonly repositoryRoot: string;
  readonly packageManager: SupportedPackageManager;
  readonly plan: readonly PlannedVerification[];
}

const EMPTY_OUTPUT: VerificationOutputSummary = {
  text: "",
  truncated: false,
};

function createProcessRequest(
  repositoryRoot: string,
  command: ResolvedVerificationCommand,
  options: VerificationExecutionOptions,
): ProcessRequest {
  return {
    command: {
      executable: command.executable,
      args: command.args,
    },
    cwd: repositoryRoot,
    timeoutMs: options.timeoutMs,
    stdoutLimitBytes: options.stdoutLimitBytes,
    stderrLimitBytes: options.stderrLimitBytes,
  };
}

function toVerificationResult(
  plannedVerification: PlannedVerification,
  command: ResolvedVerificationCommand,
  processResult: ProcessResult,
): VerificationExecutionResult {
  return {
    id: plannedVerification.id,
    status: processResult.exitCode === 0 ? "passed" : "failed",
    command,
    durationMs: processResult.durationMs,
    exitCode: processResult.exitCode,
    stdout: processResult.stdout,
    stderr: processResult.stderr,
  };
}

export class VerificationExecutionCoordinator {
  constructor(
    private readonly processRunner: ProcessRunner,
    private readonly options: VerificationExecutionOptions,
  ) {}

  async execute(
    request: VerificationExecutionRequest,
  ): Promise<readonly VerificationExecutionResult[]> {
    const results: VerificationExecutionResult[] = [];

    for (const plannedVerification of request.plan) {
      const command = resolveVerificationCommand(
        request.packageManager,
        plannedVerification,
      );

      if (command === null) {
        results.push({
          id: plannedVerification.id,
          status: "skipped",
          command: null,
          durationMs: 0,
          exitCode: null,
          stdout: EMPTY_OUTPUT,
          stderr: EMPTY_OUTPUT,
        });
        continue;
      }

      try {
        const processResult = await this.processRunner.run(
          createProcessRequest(request.repositoryRoot, command, this.options),
        );
        results.push(
          toVerificationResult(plannedVerification, command, processResult),
        );
      } catch {
        results.push({
          id: plannedVerification.id,
          status: "error",
          command,
          durationMs: 0,
          exitCode: null,
          stdout: EMPTY_OUTPUT,
          stderr: EMPTY_OUTPUT,
        });
      }
    }

    return results;
  }
}
