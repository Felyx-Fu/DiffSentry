import { appendFile } from "node:fs/promises";
import type { GitHubActionCheckResult } from "./check.js";

export type GitHubActionOutputErrorCode =
  | "missing-path"
  | "invalid-result"
  | "write-failed";

const ERROR_MESSAGES: Readonly<Record<GitHubActionOutputErrorCode, string>> = {
  "missing-path": "GITHUB_OUTPUT is required to publish DiffSentry outputs",
  "invalid-result": "The DiffSentry report contains invalid scalar outputs",
  "write-failed": "DiffSentry action outputs could not be written",
};

export class GitHubActionOutputError extends Error {
  readonly code: GitHubActionOutputErrorCode;

  constructor(code: GitHubActionOutputErrorCode) {
    super(ERROR_MESSAGES[code]);
    this.name = "GitHubActionOutputError";
    this.code = code;
  }
}

export interface PublishGitHubActionOutputsOptions {
  readonly result: GitHubActionCheckResult;
  readonly outputPath?: string;
  readonly appendText?: (path: string, contents: string) => Promise<void>;
}

export interface GitHubActionOutputsPublication {
  readonly path: string;
  readonly contents: string;
}

async function appendOutputFile(path: string, contents: string): Promise<void> {
  await appendFile(path, contents, { encoding: "utf8" });
}

function createOutputContents(result: GitHubActionCheckResult): string {
  const { report } = result;
  if (
    !Number.isFinite(report.riskScore) ||
    report.riskScore < 0 ||
    report.riskScore > 100 ||
    !["pass", "review", "fail"].includes(report.verdict)
  ) {
    throw new GitHubActionOutputError("invalid-result");
  }

  return `risk-score=${report.riskScore}\nverdict=${report.verdict}\n`;
}

export async function publishGitHubActionOutputs(
  options: PublishGitHubActionOutputsOptions,
): Promise<GitHubActionOutputsPublication> {
  const path = options.outputPath ?? process.env.GITHUB_OUTPUT;
  if (path === undefined || path.length === 0) {
    throw new GitHubActionOutputError("missing-path");
  }

  const contents = createOutputContents(options.result);
  try {
    await (options.appendText ?? appendOutputFile)(path, contents);
  } catch {
    throw new GitHubActionOutputError("write-failed");
  }

  return { path, contents };
}
