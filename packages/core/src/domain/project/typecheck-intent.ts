import type { KnownPackageScripts } from "./package-scripts.js";

export type TypecheckIntent = "explicit" | "safe-default" | "none";

export function detectTypecheckIntent(
  scripts: KnownPackageScripts,
  isTypeScriptProject: boolean,
): TypecheckIntent {
  if (scripts.typecheck !== null && scripts.typecheck.trim().length > 0) {
    return "explicit";
  }

  return isTypeScriptProject ? "safe-default" : "none";
}
