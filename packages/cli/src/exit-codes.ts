import type { RiskVerdict } from "@agentguard/core";

export const CLI_EXIT_CODES = Object.freeze({
  pass: 0,
  review: 1,
  fail: 2,
  internalError: 3,
});

export interface CliVerdictOutcome {
  readonly kind: "verdict";
  readonly verdict: RiskVerdict;
}

export interface CliInternalErrorOutcome {
  readonly kind: "internal-error";
}

export type CliExitOutcome = CliInternalErrorOutcome | CliVerdictOutcome;

export function mapCliExitCode(outcome: CliExitOutcome): number {
  if (outcome.kind === "internal-error") {
    return CLI_EXIT_CODES.internalError;
  }

  return CLI_EXIT_CODES[outcome.verdict];
}
