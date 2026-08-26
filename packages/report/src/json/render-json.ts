import type { DiffSentryReport } from "@felyx-fu/diffsentry-contracts";

export function renderJsonReport(report: DiffSentryReport): string {
  return JSON.stringify(
    {
      version: report.version,
      schemaVersion: report.schemaVersion,
      project: report.project,
      changes: report.changes,
      findings: report.findings,
      verifications: report.verifications,
      riskScore: report.riskScore,
      verdict: report.verdict,
    },
    null,
    2,
  );
}
