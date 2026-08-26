export type RiskVerdict = "pass" | "review" | "fail";

export interface RiskThresholds {
  readonly review: number;
  readonly fail: number;
}

export const DEFAULT_RISK_THRESHOLDS: Readonly<RiskThresholds> = Object.freeze({
  fail: 50,
  review: 15,
});

export function validateRiskThresholds(thresholds: RiskThresholds): boolean {
  return (
    Number.isFinite(thresholds.review) &&
    Number.isFinite(thresholds.fail) &&
    0 <= thresholds.review &&
    thresholds.review < thresholds.fail &&
    thresholds.fail <= 100
  );
}

export function calculateVerdict(
  score: number,
  thresholds: RiskThresholds = DEFAULT_RISK_THRESHOLDS,
): RiskVerdict {
  if (!validateRiskThresholds(thresholds)) {
    throw new RangeError(
      "Risk thresholds must satisfy 0 <= review < fail <= 100",
    );
  }

  if (score < thresholds.review) {
    return "pass";
  }
  if (score < thresholds.fail) {
    return "review";
  }
  return "fail";
}
