import { WORKFLOW_PERMISSION_CHANGE_METADATA } from "./ci/metadata.js";
import {
  type WorkflowPermissionFinding,
  type WorkflowPermissionRuleContext,
  workflowPermissionChangeRule,
} from "./ci/workflow-permission-change.js";
import { RUNTIME_DEPENDENCY_ADDED_METADATA } from "./dependency/metadata.js";
import {
  type RuntimeDependencyFinding,
  type RuntimeDependencyRuleContext,
  runtimeDependencyAddedRule,
} from "./dependency/runtime-dependency-added.js";
import { type RuleMetadata, validateRuleMetadata } from "./metadata.js";
import { SECRET_EXPOSURE_METADATA } from "./security/metadata.js";
import {
  type SecretExposureFinding,
  type SecretExposureRuleContext,
  secretExposureRule,
} from "./security/secret-exposure.js";
import {
  type AuthWithoutTestsContext,
  type AuthWithoutTestsFinding,
  authWithoutTestsRule,
} from "./testing/auth-without-tests.js";
import { AUTH_WITHOUT_TESTS_METADATA } from "./testing/auth-without-tests-metadata.js";
import type { SourceWithoutTestsContext } from "./testing/source-without-tests.js";
import { SOURCE_WITHOUT_TESTS_METADATA } from "./testing/source-without-tests-metadata.js";
import {
  type SourceWithoutTestsFinding,
  sourceWithoutTestsRule,
} from "./testing/source-without-tests-rule.js";

export interface RegistryRule<TContext, TResult> {
  readonly id: string;
  supports(context: TContext): boolean;
  run(context: TContext): Promise<readonly TResult[]>;
}

export interface RuleRegistration<TContext, TResult> {
  readonly metadata: RuleMetadata;
  readonly rule: RegistryRule<TContext, TResult>;
}

const SECRET_EXPOSURE_RULES: readonly RuleRegistration<
  SecretExposureRuleContext,
  SecretExposureFinding
>[] = createRuleRegistry([
  {
    metadata: SECRET_EXPOSURE_METADATA,
    rule: secretExposureRule,
  },
]);

const WORKFLOW_PERMISSION_RULES: readonly RuleRegistration<
  WorkflowPermissionRuleContext,
  WorkflowPermissionFinding
>[] = createRuleRegistry([
  {
    metadata: WORKFLOW_PERMISSION_CHANGE_METADATA,
    rule: workflowPermissionChangeRule,
  },
]);

const RUNTIME_DEPENDENCY_RULES: readonly RuleRegistration<
  RuntimeDependencyRuleContext,
  RuntimeDependencyFinding
>[] = createRuleRegistry([
  {
    metadata: RUNTIME_DEPENDENCY_ADDED_METADATA,
    rule: runtimeDependencyAddedRule,
  },
]);

const AUTH_WITHOUT_TESTS_RULES: readonly RuleRegistration<
  AuthWithoutTestsContext,
  AuthWithoutTestsFinding
>[] = createRuleRegistry([
  {
    metadata: AUTH_WITHOUT_TESTS_METADATA,
    rule: authWithoutTestsRule,
  },
]);

const SOURCE_WITHOUT_TESTS_RULES: readonly RuleRegistration<
  SourceWithoutTestsContext,
  SourceWithoutTestsFinding
>[] = createRuleRegistry([
  {
    metadata: SOURCE_WITHOUT_TESTS_METADATA,
    rule: sourceWithoutTestsRule,
  },
]);

export const BUILT_IN_RULES = [
  ...WORKFLOW_PERMISSION_RULES,
  ...RUNTIME_DEPENDENCY_RULES,
  ...SECRET_EXPOSURE_RULES,
  ...AUTH_WITHOUT_TESTS_RULES,
  ...SOURCE_WITHOUT_TESTS_RULES,
] as const;

function compareRuleIds(left: string, right: string): number {
  if (left < right) {
    return -1;
  }
  if (left > right) {
    return 1;
  }
  return 0;
}

export function createRuleRegistry<TContext, TResult>(
  registrations: readonly RuleRegistration<TContext, TResult>[],
): readonly RuleRegistration<TContext, TResult>[] {
  const ids = new Set<string>();

  for (const registration of registrations) {
    if (!validateRuleMetadata(registration.metadata)) {
      throw new Error("Invalid rule metadata");
    }
    if (registration.rule.id !== registration.metadata.id) {
      throw new Error("Rule ID does not match its metadata ID");
    }
    if (ids.has(registration.metadata.id)) {
      throw new Error(`Duplicate rule ID: ${registration.metadata.id}`);
    }
    ids.add(registration.metadata.id);
  }

  return [...registrations].sort((left, right) =>
    compareRuleIds(left.metadata.id, right.metadata.id),
  );
}
