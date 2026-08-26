export type RiskSeverity = "info" | "low" | "medium" | "high" | "critical";

/** Fixed DiffSentry v0.1 severity weights; configuration cannot override them here. */
export const SEVERITY_WEIGHTS: Readonly<Record<RiskSeverity, number>> =
  Object.freeze({
    critical: 50,
    high: 30,
    info: 0,
    low: 5,
    medium: 15,
  });

export function getSeverityWeight(severity: RiskSeverity): number {
  return SEVERITY_WEIGHTS[severity];
}
