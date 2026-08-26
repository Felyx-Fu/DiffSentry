# AgentGuard v0.1 built-in rule authoring

Rules are deterministic, built-in repository checks. A rule turns an explicit
structured context into zero or more findings; it does not execute commands,
load configuration code, call a network service, or make an LLM request.

The v0.1 registry is static. Do not implement or document dynamic plugin
loading, runtime rule discovery, or remote rule packages as a v0.1 feature.

## Rule contract

The registry contract is generic over the context a rule needs and the finding
shape it returns:

```ts
interface RegistryRule<TContext, TResult> {
  readonly id: string;
  supports(context: TContext): boolean;
  run(context: TContext): Promise<readonly TResult[]>;
}
```

Use a narrow context containing observed, structured inputs. Typical inputs are
changed files, before/after manifest contents, workflow contents, or a typed
change-set view. The rule should not reach into the filesystem or Git itself;
the composition/core layers provide the context.

`supports` determines whether the rule applies to the context. `run` returns an
immutable-style readonly list and must be deterministic for the same context.
An empty list means that the rule observed no finding. A rule may return more
than one finding when the context contains multiple independent observations.

## Metadata

Every rule has a separate `RuleMetadata` value:

| Field | Type | Requirement |
| --- | --- | --- |
| `id` | string | Non-empty, stable, and matched by the v0.1 rule ID pattern. |
| `name` | string | Non-empty human-readable title. |
| `description` | string | Non-empty explanation of what the rule detects. |
| `category` | `ci \| dependency \| security \| testing` | Must match the prefix of `id`. |
| `defaultSeverity` | `info \| low \| medium \| high \| critical` | Explicit default severity. |

The ID pattern is:

```text
(ci|dependency|security|testing)\.[a-z0-9]+(?:-[a-z0-9]+)*
```

Examples of existing IDs are:

- `ci.workflow-permission-change`;
- `dependency.runtime-dependency-added`;
- `security.secret-exposure`;
- `testing.auth-without-tests`;
- `testing.source-without-tests`.

Treat an ID as a long-lived policy identifier once released. Do not reuse an
old ID for a different condition. If the meaning changes materially, discuss a
new ID and migration rather than silently changing the old rule's claim.

## Finding output

A finding returned by a built-in rule must contain the public finding shape:

```ts
interface Finding {
  readonly ruleId: string;
  readonly severity: Severity;
  readonly title: string;
  readonly message: string;
  readonly evidence: readonly Evidence[];
  readonly confidence: number;
  readonly location?: EvidenceLocation;
}
```

Authoring requirements:

- `ruleId` must equal the metadata ID;
- `severity` must be explicit and normally start at metadata's
  `defaultSeverity`;
- `title` should be concise and stable;
- `message` should state the observed claim without overstating impact;
- `evidence` should contain the facts that caused the rule to fire;
- `location`, when present, should point to an observed primary path or range;
- `confidence` is retained evidence metadata and is not a v0.1 risk multiplier.

Evidence should identify changed paths, deltas, or other directly observed
facts. Redact secret-like values before constructing evidence. Do not put full
credentials, tokens, private keys, or unbounded file contents into a finding.

The v0.1 risk score uses the finding severity weight only. It does not apply
confidence scaling, category scaling, network scoring, or LLM scoring.

## Implementation skeleton

The following is a shape guide; adapt the context and evidence types to the
condition being checked:

```ts
import type { Evidence, EvidenceLocation, Finding, Severity } from "@agentguard/contracts";
import type { RuleMetadata } from "@agentguard/rules";

export interface ExampleRuleContext {
  readonly changedFiles: readonly { readonly path: string; readonly contents: string }[];
}

export const EXAMPLE_METADATA: Readonly<RuleMetadata> = Object.freeze({
  category: "testing",
  defaultSeverity: "high",
  description: "Detects the documented example condition.",
  id: "testing.example-condition",
  name: "Example condition",
});

export interface ExampleFinding extends Finding {
  readonly evidence: readonly Evidence[];
  readonly location?: EvidenceLocation;
  readonly severity: Severity;
}

export const exampleRule = {
  id: EXAMPLE_METADATA.id,
  supports: (context: ExampleRuleContext): boolean =>
    context.changedFiles.length > 0,
  run: async (
    context: ExampleRuleContext,
  ): Promise<readonly ExampleFinding[]> => {
    // Inspect only the supplied context and return redacted, factual findings.
    return context.changedFiles.length === 0 ? [] : [];
  },
};
```

The empty return in this skeleton is intentional: the condition and evidence
logic must be supplied by the contributor. Do not copy the placeholder as a
claim that the example condition is implemented.

In production code, keep detection helpers separate when that makes positive
and negative behavior easier to test. Do not add `console.log`, direct process
execution, shell strings, filesystem scans, or network access to the rule.

## Registry integration

Register a built-in rule with its metadata and implementation together:

```ts
const EXAMPLE_RULES: readonly RuleRegistration<
  ExampleRuleContext,
  ExampleFinding
>[] = createRuleRegistry([
  {
    metadata: EXAMPLE_METADATA,
    rule: exampleRule,
  },
]);
```

`createRuleRegistry` enforces the following before returning a deterministic
ID-ordered copy:

- metadata is valid;
- the rule ID equals the metadata ID;
- no duplicate ID exists in the registration list.

The built-in composition must include the registration in the appropriate
static `BUILT_IN_RULES` collection. Export the intended metadata, context types,
finding types, helpers, and rule from `packages/rules/src/index.ts` where the
package's public API requires them. Do not add a loader that searches for code
at runtime.

## Required tests

Every built-in rule requires both positive and negative coverage. At minimum,
add tests for:

1. a positive fixture that emits the expected number of findings;
2. the rule ID, severity, title, message, and evidence shape;
3. a negative fixture that emits no finding;
4. stable and deterministic evidence locations/messages;
5. secret redaction when the rule handles secret-like input;
6. metadata validation and registry inclusion; and
7. duplicate-ID or ID/metadata mismatch rejection when registry behavior is
   changed.

Use repository fixtures and injected structured inputs. Do not make tests
depend on network services, wall-clock timing, random values, or an installed
private service. A test that passes only because a finding or assertion was
removed is not valid coverage.

## Review checklist

Before marking a rule task complete, confirm:

- the rule has a stable category-prefixed ID and complete metadata;
- `supports` and `run` use only the declared context;
- the positive and negative cases are both tested;
- every emitted claim has factual, redacted evidence;
- output order is deterministic;
- the static registry includes the rule and the public barrel exports are
  intentional;
- the rule does not change core/runtime boundaries or introduce a dependency;
- configuration changes only policy fields supported by the JSON schema;
- the task records targeted and full validation in `STATUS.md`.

For the evidence and report semantics of returned findings, see
[evidence.md](evidence.md). For the package and dependency boundaries, see
[docs/architecture](../architecture) and
[02-ARCHITECTURE.md](../../02-ARCHITECTURE.md).
