import { describe, expect, it } from "vitest";
import {
  calculateFindingScore,
  calculateRiskScore,
  calculateVerificationScore,
} from "./risk-score.js";

describe("risk score aggregation", () => {
  it("sums finding severity weights and ignores finding confidence", () => {
    expect(
      calculateFindingScore([
        { confidence: 0.1, severity: "high" },
        { confidence: 0.99, severity: "medium" },
      ]),
    ).toBe(45);
  });

  it("sums verification penalties separately from finding scores", () => {
    expect(
      calculateVerificationScore([
        { id: "test", status: "failed" },
        { id: "lint", status: "error" },
        { id: "build", status: "skipped" },
      ]),
    ).toBe(60);
  });

  it("returns zero for empty evidence and verification inputs", () => {
    expect(calculateRiskScore({ findings: [], verifications: [] })).toBe(0);
  });

  it("caps the raw risk score at 100", () => {
    expect(
      calculateRiskScore({
        findings: [
          { confidence: 1, severity: "critical" },
          { confidence: 1, severity: "critical" },
          { confidence: 1, severity: "critical" },
        ],
        verifications: [],
      }),
    ).toBe(100);
  });

  it("does not add any confidence or category multiplier", () => {
    expect(
      calculateRiskScore({
        findings: [
          { confidence: 0, severity: "low" },
          { confidence: 1, severity: "low" },
        ],
        verifications: [],
      }),
    ).toBe(10);
  });
});
