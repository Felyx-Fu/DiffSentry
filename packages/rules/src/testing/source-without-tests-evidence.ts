import type { SourceWithoutTestsDetection } from "./source-without-tests.js";

export interface SourceWithoutTestsEvidenceLocation {
  readonly path: string;
}

export interface SourceWithoutTestsEvidence {
  readonly message: string;
  readonly location: SourceWithoutTestsEvidenceLocation;
}

export function createSourceWithoutTestsEvidence(
  detection: SourceWithoutTestsDetection,
): readonly SourceWithoutTestsEvidence[] {
  return detection.sourcePaths.map((sourcePath) => ({
    location: { path: sourcePath },
    message: `Changed source file ${sourcePath}; no related test file changed in this ChangeSet.`,
  }));
}
