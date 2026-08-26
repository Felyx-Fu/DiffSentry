import { describe, expect, it } from "vitest";
import {
  calculateVerdict,
  DEFAULT_RISK_THRESHOLDS,
  validateRiskThresholds,
} from "./verdict-thresholds.js";

describe("verdict thresholds", () => {
  it("uses the normative default thresholds and exact boundaries", () => {
    expect(DEFAULT_RISK_THRESHOLDS).toEqual({ review: 15, fail: 50 });
    expect(calculateVerdict(14)).toBe("pass");
    expect(calculateVerdict(15)).toBe("review");
    expect(calculateVerdict(49)).toBe("review");
    expect(calculateVerdict(50)).toBe("fail");
  });

  it("uses supplied thresholds instead of replacing them with defaults", () => {
    const thresholds = { review: 20, fail: 80 };

    expect(calculateVerdict(19, thresholds)).toBe("pass");
    expect(calculateVerdict(20, thresholds)).toBe("review");
    expect(calculateVerdict(79, thresholds)).toBe("review");
    expect(calculateVerdict(80, thresholds)).toBe("fail");
  });

  it("validates the complete threshold invariant", () => {
    expect(validateRiskThresholds({ review: 0, fail: 1 })).toBe(true);
    expect(validateRiskThresholds({ review: 99, fail: 100 })).toBe(true);
    expect(validateRiskThresholds({ review: -1, fail: 50 })).toBe(false);
    expect(validateRiskThresholds({ review: 15, fail: 15 })).toBe(false);
    expect(validateRiskThresholds({ review: 60, fail: 50 })).toBe(false);
    expect(validateRiskThresholds({ review: 15, fail: 101 })).toBe(false);
  });

  it("rejects invalid thresholds before mapping a verdict", () => {
    expect(() => calculateVerdict(10, { review: 50, fail: 20 })).toThrow(
      RangeError,
    );
  });
});
