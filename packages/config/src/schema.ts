export const AGENTGUARD_CONFIG_FILE_NAME = "agentguard.config.json" as const;
export const AGENTGUARD_CONFIG_SCHEMA_FILE_NAME =
  "agentguard.config.schema.json" as const;

export const CONFIG_VERIFICATION_KEYS = [
  "test",
  "lint",
  "typecheck",
  "build",
] as const;

export const CONFIG_SEVERITIES = [
  "info",
  "low",
  "medium",
  "high",
  "critical",
] as const;

export const CONFIG_RULE_ID_PATTERN =
  /^(?:ci|dependency|security|testing)\.[a-z0-9]+(?:-[a-z0-9]+)*$/;
