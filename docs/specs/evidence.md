# DiffSentry v0.1 evidence, finding, and report semantics

DiffSentry separates an observed fact from the rule claim that interprets it,
and separates both from the final report and verdict. This page describes the
current public report shape. It is versioned documentation, not a promise that
the shape will remain unchanged forever.

## Versioning

Every `DiffSentryReport` carries two version values:

- `version` identifies the DiffSentry product/runtime version, currently
  `0.1.0` in the repository examples;
- `schemaVersion` identifies the report data shape, currently the numeric
  value `1`.

Consumers must inspect `schemaVersion` before deserializing or relying on
fields. A future incompatible report shape must use a new schema version and
document its migration or compatibility behavior. Do not infer permanent
field stability from the current v0.1 value.

The current report schema is assembled by the core application layer and is
then passed unchanged to the presentation renderers.

## Evidence

Evidence is a factual explanation attached to a finding. It has exactly one
required field and one optional field:

| Field | Type | Meaning |
| --- | --- | --- |
| `message` | string | The observed fact or bounded explanation. |
| `location` | `EvidenceLocation` | Optional path and source position associated with the fact. |

An `EvidenceLocation` contains:

| Field | Type | Meaning |
| --- | --- | --- |
| `path` | string | Repository-relative or otherwise reported file path. |
| `startLine` | number, optional | Start line when the evidence identifies a position. |
| `startColumn` | number, optional | Start column when available. |
| `endLine` | number, optional | End line for a range. |
| `endColumn` | number, optional | End column for a range. |

Locations are optional because some evidence is repository-level or has no
precise source position. When a location is available, prefer the narrowest
observed path or range and keep it consistent with the evidence message.

Evidence should describe facts such as:

- a changed path and change type;
- a related test being present or absent;
- a verifier status or bounded output summary;
- a dependency delta;
- a workflow permission delta.

Evidence is not a place to add an inferred exploitability claim, package
reputation, network lookup, or an unobserved conclusion. For secret-like
material, identify the path and detector and redact the matched value. Never
print a full detected secret in a finding, report, test snapshot, or annotation.

## Findings

A finding is a structured rule claim:

| Field | Type | Meaning |
| --- | --- | --- |
| `ruleId` | string | Stable identifier of the rule that emitted the claim. |
| `severity` | `info \| low \| medium \| high \| critical` | The rule's v0.1 severity. |
| `title` | string | Short human-readable finding title. |
| `message` | string | Explanation of the claim. |
| `evidence` | array of `Evidence` | Factual support for the claim; the array may be empty in the public contract. |
| `confidence` | number | Evidence metadata retained with the finding. It does not affect v0.1 `RiskScore`. |
| `location` | `EvidenceLocation`, optional | Optional primary location for the finding. |

The conceptual relationship is:

```text
Finding = Claim + Severity + Evidence + Confidence
```

`finding.location` is a finding-level primary location. Each evidence item may
also carry its own location, which is preferable when a finding has multiple
facts or ranges. Presentation adapters may use the finding location first and
fall back to evidence locations for annotations; a missing or invalid location
must not be fabricated.

Severity contributes to the v0.1 risk score using only these fixed weights:

| Severity | Weight |
| --- | ---: |
| `info` | 0 |
| `low` | 5 |
| `medium` | 15 |
| `high` | 30 |
| `critical` | 50 |

Confidence is intentionally not a multiplier, normalization factor, category
scale, or risk input in v0.1.

## Changes and project context

The report carries the context needed to interpret a finding:

### `ProjectContext`

- `repositoryRoot`: repository root path;
- `ecosystem`: currently `node` or `unknown`;
- `packageManager`: `npm`, `pnpm`, `yarn`, or `bun`;
- `languages`: detected or supplied language names;
- `frameworks`: detected or supplied framework names.

### `ChangeSet`

- `baseRef`: base Git reference used for the comparison;
- `headRef`: head Git reference used for the comparison;
- `files`: changed-file records.

