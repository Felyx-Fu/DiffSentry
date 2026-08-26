import type { KnownPackageScripts } from "./package-scripts.js";

export function hasLintVerificationIntent(
  scripts: KnownPackageScripts,
): boolean {
  return scripts.lint !== null && scripts.lint.trim().length > 0;
}
