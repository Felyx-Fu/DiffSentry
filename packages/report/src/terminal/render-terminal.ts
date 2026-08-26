import type {
  AgentGuardReport,
  EvidenceLocation,
  Finding,
  VerificationResult,
} from "@agentguard/contracts";

function formatPosition(
  line: number | undefined,
  column: number | undefined,
): string {
  if (line === undefined) {
    return "";
  }

  return `:${line}${column === undefined ? "" : `:${column}`}`;
}

function formatLocation(location: EvidenceLocation | undefined): string {
  if (location === undefined) {
    return "";
  }

  const start = formatPosition(location.startLine, location.startColumn);
  const end =
    location.endLine === undefined
      ? ""
      : `-${location.endLine}${location.endColumn === undefined ? "" : `:${location.endColumn}`}`;

  return ` at ${location.path}${start}${end}`;
}

function formatFinding(finding: Finding): readonly string[] {
  const lines = [
    `- [${finding.severity.toUpperCase()}] ${finding.title} (${finding.ruleId})`,
    `  ${finding.message}`,
  ];

  if (finding.evidence.length === 0 && finding.location !== undefined) {
    lines.push(`  Location:${formatLocation(finding.location)}`);
  }

  for (const evidence of finding.evidence) {
    lines.push(
      `  Evidence: ${evidence.message}${formatLocation(evidence.location)}`,
    );
  }

  return lines;
}

function formatVerification(verification: VerificationResult): string {
  const command = [
    verification.command.executable,
    ...verification.command.args,
  ].join(" ");
  return `- ${verification.id}: ${verification.status.toUpperCase()} (${command})`;
}

export function renderTerminalReport(report: AgentGuardReport): string {
  const lines = [
    `AgentGuard ${report.version}`,
    `Verdict: ${report.verdict.toUpperCase()}`,
    `Risk score: ${report.riskScore}/100`,
    `Findings: ${report.findings.length}`,
    `Verifications: ${report.verifications.length}`,
  ];

  if (report.findings.length === 0) {
    lines.push("", "Findings: none");
  } else {
    lines.push("", "Findings:");
    for (const finding of report.findings) {
      lines.push(...formatFinding(finding));
    }
  }

  if (report.verifications.length === 0) {
    lines.push("", "Verifications: none");
  } else {
    lines.push("", "Verifications:");
    for (const verification of report.verifications) {
      lines.push(formatVerification(verification));
    }
  }

  return lines.join("\n");
}
