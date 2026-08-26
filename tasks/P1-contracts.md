# P1 — Contracts

## Phase objective

Complete this phase in task-ID order unless dependencies clearly allow safe parallel work.

## Phase rule

Do not begin the next phase merely because a few later tasks appear easy. Phase boundaries exist to keep Codex from implementing integrations before foundations are stable.

## Tasks

### AG-100 — Define Ecosystem contract

**Depends on:** AG-024

**Goal:** Create the supported ecosystem type with Node and unknown states.

**Allowed scope:** packages/contracts/src/project.ts

**Must not:** Do not implement project detection.

**Acceptance:**
- Type compiles and is exported.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-101 — Define PackageManager contract

**Depends on:** AG-100

**Goal:** Create npm/pnpm/yarn/bun package manager type.

**Allowed scope:** packages/contracts/src/project.ts

**Must not:** Do not detect lockfiles.

**Acceptance:**
- Type is explicit and exported.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-102 — Define ProjectContext

**Depends on:** AG-100, AG-101

**Goal:** Define repository root, ecosystem, package manager, languages, and frameworks fields.

**Allowed scope:** packages/contracts/src/project.ts

**Must not:** No Node APIs or detection logic.

**Acceptance:**
- Contract supports v0.1 project metadata without runtime imports.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-103 — Define FileStatus

**Depends on:** AG-024

**Goal:** Define added/modified/deleted/renamed statuses.

**Allowed scope:** packages/contracts/src/change.ts

**Must not:** Do not parse Git.

**Acceptance:**
- Contract is exported.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-104 — Define FileCategory

**Depends on:** AG-103

**Goal:** Define source/test/config/dependency/documentation/ci/unknown categories.

**Allowed scope:** packages/contracts/src/change.ts

**Must not:** Do not add framework-specific categories.

**Acceptance:**
- Contract matches architecture spec.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-105 — Define ChangedFile

**Depends on:** AG-103, AG-104

**Goal:** Define path, status, additions, deletions, category.

**Allowed scope:** packages/contracts/src/change.ts

**Must not:** No diff parser behavior.

**Acceptance:**
- Contract can represent renamed/changed files.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-106 — Define ChangeSet

**Depends on:** AG-105

**Goal:** Define baseRef, headRef, and changed file list.

**Allowed scope:** packages/contracts/src/change.ts

**Must not:** Do not query Git.

**Acceptance:**
- Contract is exported.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-107 — Define Severity

**Depends on:** AG-024

**Goal:** Define info/low/medium/high/critical.

**Allowed scope:** packages/contracts/src/finding.ts

**Must not:** Do not attach weights here.

**Acceptance:**
- Type is exported.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-108 — Define Evidence

**Depends on:** AG-024

**Goal:** Create evidence model for textual facts and optional locations.

**Allowed scope:** packages/contracts/src/evidence.ts

**Must not:** Do not render evidence.

**Acceptance:**
- Evidence supports file/path and message details.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-109 — Define Finding

**Depends on:** AG-107, AG-108

**Goal:** Define ruleId, severity, title, message, evidence, confidence, optional location.

**Allowed scope:** packages/contracts/src/finding.ts

**Must not:** Do not calculate severity/score.

**Acceptance:**
- Finding expresses claim + evidence.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-110 — Define VerificationStatus

**Depends on:** AG-024

**Goal:** Create passed/failed/skipped/error states.

**Allowed scope:** packages/contracts/src/verification.ts

**Must not:** No verifier execution.

**Acceptance:**
- Type is exported.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-111 — Define VerificationResult

**Depends on:** AG-110

**Goal:** Define id, status, command metadata, duration, stdout/stderr summaries.

**Allowed scope:** packages/contracts/src/verification.ts

**Must not:** Do not expose unbounded output assumptions.

**Acceptance:**
- Contract supports all v0.1 verifier states.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-112 — Define Verdict

**Depends on:** AG-024

**Goal:** Create pass/review/fail verdict contract.

**Allowed scope:** packages/contracts/src/verdict.ts

**Must not:** Do not assign score thresholds here.

**Acceptance:**
- Type is exported.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-113 — Define AgentGuardReport

**Depends on:** AG-102, AG-106, AG-109, AG-111, AG-112

**Goal:** Aggregate version, project, changes, findings, verifications, risk score, verdict.

**Allowed scope:** packages/contracts/src/report.ts

**Must not:** No rendering behavior.

**Acceptance:**
- Report contract compiles and is exported.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-114 — Define configuration contracts

**Depends on:** AG-107

**Goal:** Define verification toggles, rule overrides, and thresholds DTOs.

**Allowed scope:** packages/contracts/src/config.ts

**Must not:** Do not load files.

**Acceptance:**
- Config contracts support v0.1 settings.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-115 — Add report schema version

**Depends on:** AG-113

**Goal:** Define a version field strategy for evidence/report compatibility.

**Allowed scope:** packages/contracts/src/report.ts

**Must not:** Do not implement migrations.

**Acceptance:**
- Current schema version is explicit.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-116 — Create contracts barrel exports

**Depends on:** AG-100 through AG-115

**Goal:** Expose only intended public contracts from package index.

**Allowed scope:** packages/contracts/src/index.ts

**Must not:** Do not deep-export internals.

**Acceptance:**
- Consumers can import all v0.1 contracts from package root.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-117 — Add contract type tests

**Depends on:** AG-116

**Goal:** Add compile/runtime shape tests where useful.

**Allowed scope:** packages/contracts tests

**Must not:** Do not over-test TypeScript itself.

**Acceptance:**
- Critical unions/constructors/guards are covered.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-118 — Prevent runtime dependencies in contracts

**Depends on:** AG-116, AG-019

**Goal:** Enforce contracts package remains dependency-light and runtime-agnostic.

**Allowed scope:** contracts package and architecture script

**Must not:** Do not add schema libraries here.

**Acceptance:**
- Architecture check rejects forbidden Node/internal adapter imports.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-119 — Verify P1 contracts phase

**Depends on:** AG-100 through AG-118

**Goal:** Run full quality gate and inspect public contract API.

**Allowed scope:** P1 files only

**Must not:** Do not begin runtime adapters.

**Acceptance:**
- All P1 acceptance checks pass and exports are intentional.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.
