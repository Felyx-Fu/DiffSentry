import type { ChangeSet } from "./change.js";
import type { Finding } from "./finding.js";
import type { ProjectContext } from "./project.js";
import type { Verdict } from "./verdict.js";
import type { VerificationResult } from "./verification.js";

export const REPORT_SCHEMA_VERSION = 1 as const;

export interface DiffSentryReport {
  readonly version: string;
  readonly project: ProjectContext;
  readonly changes: ChangeSet;
  readonly findings: readonly Finding[];
  readonly verifications: readonly VerificationResult[];
  readonly riskScore: number;
  readonly verdict: Verdict;
  readonly schemaVersion: typeof REPORT_SCHEMA_VERSION;
}
