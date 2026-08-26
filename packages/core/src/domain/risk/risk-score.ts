import { getSeverityWeight, type RiskSeverity } from "./severity-weight.js";
import {
  getVerificationPenalty,
  type VerificationPenaltyInput,
} from "./verification-penalty.js";

export interface RiskFindingInput {
  readonly severity: RiskSeverity;
  readonly confidence?: number;
}

export interface RiskScoreInput {
  readonly findings: readonly RiskFindingInput[];
  readonly verifications: readonly VerificationPenaltyInput[];
}

export function calculateFindingScore(
  findings: readonly RiskFindingInput[],
): number {
  return findings.reduce(
    (score, finding) => score + getSeverityWeight(finding.severity),
    0,
  );
}

export function calculateVerificationScore(
  verifications: readonly VerificationPenaltyInput[],
): number {
  return verifications.reduce(
    (score, verification) => score + getVerificationPenalty(verification),
    0,
  );
}

export function calculateRiskScore(input: RiskScoreInput): number {
  const rawRiskScore =
    calculateFindingScore(input.findings) +
    calculateVerificationScore(input.verifications);

  return Math.min(100, rawRiskScore);
}
