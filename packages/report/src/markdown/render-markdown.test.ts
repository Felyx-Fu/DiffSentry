import type { DiffSentryReport } from "@felyx-fu/diffsentry-contracts";
import { describe, expect, it } from "vitest";
import { renderMarkdownReport } from "./render-markdown.js";

const baseReport: DiffSentryReport = {
  changes: { baseRef: "main", files: [], headRef: "feature" },
  findings: [],
  project: {
    ecosystem: "node",
    frameworks: [],
    languages: ["typescript"],
    packageManager: "pnpm",
    repositoryRoot: "E:/workspace",
  },
  riskScore: 0,
  schemaVersion: 1,
  verdict: "pass",
  verifications: [],
  version: "0.1.0",
};

describe("renderMarkdownReport", () => {
  it("renders an empty report for a passing result", () => {
    expect(renderMarkdownReport(baseReport)).toMatchInlineSnapshot(`
      "## DiffSentry 0.1.0

      - **Verdict:** \`PASS\`
      - **Risk score:** \`0/100\`
      - **Findings:** 0
      - **Verifications:** 0

      ### Findings

      No findings.

      ### Verifications

      No verifications."
    `);
  });

  it("renders findings, evidence, and verification details", () => {
    expect(
      renderMarkdownReport({
        ...baseReport,
        findings: [
          {
            confidence: 0.9,
            evidence: [
              {
                message: "Changed source has no related test.",
                location: {
                  path: "src/auth.ts",
                  startLine: 10,
                  startColumn: 2,
                },
              },
            ],
            message: "Authentication changed without a related test.",
            ruleId: "testing.auth-without-tests",
            severity: "high",
            title: "Missing related test",
          },
        ],
        riskScore: 30,
        verdict: "review",
        verifications: [
          {
            command: { args: ["run", "test"], executable: "pnpm" },
            durationMs: 5,
            exitCode: 0,
            id: "test",
            status: "passed",
            stderr: { text: "", truncated: false },
            stdout: { text: "passed", truncated: false },
          },
        ],
      }),
    ).toMatchInlineSnapshot(`
      "## DiffSentry 0.1.0

      - **Verdict:** \`REVIEW\`
      - **Risk score:** \`30/100\`
      - **Findings:** 1
      - **Verifications:** 1

      ### Findings

      #### HIGH — Missing related test

      Rule: \`testing.auth-without-tests\`

      Authentication changed without a related test.

      Evidence:
      - Changed source has no related test. (src/auth.ts:10:2)

      ### Verifications

      - \`test\`: **PASSED** — \`pnpm run test\`"
    `);
  });
});
