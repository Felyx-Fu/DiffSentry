import { classifyCiFile } from "./ci-classifier.js";
import { classifyDependencyFile } from "./dependency-classifier.js";
import { classifySourceFile } from "./source-classifier.js";
import { classifyTestFile } from "./test-classifier.js";

export type FileCategory =
  | "source"
  | "test"
  | "config"
  | "dependency"
  | "documentation"
  | "ci"
  | "unknown";

const CONFIG_FILE_NAMES = new Set([
  ".editorconfig",
  ".gitignore",
  "biome.json",
  "pnpm-workspace.yaml",
  "turbo.json",
  "vitest.config.js",
  "vitest.config.ts",
  "vitest.config.mjs",
  "vitest.config.cjs",
  "action.yml",
  "action.yaml",
]);

const DOCUMENTATION_FILE_NAMES = new Set([
  "code_of_conduct.md",
  "contributing.md",
  "license",
  "readme.md",
  "security.md",
]);

function isConfigFile(path: string): boolean {
  const normalizedPath = path.replaceAll("\\", "/").toLowerCase();
  const fileName = normalizedPath.split("/").at(-1) ?? "";

  return (
    CONFIG_FILE_NAMES.has(fileName) ||
    /^tsconfig(?:\.[^/]+)?\.json$/.test(fileName) ||
    /\.(?:config|rc)\.(?:js|jsx|ts|tsx|mjs|cjs|json)$/.test(fileName)
  );
}

function isDocumentationFile(path: string): boolean {
  const normalizedPath = path.replaceAll("\\", "/").toLowerCase();
  const fileName = normalizedPath.split("/").at(-1) ?? "";

  return (
    normalizedPath.startsWith("docs/") ||
    normalizedPath.includes("/docs/") ||
    DOCUMENTATION_FILE_NAMES.has(fileName) ||
    /\.(?:md|mdx|adoc|txt)$/.test(fileName)
  );
}

export function classifyFileCategory(path: string): FileCategory {
  if (classifyDependencyFile(path) === "dependency") {
    return "dependency";
  }
  if (classifyCiFile(path) === "ci") {
    return "ci";
  }
  if (classifyTestFile(path) === "test") {
    return "test";
  }
  if (classifySourceFile(path) === "source") {
    return "source";
  }
  if (isConfigFile(path)) {
    return "config";
  }
  if (isDocumentationFile(path)) {
    return "documentation";
  }

  return "unknown";
}
