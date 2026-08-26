import { describe, expect, it } from "vitest";
import { DEFAULT_CONFIG } from "./defaults.js";
import { mergeConfig } from "./merge.js";

describe("mergeConfig", () => {
  it("applies CLI over config over defaults at field level", () => {
    expect(
      mergeConfig(
        {
          verification: { lint: false },
          rules: {
            "security.secret-exposure": {
              enabled: false,
              severity: "high",
            },
          },
          thresholds: { fail: 60, review: 20 },
        },
        {
          verification: { lint: true },
          rules: { "security.secret-exposure": { severity: "critical" } },
          thresholds: { fail: 80 },
        },
      ),
    ).toEqual({
      verification: {
        build: false,
        lint: true,
        test: true,
        typecheck: true,
      },
      rules: {
        "security.secret-exposure": {
          enabled: false,
          severity: "critical",
        },
      },
      thresholds: { fail: 80, review: 20 },
    });
  });

  it("does not mutate defaults or input layers", () => {
    const configLayer = {
      rules: { "testing.auth-without-tests": { enabled: false } },
      thresholds: { fail: 60, review: 20 },
    } as const;
    const cliLayer = {
      verification: { build: true },
    } as const;

    const result = mergeConfig(configLayer, cliLayer);

    expect(result).not.toBe(DEFAULT_CONFIG);
    expect(result.rules).not.toBe(configLayer.rules);
    expect(result.verification).not.toBe(cliLayer.verification);
    expect(DEFAULT_CONFIG).toEqual({
      verification: { build: false, lint: true, test: true, typecheck: true },
      rules: {},
      thresholds: { fail: 50, review: 15 },
    });
    expect(configLayer).toEqual({
      rules: { "testing.auth-without-tests": { enabled: false } },
      thresholds: { fail: 60, review: 20 },
    });
  });

  it("rejects a merged threshold pair that violates the invariant", () => {
    expect(() =>
      mergeConfig(
        { thresholds: { review: 60, fail: 70 } },
        {
          thresholds: { fail: 50 },
        },
      ),
    ).toThrow("Merged configuration");
  });
});
