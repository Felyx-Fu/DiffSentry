import type { Evidence, EvidenceLocation } from "./evidence.js";

export type Severity = "info" | "low" | "medium" | "high" | "critical";

export interface Finding {
  readonly ruleId: string;
  readonly severity: Severity;
  readonly title: string;
  readonly message: string;
  readonly evidence: readonly Evidence[];
  readonly confidence: number;
  readonly location?: EvidenceLocation;
}
