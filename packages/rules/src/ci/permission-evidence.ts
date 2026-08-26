import type {
  WorkflowPermissionExpansion,
  WorkflowPermissionLevel,
} from "./permission-expansion.js";

export interface WorkflowPermissionEvidenceLocation {
  readonly path: string;
}

export interface WorkflowPermissionEvidence {
  readonly permission: string;
  readonly before: WorkflowPermissionLevel;
  readonly after: WorkflowPermissionLevel;
  readonly message: string;
  readonly location: WorkflowPermissionEvidenceLocation;
}

export function createWorkflowPermissionEvidence(
  workflowPath: string,
  expansions: readonly WorkflowPermissionExpansion[],
): readonly WorkflowPermissionEvidence[] {
  return expansions.map((expansion) => ({
    after: expansion.after,
    before: expansion.before,
    location: { path: workflowPath },
    message: `Workflow ${workflowPath} permission ${expansion.permission} expanded from ${expansion.before} to ${expansion.after}.`,
    permission: expansion.permission,
  }));
}
