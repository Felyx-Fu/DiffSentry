# DiffSentry Development Status

## Current phase

P7 — Release & Open Source

## Current task

DiffSentry final brand / npm namespace migration and release candidate protocol

## Completed tasks

### AG-001 DONE

Summary:
- Added the minimal private root package manifest for AgentGuard v0.1.0.

Files:
- `package.json`

Tests:
- `package.json` parsed successfully as JSON with PowerShell `ConvertFrom-Json`.

Validation:
- Root package manifest: PASS
- lint: NOT APPLICABLE — not configured until AG-007
- typecheck: NOT APPLICABLE — not configured until AG-005
- test: NOT APPLICABLE — not configured until AG-008
- build: NOT APPLICABLE — not configured until AG-010

Notes:
- The next task in dependency order is AG-002.

### AG-002 DONE

Summary:
- Added pnpm workspace discovery for `apps/*` and `packages/*`.

Files:
- `pnpm-workspace.yaml`

Tests:
- `pnpm list --recursive --depth 0 --json` completed successfully and recognized the root workspace.

Validation:
- pnpm workspace configuration: PASS
- package implementations: NOT APPLICABLE — deferred to AG-013 and AG-014

Notes:
- The next task in dependency order is AG-003.

### AG-003 DONE

Summary:
- Declared Node.js 24.x as the supported root package engine.

Files:
- `package.json`

Tests:
- `package.json` parsed successfully as JSON.
- `pnpm pkg get engines.node` returned `>=24 <25`.

Validation:
- Node engine metadata: PASS

Notes:
- The current host reports Node `v25.9.0`; this task records the project requirement and does not alter the host runtime.
- The next task in dependency order is AG-004.

### AG-004 DONE

Summary:
- Enabled explicit ESM behavior at the repository root.

Files:
- `package.json`

Tests:
- `package.json` parsed successfully as JSON.
- `pnpm pkg get type` returned `module`.

Validation:
- Root ESM metadata: PASS

Notes:
- No CommonJS compatibility wrapper was added.
- The next task in dependency order is AG-005.

### AG-005 DONE

Summary:
- Added the shared strict TypeScript configuration with ESM-compatible NodeNext settings.

Files:
- `tsconfig.base.json`

