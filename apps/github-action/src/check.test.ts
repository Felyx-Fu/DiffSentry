import type {
  AssembledDiffSentryReport,
  DiffSentryReportAssemblyInput,
} from "@felyx-fu/diffsentry-core";
import { describe, expect, it } from "vitest";
import { type GitHubActionCheckInput, runGitHubActionCheck } from "./check.js";
import { createGitHubActionComposition } from "./composition.js";
import { parseGitHubEventContext } from "./event-context.js";

function createReport(): AssembledDiffSentryReport {
  const input: DiffSentryReportAssemblyInput = {
    changes: { baseRef: "base-sha", files: [], headRef: "head-sha" },
    findings: [],
    project: {
      ecosystem: "unknown",
      frameworks: [],
      languages: [],
      packageManager: "pnpm",
      repositoryRoot: "E:/fixture",
    },
    riskScore: 45,
    verdict: "review",
    verifications: [],
    version: "0.1.0",
  };

  return { ...input, schemaVersion: 1 };
}

describe("runGitHubActionCheck", () => {
  it("passes the composed core inputs to the check port and returns its report", async () => {
    const context = parseGitHubEventContext("pull_request", {
      pull_request: {
        base: { ref: "main", sha: "base-sha" },
        head: { ref: "feature", sha: "head-sha" },
      },
    });
    const composition = createGitHubActionComposition({ context });
    let received: GitHubActionCheckInput | undefined;

    const result = await runGitHubActionCheck({
      check: {
        execute: async (input) => {
          received = input;
          return { report: createReport() };
        },
      },
      composition,
    });

    expect(received).toMatchObject({
      baseSha: "base-sha",
      headSha: "head-sha",
      checker: composition.checker,
      config: composition.config,
      report: composition.report,
      rules: composition.rules,
      runtime: composition.runtime,
    });
    expect(result.report).toEqual(createReport());
    expect(result.report.verdict).toBe("review");
    expect(result.report.riskScore).toBe(45);
  });

  it("propagates an internal check-port error without converting it into a verdict", async () => {
    const context = parseGitHubEventContext("push", {
      ref: "refs/heads/main",
      before: "before-sha",
      after: "after-sha",
    });
    const composition = createGitHubActionComposition({ context });
    const internalError = new Error("core pipeline unavailable");

    await expect(
      runGitHubActionCheck({
        check: {
          execute: async () => {
            throw internalError;
          },
        },
        composition,
      }),
    ).rejects.toBe(internalError);
  });
});
