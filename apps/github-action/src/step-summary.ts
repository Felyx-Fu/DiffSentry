import { appendFile } from "node:fs/promises";
import { renderMarkdownReport } from "@agentguard/report";
import type { GitHubActionCheckResult } from "./check.js";

export type GitHubStepSummaryErrorCode = "missing-path" | "write-failed";

const ERROR_MESSAGES: Readonly<Record<GitHubStepSummaryErrorCode, string>> = {
  "missing-path": "GITHUB_STEP_SUMMARY is required to publish a report",
  "write-failed": "The AgentGuard Markdown summary could not be written",
};

export class GitHubStepSummaryError extends Error {
  readonly code: GitHubStepSummaryErrorCode;

  constructor(code: GitHubStepSummaryErrorCode) {
    super(ERROR_MESSAGES[code]);
    this.name = "GitHubStepSummaryError";
    this.code = code;
  }
}

export interface PublishGitHubStepSummaryOptions {
  readonly result: GitHubActionCheckResult;
  readonly summaryPath?: string;
  readonly appendText?: (path: string, contents: string) => Promise<void>;
}

export interface GitHubStepSummaryPublication {
  readonly path: string;
  readonly markdown: string;
}

async function appendSummaryFile(
  path: string,
  contents: string,
): Promise<void> {
  await appendFile(path, contents, { encoding: "utf8" });
}

export async function publishGitHubStepSummary(
  options: PublishGitHubStepSummaryOptions,
): Promise<GitHubStepSummaryPublication> {
  const path = options.summaryPath ?? process.env.GITHUB_STEP_SUMMARY;
  if (path === undefined || path.length === 0) {
    throw new GitHubStepSummaryError("missing-path");
  }

  const markdown = `${renderMarkdownReport(options.result.report)}\n`;
  try {
    await (options.appendText ?? appendSummaryFile)(path, markdown);
  } catch {
    throw new GitHubStepSummaryError("write-failed");
  }

  return { path, markdown };
}
