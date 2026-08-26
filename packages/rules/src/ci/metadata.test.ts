import { describe, expect, it } from "vitest";
import { validateRuleMetadata } from "../metadata.js";
import { WORKFLOW_PERMISSION_CHANGE_METADATA } from "./metadata.js";

describe("WORKFLOW_PERMISSION_CHANGE_METADATA", () => {
  it("defines stable CI metadata with high default severity", () => {
    expect(WORKFLOW_PERMISSION_CHANGE_METADATA).toEqual({
      category: "ci",
      defaultSeverity: "high",
      description:
        "Finds workflow permission changes that expand CI token access.",
      id: "ci.workflow-permission-change",
      name: "CI workflow permission change",
    });
    expect(validateRuleMetadata(WORKFLOW_PERMISSION_CHANGE_METADATA)).toBe(
      true,
    );
  });

  it("is immutable at runtime", () => {
    expect(Object.isFrozen(WORKFLOW_PERMISSION_CHANGE_METADATA)).toBe(true);
  });
});