Each `ChangedFile` records `path`, `status`, `additions`, `deletions`, and a
category. The status is one of `added`, `modified`, `deleted`, or `renamed`.
The category is one of `source`, `test`, `config`, `dependency`,
`documentation`, `ci`, or `unknown`.

## Verification results

A `VerificationResult` records an attempted recognized verification rather
than a DiffSentry implementation failure:

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | string | Verification intent identifier, such as `test`, `lint`, `typecheck`, or `build`. |
| `status` | `passed \| failed \| skipped \| error` | Outcome of the verifier attempt. |
| `command` | `{ executable, args }` | The resolved executable and argument array. |
| `durationMs` | number | Measured execution duration. |
| `exitCode` | number or `null` | Process exit code when one exists. |
| `stdout` | `{ text, truncated }` | Bounded standard-output summary. |
| `stderr` | `{ text, truncated }` | Bounded standard-error summary. |

The `error` status is a verification result and receives the v0.1 verification
penalty. A DiffSentry internal error is not a verification result, does not
enter `RiskScore`, and follows the internal-error path with CLI exit code `3`.

The fixed v0.1 verification penalties are:

| Verification | passed | skipped | error | failed |
| --- | ---: | ---: | ---: | ---: |
| `test` | 0 | 0 | 30 | 50 |
| `typecheck` | 0 | 0 | 30 | 50 |
| `build` | 0 | 0 | 30 | 50 |
| `lint` | 0 | 0 | 10 | 15 |

Captured output is bounded and may be marked `truncated: true`. A report must
not imply that omitted output was observed.

## DiffSentry report

`DiffSentryReport` combines the structured context and the final decision:

| Field | Type | Meaning |
| --- | --- | --- |
| `version` | string | DiffSentry product/runtime version. |
| `schemaVersion` | `1` in v0.1 | Report shape version; see [Versioning](#versioning). |
| `project` | `ProjectContext` | Project context for the check. |
| `changes` | `ChangeSet` | Git change context. |
| `findings` | array of `Finding` | Rule claims and their evidence. |
| `verifications` | array of `VerificationResult` | Recognized verifier outcomes. |
| `riskScore` | number | Final capped v0.1 score from the core. |
| `verdict` | `pass \| review \| fail` | Threshold decision from the core. |

The core calculates the score before rendering:

```text
FindingScore = sum(severityWeight for every Finding)
VerificationScore = sum(penalty for every VerificationResult)
RawRiskScore = FindingScore + VerificationScore
RiskScore = min(100, RawRiskScore)
```

With the default thresholds `review = 15` and `fail = 50`:

```text
score < review         => PASS
review <= score < fail => REVIEW
score >= fail          => FAIL
```

Renderers consume the assembled `riskScore` and `verdict`. The terminal, JSON,
and Markdown renderers are presentation-only: they do not recalculate risk,
apply confidence scaling, add category multipliers, or execute commands.

## Illustrative report fragment

This fragment shows the relationship between a finding, evidence, and the
report fields. It is an illustrative schema example, not a claim about a live
repository run:

```json
{
  "version": "0.1.0",
  "schemaVersion": 1,
  "findings": [
    {
      "ruleId": "security.secret-exposure",
      "severity": "critical",
      "title": "Secret exposure",
      "message": "Secret-like material was detected; the matched value is redacted.",
      "evidence": [
        {
          "message": "Potential credential assignment detected; matched value redacted.",
          "location": { "path": "src/example.ts", "startLine": 1 }
        }
      ],
      "confidence": 1
    }
  ],
  "riskScore": 50,
  "verdict": "fail"
}
```

A complete report also includes `project`, `changes`, and `verifications`.
Consumers should use the schema version and the public contracts rather than
assuming that a fragment is a complete serialized report.

For the architecture and trust boundaries around these values, see
[docs/architecture](../architecture),
[02-ARCHITECTURE.md](../../02-ARCHITECTURE.md), and
[05-SECURITY-AND-TRUST-BOUNDARIES.md](../../05-SECURITY-AND-TRUST-BOUNDARIES.md).
