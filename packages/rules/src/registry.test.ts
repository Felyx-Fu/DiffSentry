import { describe, expect, it } from "vitest";
import { createRuleRegistry, type RuleRegistration } from "./registry.js";

interface TestContext {
  readonly enabled: boolean;
}

interface TestFinding {
  readonly ruleId: string;
}

function registration(
  id: "security.secret-exposure" | "testing.source-without-tests",
): RuleRegistration<TestContext, TestFinding> {
  return {
    metadata: {
      category: id.startsWith("security") ? "security" : "testing",
      defaultSeverity: "high",
      description: `Description for ${id}`,
      id,
      name: id,
    },
    rule: {
      id,
      supports: (context) => context.enabled,
      run: async () => [],
    },
  };
}

describe("createRuleRegistry", () => {
  it("returns a stable ID-ordered copy without mutating input order", () => {
    const input = [
      registration("testing.source-without-tests"),
      registration("security.secret-exposure"),
    ] as const;

    const registry = createRuleRegistry(input);

    expect(registry.map(({ metadata }) => metadata.id)).toEqual([
      "security.secret-exposure",
      "testing.source-without-tests",
    ]);
    expect(input.map(({ metadata }) => metadata.id)).toEqual([
      "testing.source-without-tests",
      "security.secret-exposure",
    ]);
  });

  it("returns an empty registry deterministically", () => {
    expect(createRuleRegistry([])).toEqual([]);
  });

  it("rejects duplicate IDs and metadata/rule mismatches", () => {
    expect(() =>
      createRuleRegistry([
        registration("security.secret-exposure"),
        registration("security.secret-exposure"),
      ]),
    ).toThrow("Duplicate rule ID");

    expect(() =>
      createRuleRegistry([
        {
          ...registration("security.secret-exposure"),
          rule: {
            ...registration("security.secret-exposure").rule,
            id: "testing.source-without-tests",
          },
        },
      ]),
    ).toThrow("does not match");
  });
});
