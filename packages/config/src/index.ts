export { DEFAULT_CONFIG } from "./defaults.js";
export type { ConfigFileSystem } from "./loader.js";
export { findConfigFile } from "./loader.js";
export type { ConfigLayer, MergedDiffSentryConfig } from "./merge.js";
export { mergeConfig } from "./merge.js";
export type { ConfigParseErrorCode } from "./parser.js";
export { ConfigParseError, parseConfigJson } from "./parser.js";
export {
  CONFIG_RULE_ID_PATTERN,
  CONFIG_SEVERITIES,
  CONFIG_VERIFICATION_KEYS,
  DIFFSENTRY_CONFIG_FILE_NAME,
  DIFFSENTRY_CONFIG_SCHEMA_FILE_NAME,
} from "./schema.js";
export type {
  ValidatedDiffSentryConfig,
  ValidatedRiskThresholds,
  ValidatedRuleOverride,
  ValidatedRuleOverrides,
  ValidatedVerificationConfig,
} from "./validator.js";
export { validateConfig } from "./validator.js";
