import type { FileSystemPort } from "../../ports/file-system.js";
import { isBunProject } from "./package-manager-bun.js";
import { isNpmProject } from "./package-manager-npm.js";
import { isPnpmProject } from "./package-manager-pnpm.js";
import { isYarnProject } from "./package-manager-yarn.js";

export type SupportedPackageManager = "pnpm" | "npm" | "yarn" | "bun";

export interface PackageManagerSignals {
  readonly pnpm: boolean;
  readonly npm: boolean;
  readonly yarn: boolean;
  readonly bun: boolean;
}

export type PackageManagerResolutionStatus =
  | "resolved"
  | "unknown"
  | "ambiguous";

export interface PackageManagerResolution {
  readonly status: PackageManagerResolutionStatus;
  readonly manager: SupportedPackageManager | null;
  readonly candidates: readonly SupportedPackageManager[];
}

const PACKAGE_MANAGER_PRECEDENCE: readonly SupportedPackageManager[] = [
  "pnpm",
  "npm",
  "yarn",
  "bun",
];

export function resolvePackageManager(
  signals: PackageManagerSignals,
): PackageManagerResolution {
  const candidates = PACKAGE_MANAGER_PRECEDENCE.filter(
    (packageManager) => signals[packageManager],
  );

  if (candidates.length === 1) {
    return {
      status: "resolved",
      manager: candidates[0] ?? null,
      candidates,
    };
  }

  if (candidates.length === 0) {
    return {
      status: "unknown",
      manager: null,
      candidates,
    };
  }

  return {
    status: "ambiguous",
    manager: null,
    candidates,
  };
}

/** Detects the supported package manager using the existing filesystem ports. */
export async function detectPackageManager(
  fileSystem: FileSystemPort,
  startDirectory: string,
): Promise<PackageManagerResolution> {
  const [pnpm, npm, yarn, bun] = await Promise.all([
    isPnpmProject(fileSystem, startDirectory),
    isNpmProject(fileSystem, startDirectory),
    isYarnProject(fileSystem, startDirectory),
    isBunProject(fileSystem, startDirectory),
  ]);

  return resolvePackageManager({ bun, npm, pnpm, yarn });
}
