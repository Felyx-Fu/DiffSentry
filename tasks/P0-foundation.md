# P0 — Foundation

## Phase objective

Complete this phase in task-ID order unless dependencies clearly allow safe parallel work.

## Phase rule

Do not begin the next phase merely because a few later tasks appear easy. Phase boundaries exist to keep Codex from implementing integrations before foundations are stable.

## Tasks

### AG-001 — Initialize repository root

**Depends on:** None

**Goal:** Create the minimal repository root metadata and package manifest.

**Allowed scope:** repository root

**Must not:** Do not add application code.

**Acceptance:**
- Root package manifest exists and is valid.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-002 — Configure pnpm workspace

**Depends on:** AG-001

**Goal:** Define workspace package discovery for apps and packages.

**Allowed scope:** pnpm-workspace.yaml, root package.json

**Must not:** Do not create package implementations yet.

**Acceptance:**
- pnpm recognizes the workspace.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-003 — Lock Node.js 24

**Depends on:** AG-001

**Goal:** Declare Node.js 24 as the supported development/runtime baseline.

**Allowed scope:** root package.json and optional version metadata

**Must not:** Do not target Node 26.

**Acceptance:**
- Engine/tooling metadata consistently targets Node 24.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-004 — Enable ESM repository-wide

**Depends on:** AG-001

**Goal:** Configure the root for ESM conventions.

**Allowed scope:** root package.json

**Must not:** Do not introduce CommonJS compatibility wrappers.

**Acceptance:**
- ESM package behavior is explicit.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-005 — Create base TypeScript config

**Depends on:** AG-001

**Goal:** Add `tsconfig.base.json` with strict defaults.

**Allowed scope:** tsconfig.base.json

**Must not:** Do not weaken strictness for convenience.

**Acceptance:**
- Strict, noUncheckedIndexedAccess, exactOptionalPropertyTypes are enabled.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-006 — Configure package TypeScript inheritance

**Depends on:** AG-005

**Goal:** Establish a repeatable package tsconfig pattern.

**Allowed scope:** tsconfig files only

**Must not:** Do not add package business code.

**Acceptance:**
- A sample/minimal package config can inherit the base config cleanly.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-007 — Configure Biome

**Depends on:** AG-001

**Goal:** Add formatting and lint rules for the monorepo.

**Allowed scope:** biome.json, root scripts

**Must not:** Do not add ESLint/Prettier in parallel.

**Acceptance:**
- `pnpm lint` is defined and Biome can scan the repo.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-008 — Configure Vitest

**Depends on:** AG-001

**Goal:** Add the shared test runner configuration.

**Allowed scope:** root test config/scripts

**Must not:** Do not create product tests yet.

**Acceptance:**
- `pnpm test` can run successfully with an empty/minimal suite.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-009 — Configure Turborepo

**Depends on:** AG-002

**Goal:** Add task orchestration for build, test, lint, and typecheck.

**Allowed scope:** turbo.json, root scripts

**Must not:** Do not add remote cache services.

**Acceptance:**
- Turbo task graph is valid.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-010 — Add root quality scripts

**Depends on:** AG-007, AG-008, AG-009

**Goal:** Expose build, lint, typecheck, and test from root.

**Allowed scope:** root package.json

**Must not:** Do not hide failures with `|| true`.

**Acceptance:**
- All four commands exist and return meaningful exit codes.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-011 — Create standard .gitignore

**Depends on:** AG-001

**Goal:** Ignore Node, build, coverage, and local AgentGuard artifacts.

**Allowed scope:** .gitignore

**Must not:** Do not ignore source/spec files.

**Acceptance:**
- Generated artifacts are ignored without hiding source.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-012 — Create .editorconfig

**Depends on:** AG-001

**Goal:** Standardize newline, encoding, indentation, and final newline.

**Allowed scope:** .editorconfig

**Must not:** Do not encode editor-specific behavior elsewhere.

**Acceptance:**
- Common editors inherit consistent basic formatting.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-013 — Create workspace package skeletons

**Depends on:** AG-002

**Goal:** Create empty package directories for contracts/core/runtime-node/rules/config/report/cli.

**Allowed scope:** packages/* package manifests and src/index.ts

**Must not:** Do not implement behavior.

**Acceptance:**
- All intended workspace packages are discoverable.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-014 — Create GitHub Action app skeleton

**Depends on:** AG-002

**Goal:** Create `apps/github-action` package skeleton.

**Allowed scope:** apps/github-action

**Must not:** Do not implement GitHub logic.

**Acceptance:**
- App package is discoverable by pnpm.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-015 — Add MIT license

**Depends on:** AG-001

**Goal:** Add the project license.

**Allowed scope:** LICENSE

**Must not:** Do not add dual-license terms.

**Acceptance:**
- LICENSE contains MIT terms.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-016 — Add SECURITY policy

**Depends on:** AG-001

**Goal:** Document responsible security reporting and supported scope.

**Allowed scope:** SECURITY.md

**Must not:** Do not promise unavailable response SLAs.

**Acceptance:**
- Security policy is clear and accurate.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-017 — Add CONTRIBUTING guide

**Depends on:** AG-010

**Goal:** Document local setup, task discipline, tests, and PR expectations.

**Allowed scope:** CONTRIBUTING.md

**Must not:** Do not duplicate the full architecture spec.

**Acceptance:**
- Contributor path from clone to checks is clear.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-018 — Add Code of Conduct

**Depends on:** AG-001

**Goal:** Add community conduct policy.

**Allowed scope:** CODE_OF_CONDUCT.md

**Must not:** Do not invent enforcement contact details.

**Acceptance:**
- Policy is complete without false contact information.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-019 — Add architecture check script skeleton

**Depends on:** AG-013

**Goal:** Create an executable placeholder for package-boundary validation.

**Allowed scope:** scripts/check-architecture.ts

**Must not:** Do not implement all boundary rules yet.

**Acceptance:**
- Script runs and reports a clear placeholder/status.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-020 — Add package-boundary check skeleton

**Depends on:** AG-013

**Goal:** Create package public-import validation entry point.

**Allowed scope:** scripts/check-package-boundaries.ts

**Must not:** Do not block builds until the implementation task says so.

**Acceptance:**
- Script runs without false failures.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-021 — Create ADR structure

**Depends on:** AG-001

**Goal:** Create ADR folder and template.

**Allowed scope:** docs/adr

**Must not:** Do not decide new architecture beyond existing specs.

**Acceptance:**
- ADR template documents context, decision, consequences.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-022 — Record foundational ADRs

**Depends on:** AG-021

**Goal:** Record TypeScript, hexagonal core, determinism, evidence-first, JSON config, no-LLM decisions.

**Allowed scope:** docs/adr

**Must not:** Do not contradict current architecture.

**Acceptance:**
- Six ADRs reflect existing locked decisions.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-023 — Add initial CI workflow

**Depends on:** AG-010

**Goal:** Run install, lint, typecheck, test, and build on GitHub Actions.

**Allowed scope:** .github/workflows/ci.yml

**Must not:** Do not add release publishing.

**Acceptance:**
- CI validates the full root quality gate.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-024 — Verify clean foundation

**Depends on:** AG-001 through AG-023

**Goal:** Run and fix the complete foundation quality gate.

**Allowed scope:** foundation/tooling files only

**Must not:** Do not start P1 product contracts.

**Acceptance:**
- Fresh install then lint/typecheck/test/build all pass.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.
