import type { AgentGuardReport } from "@agentguard/contracts";

export function renderJsonReport(report: AgentGuardReport): string {
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
