import type { AssembledAgentGuardReport } from "@agentguard/core";
import { describe, expect, it } from "vitest";
import { publishGitHubAnnotations } from "./annotations.js";
import { runGitHubActionCheck } from "./check.js";
import { createGitHubActionComposition } from "./composition.js";
import { readGitHubEventContext } from "./event-context.js";
import { publishGitHubActionOutputs } from "./outputs.js";
import { resolveBaseSha, resolveHeadSha } from "./revisions.js";
import { resolveGitHubActionStatus } from "./status-behavior.js";
import { publishGitHubStepSummary } from "./step-summary.js";

function createPullRequestReport(): AssembledAgentGuardReport {
  return {
    changes: {
      baseRef: "1111111111111111111111111111111111111111",
      files: [],
      headRef: "2222222222222222222222222222222222222222",
    },
    findings: [
      {
        confidence: 1,
        evidence: [
          {
            location: { path: "src/guarded.ts", startLine: 5 },
            message: "Redacted evidence",
          },
        ],
        location: { path: "src/guarded.ts", startLine: 5 },
        message: "A deterministic fixture finding.",
        ruleId: "security.fixture",
        severity: "high",
        title: "Fixture finding",
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

describe("GitHub Action representative pull-request integration", () => {
  it("passes deterministic event, composition, report, summary, outputs, status, and annotation data", async () => {
    const eventContext = await readGitHubEventContext({
      eventName: "pull_request",
      eventPath: "C:/fixture/pull-request.json",
      readText: async () =>
        JSON.stringify({
          pull_request: {
            base: {
              ref: "main",
              sha: "1111111111111111111111111111111111111111",
            },
            head: {
              ref: "feature/guard",
              sha: "2222222222222222222222222222222222222222",
            },
          },
        }),
    });
    const composition = createGitHubActionComposition({
      context: eventContext,
    });
    const report = createPullRequestReport();
    const checkResult = await runGitHubActionCheck({
      check: {
        execute: async (input) => {
          expect(input.baseSha).toBe(resolveBaseSha(eventContext));
          expect(input.headSha).toBe(resolveHeadSha(eventContext));
          expect(input.checker).toBe(composition.checker);
          return { report };
        },
      },
      composition,
    });

    const summaryWrites: string[] = [];
    const summary = await publishGitHubStepSummary({
      appendText: async (_path, contents) => {
        summaryWrites.push(contents);
      },
      result: checkResult,
      summaryPath: "C:/fixture/step-summary.md",
    });
    const outputWrites: string[] = [];
    const outputs = await publishGitHubActionOutputs({
      appendText: async (_path, contents) => {
        outputWrites.push(contents);
      },
      outputPath: "C:/fixture/github-output",
      result: checkResult,
    });
    const status = resolveGitHubActionStatus(checkResult, "review");
    const annotationLines: string[] = [];
    const annotations = publishGitHubAnnotations({
      report,
      writeLine: (line) => annotationLines.push(line),
    });

    expect(checkResult.report).toBe(report);
    expect(summary.markdown).toContain("**Verdict:** `REVIEW`");
    expect(summary.markdown).toContain("src/guarded.ts:5");
    expect(summaryWrites).toEqual([summary.markdown]);
    expect(outputs.contents).toBe("risk-score=45\nverdict=review\n");
    expect(outputWrites).toEqual([outputs.contents]);
    expect(status).toEqual({
      failOn: "review",
      status: "failure",
      verdict: "review",
    });
    expect(annotations).toHaveLength(1);
    expect(annotationLines).toEqual(annotations);
    expect(annotationLines[0]).toContain("::error");
  });
});
