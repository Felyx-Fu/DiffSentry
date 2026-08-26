import type { RuleMetadata } from "../metadata.js";

export const WORKFLOW_PERMISSION_CHANGE_METADATA: Readonly<RuleMetadata> =
  Object.freeze({
    category: "ci",
    defaultSeverity: "high",
    description:
      "Finds workflow permission changes that expand CI token access.",
    id: "ci.workflow-permission-change",
    name: "CI workflow permission change",
  });
