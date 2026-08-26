import type { KnownPackageScripts } from "./package-scripts.js";

export function hasBuildVerificationIntent(
  scripts: KnownPackageScripts,
  enabled = false,
): boolean {
  return enabled && scripts.build !== null && scripts.build.trim().length > 0;
}
