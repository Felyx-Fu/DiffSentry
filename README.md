# DiffSentry

Deterministic, local-first verification for code changes, with an emphasis on
evidence from AI-generated changes.

> DiffSentry v0.1.0 is a release candidate. This README describes the verified
> source and packed-artifact behavior; npm publication has not occurred.

## Problem

Code review needs more than a diff summary. DiffSentry is designed to answer
four concrete questions:

1. What changed?
2. Which objective checks can be run?
3. What evidence indicates risk?
4. Should the change pass, require review, or fail?

It keeps the decision local and explainable: Git changes, project signals,
verification results, rule findings, evidence locations, and a deterministic
risk verdict are represented as structured data.

## Demo

The repository contains a deterministic Git fixture flow under `tests/e2e`.
It creates a temporary repository, applies the existing secret-exposure
fixture, redacts the matched value, calculates the v0.1 risk score, renders the
report, and maps the `FAIL` verdict to the CLI exit code `2`.

The same report model is rendered as terminal, JSON, and GitHub-friendly
Markdown output. The deterministic fixture test asserts this terminal-renderer
shape:

```text
DiffSentry 0.1.0
Verdict: FAIL
Risk score: 50/100
Findings: 1
Verifications: 0

Findings:
- [CRITICAL] Secret exposure (security.secret-exposure)
  High-signal secret-like material detected in secret.ts; matched values are redacted.
  Evidence: Potential credential-assignment detected; matched value redacted. at secret.ts:1:7-1:32

Verifications: none
```

This is a rendered report sample from the package-local fixture; the quick-start
command also checks the mapped CLI exit code for the `FAIL` verdict.

## Quick start

For the current source checkout, use Node.js 24 and pnpm 10.30.3. The shortest
verified first check is the deterministic Git fixture flow:

```bash
pnpm install --frozen-lockfile && pnpm exec vitest run tests/e2e/cli-fixture.test.ts
```

This command creates a temporary Git repository, applies the checked-in
secret-exposure fixture, runs the package-local check stack, verifies the
`FAIL` report at `50/100`, and checks the mapped CLI exit code. It does not
modify the checkout or require a global install.

For a full source quality gate, run `pnpm lint`, `pnpm typecheck`, `pnpm test`,
and `pnpm build` after the fixture check.

Planned npm command for v0.1.0 (publication not performed):

```bash
npx @felyx-fu/diffsentry check
```

The package is a release candidate and is not yet available from npm. The
source checkout and packed-artifact validation can be used before publication.

## Features

The v0.1 source currently includes:

- contracts for changes, findings, evidence, reports, verification results,
  configuration, and verdicts;
- a hexagonal core boundary with injected filesystem, Git, process, and clock
  capabilities;
- deterministic Git diff parsing, project signals, verification planning,
  safe executable/argument resolution, and verifier result collection;
- five built-in rules for workflow permission changes, runtime dependency
  additions, secret exposure, authentication changes without related tests,
  and source changes without tests;
- JSON-only configuration with schema validation and deterministic precedence;
- terminal, JSON, and Markdown report renderers;
- CLI composition, check/config/init/explain command surfaces, CI JSON defaults,
  and exit-code mapping;
- GitHub Action metadata, read-only workflow examples, event-context parsing,
  structured report handoff, Step Summary/output/annotation adapters, and a
  Node-loadable local bundle.

The full release artifact and the live Action entrypoint are intentionally
tracked separately from these source-level capabilities.

## Risk model

RiskScore is deterministic and uses only finding severity and verification
results. The v0.1 severity weights are `info=0`, `low=5`, `medium=15`,
`high=30`, and `critical=50`. Verification penalties are fixed by verifier
and status, and the final score is capped at `100`.

Finding confidence is evidence metadata; it does not affect RiskScore. The
default thresholds are `review=15` and `fail=50`:

- below `review`: `PASS`;
- from `review` through below `fail`: `REVIEW`;
- at or above `fail`: `FAIL`.

See [01-PROJECT-CHARTER.md](01-PROJECT-CHARTER.md) and
[02-ARCHITECTURE.md](02-ARCHITECTURE.md) for the normative model.

## Principles

- Evidence over opinion
- Deterministic by default
- Local-first execution
- Core independent from integrations
- Explainable rules and redacted evidence
- Safe execution with explicit capability boundaries
- JSON configuration as data, never executable code
- Small, reviewable changes over speculative feature expansion

## Roadmap

- P0: foundation, repository policy, CI, and architecture boundaries
- P1: contracts and ports
- P2: Node runtime adapters and safe process execution
- P3: core change, verification, risk, and report foundations
- P4: built-in rules and evidence handling
- P5: CLI, JSON configuration, and report formats
- P6: GitHub Action metadata, adapters, examples, tests, and bundle tooling
- P7: release documentation, examples, packaging, and release gates

The current task status and evidence are tracked in
[STATUS.md](STATUS.md); task specifications are in [tasks](tasks).

## Non-goals for v0.1

DiffSentry v0.1 is not an AI code reviewer, a hosted dashboard, a package
vulnerability database, a full CI platform, an IDE, or a replacement for every
SAST tool. It does not use LLM scoring, network-based scoring, confidence
scaling, category multipliers, or executable JavaScript/TypeScript
configuration.

## Contributing

Read [AGENTS.md](AGENTS.md), [04-CODEX-EXECUTION-PROTOCOL.md](04-CODEX-EXECUTION-PROTOCOL.md),
and [CONTRIBUTING.md](CONTRIBUTING.md) before changing the repository. Every
behavior change needs tests, every built-in rule needs positive and negative
coverage, and `STATUS.md` is updated after each task.
