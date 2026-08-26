import type { AssembledAgentGuardReport } from "@agentguard/core";

export type GitHubAnnotationLevel = "error" | "warning" | "notice";

export interface GitHubAnnotation {
  readonly level: GitHubAnnotationLevel;
  readonly file: string;
  readonly startLine: number;
  readonly startColumn?: number;
  readonly endLine?: number;
  readonly endColumn?: number;
  readonly title: string;
  readonly message: string;
}

export interface PublishGitHubAnnotationsOptions {
  readonly report: AssembledAgentGuardReport;
  readonly writeLine?: (line: string) => void;
}

function annotationLevel(
  severity: AssembledAgentGuardReport["findings"][number]["severity"],
): GitHubAnnotationLevel {
  switch (severity) {
    case "critical":
    case "high":
      return "error";
    case "medium":
      return "warning";
    case "info":
    case "low":
      return "notice";
  }
}

type FindingLocation = NonNullable<
  AssembledAgentGuardReport["findings"][number]["location"]
>;
type ValidLocation = Omit<FindingLocation, "startLine"> & {
  readonly startLine: number;
};

function getValidLocation(
  location: AssembledAgentGuardReport["findings"][number]["location"],
): ValidLocation | undefined {
  if (
    location === undefined ||
    typeof location.path !== "string" ||
    location.path.trim().length === 0 ||
    typeof location.startLine !== "number" ||
    !Number.isInteger(location.startLine) ||
    location.startLine < 1
  ) {
    return undefined;
  }

  if (
    location.startColumn !== undefined &&
    (!Number.isInteger(location.startColumn) || location.startColumn < 1)
  ) {
    return undefined;
  }

  if (
    location.endLine !== undefined &&
    (!Number.isInteger(location.endLine) ||
      location.endLine < location.startLine)
  ) {
    return undefined;
  }

  if (
    location.endColumn !== undefined &&
    (!Number.isInteger(location.endColumn) ||
      location.endColumn < 1 ||
      location.endLine === undefined ||
      (location.endLine === location.startLine &&
        location.startColumn !== undefined &&
        location.endColumn < location.startColumn))
  ) {
    return undefined;
  }

  return { ...location, startLine: location.startLine };
}

function annotationForFinding(
  finding: AssembledAgentGuardReport["findings"][number],
  location: ValidLocation,
): GitHubAnnotation {
  return {
    level: annotationLevel(finding.severity),
    file: location.path,
    ...(location.startColumn === undefined
      ? {}
      : { startColumn: location.startColumn }),
    startLine: location.startLine,
    ...(location.endLine === undefined ? {} : { endLine: location.endLine }),
    ...(location.endColumn === undefined
      ? {}
      : { endColumn: location.endColumn }),
    title: finding.title,
    message: finding.message,
  };
}

export function createGitHubAnnotations(
  report: AssembledAgentGuardReport,
): readonly GitHubAnnotation[] {
  const annotations: GitHubAnnotation[] = [];

  for (const finding of report.findings) {
    const findingLocation = getValidLocation(finding.location);
    if (findingLocation !== undefined) {
      annotations.push(annotationForFinding(finding, findingLocation));
      continue;
    }

    for (const evidence of finding.evidence) {
      const evidenceLocation = getValidLocation(evidence.location);
      if (evidenceLocation !== undefined) {
        annotations.push(annotationForFinding(finding, evidenceLocation));
      }
    }
  }

  return annotations;
}

function escapeProperty(value: string): string {
  return value
    .replaceAll("%", "%25")
    .replaceAll("\r", "%0D")
    .replaceAll("\n", "%0A")
    .replaceAll(":", "%3A")
    .replaceAll(",", "%2C");
}

function escapeMessage(value: string): string {
  return value
    .replaceAll("%", "%25")
    .replaceAll("\r", "%0D")
    .replaceAll("\n", "%0A");
}

export function formatGitHubAnnotation(annotation: GitHubAnnotation): string {
  const properties = [
    `file=${escapeProperty(annotation.file)}`,
    `line=${annotation.startLine}`,
    ...(annotation.startColumn === undefined
      ? []
      : [`col=${annotation.startColumn}`]),
    ...(annotation.endLine === undefined
      ? []
      : [`endLine=${annotation.endLine}`]),
    ...(annotation.endColumn === undefined
      ? []
      : [`endColumn=${annotation.endColumn}`]),
    `title=${escapeProperty(annotation.title)}`,
  ].join(",");

  return `::${annotation.level} ${properties}::${escapeMessage(annotation.message)}`;
}

export function publishGitHubAnnotations(
  options: PublishGitHubAnnotationsOptions,
): readonly string[] {
  const annotations = createGitHubAnnotations(options.report);
  const writeLine =
    options.writeLine ?? ((line: string) => process.stdout.write(`${line}\n`));
  const commands = annotations.map(formatGitHubAnnotation);

  for (const command of commands) {
    writeLine(command);
  }

  return commands;
}
