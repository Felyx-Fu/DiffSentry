import { describe, expect, it } from "vitest";
import { validateRuleMetadata } from "../metadata.js";
import { AUTH_WITHOUT_TESTS_METADATA } from "./auth-without-tests-metadata.js";

describe("AUTH_WITHOUT_TESTS_METADATA", () => {
  it("defines stable testing metadata with high default severity", () => {
    expect(AUTH_WITHOUT_TESTS_METADATA).toEqual({
      category: "testing",
      defaultSeverity: "high",
      description:
        "Finds authentication-related changes without a related changed test file.",
      id: "testing.auth-without-tests",
      name: "Authentication change without tests",
    });
    expect(validateRuleMetadata(AUTH_WITHOUT_TESTS_METADATA)).toBe(true);
  });

  it("is immutable at runtime", () => {
    expect(Object.isFrozen(AUTH_WITHOUT_TESTS_METADATA)).toBe(true);
  });
});
