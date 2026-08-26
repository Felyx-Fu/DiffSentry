import { describe, expect, it } from "vitest";
import { hasTestVerificationIntent } from "./test-intent.js";

const scriptsWithoutTest = {
  test: null,
  lint: null,
  typecheck: null,
  build: null,
} as const;

describe("hasTestVerificationIntent", () => {
  it("returns true when the known test script is present", () => {
    expect(
      hasTestVerificationIntent({
        ...scriptsWithoutTest,
        test: "vitest run",
      }),
    ).toBe(true);
  });

  it("returns false when the known test script is absent", () => {
    expect(hasTestVerificationIntent(scriptsWithoutTest)).toBe(false);
  });

  it("returns false for an empty test script", () => {
    expect(
      hasTestVerificationIntent({
        ...scriptsWithoutTest,
        test: "   ",
      }),
    ).toBe(false);
  });
});
