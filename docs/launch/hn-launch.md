# Hacker News launch copy

## Title

Show HN: DiffSentry – Deterministic verification for AI-generated code changes

## Body

DiffSentry is a local-first verifier for AI-generated code changes. It reads a
Git diff, runs available tests/lint/typecheck/build checks, applies five
deterministic rules, collects redacted evidence, and returns `PASS`, `REVIEW`, or
`FAIL` with a reproducible RiskScore.

The design deliberately avoids LLM-based scoring: it does not ask another model
whether AI-written code is correct. v0.1 requires Node 24, is installable with
npm, and is intentionally not a full SAST or vulnerability-scanning
replacement. The GitHub Action is still a private integration artifact.

```bash
npx @felyx-fu/diffsentry check
```

The repository, release evidence, and limitations are documented here:
<https://github.com/Felyx-Fu/DiffSentry>. I would value technical feedback on
deterministic evidence, false positives, and the tradeoffs of keeping the core
local-first.
