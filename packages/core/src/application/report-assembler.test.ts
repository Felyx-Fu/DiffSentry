import { describe, expect, it } from "vitest";
import {
  assembleDiffSentryReport,
  type DiffSentryReportAssemblyInput,
  REPORT_SCHEMA_VERSION,
} from "./report-assembler.js";

const input: DiffSentryReportAssemblyInput = {
  changes: {
    baseRef: "base",
    files: [
      {
        additions: 2,
        category: "source",
        deletions: 1,
        path: "src/auth.ts",
        status: "modified",
      },
    ],
    headRef: "head",
  },
  findings: [
    {
      confidence: 0.9,
      evidence: [{ message: "source changed" }],
      location: { path: "src/auth.ts", startLine: 10 },
      message: "Authentication changed without a related test.",
      ruleId: "testing.auth-without-tests",
      severity: "high",
      title: "Missing related test",
    },
  ],
  project: {
    ecosystem: "node",
    frameworks: [],
    languages: ["typescript"],
    packageManager: "pnpm",
    repositoryRoot: "/repository",
  },
  riskScore: 30,
  verdict: "review",
  verifications: [
    {
      command: { args: ["run", "test"], executable: "pnpm" },
      durationMs: 20,
      exitCode: 0,
      id: "test",
      status: "passed",
      stderr: { text: "", truncated: false },
      stdout: { text: "passed", truncated: false },
    },
  ],
  version: "0.1.0",
};

describe("assembleDiffSentryReport", () => {
  it("assembles the complete schema-versioned report without rendering", () => {
    expect(assembleDiffSentryReport(input)).toEqual({
      ...input,
      schemaVersion: REPORT_SCHEMA_VERSION,
    });
  });

  it("preserves empty findings and verifications as complete report fields", () => {
    const emptyInput: DiffSentryReportAssemblyInput = {
      ...input,
      findings: [],
      riskScore: 0,
      verdict: "pass",
      verifications: [],
    };

    expect(assembleDiffSentryReport(emptyInput)).toMatchObject({
      findings: [],
      riskScore: 0,
      schemaVersion: 1,
      verifications: [],
      verdict: "pass",
    });
  });
});
