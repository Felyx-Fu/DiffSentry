export { DEFAULT_CONFIG } from "./defaults.js";
export type { ConfigFileSystem } from "./loader.js";
export { findConfigFile } from "./loader.js";
export type { ConfigLayer, MergedAgentGuardConfig } from "./merge.js";
export { mergeConfig } from "./merge.js";
export type { ConfigParseErrorCode } from "./parser.js";
export { ConfigParseError, parseConfigJson } from "./parser.js";
export {
  AGENTGUARD_CONFIG_FILE_NAME,
  AGENTGUARD_CONFIG_SCHEMA_FILE_NAME,
  CONFIG_RULE_ID_PATTERN,
  CONFIG_SEVERITIES,
  CONFIG_VERIFICATION_KEYS,
} from "./schema.js";
export type {
  ValidatedAgentGuardConfig,
  ValidatedRiskThresholds,
  ValidatedRuleOverride,
  ValidatedRuleOverrides,
  ValidatedVerificationConfig,
} from "./validator.js";
export { validateConfig } from "./validator.js";
