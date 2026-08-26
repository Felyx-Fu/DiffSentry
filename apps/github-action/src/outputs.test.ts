import type { AssembledAgentGuardReport } from "@agentguard/core";
import { describe, expect, it } from "vitest";
import {
  GitHubActionOutputError,
  publishGitHubActionOutputs,
} from "./outputs.js";

function createReport(): AssembledAgentGuardReport {
  return {
    changes: { baseRef: "base-sha", files: [], headRef: "head-sha" },
    findings: [
      {
        confidence: 1,
        evidence: [
          {
            location: { path: "secret.ts", startLine: 1 },
            message: "The redacted evidence must not be an output.",
          },
        ],
        message: "The sensitive finding message must not be an output.",
        ruleId: "security.example",
        severity: "critical",
        title: "Sensitive finding",
      },
    ],
    project: {
      ecosystem: "node",
      frameworks: [],
      languages: ["typescript"],
      packageManager: "pnpm",
      repositoryRoot: "E:/fixture",
    },
    riskScore: 50,
    schemaVersion: 1,
    verdict: "fail",
    verifications: [],
    version: "0.1.0",
  };
}

describe("publishGitHubActionOutputs", () => {
  it("writes only the scalar risk score and verdict outputs", async () => {
    const writes: Array<{ path: string; contents: string }> = [];
    const result = await publishGitHubActionOutputs({
      appendText: async (path, contents) => {
        writes.push({ path, contents });
      },
      outputPath: "C:/fixture/github-output",
      result: { report: createReport() },
    });

    expect(result).toEqual({
      path: "C:/fixture/github-output",
      contents: "risk-score=50\nverdict=fail\n",
    });
    expect(writes).toEqual([result]);
    expect(result.contents).not.toContain("Sensitive");
    expect(result.contents).not.toContain("secret.ts");
  });

  it("rejects missing, unwritable, and invalid output contexts", async () => {
    await expect(
      publishGitHubActionOutputs({
        outputPath: "",
        result: { report: createReport() },
      }),
    ).rejects.toThrowError(new GitHubActionOutputError("missing-path"));

    await expect(
      publishGitHubActionOutputs({
        appendText: async () => {
          throw new Error("permission denied");
        },
        outputPath: "C:/fixture/github-output",
        result: { report: createReport() },
      }),
    ).rejects.toThrowError(new GitHubActionOutputError("write-failed"));

    await expect(
      publishGitHubActionOutputs({
        appendText: async () => undefined,
        outputPath: "C:/fixture/github-output",
        result: {
          report: { ...createReport(), riskScore: 101 },
        },
      }),
    ).rejects.toThrowError(new GitHubActionOutputError("invalid-result"));
  });
});
