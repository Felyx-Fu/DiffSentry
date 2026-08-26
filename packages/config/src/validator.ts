import {
  CONFIG_RULE_ID_PATTERN,
  CONFIG_SEVERITIES,
  CONFIG_VERIFICATION_KEYS,
} from "./schema.js";

export interface ValidatedVerificationConfig {
  readonly test?: boolean;
  readonly lint?: boolean;
  readonly typecheck?: boolean;
  readonly build?: boolean;
}

export interface ValidatedRuleOverride {
  readonly enabled?: boolean;
  readonly severity?: (typeof CONFIG_SEVERITIES)[number];
}

export type ValidatedRuleOverrides = Readonly<
  Record<string, ValidatedRuleOverride>
>;

export interface ValidatedRiskThresholds {
  readonly review: number;
  readonly fail: number;
}

export interface ValidatedDiffSentryConfig {
  readonly verification?: ValidatedVerificationConfig;
  readonly rules?: ValidatedRuleOverrides;
  readonly thresholds?: ValidatedRiskThresholds;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasOnlyKeys(
  value: Record<string, unknown>,
  allowedKeys: readonly string[],
): boolean {
  const allowed = new Set(allowedKeys);
  return Object.keys(value).every((key) => allowed.has(key));
}

function isSeverity(
  value: unknown,
): value is ValidatedRuleOverride["severity"] {
  return CONFIG_SEVERITIES.some((severity) => severity === value);
}

function isVerificationConfig(
  value: unknown,
): value is ValidatedVerificationConfig {
  if (!isRecord(value) || !hasOnlyKeys(value, CONFIG_VERIFICATION_KEYS)) {
    return false;
  }

  return Object.values(value).every((entry) => typeof entry === "boolean");
}

function isRuleOverride(value: unknown): value is ValidatedRuleOverride {
  if (!isRecord(value) || !hasOnlyKeys(value, ["enabled", "severity"])) {
    return false;
  }

  if ("enabled" in value && typeof value.enabled !== "boolean") {
    return false;
  }
  if ("severity" in value && !isSeverity(value.severity)) {
    return false;
  }

  return true;
}

function isRuleOverrides(value: unknown): value is ValidatedRuleOverrides {
  if (!isRecord(value)) {
    return false;
  }

  return Object.entries(value).every(
    ([ruleId, override]) =>
      CONFIG_RULE_ID_PATTERN.test(ruleId) && isRuleOverride(override),
  );
}

function isRiskThresholds(value: unknown): value is ValidatedRiskThresholds {
  if (
    !isRecord(value) ||
    !hasOnlyKeys(value, ["review", "fail"]) ||
    !("review" in value) ||
    !("fail" in value)
  ) {
    return false;
  }

  const review = value.review;
  const fail = value.fail;
  return (
    typeof review === "number" &&
    Number.isFinite(review) &&
    typeof fail === "number" &&
    Number.isFinite(fail) &&
    0 <= review &&
    review < fail &&
    fail <= 100
  );
}

export function validateConfig(
  value: unknown,
): value is ValidatedDiffSentryConfig {
  if (
    !isRecord(value) ||
    !hasOnlyKeys(value, ["verification", "rules", "thresholds"])
  ) {
    return false;
  }

  if ("verification" in value && !isVerificationConfig(value.verification)) {
    return false;
  }
  if ("rules" in value && !isRuleOverrides(value.rules)) {
    return false;
  }
  if ("thresholds" in value && !isRiskThresholds(value.thresholds)) {
    return false;
  }

  return true;
}
