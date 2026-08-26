import { BUILT_IN_RULES, type RuleMetadata } from "@felyx-fu/diffsentry-rules";

interface ExplainableRuleRegistration {
  readonly metadata: RuleMetadata;
}

export interface ExplainCommandOptions {
  readonly ruleId: string;
  readonly rules?: readonly ExplainableRuleRegistration[];
}

export interface KnownRuleExplanation {
  readonly kind: "known";
  readonly metadata: RuleMetadata;
}

export interface UnknownRuleExplanation {
  readonly kind: "unknown";
  readonly ruleId: string;
}

export type ExplainCommandOutcome =
  | KnownRuleExplanation
  | UnknownRuleExplanation;

export function runExplainCommand(
  options: ExplainCommandOptions,
): ExplainCommandOutcome {
  const rules = options.rules ?? BUILT_IN_RULES;
  const registration = rules.find(
    (candidate) => candidate.metadata.id === options.ruleId,
  );

  if (registration === undefined) {
    return { kind: "unknown", ruleId: options.ruleId };
  }

  return { kind: "known", metadata: registration.metadata };
}
