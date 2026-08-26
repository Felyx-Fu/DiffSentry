import type {
  AgentGuardReport,
  EvidenceLocation,
  Finding,
  VerificationResult,
} from "@agentguard/contracts";

function formatLocation(location: EvidenceLocation | undefined): string {
  if (location === undefined) {
    return "";
  }

  const start =
    location.startLine === undefined
      ? ""
      : `:${location.startLine}${location.startColumn === undefined ? "" : `:${location.startColumn}`}`;
  const end =
    location.endLine === undefined
      ? ""
      : `-${location.endLine}${location.endColumn === undefined ? "" : `:${location.endColumn}`}`;

  return ` (${location.path}${start}${end})`;
}

function formatFinding(finding: Finding): readonly string[] {
  const lines = [
    `#### ${finding.severity.toUpperCase()} — ${finding.title}`,
    "",
    `Rule: \`${finding.ruleId}\``,
    "",
    finding.message,
  ];

  if (finding.evidence.length > 0) {
    lines.push("", "Evidence:");
    for (const evidence of finding.evidence) {
      lines.push(`- ${evidence.message}${formatLocation(evidence.location)}`);
    }
  } else if (finding.location !== undefined) {
    lines.push("", `Location: ${formatLocation(finding.location).trim()}`);
  }

  return lines;
}

function formatVerification(verification: VerificationResult): string {
  const command = [
    verification.command.executable,
    ...verification.command.args,
  ].join(" ");
  return `- \`${verification.id}\`: **${verification.status.toUpperCase()}** — \`${command}\``;
}

export function renderMarkdownReport(report: AgentGuardReport): string {
  const lines = [
    `## AgentGuard ${report.version}`,
    "",
    `- **Verdict:** \`${report.verdict.toUpperCase()}\``,
    `- **Risk score:** \`${report.riskScore}/100\``,
    `- **Findings:** ${report.findings.length}`,
    `- **Verifications:** ${report.verifications.length}`,
    "",
    "### Findings",
  ];

  if (report.findings.length === 0) {
    lines.push("", "No findings.");
  } else {
    for (const finding of report.findings) {
      lines.push("", ...formatFinding(finding));
    }
  }

  lines.push("", "### Verifications");
  if (report.verifications.length === 0) {
    lines.push("", "No verifications.");
  } else {
    lines.push("", ...report.verifications.map(formatVerification));
  }

  return lines.join("\n");
}
