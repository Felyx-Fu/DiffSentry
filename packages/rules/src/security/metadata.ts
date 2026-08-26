import type { RuleMetadata } from "../metadata.js";

export const SECRET_EXPOSURE_METADATA: Readonly<RuleMetadata> = Object.freeze({
  category: "security",
  defaultSeverity: "critical",
  description:
    "Detects high-signal secret-like material in changed source files.",
  id: "security.secret-exposure",
  name: "Secret exposure",
});
