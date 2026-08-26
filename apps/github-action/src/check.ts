import type {
  AssembledDiffSentryReport,
  CheckRepositoryUseCase,
} from "@felyx-fu/diffsentry-core";
import type { GitHubActionComposition } from "./composition.js";

export interface GitHubActionCheckInput {
  readonly checker: CheckRepositoryUseCase;
  readonly config: GitHubActionComposition["config"];
  readonly report: GitHubActionComposition["report"];
  readonly rules: GitHubActionComposition["rules"];
  readonly runtime: GitHubActionComposition["runtime"];
  readonly baseSha: string;
  readonly headSha: string;
}

export interface GitHubActionCheckResult {
  readonly report: AssembledDiffSentryReport;
}

export interface GitHubActionCheckPort {
  execute(input: GitHubActionCheckInput): Promise<GitHubActionCheckResult>;
}

export interface RunGitHubActionCheckOptions {
  readonly composition: GitHubActionComposition;
  readonly check: GitHubActionCheckPort;
}

/**
 * Delegates execution to the shared core pipeline and returns its structured
 * report. The Action adapter does not render, score, or execute commands.
 */
export async function runGitHubActionCheck(
  options: RunGitHubActionCheckOptions,
): Promise<GitHubActionCheckResult> {
  const { composition } = options;
  return options.check.execute({
    checker: composition.checker,
    config: composition.config,
    report: composition.report,
    rules: composition.rules,
    runtime: composition.runtime,
    baseSha: composition.baseSha,
    headSha: composition.headSha,
  });
}
