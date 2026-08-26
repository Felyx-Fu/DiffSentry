import { RUNTIME_DEPENDENCY_ADDED_METADATA } from "./metadata.js";
import { parsePackageDependencyDelta } from "./package-dependency-delta.js";

export interface RuntimeDependencyRuleContext {
  readonly packagePath: string;
  readonly beforeContents: string;
  readonly afterContents: string;
}

export interface RuntimeDependencyEvidenceLocation {
  readonly path: string;
}

export interface RuntimeDependencyEvidence {
  readonly dependencyName: string;
  readonly message: string;
  readonly location: RuntimeDependencyEvidenceLocation;
}

export interface RuntimeDependencyFinding {
  readonly ruleId: string;
  readonly severity: typeof RUNTIME_DEPENDENCY_ADDED_METADATA.defaultSeverity;
  readonly title: string;
  readonly message: string;
  readonly evidence: readonly RuntimeDependencyEvidence[];
  readonly confidence: number;
  readonly location: RuntimeDependencyEvidence["location"];
}

export function createRuntimeDependencyEvidence(
  packagePath: string,
  dependencyNames: readonly string[],
): readonly RuntimeDependencyEvidence[] {
  return dependencyNames.map((dependencyName) => ({
    dependencyName,
    location: { path: packagePath },
    message: `Runtime dependency ${dependencyName} was added to ${packagePath}.`,
  }));
}

export const runtimeDependencyAddedRule = {
  id: RUNTIME_DEPENDENCY_ADDED_METADATA.id,
  supports: (context: RuntimeDependencyRuleContext): boolean =>
    context.packagePath.length > 0,
  run: async (
    context: RuntimeDependencyRuleContext,
  ): Promise<readonly RuntimeDependencyFinding[]> => {
    const delta = parsePackageDependencyDelta(
      context.beforeContents,
      context.afterContents,
    );
    const evidence = createRuntimeDependencyEvidence(
      context.packagePath,
      delta.addedRuntimeDependencies,
    );

    return evidence.map((dependencyEvidence) => ({
      confidence: 1,
      evidence: [dependencyEvidence],
      location: dependencyEvidence.location,
      message: dependencyEvidence.message,
      ruleId: RUNTIME_DEPENDENCY_ADDED_METADATA.id,
      severity: RUNTIME_DEPENDENCY_ADDED_METADATA.defaultSeverity,
      title: RUNTIME_DEPENDENCY_ADDED_METADATA.name,
    }));
  },
};
