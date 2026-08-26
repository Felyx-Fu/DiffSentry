# DiffSentry Task Index

Total atomic tasks in this pack: **194**.

| Phase | Area | Tasks | Gate |
|---|---|---:|---|
| P0 | Foundation | 24 | Repository/tooling quality gate passes |
| P1 | Contracts | 20 | Contracts API frozen for v0.1 implementation |
| P2 | Runtime | 25 | Safe Node runtime adapters pass integration tests |
| P3 | Core Engine | 34 | Core pipeline produces deterministic report without built-in rules |
| P4 | Rules | 29 | Five built-in rules satisfy rule-level DoD |
| P5 | CLI & Configuration | 24 | Local one-command CLI experience works |
| P6 | GitHub Action | 16 | GitHub Action reuses the same core safely |
| P7 | Release & Open Source | 22 | v0.1 release candidate satisfies release-level DoD |

## Required order

```text
P0 → P1 → P2 → P3 → P4 → P5 → P6 → P7
```

Tasks inside a phase should normally be completed in numeric order. A later task is ready only when every dependency named in its task entry is complete.

## Task execution format

Every task contains:
- ID
- title
- dependency list
- goal
- allowed scope
- explicit non-goals
- acceptance criteria

Codex must update `STATUS.md` after each completed or blocked task.
