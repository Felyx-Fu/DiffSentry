import { describe, expect, it } from "vitest";
import { validateRuleMetadata } from "../metadata.js";
import { RUNTIME_DEPENDENCY_ADDED_METADATA } from "./metadata.js";

describe("RUNTIME_DEPENDENCY_ADDED_METADATA", () => {
  it("defines stable dependency metadata with medium default severity", () => {
    expect(RUNTIME_DEPENDENCY_ADDED_METADATA).toEqual({
      category: "dependency",
      defaultSeverity: "medium",
      description:
        "Finds additions to runtime dependencies in project manifests.",
      id: "dependency.runtime-dependency-added",
      name: "Runtime dependency added",
    });
    expect(validateRuleMetadata(RUNTIME_DEPENDENCY_ADDED_METADATA)).toBe(true);
  });

  it("is immutable at runtime", () => {
    expect(Object.isFrozen(RUNTIME_DEPENDENCY_ADDED_METADATA)).toBe(true);
  });
});
