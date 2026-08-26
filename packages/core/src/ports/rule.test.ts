import { describe, expect, it } from "vitest";
import type { Rule } from "./rule.js";

interface TestContext {
  readonly enabled: boolean;
}

interface TestFinding {
  readonly ruleId: string;
}

describe("Rule port", () => {
  it("supports a context and returns findings asynchronously", async () => {
    const rule: Rule<TestContext, TestFinding> = {
      id: "testing.example",
      supports: (context) => context.enabled,
      run: async (context) =>
        context.enabled ? [{ ruleId: "testing.example" }] : [],
    };

    expect(rule.supports({ enabled: true })).toBe(true);
    await expect(rule.run({ enabled: true })).resolves.toEqual([
      { ruleId: "testing.example" },
    ]);
  });

  it("can decline an unsupported context without producing findings", async () => {
    const rule: Rule<TestContext, TestFinding> = {
      id: "testing.example",
      supports: () => false,
      run: async () => [],
    };

    expect(rule.supports({ enabled: false })).toBe(false);
    await expect(rule.run({ enabled: false })).resolves.toEqual([]);
  });
});
