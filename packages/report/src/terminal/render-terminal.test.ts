import type { DiffSentryReport } from "@felyx-fu/diffsentry-contracts";
import { describe, expect, it } from "vitest";
import { renderTerminalReport } from "./render-terminal.js";

const baseReport: DiffSentryReport = {
  changes: { baseRef: "HEAD~1", files: [], headRef: "HEAD" },
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

describe("renderTerminalReport", () => {
  it("renders a passing report", () => {
    expect(renderTerminalReport(baseReport)).toMatchInlineSnapshot(`
      "DiffSentry 0.1.0
      Verdict: PASS
      Risk score: 0/100
      Findings: 0
      Verifications: 0

      Findings: none

      Verifications: none"
    `);
  });

  it("renders a review report with findings, evidence, and verification", () => {
    expect(
      renderTerminalReport({
        ...baseReport,
        findings: [
          {
            confidence: 1,
            evidence: [
              {
                message: "Changed authentication source has no related test.",
                location: { path: "src/auth.ts", startLine: 12 },
              },
            ],
            location: { path: "src/auth.ts", startLine: 12 },
            message: "Authentication changed without a related test.",
            ruleId: "testing.auth-without-tests",
            severity: "high",
            title: "Missing related test",
          },
        ],
        riskScore: 45,
        verdict: "review",
        verifications: [
          {
            command: { args: ["run", "test"], executable: "pnpm" },
            durationMs: 10,
            exitCode: 0,
            id: "test",
            status: "passed",
            stderr: { text: "", truncated: false },
            stdout: { text: "passed", truncated: false },
          },
        ],
      }),
    ).toMatchInlineSnapshot(`
      "DiffSentry 0.1.0
      Verdict: REVIEW
      Risk score: 45/100
      Findings: 1
      Verifications: 1

      Findings:
      - [HIGH] Missing related test (testing.auth-without-tests)
        Authentication changed without a related test.
        Evidence: Changed authentication source has no related test. at src/auth.ts:12

      Verifications:
      - test: PASSED (pnpm run test)"
    `);
  });

  it("renders a failing report without changing the supplied score", () => {
    expect(
      renderTerminalReport({
        ...baseReport,
        findings: [
          {
            confidence: 0.5,
            evidence: [{ message: "Critical finding evidence." }],
            message: "A critical rule fired.",
            ruleId: "security.secret-exposure",
            severity: "critical",
            title: "Secret exposure",
          },
        ],
        riskScore: 100,
        verdict: "fail",
        verifications: [
          {
            command: { args: ["run", "test"], executable: "pnpm" },
            durationMs: 10,
            exitCode: 1,
            id: "test",
            status: "failed",
            stderr: { text: "failed", truncated: false },
            stdout: { text: "", truncated: false },
          },
        ],
      }),
    ).toMatchInlineSnapshot(`
      "DiffSentry 0.1.0
      Verdict: FAIL
      Risk score: 100/100
      Findings: 1
      Verifications: 1

      Findings:
      - [CRITICAL] Secret exposure (security.secret-exposure)
        A critical rule fired.
        Evidence: Critical finding evidence.

      Verifications:
      - test: FAILED (pnpm run test)"
    `);
  });
});
