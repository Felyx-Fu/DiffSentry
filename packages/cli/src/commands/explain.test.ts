import { describe, expect, it } from "vitest";
import { runExplainCommand } from "./explain.js";

describe("runExplainCommand", () => {
  it("returns local metadata for a known built-in rule", () => {
    expect(
      runExplainCommand({ ruleId: "security.secret-exposure" }),
    ).toMatchObject({
      kind: "known",
      metadata: {
        category: "security",
        defaultSeverity: "critical",
        id: "security.secret-exposure",
      },
    });
  });

  it("returns a structured unknown outcome without network lookup", () => {
    expect(
      runExplainCommand({ ruleId: "security.not-a-built-in-rule" }),
    ).toEqual({
      kind: "unknown",
      ruleId: "security.not-a-built-in-rule",
    });
  });
});
