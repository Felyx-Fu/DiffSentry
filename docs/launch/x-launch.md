# X / Twitter launch copy

Canonical repository: <https://github.com/Felyx-Fu/DiffSentry>

Primary npm package: <https://www.npmjs.com/package/@felyx-fu/diffsentry>

## Version A — sharp / concise

AI can write code fast. Asking another AI whether AI-written code is correct
still leaves you with a probabilistic opinion.

DiffSentry takes a different path: run real checks, apply deterministic rules,
collect redacted evidence, calculate a reproducible RiskScore, and return
`PASS` / `REVIEW` / `FAIL`.

```bash
npx @felyx-fu/diffsentry check
```

Verify the diff. Trust the evidence.

<https://github.com/Felyx-Fu/DiffSentry>

#OpenSource #DevTools

## Version B — technical

DiffSentry v0.1.0 is a local-first, deterministic verifier for AI-generated code
changes.

It uses real Git diffs, tests/lint/typecheck/build signals, five built-in rules,
redacted evidence, and a fixed RiskScore model. The CLI is installable from npm:

```bash
npx @felyx-fu/diffsentry@0.1.0 check --format json --ci
```

No LLM-based scoring. No cloud service required for the core CLI. The current
release is intentionally limited to Node 24 and five built-in rules, rather than
claiming to be a complete SAST replacement.

<https://github.com/Felyx-Fu/DiffSentry>

#SoftwareEngineering #AI

## Version C — build in public

DiffSentry v0.1.0 is released.

I built it around a simple question: when AI-generated code changes quickly, how
do we verify the parts that should not depend on another model's opinion?

DiffSentry runs deterministic checks locally, gathers explainable evidence, and
returns a reproducible `PASS` / `REVIEW` / `FAIL` result. It is open source,
npm-installable, and deliberately small: Node 24, five built-in rules, no LLM
scoring, and no claim to replace a full static-analysis platform.

Try it with:

```bash
npx @felyx-fu/diffsentry check
```

Feedback on false positives, evidence quality, and the v0.1 boundaries is
welcome.

<https://github.com/Felyx-Fu/DiffSentry>

#OpenSource #BuildInPublic
