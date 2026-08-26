import type { AssembledAgentGuardReport } from "@agentguard/core";
import { describe, expect, it } from "vitest";
import {
  GitHubStepSummaryError,
  publishGitHubStepSummary,
} from "./step-summary.js";

function createReport(): AssembledAgentGuardReport {
  return {
    changes: { baseRef: "base-sha", files: [], headRef: "head-sha" },
    findings: [
      {
        confidence: 1,
        evidence: [
          {
            location: { path: "src/example.ts", startLine: 4 },
            message: "Sensitive value was redacted.",
          },
        ],
        location: { path: "src/example.ts", startLine: 4 },
        message: "A high-signal finding was detected.",
        ruleId: "security.example",
        severity: "high",
        title: "Example finding",
      },
    ],
    project: {
      ecosystem: "node",
      frameworks: [],
      languages: ["typescript"],
      packageManager: "pnpm",
      repositoryRoot: "E:/fixture",
    },
    riskScore: 45,
    schemaVersion: 1,
    verdict: "review",
    verifications: [],
    version: "0.1.0",
  };
}

describe("publishGitHubStepSummary", () => {
  it("writes the shared Markdown report with verdict, findings, and evidence", async () => {
    const writes: Array<{ path: string; contents: string }> = [];
    const result = await publishGitHubStepSummary({
      appendText: async (path, contents) => {
        writes.push({ path, contents });
      },
      result: { report: createReport() },
      summaryPath: "C:/fixture/step-summary.md",
    });

    expect(result.path).toBe("C:/fixture/step-summary.md");
    expect(writes).toEqual([
      {
        path: "C:/fixture/step-summary.md",
        contents: expect.stringContaining(
          "## AgentGuard 0.1.0\n\n- **Verdict:** `REVIEW`\n- **Risk score:** `45/100`",
        ),
      },
    ]);
    expect(result.markdown).toContain("### Findings");
    expect(result.markdown).toContain("#### HIGH — Example finding");
    expect(result.markdown).toContain("Sensitive value was redacted.");
    expect(result.markdown).toContain("(src/example.ts:4)");
    expect(result.markdown.endsWith("\n")).toBe(true);
  });

  it("fails clearly when the step-summary path is unavailable or unwritable", async () => {
    await expect(
      publishGitHubStepSummary({
        result: { report: createReport() },
        summaryPath: "",
      }),
    ).rejects.toThrowError(new GitHubStepSummaryError("missing-path"));

    await expect(
      publishGitHubStepSummary({
        appendText: async () => {
          throw new Error("permission denied");
        },
        result: { report: createReport() },
        summaryPath: "C:/fixture/step-summary.md",
      }),
    ).rejects.toThrowError(new GitHubStepSummaryError("write-failed"));
  });
});
