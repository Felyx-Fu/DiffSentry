import { describe, expect, it } from "vitest";
import type { Rule } from "../ports/rule.js";
import { RuleExecutionCoordinator } from "./rule-execution-coordinator.js";

interface TestContext {
  readonly enabled: boolean;
}

interface TestFinding {
  readonly ruleId: string;
}

describe("RuleExecutionCoordinator", () => {
  it("runs supported rules in order and aggregates their findings", async () => {
    const executed: string[] = [];
    const rules: readonly Rule<TestContext, TestFinding>[] = [
      {
        id: "testing.first",
        supports: () => true,
        run: async () => {
          executed.push("testing.first");
          return [{ ruleId: "testing.first" }];
        },
      },
      {
        id: "testing.unsupported",
        supports: () => false,
        run: async () => {
          executed.push("testing.unsupported");
          return [{ ruleId: "testing.unsupported" }];
        },
      },
      {
        id: "testing.last",
        supports: () => true,
        run: async () => {
          executed.push("testing.last");
          return [{ ruleId: "testing.last" }];
        },
      },
    ];

    await expect(
      new RuleExecutionCoordinator(rules).execute({ enabled: true }),
    ).resolves.toEqual({
      failedRuleIds: [],
      findings: [{ ruleId: "testing.first" }, { ruleId: "testing.last" }],
    });
    expect(executed).toEqual(["testing.first", "testing.last"]);
  });

  it("isolates supports and run failures and continues unrelated rules", async () => {
    const rules: readonly Rule<TestContext, TestFinding>[] = [
      {
        id: "testing.supports-failure",
        supports: () => {
          throw new Error("supports failed");
        },
        run: async () => [{ ruleId: "should-not-run" }],
      },
      {
        id: "testing.run-failure",
        supports: () => true,
        run: async () => {
          throw new Error("run failed");
        },
      },
      {
        id: "testing.after-failure",
        supports: () => true,
        run: async () => [{ ruleId: "testing.after-failure" }],
      },
    ];

    await expect(
      new RuleExecutionCoordinator(rules).execute({ enabled: true }),
    ).resolves.toEqual({
      failedRuleIds: ["testing.supports-failure", "testing.run-failure"],
      findings: [{ ruleId: "testing.after-failure" }],
    });
  });

  it("returns an empty result for an empty registry", async () => {
    await expect(
      new RuleExecutionCoordinator<TestContext, TestFinding>([]).execute({
        enabled: true,
      }),
    ).resolves.toEqual({ failedRuleIds: [], findings: [] });
  });
});
