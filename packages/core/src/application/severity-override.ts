import type { RiskSeverity } from "../domain/risk/severity-weight.js";

export interface RuleSeverityOverride {
  readonly severity?: RiskSeverity;
}

export type RuleSeverityOverrides = Readonly<
  Record<string, RuleSeverityOverride>
>;

export interface SeverityBearingFinding {
  readonly ruleId: string;
  readonly severity: RiskSeverity;
}

export function applySeverityOverrides<TFinding extends SeverityBearingFinding>(
  findings: readonly TFinding[],
  overrides: RuleSeverityOverrides = {},
): readonly TFinding[] {
  return findings.map((finding) => {
    const override = overrides[finding.ruleId]?.severity;
    return override === undefined
      ? finding
      : { ...finding, severity: override };
  });
}
