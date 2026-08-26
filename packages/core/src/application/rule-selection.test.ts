import { describe, expect, it } from "vitest";
import type { Rule } from "../ports/rule.js";
import { RuleExecutionCoordinator } from "./rule-execution-coordinator.js";
import { selectEnabledRules } from "./rule-selection.js";

interface TestContext {
  readonly enabled: boolean;
}

interface TestFinding {
  readonly ruleId: string;
}

function createRule(
  id: string,
  onRun: () => void,
): Rule<TestContext, TestFinding> {
  return {
    id,
    supports: () => true,
    run: async () => {
      onRun();
      return [{ ruleId: id }];
    },
  };
}

describe("selectEnabledRules", () => {
  it("keeps rules enabled by default and honors explicit enablement", () => {
    const rules = [createRule("testing.first", () => {})];

    expect(
      selectEnabledRules(rules, { "testing.first": { enabled: true } }),
    ).toHaveLength(1);
    expect(selectEnabledRules(rules)).toHaveLength(1);
  });

  it("filters a disabled rule before execution", async () => {
    let disabledRuns = 0;
    let enabledRuns = 0;
    const rules = [
      createRule("testing.disabled", () => {
        disabledRuns += 1;
      }),
      createRule("testing.enabled", () => {
        enabledRuns += 1;
      }),
    ];
    const enabledRules = selectEnabledRules(rules, {
      "testing.disabled": { enabled: false },
    });

    await expect(
      new RuleExecutionCoordinator(enabledRules).execute({ enabled: true }),
    ).resolves.toEqual({
      failedRuleIds: [],
      findings: [{ ruleId: "testing.enabled" }],
    });
    expect(disabledRuns).toBe(0);
    expect(enabledRuns).toBe(1);
  });

  it("ignores overrides for unknown rule IDs", () => {
    const rules = [createRule("testing.first", () => {})];

    expect(
      selectEnabledRules(rules, { "testing.unknown": { enabled: false } }),
    ).toHaveLength(1);
  });
});
