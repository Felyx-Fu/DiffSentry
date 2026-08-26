import type { RuleMetadata } from "../metadata.js";

export const SOURCE_WITHOUT_TESTS_METADATA: Readonly<RuleMetadata> =
  Object.freeze({
    category: "testing",
    defaultSeverity: "high",
    description:
      "Finds changed source files without a related changed test file.",
    id: "testing.source-without-tests",
    name: "Source change without tests",
  });
