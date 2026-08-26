import type { Severity } from "./finding.js";

export interface VerificationToggles {
  readonly test?: boolean;
  readonly lint?: boolean;
  readonly typecheck?: boolean;
  readonly build?: boolean;
}

export interface RuleOverride {
  readonly enabled?: boolean;
  readonly severity?: Severity;
}

export type RuleOverrides = Readonly<Record<string, RuleOverride>>;

export interface RiskThresholds {
  readonly review: number;
  readonly fail: number;
}

export interface AgentGuardConfig {
  readonly verification?: VerificationToggles;
  readonly rules?: RuleOverrides;
  readonly thresholds?: RiskThresholds;
}
