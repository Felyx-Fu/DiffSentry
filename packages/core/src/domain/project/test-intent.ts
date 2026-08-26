import type { KnownPackageScripts } from "./package-scripts.js";

export function hasTestVerificationIntent(
  scripts: KnownPackageScripts,
): boolean {
  return scripts.test !== null && scripts.test.trim().length > 0;
}
