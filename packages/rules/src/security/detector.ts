export type SecretPatternId =
  | "credential-assignment"
  | "private-key-marker"
  | "provider-token";

export interface SecretMatch {
  readonly patternId: SecretPatternId;
  readonly start: number;
  readonly end: number;
}

interface SecretPattern {
  readonly id: SecretPatternId;
  readonly expression: RegExp;
}

// v0.1 intentionally covers only high-signal markers and long assignment values.
const SECRET_PATTERNS: readonly SecretPattern[] = [
  {
    expression:
      /\b(?:api[_-]?key|secret|token|password)\b\s*[:=]\s*(?:"[^"\r\n]{16,}"|'[^'\r\n]{16,}'|[^\s,;]{16,})/gi,
    id: "credential-assignment",
  },
  {
    expression: /-----BEGIN [A-Z0-9 ]*PRIVATE KEY-----/g,
    id: "private-key-marker",
  },
  {
    expression:
      /\b(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|AKIA[0-9A-Z]{16}|npm_[A-Za-z0-9]{20,}|sk_live_[A-Za-z0-9]{16,})\b/g,
    id: "provider-token",
  },
];

export function detectSecretPatterns(contents: string): readonly SecretMatch[] {
  const matches: SecretMatch[] = [];

  for (const pattern of SECRET_PATTERNS) {
    pattern.expression.lastIndex = 0;
    for (const match of contents.matchAll(pattern.expression)) {
      if (match.index === undefined) {
        continue;
      }
      matches.push({
        end: match.index + match[0].length,
        patternId: pattern.id,
        start: match.index,
      });
    }
    pattern.expression.lastIndex = 0;
  }

  return matches.sort((left, right) => {
    if (left.start !== right.start) {
      return left.start - right.start;
    }
    if (left.end !== right.end) {
      return left.end - right.end;
    }
    return left.patternId < right.patternId
      ? -1
      : left.patternId > right.patternId
        ? 1
        : 0;
  });
}
