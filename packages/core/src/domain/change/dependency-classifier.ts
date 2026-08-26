export type DependencyClassification = "dependency" | "unknown";

const DEPENDENCY_FILE_NAMES = new Set([
  "package.json",
  "pnpm-lock.yaml",
  "package-lock.json",
  "npm-shrinkwrap.json",
  "yarn.lock",
  "bun.lock",
  "bun.lockb",
]);

export function classifyDependencyFile(path: string): DependencyClassification {
  const fileName = path.replaceAll("\\", "/").split("/").at(-1)?.toLowerCase();
  return fileName !== undefined && DEPENDENCY_FILE_NAMES.has(fileName)
    ? "dependency"
    : "unknown";
}
