import type { GitHubActionCheckResult } from "./check.js";

export const ACTION_FAIL_ON_VALUES = ["fail", "review", "never"] as const;
export type ActionFailOn = (typeof ACTION_FAIL_ON_VALUES)[number];
export type ActionVerdict = GitHubActionCheckResult["report"]["verdict"];
export type GitHubActionStatus = "success" | "failure";

export class GitHubActionFailOnError extends Error {
  readonly code = "invalid-fail-on" as const;
  readonly value: string;

  constructor(value: string) {
    super(
      `Unsupported fail-on value "${value}". Expected fail, review, or never.`,
    );
    this.name = "GitHubActionFailOnError";
    this.value = value;
  }
}

export interface GitHubActionStatusDecision {
  readonly failOn: ActionFailOn;
  readonly status: GitHubActionStatus;
  readonly verdict: ActionVerdict;
}

export function parseActionFailOn(value: string | undefined): ActionFailOn {
  if (value === undefined) {
    return "fail";
  }

  if ((ACTION_FAIL_ON_VALUES as readonly string[]).includes(value)) {
    return value as ActionFailOn;
  }

  throw new GitHubActionFailOnError(value);
}

export function mapGitHubActionStatus(
  verdict: ActionVerdict,
  failOn: ActionFailOn = "fail",
): GitHubActionStatusDecision {
  const shouldFail =
    failOn === "review"
      ? verdict === "review" || verdict === "fail"
      : failOn === "fail"
        ? verdict === "fail"
        : false;

  return {
    failOn,
    status: shouldFail ? "failure" : "success",
    verdict,
  };
}

export function resolveGitHubActionStatus(
  result: GitHubActionCheckResult,
  failOnValue?: string,
): GitHubActionStatusDecision {
  return mapGitHubActionStatus(
    result.report.verdict,
    parseActionFailOn(failOnValue),
  );
}
