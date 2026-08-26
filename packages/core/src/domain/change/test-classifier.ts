export type TestClassification = "test" | "unknown";

export function classifyTestFile(path: string): TestClassification {
  const normalizedPath = path.replaceAll("\\", "/").toLowerCase();
  const segments = normalizedPath.split("/");
  const fileName = segments.at(-1) ?? "";

  if (
    segments.includes("tests") ||
    segments.includes("__tests__") ||
    /\.(?:test|spec)\.(?:[cm]?js|[cm]?jsx|[cm]?ts|[cm]?tsx)$/i.test(fileName)
  ) {
    return "test";
  }

  return "unknown";
}
