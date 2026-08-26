# DiffSentry Architecture Overview

This page is the contributor-facing map of DiffSentry v0.1. The locked
architecture specification remains the normative source for package boundaries
and required behavior: [02-ARCHITECTURE.md](../../02-ARCHITECTURE.md). Security
constraints are defined in
[05-SECURITY-AND-TRUST-BOUNDARIES.md](../../05-SECURITY-AND-TRUST-BOUNDARIES.md).

## Shape of the system

DiffSentry is a TypeScript monorepo with a core-first hexagonal architecture.
The core expresses domain and application policy through injected ports. Node,
CLI, and GitHub-specific code stays at the outside of that boundary.

```text
Repository and tool outputs
          │
          ▼
composition root
  (CLI or GitHub Action)
          │
          ▼
       core
          │
          ▼
 contracts and ports

outside the core:
  runtime-node adapters   rules   config   report   integrations
```

The diagram is conceptual: the dependency direction below is the authoritative
import rule.

## Package responsibilities

| Package | Responsibility | Boundary |
| --- | --- | --- |
| `@felyx-fu/diffsentry-contracts` | Public data contracts for projects, changes, evidence, findings, verifications, reports, configuration, and verdicts. | No Node APIs, process execution, Git access, or business behavior. |
| `@felyx-fu/diffsentry-core` | Pure domain policies, application use cases, verification planning, finding aggregation, risk scoring, verdict calculation, and ports. | May depend on contracts; must not depend on Node APIs, CLI packages, SDKs, UI frameworks, or cloud services. |
| `@felyx-fu/diffsentry-runtime-node` | Node adapters for Git, filesystem, process execution, environment, and clock capabilities. | The Node I/O boundary; it is injected into core rather than constructed by core. |
| `@felyx-fu/diffsentry-rules` | Deterministic built-in rule metadata, matching, evidence generation, and registry. | Consumes contracts and core ports; returns structured findings. |
| `@felyx-fu/diffsentry-config` | JSON-only configuration loading, schema validation, defaults, and deterministic merging. | Configuration is data, not executable JavaScript or TypeScript. |
| `@felyx-fu/diffsentry-report` | Terminal, JSON, and Markdown presentation. | Reads the assembled report; does not calculate risk or execute processes. |
| `@felyx-fu/diffsentry` | CLI composition root and command wiring for core, runtime, rules, config, and report packages. | Owns command-facing composition, not core policy. |
| `apps/github-action` | GitHub event and workflow adapters around the same engine. | Reuses the core path and remains least-privilege; it does not reimplement verification logic. |

## Dependency direction

An arrow means “may import.” Dependencies point inward toward contracts and
policy; the core never points outward to a runtime adapter.

```text
core ────────────────→ contracts
runtime-node ────────→ core, contracts
rules ────────────────→ core, contracts
config ───────────────→ contracts
report ────────────────→ contracts
cli ──────────────────→ core, runtime-node, rules, config, report, contracts
github-action ────────→ core, runtime-node, rules, config, report, contracts
```

In particular:

- `contracts` has no dependency on another DiffSentry package;
- core code does not import `node:*` or application packages;
- adapters may depend on core and contracts, never the reverse;
- composition roots are the only place that assembles concrete adapters;
- adding a UI, cloud service, GitHub SDK, or Node API must not move that dependency into core.

## Check pipeline

The intended check path is a sequence of explicit, testable stages. A stage
should exchange structured data or an injected capability rather than reaching
through another layer's implementation.

```text
repository scope
      ↓
project detection
      ↓
Git change collection
      ↓
change classification
      ↓
rule selection and finding collection
      ↓
verification planning
      ↓
recognized verifier execution
      ↓
evidence assembly
      ↓
risk scoring
      ↓
verdict calculation
      ↓
report rendering
```

The recognized v0.1 verification intents are `test`, `lint`, `typecheck`, and
`build`. Verification results are recorded as structured data, including status,
exit code, duration, bounded stdout/stderr, truncation, and the command that was
actually resolved. A verifier result with status `error` is part of the risk
model; a DiffSentry internal error follows the separate internal-error path.

## Ports and composition

Core behavior receives capabilities explicitly. The required v0.1 capability
ports are:

- filesystem access;
- Git operations;
- process execution;
- a clock;
- rule execution;
- verifier execution.

The CLI and GitHub Action composition roots select implementations and provide
configuration, repository references, rules, and report output. Core must not
instantiate `runtime-node` adapters. This keeps deterministic domain tests
independent from the host operating system and makes integration boundaries
visible in the composition code.

## Determinism and trust boundaries

For the same repository contents, Git references, DiffSentry version, config,
and relevant tool outputs, the engine must produce the same findings, score, and
verdict. v0.1 does not use network-dependent scoring or LLM scoring.

Repository content, Git refs, paths, filenames, commit metadata, and JSON
configuration are untrusted inputs. Process execution uses argument arrays,
`shell: false` by default, bounded time and output, and explicit verification
planning. Secret-like values are redacted from evidence and reports. These
constraints are part of the architecture, not optional hardening.

## Where a change belongs

Use the narrowest layer that owns the behavior:

- add or change a cross-package shape in `contracts`;
- add pure policy or orchestration in `core`;
- add host I/O only in `runtime-node`;
- add deterministic repository findings in `rules`;
- add JSON parsing or validation in `config`;
- add presentation-only formatting in `report`;
- add command or integration wiring in `cli` or `apps/github-action`.

When a change appears to require an inward dependency, stop and revisit the
boundary before implementing it. Prefer a new port or an existing composition
root over importing an outer package into core.

## Contributor review checklist

Before marking an architecture-sensitive task complete, verify:

- the import direction still passes `scripts/check-architecture.ts`;
- core and contracts contain no Node runtime access or direct process execution;
- behavior changes have deterministic tests, and built-in rules have positive and negative coverage;
- reports consume assembled values without recalculating risk;
- configuration remains JSON data and cannot execute code;
- no network or LLM scoring was introduced;
- `STATUS.md` records the task and its validation evidence.

Related decisions are recorded in [ADR 002 — Hexagonal Core](../adr/002-hexagonal-core.md),
[ADR 003 — Deterministic Verification](../adr/003-deterministic-verification.md),
[ADR 004 — Evidence-First Findings](../adr/004-evidence-first-findings.md),
[ADR 005 — JSON Configuration](../adr/005-json-configuration.md), and
[ADR 006 — No LLM in v0.1](../adr/006-no-llm-v0-1.md).
