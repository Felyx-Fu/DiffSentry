import { detectSecretPatterns } from "./detector.js";
import { SECRET_EXPOSURE_METADATA } from "./metadata.js";
import type { RedactedSecretEvidence } from "./redaction.js";
import { createRedactedSecretEvidence } from "./redaction.js";

export interface SecretRuleFile {
  readonly path: string;
  readonly contents: string;
}

export interface SecretExposureRuleContext {
  readonly changedFiles: readonly SecretRuleFile[];
}

export interface SecretExposureFinding {
  readonly ruleId: string;
  readonly severity: typeof SECRET_EXPOSURE_METADATA.defaultSeverity;
  readonly title: string;
  readonly message: string;
  readonly evidence: readonly RedactedSecretEvidence[];
  readonly confidence: number;
  readonly location?: RedactedSecretEvidence["location"];
}

export const secretExposureRule = {
  id: SECRET_EXPOSURE_METADATA.id,
  supports: (context: SecretExposureRuleContext): boolean =>
    context.changedFiles.length > 0,
  run: async (
    context: SecretExposureRuleContext,
  ): Promise<readonly SecretExposureFinding[]> => {
    const findings: SecretExposureFinding[] = [];

    for (const file of context.changedFiles) {
      const matches = detectSecretPatterns(file.contents);
      if (matches.length === 0) {
        continue;
      }

      const evidence = createRedactedSecretEvidence(
        file.path,
        file.contents,
        matches,
      );
      const firstEvidence = evidence[0];
      if (firstEvidence === undefined) {
        continue;
      }
      findings.push({
        confidence: 1,
        evidence,
        location: firstEvidence.location,
        message: `High-signal secret-like material detected in ${file.path}; matched values are redacted.`,
        ruleId: SECRET_EXPOSURE_METADATA.id,
        severity: SECRET_EXPOSURE_METADATA.defaultSeverity,
        title: SECRET_EXPOSURE_METADATA.name,
      });
    }

    return findings;
  },
};
