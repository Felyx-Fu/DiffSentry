export type SourceClassification = "source" | "unknown";

function isSourceExtension(path: string): boolean {
  return /\.(?:[cm]?js|[cm]?jsx|[cm]?ts|[cm]?tsx)$/i.test(path);
}

function isTestPath(path: string): boolean {
  const normalizedPath = path.replaceAll("\\", "/").toLowerCase();
  const segments = normalizedPath.split("/");
  const fileName = segments.at(-1) ?? "";

  return (
    segments.includes("tests") ||
    segments.includes("__tests__") ||
    /\.(?:test|spec)\.(?:[cm]?js|[cm]?jsx|[cm]?ts|[cm]?tsx)$/i.test(fileName)
  );
}

export function classifySourceFile(path: string): SourceClassification {
  const normalizedPath = path.replaceAll("\\", "/");
  const segments = normalizedPath.split("/");

  if (
    !segments.includes("src") ||
    normalizedPath.toLowerCase().endsWith(".d.ts") ||
    !isSourceExtension(normalizedPath) ||
    isTestPath(normalizedPath)
  ) {
    return "unknown";
  }

  return "source";
}
