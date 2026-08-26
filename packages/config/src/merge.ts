import { DEFAULT_CONFIG } from "./defaults.js";
import type {
  ValidatedRiskThresholds,
  ValidatedRuleOverride,
  ValidatedVerificationConfig,
} from "./validator.js";
import { validateConfig } from "./validator.js";

export interface ConfigLayer {
  readonly verification?: Partial<ValidatedVerificationConfig>;
  readonly rules?: Readonly<Record<string, Partial<ValidatedRuleOverride>>>;
  readonly thresholds?: Partial<ValidatedRiskThresholds>;
}

export interface MergedAgentGuardConfig {
  readonly verification: Required<ValidatedVerificationConfig>;
  readonly rules: Readonly<Record<string, ValidatedRuleOverride>>;
  readonly thresholds: ValidatedRiskThresholds;
}

function mergeRuleOverride(
  configOverride: Partial<ValidatedRuleOverride> | undefined,
  cliOverride: Partial<ValidatedRuleOverride> | undefined,
): ValidatedRuleOverride {
  const merged: {
    enabled?: boolean;
    severity?: Exclude<ValidatedRuleOverride["severity"], undefined>;
  } = {};

  if (configOverride?.enabled !== undefined) {
    merged.enabled = configOverride.enabled;
  }
  if (configOverride?.severity !== undefined) {
    merged.severity = configOverride.severity;
  }
  if (cliOverride?.enabled !== undefined) {
    merged.enabled = cliOverride.enabled;
  }
  if (cliOverride?.severity !== undefined) {
    merged.severity = cliOverride.severity;
  }

  return merged;
}

function mergeRules(
  configRules: ConfigLayer["rules"],
  cliRules: ConfigLayer["rules"],
): Readonly<Record<string, ValidatedRuleOverride>> {
  const ruleIds = new Set<string>([
    ...Object.keys(configRules ?? {}),
    ...Object.keys(cliRules ?? {}),
  ]);
  const merged: Record<string, ValidatedRuleOverride> = {};

  for (const ruleId of [...ruleIds].sort()) {
    merged[ruleId] = mergeRuleOverride(
      configRules?.[ruleId],
      cliRules?.[ruleId],
    );
  }

  return merged;
}

export function mergeConfig(
  configLayer: ConfigLayer = {},
  cliLayer: ConfigLayer = {},
): MergedAgentGuardConfig {
  const verification = {
    build:
      cliLayer.verification?.build ??
      configLayer.verification?.build ??
      DEFAULT_CONFIG.verification.build,
    lint:
      cliLayer.verification?.lint ??
      configLayer.verification?.lint ??
      DEFAULT_CONFIG.verification.lint,
    test:
      cliLayer.verification?.test ??
      configLayer.verification?.test ??
      DEFAULT_CONFIG.verification.test,
    typecheck:
      cliLayer.verification?.typecheck ??
      configLayer.verification?.typecheck ??
      DEFAULT_CONFIG.verification.typecheck,
  };
  const rules = mergeRules(configLayer.rules, cliLayer.rules);
  const thresholds = {
    fail:
      cliLayer.thresholds?.fail ??
      configLayer.thresholds?.fail ??
      DEFAULT_CONFIG.thresholds.fail,
    review:
      cliLayer.thresholds?.review ??
      configLayer.thresholds?.review ??
      DEFAULT_CONFIG.thresholds.review,
  };
  const merged = { rules, thresholds, verification };

  if (!validateConfig(merged)) {
    throw new RangeError(
      "Merged configuration must satisfy the AgentGuard v0.1 schema",
    );
  }

  return merged;
}
