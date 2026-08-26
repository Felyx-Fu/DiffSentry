import { describe, expect, it } from "vitest";
import { validateRuleMetadata } from "../metadata.js";
import { SECRET_EXPOSURE_METADATA } from "./metadata.js";

describe("SECRET_EXPOSURE_METADATA", () => {
  it("defines the stable critical security rule metadata", () => {
    expect(SECRET_EXPOSURE_METADATA).toEqual({
      category: "security",
      defaultSeverity: "critical",
      description:
        "Detects high-signal secret-like material in changed source files.",
      id: "security.secret-exposure",
      name: "Secret exposure",
    });
    expect(validateRuleMetadata(SECRET_EXPOSURE_METADATA)).toBe(true);
    expect(Object.isFrozen(SECRET_EXPOSURE_METADATA)).toBe(true);
  });

  it("does not use a non-security category or non-critical default", () => {
    expect(SECRET_EXPOSURE_METADATA.category).toBe("security");
    expect(SECRET_EXPOSURE_METADATA.defaultSeverity).toBe("critical");
  });
});
