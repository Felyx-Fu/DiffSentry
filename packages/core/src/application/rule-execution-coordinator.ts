import type { Rule } from "../ports/rule.js";

export interface RuleExecutionResult<TResult> {
  readonly findings: readonly TResult[];
  readonly failedRuleIds: readonly string[];
}

export class RuleExecutionCoordinator<TContext, TResult> {
  constructor(private readonly rules: readonly Rule<TContext, TResult>[]) {}

  async execute(context: TContext): Promise<RuleExecutionResult<TResult>> {
    const findings: TResult[] = [];
    const failedRuleIds: string[] = [];

    for (const rule of this.rules) {
      let supported: boolean;
      try {
        supported = rule.supports(context);
      } catch {
        failedRuleIds.push(rule.id);
        continue;
      }

      if (!supported) {
        continue;
      }

      try {
        findings.push(...(await rule.run(context)));
      } catch {
        failedRuleIds.push(rule.id);
      }
    }

    return { failedRuleIds, findings };
  }
}
