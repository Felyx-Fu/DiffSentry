import { describe, expect, it } from "vitest";
import { validateRuleMetadata } from "../metadata.js";
import { SOURCE_WITHOUT_TESTS_METADATA } from "./source-without-tests-metadata.js";

describe("SOURCE_WITHOUT_TESTS_METADATA", () => {
  it("defines stable high-severity testing metadata", () => {
    expect(SOURCE_WITHOUT_TESTS_METADATA).toEqual({
      category: "testing",
      defaultSeverity: "high",
      description:
        "Finds changed source files without a related changed test file.",
      id: "testing.source-without-tests",
      name: "Source change without tests",
    });
    expect(validateRuleMetadata(SOURCE_WITHOUT_TESTS_METADATA)).toBe(true);
  });

  it("keeps the testing category and high default explicit", () => {
    expect(SOURCE_WITHOUT_TESTS_METADATA.category).toBe("testing");
    expect(SOURCE_WITHOUT_TESTS_METADATA.defaultSeverity).toBe("high");
  });
});
