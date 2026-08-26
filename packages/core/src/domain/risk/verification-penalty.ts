import type { VerificationIntentId } from "../verification/verification-planner.js";

export type RiskVerificationStatus = "passed" | "failed" | "skipped" | "error";

export interface VerificationPenaltyInput {
  readonly id: VerificationIntentId;
  readonly status: RiskVerificationStatus;
}

export const VERIFICATION_PENALTIES: Readonly<
  Record<VerificationIntentId, Readonly<Record<RiskVerificationStatus, number>>>
> = Object.freeze({
  build: Object.freeze({ error: 30, failed: 50, passed: 0, skipped: 0 }),
  lint: Object.freeze({ error: 10, failed: 15, passed: 0, skipped: 0 }),
  test: Object.freeze({ error: 30, failed: 50, passed: 0, skipped: 0 }),
  typecheck: Object.freeze({
    error: 30,
    failed: 50,
    passed: 0,
    skipped: 0,
  }),
});

export function getVerificationPenalty(
  verification: VerificationPenaltyInput,
): number {
  return VERIFICATION_PENALTIES[verification.id][verification.status];
}
