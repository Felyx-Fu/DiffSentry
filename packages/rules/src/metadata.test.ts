import { describe, expect, it } from "vitest";
import { validateRuleMetadata } from "./metadata.js";

const validMetadata = {
  category: "security",
  defaultSeverity: "critical",
  description: "Detects a documented high-signal security condition.",
  id: "security.secret-exposure",
  name: "Secret exposure",
} as const;

describe("rule metadata", () => {
  it("accepts stable metadata with a category-matching rule ID", () => {
    expect(validateRuleMetadata(validMetadata)).toBe(true);
  });

  it("accepts every supported category and default severity", () => {
    expect(
      validateRuleMetadata({
        ...validMetadata,
        category: "ci",
        defaultSeverity: "info",
        id: "ci.workflow-permission-change",
      }),
    ).toBe(true);
    expect(
      validateRuleMetadata({
        ...validMetadata,
        category: "dependency",
        defaultSeverity: "low",
        id: "dependency.runtime-dependency-added",
      }),
    ).toBe(true);
    expect(
      validateRuleMetadata({
        ...validMetadata,
        category: "testing",
        defaultSeverity: "medium",
        id: "testing.source-without-tests",
      }),
    ).toBe(true);
    expect(
      validateRuleMetadata({
        ...validMetadata,
        defaultSeverity: "high",
      }),
    ).toBe(true);
  });

  it("rejects malformed or inconsistent metadata", () => {
    expect(validateRuleMetadata(null)).toBe(false);
    expect(validateRuleMetadata({ ...validMetadata, name: " " })).toBe(false);
    expect(
      validateRuleMetadata({
        ...validMetadata,
        description: "",
      }),
    ).toBe(false);
    expect(
      validateRuleMetadata({
        ...validMetadata,
        category: "testing",
      }),
    ).toBe(false);
    expect(
      validateRuleMetadata({
        ...validMetadata,
        id: "security.SecretExposure",
      }),
    ).toBe(false);
    expect(
      validateRuleMetadata({
        ...validMetadata,
        defaultSeverity: "urgent",
      }),
    ).toBe(false);
  });
});
