import { hasBuildVerificationIntent } from "../project/build-intent.js";
import { hasLintVerificationIntent } from "../project/lint-intent.js";
import type { KnownPackageScripts } from "../project/package-scripts.js";
import { hasTestVerificationIntent } from "../project/test-intent.js";
import { detectTypecheckIntent } from "../project/typecheck-intent.js";

export type VerificationIntentId = "test" | "lint" | "typecheck" | "build";

export type PlannedVerificationSource = "package-script" | "safe-default";

export interface PlannedVerification {
  readonly id: VerificationIntentId;
  readonly source: PlannedVerificationSource;
}

export interface VerificationPlannerToggles {
  readonly test?: boolean;
  readonly lint?: boolean;
  readonly typecheck?: boolean;
  readonly build?: boolean;
}

export interface VerificationPlannerInput {
  readonly scripts: KnownPackageScripts;
  readonly isTypeScriptProject: boolean;
  readonly toggles?: VerificationPlannerToggles;
}

function isEnabled(value: boolean | undefined, defaultValue: boolean): boolean {
  return value ?? defaultValue;
}

export function planVerifications(
  input: VerificationPlannerInput,
): readonly PlannedVerification[] {
  const toggles = input.toggles ?? {};
  const plan: PlannedVerification[] = [];

  if (
    isEnabled(toggles.test, true) &&
    hasTestVerificationIntent(input.scripts)
  ) {
    plan.push({ id: "test", source: "package-script" });
  }

  if (
    isEnabled(toggles.lint, true) &&
    hasLintVerificationIntent(input.scripts)
  ) {
    plan.push({ id: "lint", source: "package-script" });
  }

  if (isEnabled(toggles.typecheck, true)) {
    const typecheckIntent = detectTypecheckIntent(
      input.scripts,
      input.isTypeScriptProject,
    );
    if (typecheckIntent !== "none") {
      plan.push({
        id: "typecheck",
        source:
          typecheckIntent === "explicit" ? "package-script" : "safe-default",
      });
    }
  }

  if (
    hasBuildVerificationIntent(input.scripts, isEnabled(toggles.build, false))
  ) {
    plan.push({ id: "build", source: "package-script" });
  }

  return plan;
}
