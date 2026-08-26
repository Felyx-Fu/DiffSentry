import { describe, expect, it } from "vitest";
import { hasLintVerificationIntent } from "./lint-intent.js";

const scriptsWithoutLint = {
  test: null,
  lint: null,
  typecheck: null,
  build: null,
} as const;

describe("hasLintVerificationIntent", () => {
  it("returns true when the known lint script is present", () => {
    expect(
      hasLintVerificationIntent({
        ...scriptsWithoutLint,
        lint: "biome check .",
      }),
    ).toBe(true);
  });

  it("returns false when the known lint script is absent", () => {
    expect(hasLintVerificationIntent(scriptsWithoutLint)).toBe(false);
  });

  it("returns false for an empty lint script", () => {
    expect(
      hasLintVerificationIntent({
        ...scriptsWithoutLint,
        lint: "   ",
      }),
    ).toBe(false);
  });
});
