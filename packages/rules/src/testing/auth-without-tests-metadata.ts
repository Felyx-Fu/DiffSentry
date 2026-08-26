import type { RuleMetadata } from "../metadata.js";

export const AUTH_WITHOUT_TESTS_METADATA: Readonly<RuleMetadata> =
  Object.freeze({
    category: "testing",
    defaultSeverity: "high",
    description:
      "Finds authentication-related changes without a related changed test file.",
    id: "testing.auth-without-tests",
    name: "Authentication change without tests",
  });
