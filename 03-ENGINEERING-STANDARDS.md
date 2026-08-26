# Engineering Standards

## 1. Locked toolchain

- Runtime: **Node.js 24 LTS**
- Language: **TypeScript 6.0**
- Module system: **ESM**
- Package manager: **pnpm**
- Workspace: **pnpm workspace**
- Task orchestration: **Turborepo**
- Lint / format: **Biome**
- Tests: **Vitest**
- Release management: **Changesets**
- CI: **GitHub Actions**
- Configuration: **JSON + JSON Schema**
- License: **MIT**

### 1.1 Canonical release identity

The v0.1 canonical repository identity is `Felyx-Fu/AgentGuard`.

- Git metadata URL: `git+https://github.com/Felyx-Fu/AgentGuard.git`;
- homepage: `https://github.com/Felyx-Fu/AgentGuard#readme`;
- issue tracker: `https://github.com/Felyx-Fu/AgentGuard/issues`.

This metadata identifies the intended project only. v0.1 development tasks do
not create tags or GitHub Releases, publish npm packages, or perform release
writes. AG-719 has a separate, finite authorization for creating this
repository, pushing the validated source and CI state, and reading hosted CI
evidence; that authorization does not grant any release or publication rights.

### 1.2 AG-719 hosted CI authorization

AG-719 may create and use the canonical `Felyx-Fu/AgentGuard` repository on
GitHub with default branch `main`. Only the following remote operations are in
scope for that task:

- create the canonical repository if it does not exist;
- initialize/use `main` and push the identifiable source revision and required
  CI fixes;
- trigger `.github/workflows/ci.yml`;
- read workflow runs, jobs, logs, conclusions, and other hosted-run evidence;
- repair ordinary cross-platform issues exposed by those runners and rerun the
  matrix.

AG-719 must not publish npm packages, run `pnpm changeset publish`, use
`NPM_TOKEN`, create Git tags or GitHub Releases, execute the release workflow,
create a release PR, use an unauthorized hosted service, or declare
`v0.1.0 READY TO RELEASE`.

The required hosted matrix is `ubuntu-latest`, `windows-latest`, and
`macos-latest`, all using Node.js 24. AG-719 is complete only when the same
identifiable source revision passes the formal CI quality gate on all three
platforms and `STATUS.md` records the commit SHA, workflow run, platform
conclusions, Node version, and any failure/fix history. The existing
`scripts/check-package-boundaries.ts` placeholder must be reported faithfully;
AG-719 does not expand scope to implement deep package-boundary validation.

## 2. TypeScript compiler policy

Required:
- `strict: true`
- `noUncheckedIndexedAccess: true`
- `exactOptionalPropertyTypes: true`
- `noImplicitOverride: true`
- ESM-compatible module resolution

Avoid:
- `any`
- `@ts-ignore`
- double assertions such as `as unknown as X`
- broad type casts hiding invalid states

Exceptions require a comment explaining why a safer type is not feasible.

## 3. Naming

Files:
`kebab-case.ts`

Types / interfaces / classes:
`PascalCase`

Functions / local variables:
`camelCase`

Constants:
`UPPER_SNAKE_CASE`

Rule IDs:
`category.lowercase-kebab-case`

Examples:
- `security.secret-exposure`
- `testing.auth-without-tests`

## 4. Package boundaries

Do not use deep imports across packages.

Allowed:

```ts
import { Finding } from "@agentguard/contracts";
```

Forbidden:

```ts
import { Finding } from "../../contracts/src/finding";
```

Each package exposes a deliberate public API from `src/index.ts`.

## 5. Error handling

Use typed AgentGuard errors for expected system failures.

Expected categories include:
- configuration
- Git
- project detection
- process execution
- verification
- rule execution

A single rule failure must not crash the whole check unless the failure invalidates the entire evidence model.

## 6. Logging

No `console.log` inside core/domain packages.

Core returns structured results.

Presentation happens in:
- CLI
- GitHub Action
- reporters

## 7. Tests

Source-local unit tests are preferred for isolated logic.

Repository-level:
- `tests/fixtures` for realistic repositories
- `tests/integration`
- `tests/e2e`

Every built-in rule requires:
- positive fixture/test;
- negative fixture/test;
- evidence assertions.

Every bug fix requires a regression test when practical.

## 8. Commands

Before a task is considered done:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

During development, targeted package commands may be used, but the full quality gate is required before phase completion and release.

## 9. Dependencies

Adding a new dependency requires:
- clear reason;
- smallest reasonable scope;
- maintenance check;
- no duplicate capability already present.

Do not add dependencies just to save a few lines of code.

## 10. Comments

Comments explain:
- architectural constraints;
- non-obvious behavior;
- security rationale;
- algorithmic edge cases.

Do not narrate obvious code.

## 11. Public APIs

Any new exported public contract must:
- be intentionally named;
- be typed;
- have tests where behavior exists;
- be documented if user-facing;
- avoid exposing implementation internals.

## 12. Public package build and tarball policy

The seven public v0.1 packages are `@agentguard/contracts`,
`@agentguard/core`, `@agentguard/runtime-node`, `@agentguard/rules`,
`@agentguard/config`, `@agentguard/report`, and `@agentguard/cli`.

Each public package must have a package-local `tsconfig.build.json` and an
explicit `build` script. The build uses the repository TypeScript base config
with `rootDir: "src"`, `outDir: "dist"`, `noEmit: false`, declarations,
declaration maps, source maps, production-source inclusion, and test/spec/
fixture/dist/node_modules exclusions. Packages are not bundled, and no
CommonJS build is produced.

Public package metadata must resolve the package root to
`./dist/index.js` and `./dist/index.d.ts`; the CLI bin must resolve to
`./dist/main.js`. A public tarball may contain only its `package.json`,
package-local README, MIT LICENSE, and `dist/**`. It must not contain source,
tests, fixtures, coverage, development TypeScript configs, or unrelated
repository tooling.

The final pack gate inspects actual packed artifacts, including the packed
`package.json`, exports, declarations, file list, and rewritten internal
dependency ranges. A temporary external consumer must import representative
package roots, resolve declarations, and run the packed CLI `--help` smoke
test. The GitHub Action remains private and keeps its separate bundled
artifact model.
