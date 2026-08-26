import { detectProjectEcosystem } from "./ecosystem.js";
import type {
  PackageManagerResolution,
  SupportedPackageManager,
} from "./package-manager-resolution.js";

export interface AssembledProjectContext {
  readonly repositoryRoot: string;
  readonly ecosystem: "node" | "unknown";
  readonly packageManager: SupportedPackageManager;
  readonly languages: readonly string[];
  readonly frameworks: readonly string[];
}

export interface ProjectDetectionFacts {
  readonly repositoryRoot: string;
  readonly hasPackageJson: boolean;
  readonly packageManager: PackageManagerResolution;
  readonly isTypeScriptProject: boolean;
}

export function assembleProjectContext(
  facts: ProjectDetectionFacts,
): AssembledProjectContext | null {
  if (
    facts.packageManager.status !== "resolved" ||
    facts.packageManager.manager === null
  ) {
    return null;
  }

  const languages = facts.isTypeScriptProject
    ? ["typescript"]
    : facts.hasPackageJson
      ? ["javascript"]
      : [];

  return {
    repositoryRoot: facts.repositoryRoot,
    ecosystem: detectProjectEcosystem(facts.hasPackageJson),
    packageManager: facts.packageManager.manager,
    languages,
    frameworks: [],
  };
}
