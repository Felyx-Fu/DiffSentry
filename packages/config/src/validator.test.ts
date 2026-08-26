import { describe, expect, it } from "vitest";
import { DEFAULT_CONFIG } from "./defaults.js";
import { validateConfig } from "./validator.js";

describe("validateConfig", () => {
  it("accepts empty, partial, default, and complete v0.1 configurations", () => {
    expect(validateConfig({})).toBe(true);
    expect(validateConfig({ verification: { test: false } })).toBe(true);
    expect(validateConfig(DEFAULT_CONFIG)).toBe(true);
    expect(
      validateConfig({
        verification: {
          test: true,
          lint: false,
          typecheck: true,
          build: false,
        },
        rules: {
          "ci.workflow-permission-change": {
            enabled: true,
            severity: "high",
          },
          "dependency.runtime-dependency-added": { severity: "medium" },
        },
        thresholds: { review: 15, fail: 50 },
      }),
    ).toBe(true);
  });

  it("rejects unknown fields and invalid nested shapes", () => {
    expect(validateConfig({ unknown: true })).toBe(false);
    expect(validateConfig({ verification: { test: "yes" } })).toBe(false);
    expect(validateConfig({ verification: { deploy: true } })).toBe(false);
    expect(
      validateConfig({
        rules: { "security.secret-exposure": { severity: "urgent" } },
      }),
    ).toBe(false);
    expect(
      validateConfig({
        rules: { "not-a-rule": { enabled: true } },
      }),
    ).toBe(false);
  });

  it("enforces the finite threshold invariant and required pair", () => {
    expect(validateConfig({ thresholds: { review: 15 } })).toBe(false);
    expect(validateConfig({ thresholds: { review: 50, fail: 50 } })).toBe(
      false,
    );
    expect(validateConfig({ thresholds: { review: 60, fail: 50 } })).toBe(
      false,
    );
    expect(validateConfig({ thresholds: { review: -1, fail: 50 } })).toBe(
      false,
    );
    expect(validateConfig({ thresholds: { review: 15, fail: 101 } })).toBe(
      false,
    );
    expect(
      validateConfig({ thresholds: { review: Number.NaN, fail: 50 } }),
    ).toBe(false);
    expect(validateConfig({ thresholds: { review: 0, fail: 100 } })).toBe(true);
  });
});
