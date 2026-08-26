import { describe, expect, it } from "vitest";
import { DEFAULT_CONFIG } from "./defaults.js";

describe("DEFAULT_CONFIG", () => {
  it("matches deterministic v0.1 verification and risk defaults", () => {
    expect(DEFAULT_CONFIG).toEqual({
      verification: {
        build: false,
        lint: true,
        test: true,
        typecheck: true,
      },
      rules: {},
      thresholds: {
        fail: 50,
        review: 15,
      },
    });
  });

  it("is frozen at every default-config level", () => {
    expect(Object.isFrozen(DEFAULT_CONFIG)).toBe(true);
    expect(Object.isFrozen(DEFAULT_CONFIG.verification)).toBe(true);
    expect(Object.isFrozen(DEFAULT_CONFIG.rules)).toBe(true);
    expect(Object.isFrozen(DEFAULT_CONFIG.thresholds)).toBe(true);
  });
});
