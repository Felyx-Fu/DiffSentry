# DiffSentry Architecture

## 1. Architecture style

DiffSentry uses a TypeScript monorepo with a core-first hexagonal architecture.

## 2. Package layout

```text
apps/
  github-action/

packages/
  contracts/
  core/
  runtime-node/
  rules/
  config/
  report/
  cli/
```

## 2.1 Published package layout (v0.1)

The canonical repository identity is `Felyx-Fu/DiffSentry`:

- repository: `git+https://github.com/Felyx-Fu/DiffSentry.git`;
- homepage: `https://github.com/Felyx-Fu/DiffSentry#readme`;
- issues: `https://github.com/Felyx-Fu/DiffSentry/issues`.

The seven public npm packages are:

- `@felyx-fu/diffsentry-contracts`;
- `@felyx-fu/diffsentry-core`;
- `@felyx-fu/diffsentry-runtime-node`;
- `@felyx-fu/diffsentry-rules`;
- `@felyx-fu/diffsentry-config`;
- `@felyx-fu/diffsentry-report`;
- `@felyx-fu/diffsentry`.

Each public package is an ESM-only TypeScript library compiled locally with
`tsc` from `src/**/*.ts` to `dist/**/*.js` and declaration files. It exposes
`./dist/index.js` as its package-root import and
`./dist/index.d.ts` as its declaration entry point. The CLI additionally
exposes `./dist/main.js` as its Node executable bin.

The GitHub Action is an integration artifact, not a public npm package. It
remains `private: true` and continues to use its existing Action-only bundled
`dist/main.js` model.

## 3. Responsibilities

### `@felyx-fu/diffsentry-contracts`
Cross-package public data contracts only.

Contains:
- ProjectContext
- ChangeSet / ChangedFile
- Evidence
- Finding
- VerificationResult
- Verdict
- DiffSentryReport
- configuration DTOs

Must not:
- access Node APIs;
- execute processes;
- read Git;
- implement business behavior.

### `@felyx-fu/diffsentry-core`
Pure application/domain behavior.

Contains:
- application use cases;
- domain policies;
- verification planning;
- finding aggregation;
- risk scoring;
- verdict calculation;
- ports/interfaces.

Must not import:
- `node:*`
- CLI packages
- GitHub SDKs
- UI frameworks
- cloud services

### `@felyx-fu/diffsentry-runtime-node`
Node.js adapters.

Contains:
- Git adapter;
- filesystem adapter;
- process runner;
- environment adapter;
- clock adapter.

This package is an I/O boundary.

### `@felyx-fu/diffsentry-rules`
Built-in deterministic rules.

Contains rule metadata, matching logic, evidence generation, registry.

Rules consume contracts/core ports and return findings.

### `@felyx-fu/diffsentry-config`
Loads and validates JSON configuration.

v0.1 configuration format:
`diffsentry.config.json`

TypeScript/JavaScript executable configuration is intentionally unsupported in v0.1.

### `@felyx-fu/diffsentry-report`
Presentation-only rendering:
- terminal
- JSON
- Markdown

No risk calculation belongs here.

### `@felyx-fu/diffsentry`
CLI composition root and commands.

It wires:
- core
- runtime
- rules
- config
- reports

### `apps/github-action`
GitHub-specific adapter.

It must reuse the same core engine and not reimplement verification logic.

## 4. Allowed dependency direction

```text
contracts
   ▲
   │
core
   ▲
   │
├── runtime-node
├── rules
├── config
└── report
      ▲
      │
     cli
      ▲
      │
github-action composition
```

In practical terms:
- `contracts` depends on no internal package.
- `core` may depend on `contracts`.
- adapters may depend on `core` and `contracts`.
- composition roots may depend on adapters.
- core never depends on adapters.

## 5. Runtime pipeline

```text
Repository
   ↓
Project Detection
   ↓
Git Change Collection
   ↓
Change Classification
   ↓
Rule Selection
   ↓
Verification Planning
   ↓
Verifier Execution
   ↓
Finding Collection
   ↓
Evidence Assembly
   ↓
Risk Scoring
   ↓
Verdict
   ↓
Report Rendering
```

## 6. Core ports

Required v0.1 ports:

```ts
interface FileSystemPort {}
interface GitProvider {}
interface ProcessRunner {}
interface Clock {}
interface Rule {}
interface Verifier {}
```

Core behavior receives these capabilities explicitly.

## 7. Determinism

Given the same:
- repository contents;
- Git refs;
- DiffSentry version;
- config;
- relevant tool outputs;

DiffSentry must produce the same:
- findings;
- score;
- verdict.

No network-dependent scoring is allowed in v0.1.

## 8. Risk model

The v0.1 risk model is deterministic and uses only findings and verification
results. Severity weights are fixed:

| Severity | Weight |
| --- | ---: |
| info | 0 |
| low | 5 |
| medium | 15 |
| high | 30 |
| critical | 50 |

Verification penalties are fixed by verification intent and status:

| Verification | passed | skipped | error | failed |
| --- | ---: | ---: | ---: | ---: |
| test | 0 | 0 | 30 | 50 |
| typecheck | 0 | 0 | 30 | 50 |
| build | 0 | 0 | 30 | 50 |
| lint | 0 | 0 | 10 | 15 |

The aggregation is:

```text
FindingScore = sum(severityWeight for every Finding)
VerificationScore = sum(penalty for every VerificationResult)
RawRiskScore = FindingScore + VerificationScore
RiskScore = min(100, RawRiskScore)
```

Finding confidence is evidence metadata only and does not affect
`RiskScore`. v0.1 does not apply any additional multipliers, normalization,
category scaling, network-based scoring, or LLM scoring.

The default thresholds are `review = 15` and `fail = 50`, with the invariant
`0 <= review < fail <= 100`. Verdict boundaries are:

```text
score < review         => PASS
review <= score < fail => REVIEW
score >= fail          => FAIL
```

A verification result with status `error` is included as a verification
penalty. A DiffSentry internal error is not a `VerificationResult`, does not
enter `RiskScore`, and follows the internal-error path with CLI exit code 3.

## 9. Evidence model

A finding is not merely a message.

Conceptually:

```text
Finding = Claim + Severity + Evidence + Confidence
```

Evidence must identify facts such as:
- changed path;
- change type;
- related test presence/absence;
- verifier result;
- dependency delta;
- workflow permission delta.

## 10. Composition rule

Dependency injection happens at composition roots:
- CLI
- GitHub Action

Core must never instantiate concrete runtime adapters.

## 11. Architecture enforcement

`scripts/check-architecture.ts` must eventually enforce forbidden imports.

Architecture violations are build failures, not style warnings.
