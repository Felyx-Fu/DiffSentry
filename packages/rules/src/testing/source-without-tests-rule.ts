import {
  detectSourceWithoutTests,
  type SourceWithoutTestsContext,
} from "./source-without-tests.js";
import {
  createSourceWithoutTestsEvidence,
  type SourceWithoutTestsEvidence,
} from "./source-without-tests-evidence.js";
import { SOURCE_WITHOUT_TESTS_METADATA } from "./source-without-tests-metadata.js";

export interface SourceWithoutTestsFinding {
  readonly ruleId: string;
  readonly severity: typeof SOURCE_WITHOUT_TESTS_METADATA.defaultSeverity;
  readonly title: string;
  readonly message: string;
  readonly evidence: readonly SourceWithoutTestsEvidence[];
  readonly confidence: number;
  readonly location: SourceWithoutTestsEvidence["location"];
}

export const sourceWithoutTestsRule = {
  id: SOURCE_WITHOUT_TESTS_METADATA.id,
  supports: (context: SourceWithoutTestsContext): boolean =>
    context.files.length > 0,
  run: async (
    context: SourceWithoutTestsContext,
  ): Promise<readonly SourceWithoutTestsFinding[]> => {
    const detection = detectSourceWithoutTests(context);
    if (detection === null) {
      return [];
    }

    const evidence = createSourceWithoutTestsEvidence(detection);
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
          "Changed source files have no related changed test file in this ChangeSet.",
        ruleId: SOURCE_WITHOUT_TESTS_METADATA.id,
        severity: SOURCE_WITHOUT_TESTS_METADATA.defaultSeverity,
        title: SOURCE_WITHOUT_TESTS_METADATA.name,
      },
    ];
  },
};
