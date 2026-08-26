import { describe, expect, it } from "vitest";
import { assembleDiffSentryReport } from "../../../packages/core/src/application/report-assembler.js";
import { calculateRiskScore } from "../../../packages/core/src/domain/risk/risk-score.js";
import { calculateVerdict } from "../../../packages/core/src/domain/risk/verdict-thresholds.js";

describe("core pipeline with placeholder rules", () => {
  it("assembles a passing report when no rules produce findings", () => {
    const riskScore = calculateRiskScore({ findings: [], verifications: [] });
    const verdict = calculateVerdict(riskScore);
    const report = assembleDiffSentryReport({
      changes: { baseRef: "HEAD", files: [], headRef: "WORKTREE" },
      findings: [],
      project: {
        ecosystem: "node",
        frameworks: [],
        languages: ["typescript"],
        packageManager: "pnpm",
        repositoryRoot: "/repository",
      },
      riskScore,
      verdict,
      verifications: [],
      version: "0.1.0",
    });

    expect(report).toMatchObject({
      findings: [],
      riskScore: 0,
      schemaVersion: 1,
      verifications: [],
      verdict: "pass",
    });
  });
});
