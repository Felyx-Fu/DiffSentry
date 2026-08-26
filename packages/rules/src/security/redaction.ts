import type { SecretMatch, SecretPatternId } from "./detector.js";

export interface SecretEvidenceLocation {
  readonly path: string;
  readonly startLine: number;
  readonly startColumn: number;
  readonly endLine: number;
  readonly endColumn: number;
}

export interface RedactedSecretEvidence {
  readonly message: string;
  readonly patternId: SecretPatternId;
  readonly location: SecretEvidenceLocation;
}

interface SourcePosition {
  readonly line: number;
  readonly column: number;
}

function positionAt(contents: string, offset: number): SourcePosition {
  const prefix = contents.slice(0, offset);
  const lastNewline = prefix.lastIndexOf("\n");
  const line = prefix.split("\n").length;
  const column = offset - lastNewline;

  return { column, line };
}

export function createRedactedSecretEvidence(
  path: string,
  contents: string,
  matches: readonly SecretMatch[],
): readonly RedactedSecretEvidence[] {
  return matches.map((match) => {
    const start = positionAt(contents, match.start);
    const end = positionAt(contents, match.end - 1);

    return {
      location: {
        endColumn: end.column,
        endLine: end.line,
        path,
        startColumn: start.column,
        startLine: start.line,
      },
      message: `Potential ${match.patternId} detected; matched value redacted.`,
      patternId: match.patternId,
    };
  });
}
