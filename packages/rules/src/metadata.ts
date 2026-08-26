export const RULE_CATEGORIES = [
  "ci",
  "dependency",
  "security",
  "testing",
] as const;

export type RuleCategory = (typeof RULE_CATEGORIES)[number];

export const RULE_SEVERITIES = [
  "critical",
  "high",
  "info",
  "low",
  "medium",
] as const;

export type RuleSeverity = (typeof RULE_SEVERITIES)[number];

export interface RuleMetadata {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: RuleCategory;
  readonly defaultSeverity: RuleSeverity;
}

const RULE_ID_PATTERN =
  /^(?:ci|dependency|security|testing)\.[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isRuleCategory(value: unknown): value is RuleCategory {
  return (
    typeof value === "string" &&
    (RULE_CATEGORIES as readonly string[]).includes(value)
  );
}

function isRuleSeverity(value: unknown): value is RuleSeverity {
  return (
    typeof value === "string" &&
    (RULE_SEVERITIES as readonly string[]).includes(value)
  );
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function validateRuleMetadata(value: unknown): value is RuleMetadata {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isNonEmptyString(value.id) &&
    RULE_ID_PATTERN.test(value.id) &&
    isNonEmptyString(value.name) &&
    isNonEmptyString(value.description) &&
    isRuleCategory(value.category) &&
    value.id.startsWith(`${value.category}.`) &&
    isRuleSeverity(value.defaultSeverity)
  );
}
