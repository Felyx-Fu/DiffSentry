# Contributing to DiffSentry

Thank you for helping improve DiffSentry. Contributions should preserve the
v0.1 scope, deterministic behavior, and repository trust boundaries.

## Local setup

DiffSentry targets Node.js 24 LTS, pnpm, TypeScript, Biome, Vitest, and
Turborepo. Use a supported Node 24 installation before running the checks.

From the repository root:

```bash
pnpm install --frozen-lockfile
```

## Development workflow

Work on one atomic `AG-xxx` task at a time.

Before editing:

1. Read the applicable specification and task document.
2. Check `STATUS.md` and inspect the existing repository state.
3. Confirm task dependencies and allowed scope.

Keep changes deterministic and minimal. Do not add features outside the task,
new dependencies without a clear need, or new trust boundaries without an
accepted architecture decision. Treat repository content and configuration as
untrusted input, and never execute an interpolated shell command.

## Required checks

Run the root quality commands before requesting review:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Add or update focused tests for behavior changes. Every built-in rule needs a
positive case, a negative case, and evidence assertions. Do not delete, mute,
skip, or weaken tests to make a check pass.

## Pull requests

Keep each pull request focused on its task. The description should include:

- the task ID and a short summary;
- the files or responsibility areas changed;
- tests and quality checks run, including their actual results;
- any known limitation or follow-up outside the current scope; and
- confirmation that `STATUS.md` reflects the repository state.

Review the final diff for unrelated files, debug output, secrets, unexpected
lockfile changes, dependency additions, and architecture or security-boundary
violations.
