import { describe, expect, it } from "vitest";
import { applySeverityOverrides } from "./severity-override.js";

const findings = [
  { message: "secret", ruleId: "security.secret-exposure", severity: "high" },
  { message: "auth", ruleId: "testing.auth-without-tests", severity: "medium" },
] as const;

describe("applySeverityOverrides", () => {
  it("overrides matching findings without mutating the originals", () => {
    const result = applySeverityOverrides(findings, {
      "security.secret-exposure": { severity: "critical" },
    });

    expect(result).toEqual([
      {
        message: "secret",
        ruleId: "security.secret-exposure",
        severity: "critical",
      },
      findings[1],
    ]);
    expect(findings[0].severity).toBe("high");
    expect(result[1]).toBe(findings[1]);
  });

  it("ignores unknown rule IDs and leaves findings unchanged without overrides", () => {
    expect(
      applySeverityOverrides(findings, {
        "testing.unknown": { severity: "critical" },
      }),
    ).toEqual(findings);
    expect(applySeverityOverrides(findings)).toEqual(findings);
  });

  it("applies multiple overrides deterministically", () => {
    expect(
      applySeverityOverrides(findings, {
        "security.secret-exposure": { severity: "low" },
        "testing.auth-without-tests": { severity: "high" },
      }),
    ).toEqual([
      {
        message: "secret",
        ruleId: "security.secret-exposure",
        severity: "low",
      },
      {
        message: "auth",
        ruleId: "testing.auth-without-tests",
        severity: "high",
      },
    ]);
  });
});