Tests:
- Parsed the config and asserted `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, and `noImplicitOverride` are enabled.

Validation:
- TypeScript base configuration: PASS

Notes:
- The current environment has no `tsc` executable; package-level compilation is deferred until the toolchain tasks add the required tooling.
- The next task in dependency order is AG-006.

### AG-006 DONE

Summary:
- Added a reusable package TypeScript configuration that inherits the root strict base config.

Files:
- `tsconfig.package.json`

Tests:
- Parsed the config and verified its `./tsconfig.base.json` inheritance target and package compiler settings.

Validation:
- Package TypeScript inheritance template: PASS

Notes:
- Package directories and implementations remain deferred to AG-013/AG-014.
- The next task in dependency order is AG-007.

### AG-007 DONE

Summary:
- Added Biome formatting/lint configuration and a root `lint` script.
- Added the exact Biome `2.5.10` development dependency required by the lint command.

Files:
- `biome.json`
- `package.json`
- `pnpm-lock.yaml`

Tests:
- `pnpm lint`: PASS — Biome checked 5 files with no fixes required.

Validation:
- Biome configuration: PASS
- Root lint command: PASS

Notes:
- pnpm reports the expected host mismatch: project engine `>=24 <25`, current host Node `v25.9.0`; the project requirement remains unchanged.
- The next task in dependency order is AG-008.

### AG-008 DONE

Summary:
- Added the shared Vitest configuration and root `test` script.
- Enabled a clean empty-suite result while product tests are not yet in scope.

Files:
- `vitest.config.ts`
- `package.json`
- `pnpm-lock.yaml`

Tests:
- `pnpm test`: PASS — Vitest `4.1.10` reported no test files and exited with code 0.
- `pnpm lint`: PASS — Biome checked 6 files with no fixes required.

Validation:
- Vitest configuration: PASS
- Root test command: PASS

Notes:
- The next task in dependency order is AG-009.

### AG-009 DONE

Summary:
- Added the Turborepo task graph for `build`, `lint`, `typecheck`, and `test`.
- Pinned the root package manager metadata so Turbo can derive stable workspace/cache inputs.
- Added the exact Turborepo `2.10.11` development dependency.

Files:
- `turbo.json`
- `package.json`
- `pnpm-lock.yaml`

Tests:
- `pnpm exec turbo --version`: PASS — `2.10.11`.
- `pnpm exec turbo run lint --dry=json`: PASS — valid monorepo graph; no workspace package tasks exist yet.
- `pnpm lint`: PASS — Biome checked 7 files.
- `pnpm test`: PASS — Vitest empty suite exits 0.

Validation:
- Turborepo task graph: PASS

Notes:
- Turbo emitted its own anonymous telemetry notice during validation; no telemetry was added to AgentGuard. Future Turbo checks can set `TURBO_TELEMETRY_DISABLED=1`.
- The next task in dependency order is AG-010.

### AG-010 DONE

Summary:
- Exposed root `build`, `lint`, `typecheck`, and `test` commands.

Files:
- `package.json`

Tests:
- `pnpm lint`: PASS — Biome checked 7 files.
- `pnpm typecheck`: PASS — Turbo ran with 0 workspace package tasks.
- `pnpm test`: PASS — Vitest found no tests and exited 0.
- `pnpm build`: PASS — Turbo ran with 0 workspace package tasks.

Validation:
- Root quality script definitions: PASS
- Meaningful command exit codes: PASS

Notes:
- No product package or source implementation exists yet, so build/typecheck currently validate the orchestration boundary only.
- The next task in dependency order is AG-011.

### AG-011 DONE

Summary:
- Added ignore rules for dependencies, generated build/test output, logs, and local AgentGuard state.

Files:
- `.gitignore`

Tests:
- Verified all required generated-artifact entries are present.
- Verified no broad source/spec patterns such as `*.md`, `packages/`, `apps/`, `tests/`, or `src/` are ignored.

Validation:
- `.gitignore` scope: PASS

Notes:
- The next task in dependency order is AG-012.

### AG-012 DONE

Summary:
- Added repository-wide editor defaults for UTF-8, LF endings, spaces, final newlines, and trailing whitespace handling.

Files:
- `.editorconfig`

Tests:
- Asserted all required settings are present.
- Verified the file ends with an LF newline.

Validation:
- `.editorconfig` settings: PASS

Notes:
- The next task in dependency order is AG-013.

### AG-013 DONE

Summary:
- Created the seven P0 workspace package skeletons with package manifests and empty public entry points.

Files:
- `packages/contracts/`
- `packages/core/`
- `packages/runtime-node/`
- `packages/rules/`
- `packages/config/`
- `packages/report/`
- `packages/cli/`
- `pnpm-lock.yaml`

Tests:
- `pnpm install --ignore-scripts`: PASS — scope reported all 8 workspace projects.
- `pnpm list --recursive --depth 0 --json`: PASS — all seven `@agentguard/*` packages discovered.
- `pnpm lint`: PASS — Biome checked 21 files.
- `pnpm test`: PASS — Vitest empty suite exits 0.

Validation:
- Workspace package discovery: PASS
- Package skeleton scope: PASS — no package behavior or dependencies added.

Notes:
- The next task in dependency order is AG-014.

### AG-014 DONE

Summary:
- Created the GitHub Action app skeleton with an empty TypeScript entry point, action metadata, and package TypeScript config.

Files:
- `apps/github-action/package.json`
- `apps/github-action/action.yml`
- `apps/github-action/src/main.ts`
- `apps/github-action/tsconfig.json`
- `pnpm-lock.yaml`

Tests:
- `pnpm install --ignore-scripts`: PASS — scope reported all 9 workspace projects.
- Verified the app package is discovered and `action.yml` declares `node24` with `dist/main.js`.
- Verified the app tsconfig inherits `../../tsconfig.package.json`.
- `pnpm lint`: PASS — Biome checked 24 files.
- `pnpm test`: PASS — Vitest empty suite exits 0.

Validation:
- GitHub Action package skeleton: PASS
- GitHub Action logic: NOT IMPLEMENTED — deferred to later P6 tasks.

Notes:
- The next task in dependency order is AG-015.

### AG-015 DONE

Summary:
- Added the standard MIT License for AgentGuard.

Files:
- `LICENSE`

Tests:
- Verified the MIT license title, permission grant, warranty disclaimer, and liability disclaimer are present.

Validation:
- License terms: PASS
- Dual-license additions: NONE

Notes:
- The next task in dependency order is AG-016.

### AG-016 DONE

Summary:
- Added a security policy covering supported AgentGuard security surfaces, private reporting guidance, and contributor trust-boundary expectations.

Files:
- `SECURITY.md`

Tests:
- Verified the supported-scope, reporting, and contributor-security sections.
- Verified the policy contains no invented contact address or fixed response SLA.

Validation:
- Security policy accuracy/scope: PASS

Notes:
- The next task in dependency order is AG-017.

### AG-017 DONE

Summary:
- Added contributor guidance for Node/pnpm setup, atomic task workflow, quality checks, tests, and focused pull requests.

Files:
- `CONTRIBUTING.md`

Tests:
- Verified the required setup, workflow, checks, and pull-request sections in the 60-line guide.
- `pnpm lint`: PASS — Biome checked 24 files.
- `pnpm typecheck`: PASS — Turbo found 8 workspace packages and no package typecheck scripts yet.
- `pnpm test`: PASS — Vitest empty suite exits 0.
- `pnpm build`: PASS — Turbo found 8 workspace packages and no package build scripts yet.

Validation:
- Contributor setup and task discipline documentation: PASS
- Architecture duplication: NOT INTRODUCED

Notes:
- The next task in dependency order is AG-018.

### AG-018 DONE

Summary:
- Added a complete community code of conduct with expected behavior, prohibited conduct, scope, reporting, enforcement, and anti-retaliation guidance.

Files:
- `CODE_OF_CONDUCT.md`

Tests:
- Verified all required policy sections are present.
- Verified no invented contact address, response SLA, or enforcement promise is included.

Validation:
- Code of Conduct completeness: PASS

Notes:
- The next task in dependency order is AG-019.

### AG-019 DONE

Summary:
- Added the executable architecture-check placeholder with an explicit deferred-validation message.

Files:
- `scripts/check-architecture.ts`

Tests:
- `node scripts/check-architecture.ts`: PASS — emitted the placeholder status and exited 0.
- `pnpm lint`: PASS — Biome checked 25 files.

Validation:
- Script entry point: PASS
- Full architecture enforcement: NOT IMPLEMENTED — intentionally deferred by task scope.

Notes:
- The next task in dependency order is AG-020.

### AG-020 DONE

Summary:
- Added the executable package-boundary validation entry-point placeholder.

Files:
- `scripts/check-package-boundaries.ts`

Tests:
- `node scripts/check-package-boundaries.ts`: PASS — emitted the deferred-validation status and exited 0.
- `pnpm lint`: PASS — Biome checked 26 files.

Validation:
- Script entry point: PASS
- Build-blocking boundary validation: NOT ENABLED — intentionally deferred by task scope.

Notes:
- The next task in dependency order is AG-021.

### AG-021 DONE

Summary:
- Created the ADR directory and a reusable decision-record template.

Files:
- `docs/adr/000-template.md`

Tests:
- Verified the template includes context, decision, consequences, alternatives, and verification sections.

Validation:
- ADR structure/template: PASS
- New architecture decision: NONE

Notes:
- The next task in dependency order is AG-022.

### AG-022 DONE

Summary:
- Recorded six accepted foundational ADRs for the locked TypeScript toolchain, hexagonal core, deterministic verification, evidence-first findings, JSON-only configuration, and no-LLM v0.1 scope.

Files:
- `docs/adr/001-typescript-monorepo-toolchain.md`
- `docs/adr/002-hexagonal-core.md`
- `docs/adr/003-deterministic-verification.md`
- `docs/adr/004-evidence-first-findings.md`
- `docs/adr/005-json-configuration.md`
- `docs/adr/006-no-llm-v0-1.md`

Tests:
- Verified the ADR directory contains the template plus exactly six accepted foundational ADRs.
- Verified every foundational ADR contains context, decision, consequences, alternatives, and verification sections.
- `pnpm lint`: PASS — Biome checked 26 files.
- `pnpm test`: PASS — Vitest empty suite exits 0.

Validation:
- Foundational ADR set: PASS
- New architecture beyond the specifications: NONE

Notes:
- The next task in dependency order is AG-023.

### AG-023 DONE

Summary:
- Added the initial read-only GitHub Actions CI workflow for install, lint, typecheck, test, and build.

Files:
- `.github/workflows/ci.yml`

Tests:
- `pnpm install --frozen-lockfile --ignore-scripts`: PASS — all 9 workspace projects resolved.
- Verified CI triggers on push and pull request with `contents: read` only.
- Verified Node 24, pnpm setup, frozen install, and all four required root commands are present.
- Verified no release/publish step or broad write permission is present.
- `pnpm lint`: PASS — Biome checked 26 files.
- `pnpm typecheck`: PASS — Turbo ran across 8 workspace packages with no package tasks yet.
- `pnpm test`: PASS — Vitest empty suite exits 0.
- `pnpm build`: PASS — Turbo ran across 8 workspace packages with no package tasks yet.

Validation:
- CI workflow structure: PASS
- YAML-specific actionlint: NOT AVAILABLE — `actionlint` is not installed in the environment.

Notes:
- The next task in dependency order is AG-024.

### AG-024 DONE

Summary:
- Completed the P0 foundation verification after a forced frozen-lockfile reinstall.

Files:
- Foundation/tooling files only; no P1 contract files were added.

Tests:
- `pnpm install --frozen-lockfile --force --ignore-scripts`: PASS — all 9 workspace projects reinstalled.
- `pnpm lint`: PASS — Biome checked 26 files.
- `pnpm typecheck`: PASS — Turbo ran across 8 workspace packages; no package typecheck tasks exist yet.
- `pnpm test`: PASS — Vitest found no product tests and exited 0.
- `pnpm build`: PASS — Turbo ran across 8 workspace packages; no package build tasks exist yet.

Validation:
- P0 foundation quality gate: PASS
- P0 task sequence AG-001 through AG-024: COMPLETE
- P1 product contracts: NOT STARTED

Notes:
- P0 is complete. The next phase is P1 — Contracts.
- The next task in dependency order is AG-100.

### AG-100 DONE

Summary:
- Defined the P1 ecosystem contract as the explicit `node | unknown` union.

Files:
- `packages/contracts/src/project.ts`
- `package.json`
- `pnpm-lock.yaml`

Tests:
- `pnpm exec tsc --version`: PASS — TypeScript `6.0.2`.
- Direct strict `tsc --noEmit` compilation of `packages/contracts/src/project.ts`: PASS.
- `pnpm lint`: PASS — Biome checked 27 files.
- `pnpm test`: PASS — Vitest empty suite exits 0.

Validation:
- Ecosystem type export: PASS
- Node/runtime imports in contracts: NONE

Notes:
- TypeScript `6.0.2` was added as the necessary locked compiler dependency because the initial foundation had no `tsc` executable.
- The package-root barrel remains intentionally empty until AG-116.
- The next task in dependency order is AG-101.

### AG-101 DONE

Summary:
- Defined the explicit `npm | pnpm | yarn | bun` package-manager contract.

Files:
- `packages/contracts/src/project.ts`

Tests:
- Direct strict `tsc --noEmit` compilation of `packages/contracts/src/project.ts`: PASS.
- `pnpm lint`: PASS — Biome checked 27 files.

Validation:
- PackageManager type export: PASS
- Lockfile detection logic: NOT ADDED

Notes:
- The next task in dependency order is AG-102.

### AG-102 DONE

Summary:
- Defined the pure `ProjectContext` metadata contract with repository root, ecosystem, package manager, languages, and frameworks.

Files:
- `packages/contracts/src/project.ts`

Tests:
- Direct strict `tsc --noEmit` compilation of `packages/contracts/src/project.ts`: PASS.
- `pnpm lint`: PASS — Biome checked 27 files.

Validation:
- ProjectContext fields: PASS
- Runtime detection or Node imports: NONE

Notes:
- The next task in dependency order is AG-103.

### AG-103 DONE

Summary:
- Defined the pure `FileStatus` union for added, modified, deleted, and renamed files.

Files:
- `packages/contracts/src/change.ts`

Tests:
- Direct strict `tsc --noEmit` compilation of the project and change contracts: PASS.
- `pnpm lint`: PASS — Biome checked 28 files.

Validation:
- FileStatus type export: PASS
- Git parsing/detection logic: NOT ADDED

Notes:
- The next task in dependency order is AG-104.

### AG-104 DONE

Summary:
- Defined the fixed v0.1 file-category union for source, test, config, dependency, documentation, CI, and unknown files.

Files:
- `packages/contracts/src/change.ts`

Tests:
- Direct strict `tsc --noEmit` compilation of the project and change contracts: PASS.
- `pnpm lint`: PASS — Biome checked 28 files.

Validation:
- FileCategory contract: PASS
- Framework-specific categories: NOT ADDED

Notes:
- The next task in dependency order is AG-105.

### AG-105 DONE

Summary:
- Defined `ChangedFile` with path, file status, additions, deletions, and category fields.

Files:
- `packages/contracts/src/change.ts`

Tests:
- Direct strict `tsc --noEmit` compilation of the project and change contracts: PASS.
- `pnpm lint`: PASS — Biome checked 28 files.

Validation:
- ChangedFile contract: PASS
- Diff parser behavior: NOT ADDED

Notes:
- The next task in dependency order is AG-106.

### AG-106 DONE

Summary:
- Defined `ChangeSet` with base ref, head ref, and an immutable changed-file list.

Files:
- `packages/contracts/src/change.ts`

Tests:
- Direct strict `tsc --noEmit` compilation of the project and change contracts: PASS.
- `pnpm lint`: PASS — Biome checked 28 files.

Validation:
- ChangeSet contract: PASS
- Git querying/parsing behavior: NOT ADDED

Notes:
- The next task in dependency order is AG-107.

### AG-107 DONE

Summary:
- Defined the five-level `Severity` contract: info, low, medium, high, and critical.

Files:
- `packages/contracts/src/finding.ts`

Tests:
- Direct strict `tsc --noEmit` compilation of project, change, and finding contracts: PASS.
- `pnpm lint`: PASS — Biome checked 29 files.

Validation:
- Severity type export: PASS
- Severity weights/score thresholds: NOT ADDED

Notes:
- The next task in dependency order is AG-108.

### AG-108 DONE

Summary:
- Added the pure evidence model with a required message and optional path/line/column location.

Files:
- `packages/contracts/src/evidence.ts`

Tests:
- Direct strict `tsc --noEmit` compilation of all current contract source files: PASS.
- `pnpm lint`: PASS — Biome checked 30 files.

Validation:
- Evidence message and optional location support: PASS
- Evidence rendering behavior: NOT ADDED

Notes:
- The next task in dependency order is AG-109.

### AG-109 DONE

Summary:
- Defined `Finding` as a structured claim with rule ID, severity, title, message, evidence, confidence, and optional location.

Files:
- `packages/contracts/src/finding.ts`

Tests:
- Direct strict `tsc --noEmit` compilation of all current contract source files: PASS.
- `pnpm lint`: PASS — Biome checked 30 files.

Validation:
- Finding claim/evidence shape: PASS
- Severity, confidence, and risk-score calculation: NOT ADDED

Notes:
- The next task in dependency order is AG-110.

### AG-110 DONE

Summary:
- Defined the four-state `VerificationStatus` union: passed, failed, skipped, and error.

Files:
- `packages/contracts/src/verification.ts`

Tests:
- Direct strict `tsc --noEmit` compilation of all current contract source files: PASS.
- `pnpm lint`: PASS — Biome checked 31 files.

Validation:
- VerificationStatus type export: PASS
- Verifier execution behavior: NOT ADDED

Notes:
- The next task in dependency order is AG-111.

### AG-111 DONE

Summary:
- Defined command metadata, bounded stdout/stderr summaries, duration, exit code, ID, and status for verification results.

Files:
- `packages/contracts/src/verification.ts`

Tests:
- Direct strict `tsc --noEmit` compilation of all current contract source files: PASS.
- `pnpm lint`: PASS — Biome checked 31 files.

Validation:
- VerificationResult contract: PASS
- Unbounded output assumptions: NOT INTRODUCED — summaries include truncation flags.
- Verifier execution: NOT ADDED

Notes:
- The next task in dependency order is AG-112.

### AG-112 DONE

Summary:
- Defined the explicit `pass | review | fail` verdict contract.

Files:
- `packages/contracts/src/verdict.ts`

Tests:
- Direct strict `tsc --noEmit` compilation of all current contract source files: PASS.
- `pnpm lint`: PASS — Biome checked 32 files.

Validation:
- Verdict type export: PASS
- Score thresholds/verdict calculation: NOT ADDED

Notes:
- The next task in dependency order is AG-113.

### AG-113 DONE

Summary:
- Defined the aggregate `AgentGuardReport` contract for version, project, changes, findings, verifications, risk score, and verdict.

Files:
- `packages/contracts/src/report.ts`

Tests:
- Direct strict `tsc --noEmit` compilation of all current contract source files: PASS.
- `pnpm lint`: PASS — Biome checked 33 files after correcting import order.

Validation:
- AgentGuardReport aggregation shape: PASS
- Rendering and risk calculation: NOT ADDED

Notes:
- The next task in dependency order is AG-114.

### AG-114 DONE

Summary:
- Defined configuration DTOs for verification toggles, rule overrides, risk thresholds, and partial top-level config.

Files:
- `packages/contracts/src/config.ts`

Tests:
- Direct strict `tsc --noEmit` compilation of all current contract source files: PASS.
- `pnpm lint`: PASS — Biome checked 34 files.

Validation:
- Config DTO shape: PASS
- File loading, parsing, validation, and merge behavior: NOT ADDED
- Executable configuration: NOT SUPPORTED

Notes:
- The next task in dependency order is AG-115.

### AG-115 DONE

Summary:
- Added the explicit report schema version constant `REPORT_SCHEMA_VERSION = 1` and linked it to `AgentGuardReport.schemaVersion`.

Files:
- `packages/contracts/src/report.ts`

Tests:
- Direct strict `tsc --noEmit` compilation of all current contract source files: PASS.
- `pnpm lint`: PASS — Biome checked 34 files.

Validation:
- Current report schema version: PASS
- Schema migration behavior: NOT ADDED

Notes:
- The next task in dependency order is AG-116.

### AG-116 DONE

Summary:
- Replaced the empty contracts entry point with deliberate root exports for all v0.1 contracts and the report schema version.

Files:
- `packages/contracts/src/index.ts`

Tests:
- Direct strict `tsc --noEmit` compilation from `packages/contracts/src/index.ts`: PASS.
- `pnpm lint`: PASS — Biome checked 34 files after ordering exports.

Validation:
- Intentional package-root public exports: PASS
- Deep internal exports: NOT ADDED

Notes:
- The next task in dependency order is AG-117.

### AG-117 DONE

Summary:
- Added focused source-local Vitest fixtures for project/change, evidence-backed finding and verification, report schema, and JSON configuration DTOs.

Files:
- `packages/contracts/src/contracts.test.ts`

Tests:
- `pnpm test`: PASS — 1 file, 3 tests passed.
- Direct strict `tsc --noEmit` compilation of the contracts barrel and contract tests: PASS.
- `pnpm lint`: PASS — Biome checked 35 files.

Validation:
- Critical contract shape coverage: PASS
- Runtime constructors/guards: NOT APPLICABLE — no constructors or guards exist in the contract-only package.

Notes:
- The next task in dependency order is AG-118.

### AG-118 DONE

Summary:
- Replaced the architecture placeholder with a deterministic contracts-boundary check for Node built-ins, `node:` imports, cross-package/cross-directory imports, and runtime dependencies in the contracts manifest.

Files:
- `scripts/check-architecture.ts`

Tests:
- `node scripts/check-architecture.ts`: PASS — 10 contracts source files checked.
- Negative fixture with `node:fs`: PASS — checker returned exit code 1 and identified the file and forbidden module; fixture was removed afterward.
- `pnpm exec tsc --noEmit` on the contracts barrel and tests: PASS.
- `pnpm test`: PASS — 1 file, 3 tests passed.
- `pnpm lint`: PASS — Biome checked 35 files.

Validation:
- Contracts runtime-agnostic boundary: PASS
- Full repository boundary enforcement: NOT YET IMPLEMENTED — remains outside AG-118 scope.

Notes:
- The next task in dependency order is AG-119.

### AG-119 DONE

Summary:
- Completed the P1 contracts phase gate and verified the intentional public contract API.

Files:
- P1 contract files and tests only; no runtime adapter files were added.

Tests:
- `pnpm install --frozen-lockfile --ignore-scripts`: PASS — all 9 workspace projects resolved.
- `pnpm lint`: PASS — Biome checked 35 files.
- `pnpm typecheck`: PASS — Turbo evaluated 8 workspace packages; package-level scripts are not yet defined.
- `pnpm exec tsc --noEmit` on the contracts barrel and contract tests: PASS.
- `pnpm test`: PASS — 1 file, 3 tests passed.
- `pnpm build`: PASS — Turbo evaluated 8 workspace packages; package-level build scripts are not yet defined.
- `node scripts/check-architecture.ts`: PASS — 10 contracts source files checked.
- Public barrel inspection: PASS — all intended P1 sources exported, no parent-directory exports.

Validation:
- P1 Contracts phase gate: PASS
- P1 task sequence AG-100 through AG-119: COMPLETE
- P2 runtime adapters: NOT STARTED

Notes:
- P1 is complete. The next phase is P2 — Runtime.
- The next task in dependency order is AG-200.

### AG-200 DONE

Summary:
- Defined the minimal async `FileSystemPort` for existence checks, UTF-8 text reads, and upward named-file lookup.

Files:
- `packages/core/src/ports/file-system.ts`

Tests:
- Direct strict `tsc --noEmit` compilation of the port and contracts barrel: PASS.
- `pnpm lint`: PASS — Biome checked 36 files.
- `node scripts/check-architecture.ts`: PASS — contracts boundary remains clean.

Validation:
- FileSystemPort purity: PASS — no Node or adapter imports.
- Node filesystem implementation: NOT ADDED

Notes:
- The next task in dependency order is AG-201.

### AG-201 DONE

Summary:
- Implemented `NodeFileSystem.exists` with `node:fs/promises`, returning false only for missing-path errors and preserving other failures.

Files:
- `packages/runtime-node/src/filesystem/node-file-system.ts`
- `packages/runtime-node/src/filesystem/node-file-system.test.ts`
- `package.json`
- `pnpm-lock.yaml`

Tests:
- `pnpm test`: PASS — 2 files, 5 tests passed; includes existing and missing path cases.
- Direct strict TypeScript compilation with `--types node`: PASS.
- `pnpm lint`: PASS — Biome checked 38 files.

Validation:
- NodeFileSystem.exists behavior: PASS
- Globbing: NOT ADDED
- Core deep imports/runtime boundary: PRESERVED

Notes:
- Added exact `@types/node@24.13.3` as the required Node adapter type dependency.
- The next task in dependency order is AG-202.

### AG-202 DONE

Summary:
- Implemented UTF-8 `NodeFileSystem.readText` with typed not-found/read-failed errors.

Files:
- `packages/runtime-node/src/filesystem/node-file-system.ts`
- `packages/runtime-node/src/filesystem/node-file-system.test.ts`

Tests:
- `pnpm test`: PASS — 2 files, 7 tests passed; includes UTF-8 preservation and typed missing-read errors.
- Direct strict TypeScript compilation with `--types node`: PASS.
- `pnpm lint`: PASS — Biome checked 38 files.

Validation:
- UTF-8 text read: PASS
- Typed filesystem errors: PASS
- JSON parsing: NOT ADDED

Notes:
- The next task in dependency order is AG-203.

### AG-203 DONE

Summary:
- Implemented parent-directory-only `NodeFileSystem.findUp` with root termination and no subtree/glob scanning.

Files:
- `packages/runtime-node/src/filesystem/node-file-system.ts`
- `packages/runtime-node/src/filesystem/node-file-system.test.ts`

Tests:
- `pnpm test`: PASS — 2 files, 9 tests passed; includes ancestor hit, no-hit, and root termination.
- Direct strict TypeScript compilation with `--types node`: PASS.
- `pnpm lint`: PASS — Biome checked 38 files.

Validation:
- Upward named-file lookup: PASS
- Unrelated subtree scanning/globbing: NOT ADDED

Notes:
- The next task in dependency order is AG-204.

### AG-204 DONE

Summary:
- Defined semantic Git capabilities for repository detection/root, machine-readable status, explicit-ref diff, and working-tree diff.

Files:
- `packages/core/src/ports/git-provider.ts`

Tests:
- Direct strict `tsc --noEmit` compilation of the Git/FileSystem ports and contracts barrel: PASS.
- `pnpm lint`: PASS — Biome checked 39 files.

Validation:
- GitProvider port: PASS
- Shell command strings/Node implementation: NOT EXPOSED or ADDED

Notes:
- The next task in dependency order is AG-205.

### AG-205 DONE

Summary:
- Implemented shell-free Git worktree detection with bounded output and a timeout.

Files:
- `packages/runtime-node/src/git/node-git-provider.ts`
- `packages/runtime-node/src/git/node-git-provider.test.ts`

Tests:
- `pnpm test`: PASS — 3 files, 11 tests passed; includes a real temporary Git worktree and a non-Git directory.
- Direct strict TypeScript compilation with `--types node`: PASS.
- `pnpm lint`: PASS — Biome checked 41 files.

Validation:
- Git repository detection: PASS
- Shell execution: PASS — fixed executable plus args array, `shell: false`.
- Diff parsing: NOT ADDED

Notes:
- The next task in dependency order is AG-206.

### AG-206 DONE

Summary:
- Implemented canonical Git repository root resolution from nested paths using `rev-parse --show-toplevel` and `realpath`.

Files:
- `packages/runtime-node/src/git/node-git-provider.ts`
- `packages/runtime-node/src/git/node-git-provider.test.ts`

Tests:
- `pnpm test`: PASS — 3 files, 12 tests passed; includes nested working-directory root resolution.
- Direct strict TypeScript compilation with `--types node`: PASS.
- `pnpm lint`: PASS — Biome checked 41 files.

Validation:
- Canonical repository root: PASS
- Global `chdir`: NOT USED
- Diff parsing: NOT ADDED

Notes:
- The next task in dependency order is AG-207.

### AG-207 DONE

Summary:
- Implemented machine-readable Git status retrieval using porcelain v1 output.
- Mapped Git index/worktree status codes to runtime states for added, modified, deleted, renamed, untracked, and unknown entries.
- Preserved the runtime boundary: status retrieval does not classify files into AgentGuard categories.

Files:
- `packages/runtime-node/src/git/node-git-provider.ts`
- `packages/runtime-node/src/git/node-git-provider.test.ts`

Tests:
- `pnpm test`: PASS — 3 files, 14 tests passed; includes clean and untracked-file dirty repository cases.
- Direct strict TypeScript compilation with `--types node`: PASS.
- `pnpm lint`: PASS — Biome checked 41 files.

Validation:
- Clean repository status: PASS — returns `isClean: true` with no entries.
- Dirty repository status: PASS — returns `isClean: false` with an untracked entry.
- Shell execution: PASS — fixed executable plus argument array, `shell: false`, bounded output, and timeout.
- AgentGuard category classification: NOT ADDED.

Notes:
- The next task in dependency order is AG-208.

### AG-208 DONE

Summary:
- Implemented raw Git diff retrieval between two explicit refs.
- Passed refs as separate arguments to the fixed Git executable with deterministic no-color/no-external-diff options.
- Kept diff content opaque to this runtime task; parsing remains deferred to the core phase.

Files:
- `packages/runtime-node/src/git/node-git-provider.ts`
- `packages/runtime-node/src/git/node-git-provider.test.ts`

Tests:
- `pnpm test`: PASS — 3 files, 17 tests passed; includes non-empty valid-ref diff, identical-ref empty diff, and invalid-ref failure cases.
- Direct strict TypeScript compilation with `--types node`: PASS.
- `pnpm lint`: PASS — Biome checked 41 files.
- `node scripts/check-architecture.ts`: PASS — 10 contracts source files checked.

Validation:
- Explicit-ref raw diff: PASS — returned unparsed diff text containing the committed change.
- Empty diff: PASS — identical valid refs return an empty string.
- Invalid ref: PASS — Git failure is surfaced to the caller.
- Shell command construction: NOT USED — executable and arguments remain separate.

Notes:
- The next task in dependency order is AG-209.

### AG-209 DONE

Summary:
- Implemented working-tree diff retrieval by comparing `HEAD` with the current tracked working tree.
- Included staged and unstaged tracked changes while leaving untracked content outside the raw diff.

Files:
- `packages/runtime-node/src/git/node-git-provider.ts`
- `packages/runtime-node/src/git/node-git-provider.test.ts`

Tests:
- `pnpm test`: PASS — 3 files, 18 tests passed; includes staged tracked modification and untracked-content exclusion.
- Direct strict TypeScript compilation with `--types node`: PASS.
- `pnpm lint`: PASS — Biome checked 41 files.

Validation:
- HEAD-to-working-tree comparison: PASS.
- Staged tracked changes: PASS — included in the returned raw diff.
- Untracked content: PASS — excluded because it is not explicitly modeled by this port.
- Diff parsing/category classification: NOT ADDED.

Notes:
- The next task in dependency order is AG-210.

### AG-210 DONE

Summary:
- Added a runtime-node test-only fixture for real temporary Git repositories.
- Centralized repository initialization, local commit identity, file writes, staging, commits, and cleanup.
- Refactored Git adapter tests to use the fixture while retaining a non-Git-directory negative case.

Files:
- `packages/runtime-node/src/test-utils/git-fixture.ts`
- `packages/runtime-node/src/git/node-git-provider.test.ts`

Tests:
- `pnpm test`: PASS — 3 files, 18 tests passed; Git status, ref diff, and working-tree diff tests now use the real fixture.
- Direct strict TypeScript compilation with `--types node`: PASS.
- `pnpm lint`: PASS — Biome checked 42 files.

Validation:
- Real temporary repositories: PASS — tests create commits and deterministic diffs without mocking Git behavior.
- Fixture command execution: PASS — fixed Git executable, argument arrays, and `shell: false`.
- Runtime public API: UNCHANGED — fixture is test-only and not exported from the runtime package root.

Notes:
- The next task in dependency order is AG-211.

### AG-211 DONE

Summary:
- Defined the core ProcessRunner port for an executable, argument array, working directory, timeout, stdout/stderr byte limits, bounded stream output, exit code, and duration.
- Kept command arguments structurally separate from executable names; no shell-script field exists.

Files:
- `packages/core/src/ports/process-runner.ts`

Tests:
- Direct strict TypeScript compilation of the ProcessRunner and existing core ports: PASS.
- `pnpm lint`: PASS — Biome checked 43 files.
- `pnpm test`: PASS — 3 files, 18 tests passed.

Validation:
- Argument-array requirement: PASS — `ProcessCommand.args` is `readonly string[]`.
- Shell command strings: NOT EXPOSED.
- Runtime process execution: NOT IMPLEMENTED — deferred to AG-212 and later process tasks.

Notes:
- The next task in dependency order is AG-212.

### AG-212 DONE

Summary:
- Implemented the initial Node ProcessRunner using `spawn` with a fixed `shell: false` option and an argument array.
- Captured bounded stdout/stderr streams and returned command metadata, working directory, output summaries, exit code, and duration.

Files:
- `packages/runtime-node/src/process/node-process-runner.ts`
- `packages/runtime-node/src/process/node-process-runner.test.ts`

Tests:
- `pnpm test`: PASS — 4 files, 19 tests passed; includes a real Node child process invoked with separate arguments.
- Direct strict TypeScript compilation with `--types node`: PASS.
- `pnpm lint`: PASS — Biome checked 45 files.

Validation:
- Shell-free spawn: PASS — `spawn` receives a fixed executable, copied argument array, `shell: false`, and hidden Windows child window.
- Basic stdout/stderr capture: PASS.
- Timeout enforcement: NOT YET IMPLEMENTED — deferred to AG-213.
- Typed process errors: NOT YET IMPLEMENTED — deferred to AG-217.

Notes:
- The next task in dependency order is AG-213.

### AG-213 DONE

Summary:
- Enforced positive `timeoutMs` values in the Node process adapter.
- On timeout, requested child termination and waited for the child `close` event before rejecting, so the caller is not released while the child is still being cleaned up.
- Cleared timeout handles on normal close and spawn error paths.

Files:
- `packages/runtime-node/src/process/node-process-runner.ts`
- `packages/runtime-node/src/process/node-process-runner.test.ts`

Tests:
- `pnpm test`: PASS — 4 files, 20 tests passed; includes a long-running child terminated by the configured timeout.
- Direct strict TypeScript compilation with `--types node`: PASS.
- `pnpm lint`: PASS — Biome checked 45 files.

Validation:
- Timeout termination: PASS — configured 50ms timeout rejects after child termination.
- Child cleanup boundary: PASS — rejection occurs from the post-`close` path.
- Typed timeout error: NOT YET IMPLEMENTED — deferred to AG-217.

Notes:
- The next task in dependency order is AG-214.

### AG-214 DONE

Summary:
- Verified bounded stdout capture against the configured byte limit.
- Marked stdout as truncated whenever emitted bytes exceed the retained limit.

Files:
- `packages/runtime-node/src/process/node-process-runner.test.ts`

Tests:
- `pnpm test`: PASS — 4 files, 21 tests passed; 4096-byte stdout is bounded to 64 bytes and marked truncated.
- Direct strict TypeScript compilation with `--types node`: PASS.
- `pnpm lint`: PASS — Biome checked 45 files.

Validation:
- stdout byte limit: PASS.
- stdout truncation indicator: PASS.
- Unbounded stdout buffering: NOT USED — capture retains only the configured byte limit.

Notes:
- The next task in dependency order is AG-215.

### AG-215 DONE

Summary:
- Verified bounded stderr capture independently from stdout.
- Marked stderr as truncated whenever emitted bytes exceed its configured limit.

Files:
- `packages/runtime-node/src/process/node-process-runner.test.ts`

Tests:
- `pnpm test`: PASS — 4 files, 22 tests passed; 4096-byte stderr is bounded to 64 bytes and marked truncated.
- Direct strict TypeScript compilation with `--types node`: PASS.
- `pnpm lint`: PASS — Biome checked 45 files.

Validation:
- stderr byte limit: PASS.
- stderr truncation indicator: PASS.
- stdout/stderr limit independence: PASS.

Notes:
- The next task in dependency order is AG-216.

### AG-216 DONE

Summary:
- Verified stable process exit-code and duration metadata.
- Kept nonzero exit codes as process results; no verifier verdict interpretation was added.

Files:
- `packages/runtime-node/src/process/node-process-runner.test.ts`

Tests:
- `pnpm test`: PASS — 4 files, 23 tests passed; includes successful exit, nonzero exit code `7`, and measured delayed duration.
- Direct strict TypeScript compilation with `--types node`: PASS.
- `pnpm lint`: PASS — Biome checked 45 files.

Validation:
- Successful exit metadata: PASS.
- Failure exit metadata: PASS — returns exit code without converting it to a verdict.
- Duration metadata: PASS.
- Verdict calculation: NOT ADDED.

Notes:
- The next task in dependency order is AG-217.

### AG-217 DONE

Summary:
- Added typed runtime process errors for spawn failures and timeouts.
- Normalized expected failures without exposing opaque Node error objects as the adapter API.

Files:
- `packages/runtime-node/src/process/node-process-runner.ts`
- `packages/runtime-node/src/process/node-process-runner.test.ts`

Tests:
- `pnpm test`: PASS — 4 files, 24 tests passed; includes typed spawn-failure and timeout assertions.
- Direct strict TypeScript compilation with `--types node`: PASS.
- `pnpm lint`: PASS — Biome checked 45 files.

Validation:
- Spawn failure category: PASS — `ProcessError.code === "spawn-failed"`.
- Timeout category: PASS — `ProcessError.code === "timeout"`.
- Opaque Node errors in the public failure path: NOT EXPOSED.

Notes:
- The next task in dependency order is AG-218.

### AG-218 DONE

Summary:
- Defined the pure Clock port with an explicit `now(): number` capability for injectable deterministic time.

Files:
- `packages/core/src/ports/clock.ts`

Tests:
- Direct strict TypeScript compilation of the Clock and existing core ports: PASS.
- `pnpm lint`: PASS — Biome checked 46 files.
- `pnpm test`: PASS — 4 files, 24 tests passed.

Validation:
- Clock port export: PASS.
- Core Node time access: NOT USED — no `Date.now` or Node runtime import in the port.

Notes:
- The next task in dependency order is AG-219.

### AG-219 DONE

Summary:
- Implemented the minimal SystemClock adapter that returns system epoch milliseconds.
- Added a mocked-time unit test without introducing business logic.

Files:
- `packages/runtime-node/src/clock/system-clock.ts`
- `packages/runtime-node/src/clock/system-clock.test.ts`

Tests:
- `pnpm test`: PASS — 5 files, 25 tests passed.
- Direct strict TypeScript compilation with `--types node`: PASS.
- `pnpm lint`: PASS — Biome checked 48 files.

Validation:
- System time adapter: PASS — delegates to `Date.now()`.
- Business logic: NOT ADDED.

Notes:
- The next task in dependency order is AG-220.

### AG-220 DONE

Summary:
- Implemented a deliberately small SystemEnvironment adapter exposing platform, Node version, and current working directory.
- Did not expose `process.env` or include an environment-variable snapshot API.

Files:
- `packages/runtime-node/src/environment/system-environment.ts`
- `packages/runtime-node/src/environment/system-environment.test.ts`

Tests:
- `pnpm test`: PASS — 6 files, 26 tests passed.
- Direct strict TypeScript compilation with `--types node`: PASS.
- `pnpm lint`: PASS — Biome checked 50 files.

Validation:
- Deliberately small environment API: PASS.
- Full environment-variable dump: NOT ADDED.

Notes:
- The next task in dependency order is AG-221.

### AG-221 DONE

Summary:
- Replaced the empty runtime-node entry point with deliberate root exports for the filesystem, Git, process, clock, and environment adapters plus ProcessError.
- Kept test utilities and internal implementation modules out of the public root API.

Files:
- `packages/runtime-node/src/index.ts`
- `packages/runtime-node/src/index.test.ts`

Tests:
- `pnpm test`: PASS — 7 files, 27 tests passed; verifies the seven intended runtime exports.
- Direct strict TypeScript compilation of the runtime barrel and API test: PASS.
- `pnpm lint`: PASS — Biome checked 51 files.

Validation:
- Runtime root API: PASS.
- Deep internal/test utility exports: NOT EXPOSED.
- CLI composition: READY for later package-root dependency wiring; no CLI behavior added.

Notes:
- The next task in dependency order is AG-222.

### AG-222 DONE

Summary:
- Extended the architecture checker to reject Node builtin and `node:*` imports from core source files while preserving the existing contracts checks.
- Verified the new core boundary with a deliberate temporary `node:fs` violation fixture; the fixture was removed after the negative check.

Files:
- `scripts/check-architecture.ts`

Tests:
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 5 source files checked.
- Negative core fixture: PASS — checker returned exit code 1 and reported `packages/core/src/architecture-negative-fixture.ts: forbidden Node import node:fs`; fixture removed afterward.
- `pnpm test`: PASS — 7 files, 27 tests passed.
- `pnpm lint`: PASS — Biome checked 51 files.

Validation:
- Core Node/runtime boundary: PASS.
- Undocumented additional architecture rules: NOT ADDED.

Notes:
- The next task in dependency order is AG-223.

### AG-223 DONE

Summary:
- Added a cross-adapter runtime integration test using a real temporary Git repository.
- Exercised NodeFileSystem, NodeGitProvider, and NodeProcessRunner together through the runtime root API without invoking core behavior.

Files:
- `tests/integration/runtime/runtime-adapters.test.ts`

Tests:
- `pnpm test`: PASS — 8 files, 28 tests passed.
- Direct strict TypeScript compilation of the integration test and runtime barrel: PASS.
- `pnpm lint`: PASS — Biome checked 52 files.

Validation:
- Filesystem/Git/process composition: PASS.
- Cross-platform process invocation: PASS — uses `process.execPath`, argument arrays, and no shell syntax.
- Core behavior in integration suite: NOT TESTED — intentionally outside this task.

Notes:
- The next task in dependency order is AG-224.

### AG-224 DONE

Summary:
- Completed the P2 runtime phase gate without beginning P3 implementation.
- Verified runtime filesystem, Git, process, clock, environment, public API, architecture, and integration surfaces together.

Files:
- P2 runtime implementation, tests, integration test, and architecture-check files; no P3 implementation added.

Tests:
- `pnpm install --frozen-lockfile --ignore-scripts`: PASS — all 9 workspace projects resolved; lockfile was up to date.
- `pnpm lint`: PASS — Biome checked 52 files.
- `pnpm typecheck`: PASS as orchestration — Turbo evaluated 8 packages but executed 0 package-level typecheck tasks.
- Direct strict TypeScript compilation of all `packages`, `apps`, `scripts`, and `tests` TypeScript files: PASS.
- `pnpm test`: PASS — 8 files, 28 tests passed.
- `pnpm build`: PASS as orchestration — Turbo evaluated 8 packages but executed 0 package-level build tasks.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 5 source files checked.
- Runtime security scan: PASS — no `shell: true` or `process.env` usage in runtime source.

Validation:
- P2 runtime phase quality gate: PASS.
- Shell-free execution, bounded output, timeout cleanup, typed process errors: PASS.
- Core/runtime Node boundary: PASS, including deliberate negative fixture verification in AG-222.
- P3 core behavior: NOT STARTED — intentionally deferred until this gate.

Notes:
- P2 is complete. The next phase is P3 — Core Engine.
- The next task in dependency order is AG-300.

### AG-300 DONE

Summary:
- Created the CheckRepositoryUseCase application shell with injected filesystem, Git, process, and clock ports.
- Kept the shell behavior-free; no project detection, diff collection, verification, or reporting was added.

Files:
- `packages/core/src/application/check-repository.ts`
- `packages/core/src/application/check-repository.test.ts`

Tests:
- `pnpm test`: PASS — 9 files, 29 tests passed; use-case construction uses test doubles only.
- Direct strict TypeScript compilation of the application shell, test, and ports: PASS.
- `pnpm lint`: PASS — Biome checked 54 files.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 7 source files checked.

Validation:
- Dependency injection shell: PASS.
- Core Node/runtime imports: NONE — imports are type-only core port imports.
- Pipeline behavior: NOT ADDED — deferred to later P3 tasks.

Notes:
- P3 is in progress. The next task in dependency order is AG-301.

### AG-301 DONE

Summary:
- Added the pure Node project-candidate detector using only `FileSystemPort.findUp` for `package.json`.
- Kept lockfile reads, manifest parsing, and framework inference out of this task.

Files:
- `packages/core/src/domain/project/project-candidate.ts`
- `packages/core/src/domain/project/project-candidate.test.ts`

Tests:
- `pnpm test`: PASS — 10 files, 31 tests passed; covers found and not-found paths.
- Direct strict TypeScript compilation of the detector, test, application shell, and filesystem port: PASS.
- `pnpm lint`: PASS — Biome checked 56 files.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 9 source files checked.

Validation:
- Node candidate detection: PASS.
- Lockfile reads: NOT USED.
- Node/runtime imports in core: NONE.

Notes:
- The next task in dependency order is AG-302.

### AG-302 DONE

Summary:
- Added the pure `node | unknown` ecosystem mapping from package.json presence.
- Kept framework and dependency inference out of the project domain.

Files:
- `packages/core/src/domain/project/ecosystem.ts`
- `packages/core/src/domain/project/ecosystem.test.ts`

Tests:
- `pnpm test`: PASS — 11 files, 33 tests passed; covers Node and unknown outcomes.
- Direct strict TypeScript compilation of the ecosystem and project-candidate domain files: PASS.
- `pnpm lint`: PASS — Biome checked 58 files.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 11 source files checked.

Validation:
- ProjectContext ecosystem mapping: PASS — values match the locked `node | unknown` contract.
- Framework inference: NOT ADDED.

Notes:
- The next task in dependency order is AG-303.

### AG-303 DONE

Summary:
- Added pure pnpm detection from an upward `pnpm-lock.yaml` signal or `packageManager` metadata beginning with `pnpm@`.
- Detection reads repository metadata only and never invokes pnpm.

Files:
- `packages/core/src/domain/project/package-manager-pnpm.ts`
- `packages/core/src/domain/project/package-manager-pnpm.test.ts`

Tests:
- `pnpm test`: PASS — 12 files, 36 tests passed; covers lockfile, metadata, and negative cases.
- Direct strict TypeScript compilation of the pnpm detector, tests, and filesystem port: PASS.
- `pnpm lint`: PASS — Biome checked 60 files.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 13 source files checked.

Validation:
- pnpm lockfile detection: PASS.
- pnpm package metadata detection: PASS.
- pnpm execution: NOT USED.

Notes:
- The next task in dependency order is AG-304.

### AG-304 DONE

Summary:
- Added pure npm detection from `package-lock.json`, `npm-shrinkwrap.json`, or `packageManager` metadata beginning with `npm@`.
- Detection reads metadata only and never executes npm.

Files:
- `packages/core/src/domain/project/package-manager-npm.ts`
- `packages/core/src/domain/project/package-manager-npm.test.ts`

Tests:
- `pnpm test`: PASS — 13 files, 39 tests passed; covers npm lockfile, metadata, and negative cases.
- Direct strict TypeScript compilation of the npm detector, tests, and filesystem port: PASS.
- `pnpm lint`: PASS — Biome checked 62 files.

Validation:
- npm lockfile detection: PASS.
- npm package metadata detection: PASS.
- npm execution: NOT USED.

Notes:
- The next task in dependency order is AG-305.

### AG-305 DONE

Summary:
- Added pure Yarn detection from `yarn.lock` or `packageManager` metadata beginning with `yarn@`.
- Detection reads metadata only and performs no Yarn version management or execution.

Files:
- `packages/core/src/domain/project/package-manager-yarn.ts`
- `packages/core/src/domain/project/package-manager-yarn.test.ts`

Tests:
- `pnpm test`: PASS — 14 files, 42 tests passed; covers Yarn lockfile, metadata, and negative cases.
- Direct strict TypeScript compilation of the Yarn detector, tests, and filesystem port: PASS.
- `pnpm lint`: PASS — Biome checked 64 files.

Validation:
- Yarn lockfile detection: PASS.
- Yarn package metadata detection: PASS.
- Yarn execution/version management: NOT ADDED.

Notes:
- The next task in dependency order is AG-306.

### AG-306 DONE

Summary:
- Added pure Bun detection from `bun.lock`, `bun.lockb`, or `packageManager` metadata beginning with `bun@`.
- Lockfile detection remains existence-only, so binary `bun.lockb` content is never parsed or executed.

Files:
- `packages/core/src/domain/project/package-manager-bun.ts`
- `packages/core/src/domain/project/package-manager-bun.test.ts`

Tests:
- `pnpm test`: PASS — 15 files, 45 tests passed; covers Bun lockfile, metadata, and negative cases.
- Direct strict TypeScript compilation of the Bun detector, tests, and filesystem port: PASS.
- `pnpm lint`: PASS — Biome checked 66 files.

Validation:
- Bun lockfile detection: PASS.
- Bun package metadata detection: PASS.
- Bun execution: NOT USED.

Notes:
- The next task in dependency order is AG-307.

### AG-307 DONE

Summary:
- Added deterministic package-manager resolution over pnpm, npm, Yarn, and Bun signals.
- Single signals resolve; no signals return `unknown`; multiple signals return an ordered `ambiguous` result with no selected manager.

Files:
- `packages/core/src/domain/project/package-manager-resolution.ts`
- `packages/core/src/domain/project/package-manager-resolution.test.ts`

Tests:
- `pnpm test`: PASS — 16 files, 48 tests passed; covers resolved, unknown, and ambiguous cases.
- Direct strict TypeScript compilation of the resolver and tests: PASS.
- `pnpm lint`: PASS — Biome checked 68 files.

Validation:
- Deterministic precedence/order: PASS — candidates use the documented fixed order `pnpm`, `npm`, `yarn`, `bun`.
- Ambiguous lockfiles: PASS — explicitly reported, never silently selected.
- Package-manager execution: NOT USED.

Notes:
- The next task in dependency order is AG-308.

### AG-308 DONE

Summary:
- Added TypeScript project detection from `tsconfig.json` or a `typescript` dependency in package metadata.
- Kept detection read-only; no `tsc` invocation or compiler behavior was added.

Files:
- `packages/core/src/domain/project/typescript-project.ts`
- `packages/core/src/domain/project/typescript-project.test.ts`

Tests:
- `pnpm test`: PASS — 17 files, 51 tests passed; covers tsconfig, dependency, and JavaScript negative cases.
- Direct strict TypeScript compilation of the detector, tests, and filesystem port: PASS.
- `pnpm lint`: PASS — Biome checked 70 files.

Validation:
- TypeScript signal detection: PASS.
- `tsc` execution: NOT USED.

Notes:
- The next task in dependency order is AG-309.

### AG-309 DONE

Summary:
- Added read-only package script parsing for the semantic `test`, `lint`, `typecheck`, and `build` entries.
- Unknown scripts, non-string values, malformed JSON, and missing manifests are excluded safely; no script is executed.

Files:
- `packages/core/src/domain/project/package-scripts.ts`
- `packages/core/src/domain/project/package-scripts.test.ts`

Tests:
- `pnpm test`: PASS — 18 files, 54 tests passed; covers known scripts, missing package, and malformed/non-string data.
- Direct strict TypeScript compilation of the script parser, tests, and filesystem port: PASS.
- `pnpm lint`: PASS — Biome checked 72 files.

Validation:
- Known script semantics: PASS.
- Script execution: NOT USED.

Notes:
- The next task in dependency order is AG-310.

### AG-310 DONE

Summary:
- Added deterministic test-verification intent detection from the known non-empty `scripts.test` field.
- Explicitly treats missing and whitespace-only test scripts as unavailable; arbitrary script names are not selected.

Files:
- `packages/core/src/domain/project/test-intent.ts`
- `packages/core/src/domain/project/test-intent.test.ts`

Tests:
- `pnpm test`: PASS — 19 files, 57 tests passed; includes the missing/empty negative paths.
- Direct strict TypeScript compilation of the test-intent detector and package-script parser: PASS.
- `pnpm lint`: PASS — Biome checked 74 files.

Validation:
- Test intent present/absent: PASS.
- Arbitrary script selection: NOT ADDED.
- Regression correction: PASS — fixed null optional-chaining misclassification and retained a negative test.

Notes:
- The next task in dependency order is AG-311.

### AG-311 DONE

Summary:
- Added deterministic lint-verification intent detection from the known non-empty `scripts.lint` field.
- Missing and whitespace-only lint scripts remain unavailable; no lint command is executed.

Files:
- `packages/core/src/domain/project/lint-intent.ts`
- `packages/core/src/domain/project/lint-intent.test.ts`

Tests:
- `pnpm test`: PASS — 20 files, 60 tests passed; covers lint script present, absent, and empty paths.
- Direct strict TypeScript compilation of the lint-intent detector and package-script parser: PASS.
- `pnpm lint`: PASS — Biome checked 76 files.

Validation:
- Lint intent present/absent: PASS.
- Lint execution: NOT USED.

Notes:
- The next task in dependency order is AG-312.

### AG-312 DONE

Summary:
- Added three-state typecheck intent detection: explicit script, safe TypeScript default, or none.
- Kept executable/argument resolution out of this detector and did not invoke `tsc`.

Files:
- `packages/core/src/domain/project/typecheck-intent.ts`
- `packages/core/src/domain/project/typecheck-intent.test.ts`

Tests:
- `pnpm test`: PASS — 21 files, 64 tests passed; covers explicit, safe-default, none, and whitespace-only cases.
- Direct strict TypeScript compilation of the typecheck-intent detector and package-script parser: PASS.
- `pnpm lint`: PASS — Biome checked 78 files.

Validation:
- Explicit typecheck intent: PASS.
- Safe TypeScript default: PASS.
- Unsafe command invention: NOT ADDED.
- `tsc` execution: NOT USED.

Notes:
- The next task in dependency order is AG-313.

### AG-313 DONE

Summary:
- Added build-verification intent detection with an explicit opt-in gate; build remains disabled by default even when a build script exists.
- No build command is executed or generated by this detector.

Files:
- `packages/core/src/domain/project/build-intent.ts`
- `packages/core/src/domain/project/build-intent.test.ts`

Tests:
- `pnpm test`: PASS — 22 files, 67 tests passed; covers default-disabled, explicit-enabled, and absent-script cases.
- Direct strict TypeScript compilation of the build-intent detector and package-script parser: PASS.
- `pnpm lint`: PASS — Biome checked 80 files.

Validation:
- Build intent default: PASS — disabled.
- Explicit build opt-in: PASS.
- Build execution: NOT USED.

Notes:
- The next task in dependency order is AG-314.

### AG-314 DONE

Summary:
- Added pure ProjectContext assembly from project facts, including ecosystem, resolved package manager, language signals, and an empty framework list.
- Refused to assemble a context when package-manager detection is unknown or ambiguous; verifier results are not part of the context.

Files:
- `packages/core/src/domain/project/project-context.ts`
- `packages/core/src/domain/project/project-context.test.ts`

Tests:
- `pnpm test`: PASS — 23 files, 70 tests passed; covers Node/TypeScript, Node/JavaScript, and unresolved manager cases.
- Direct strict TypeScript compilation of the context assembler and project detector dependencies: PASS.
- `pnpm lint`: PASS — Biome checked 82 files.

Validation:
- Project facts assembly: PASS.
- Framework inference: NOT ADDED — frameworks remain empty until a dedicated detector exists.
- Verifier results in ProjectContext: NOT INCLUDED.

Notes:
- The next task in dependency order is AG-315.

### AG-315 DONE

Summary:
- Added raw Git diff parsing for added, modified, deleted, and renamed file records.
- Preserved new-file paths for renames and kept categories unknown until the dedicated classification tasks.

Files:
- `packages/core/src/domain/change/change-parser.ts`
- `packages/core/src/domain/change/change-parser.test.ts`

Tests:
- `pnpm test`: PASS — 24 files, 72 tests passed; covers all four file statuses and empty diff.
- Direct strict TypeScript compilation of the change parser and tests: PASS.
- `pnpm lint`: PASS — Biome checked 84 files.

Validation:
- Added/modified/deleted/renamed parsing: PASS.
- Category classification: NOT ADDED — all records remain `unknown`.
- Addition/deletion statistics: DEFERRED to AG-316.

Notes:
- The next task in dependency order is AG-316.

### AG-316 DONE

Summary:
- Added hunk-level additions/deletions counting to raw diff parsing.
- Excluded file markers and hunk headers from statistics; multiple hunks are accumulated per file.
- Kept risk scoring and category classification out of the parser.

Files:
- `packages/core/src/domain/change/change-parser.ts`
- `packages/core/src/domain/change/change-parser.test.ts`

Tests:
- `pnpm test`: PASS — 24 files, 72 tests passed; fixture statistics are asserted for added, modified, deleted, and renamed files.
- Direct strict TypeScript compilation of the change parser and tests: PASS.
- `pnpm lint`: PASS — Biome checked 84 files.

Validation:
- Addition/deletion statistics: PASS.
- Risk scoring: NOT ADDED.
- File categories: DEFERRED to AG-317 and later classification tasks.

Notes:
- The next task in dependency order is AG-317.

### AG-317 DONE

Summary:
- Added conservative source classification for implementation-like JS/TS files under `src` paths.
- Excluded test locations/names, declaration files, root configuration, and documentation so later classifiers can handle them explicitly.

Files:
- `packages/core/src/domain/change/source-classifier.ts`
- `packages/core/src/domain/change/source-classifier.test.ts`

Tests:
- `pnpm test`: PASS — 25 files, 76 tests passed; covers package/app source paths, Windows separators, tests, declarations, config, and docs.
- Direct strict TypeScript compilation of the source classifier and tests: PASS.
- `pnpm lint`: PASS — Biome checked 86 files.

Validation:
- Source classification: PASS.
- Test classification: DEFERRED to AG-318.
- Rule findings/risk scoring: NOT ADDED.

Notes:
- The next task in dependency order is AG-318.

### AG-318 DONE

Summary:
- Added deterministic test-file classification for `tests`/`__tests__` directories and `.test`/`.spec` JS/TS naming patterns.
- Classification identifies file shape only and does not infer semantic test coverage.

Files:
- `packages/core/src/domain/change/test-classifier.ts`
- `packages/core/src/domain/change/test-classifier.test.ts`

Tests:
- `pnpm test`: PASS — 26 files, 80 tests passed; covers filename, directory, Windows-path, and negative cases.
- Direct strict TypeScript compilation of the test classifier and tests: PASS.
- `pnpm lint`: PASS — Biome checked 88 files.

Validation:
- Test file classification: PASS.
- Semantic coverage analysis: NOT ADDED.

Notes:
- The next task in dependency order is AG-319.

### AG-319 DONE

Summary:
- Added dependency-file classification for package manifests and supported npm/pnpm/Yarn/Bun lockfiles.
- Kept workspace configuration and dependency diff semantics outside this classifier.

Files:
- `packages/core/src/domain/change/dependency-classifier.ts`
- `packages/core/src/domain/change/dependency-classifier.test.ts`

Tests:
- `pnpm test`: PASS — 27 files, 83 tests passed; covers manifest, all supported lockfiles, Windows paths, and unrelated files.
- Direct strict TypeScript compilation of the dependency classifier and tests: PASS.
- `pnpm lint`: PASS — Biome checked 90 files.

Validation:
- Dependency file paths: PASS.
- Dependency content diffing: NOT ADDED.

Notes:
- The next task in dependency order is AG-320.

### AG-320 DONE

Summary:
- Added GitHub Actions workflow classification for `.github/workflows/**/*.yml` and `.yaml` paths.
- Kept workflow permission parsing and policy findings out of this classifier.

Files:
- `packages/core/src/domain/change/ci-classifier.ts`
- `packages/core/src/domain/change/ci-classifier.test.ts`

Tests:
- `pnpm test`: PASS — 28 files, 86 tests passed; covers workflow extensions, nested/Windows paths, and negative paths.
- Direct strict TypeScript compilation of the CI classifier and tests: PASS.
- `pnpm lint`: PASS — Biome checked 92 files.

Validation:
- CI workflow path classification: PASS.
- Workflow permission parsing: NOT ADDED.

Notes:
- The next task in dependency order is AG-321.

### AG-321 DONE

Summary:
- Added the complete v0.1 file-category classifier for source, test, config, dependency, documentation, CI, and unknown paths.
- Kept category precedence deterministic and avoided adding framework-specific or rule-specific categories.

Files:
- `packages/core/src/domain/change/file-category-classifier.ts`
- `packages/core/src/domain/change/file-category-classifier.test.ts`

Tests:
- `pnpm test`: PASS — 29 files, 90 tests passed; covers all final categories and dependency precedence.
- Direct strict TypeScript compilation of the final classifier and component classifiers: PASS.
- `pnpm lint`: PASS — Biome checked 94 files.

Validation:
- Exhaustive v0.1 category return: PASS.
- Additional category expansion: NOT ADDED.

Notes:
- The next task in dependency order is AG-322.

### AG-322 DONE

Summary:
- Added normalized ChangeSet assembly from raw diff refs, parsed file records, and final path categories.
- Added a real Git fixture integration test through NodeGitProvider to validate the assembly against actual working-tree diff text.
- Kept rule evaluation out of ChangeSet construction.

Files:
- `packages/core/src/domain/change/change-set.ts`
- `packages/core/src/domain/change/change-set.test.ts`
- `tests/integration/change/change-set.test.ts`

Tests:
- `pnpm test`: PASS — 31 files, 93 tests passed; includes pure ChangeSet normalization and real fixture diff integration.
- Direct strict TypeScript compilation with `--types node`: PASS.
- `pnpm lint`: PASS — Biome checked 97 files.

Validation:
- Normalized refs/status/statistics/categories: PASS.
- Real Git fixture diff: PASS.
- Rule evaluation/risk scoring: NOT ADDED.

Notes:
- The next task in dependency order is AG-323.

### AG-323 DONE

Summary:
- Defined the small generic `Verifier<TContext, TResult>` port with `id`, `supports`, and async `run` capabilities.
- Kept process execution and Node APIs out of the core port.

Files:
- `packages/core/src/ports/verifier.ts`
- `packages/core/src/ports/verifier.test.ts`

Tests:
- `pnpm test`: PASS — 32 files, 94 tests passed; pure test double composes through the port.
- Direct strict TypeScript compilation of the Verifier port and test: PASS.
- `pnpm lint`: PASS — Biome checked 99 files.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 51 source files checked.

Validation:
- Small composable Verifier interface: PASS.
- Process calls in core port/implementation: NOT ADDED.

Notes:
- The next task in dependency order is AG-324.

### AG-324 DONE

Summary:
- Added deterministic verification planning for test, lint, typecheck, and build intents.
- Defaults enable available test/lint/typecheck signals, keep build disabled, and preserve explicit vs safe-default source metadata.
- Planner returns intent metadata only and never executes or constructs shell commands.

Files:
- `packages/core/src/domain/verification/verification-planner.ts`
- `packages/core/src/domain/verification/verification-planner.test.ts`

Tests:
- `pnpm test`: PASS — 33 files, 98 tests passed; covers defaults, safe TypeScript typecheck, toggles, and empty plans.
- Direct strict TypeScript compilation of the planner and project intent detectors: PASS.
- `pnpm lint`: PASS — Biome checked 101 files.

Validation:
- Deterministic planner order: PASS.
- Build default: PASS — disabled unless explicitly enabled.
- Command execution/shell construction: NOT ADDED.

Notes:
- The next task in dependency order is AG-325.

### AG-325 DONE

Summary:
- Added safe package-manager command resolution for npm, pnpm, Yarn, and Bun.
- Package scripts map to separate `<manager> run <intent>` arguments; TypeScript safe defaults use manager-specific exec forms.
- Unsupported safe-default combinations return null; no shell string is accepted or constructed.

Files:
- `packages/core/src/domain/verification/command-resolver.ts`
- `packages/core/src/domain/verification/command-resolver.test.ts`

Tests:
- `pnpm test`: PASS — 34 files, 101 tests passed; covers all four package managers and invalid intent/source combinations.
- Direct strict TypeScript compilation of the resolver, planner, and package-manager types: PASS.
- `pnpm lint`: PASS — Biome checked 103 files.

Validation:
- Executable/argument separation: PASS.
- Shell construction: NOT USED.
- Command execution: DEFERRED to AG-326.

Notes:
- The next task in dependency order is AG-326.

### AG-326 DONE

Summary:
- Added the core verification execution coordinator using injected ProcessRunner and resolved commands.
- Mapped exit 0/nonzero/runner rejection/unresolvable command to passed/failed/error/skipped states while preserving output, duration, and command metadata.
- Kept rendering and Node process calls out of core; execution is delegated through the port.

Files:
- `packages/core/src/domain/verification/verification-coordinator.ts`
- `packages/core/src/domain/verification/verification-coordinator.test.ts`

Tests:
- `pnpm test`: PASS — 35 files, 105 tests passed; covers all four execution states and ProcessRunner option forwarding.
- Direct strict TypeScript compilation of the coordinator, resolver, planner, and ProcessRunner port: PASS.
- `pnpm lint`: PASS — Biome checked 105 files.

Validation:
- Passed/failed/error/skipped states: PASS.
- Core direct process calls: NOT USED — only injected ProcessRunner is called.
- Output rendering: NOT ADDED.

Notes:
- The next task in dependency order is AG-327.

### AG-327 DONE

Summary:
- Implemented the fixed AgentGuard v0.1 severity weight table for `info`, `low`, `medium`, `high`, and `critical`.
- Kept the weight table immutable and configuration-independent, with no confidence or category scaling.
- Exported the risk-domain mapping API from the core package root.

Files:
- `packages/core/src/domain/risk/severity-weight.ts`
- `packages/core/src/domain/risk/severity-weight.test.ts`
- `packages/core/src/index.ts`

Tests:
- Targeted Vitest: PASS — 1 file, 2 tests passed.
- Direct strict TypeScript compilation: PASS.
- Biome check: PASS — 3 files checked.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 59 source files checked.

Validation:
- Exact weights `info = 0`, `low = 5`, `medium = 15`, `high = 30`, `critical = 50`: PASS.
- No unapproved severity or mutable/configurable weight: PASS.

Notes:
- The next task in dependency order is AG-328.

### AG-328 DONE

Summary:
- Implemented the fixed verification penalty matrix for test, typecheck, build, and lint.
- Scored verification status `error` as specified while keeping AgentGuard internal errors outside the risk model.
- Kept the penalty matrix immutable and limited to the four recognized verification intents.

Files:
- `packages/core/src/domain/risk/verification-penalty.ts`
- `packages/core/src/domain/risk/verification-penalty.test.ts`
- `packages/core/src/index.ts`

Tests:
- Targeted Vitest: PASS — 2 files, 4 tests passed.
- Direct strict TypeScript compilation: PASS.
- Biome check: PASS — 5 files checked.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 61 source files checked.

Validation:
- Test/typecheck/build penalties `0/0/30/50`: PASS.
- Lint penalties `0/0/10/15`: PASS.
- Verification `error` versus AgentGuard internal error boundary: PASS.

Notes:
- The next task in dependency order is AG-329.

### AG-329 DONE

Summary:
- Implemented deterministic finding and verification score aggregation using the normative fixed weights and penalties.
- Kept finding confidence out of the calculation and capped only the final raw score at 100.
- Excluded AgentGuard internal errors by accepting only recognized verification result inputs.

Files:
- `packages/core/src/domain/risk/risk-score.ts`
- `packages/core/src/domain/risk/risk-score.test.ts`
- `packages/core/src/index.ts`

Tests:
- Targeted Vitest: PASS — 3 files, 9 tests passed.
- Direct strict TypeScript compilation: PASS.
- Biome check: PASS — 7 files checked.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 63 source files checked.

Validation:
- FindingScore and VerificationScore are summed independently: PASS.
- `RiskScore = min(100, RawRiskScore)`: PASS.
- Confidence and category scaling are not applied: PASS.

Notes:
- The next task in dependency order is AG-330.

### AG-330 DONE

Summary:
- Implemented default and caller-supplied risk threshold validation and deterministic verdict mapping.
- Enforced `0 <= review < fail <= 100` before calculating a verdict.
- Preserved exact PASS/REVIEW/FAIL boundary semantics without recalculating or altering the risk score.

Files:
- `packages/core/src/domain/risk/verdict-thresholds.ts`
- `packages/core/src/domain/risk/verdict-thresholds.test.ts`
- `packages/core/src/index.ts`

Tests:
- Targeted Vitest: PASS — 4 files, 13 tests passed.
- Direct strict TypeScript compilation: PASS.
- Biome check: PASS — 9 files checked.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 65 source files checked.

Validation:
- Default thresholds `review = 15`, `fail = 50`: PASS.
- Custom thresholds are honored: PASS.
- Exact boundary mapping and invalid-threshold rejection: PASS.

Notes:
- The next task in dependency order is AG-331.

### AG-331 DONE

Summary:
- Added pure core application report assembly with all project, change, finding, verification, score, and verdict fields.
- Added schema version `1` and preserved the complete machine-readable report shape without terminal rendering.
- Kept report assembly separate from risk calculation and verdict calculation.

Files:
- `packages/core/src/application/report-assembler.ts`
- `packages/core/src/application/report-assembler.test.ts`
- `packages/core/src/index.ts`

Tests:
- Targeted Vitest: PASS — 5 files, 15 tests passed across the completed risk/report domain checks.
- Direct strict TypeScript compilation: PASS.
- Biome check: PASS — 11 files checked.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 67 source files checked.

Validation:
- Complete schema-versioned report assembly: PASS.
- Empty findings/verifications remain explicit report fields: PASS.
- Terminal rendering or score recalculation in the assembler: NOT USED.

Notes:
- The next task in dependency order is AG-332.

## Blocked tasks

None.

## Resolved blockers

### AG-327 BLOCKER RESOLVED

Resolution:
- The user supplied the authoritative AgentGuard v0.1 Risk Model.
- The product charter now documents the fixed severity weights, verification penalties, aggregation formula, default thresholds, verdict boundaries, and the distinction between verification errors and AgentGuard internal errors.
- The architecture specification and P3 task acceptance criteria now contain the same normative Risk Model.
- The charter example was corrected from the unexplained score to `Risk Score: 45/100`, derived from HIGH (30) plus MEDIUM (15) with no verifier penalties.

Validation:
- Specification assertions: PASS — 12 required values/relationships checked; old `63/100` charter example absent.

Next action:
- AG-327 through AG-332 are complete; continue with AG-333.

### AG-332 DONE

Summary:
- Added a real Git-backed core integration test that evaluates identical repository/config inputs twice.
- Compared complete report semantics and explicitly asserted stable findings, risk score, and verdict.
- The test uses fixed verification duration/output data and has no timestamp normalization or ignored nondeterministic fields.

Files:
- `tests/integration/core/risk-determinism.test.ts`

Tests:
- Targeted Vitest: PASS — 1 integration test passed.
- Direct strict TypeScript compilation: PASS.
- Biome check: PASS — 1 file checked.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 67 source files checked.

Validation:
- Repeated complete report semantics: PASS.
- Stable findings, `45` risk score, and `review` verdict: PASS.
- Real temporary Git ChangeSet input: PASS.

Notes:
- The next task in dependency order is AG-333, the P3 Phase Gate.

### AG-333 DONE

Summary:
- Completed the P3 Core Engine Phase Gate after all AG-300 through AG-332 tasks.
- Verified the zero/placeholder-rule core pipeline through risk calculation, verdict mapping, and schema-versioned report assembly.
- Confirmed architecture, security, specification, dependency, and scope boundaries.

Tests and quality gate:
- `pnpm lint`: PASS — Biome checked 117 files.
- `pnpm typecheck`: PASS — Turbo exited 0; no package typecheck tasks are currently registered.
- `pnpm test`: PASS — 42 test files, 122 tests.
- `pnpm build`: PASS — Turbo exited 0; no package build tasks are currently registered.
- Direct strict TypeScript compilation of all project/application/test/script `.ts` files: PASS.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 67 source files checked.
- Core security boundary scan: PASS — no forbidden Node/runtime/shell/eval patterns in core.
- Risk specification audit: PASS — normative model and corrected `45/100` example present.
- Dependency audit: PASS — no unapproved runtime or external dependency added.

Validation:
- P3 core pipeline with zero/placeholder rules: PASS.
- No P4 built-in rule implementation was introduced.
- Node 25 engine warning remains an environment note; project requirement remains Node 24 (`>=24 <25`).

Notes:
- P3 is complete. The next phase is P4 — Rules, beginning with AG-400.

### AG-400 DONE

Summary:
- Defined the generic core `Rule<TContext, TResult>` port with stable ID, context support check, and asynchronous readonly result collection.
- Kept the result generic so callers can provide the contracts Finding type without introducing a premature package dependency.

Files:
- `packages/core/src/ports/rule.ts`
- `packages/core/src/ports/rule.test.ts`

Tests:
- Targeted Vitest: PASS — 1 file, 2 tests passed.
- Direct strict TypeScript compilation: PASS.
- Biome check: PASS — 2 files checked.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 69 source files checked.

Validation:
- Supported/unsupported contexts and Finding-like result arrays: PASS.
- Registry or built-in rule implementation: NOT ADDED — deferred to AG-402 and later.

Notes:
- The next task in dependency order is AG-401.

### AG-401 DONE

Summary:
- Defined rule metadata with stable ID, non-localized name/description, category, and default severity.
- Added deterministic validation for the four v0.1 rule categories, five severity values, category-matching IDs, and non-empty text fields.
- Exported the metadata model and validator from the rules package root without dynamic loading or localization behavior.

Files:
- `packages/rules/src/metadata.ts`
- `packages/rules/src/metadata.test.ts`
- `packages/rules/src/index.ts`

Tests:
- Targeted Vitest: PASS — 1 file, 3 tests passed.
- Direct strict TypeScript compilation: PASS.
- Biome check: PASS — 3 files checked.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 69 source files checked.

Validation:
- Valid metadata across all categories and severities: PASS.
- Invalid/empty/inconsistent metadata rejection: PASS.
- Localization and dynamic rule loading: NOT ADDED.

Notes:
- The next task in dependency order is AG-402.

### AG-402 DONE

Summary:
- Added an explicit static rule registry factory with metadata validation, rule/metadata ID consistency checks, duplicate detection, and deterministic ID ordering.
- Returned a sorted copy without mutating caller registration order.
- Kept registry population code-only; no dynamic module loading, filesystem scanning, or remote policy support.

Files:
- `packages/rules/src/registry.ts`
- `packages/rules/src/registry.test.ts`
- `packages/rules/src/index.ts`

Tests:
- Targeted Vitest: PASS — 2 files, 6 tests passed.
- Direct strict TypeScript compilation: PASS.
- Biome check: PASS — 5 files checked.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 69 source files checked.

Validation:
- Stable rule-ID ordering and input immutability: PASS.
- Empty registry, duplicate IDs, invalid metadata, and ID mismatch cases: PASS.
- Dynamic code loading: NOT USED.

Notes:
- The next task in dependency order is AG-403.

### AG-403 DONE

Summary:
- Added a deterministic sequential rule execution coordinator for supported rules.
- Aggregated successful rule findings while isolating both `supports` and `run` failures by rule ID.
- Continued execution after failures and kept configuration enable/disable behavior deferred to AG-404.

Files:
- `packages/core/src/application/rule-execution-coordinator.ts`
- `packages/core/src/application/rule-execution-coordinator.test.ts`
- `packages/core/src/index.ts`

Tests:
- Targeted Vitest: PASS — 2 files, 5 tests passed including Rule port coverage.
- Direct strict TypeScript compilation: PASS.
- Biome check: PASS — 5 files checked.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 71 source files checked.

Validation:
- Stable supported-rule execution order and finding aggregation: PASS.
- Unsupported rules are skipped: PASS.
- Rule support/run failures are isolated and later rules continue: PASS.

Notes:
- The next task in dependency order is AG-404.

### AG-404 DONE

Summary:
- Added deterministic rule enablement selection with default-enabled behavior and explicit `enabled: false` filtering.
- Applied overrides only to matching known rule IDs; unknown IDs are ignored.
- Kept severity override behavior separate and deferred to AG-405.

Files:
- `packages/core/src/application/rule-selection.ts`
- `packages/core/src/application/rule-selection.test.ts`
- `packages/core/src/index.ts`

Tests:
- Targeted Vitest: PASS — 3 files, 8 tests passed including Rule port/coordinator coverage.
- Direct strict TypeScript compilation: PASS.
- Biome check: PASS — 7 files checked.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 73 source files checked.

Validation:
- Default and explicit enablement: PASS.
- Disabled rule is filtered before execution: PASS.
- Unknown rule override is ignored: PASS.
- Severity override mutation or behavior: NOT ADDED — deferred to AG-405.

Notes:
- The next task in dependency order is AG-405.

### AG-405 DONE

Summary:
- Added pure severity override application by matching configured rule IDs.
- Returned copied findings only when an override applies, preserved unmatched finding references, and never mutated rule metadata or original findings.
- Kept the fixed v0.1 severity-weight table unchanged; overrides affect finding severity before scoring only.

Files:
- `packages/core/src/application/severity-override.ts`
- `packages/core/src/application/severity-override.test.ts`
- `packages/core/src/index.ts`

Tests:
- Targeted Vitest: PASS — 1 file, 3 tests passed.
- Direct strict TypeScript compilation: PASS.
- Biome check: PASS — 3 files checked.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.

Validation:
- Matching overrides affect findings deterministically: PASS.
- Original findings and metadata are not mutated: PASS.
- Unknown rule IDs and missing overrides are ignored: PASS.

Notes:
- The next task in dependency order is AG-406.

### AG-406 DONE

Summary:
- Defined immutable metadata for `security.secret-exposure` with stable ID, security category, and critical default severity.
- Deferred detection, redaction, and registry registration to their dedicated tasks.

Files:
- `packages/rules/src/security/metadata.ts`
- `packages/rules/src/security/metadata.test.ts`
- `packages/rules/src/index.ts`

Tests:
- Targeted Vitest: PASS — 2 files, 5 tests passed including shared metadata validation.
- Direct strict TypeScript compilation: PASS.
- Biome check: PASS — 4 files checked.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.

Validation:
- Stable ID `security.secret-exposure`: PASS.
- Critical default severity and immutable metadata: PASS.
- Secret detection or raw secret handling: NOT ADDED — deferred to AG-407/408.

Notes:
- The next task in dependency order is AG-407.

### AG-407 DONE

Summary:
- Implemented a deliberately small secret detector for private-key markers, common provider token prefixes, and long credential assignments.
- Returned only pattern IDs and source ranges; raw matched secret material is never included in detector results.
- Kept pattern definitions local, deterministic, and network-independent.

Files:
- `packages/rules/src/security/detector.ts`
- `packages/rules/src/security/detector.test.ts`
- `packages/rules/src/index.ts`

Tests:
- Targeted Vitest: PASS — 1 file, 3 tests passed.
- Direct strict TypeScript compilation: PASS.
- Biome check: PASS — 4 files checked.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.

Validation:
- Documented high-signal positive patterns: PASS.
- Short values/placeholders/ordinary names negative cases: PASS.
- Deterministic source ranges and no raw-value field: PASS.

Notes:
- The next task in dependency order is AG-408.

### AG-408 DONE

Summary:
- Converted detector ranges into structured redacted evidence with pattern type and 1-based source locations.
- Kept matched secret material out of messages and output fields.
- Preserved deterministic evidence ordering inherited from detector matches.

Files:
- `packages/rules/src/security/redaction.ts`
- `packages/rules/src/security/redaction.test.ts`
- `packages/rules/src/index.ts`

Tests:
- Targeted Vitest: PASS — 2 files, 5 tests passed across detector and redaction.
- Direct strict TypeScript compilation: PASS.
- Biome check: PASS — 6 files checked.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.

Validation:
- Pattern/location evidence is present: PASS.
- Raw matched values are redacted: PASS.
- Multi-line positions and no-match behavior: PASS.

Notes:
- The next task in dependency order is AG-409.

### AG-409 DONE

Summary:
- Composed the secret detector and redaction into the `security.secret-exposure` built-in rule.
- Added positive/negative fixture-backed end-to-end tests and registered the rule in the static built-in registry.
- Kept findings critical by default and ensured rule messages/evidence never include fixture secret material.

Files:
- `packages/rules/src/security/secret-exposure.ts`
- `packages/rules/src/security/secret-exposure.test.ts`
- `packages/rules/src/registry.ts`
- `packages/rules/src/index.ts`
- `tests/fixtures/rules/secret-exposure/positive.ts`
- `tests/fixtures/rules/secret-exposure/negative.ts`

Tests:
- Targeted Vitest: PASS — 5 files, 14 tests passed across metadata, registry, detector, redaction, and rule integration.
- Direct strict TypeScript compilation: PASS.
- Biome check: PASS — 13 files checked.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.

Validation:
- Positive fixture emits one redacted critical finding: PASS.
- Negative fixture emits no finding: PASS.
- Static registry contains `security.secret-exposure`: PASS.
- Dynamic loading/network lookup: NOT USED.

Notes:
- The next task in dependency order is AG-410.

### AG-410 DONE

Summary:
- Defined immutable metadata for `testing.source-without-tests` with stable ID, testing category, and high default severity.
- Deferred changed-file detection and evidence generation to AG-411/412.

Files:
- `packages/rules/src/testing/source-without-tests-metadata.ts`
- `packages/rules/src/testing/source-without-tests-metadata.test.ts`
- `packages/rules/src/index.ts`

Tests:
- Targeted Vitest: PASS — 2 files, 5 tests passed including shared metadata validation.
- Direct strict TypeScript compilation: PASS.
- Biome check: PASS — 4 files checked.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.

Validation:
- Stable ID `testing.source-without-tests`: PASS.
- Testing category and high default severity: PASS.
- Detection or semantic coverage claims: NOT ADDED.

Notes:
- The next task in dependency order is AG-411.

### AG-411 DONE

Summary:
- Added changed-file-only detection for source changes without any changed test file.
- Preserved source/test path order from the input ChangeSet and avoided semantic coverage claims.
- Kept detection independent of source contents and filesystem access.

Files:
- `packages/rules/src/testing/source-without-tests.ts`
- `packages/rules/src/testing/source-without-tests.test.ts`
- `packages/rules/src/index.ts`

Tests:
- Targeted Vitest: PASS — 2 files, 5 tests passed including metadata coverage.
- Direct strict TypeScript compilation: PASS.
- Biome check: PASS — 6 files checked.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.

Validation:
- Positive source-without-test detection: PASS.
- Changed test and no-source negative cases: PASS.
- Semantic test coverage inference: NOT USED.

Notes:
- The next task in dependency order is AG-412.

### AG-412 DONE

Summary:
- Added deterministic evidence generation for source-without-tests detection.
- Attached each changed source path to an explicit message stating that no related test file changed in the ChangeSet.
- Kept evidence limited to paths and explanatory text; no semantic coverage claim or source content is inferred.

Files:
- `packages/rules/src/testing/source-without-tests-evidence.ts`
- `packages/rules/src/testing/source-without-tests-evidence.test.ts`
- `packages/rules/src/index.ts`

Tests:
- Targeted Vitest: PASS — 1 file, 2 tests passed.
- Direct strict TypeScript compilation: PASS.
- Biome check: PASS — 4 files checked.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.

Validation:
- Evidence for each detected source path: PASS.
- Empty detection produces no evidence: PASS.
- Raw source contents and semantic test coverage inference: NOT USED.

Notes:
- The next task in dependency order is AG-413.

### AG-413 DONE

Summary:
- Composed changed-file detection and evidence into the `testing.source-without-tests` built-in rule.
- Added positive source and negative related-test fixtures for an end-to-end rule test.
- Registered the rule statically without dynamic loading, network lookup, or unrelated classifiers.

Files:
- `packages/rules/src/testing/source-without-tests-rule.ts`
- `packages/rules/src/testing/source-without-tests-rule.test.ts`
- `packages/rules/src/registry.ts`
- `packages/rules/src/index.ts`
- `tests/fixtures/rules/source-without-tests/positive.ts`
- `tests/fixtures/rules/source-without-tests/negative.test.ts`

Tests:
- Targeted Vitest: PASS — 4 files, 11 tests passed across source detection, evidence, registry, and rule integration.
- Direct strict TypeScript compilation: PASS.
- Biome check: PASS — 10 files checked.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.

Validation:
- Positive source fixture emits one high-severity finding with path evidence: PASS.
- Related changed test fixture suppresses the finding: PASS.
- Static registry contains `testing.source-without-tests`: PASS.
- Additional classifiers and semantic coverage inference: NOT USED.

Notes:
- The next task in dependency order is AG-414.

### AG-414 DONE

Summary:
- Defined immutable metadata for `testing.auth-without-tests` with stable testing category and high default severity.
- Kept path matching, related-test heuristics, and finding generation deferred to their dedicated tasks.

Files:
- `packages/rules/src/testing/auth-without-tests-metadata.ts`
- `packages/rules/src/testing/auth-without-tests-metadata.test.ts`
- `packages/rules/src/index.ts`

Tests:
- Targeted Vitest: PASS — 3 files, 7 tests passed including shared metadata validation.
- Direct strict TypeScript compilation: PASS.
- Biome check: PASS — 3 files checked.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.

Validation:
- Stable ID `testing.auth-without-tests`: PASS.
- Testing category and high default severity: PASS.
- Path matching and semantic authentication interpretation: NOT USED.

Notes:
- The next task in dependency order is AG-415.

### AG-415 DONE

Summary:
- Added a conservative, case-insensitive auth-related path matcher using explicit component boundaries.
- Supported only documented path tokens and normalized Windows separators.
- Avoided semantic AST inspection, file-content inspection, and substring matches such as `author` or `tokenizer`.

Files:
- `packages/rules/src/testing/auth-path-matcher.ts`
- `packages/rules/src/testing/auth-path-matcher.test.ts`
- `packages/rules/src/index.ts`

Tests:
- Targeted Vitest: PASS — 2 files, 5 tests passed.
- Direct strict TypeScript compilation: PASS.
- Biome check: PASS — 3 files checked.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.

Validation:
- Explicit auth path component matching: PASS.
- Windows separator and case-insensitive path behavior: PASS.
- Obvious substring false positives: PASS.
- AST/content/AI interpretation: NOT USED.

Notes:
- The next task in dependency order is AG-416.

### AG-416 DONE

Summary:
- Added a related-auth-test path heuristic based on explicit test markers and normalized filename identity.
- Supported colocated and mirrored test layouts with Windows separator normalization.
- Rejected missing test markers, mismatched filenames, and substring-only similarities.
- Documented that the heuristic is not true coverage analysis.

Files:
- `packages/rules/src/testing/auth-test-path-matcher.ts`
- `packages/rules/src/testing/auth-test-path-matcher.test.ts`
- `packages/rules/src/index.ts`

Tests:
- Targeted Vitest: PASS — 2 files, 6 tests passed across auth and related-test path matching.
- Direct strict TypeScript compilation: PASS.
- Biome check: PASS — 3 files checked.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.

Validation:
- Colocated/mirrored related test paths: PASS.
- Windows separator and case normalization: PASS.
- Obvious unrelated-path false positives: PASS.
- True coverage or semantic test interpretation: NOT USED.

Notes:
- The next task in dependency order is AG-417.

### AG-417 DONE

Summary:
- Composed the conservative auth path matcher and related-test path heuristic into `testing.auth-without-tests`.
- Generated one finding containing path-specific absence evidence for each auth source without a related changed test.
- Kept unrelated source changes, unrelated tests, file contents, ASTs, and AI interpretation out of the rule.

Files:
- `packages/rules/src/testing/auth-without-tests.ts`
- `packages/rules/src/testing/auth-without-tests.test.ts`
- `packages/rules/src/index.ts`

Tests:
- Targeted Vitest: PASS — 4 files, 12 tests passed across auth metadata, path matchers, and finding/evidence behavior.
- Direct strict TypeScript compilation: PASS.
- Biome check: PASS — 3 files checked.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.

Validation:
- Auth source without related changed test emits high-severity finding: PASS.
- Related test suppresses the corresponding finding: PASS.
- Mixed auth changes report only the untested auth source: PASS.
- AI interpretation and true coverage claims: NOT USED.

Notes:
- The next task in dependency order is AG-418.

### AG-418 DONE

Summary:
- Added positive source and negative related-test fixtures for the auth-without-tests rule.
- Added fixture-backed end-to-end coverage and registered `testing.auth-without-tests` in the static built-in registry.
- Preserved separate rule context/result types and stable registry composition without dynamic loading or extra auth analysis.

Files:
- `packages/rules/src/testing/auth-without-tests.test.ts`
- `packages/rules/src/registry.ts`
- `tests/fixtures/rules/auth-without-tests/positive.ts`
- `tests/fixtures/rules/auth-without-tests/negative.test.ts`

Tests:
- Targeted Vitest: PASS — 4 files, 13 tests passed across auth rule, registry, source rule, and metadata.
- Direct strict TypeScript compilation: PASS.
- Biome check: PASS — 5 files checked.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.

Validation:
- Positive/negative auth fixtures are exercised: PASS.
- Static registry contains `testing.auth-without-tests`: PASS.
- Dynamic loading, network lookup, and additional auth analysis: NOT USED.

Notes:
- The next task in dependency order is AG-419.

### AG-419 DONE

Summary:
- Defined immutable metadata for `dependency.runtime-dependency-added` with dependency category and medium default severity.
- Deferred manifest diff parsing, package reputation, registry access, and network behavior to later tasks.

Files:
- `packages/rules/src/dependency/metadata.ts`
- `packages/rules/src/dependency/metadata.test.ts`
- `packages/rules/src/index.ts`

Tests:
- Targeted Vitest: PASS — 2 files, 5 tests passed including shared metadata validation.
- Direct strict TypeScript compilation: PASS.
- Biome check: PASS — 3 files checked.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.

Validation:
- Stable ID `dependency.runtime-dependency-added`: PASS.
- Dependency category and medium default severity: PASS.
- Manifest diff, package reputation, network, and registry lookup: NOT USED.

Notes:
- The next task in dependency order is AG-420.

### AG-420 DONE

Summary:
- Added deterministic parsing of before/after `package.json` dependency-name sets.
- Reported runtime and development dependency additions/removals independently, with stable ordering.
- Treated version-only changes as unchanged names and ignored fields outside the task-defined dependency sets.
- Rejected invalid JSON and non-string dependency values without executing configuration data.

Files:
- `packages/rules/src/dependency/package-dependency-delta.ts`
- `packages/rules/src/dependency/package-dependency-delta.test.ts`
- `packages/rules/src/index.ts`

Tests:
- Targeted Vitest: PASS — 2 files, 6 tests passed.
- Direct strict TypeScript compilation: PASS.
- Biome check: PASS — 3 files checked.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.

Validation:
- Runtime/dev dependency add/remove cases: PASS.
- Version-only and non-runtime field handling: PASS.
- Invalid JSON/value rejection: PASS.
- Registry lookup, package reputation, and network access: NOT USED.

Notes:
- The next task in dependency order is AG-421.

### AG-421 DONE

Summary:
- Composed package dependency delta parsing into `dependency.runtime-dependency-added`.
- Emitted one medium finding per added runtime dependency, with dependency-name and manifest-path evidence.
- Ignored development additions/removals and runtime removals for this rule; no package reputation or network logic was added.

Files:
- `packages/rules/src/dependency/runtime-dependency-added.ts`
- `packages/rules/src/dependency/runtime-dependency-added.test.ts`
- `packages/rules/src/index.ts`

Tests:
- Targeted Vitest: PASS — 3 files, 9 tests passed across metadata, delta parsing, and runtime finding/evidence.
- Direct strict TypeScript compilation: PASS.
- Biome check: PASS — 3 files checked.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.

Validation:
- Added runtime dependency emits a finding: PASS.
- Dev-only changes and runtime removals emit no finding: PASS.
- Evidence names dependency without network lookup: PASS.
- Package reputation, vulnerability scanning, and network access: NOT USED.

Notes:
- The next task in dependency order is AG-422.

### AG-422 DONE

Summary:
- Added before/after `package.json` fixtures for runtime addition and dev-only/removal negative behavior.
- Exercised the fixtures through `dependency.runtime-dependency-added` and registered the rule statically.
- Preserved deterministic registry composition and did not add vulnerability scanning, package reputation, or network access.

Files:
- `packages/rules/src/dependency/runtime-dependency-added.test.ts`
- `packages/rules/src/registry.ts`
- `tests/fixtures/rules/runtime-dependency-added/before.json`
- `tests/fixtures/rules/runtime-dependency-added/after-positive.json`
- `tests/fixtures/rules/runtime-dependency-added/after-negative.json`

Tests:
- Targeted Vitest: PASS — 3 files, 11 tests passed across runtime rule, delta parser, and registry.
- Direct strict TypeScript compilation: PASS.
- Biome check: PASS — 7 files checked.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.

Validation:
- Positive/negative dependency fixtures are exercised: PASS.
- Static registry contains `dependency.runtime-dependency-added`: PASS.
- Vulnerability scanning and network access: NOT USED.

Notes:
- The next task in dependency order is AG-423.

### AG-423 DONE

Summary:
- Defined immutable metadata for `ci.workflow-permission-change` with CI category and high default severity.
- Deferred workflow parsing and permission-delta detection to the dedicated CI rule tasks.

Files:
- `packages/rules/src/ci/metadata.ts`
- `packages/rules/src/ci/metadata.test.ts`
- `packages/rules/src/index.ts`

Tests:
- Targeted Vitest: PASS — 2 files, 5 tests passed including shared metadata validation.
- Direct strict TypeScript compilation: PASS.
- Biome check: PASS — 3 files checked.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.

Validation:
- Stable ID `ci.workflow-permission-change`: PASS.
- CI category and high default severity: PASS.
- YAML parsing and permission-delta detection: NOT USED.

Notes:
- The next task in dependency order is AG-424.

### AG-424 DONE

Summary:
- Added a conservative, non-executing workflow permission expansion detector.
- Recognized only explicit top-level/job-level permission forms with `none`, `read`, `write`, `read-all`, and `write-all` values.
- Reported only permission levels that rise from an observable before-state baseline; unknown or unsupported YAML forms remain unclassified.

Files:
- `packages/rules/src/ci/permission-expansion.ts`
- `packages/rules/src/ci/permission-expansion.test.ts`
- `packages/rules/src/index.ts`

Tests:
- Targeted Vitest: PASS — 2 files, 7 tests passed.
- Direct strict TypeScript compilation: PASS.
- Biome check: PASS — 3 files checked.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.

Validation:
- Scoped and all-scope permission expansion: PASS.
- Job-level declarations and conservative baseline handling: PASS.
- Unrelated text, downgrade, unchanged, and unsupported-form behavior: PASS.
- Workflow execution and exploitability claims: NOT USED.

Notes:
- The next task in dependency order is AG-425.

### AG-425 DONE

Summary:
- Added deterministic evidence generation for workflow permission expansions.
- Evidence includes workflow path, permission name, and factual before/after levels.
- Kept evidence wording limited to observed permission changes and made no exploitability claim.

Files:
- `packages/rules/src/ci/permission-evidence.ts`
- `packages/rules/src/ci/permission-evidence.test.ts`
- `packages/rules/src/index.ts`

Tests:
- Targeted Vitest: PASS — 3 files, 9 tests passed across metadata, expansion detection, and evidence.
- Direct strict TypeScript compilation: PASS.
- Biome check: PASS — 5 files checked.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.

Validation:
- Workflow path and permission delta evidence: PASS.
- Empty expansion produces no evidence: PASS.
- Exploitability or vulnerability conclusions: NOT USED.

Notes:
- The next task in dependency order is AG-426.

### AG-426 DONE

Summary:
- Added positive and negative workflow fixtures for permission expansion.
- Composed workflow detection and evidence into `ci.workflow-permission-change` and registered it statically.
- Kept workflow execution, exploitability claims, and additional CI analysis out of the rule.

Files:
- `packages/rules/src/ci/workflow-permission-change.ts`
- `packages/rules/src/ci/workflow-permission-change.test.ts`
- `packages/rules/src/registry.ts`
- `packages/rules/src/index.ts`
- `tests/fixtures/rules/workflow-permission-change/before.yml`
- `tests/fixtures/rules/workflow-permission-change/after-positive.yml`
- `tests/fixtures/rules/workflow-permission-change/after-negative.yml`

Tests:
- Targeted Vitest: PASS — 4 files, 13 tests passed across CI rule, registry, expansion, and evidence.
- Direct strict TypeScript compilation: PASS.
- Biome check: PASS — 4 code files checked.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.

Validation:
- Positive/negative workflow fixtures are exercised: PASS.
- Static registry contains `ci.workflow-permission-change`: PASS.
- Workflow execution and additional CI rules: NOT USED.

Notes:
- The next task in dependency order is AG-427.

### AG-427 DONE

Summary:
- Added deterministic ordering assertions for all five registered built-in rules.
- Verified unique IDs, stable ID order, and independence from localized/display names.

Files:
- `packages/rules/src/registry-order.test.ts`

Tests:
- Targeted Vitest: PASS — 6 files, 20 tests passed across all five built-in rules and registry checks.
- Direct strict TypeScript compilation: PASS.
- Biome check: PASS — 2 files checked.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.

Validation:
- Five built-in rule IDs are unique and stable-ordered: PASS.
- Display-name-based ordering: NOT USED.

Notes:
- The next task in dependency order is AG-428.

### AG-428 DONE

Summary:
- Completed the P4 rules phase gate without starting CLI rendering or P5 implementation before verification.
- Verified all five built-in rules, their evidence paths, deterministic registry ordering, and the P4 integration surface.
- Removed one confirmed duplicate test artifact at `packages/core/srcapplication/severity-override.test.ts`; its SHA-256 matched the retained test at `packages/core/src/application/severity-override.test.ts`.

Files:
- `STATUS.md`
- `packages/core/srcapplication/severity-override.test.ts` (removed confirmed duplicate artifact)

Validation:
- `pnpm lint`: PASS — Biome checked 177 files.
- `pnpm test`: PASS — 70 files, 198 tests.
- `pnpm typecheck`: PASS — Turbo completed with 0 tasks; direct strict TypeScript group checks PASS for contracts, core, rules, runtime-node, config, report, CLI, GitHub Action, tests, scripts, and `vitest.config.ts`.
- `pnpm build`: PASS — Turbo completed with 0 tasks.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder validation path.
- Core/contracts `console.log` scan: PASS.
- Core/contracts Node import scan: PASS.

Notes:
- P4 is complete. The next task in dependency order is AG-500.

### AG-500 DONE

Summary:
- Added the JSON Schema 2020-12 document for v0.1 verification toggles, rule overrides, and risk thresholds.
- Defined JSON-only configuration filenames, fixed severity/verification keys, and the rule ID pattern in the config package.
- Added representative valid and invalid schema-boundary examples without adding executable configuration support.
- Left the cross-field `review < fail` invariant for the typed validator task, with the schema documenting that requirement.

Files:
- `agentguard.config.schema.json`
- `packages/config/src/schema.ts`
- `packages/config/src/schema.test.ts`
- `packages/config/src/index.ts`

Tests:
- Targeted Vitest: PASS — 1 file, 3 tests passed.
- Direct strict TypeScript compilation: PASS.
- Biome check: PASS — 4 files checked.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.

Validation:
- JSON Schema document parses and exposes the expected root shape: PASS.
- Valid/invalid representative examples: PASS.
- Executable config and extra scoring/config fields: NOT USED.

Notes:
- The next task in dependency order is AG-501.

### AG-501 DONE

Summary:
- Added deterministic built-in defaults: test/lint/typecheck enabled, build disabled, empty rule overrides, and review/fail thresholds 15/50.
- Deep-froze the default configuration object so later merges cannot mutate shared defaults.
- Kept defaults data-only and independent of filesystem access.

Files:
- `packages/config/src/defaults.ts`
- `packages/config/src/defaults.test.ts`
- `packages/config/src/index.ts`

Tests:
- Targeted Vitest: PASS — 2 files, 5 tests passed across defaults and schema.
- Direct strict TypeScript compilation: PASS.
- Biome check: PASS — 3 files checked.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.

Validation:
- Default verification toggles and thresholds: PASS.
- Nested immutability: PASS.
- Disk access and executable configuration: NOT USED.

Notes:
- The next task in dependency order is AG-502.

### AG-502 DONE

Summary:
- Added repository-scoped config discovery through the existing `findUp` capability.
- Restricted lookup to the fixed `agentguard.config.json` filename and avoided directory recursion or unrelated filesystem scans.
- Kept parsing and file reads separate for the next config task.

Files:
- `packages/config/src/loader.ts`
- `packages/config/src/loader.test.ts`
- `packages/config/src/index.ts`

Tests:
- Targeted Vitest: PASS — 3 files, 7 tests passed across schema, defaults, and loader discovery.
- Direct strict TypeScript compilation: PASS.
- Biome check: PASS — 3 files checked.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.

Validation:
- Present config path: PASS.
- Absent config path: PASS.
- Fixed JSON filename and one upward-search delegation: PASS.
- Recursive unrelated scanning and file-content parsing: NOT USED.

Notes:
- The next task in dependency order is AG-503.

### AG-503 DONE

Summary:
- Added JSON-only parsing with a typed `ConfigParseError` for malformed input.
- Kept the parser shape-agnostic so validation remains a separate, explicit step.
- Rejected JavaScript/TypeScript executable text through JSON parsing; no eval, dynamic import, or hooks were added.

Files:
- `packages/config/src/parser.ts`
- `packages/config/src/parser.test.ts`
- `packages/config/src/index.ts`

Tests:
- Targeted Vitest: PASS — 3 files, 8 tests passed across parser, loader, and schema.
- Direct strict TypeScript compilation: PASS.
- Biome check: PASS — 5 files checked.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.

Validation:
- Valid JSON value preservation: PASS.
- Typed malformed-JSON errors: PASS.
- Executable JS/TS rejection without evaluation: PASS.

Notes:
- The next task in dependency order is AG-504.

### AG-504 DONE

Summary:
- Added a side-effect-free config validator aligned with the JSON schema and v0.1 contracts.
- Rejected unknown fields, invalid verification/rule shapes, invalid rule IDs/severities, and malformed threshold pairs.
- Enforced finite `0 <= review < fail <= 100` thresholds without changing the input object.

Files:
- `packages/config/src/validator.ts`
- `packages/config/src/validator.test.ts`
- `packages/config/src/index.ts`

Tests:
- Targeted Vitest: PASS — 4 files, 11 tests passed across validator, parser, schema, and defaults.
- Direct strict TypeScript compilation: PASS.
- Biome check: PASS — 3 files checked.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.

Validation:
- Valid/partial/default configurations: PASS.
- Unknown fields and invalid nested shapes: PASS.
- Threshold invariant and finite-number checks: PASS.
- Disk access and executable config evaluation: NOT USED.

Notes:
- The next task in dependency order is AG-505.

### AG-505 DONE

Summary:
- Added deterministic config-layer merging with precedence `CLI > config > defaults`.
- Merged verification fields, rule override fields, and threshold fields independently while preserving unspecified lower-layer values.
- Validated the final merged threshold pair and returned new objects without mutating defaults or input layers.

Files:
- `packages/config/src/merge.ts`
- `packages/config/src/merge.test.ts`
- `packages/config/src/index.ts`

Tests:
- Targeted Vitest: PASS — 3 files, 8 tests passed across merge, validator, and defaults.
- Direct strict TypeScript compilation: PASS.
- Biome check: PASS — 3 files checked.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.

Validation:
- CLI > config > defaults field precedence: PASS.
- Rule/threshold merge behavior: PASS.
- Input/default immutability: PASS.
- Shell fragments and executable configuration: NOT USED.

Notes:
- The next task in dependency order is AG-506.

### AG-506 DONE

Summary:
- Added the CLI package bin entry targeting `dist/main.js` and a minimal main dispatch boundary.
- Implemented only `--help`/empty invocation for this task; unsupported commands fail clearly without shell construction.
- Exported the CLI entry API for composition and tests.

Files:
- `packages/cli/package.json`
- `packages/cli/src/main.ts`
- `packages/cli/src/main.test.ts`
- `packages/cli/src/index.ts`

Tests:
- Targeted Vitest: PASS — 1 file, 2 tests passed.
- Direct strict TypeScript compilation: PASS.
- Biome check: PASS — 4 files checked.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- Direct help smoke: PASS — `node --experimental-strip-types packages/cli/src/main.ts --help`.

Validation:
- Package bin declaration and help dispatch: PASS.
- Unsupported command behavior: PASS.
- Full command implementation and shell fragments: NOT USED.

Notes:
- The next task in dependency order is AG-507.

### AG-507 DONE

Summary:
- Added the CLI composition root at `packages/cli/src/composition/create-agentguard.ts`.
- Composed the core checker with default Node runtime adapters, the merged configuration, the stable built-in rule registry, and an injectable report assembly port.
- Kept runtime construction in the CLI composition boundary; core remains adapter-free.
- Exported the checker dependency type/use case from the core package root and the composition API from the CLI package root.
- Added workspace source aliases and a dedicated strict CLI TypeScript project so package-root imports are validated before package build artifacts exist.

Files:
- `packages/cli/src/composition/create-agentguard.ts`
- `packages/cli/src/composition/create-agentguard.test.ts`
- `packages/cli/src/index.ts`
- `packages/core/src/index.ts`
- `vitest.config.ts`
- `tsconfig.cli.json`

Tests:
- Targeted Vitest: PASS — 2 files, 4 tests passed.
- Full Vitest: PASS — 78 files, 218 tests passed.
- CLI strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- Biome: PASS — 195 files checked.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Validation:
- Default runtime adapter composition: PASS.
- Injected runtime/config/report composition: PASS.
- Built-in rule registry wiring and stable IDs: PASS.
- Schema-versioned default report assembly: PASS.
- Core/runtime boundary and shell-free adapter constraints: PRESERVED.

Notes:
- Report rendering remains deferred to AG-513 through AG-516.
- The next task in dependency order is AG-508.

### AG-508 DONE

Summary:
- Added the basic `check` command flow in `packages/cli/src/commands/check.ts`.
- The command resolves the repository root from the current working directory through the injected `GitProvider`, then collects repository status and the current working-tree diff.
- Non-repository input returns an explicit structured outcome without attempting status or diff collection.
- Kept project detection, rule execution, verification execution, risk scoring, and rendering out of this task because the current core use-case remains the behavior-free AG-300 shell and those integrations belong to their scheduled tasks.

Files:
- `packages/cli/src/commands/check.ts`
- `packages/cli/src/commands/check.test.ts`
- `packages/cli/src/index.ts`

Tests and quality gate:
- Targeted Vitest: PASS — 2 files, 4 tests passed.
- Full Vitest: PASS — 79 files, 220 tests passed.
- `pnpm lint`: PASS — Biome checked 197 files.
- CLI strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `pnpm build`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Validation:
- Current repository/root status and working-tree diff collection: PASS.
- Non-repository negative path: PASS.
- Shell fragments and GitHub-specific behavior: NOT USED.
- Internal errors remain uncaught at this command layer for the later CLI internal-error/exit-code path.

Notes:
- The next task in dependency order is AG-509.

### AG-509 DONE

Summary:
- Added the semantic `baseRef` option to the basic check command.
- When supplied, the command calls `GitProvider.getDiff(repositoryRoot, baseRef, "HEAD")`; the default path continues to collect the working-tree diff.
- Added an explicit diff-selection discriminator so the returned structured outcome identifies `working-tree` versus `base-to-head` collection.
- Kept refs as separate values and did not construct or execute shell strings.

Files:
- `packages/cli/src/commands/check.ts`
- `packages/cli/src/commands/check.test.ts`
- `packages/cli/src/index.ts`

Tests and quality gate:
- Targeted Vitest: PASS — 1 file, 3 tests passed.
- Full Vitest: PASS — 79 files, 221 tests passed.
- `pnpm lint`: PASS — Biome checked 197 files.
- CLI strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `pnpm build`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Validation:
- Default working-tree diff behavior: PASS.
- Explicit base ref forwarding to `getDiff`: PASS.
- Non-repository behavior remains explicit and side-effect bounded: PASS.
- Shell fragments and GitHub-specific behavior: NOT USED.

Notes:
- The default head is the semantic Git ref `HEAD`; explicit head selection is the next task, AG-510.

### AG-510 DONE

Summary:
- Added the semantic `headRef` option to the basic check command.
- Base and head refs are passed independently to `GitProvider.getDiff`; omitted endpoints default to `HEAD` when ref-based diff mode is selected.
- Kept the no-ref path on working-tree diff collection and preserved the structured diff-selection discriminator.
- Added tests for base-only, base-plus-head, and head-only selection without shell construction.

Files:
- `packages/cli/src/commands/check.ts`
- `packages/cli/src/commands/check.test.ts`

Tests and quality gate:
- Targeted Vitest: PASS — 1 file, 5 tests passed.
- Full Vitest: PASS — 79 files, 223 tests passed.
- `pnpm lint`: PASS — Biome checked 197 files.
- CLI strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `pnpm build`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Validation:
- Base/head combination forwarding: PASS.
- Default endpoint behavior: PASS — `HEAD` is used only for ref-mode defaults.
- Working-tree behavior without refs: PASS.
- Shell fragments and GitHub-specific behavior: NOT USED.

Notes:
- The next task in dependency order is AG-511.

### AG-511 DONE

Summary:
- Added explicit JSON configuration loading to the check command through `configPath`.
- The command reads the supplied path through the injected filesystem, parses JSON with the config package parser, validates the v0.1 schema, and rebuilds the composition with the validated layer.
- Added typed configuration errors for read failure, malformed/non-JSON content, and invalid schema shape.
- Kept configuration data non-executable; no JS/TS evaluation or automatic path discovery was added to this explicit-path task.

Files:
- `packages/cli/src/commands/check.ts`
- `packages/cli/src/commands/check.test.ts`
- `packages/cli/src/index.ts`

Tests and quality gate:
- Targeted Vitest: PASS — 1 file, 8 tests passed.
- Full Vitest: PASS — 79 files, 226 tests passed.
- `pnpm lint`: PASS — Biome checked 197 files.
- CLI strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `pnpm build`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Validation:
- Custom valid JSON config path and merged values: PASS.
- Malformed JSON and executable JS text rejection: PASS.
- Invalid schema and unreadable path rejection: PASS.
- Configuration execution, shell fragments, and GitHub-specific behavior: NOT USED.

Notes:
- The next task in dependency order is AG-512.

### AG-512 DONE

Summary:
- Added the check command format selection layer for `terminal`, `json`, and `markdown`.
- Defaulted omitted format input to `terminal` and included the selected format in the structured command outcome.
- Added a typed invalid-format error with an explicit supported-format message.
- Kept all rendering out of this task; renderer implementations remain in the report package tasks.

Files:
- `packages/cli/src/commands/check.ts`
- `packages/cli/src/commands/check.test.ts`
- `packages/cli/src/index.ts`

Tests and quality gate:
- Targeted Vitest: PASS — 1 file, 9 tests passed.
- Full Vitest: PASS — 79 files, 227 tests passed.
- `pnpm lint`: PASS — Biome checked 197 files.
- CLI strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `pnpm build`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Validation:
- Supported format values and default: PASS.
- Invalid format rejection before config/Git I/O: PASS.
- Renderer implementation and score calculation: NOT USED.

Notes:
- The next task in dependency order is AG-513.

### AG-513 DONE

Summary:
- Added the pure `renderTerminalReport` renderer under `packages/report/src/terminal`.
- Rendered the supplied version, verdict, risk score, finding summaries/evidence, and verification statuses/commands in a concise stable text format.
- Kept the renderer presentation-only: it reads `riskScore` and `verdict` and performs no risk calculation, confidence scaling, or process execution.
- Added PASS, REVIEW, and FAIL inline snapshots.
- Added the report package's intentional dependency on the contracts public API and exposed the renderer from the report barrel.

Files:
- `packages/report/src/terminal/render-terminal.ts`
- `packages/report/src/terminal/render-terminal.test.ts`
- `packages/report/src/index.ts`
- `packages/report/package.json`
- `pnpm-lock.yaml`
- `vitest.config.ts`
- `tsconfig.cli.json`

Tests and quality gate:
- Targeted Vitest: PASS — 1 file, 3 snapshot tests passed.
- Full Vitest: PASS — 80 files, 230 tests passed.
- `pnpm lint`: PASS — Biome checked 199 files.
- CLI/report strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `pnpm build`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Validation:
- PASS/REVIEW/FAIL terminal snapshots: PASS.
- Finding evidence and verification command/status display: PASS.
- Risk calculation or renderer-side normalization: NOT USED.
- Network, shell execution, and ANSI-dependent output: NOT USED.

Notes:
- The next task in dependency order is AG-514.

### AG-514 DONE

Summary:
- Added the pure `renderJsonReport` renderer under `packages/report/src/json`.
- Rebuilt the top-level report object in a fixed order and serialized it with stable two-space JSON formatting.
- Preserved the explicit `schemaVersion` field and all report sections without risk recalculation or filtering.
- Added a JSON snapshot and a parsed-output assertion for schema version, score, and verdict.

Files:
- `packages/report/src/json/render-json.ts`
- `packages/report/src/json/render-json.test.ts`
- `packages/report/src/index.ts`

Tests and quality gate:
- Targeted Vitest: PASS — 1 file, 1 snapshot test passed.
- Full Vitest: PASS — 81 files, 231 tests passed.
- `pnpm lint`: PASS — Biome checked 201 files.
- CLI/report strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `pnpm build`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Validation:
- Stable machine-readable serialization: PASS.
- Explicit schema version retention: PASS.
- Renderer-side risk calculation or confidence transformation: NOT USED.

Notes:
- The next task in dependency order is AG-515.

### AG-515 DONE

Summary:
- Added the pure `renderMarkdownReport` renderer under `packages/report/src/markdown`.
- Rendered GitHub-friendly headings, verdict/score summary, finding rule IDs/messages, evidence locations, and verification command/status details.
- Kept the renderer presentation-only with no GitHub API calls, network access, or risk calculation.
- Added snapshots for an empty passing report and a report containing findings/evidence/verifications.

Files:
- `packages/report/src/markdown/render-markdown.ts`
- `packages/report/src/markdown/render-markdown.test.ts`
- `packages/report/src/index.ts`

Tests and quality gate:
- Targeted Vitest: PASS — 1 file, 2 snapshot tests passed.
- Full Vitest: PASS — 82 files, 233 tests passed.
- `pnpm lint`: PASS — Biome checked 203 files.
- CLI/report strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `pnpm build`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Validation:
- Findings/evidence Markdown snapshots: PASS.
- GitHub API/network access: NOT USED.
- Risk calculation and verifier execution: NOT USED.

Notes:
- The next task in dependency order is AG-516.

### AG-516 DONE

Summary:
- Added `renderCheckReport(format, report)` to the CLI check command layer.
- Routed `terminal`, `json`, and `markdown` through one fixed selector map to the three public report-package renderers.
- Added selector tests that compare each CLI route directly with its report renderer output; no formatting logic is duplicated in CLI.
- Added the CLI's intentional type dependency on the contracts report shape and refreshed the workspace lockfile.

Files:
- `packages/cli/src/commands/check.ts`
- `packages/cli/src/commands/check.test.ts`
- `packages/cli/src/index.ts`
- `packages/cli/package.json`
- `pnpm-lock.yaml`

Tests and quality gate:
- Targeted Vitest: PASS — 1 file, 10 tests passed.
- Full Vitest: PASS — 82 files, 234 tests passed.
- `pnpm lint`: PASS — Biome checked 203 files.
- CLI/report strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `pnpm build`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Validation:
- All three format routes reach the report package exactly once: PASS.
- CLI-side rendering duplication: NOT USED.
- Full executable CLI dispatch and exit-code mapping: DEFERRED to AG-517 and later integration tasks.

Notes:
- The next task in dependency order is AG-517.

### AG-517 DONE

Summary:
- Added the explicit CLI exit-code table and mapper.
- Mapped AgentGuard verdicts exactly as `pass = 0`, `review = 1`, and `fail = 2`.
- Added a separate `internal-error` outcome mapped to `3`; it is not a verifier result and does not enter risk scoring.
- Kept verifier/process exit codes out of the CLI verdict mapping.

Files:
- `packages/cli/src/exit-codes.ts`
- `packages/cli/src/exit-codes.test.ts`
- `packages/cli/src/index.ts`

Tests and quality gate:
- Targeted Vitest: PASS — 1 file, 2 tests passed.
- Full Vitest: PASS — 83 files, 236 tests passed.
- `pnpm lint`: PASS — Biome checked 205 files.
- CLI/report strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `pnpm build`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Validation:
- PASS/REVIEW/FAIL mapping: PASS.
- Internal-error versus verifier-error distinction: PASS.
- Direct verifier exit-code reuse: NOT USED.

Notes:
- The next task in dependency order is AG-518.

### AG-518 DONE

Summary:
- Added the `ci` option to the check command format layer.
- CI defaults to stable `json` output when no format is specified; an explicit supported format remains authoritative.
- Documented the default in the exported constant and command-level comment.
- Kept CI mode independent of GitHub APIs and unchanged in core/risk semantics.

Files:
- `packages/cli/src/commands/check.ts`
- `packages/cli/src/commands/check.test.ts`
- `packages/cli/src/index.ts`

Tests and quality gate:
- Targeted Vitest: PASS — 1 file, 11 tests passed.
- Full Vitest: PASS — 83 files, 237 tests passed.
- `pnpm lint`: PASS — Biome checked 205 files.
- CLI/report strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `pnpm build`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Validation:
- CI default format: PASS — `json`.
- Explicit format precedence: PASS.
- GitHub-specific API behavior and core semantic changes: NOT USED.

Notes:
- The next task in dependency order is AG-519.

### AG-519 DONE

Summary:
- Added `runInitCommand` for the fixed `agentguard.config.json` filename.
- Created the minimal JSON document `{}` only when the target is absent.
- Returned a structured `already-exists` outcome and performed no write when a config already exists.
- Used exclusive file creation (`wx`) in the default CLI filesystem to preserve the no-overwrite guarantee across a check/write race.
- Validated the generated document with the existing config validator in tests and kept the command JSON-only.

Files:
- `packages/cli/src/commands/init.ts`
- `packages/cli/src/commands/init.test.ts`
- `packages/cli/src/index.ts`

Tests and quality gate:
- Targeted Vitest: PASS — 1 file, 2 tests passed.
- Full Vitest: PASS — 84 files, 239 tests passed.
- `pnpm lint`: PASS — Biome checked 207 files.
- CLI/report strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `pnpm build`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Validation:
- Missing-config creation: PASS.
- Schema-conforming minimal JSON: PASS.
- Existing-config protection/no overwrite: PASS.
- Executable configuration and shell execution: NOT USED.

Notes:
- The next task in dependency order is AG-520.

### AG-520 DONE

Summary:
- Added `runExplainCommand` backed only by the static built-in rule registry metadata.
- Known rule IDs return local category, severity, name, and description metadata.
- Unknown IDs return a structured `unknown` result without network lookup, LLM behavior, or rule execution.

Files:
- `packages/cli/src/commands/explain.ts`
- `packages/cli/src/commands/explain.test.ts`
- `packages/cli/src/index.ts`

Tests and quality gate:
- Targeted Vitest: PASS — 1 file, 2 tests passed.
- Full Vitest: PASS — 85 files, 241 tests passed.
- `pnpm lint`: PASS — Biome checked 209 files.
- CLI/report strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `pnpm build`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Validation:
- Known built-in rule explanation: PASS.
- Unknown rule behavior: PASS.
- Network/LLM/rule execution: NOT USED.

Notes:
- The next task in dependency order is AG-521.

### AG-521 DONE

Summary:
- Expanded CLI help with the supported `check`, `init`, and `explain` command surfaces and only the implemented check options.
- Added `--version` and `-v` output using the package version constant.
- Kept help concise and free of unsupported force/network/marketing options.

Files:
- `packages/cli/src/main.ts`
- `packages/cli/src/main.test.ts`

Tests and quality gate:
- Targeted Vitest: PASS — 1 file, 4 tests passed.
- Full Vitest: PASS — 85 files, 243 tests passed.
- `pnpm lint`: PASS — Biome checked 209 files.
- CLI/report strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `pnpm build`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Validation:
- Long/short help behavior: PASS.
- Long/short version behavior: PASS.
- Supported command/option list accuracy: PASS.

Notes:
- The next task in dependency order is AG-522.

### AG-522 DONE

Summary:
- Added a real CLI package-local fixture flow under `tests/e2e`.
- The test creates a real temporary Git repository, commits a baseline, applies the existing secret-exposure fixture, uses real runtime adapters and the built-in rule, calculates the normative core risk/verdict, renders through the CLI selector, and maps the verdict to the CLI exit code.
- Snapshot evidence is `FAIL` with `50/100`; the mapped CLI exit code is `2`.
- The test does not mock the full CLI stack and does not perform network or shell-string execution.

Files:
- `tests/e2e/cli-fixture.test.ts`
- `tsconfig.cli.json`

Tests and quality gate:
- Targeted Vitest: PASS — 1 e2e file, 1 test passed.
- Full Vitest: PASS — 86 files, 244 tests passed.
- `pnpm lint`: PASS — Biome checked 210 files.
- CLI/e2e strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `pnpm build`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Validation:
- Real fixture repository and Git diff: PASS.
- Real built-in rule, normative risk score/verdict, output, and exit code: PASS in package-local source equivalent.
- Full built `dist` CLI artifact: NOT CLAIMED — no workspace package build tasks currently exist; Turbo executed 0 build tasks.

Notes:
- The next task in dependency order is AG-523, the P5 CLI phase gate.

### AG-523 DONE

Summary:
- Completed the P5 CLI phase gate after AG-500 through AG-522.
- Verified configuration, composition, check refs, format selection, all three renderers, CLI renderer wiring, exit-code mapping, CI defaults, init, explain, help/version, and the real fixture flow together.
- Performed the required package-local one-command UX inspection without starting GitHub Action work.

Tests and quality gate:
- `pnpm install --frozen-lockfile --ignore-scripts`: PASS — all 9 workspace projects resolved; lockfile up to date.
- `pnpm lint`: PASS — Biome checked 210 files.
- `pnpm test`: PASS — 86 files, 244 tests passed.
- `pnpm exec tsc -p tsconfig.cli.json`: PASS — CLI, report, contracts, and e2e fixture source are strict-checked together.
- `pnpm typecheck`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `pnpm build`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.
- Core/report/CLI shell and network scan: PASS — no `console.log`, `shell: true`, `eval`, `new Function`, or direct process execution introduced in P5 command/report source.

Manual/package-local UX:
- `node --experimental-strip-types packages/cli/src/main.ts --help`: PASS — lists only the P5 command/options surface.
- `node --experimental-strip-types packages/cli/src/main.ts --version`: PASS — `0.1.0`.
- Unsupported option smoke: PASS — exit code `1` with a concise help hint.
- Real Git fixture package-local check flow: PASS — terminal output `FAIL`, risk `50/100`, mapped CLI exit code `2`.

Evidence boundary:
- The workspace has no package-level build scripts; Turbo executed 0 build tasks and `packages/cli/dist` was not generated. The e2e result is therefore recorded as a package-local source equivalent, not as a built `dist` artifact claim.
- The current `main.ts` direct entry is verified for help/version/error UX; the complete check command dispatch remains represented by the tested package-local command APIs and fixture flow.

Notes:
- P5 is complete. The next phase is P6 — GitHub Action, beginning with AG-600.

### AG-600 DONE

Summary:
- Defined the GitHub Action inputs for base ref, head ref, JSON config path, report format, and configurable fail behavior.
- Kept all inputs optional and documented the action defaults as JSON output and failure on the `fail` verdict.
- Did not add a permissions declaration or request any write permission.

Files:
- `apps/github-action/action.yml`

Validation:
- Action metadata structural validation: PASS — five optional inputs, `json`/`fail` defaults, and no write permissions.
- `pnpm lint`: PASS — Biome checked 210 files.
- `pnpm test`: PASS — 86 files, 244 tests passed.
- GitHub Action strict TypeScript project: PASS — `pnpm exec tsc -p apps/github-action/tsconfig.json`.
- `pnpm typecheck`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `pnpm build`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Evidence boundary:
- Metadata was validated locally for required fields, supported input names, defaults, and absence of write permissions; no live GitHub Action execution was claimed.

Notes:
- P6 continues with AG-601, reading supported pull-request and push event context.

### AG-601 DONE

Summary:
- Added a typed GitHub event-context reader for the supported `pull_request` and `push` event payloads.
- Extracted pull-request base/head refs and SHAs; mapped push `before`/`after` commits to base/head SHAs while retaining the push ref.
- Added fail-closed errors for missing environment inputs, unreadable payloads, malformed JSON, incomplete payloads, and unsupported event names.
- Kept the adapter read-only: it reads the event JSON file and performs no API calls, shell execution, or mutation.

Files:
- `apps/github-action/src/event-context.ts`
- `apps/github-action/src/event-context.test.ts`
- `apps/github-action/src/main.ts`

Tests and quality gate:
- Targeted event-context tests: PASS — 1 file, 7 tests passed.
- `pnpm test`: PASS — 87 files, 251 tests passed.
- `pnpm lint`: PASS — Biome checked 212 files.
- GitHub Action strict TypeScript project: PASS — `pnpm exec tsc --noEmit -p apps/github-action/tsconfig.json`.
- CLI/report strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `pnpm build`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Validation:
- Pull-request fixture context: PASS.
- Push fixture context: PASS.
- Unsupported and malformed event paths: PASS.

Evidence boundary:
- The event reader is source-tested with deterministic injected payloads; no live GitHub event runner or API was used.
- A temporary ignored `apps/github-action/dist` output created by an initial emitting tsc check was removed; the recorded typecheck uses `--noEmit`.

Notes:
- P6 continues with AG-602, resolving the explicit pull-request base SHA.

### AG-602 DONE

Summary:
- Added the action-side base SHA resolver over the validated GitHub event context.
- Pull requests resolve `pull_request.base.sha`; pushes resolve the event reader's `before` commit as the base SHA.
- The resolver returns the selected value as data without shell interpolation, rewriting, or repository mutation.

Files:
- `apps/github-action/src/revisions.ts`
- `apps/github-action/src/revisions.test.ts`
- `apps/github-action/src/main.ts`

Tests and quality gate:
- Targeted revision tests: PASS — 2 source files, 3 tests passed.
- `pnpm test`: PASS — 88 files, 254 tests passed.
- `pnpm lint`: PASS — Biome checked 214 files.
- GitHub Action strict TypeScript project: PASS — `pnpm exec tsc --noEmit -p apps/github-action/tsconfig.json`.
- CLI/report strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `pnpm build`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Validation:
- Pull-request base SHA: PASS.
- Push base SHA from `before`: PASS.
- Untrusted-looking input remains inert data: PASS — no command path exists in the resolver.

Notes:
- P6 continues with AG-603, resolving the explicit pull-request head SHA.

### AG-603 DONE

Summary:
- Added the action-side head SHA resolver over the validated GitHub event context.
- Pull requests resolve `pull_request.head.sha`; pushes resolve the event reader's `after` commit as the head SHA.
- The resolver is a read-only projection and does not mutate the repository or any event context.

Files:
- `apps/github-action/src/revisions.ts`
- `apps/github-action/src/revisions.test.ts`
- `apps/github-action/src/main.ts`

Tests and quality gate:
- Targeted revision tests: PASS — 1 file, 5 tests passed.
- `pnpm test`: PASS — 88 files, 256 tests passed.
- `pnpm lint`: PASS — Biome checked 214 files.
- GitHub Action strict TypeScript project: PASS — `pnpm exec tsc --noEmit -p apps/github-action/tsconfig.json`.
- CLI/report strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `pnpm build`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Validation:
- Pull-request head SHA: PASS.
- Push head SHA from `after`: PASS.
- Context immutability: PASS.

Notes:
- P6 continues with AG-604, composing the existing AgentGuard core/CLI concepts inside the Action.

### AG-604 DONE

Summary:
- Added the GitHub Action composition root using the same core checker, Node runtime adapters, built-in rule registry, configuration merge, and report assembler as the CLI composition concept.
- Added action-specific base/head SHA projections from the validated GitHub event context.
- Kept verification, rule, risk, and report behavior in shared packages; the Action layer only wires dependencies and context.
- Declared only the five required workspace package dependencies and updated the lockfile without adding third-party packages.

Files:
- `apps/github-action/package.json`
- `apps/github-action/tsconfig.json`
- `apps/github-action/src/composition.ts`
- `apps/github-action/src/composition.test.ts`
- `apps/github-action/src/main.ts`
- `pnpm-lock.yaml`

Tests and quality gate:
- Targeted composition tests: PASS — 1 file, 2 tests passed.
- `pnpm install --frozen-lockfile --ignore-scripts`: PASS — lockfile is up to date.
- `pnpm test`: PASS — 89 files, 258 tests passed.
- `pnpm lint`: PASS — Biome checked 216 files.
- GitHub Action strict TypeScript project: PASS — `pnpm exec tsc -p apps/github-action/tsconfig.json` with `noEmit`.
- CLI/report strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `pnpm build`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Validation:
- Injected runtime/config/report wiring: PASS.
- Built-in rule registry reuse: PASS.
- Default schema-versioned report assembler: PASS.
- PR and push revision propagation: PASS.

Evidence boundary:
- This task verifies composition and shared-package wiring only. The core `CheckRepositoryUseCase` remains the documented behavior-free shell, so no full Action check execution or built distribution claim is made here.

Notes:
- P6 continues with AG-605, running the check and obtaining a structured report/verdict.

### AG-605 DONE

Summary:
- Added the Action check runner boundary that passes the composed checker, runtime, config, rule registry, report port, and explicit base/head SHAs to the shared core execution port.
- Returns the execution port's schema-versioned structured report, including its risk score and verdict, without rendering through console-only logic.
- Propagates core/internal execution errors unchanged instead of converting them into a scored verification result or fabricated verdict.

Files:
- `apps/github-action/src/check.ts`
- `apps/github-action/src/check.test.ts`
- `apps/github-action/src/main.ts`

Tests and quality gate:
- Targeted check-runner tests: PASS — 1 file, 2 tests passed.
- `pnpm test`: PASS — 90 files, 260 tests passed.
- `pnpm lint`: PASS — Biome checked 218 files.
- GitHub Action strict TypeScript project: PASS — `pnpm exec tsc -p apps/github-action/tsconfig.json` with `noEmit`.
- CLI/report strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `pnpm build`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Validation:
- Structured report/verdict propagation from the check port: PASS.
- Internal error remains an internal error: PASS.
- Console-only rendering and duplicate scoring: NOT USED.

Evidence boundary:
- The Action runner is a typed adapter over the shared core execution port. The currently exported `CheckRepositoryUseCase` remains the documented behavior-free shell, so this task does not claim a live full-core Action run or a built `dist` artifact.

Notes:
- P6 continues with AG-606, publishing the shared Markdown report to the GitHub step summary.

### AG-606 DONE

Summary:
- Added a read-only Action adapter that renders the structured report through the shared `@agentguard/report` Markdown renderer.
- Appends the resulting UTF-8 Markdown to `GITHUB_STEP_SUMMARY` with an injected writer for deterministic tests.
- Covers missing summary paths and write failures with typed errors; no pull-request comment or other GitHub write API was added.

Files:
- `apps/github-action/src/step-summary.ts`
- `apps/github-action/src/step-summary.test.ts`
- `apps/github-action/src/main.ts`
- `apps/github-action/tsconfig.json`

Tests and quality gate:
- Targeted Step Summary tests: PASS — 1 file, 2 tests passed.
- `pnpm test`: PASS — 91 files, 262 tests passed.
- `pnpm lint`: PASS — Biome checked 220 files.
- GitHub Action strict TypeScript project: PASS — `pnpm exec tsc -p apps/github-action/tsconfig.json` with `noEmit`.
- CLI/report strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `pnpm build`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Validation:
- Shared Markdown renderer reuse: PASS.
- Summary verdict and risk score: PASS.
- Summary findings and evidence location: PASS.
- Missing-path and write-failure handling: PASS.
- PR comment/API mutation: NOT USED.

Notes:
- P6 continues with AG-607, exposing non-sensitive risk score and verdict outputs.

### AG-607 DONE

Summary:
- Declared `risk-score` and `verdict` outputs in the Action metadata.
- Added a safe scalar-output publisher that appends only those two values to `GITHUB_OUTPUT`.
- Validated finite 0–100 report scores and the existing `pass`/`review`/`fail` verdict domain before writing.
- Kept finding messages, evidence, paths, raw outputs, and other sensitive report fields out of Action outputs.

Files:
- `apps/github-action/action.yml`
- `apps/github-action/src/outputs.ts`
- `apps/github-action/src/outputs.test.ts`
- `apps/github-action/src/main.ts`

Tests and quality gate:
- Targeted output tests: PASS — 1 file, 2 tests passed.
- Action output metadata validation: PASS — `risk-score` and `verdict` declared; no write permissions.
- `pnpm test`: PASS — 92 files, 264 tests passed.
- `pnpm lint`: PASS — Biome checked 222 files.
- GitHub Action strict TypeScript project: PASS — `pnpm exec tsc -p apps/github-action/tsconfig.json` with `noEmit`.
- CLI/report strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `pnpm build`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Validation:
- Scalar risk score output: PASS.
- Scalar verdict output: PASS.
- Sensitive finding/evidence exclusion: PASS.
- Missing, invalid, and unwritable output handling: PASS.

Notes:
- P6 continues with AG-608, mapping the configured `fail-on` behavior without changing core exit semantics.

### AG-608 DONE

Summary:
- Added the Action-layer `fail-on` parser and status decision mapping.
- `fail-on=fail` fails only `FAIL`; `fail-on=review` fails `REVIEW` and `FAIL`; `fail-on=never` never fails.
- Kept core verdict calculation and CLI exit-code semantics unchanged; the mapper only returns an Action status decision.

Files:
- `apps/github-action/src/status-behavior.ts`
- `apps/github-action/src/status-behavior.test.ts`
- `apps/github-action/src/main.ts`

Tests and quality gate:
- Targeted status-behavior tests: PASS — 1 file, 6 tests passed.
- `pnpm test`: PASS — 93 files, 270 tests passed.
- `pnpm lint`: PASS — Biome checked 224 files.
- GitHub Action strict TypeScript project: PASS — `pnpm exec tsc -p apps/github-action/tsconfig.json` with `noEmit`.
- CLI/report strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `pnpm build`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Validation:
- Default `fail` mapping: PASS.
- `review` threshold mapping: PASS.
- `never` mapping: PASS.
- Invalid behavior value: PASS — rejected with a typed error.
- Core exit semantics: unchanged.

Notes:
- P6 continues with AG-609, adding annotations only where findings carry real locations.

### AG-609 DONE

Summary:
- Added deterministic GitHub workflow-command annotations for findings with valid explicit locations.
- Prefers a valid finding location, otherwise uses valid evidence locations; findings without a real path and positive start line produce no annotation.
- Validates line/column ranges and escapes workflow-command delimiters before writing annotation commands.
- Maps annotation presentation levels to existing severity labels only; no RiskScore or verdict behavior changes.

Files:
- `apps/github-action/src/annotations.ts`
- `apps/github-action/src/annotations.test.ts`
- `apps/github-action/src/main.ts`

Tests and quality gate:
- Targeted annotation tests: PASS — 1 file, 3 tests passed.
- `pnpm test`: PASS — 94 files, 273 tests passed.
- `pnpm lint`: PASS — Biome checked 226 files.
- GitHub Action strict TypeScript project: PASS — `pnpm exec tsc -p apps/github-action/tsconfig.json` with `noEmit`.
- CLI/report strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `pnpm build`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Validation:
- Valid finding location annotation: PASS.
- Evidence-location fallback: PASS.
- Missing/invalid location omission: PASS.
- Workflow-command escaping: PASS.
- PR comment/API mutation: NOT USED.

Notes:
- P6 continues with AG-610, documenting and enforcing read-only default permissions.

### AG-610 DONE

Summary:
- Added the GitHub Action permission contract documenting explicit `contents: read` as the minimal consuming-workflow permission.
- Confirmed `action.yml` declares no `permissions` block and requests no write permission.
- Documented that step summaries, scalar outputs, and workflow annotations are runner-local channels; PR comments and GitHub API mutations are outside v0.1.

Files:
- `apps/github-action/README.md`

Validation:
- Read-only permission contract validation: PASS — metadata has no permissions and documentation requires `contents: read`.
- `pnpm lint`: PASS — Biome checked 226 files.
- `pnpm test`: PASS — 94 files, 273 tests passed.
- GitHub Action strict TypeScript project: PASS — `pnpm exec tsc -p apps/github-action/tsconfig.json` with `noEmit`.
- CLI/report strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `pnpm build`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Evidence boundary:
- This task validates metadata and documented workflow permission policy locally; it does not claim a live GitHub runner execution.

Notes:
- P6 continues with AG-611, creating the copy-paste workflow example with read-only permissions.

### AG-611 DONE

Summary:
- Added a read-only in-repository GitHub workflow example for pull requests and pushes to `main`.
- The example explicitly grants only `contents: read`, disables checkout credential persistence, and uses the defined `format` and `fail-on` inputs.
- Used the local `./apps/github-action` reference and documented that it requires the AG-613 bundle; no unpublished release tag is claimed.

Files:
- `examples/github-action/agentguard.yml`
- `examples/github-action/README.md`

Validation:
- GitHub Action example structural validation: PASS — PR/push triggers, `contents: read`, local action ref, inputs, checkout hardening, and release note present.
- `pnpm lint`: PASS — Biome checked 226 files.
- `pnpm test`: PASS — 94 files, 273 tests passed.
- GitHub Action strict TypeScript project: PASS — `pnpm exec tsc -p apps/github-action/tsconfig.json` with `noEmit`.
- CLI/report strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `pnpm build`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Evidence boundary:
- The example was validated structurally against the repository's current metadata; no live GitHub workflow run or published release reference was claimed.

Notes:
- P6 continues with AG-612, adding a deterministic representative pull-request integration test.

### AG-612 DONE

Summary:
- Added a deterministic representative pull-request integration test covering event JSON parsing, base/head propagation, Action composition, structured report handoff, Step Summary Markdown, scalar outputs, fail-on status, and annotations.
- Used injected event/file writers and a core execution-port double; no live GitHub API, network, or runner state is required.

Files:
- `apps/github-action/src/integration.test.ts`

Tests and quality gate:
- Targeted PR integration test: PASS — 1 file, 1 test passed.
- `pnpm test`: PASS — 95 files, 274 tests passed.
- `pnpm lint`: PASS — Biome checked 227 files.
- GitHub Action strict TypeScript project: PASS — `pnpm exec tsc -p apps/github-action/tsconfig.json` with `noEmit`.
- CLI/report strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `pnpm build`: PASS as orchestration — Turbo executed 0 package-level tasks.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Validation:
- Pull-request fixture context: PASS.
- Structured report/result handoff: PASS.
- Summary/output/status/annotation integration: PASS.
- Live GitHub API/network dependency: NOT USED.

Evidence boundary:
- The integrated check remains backed by the typed core execution port double because the current exported core use case is still the documented behavior-free shell; no live full-core Action execution is claimed.

Notes:
- P6 continues with AG-613, producing the Action-compatible bundled JavaScript artifact.

### AG-613 DONE

Summary:
- Added the minimal Action-only Vite bundle configuration and package build/typecheck scripts.
- Bundled `apps/github-action/src/main.ts` plus only the declared AgentGuard workspace dependencies; Node built-ins remain runtime externals.
- Added Biome force-ignore for generated `dist` output so generated code is not treated as source.
- Root Turbo now executes the GitHub Action typecheck and build tasks.

Files:
- `apps/github-action/package.json`
- `apps/github-action/vite.config.ts`
- `apps/github-action/dist/main.js`
- `apps/github-action/dist/main.js.map`
- `apps/github-action/tsconfig.json`
- `biome.json`
- `pnpm-lock.yaml`

Tests and quality gate:
- `pnpm install --frozen-lockfile --ignore-scripts`: PASS — lockfile is up to date.
- `pnpm lint`: PASS — Biome checked 228 files, including generated-output ignore configuration.
- `pnpm test`: PASS — 95 files, 274 tests passed.
- GitHub Action strict TypeScript project: PASS — `pnpm exec tsc -p apps/github-action/tsconfig.json`.
- CLI/report strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS — Turbo executed `@agentguard/github-action:typecheck` successfully.
- `pnpm build`: PASS — Turbo executed `@agentguard/github-action:build`; Vite transformed 59 modules and emitted `dist/main.js`.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Artifact validation:
- `apps/github-action/dist/main.js` process smoke: PASS — Node process exited 0.
- Bundle export smoke: PASS — required Action adapter exports load under Node.
- Bundle dependency scan: PASS — no bare `@agentguard/*` imports; Node built-ins remain explicit externals.
- Bundle contents: PASS — single `main.js` plus source map; no unrelated workspace packages bundled.

Evidence boundary:
- The artifact is a Node-loadable Action bundle and is not claimed as a live GitHub runner execution. `main.ts` currently exposes the typed Action adapters; full core execution remains the documented execution-port boundary.

Notes:
- P6 continues with AG-614, adding a conservative dogfood workflow.

### AG-614 DONE

Summary:
- Added a conservative dogfood workflow for relevant pull requests and manual dispatch.
- Workflow grants only `contents: read`, disables checkout credential persistence, installs from the frozen lockfile, builds the local Action bundle, and invokes the local Action.
- Kept the initial dogfood job `continue-on-error: true` and documented that rollout remains non-blocking until the full core execution port is connected to the Action entrypoint.
- Extended Biome force-ignore to generated Turbo cache output discovered during the gate.

Files:
- `.github/workflows/dogfood.yml`
- `biome.json`

Tests and quality gate:
- Dogfood workflow structural validation: PASS — conservative triggers, read-only permissions, frozen install, local bundle build, and local Action invocation present.
- `pnpm install --frozen-lockfile --ignore-scripts`: PASS — lockfile is up to date.
- `pnpm lint`: PASS — Biome checked 228 files.
- `pnpm test`: PASS — 95 files, 274 tests passed.
- GitHub Action strict TypeScript project: PASS — `pnpm exec tsc -p apps/github-action/tsconfig.json`.
- CLI/report strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS — Turbo executed `@agentguard/github-action:typecheck` successfully.
- `pnpm build`: PASS — Turbo executed `@agentguard/github-action:build` successfully.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Evidence boundary:
- Workflow was validated structurally; no live GitHub runner, pull request, or external API execution was claimed.

Notes:
- P6 continues with AG-615, the GitHub Action phase verification gate.

### AG-615 DONE

Summary:
- Completed the P6 GitHub Action phase gate after AG-600 through AG-614.
- Verified least-privilege metadata/workflows, deterministic PR/push fixtures, shared composition/report paths, Action outputs/status/annotations, and the local bundle artifact.
- Confirmed no SaaS integration, live GitHub API calls, PR comments, or write permissions were added.

Tests and quality gate:
- `pnpm install --frozen-lockfile --ignore-scripts`: PASS — lockfile is up to date.
- `pnpm lint`: PASS — Biome checked 228 files; generated `dist` and `.turbo` output are force-ignored.
- `pnpm test`: PASS — 95 files, 274 tests passed.
- GitHub Action strict TypeScript project: PASS — `pnpm exec tsc -p apps/github-action/tsconfig.json`.
- CLI/report strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS — Turbo executed `@agentguard/github-action:typecheck` successfully.
- `pnpm build`: PASS — Turbo executed `@agentguard/github-action:build` successfully; Vite transformed 59 modules.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.
- Action metadata/example/permission audit: PASS — declared inputs/outputs/main, read-only workflows, and no write permissions.
- Action artifact smoke/audit: PASS — `dist/main.js` loads/exits 0 and has no bare workspace imports.

Evidence boundary:
- P6 workflow and artifact validation are local structural/smoke checks; no live GitHub runner or external SaaS/API execution was claimed.
- The Action artifact exposes the typed adapters and remains bounded by the current core execution port; a full live core Action run is not claimed.

Notes:
- P6 is complete. The next phase is P7 — Release & Open Source, beginning with AG-700.

### AG-700 DONE

Summary:
- Added the English README structure covering the problem, deterministic fixture demo, current source-checkout quick start, features, normative risk model summary, principles, roadmap, v0.1 non-goals, and contribution pointers.
- Explicitly separated verified source/fixture behavior from the not-yet-published CLI package and the not-yet-live full Action entrypoint.
- Kept all feature claims aligned with the current repository and task status.

Files:
- `README.md`

Validation:
- README structure/content validation: PASS — required sections and release/evidence boundaries present.
- `pnpm lint`: PASS — Biome checked 228 files.
- `pnpm test`: PASS — 95 files, 274 tests passed.
- GitHub Action strict TypeScript project: PASS — Turbo executed `@agentguard/github-action:typecheck` successfully.
- CLI/report strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS — Turbo executed 1 Action task successfully.
- `pnpm build`: PASS — Turbo executed 1 Action task successfully.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Evidence boundary:
- README validation is local structure/content validation; no published npm package, live CLI install, or live GitHub runner execution was claimed.

Notes:
- P7 continues with AG-701, documenting the shortest accurate non-global-install quick start.

### AG-701 DONE

Summary:
- Added a one-command quick start for the current source checkout using the deterministic Git fixture flow.
- Documented the required Node.js/pnpm versions, frozen installation, temporary-repository behavior, expected `FAIL` result at `50/100`, and mapped CLI exit code `2`.
- Explicitly stated that the command does not modify the checkout, does not require a global install, and does not imply that the unpublished `npx` CLI path is already available.

Files:
- `README.md`

Tests and quality gate:
- README AG-701 structure/content validation: PASS — quick-start heading, exact command, source-checkout boundary, and required README sections present.
- `pnpm install --frozen-lockfile && pnpm exec vitest run tests/e2e/cli-fixture.test.ts`: PASS — 1 file, 1 test passed.
- `pnpm lint`: PASS — Biome checked 228 files.
- `pnpm test`: PASS — 95 files, 274 tests passed.
- GitHub Action strict TypeScript project: PASS — `pnpm exec tsc -p apps/github-action/tsconfig.json`.
- CLI/report strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS — Turbo executed 1 Action task successfully.
- `pnpm build`: PASS — Turbo executed 1 Action task successfully; Vite transformed 59 modules.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Evidence boundary:
- The quick start and its fixture test were validated locally; no published npm package, live CLI install, or live GitHub runner execution was claimed.

Notes:
- P7 continues with AG-702, documenting sample output from the current renderer without fabricating an unsupported command or result.

### AG-702 DONE

Summary:
- Added a realistic terminal output example to the English README using the exact shape asserted by the package-local CLI fixture and terminal renderer snapshots.
- Documented that the sample is rendered report output and that the quick-start fixture also verifies the mapped `FAIL` exit code.
- Kept the sample within the current renderer behavior: no extra fields, score transformations, verifier output, or unsupported command claims were added.

Files:
- `README.md`

Tests and quality gate:
- README AG-702 sample-output validation: PASS — the documented block matches the CLI fixture and terminal renderer snapshot shape exactly.
- Targeted Vitest: PASS — 2 files, 4 tests passed (`render-terminal` and `cli-fixture`).
- `pnpm lint`: PASS — Biome checked 228 files.
- `pnpm test`: PASS — 95 files, 274 tests passed.
- GitHub Action strict TypeScript project: PASS — `pnpm exec tsc -p apps/github-action/tsconfig.json`.
- CLI/report strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS — Turbo executed 1 Action task successfully.
- `pnpm build`: PASS — Turbo executed 1 Action task successfully; Vite transformed 59 modules.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Evidence boundary:
- The sample was checked against repository snapshots and local fixture tests; no claim was made that the unpublished CLI is already installable or that a live runner produced this output.

Notes:
- P7 continues with AG-703, creating a Chinese README that mirrors the English feature and evidence boundaries.

### AG-703 DONE

Summary:
- Added a Simplified Chinese README mirroring the English README's problem statement, demo, quick start, tested terminal sample, feature list, normative risk summary, principles, roadmap, non-goals, and contribution guidance.
- Preserved the current source-checkout and release evidence boundaries, including the absence of a published `npx` CLI claim and a live GitHub runner claim.
- Preserved the exact quick-start command, terminal output shape, severity weights, default thresholds, and explicit non-goals around LLM/network/confidence/category scoring.

Files:
- `README.zh-CN.md`

Tests and quality gate:
- README.zh-CN.md AG-703 structure/content validation: PASS — required mirrored sections, quick-start command, risk values, feature markers, and release boundary present.
- `pnpm install --frozen-lockfile --ignore-scripts`: PASS — lockfile is up to date.
- `pnpm lint`: PASS — Biome checked 228 files.
- `pnpm test`: PASS — 95 files, 274 tests passed.
- GitHub Action strict TypeScript project: PASS — `pnpm exec tsc -p apps/github-action/tsconfig.json`.
- CLI/report strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS — Turbo executed 1 Action task successfully.
- `pnpm build`: PASS — Turbo executed 1 Action task successfully; Vite transformed 59 modules.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Evidence boundary:
- The translation was validated locally against the current English README and repository checks; no additional runtime, package publication, or integration behavior was claimed.

Notes:
- P7 continues with AG-704, documenting the architecture without changing its boundaries.

### AG-704 DONE

Summary:
- Added a contributor-facing architecture overview derived from the locked architecture and security specifications.
- Made package responsibilities, inward dependency direction, composition roots, the structured check pipeline, injected ports, determinism requirements, trust boundaries, and change-placement guidance explicit.
- Kept the overview at the architecture level and linked to the normative specifications and ADRs instead of duplicating implementation details.

Files:
- `docs/architecture/README.md`

Tests and quality gate:
- Architecture overview structure/link validation: PASS — required package, dependency, pipeline, boundary, and ADR references present.
- `pnpm lint`: PASS — Biome checked 228 files.
- `pnpm test`: PASS — 95 files, 274 tests passed.
- GitHub Action strict TypeScript project: PASS — `pnpm exec tsc -p apps/github-action/tsconfig.json`.
- CLI/report strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS — Turbo executed 1 Action task successfully.
- `pnpm build`: PASS — Turbo executed 1 Action task successfully; Vite transformed 59 modules.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Evidence boundary:
- The overview is contributor documentation backed by local structure and repository quality checks; no new runtime behavior or architecture boundary was introduced.

Notes:
- P7 continues with AG-705, documenting JSON configuration and its trust boundary.

### AG-705 DONE

Summary:
- Added the complete v0.1 JSON configuration specification at `docs/specs/config.md`.
- Documented every root, verification, rule-override, and threshold field; immutable defaults; schema restrictions; fixed filenames; JSON-only trust boundary; loading/error behavior; and field-level precedence from defaults to JSON config to CLI overrides.
- Kept examples aligned with the checked-in schema and explicitly excluded arbitrary commands, shell fragments, executable configuration, and undocumented rule behavior.

Files:
- `docs/specs/config.md`

Tests and quality gate:
- Configuration documentation structure/JSON syntax validation: PASS — required fields, precedence, security boundaries, and three JSON examples present.
- Documented JSON examples vs checked-in schema examples: PASS — empty and complete examples match `agentguard.config.schema.json`; defaults example has `review: 15` and `fail: 50`.
- Targeted config Vitest: PASS — 6 files, 16 tests passed.
- `pnpm lint`: PASS — Biome checked 228 files.
- `pnpm test`: PASS — 95 files, 274 tests passed.
- GitHub Action strict TypeScript project: PASS — `pnpm exec tsc -p apps/github-action/tsconfig.json`.
- CLI/report strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS — Turbo executed 1 Action task successfully.
- `pnpm build`: PASS — Turbo executed 1 Action task successfully; Vite transformed 59 modules.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Evidence boundary:
- The documentation and examples were validated against the checked-in JSON schema and local config tests; no new config field, command syntax, dependency, or runtime behavior was introduced.

Notes:
- P7 continues with AG-706, documenting evidence, finding, and report semantics.

### AG-706 DONE

Summary:
- Added the contributor-facing evidence, finding, verification, and report semantics specification at `docs/specs/evidence.md`.
- Explained `schemaVersion: 1` and the compatibility caveat, the distinction between product and report versions, locations and evidence facts, finding confidence, bounded verifier output, report assembly, and presentation-only rendering.
- Included the normative v0.1 severity weights, verification penalties, score aggregation, verdict boundaries, secret redaction, and verifier-error versus internal-error distinction.

Files:
- `docs/specs/evidence.md`

Tests and quality gate:
- Evidence documentation structure/JSON validation: PASS — required schema sections, versioning, semantics, risk, trust-boundary, and illustrative fragment checks passed.
- Targeted report/core Vitest: PASS — 4 files, 8 tests passed.
- `pnpm lint`: PASS — Biome checked 228 files.
- `pnpm test`: PASS — 95 files, 274 tests passed.
- GitHub Action strict TypeScript project: PASS — `pnpm exec tsc -p apps/github-action/tsconfig.json`.
- CLI/report strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS — Turbo executed 1 Action task successfully.
- `pnpm build`: PASS — Turbo executed 1 Action task successfully; Vite transformed 59 modules.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Evidence boundary:
- The document distinguishes current schema version `1` from a permanent compatibility promise; no runtime contract or renderer behavior was changed.

Notes:
- P7 continues with AG-707, documenting built-in rule authoring without implying dynamic plugin loading.

### AG-707 DONE

Summary:
- Added the built-in rule authoring guide at `docs/specs/rule.md`.
- Documented the generic Rule contract, metadata requirements and ID pattern, finding/evidence output, redaction and deterministic behavior, static registry integration, intentional public exports, and the required positive/negative test coverage.
- Explicitly excluded dynamic plugin loading, runtime rule discovery, network access, shell execution, and LLM behavior from v0.1 rule authoring.

Files:
- `docs/specs/rule.md`

Tests and quality gate:
- Rule documentation structure/reference validation: PASS — contract, metadata, finding, registry, test, boundary, and source references present.
- Targeted rules Vitest: PASS — 22 files, 63 tests passed.
- `pnpm lint`: PASS — Biome checked 228 files.
- `pnpm test`: PASS — 95 files, 274 tests passed.
- GitHub Action strict TypeScript project: PASS — `pnpm exec tsc -p apps/github-action/tsconfig.json`.
- CLI/report strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS — Turbo executed 1 Action task successfully.
- `pnpm build`: PASS — Turbo executed 1 Action task successfully; Vite transformed 59 modules.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Evidence boundary:
- The guide documents existing static rule surfaces and tests; no plugin loader, new rule, dependency, or runtime behavior was added.

Notes:
- P7 continues with AG-708, documenting unambiguous CLI and CI exit-code meanings.

### AG-708 DONE

Summary:
- Added `docs/specs/exit-codes.md` with explicit CLI check mappings: `0=PASS`, `1=REVIEW`, `2=FAIL`, and `3=AgentGuard internal error`.
- Documented the distinct verifier `error` path, non-check help/version/usage behavior, GitHub Action `fail-on` status mapping, and the separate risk-score/verdict outputs.
- Made the existing top-level usage behavior explicit so numeric code `1` is not misread as a REVIEW report when no check report was produced.

Files:
- `docs/specs/exit-codes.md`

Tests and quality gate:
- Exit-code documentation/source mapping validation: PASS — table values match `CLI_EXIT_CODES`, `mapCliExitCode`, and Action status behavior.
- Targeted CLI/Action Vitest: PASS — 3 files, 12 tests passed.
- `pnpm lint`: PASS — Biome checked 228 files.
- `pnpm test`: PASS — 95 files, 274 tests passed.
- GitHub Action strict TypeScript project: PASS — `pnpm exec tsc -p apps/github-action/tsconfig.json`.
- CLI/report strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS — Turbo executed 1 Action task successfully.
- `pnpm build`: PASS — Turbo executed 1 Action task successfully; Vite transformed 59 modules.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Evidence boundary:
- The document reflects existing mappings and explicitly separates check verdicts from the current CLI skeleton's usage paths; no code or exit-code behavior was changed.

Notes:
- P7 continues with AG-709, creating a self-contained basic Node/TypeScript example.

### AG-709 DONE

Summary:
- Added a minimal clean Node.js/TypeScript example under `examples/basic` with an empty JSON configuration, strict TypeScript settings, a small source module, and a matching Node test.
- Documented why the fixture is a deterministic default-policy PASS baseline: no secret-like value, runtime dependency addition, workflow permission change, authentication-path change, or source-without-test condition.
- Kept the example independent of unpublished private services and explicitly bounded the documentation to a fixture expectation rather than a published CLI or live runner claim.

Files:
- `examples/basic/package.json`
- `examples/basic/tsconfig.json`
- `examples/basic/agentguard.config.json`
- `examples/basic/src/index.ts`
- `examples/basic/src/index.test.ts`
- `examples/basic/README.md`

Tests and quality gate:
- Basic example structure/config/safety validation: PASS — required files, private ESM metadata, empty JSON config, PASS derivation, and no secret-like fixture content.
- `pnpm exec tsc -p examples/basic/tsconfig.json`: PASS.
- `node --experimental-strip-types --test examples/basic/src/index.test.ts`: PASS — 1 test passed.
- `pnpm lint`: PASS — Biome checked 233 files.
- `pnpm test`: PASS — 96 files, 274 Vitest tests passed; the Node test also passed during collection.
- GitHub Action strict TypeScript project: PASS — `pnpm exec tsc -p apps/github-action/tsconfig.json`.
- CLI/report strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS — Turbo executed 1 Action task successfully.
- `pnpm build`: PASS — Turbo executed 1 Action task successfully; Vite transformed 59 modules.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Evidence boundary:
- The first Node strip-mode check exposed and fixed the example's `.js`-to-`.ts` import mismatch; final example typecheck and test evidence is green.
- No AgentGuard published package, full live CLI check, private service, or external API was introduced or claimed.

Notes:
- P7 continues with AG-710, creating an intentionally risky but secret-free demo fixture.

### AG-710 DONE

Summary:
- Added the secret-free `examples/bad-ai-pr` demo with review and fail before/after snapshots for workflow permissions, runtime dependency, authentication, and source-without-tests changes.
- Added a deterministic package-local test that runs the existing built-in rules and core risk/verdict functions: `45` yields `REVIEW`, while `105` is capped at `100` and yields `FAIL`.
- Documented factual evidence and explicitly excluded real credentials, network lookup, exploitability claims, package reputation, and published/live integration claims.

Files:
- `examples/bad-ai-pr/README.md`
- `examples/bad-ai-pr/agentguard.config.json`
- `examples/bad-ai-pr/check.test.ts`
- `examples/bad-ai-pr/review/before/package.json`
- `examples/bad-ai-pr/review/after/package.json`
- `examples/bad-ai-pr/review/before/.github/workflows/ci.yml`
- `examples/bad-ai-pr/review/after/.github/workflows/ci.yml`
- `examples/bad-ai-pr/fail/before/package.json`
- `examples/bad-ai-pr/fail/after/package.json`
- `examples/bad-ai-pr/fail/before/.github/workflows/ci.yml`
- `examples/bad-ai-pr/fail/after/.github/workflows/ci.yml`
- `examples/bad-ai-pr/fail/before/src/auth.ts`
- `examples/bad-ai-pr/fail/after/src/auth.ts`
- `examples/bad-ai-pr/fail/before/src/reporting.ts`
- `examples/bad-ai-pr/fail/after/src/reporting.ts`

Tests and quality gate:
- Bad-ai-pr demo structure/safety validation: PASS — 15 fixture files, empty default config, expected scenarios, and no secret-like fixture content.
- Targeted Vitest: PASS — 1 file, 2 tests passed.
- `pnpm lint`: PASS — Biome checked 243 files.
- `pnpm test`: PASS — 97 files, 276 tests passed.
- GitHub Action strict TypeScript project: PASS — `pnpm exec tsc -p apps/github-action/tsconfig.json`.
- CLI/report strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS — Turbo executed 1 Action task successfully.
- `pnpm build`: PASS — Turbo executed 1 Action task successfully; Vite transformed 59 modules.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Evidence boundary:
- A first lint run identified only import/formatting issues in the new test; the issues were corrected without changing behavior, and the final full gate passed.
- The demo uses local source APIs under the repository test configuration; it does not claim a published CLI or live GitHub execution.

Notes:
- P7 continues with AG-711, adding a scope-aware deterministic rule request template.

### AG-711 DONE

Summary:
- Added a deterministic rule request issue template under `.github/ISSUE_TEMPLATE`.
- Required a category-prefixed rule ID, exact trigger inputs, positive and negative fixtures, factual evidence, redaction, false-positive/false-negative analysis, deterministic tests, and v0.1 scope review.
- Explicitly rejected vague “AI says risky” definitions, secret submissions, network/LLM requirements, arbitrary execution, and dynamic plugin assumptions.

Files:
- `.github/ISSUE_TEMPLATE/rule-request.md`

Validation:
- Rule request template structure/safety validation: PASS — required evidence, false-positive, positive/negative test, redaction, and scope prompts present.
- `pnpm lint`: PASS — Biome checked 243 files.
- `pnpm test`: PASS — 97 files, 276 tests passed.
- GitHub Action strict TypeScript project: PASS — `pnpm exec tsc -p apps/github-action/tsconfig.json`.
- CLI/report strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS — Turbo executed 1 Action task successfully.
- `pnpm build`: PASS — Turbo executed 1 Action task successfully; Vite transformed 59 modules.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Evidence boundary:
- The template is documentation/issue intake only; it does not add a rule, plugin loader, runtime behavior, or issue automation.

Notes:
- P7 continues with AG-712, adding a safe reproduction-focused bug report template.

### AG-712 DONE

Summary:
- Added a reproduction-focused bug report issue template under `.github/ISSUE_TEMPLATE`.
- Requested AgentGuard version/commit, OS, Node/pnpm, integration surface, safe minimal reproduction, expected/actual behavior, exit/report details, and false-positive context.
- Explicitly prohibited secrets, private repositories, production data, credentials, private keys, and unredacted output while providing safe synthetic-fixture guidance.

Files:
- `.github/ISSUE_TEMPLATE/bug-report.md`

Validation:
- Bug report template structure/safety validation: PASS — version/platform/reproduction, expected/actual, redaction, and no-confidential-data prompts present.
- `pnpm lint`: PASS — Biome checked 243 files.
- `pnpm test`: PASS — 97 files, 276 tests passed.
- GitHub Action strict TypeScript project: PASS — `pnpm exec tsc -p apps/github-action/tsconfig.json`.
- CLI/report strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS — Turbo executed 1 Action task successfully.
- `pnpm build`: PASS — Turbo executed 1 Action task successfully; Vite transformed 59 modules.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Evidence boundary:
- The template collects only safe reproduction metadata and sanitized evidence; it does not add issue automation, data collection, or runtime behavior.

Notes:
- P7 continues with AG-713, adding a scope-aware feature request template.

### AG-713 DONE

Summary:
- Added a focused feature request issue template under `.github/ISSUE_TEMPLATE`.
- Required a concrete problem and evidence, smallest proposed outcome, alternatives, deterministic acceptance criteria, v0.1 task/scope impact, trust-boundary review, and explicit post-v0.1 handling.
- Added prompts that reject scope creep and “AI says risky” as the sole rationale without changing any product behavior.

Files:
- `.github/ISSUE_TEMPLATE/feature-request.md`

Validation:
- Feature request template structure/scope validation: PASS — problem/evidence, alternatives, scope impact, security boundary, deterministic acceptance, and post-v0.1 prompts present.
- `pnpm lint`: PASS — Biome checked 243 files.
- `pnpm test`: PASS — 97 files, 276 tests passed.
- GitHub Action strict TypeScript project: PASS — `pnpm exec tsc -p apps/github-action/tsconfig.json`.
- CLI/report strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS — Turbo executed 1 Action task successfully.
- `pnpm build`: PASS — Turbo executed 1 Action task successfully; Vite transformed 59 modules.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Evidence boundary:
- The template is scope-aware issue intake only; it does not introduce a feature, dependency, integration, or release commitment.

Notes:
- P7 continues with AG-714, adding the minimal What/Why/Tests/Breaking changes/task ID pull request checklist.

### AG-714 DONE

Summary:
- Added a concise pull request template with What changed, Why, exact Tests/validation evidence, Breaking changes/risk, Task ID, and a focused review checklist.
- Required scope discipline, behavior/rule coverage, trust-boundary preservation, secret exclusion, and `STATUS.md` evidence without adding ceremonial fields.

Files:
- `.github/pull_request_template.md`

Validation:
- Pull request template structure/scope validation: PASS — required sections, evidence-sensitive validation guidance, task ID, and non-ceremonial checklist present.
- `pnpm lint`: PASS — Biome checked 243 files.
- `pnpm test`: PASS — 97 files, 276 tests passed.
- GitHub Action strict TypeScript project: PASS — `pnpm exec tsc -p apps/github-action/tsconfig.json`.
- CLI/report strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS — Turbo executed 1 Action task successfully.
- `pnpm build`: PASS — Turbo executed 1 Action task successfully; Vite transformed 59 modules.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Evidence boundary:
- The template only changes repository contribution metadata; it does not enforce checks automatically or alter product behavior.

Notes:
- P7 continues with AG-715, configuring Changesets without publishing.

### AG-715 DONE

Summary:
- Added the pinned `@changesets/cli@3.0.1` development dependency and the root `pnpm changeset` command.
- Added `.changeset/config.json` with public package access, independent package versioning, `main` as the release base branch, patch-level internal dependency updates, and explicit private-package version/tag exclusion.
- Added contributor instructions without creating a release changeset or invoking any publish command.

Files:
- `package.json`
- `pnpm-lock.yaml`
- `.changeset/config.json`
- `.changeset/README.md`

Validation:
- `pnpm install --lockfile-only --ignore-scripts`: PASS — lockfile resolved with `@changesets/cli@3.0.1`.
- `pnpm install --frozen-lockfile --ignore-scripts`: PASS — dependency installation completed without lifecycle scripts.
- `pnpm changeset --help`: PASS — Changesets v3.0.1 command surface loaded.
- Changesets status in a disposable initialized Git workspace containing the same workspace package manifests and `.changeset` configuration: PASS — no packages were pending release.
- Direct status from this source workspace is intentionally not treated as a repository result because `E:\AgentGuard` has no `.git` directory/base branch.
- `pnpm lint`: PASS — Biome checked 244 files.
- `pnpm test`: PASS — 97 files, 276 tests passed.
- GitHub Action strict TypeScript project: PASS — `pnpm exec tsc -p apps/github-action/tsconfig.json`.
- CLI/report strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS — Turbo executed 1 Action task successfully.
- `pnpm build`: PASS — Turbo executed 1 Action task successfully; Vite transformed 59 modules.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Evidence boundary:
- This task establishes release metadata and a non-publishing Changesets command only; no package version, changelog, Git tag, registry publish, release workflow, or runtime behavior was changed.

Notes:
- P7 continues with AG-716, creating a deliberate-trigger release workflow.

### AG-716 DONE

Summary:
- Added a release workflow that runs only from an explicit `workflow_dispatch` confirmation (`RELEASE`) on `main`; arbitrary pull requests and pushes do not trigger it.
- Added the full lint/typecheck/test/build gate before the Changesets release action.
- Added a checked Action bundle artifact upload and scoped release permissions for Changesets version/publish operations.
- Kept registry publication behind the deliberate workflow input and the `NPM_TOKEN` secret; no release was executed during this task.

Files:
- `.github/workflows/release.yml`

Validation:
- Release workflow YAML parse: PASS — parsed with the repository-available YAML parser.
- Release workflow structure/security audit: PASS — `workflow_dispatch` only; exact `RELEASE` plus `main` guard; quality commands precede `changesets/action@v1`; Action bundle upload and scoped write permissions are present.
- `pnpm lint`: PASS — Biome checked 244 files.
- `pnpm test`: PASS — 97 files, 276 tests passed.
- GitHub Action strict TypeScript project: PASS — `pnpm exec tsc -p apps/github-action/tsconfig.json`.
- CLI/report strict TypeScript project: PASS — `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS — Turbo executed 1 Action task successfully.
- `pnpm build`: PASS — Turbo executed 1 Action task successfully; Vite transformed 59 modules.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75 source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder check.

Evidence boundary:
- The workflow was validated locally as YAML and static structure only; no GitHub runner, registry, release PR, package publish, Git tag, or external Action execution was claimed or performed.

Notes:
- P7 continues with AG-717, validating package metadata and intentional pack contents.

### AG-717 BLOCKED — SUPERSEDED BY EXTERNAL SPECIFICATION

Blocker:
- The public package release layout is not currently publishable within the
  task's package-manifest-only scope: all seven public package manifests export
  `dist` files, but the workspace has no package-local build output or build
  configuration for those packages. `npm pack --dry-run` therefore includes
  source and test TypeScript files instead of the exported runtime artifacts.
- The repository contains no canonical remote repository URL or organization
  identity, so a correct `repository` metadata field cannot be added without
  inventing project identity.

Evidence:
- `npm pack --dry-run --json` for `@agentguard/cli`, `@agentguard/config`,
  `@agentguard/contracts`, `@agentguard/core`, `@agentguard/report`,
  `@agentguard/rules`, and `@agentguard/runtime-node`: PASS as a diagnostic,
  but each package includes `src/**/*.ts` and tests while its `exports` point
  to `dist`.
- `npm pack --dry-run --json` for private `@agentguard/github-action`: PASS —
  after the manifest correction it contains only `README.md`, `action.yml`,
  `dist/main.js`, `dist/main.js.map`, and `package.json`.
- The root and all workspace package manifests now carry the known MIT license
  and Node 24 engine metadata; public packages explicitly request public npm
  access, while the Action remains `private`.
- `pnpm install --frozen-lockfile --ignore-scripts`: PASS — lockfile remains
  current.
- `pnpm lint`: PASS — Biome checked 244 files.
- `pnpm test`: PASS — 97 files, 276 tests passed.
- GitHub Action strict TypeScript project: PASS —
  `pnpm exec tsc -p apps/github-action/tsconfig.json`.
- CLI/report strict TypeScript project: PASS —
  `pnpm exec tsc -p tsconfig.cli.json`.
- `pnpm typecheck`: PASS — Turbo executed 1 Action task successfully.
- `pnpm build`: PASS — Turbo executed 1 Action task successfully; Vite
  transformed 59 modules.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75
  source files checked.
- `node scripts/check-package-boundaries.ts`: PASS — existing placeholder
  check.

Proposed next action:
- Define the canonical repository identity and explicitly choose/approve the
  public-package build layout. Then add only the required package build
  configuration and rerun `npm pack --dry-run` before continuing to AG-718.

Notes:
- AG-718 and later release-candidate tasks remain gated by this blocker; no
  package publish, release tag, or readiness claim was made.

### AG-717 DONE

Summary:
- Persisted the authoritative `Felyx-Fu/AgentGuard` repository identity and
  package directory metadata across the root and workspace manifests.
- Added package-local TypeScript build configurations and explicit unbundled
  `build` scripts for all seven public packages. The GitHub Action remains
  `private: true` with its existing independent bundled artifact model.
- Added minimal package-local README and MIT LICENSE files, and constrained
  public package files to metadata plus `dist/**`.
- Resolved the external-specification blocker and completed the normative
  packed-artifact gate without any remote write, publish, tag, or release.

Files:
- `package.json`
- `pnpm-lock.yaml`
- `packages/*/package.json`
- `packages/*/tsconfig.build.json`
- `packages/{contracts,core,runtime-node,rules,config,report,cli}/README.md`
- `packages/{contracts,core,runtime-node,rules,config,report,cli}/LICENSE`
- `packages/runtime-node/src/node-platform.ts`
- `packages/runtime-node/src/environment/system-environment.ts`
- `02-ARCHITECTURE.md`, `03-ENGINEERING-STANDARDS.md`,
  `06-DEFINITION-OF-DONE.md`, `tasks/P7-release-and-open-source.md`
- `STATUS.md`

Validation:
- `pnpm install --frozen-lockfile --ignore-scripts`: PASS — lockfile is up to
  date.
- Package-local build configuration inspection: PASS — 7/7 configs use
  `src` -> `dist`, declarations, declaration maps, source maps, and production
  source exclusions.
- `pnpm lint`: PASS — Biome checked 252 files.
- `pnpm typecheck`: PASS — Turbo executed the configured Action typecheck;
  public package production sources were typechecked by their package-local
  `tsc` builds.
- `pnpm test`: PASS — 97 test files and 276 tests passed.
- `pnpm build`: PASS — Turbo completed 8/8 tasks: seven public package builds
  and the private GitHub Action bundle.
- Final tarball pack gate: PASS — all seven final tarballs were inspected;
  packed manifests have installable `0.1.0` internal ranges, valid ESM
  exports, present declarations, and no source/tests/fixtures/coverage/config
  leakage.
- External npm consumer: PASS — installed the final packed artifacts, strict
  TypeScript declaration resolution passed, ESM root-import smoke passed, and
  packed `agentguard --help` and `agentguard --version` exited successfully.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75
  source files checked.
- `node scripts/check-package-boundaries.ts`: exit 0 — this repository's
  existing script is still an explicit placeholder and reports that deep
  public-import validation is deferred.

Evidence boundary:
- The artifact and consumer checks are local validations of final packed
  files. No remote repository was created, and no push, tag, GitHub Release,
  npm publish, or other remote write was performed.
- The package-boundary command was executed but was not represented as a deep
  boundary analysis because the existing script remains a placeholder.

Notes:
- AG-717 is complete. AG-718 is now the current task; no AG-719 or later
  release-candidate work has started.

### AG-718 DONE

Summary:
- Added the v0.1.0 release-readiness checklist mapped to the release-level
  Definition of Done and the normative public package artifact gate.
- Kept every checklist item intentionally unchecked, as required by the task;
  the document records required evidence without turning prior local checks
  into release-level completion claims.
- Added explicit security stop conditions and the prohibition on using a
  checklist to authorize remote writes or bypass a blocker.

Files:
- `docs/release/v0.1-checklist.md`
- `STATUS.md`

Validation:
- `pnpm lint`: PASS — Biome checked 252 files.
- Checklist source review: PASS — it maps platform/CI, product behavior,
  documentation/examples, security/release hygiene, and the seven-package
  artifact gate to the normative Definition of Done.
- Completion-state review: PASS — all release checklist boxes remain
  unchecked; no release, publish, tag, or remote write was performed.

Evidence boundary:
- AG-718 documents release criteria only. It does not assert Windows/Linux/
  macOS CI, release notes, or release readiness as complete.

Notes:
- AG-719 is now the current task. No cross-platform CI matrix change has
  started in this task.

### AG-719 BLOCKED — SUPERSEDED BY AUTHORITATIVE CI AUTHORIZATION

Blocker:
- The CI workflow now declares the required Node 24 matrix for Windows,
  Linux, and macOS, but acceptance requires a real successful job on each
  GitHub-hosted runner.
- The canonical remote is not required to exist, and the active external
  specification prohibits creating a remote, pushing, tagging, releasing, or
  performing other remote writes. No hosted-run evidence can therefore be
  obtained in this task without violating the boundary.

Files:
- `.github/workflows/ci.yml`
- `STATUS.md`

Validation:
- CI YAML structure: PASS — matrix contains exactly
  `ubuntu-latest`, `windows-latest`, and `macos-latest`; Node setup remains
  pinned to `24`; quality steps remain install, lint, typecheck, test, and
  build.
- `pnpm lint`: PASS — Biome checked 252 files.
- Local Windows quality evidence: PASS — the repository's lint, typecheck,
  tests, build, architecture, and packed-consumer gates were already passed;
  this is not substituted for Linux/macOS hosted-run evidence.
- GitHub-hosted CI jobs: NOT OBSERVED — no remote write or hosted workflow run
  was started.

Evidence boundary:
- AG-719 remains BLOCKED rather than DONE because the three-platform hosted
  execution requirement is unverified. AG-720 and later tasks remain gated.

Proposed next action:
- When an authorized canonical remote and remote-write boundary are available,
  run the matrix and record the three hosted job results. Do not lower the
  matrix requirement or mark this task complete from static inspection alone.

### AG-719 RESUMED — LIMITED REMOTE CI AUTHORIZATION

Authorization:
- The authoritative external input now permits creation/use of the canonical
  `Felyx-Fu/AgentGuard` repository, initialization/use of `main`, pushing the
  validated source and required CI fixes, triggering `.github/workflows/ci.yml`,
  and reading GitHub-hosted run/job/log/conclusion evidence.
- This authorization is limited to AG-719 CI evidence. It does not permit npm
  publish, `pnpm changeset publish`, `NPM_TOKEN` use, tags, GitHub Releases,
  release workflow execution, release PRs, formal release artifacts, or a
  `v0.1.0 READY TO RELEASE` declaration.

Required evidence:
- The same identifiable source revision must pass the formal quality gate on
  `ubuntu-latest`, `windows-latest`, and `macos-latest`, all with Node 24.
- Completion must record the canonical repository, tested commit SHA, workflow
  name, run identifier/URL when available, each platform conclusion, Node
  version, quality-gate result, and any failure/root-cause/fix history.
- The existing `scripts/check-package-boundaries.ts` remains a placeholder;
  its deferred deep validation must be recorded without expanding AG-719 to
  implement it.

Hosted attempt 1:
- Canonical repository: `https://github.com/Felyx-Fu/AgentGuard`
- Workflow: `CI`
- Tested commit: `acb1b1906d02c049d70305586419aa00bd5c0a10`
- Run: `32932409223` —
  `https://github.com/Felyx-Fu/AgentGuard/actions/runs/32932409223`
- Node setup: `24` on all matrix jobs.
- `ubuntu-latest`: FAIL — lint and typecheck passed; three Action tests
  failed because the hosted runner predefines `GITHUB_EVENT_NAME`,
  `GITHUB_OUTPUT`, and `GITHUB_STEP_SUMMARY`.
- `macos-latest`: FAIL — lint and typecheck passed; the same three
  environment-sensitive Action tests failed.
- `windows-latest`: FAIL — install passed, but Biome saw CRLF checkout
  content where the repository formatter requires LF and reported 252 files.
- Root causes are ordinary hosted-runner environment and line-ending
  differences. The smallest fix adds repository LF attributes and makes the
  missing-input tests pass explicit empty values; no production behavior or
  quality gate was weakened.

Hosted attempt 2:
- Tested commit: `bd44de77008a36575718ee6d7e9219331aba7e61`
- Run: `32932782331` —
  `https://github.com/Felyx-Fu/AgentGuard/actions/runs/32932782331`
- `ubuntu-latest`: PASS — install, lint, typecheck, test, and build passed.
- `windows-latest`: PASS — install, lint, typecheck, test, and build passed.
- `macos-latest`: FAIL at Test only — install, lint, and typecheck passed;
  build was skipped after the test failure.
- macOS failure: `tests/integration/runtime/runtime-adapters.test.ts`
  compared the temporary fixture's `/var/...` spelling with the child
  process's canonical `/private/var/...` working directory. The runtime
  process itself exited successfully; the assertion was platform-sensitive.
- The next smallest fix compares the process output with
  `realpath(fixture.directory)` and is being validated locally before the
  next authorized push.

Hosted attempt 3:
- Tested commit: `ea4d835244191477da8507aa8e2f749eef1e925f`
- Run: `32935591063` —
  `https://github.com/Felyx-Fu/AgentGuard/actions/runs/32935591063`
- `ubuntu-latest`: PASS — install, lint, typecheck, test, and build passed.
- `macos-latest`: PASS — install, lint, typecheck, test, and build passed.
- `windows-latest`: FAIL at Test only — install, lint, and typecheck passed;
  build was skipped after the test failure.
- Windows failure: the child process returned the valid `C:\Users\RUNNER~1\...`
  8.3 short-path spelling, while the test expected the long-path spelling
  from `realpath(fixture.directory)`. The runtime process exited successfully;
  the assertion still compared platform-specific spellings.
- The next smallest fix canonicalizes both the child output and fixture path
  with `realpath`, and is being validated locally before the next authorized
  push.

Execution state:
- AG-719 remains resumed and the current task remains AG-719.
- The authorized canonical repository was created and the source plus two
  ordinary hosted-CI fixes were pushed to `main`; hosted attempts 1 through 3
  above are the recorded failure evidence. The next cross-platform fix is
  being validated before the next push.
- AG-720 was gated until one identifiable revision passed all three hosted
  runners and the evidence was recorded below.

### AG-719 DONE

Summary:
- Completed the authorized cross-platform CI matrix for the canonical
  `Felyx-Fu/AgentGuard` repository on `main`.
- The same source revision passed the complete configured hosted quality gate
  on Ubuntu, Windows, and macOS with Node 24.
- Repaired only ordinary hosted-runner issues: Actions-provided environment
  variables in missing-input tests, Windows checkout line endings, macOS
  `/private` temporary paths, and Windows 8.3 temporary paths.
- No architecture boundary, security boundary, v0.1 scope, publishing, tag,
  release, or NPM_TOKEN boundary was changed or bypassed.

Final hosted evidence:
- Canonical repository: `https://github.com/Felyx-Fu/AgentGuard`
- Branch: `main`
- Workflow: `CI`
- Tested commit: `ea32fac187ddf239e590208136c744460a286f45`
- Run: `32935751675` —
  `https://github.com/Felyx-Fu/AgentGuard/actions/runs/32935751675`
- `ubuntu-latest`: PASS — job
  `https://github.com/Felyx-Fu/AgentGuard/actions/runs/32935751675/job/98076534330`;
  frozen-lockfile install, lint, typecheck, test, and build all passed.
- `windows-latest`: PASS — job
  `https://github.com/Felyx-Fu/AgentGuard/actions/runs/32935751675/job/98076534547`;
  frozen-lockfile install, lint, typecheck, test, and build all passed.
- `macos-latest`: PASS — job
  `https://github.com/Felyx-Fu/AgentGuard/actions/runs/32935751675/job/98076534445`;
  frozen-lockfile install, lint, typecheck, test, and build all passed.
- Node setup requested `24` on every job; hosted environment details were
  Ubuntu `v24.19.0`, Windows `v24.19.0`, and macOS `v24.18.0`.
- Hosted workflow conclusion: PASS. Architecture and package-boundary steps
  are not configured in the current `ci.yml`; local final checks passed
  architecture validation, while the existing package-boundary command exited
  0 and explicitly reported its deep validation as deferred.

Failure and fix history:
- Run `32932409223`, commit
  `acb1b1906d02c049d70305586419aa00bd5c0a10`: Ubuntu/macOS tests were
  accidentally affected by runner-provided `GITHUB_EVENT_NAME`,
  `GITHUB_OUTPUT`, and `GITHUB_STEP_SUMMARY`; Windows Biome rejected CRLF
  checkout content in 252 files. Fixed with explicit empty test inputs and
  repository LF attributes in commit `bd44de77008a36575718ee6d7e9219331aba7e61`.
- Run `32932782331`, commit
  `bd44de77008a36575718ee6d7e9219331aba7e61`: Ubuntu and Windows passed;
  macOS exposed `/var` versus `/private/var` temporary-directory spelling.
  The first canonical-path assertion was pushed in commit
  `ea4d835244191477da8507aa8e2f749eef1e925f`.
- Run `32935591063`, commit
  `ea4d835244191477da8507aa8e2f749eef1e925f`: Ubuntu and macOS passed;
  Windows exposed a valid `RUNNER~1` 8.3 temporary-path spelling. Commit
  `ea32fac187ddf239e590208136c744460a286f45` canonicalized both sides with
  `realpath`; the final run above passed all platforms.

Files:
- `.github/workflows/ci.yml`
- `.gitattributes`
- `apps/github-action/src/event-context.test.ts`
- `apps/github-action/src/outputs.test.ts`
- `apps/github-action/src/step-summary.test.ts`
- `tests/integration/runtime/runtime-adapters.test.ts`
- `STATUS.md`

Local final validation:
- `pnpm lint`: PASS — Biome checked 252 files.
- `pnpm typecheck`: PASS — configured Action typecheck completed.
- `pnpm test`: PASS — 97 files, 276 tests.
- `pnpm build`: PASS — all 8 Turbo build tasks completed.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75
  source files checked.
- `node scripts/check-package-boundaries.ts`: PASS as the existing explicit
  placeholder; deep public-import validation remains deferred.

Evidence boundary:
- AG-719 is complete. AG-720 is now the current task and is limited to
  release-candidate validation; no publish, tag, GitHub Release, release
  workflow, release PR, or formal readiness claim is authorized.

### AG-720 DONE

Summary:
- Completed release-candidate validation for the already implemented v0.1
  scope without adding features, changing architecture, weakening tests, or
  changing security/trust boundaries.
- AG-719 remains DONE and AG-718 remains DONE. The next task is AG-721; no
  formal v0.1.0 readiness claim has been made by this task.

Clean installation and local quality gates:
- `pnpm install --frozen-lockfile --force --ignore-scripts`: PASS; pnpm
  reported the lockfile was up to date across all 9 workspace projects.
- The local host is Node `v25.9.0`, which produced the expected engine warning;
  the required policy `>=24 <25` was preserved and was not relaxed.
- `pnpm lint`: PASS — Biome checked 252 files.
- `pnpm typecheck`: PASS.
- `pnpm test`: PASS — 97 files, 276 tests.
- `pnpm build`: PASS — all 8 Turbo build tasks completed, including all
  public package `dist/` outputs and the private GitHub Action bundle.
- `node scripts/check-architecture.ts`: PASS — contracts 10 and core 75
  source files checked.
- `node scripts/check-package-boundaries.ts`: PASS only as the existing
  placeholder; it explicitly reports that deep public-import validation is
  deferred. No claim of deep package-boundary validation is made.
- Read-only source scans found no new shell-string execution, dynamic code
  evaluation, core/contracts Node imports, or LLM/network client usage. The
  existing static JSON schema URL remains the only expected URL match.

Examples, CLI, Action, and workflow validation:
- `examples/basic`: TypeScript compilation and the example test passed.
- `examples/bad-ai-pr`: both example tests passed, including review and fail
  outcomes.
- Built CLI smoke: `node packages/cli/dist/main.js --help` and `--version`
  passed; version output was `0.1.0`.
- Private GitHub Action bundle import and required export checks passed;
  `apps/github-action/dist/main.js` contained no bare workspace package
  imports.
- Action metadata, local example permissions, dogfood workflow, and release
  workflow structure were inspected. The release workflow was not executed;
  no release workflow, publish, tag, GitHub Release, release PR, or NPM_TOKEN
  operation was performed.

Public package artifact gate:
- `pnpm pack` produced seven actual tarballs in
  `C:\Users\fukan\AppData\Local\Temp\agentguard-pack-artifacts-20260826-v7`:
  `@agentguard/contracts`, `@agentguard/core`,
  `@agentguard/runtime-node`, `@agentguard/rules`, `@agentguard/config`,
  `@agentguard/report`, and `@agentguard/cli`, all at version `0.1.0`.
- Each tarball file list passed the allowlist: `package.json`, package-local
  README, MIT LICENSE, and `dist/**` only. No `src`, tests, fixtures,
  coverage, development TypeScript config, temporary, or unrelated tooling
  files were present.
- Each packed manifest passed ESM metadata and root export checks for
  `./dist/index.js` and `./dist/index.d.ts`; the CLI additionally contained
  `./dist/main.js` and its `agentguard` bin pointed there.
- Packed production metadata contained no `workspace:` specifiers; internal
  AgentGuard dependency ranges were materialized as `0.1.0`.
- A deliberately strict diagnostic using `npm pack` was rejected because it
  left `workspace:*` in production metadata. The final gate used the
  repository's approved pnpm pack path and revalidated the actual tarballs;
  this was not treated as an unverified package-manager assumption.

External packed-consumer validation:
- Fresh consumer: `C:\Users\fukan\AppData\Local\Temp\agentguard-pack-consumer-20260826-v5`.
- npm installed all seven packed artifacts successfully and `npm ls` showed a
  valid dependency tree with internal packages resolved at `0.1.0`.
- ESM root imports of all seven public packages passed.
- TypeScript declaration resolution passed with strict consumer compilation.
- The packed npm executable passed `agentguard --help` and
  `agentguard --version` (`0.1.0`).

Release boundary:
- `docs/release/v0.1-checklist.md` remains intentionally unchecked; this
  validation does not announce `v0.1.0 READY TO RELEASE`.
- No tag, GitHub Release, npm publish, changeset publish, production release
  workflow, NPM_TOKEN use, or other release write was performed.
- AG-720 is complete on the local validated source state. AG-721 is now the
  current task and must make any readiness decision only within its own task
  scope and the still-absent independent final release authorization.

### AG-721 DONE

Review date: `2026-08-26`

Decision:

```text
AgentGuard v0.1.0
STATUS: READY TO RELEASE
PUBLICATION: NOT AUTHORIZED / NOT PERFORMED
```

Reviewed source state:
- Reviewed revision: `5219ccbe604c5756cbe333572bf6eef633aee8a4` on `main`, with
  `origin/main` at the same revision when this review began.
- The source code tested by the final AG-719 hosted run is commit
  `ea32fac187ddf239e590208136c744460a286f45`; the subsequent `5219ccbe...`
  revision contains the recorded status update and no source-behavior change.
- Canonical repository: `Felyx-Fu/AgentGuard` —
  `https://github.com/Felyx-Fu/AgentGuard`.

Authoritative evidence reviewed:
- `00-READ-ME-FIRST.md`, `AGENTS.md`, `01-PROJECT-CHARTER.md`,
  `02-ARCHITECTURE.md`, `03-ENGINEERING-STANDARDS.md`,
  `05-SECURITY-AND-TRUST-BOUNDARIES.md`, `06-DEFINITION-OF-DONE.md`,
  `TASK-INDEX.md`, `tasks/P7-release-and-open-source.md`,
  `docs/release/v0.1-checklist.md`, and the complete preceding task record in
  this file.
- AG-719 hosted CI evidence: workflow `CI`, run `32935751675`, with
  `ubuntu-latest`, `windows-latest`, and `macos-latest` all PASS under Node
  24. The platform job URLs and exact hosted Node versions are recorded in
  the AG-719 section above.
- AG-720 release-candidate evidence: clean frozen-lockfile install, lint,
  typecheck, test, build, architecture check, examples, CLI, Action bundle,
  seven real pnpm-packed tarballs, packed manifest/file-list inspection, and
  clean external npm consumer validation are recorded in the AG-720 section
  above.
- Additional packed-manifest review of the AG-720 tarballs confirmed all seven
  canonical repository URLs, homepage/bugs URLs, and accurate
  `repository.directory` values:
  `packages/contracts`, `packages/core`, `packages/runtime-node`,
  `packages/rules`, `packages/config`, `packages/report`, and `packages/cli`.
- Review-host tool versions were Node `v25.9.0`, pnpm `10.30.3`, npm
  `11.12.1`, and Git `2.45.1.windows.1`. The Node 25 host was not used as
  supported-runtime release evidence; the Node 24 hosted matrix is the
  supported-runtime evidence.

Release-level review result:
- Source quality requirements are satisfied by the final local quality gate:
  lint, typecheck, tests, build, and architecture validation all passed.
- Supported-runtime and platform requirements are satisfied by the recorded
  Node 24 hosted matrix on Linux, Windows, and macOS.
- Product requirements are supported by the completed P0-P6 task evidence:
  Node project detection, Git diff analysis, verifier flow, the normative
  deterministic Risk Model, five built-in rules, evidence/reporting, CLI, and
  GitHub Action adapters.
- Documentation requirements are satisfied by the English and Chinese
  READMEs, architecture/config/evidence/rule/report/exit-code/Risk Model
  documentation, reproducible examples, and the new validated release note
  at `docs/release/v0.1.0.md`.
- Distribution requirements are satisfied by the seven actual pnpm-packed
  artifacts and the external consumer checks. No source-tree-only package
  claim was used.
- Security and release-boundary review found no known critical v0.1 issue:
  JSON configuration remains data, shell-free argument-array execution and
  output bounds are preserved, core/domain Node imports and `console.log`
  remain absent, and no LLM/network scoring or undocumented Risk Score
  behavior was introduced.
- `docs/release/v0.1-checklist.md` now marks evidence-backed readiness items
  complete and keeps npm publication, release tag, GitHub Release, and
  production release workflow items explicitly unchecked.

Known non-blocking limitations:
- `scripts/check-package-boundaries.ts` remains the documented placeholder and
  reports that deep public-import validation is deferred. The existing
  authoritative release-level DoD does not require implementing that analyzer
  for v0.1, and no deep-validation PASS is claimed.
- The local host is Node `25.9.0`, outside `>=24 <25`; this is not a release
  blocker because real Node 24 hosted evidence exists.
- The GitHub Action bundle and adapter behavior were validated through source,
  tests, artifact loading, and workflow structure. No live third-party Action
  execution is claimed.

Release boundary:
- Publication has not occurred. No npm publish, Changesets publish, NPM_TOKEN
  use, tag creation, GitHub Release, release workflow execution, release PR,
  or registry write was performed.
- `READY TO RELEASE` is a readiness decision only. Actual release still
  requires separate explicit user authorization.
- AG-721 is complete. Stop here and wait for that separate authorization.

### DiffSentry namespace migration — FINAL RC BLOCKED

Review date: `2026-08-26`

Authoritative migration decision:
- The current product identity is `DiffSentry`, positioned as deterministic,
  local-first verification for code changes. Architecture, security/trust
  boundaries, verifier semantics, rule semantics, evidence model, and the
  normative v0.1 Risk Model are unchanged.
- Canonical repository migration is authorized and has been completed as a
  history-preserving GitHub rename from `Felyx-Fu/AgentGuard` to
  `Felyx-Fu/DiffSentry`. The default branch remains `main`; `origin` now uses
  `https://github.com/Felyx-Fu/DiffSentry.git`.
- The seven public package targets are now the controlled `@felyx-fu` names:
  `diffsentry`, `diffsentry-contracts`, `diffsentry-core`,
  `diffsentry-runtime-node`, `diffsentry-rules`, `diffsentry-config`, and
  `diffsentry-report`. The GitHub Action is
  `@felyx-fu/diffsentry-github-action`, remains `private: true`, and is not a
  public npm package.
- Current production source, package manifests, examples, current normative
  docs, templates, and workflow metadata have no unintended old
  `@agentguard/*`, `AgentGuard`, `agentguard`, or old repository references.
  Historical task/status/ADR evidence retains old identity where it explains
  prior work or migration history.

Local migration validation:
- Frozen install, lint, typecheck, test, build, direct strict TypeScript
  projects, architecture validation, and the existing package-boundary
  placeholder all passed on the local Node `v25.9.0` host; the required engine
  policy remains `>=24 <25`.
- Fresh hosted DiffSentry CI passed on the same source revision
  `77a03750c933daf62e044c6c3a4d58fe041883a5`:
  [workflow run 32942313365](https://github.com/Felyx-Fu/DiffSentry/actions/runs/32942313365).
  The workflow was `CI`; all three jobs passed every configured quality step:
  frozen-lockfile install, lint, typecheck, test, and build.
  `ubuntu-latest` Node `v24.19.0` passed in job
  [98095652724](https://github.com/Felyx-Fu/DiffSentry/actions/runs/32942313365/job/98095652724),
  `windows-latest` Node `v24.19.0` passed in job
  [98095652798](https://github.com/Felyx-Fu/DiffSentry/actions/runs/32942313365/job/98095652798),
  and `macos-latest` Node `v24.18.0` passed in job
  [98095652512](https://github.com/Felyx-Fu/DiffSentry/actions/runs/32942313365/job/98095652512).
- The migration regression suite passed: package names and metadata, internal
  dependency names, ESM exports, CLI bin/version identity, private Action
  metadata, current product text, and absence of old production references.
- Fresh DiffSentry package artifacts were generated under
  `C:\Users\fukan\AppData\Local\Temp\diffsentry-pack-artifacts-20260826-v4`.
  All seven tarballs passed file-list, manifest, ESM entry, declaration,
  internal dependency materialization, and no-old-identity checks. The private
  Action bundle was rebuilt and loaded with its expected exports; no bare old
  or new workspace imports remain in the bundle.
- Fresh packed consumer:
  `C:\Users\fukan\AppData\Local\Temp\diffsentry-pack-consumer-20260826-v2`.
  All seven new tarballs installed successfully, `npm ls` resolved the graph,
  representative ESM imports passed, and strict TypeScript declaration
  resolution passed. Packed `diffsentry --help` and `--version` passed, with
  version `0.1.0`.
- The existing top-level CLI dispatcher still rejects `diffsentry check` with
  its usage error, exactly as the pre-migration `agentguard check` path did;
  the migration did not add or remove CLI semantics. The packed consumer
  smoke therefore exited `1` with `Unknown command or option. Use
  \`diffsentry --help\`.`, and this is not claimed as a successful full
  executable check flow.

Final RC decision:
- `BLOCKED` — the authoritative migration protocol lists `diffsentry check`
  as a required smoke command, but the existing top-level dispatcher does not
  implement that flow. Implementing it would be a CLI behavior/integration
  change beyond the authorized name-only migration and the previously
  recorded deferred AG-517 integration boundary. No dispatcher implementation
  was added, no gate was weakened, and the exact failure remains visible for a
  separately authorized CLI integration task.

npm and release boundaries:
- Read-only npm preflight used `https://registry.npmjs.org/`. All seven new
  names returned E404 (not currently published/visible). `npm whoami` and
  `npm access list packages` returned ENEEDAUTH, so authenticated scope
  ownership/publishability could not be proven on this machine and is not
  claimed.
- `@changesets/cli` remains `3.0.1`; the release workflow now uses the
  official `changesets/action@v2` input names. A checked-in empty changeset
  records that this namespace migration does not bump package versions.
- No npm publish, Changesets publish, NPM_TOKEN use, tag, GitHub Release,
  release workflow execution, release PR, or formal `RELEASED` claim has been
  made. Fresh hosted DiffSentry CI is PASS, but the final RC remains BLOCKED
  by the required top-level CLI `check` smoke limitation; npm auth remains an
  independently recorded preflight limitation.

## Notes

This file is updated by Codex after every completed or blocked task.
