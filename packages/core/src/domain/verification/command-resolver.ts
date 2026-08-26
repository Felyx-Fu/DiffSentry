import type { SupportedPackageManager } from "../project/package-manager-resolution.js";
import type {
  PlannedVerification,
  VerificationIntentId,
} from "./verification-planner.js";

export interface ResolvedVerificationCommand {
  readonly id: VerificationIntentId;
  readonly executable: string;
  readonly args: readonly string[];
}

function resolveSafeTypecheckCommand(
  packageManager: SupportedPackageManager,
): readonly [string, ...string[]] {
  switch (packageManager) {
    case "npm":
      return ["npm", "exec", "--", "tsc", "--noEmit"];
    case "pnpm":
      return ["pnpm", "exec", "tsc", "--noEmit"];
    case "yarn":
      return ["yarn", "exec", "tsc", "--noEmit"];
    case "bun":
      return ["bun", "x", "tsc", "--noEmit"];
  }
}

export function resolveVerificationCommand(
  packageManager: SupportedPackageManager,
  plannedVerification: PlannedVerification,
): ResolvedVerificationCommand | null {
  if (plannedVerification.source === "package-script") {
    return {
      id: plannedVerification.id,
      executable: packageManager,
      args: ["run", plannedVerification.id],
    };
  }

  if (
    plannedVerification.source !== "safe-default" ||
    plannedVerification.id !== "typecheck"
  ) {
    return null;
  }

  const [executable, ...args] = resolveSafeTypecheckCommand(packageManager);
  return {
    id: plannedVerification.id,
    executable,
    args,
  };
}
