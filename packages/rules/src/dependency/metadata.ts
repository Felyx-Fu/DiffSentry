import type { RuleMetadata } from "../metadata.js";

export const RUNTIME_DEPENDENCY_ADDED_METADATA: Readonly<RuleMetadata> =
  Object.freeze({
    category: "dependency",
    defaultSeverity: "medium",
    description:
      "Finds additions to runtime dependencies in project manifests.",
    id: "dependency.runtime-dependency-added",
    name: "Runtime dependency added",
  });
