import { isAuthRelatedPath } from "./auth-path-matcher.js";
import { isRelatedAuthTestPath } from "./auth-test-path-matcher.js";
import { AUTH_WITHOUT_TESTS_METADATA } from "./auth-without-tests-metadata.js";
import type { TestingChangedFile } from "./source-without-tests.js";

export interface AuthWithoutTestsContext {
  readonly files: readonly TestingChangedFile[];
}

export interface AuthWithoutTestsDetection {
  readonly authSourcePaths: readonly string[];
  readonly changedTestPaths: readonly string[];
}

export interface AuthWithoutTestsEvidenceLocation {
  readonly path: string;
}

export interface AuthWithoutTestsEvidence {
  readonly message: string;
  readonly location: AuthWithoutTestsEvidenceLocation;
}

export interface AuthWithoutTestsFinding {
  readonly ruleId: string;
  readonly severity: typeof AUTH_WITHOUT_TESTS_METADATA.defaultSeverity;
  readonly title: string;
  readonly message: string;
  readonly evidence: readonly AuthWithoutTestsEvidence[];
  readonly confidence: number;
  readonly location: AuthWithoutTestsEvidence["location"];
}

export function detectAuthWithoutTests(
  context: AuthWithoutTestsContext,
): AuthWithoutTestsDetection | null {
  const authSourcePaths = context.files
    .filter(
      (file) => file.category === "source" && isAuthRelatedPath(file.path),
    )
    .map((file) => file.path);
  const changedTestPaths = context.files
    .filter((file) => file.category === "test")
    .map((file) => file.path);
  const untestedAuthSourcePaths = authSourcePaths.filter(
    (authSourcePath) =>
      !changedTestPaths.some((testPath) =>
        isRelatedAuthTestPath(authSourcePath, testPath),
      ),
  );

  if (untestedAuthSourcePaths.length === 0) {
    return null;
  }

  return {
    authSourcePaths: untestedAuthSourcePaths,
    changedTestPaths,
  };
}

export function createAuthWithoutTestsEvidence(
  detection: AuthWithoutTestsDetection,
): readonly AuthWithoutTestsEvidence[] {
  return detection.authSourcePaths.map((authSourcePath) => ({
    location: { path: authSourcePath },
    message: `Authentication-related source file ${authSourcePath} changed; no related test file changed in this ChangeSet.`,
  }));
}

export const authWithoutTestsRule = {
  id: AUTH_WITHOUT_TESTS_METADATA.id,
  supports: (context: AuthWithoutTestsContext): boolean =>
    context.files.length > 0,
  run: async (
    context: AuthWithoutTestsContext,
  ): Promise<readonly AuthWithoutTestsFinding[]> => {
    const detection = detectAuthWithoutTests(context);
    if (detection === null) {
      return [];
    }

    const evidence = createAuthWithoutTestsEvidence(detection);
    const firstEvidence = evidence[0];
    if (firstEvidence === undefined) {
      return [];
    }

    return [
      {
        confidence: 1,
        evidence,
        location: firstEvidence.location,
        message:
          "Authentication-related source changes have no related changed test file in this ChangeSet.",
        ruleId: AUTH_WITHOUT_TESTS_METADATA.id,
        severity: AUTH_WITHOUT_TESTS_METADATA.defaultSeverity,
        title: AUTH_WITHOUT_TESTS_METADATA.name,
      },
    ];
  },
};
