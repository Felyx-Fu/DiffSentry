# DiffSentry

**Verify the diff. Trust the evidence.**

Deterministic verification for AI-generated code changes.

DiffSentry runs objective checks and deterministic rules against a Git change,
collects evidence with matched secret-like values redacted, calculates a
reproducible `RiskScore`, and reports `PASS`, `REVIEW`, or `FAIL`.

It complements AI-assisted development by covering the part that benefits from
deterministic verification. No LLM judging another LLM. No cloud service is
required for the core CLI.

[![npm version](https://img.shields.io/npm/v/%40felyx-fu%2Fdiffsentry?logo=npm)](https://www.npmjs.com/package/@felyx-fu/diffsentry)
[![CI](https://github.com/Felyx-Fu/DiffSentry/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Felyx-Fu/DiffSentry/actions/workflows/ci.yml)
[![License](https://img.shields.io/github/license/Felyx-Fu/DiffSentry)](https://github.com/Felyx-Fu/DiffSentry/blob/main/LICENSE)
[![Release](https://img.shields.io/github/v/release/Felyx-Fu/DiffSentry)](https://github.com/Felyx-Fu/DiffSentry/releases/tag/v0.1.0)

## Try it in one command

From a Git repository with Node.js 24 installed:

```bash
npx @felyx-fu/diffsentry check
```

The v0.1.0 CLI produces a real, redacted terminal report like this for the
verified synthetic secret-exposure fixture:

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

The displayed value is synthetic and never contains a real credential. A
`FAIL` verdict maps to CLI exit code `2`; the evidence keeps the matched value
redacted.

## Why DiffSentry?

AI-assisted development is useful, but a second model's opinion is not the only
kind of verification a code change needs. DiffSentry focuses on checks whose
inputs and outputs can be inspected and reproduced locally.

| Another AI reviewer may provide | DiffSentry provides |
| --- | --- |
| Probabilistic opinion | Deterministic evidence |
| Results that can vary with model, API, or context | The same result for the same inputs and signals |
| An explanation of what the model thinks | Evidence showing what checks and rules observed |
| A model-dependent service path | Local-first execution from a real Git change |
| An LLM judging another LLM's output | Objective verification with explicit `PASS` / `REVIEW` / `FAIL` |

DiffSentry does not argue that AI reviewers are useless. It complements them
with the part of the review process that benefits from fixed rules, real
verifier output, and redacted evidence.

## Quick start

The public npm package is already available at v0.1.0. No global install is
required:

```bash
# Use the current v0.1 line
npx @felyx-fu/diffsentry check

# Pin the released version when you need a reproducible command
npx @felyx-fu/diffsentry@0.1.0 check
```

Useful commands:

```bash
npx @felyx-fu/diffsentry --help
npx @felyx-fu/diffsentry@0.1.0 --version
npx @felyx-fu/diffsentry check --format json --ci
```

`--ci` selects JSON output by default. The CLI uses exit code `0` for `PASS`,
`1` for `REVIEW`, `2` for `FAIL`, and `3` for a DiffSentry internal error.
The v0.1 package requires Node.js `>=24 <25`.

## How it works

```text
Git diff
  ↓
Project signals
  ↓
Verification plan
  ↓
Tests / lint / typecheck / build
  ↓
Deterministic rules
  ↓
Redacted evidence
  ↓
RiskScore
  ↓
PASS / REVIEW / FAIL
```

The same report model can be rendered as terminal, JSON, or Markdown output.
The core pipeline is local-first and keeps runtime capabilities behind explicit
adapters.

## Built-in rules

DiffSentry v0.1 includes five deterministic rules:

- `security.secret-exposure` — detects high-signal secret-like assignments and redacts matched values in evidence.
- `testing.source-without-tests` — identifies changed source files without related changed tests.
- `testing.auth-without-tests` — identifies authentication-related changes without related changed tests.
- `dependency.runtime-dependency-added` — detects newly added runtime dependencies.
- `ci.workflow-permission-change` — detects GitHub workflow permission changes that expand access.

Each finding includes a severity, rule identity, and evidence. The rule registry
is static and explainable; v0.1 does not dynamically load third-party rules.

## RiskScore

`RiskScore` is deterministic. In v0.1 it is the sum of fixed finding severity
weights and fixed verification penalties, capped at `100`. Finding confidence
is evidence metadata and does not change the score. The default thresholds are
`review = 15` and `fail = 50`.

The normative weights, penalties, aggregation, and verifier-error distinction
are documented in the [project charter](01-PROJECT-CHARTER.md) and
[architecture specification](02-ARCHITECTURE.md#8-risk-model).

## GitHub Action

The repository also contains a private GitHub Action bundle that reuses the
same core verification model. Its consuming-workflow example uses read-only
`contents: read` permission and writes runner-local outputs such as a step
summary, outputs, and annotations.

The v0.1 Action remains a private integration artifact. It is not presented as
a public Marketplace package or as a hosted service.

## Current v0.1 boundaries

DiffSentry v0.1 is intentionally focused:

- Node.js 24 only;
- five built-in deterministic rules;
- local CLI, npm packages, and a private GitHub Action bundle;
- JSON configuration and terminal/JSON/Markdown reports;
- no LLM-based scoring or network-based scoring;
- no cloud service, dashboard, database, authentication, or enterprise policy platform;
- not a full SAST or vulnerability-scanning replacement;
- deep public package-boundary analysis remains a deferred placeholder.

These boundaries are part of the product's credibility: the tool reports the
evidence it can actually collect instead of promising a broader scanner.

## Documentation

- [Launch demo script](docs/launch/demo-script.md)
- [Release notes](docs/release/v0.1.0.md)
- [Release checklist](docs/release/v0.1-checklist.md)
- [Architecture overview](docs/architecture/README.md)
- [Risk and evidence specification](docs/specs/evidence.md)
- [Configuration specification](docs/specs/config.md)
- [CLI exit codes](docs/specs/exit-codes.md)
- [Security and trust boundaries](05-SECURITY-AND-TRUST-BOUNDARIES.md)

## Contributing

Read [AGENTS.md](AGENTS.md),
[04-CODEX-EXECUTION-PROTOCOL.md](04-CODEX-EXECUTION-PROTOCOL.md), and
[CONTRIBUTING.md](CONTRIBUTING.md) before changing the repository. Every
behavior change needs tests, every built-in rule needs positive and negative
coverage, and `STATUS.md` is updated after each task.

DiffSentry is released under the [MIT License](LICENSE).
