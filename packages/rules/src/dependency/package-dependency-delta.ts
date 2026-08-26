export interface PackageDependencyDelta {
  readonly addedRuntimeDependencies: readonly string[];
  readonly removedRuntimeDependencies: readonly string[];
  readonly addedDevDependencies: readonly string[];
  readonly removedDevDependencies: readonly string[];
}

interface ParsedPackageManifest {
  readonly dependencies: readonly string[];
  readonly devDependencies: readonly string[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseDependencyNames(
  value: unknown,
  fieldName: string,
): readonly string[] {
  if (value === undefined) {
    return [];
  }
  if (!isRecord(value)) {
    throw new Error(`Invalid ${fieldName} in package.json`);
  }

  for (const version of Object.values(value)) {
    if (typeof version !== "string") {
      throw new Error(`Invalid ${fieldName} in package.json`);
    }
  }

  return Object.keys(value).sort(compareDependencyNames);
}

function parsePackageManifest(contents: string): ParsedPackageManifest {
  let parsed: unknown;
  try {
    parsed = JSON.parse(contents) as unknown;
  } catch {
    throw new Error("Invalid package.json");
  }

  if (!isRecord(parsed)) {
    throw new Error("Invalid package.json");
  }

  return {
    dependencies: parseDependencyNames(parsed.dependencies, "dependencies"),
    devDependencies: parseDependencyNames(
      parsed.devDependencies,
      "devDependencies",
    ),
  };
}

function compareDependencyNames(left: string, right: string): number {
  if (left < right) {
    return -1;
  }
  if (left > right) {
    return 1;
  }
  return 0;
}

function addedNames(
  before: readonly string[],
  after: readonly string[],
): readonly string[] {
  const beforeNames = new Set(before);
  return after.filter((name) => !beforeNames.has(name));
}

function removedNames(
  before: readonly string[],
  after: readonly string[],
): readonly string[] {
  const afterNames = new Set(after);
  return before.filter((name) => !afterNames.has(name));
}

export function parsePackageDependencyDelta(
  beforeContents: string,
  afterContents: string,
): PackageDependencyDelta {
  const before = parsePackageManifest(beforeContents);
  const after = parsePackageManifest(afterContents);

  return {
    addedDevDependencies: addedNames(
      before.devDependencies,
      after.devDependencies,
    ),
    addedRuntimeDependencies: addedNames(
      before.dependencies,
      after.dependencies,
    ),
    removedDevDependencies: removedNames(
      before.devDependencies,
      after.devDependencies,
    ),
    removedRuntimeDependencies: removedNames(
      before.dependencies,
      after.dependencies,
    ),
  };
}
