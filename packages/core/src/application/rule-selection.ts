import type { Rule } from "../ports/rule.js";

export interface RuleEnablementOverride {
  readonly enabled?: boolean;
}

export type RuleEnablementOverrides = Readonly<
  Record<string, RuleEnablementOverride>
>;

export function selectEnabledRules<TContext, TResult>(
  rules: readonly Rule<TContext, TResult>[],
  overrides: RuleEnablementOverrides = {},
): readonly Rule<TContext, TResult>[] {
  return rules.filter((rule) => overrides[rule.id]?.enabled !== false);
}
