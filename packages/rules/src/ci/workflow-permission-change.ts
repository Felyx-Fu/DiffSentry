import { WORKFLOW_PERMISSION_CHANGE_METADATA } from "./metadata.js";
import {
  createWorkflowPermissionEvidence,
  type WorkflowPermissionEvidence,
} from "./permission-evidence.js";
import { detectWorkflowPermissionExpansions } from "./permission-expansion.js";

export interface WorkflowPermissionRuleContext {
  readonly workflowPath: string;
  readonly beforeContents: string;
  readonly afterContents: string;
}

export interface WorkflowPermissionFinding {
  readonly ruleId: string;
  readonly severity: typeof WORKFLOW_PERMISSION_CHANGE_METADATA.defaultSeverity;
  readonly title: string;
  readonly message: string;
  readonly evidence: readonly WorkflowPermissionEvidence[];
  readonly confidence: number;
  readonly location: WorkflowPermissionEvidence["location"];
}

export const workflowPermissionChangeRule = {
  id: WORKFLOW_PERMISSION_CHANGE_METADATA.id,
  supports: (context: WorkflowPermissionRuleContext): boolean =>
    context.workflowPath.length > 0,
  run: async (
    context: WorkflowPermissionRuleContext,
  ): Promise<readonly WorkflowPermissionFinding[]> => {
    const expansions = detectWorkflowPermissionExpansions(
      context.beforeContents,
      context.afterContents,
    );
    const evidence = createWorkflowPermissionEvidence(
      context.workflowPath,
      expansions,
    );

    return evidence.map((permissionEvidence) => ({
      confidence: 1,
      evidence: [permissionEvidence],
      location: permissionEvidence.location,
      message: permissionEvidence.message,
      ruleId: WORKFLOW_PERMISSION_CHANGE_METADATA.id,
      severity: WORKFLOW_PERMISSION_CHANGE_METADATA.defaultSeverity,
      title: WORKFLOW_PERMISSION_CHANGE_METADATA.name,
    }));
  },
};
