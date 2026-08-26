import { describe, expect, it } from "vitest";
import type { Verifier } from "./verifier.js";

interface TestContext {
  readonly enabled: boolean;
}

interface TestResult {
  readonly status: "passed" | "skipped";
}

describe("Verifier port", () => {
  it("supports small composable verifier test doubles", async () => {
    const verifier: Verifier<TestContext, TestResult> = {
      id: "test-verifier",
      supports: (context) => context.enabled,
      run: async () => ({ status: "passed" }),
    };

    expect(verifier.id).toBe("test-verifier");
    expect(verifier.supports({ enabled: true })).toBe(true);
    await expect(verifier.run({ enabled: true })).resolves.toEqual({
      status: "passed",
    });
  });
});
