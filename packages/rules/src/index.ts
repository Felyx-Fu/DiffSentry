export { WORKFLOW_PERMISSION_CHANGE_METADATA } from "./ci/metadata.js";
export type {
  WorkflowPermissionEvidence,
  WorkflowPermissionEvidenceLocation,
} from "./ci/permission-evidence.js";
export { createWorkflowPermissionEvidence } from "./ci/permission-evidence.js";
export type {
  WorkflowPermissionExpansion,
  WorkflowPermissionLevel,
} from "./ci/permission-expansion.js";
export { detectWorkflowPermissionExpansions } from "./ci/permission-expansion.js";
export type {
  WorkflowPermissionFinding,
  WorkflowPermissionRuleContext,
} from "./ci/workflow-permission-change.js";
export { workflowPermissionChangeRule } from "./ci/workflow-permission-change.js";
export { RUNTIME_DEPENDENCY_ADDED_METADATA } from "./dependency/metadata.js";
export type { PackageDependencyDelta } from "./dependency/package-dependency-delta.js";
export { parsePackageDependencyDelta } from "./dependency/package-dependency-delta.js";
export type {
  RuntimeDependencyEvidence,
  RuntimeDependencyEvidenceLocation,
  RuntimeDependencyFinding,
  RuntimeDependencyRuleContext,
} from "./dependency/runtime-dependency-added.js";
export {
  createRuntimeDependencyEvidence,
  runtimeDependencyAddedRule,
} from "./dependency/runtime-dependency-added.js";
export type {
  RuleCategory,
  RuleMetadata,
  RuleSeverity,
} from "./metadata.js";
export {
  RULE_CATEGORIES,
  RULE_SEVERITIES,
  validateRuleMetadata,
} from "./metadata.js";
export type {
  RegistryRule,
  RuleRegistration,
} from "./registry.js";
export { BUILT_IN_RULES, createRuleRegistry } from "./registry.js";
export type { SecretMatch, SecretPatternId } from "./security/detector.js";
export { detectSecretPatterns } from "./security/detector.js";
export { SECRET_EXPOSURE_METADATA } from "./security/metadata.js";
export type {
  RedactedSecretEvidence,
  SecretEvidenceLocation,
} from "./security/redaction.js";
export { createRedactedSecretEvidence } from "./security/redaction.js";
export type {
  SecretExposureFinding,
  SecretExposureRuleContext,
  SecretRuleFile,
} from "./security/secret-exposure.js";
export { secretExposureRule } from "./security/secret-exposure.js";
export { isAuthRelatedPath } from "./testing/auth-path-matcher.js";
export { isRelatedAuthTestPath } from "./testing/auth-test-path-matcher.js";
export type {
  AuthWithoutTestsContext,
  AuthWithoutTestsDetection,
  AuthWithoutTestsEvidence,
  AuthWithoutTestsEvidenceLocation,
  AuthWithoutTestsFinding,
} from "./testing/auth-without-tests.js";
export {
  authWithoutTestsRule,
  createAuthWithoutTestsEvidence,
  detectAuthWithoutTests,
} from "./testing/auth-without-tests.js";
export { AUTH_WITHOUT_TESTS_METADATA } from "./testing/auth-without-tests-metadata.js";
export type {
  SourceWithoutTestsContext,
  SourceWithoutTestsDetection,
  TestingChangedFile,
  TestingFileCategory,
} from "./testing/source-without-tests.js";
export { detectSourceWithoutTests } from "./testing/source-without-tests.js";
export type {
  SourceWithoutTestsEvidence,
  SourceWithoutTestsEvidenceLocation,
} from "./testing/source-without-tests-evidence.js";
export { createSourceWithoutTestsEvidence } from "./testing/source-without-tests-evidence.js";
export { SOURCE_WITHOUT_TESTS_METADATA } from "./testing/source-without-tests-metadata.js";
export type { SourceWithoutTestsFinding } from "./testing/source-without-tests-rule.js";
export { sourceWithoutTestsRule } from "./testing/source-without-tests-rule.js";
