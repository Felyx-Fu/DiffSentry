import { describe, expect, it } from "vitest";
import { getSeverityWeight, SEVERITY_WEIGHTS } from "./severity-weight.js";

describe("severity weights", () => {
  it("maps every v0.1 severity to its fixed weight", () => {
    expect(SEVERITY_WEIGHTS).toEqual({
      critical: 50,
      high: 30,
      info: 0,
      low: 5,
      medium: 15,
    });

    expect(getSeverityWeight("info")).toBe(0);
    expect(getSeverityWeight("low")).toBe(5);
    expect(getSeverityWeight("medium")).toBe(15);
    expect(getSeverityWeight("high")).toBe(30);
    expect(getSeverityWeight("critical")).toBe(50);
  });

  it("contains no unapproved severity or configurable weight", () => {
    expect(Object.keys(SEVERITY_WEIGHTS).sort()).toEqual([
      "critical",
      "high",
      "info",
      "low",
      "medium",
    ]);
    expect(Object.isFrozen(SEVERITY_WEIGHTS)).toBe(true);
  });
});
