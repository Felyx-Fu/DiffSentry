export type ParsedFileStatus = "added" | "modified" | "deleted" | "renamed";

export interface ParsedChangedFile {
  readonly path: string;
  readonly status: ParsedFileStatus;
  readonly additions: number;
  readonly deletions: number;
  readonly category: "unknown";
}

export interface ParsedChangeSet {
  readonly baseRef: string;
  readonly headRef: string;
  readonly files: readonly ParsedChangedFile[];
}

function stripDiffPath(value: string): string | null {
  const path = value.trimEnd();
  if (path === "/dev/null") {
    return null;
  }

  if (path.startsWith("a/") || path.startsWith("b/")) {
    return path.slice(2);
  }

  return path;
}

function pathFromDiffHeader(line: string): string | null {
  const header = line.slice("diff --git ".length);
  const newPathMarker = header.indexOf(" b/");
  if (newPathMarker === -1) {
    return null;
  }

  return stripDiffPath(header.slice(newPathMarker + 1));
}

function parseSection(lines: readonly string[]): ParsedChangedFile | null {
  const header = lines[0];
  if (header === undefined) {
    return null;
  }

  let status: ParsedFileStatus = "modified";
  let path = pathFromDiffHeader(header);
  let additions = 0;
  let deletions = 0;
  let inHunk = false;

  for (const line of lines.slice(1)) {
    if (line.startsWith("@@ ")) {
      inHunk = true;
    } else if (inHunk && line.startsWith("+")) {
      additions += 1;
    } else if (inHunk && line.startsWith("-")) {
      deletions += 1;
    } else if (line.startsWith("new file mode ")) {
      status = "added";
    } else if (line.startsWith("deleted file mode ")) {
      status = "deleted";
    } else if (line.startsWith("similarity index ")) {
      status = "renamed";
    } else if (line.startsWith("rename to ")) {
      status = "renamed";
      path = stripDiffPath(line.slice("rename to ".length));
    } else if (line.startsWith("+++ ")) {
      const newPath = stripDiffPath(line.slice("+++ ".length));
      if (newPath !== null) {
        path = newPath;
      }
    }
  }

  if (path === null || path.length === 0) {
    return null;
  }

  return {
    path,
    status,
    additions,
    deletions,
    category: "unknown",
  };
}

export function parseGitDiff(
  rawDiff: string,
  baseRef: string,
  headRef: string,
): ParsedChangeSet {
  const sections: string[][] = [];
  let currentSection: string[] | null = null;

  for (const line of rawDiff.split(/\r?\n/)) {
    if (line.startsWith("diff --git ")) {
      if (currentSection !== null) {
        sections.push(currentSection);
      }
      currentSection = [line];
    } else if (currentSection !== null) {
      currentSection.push(line);
    }
  }

  if (currentSection !== null) {
    sections.push(currentSection);
  }

  return {
    baseRef,
    headRef,
    files: sections
      .map((section) => parseSection(section))
      .filter((file): file is ParsedChangedFile => file !== null),
  };
}
