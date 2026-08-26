import type { AssembledChangeSet } from "../domain/change/change-set.js";
import type { SupportedPackageManager } from "../domain/project/package-manager-resolution.js";
import type { RiskSeverity } from "../domain/risk/severity-weight.js";
import type { RiskVerdict } from "../domain/risk/verdict-thresholds.js";
import type { RiskVerificationStatus } from "../domain/risk/verification-penalty.js";

export const REPORT_SCHEMA_VERSION = 1 as const;

export interface ReportProjectContext {
  readonly repositoryRoot: string;
  readonly ecosystem: "node" | "unknown";
  readonly packageManager: SupportedPackageManager;
  readonly languages: readonly string[];
  readonly frameworks: readonly string[];
}

export interface ReportEvidenceLocation {
  readonly path: string;
  readonly startLine?: number;
  readonly startColumn?: number;
  readonly endLine?: number;
  readonly endColumn?: number;
}

export interface ReportEvidence {
  readonly message: string;
  readonly location?: ReportEvidenceLocation;
}

export interface ReportFinding {
  readonly ruleId: string;
  readonly severity: RiskSeverity;
  readonly title: string;
  readonly message: string;
  readonly evidence: readonly ReportEvidence[];
  readonly confidence: number;
  readonly location?: ReportEvidenceLocation;
}

export interface ReportVerificationCommand {
  readonly executable: string;
  readonly args: readonly string[];
}

export interface ReportVerificationOutputSummary {
  readonly text: string;
  readonly truncated: boolean;
}

export interface ReportVerification {
  readonly id: string;
  readonly status: RiskVerificationStatus;
  readonly command: ReportVerificationCommand;
  readonly durationMs: number;
  readonly exitCode: number | null;
  readonly stdout: ReportVerificationOutputSummary;
  readonly stderr: ReportVerificationOutputSummary;
}

export interface DiffSentryReportAssemblyInput {
  readonly version: string;
  readonly project: ReportProjectContext;
  readonly changes: AssembledChangeSet;
  readonly findings: readonly ReportFinding[];
  readonly verifications: readonly ReportVerification[];
  readonly riskScore: number;
  readonly verdict: RiskVerdict;
}

export interface AssembledDiffSentryReport
  extends DiffSentryReportAssemblyInput {
  readonly schemaVersion: typeof REPORT_SCHEMA_VERSION;
}

export function assembleDiffSentryReport(
  input: DiffSentryReportAssemblyInput,
): AssembledDiffSentryReport {
  return {
    ...input,
    schemaVersion: REPORT_SCHEMA_VERSION,
  };
}
