# P3 — Core Engine

## Phase objective

Complete this phase in task-ID order unless dependencies clearly allow safe parallel work.

## Phase rule

Do not begin the next phase merely because a few later tasks appear easy. Phase boundaries exist to keep Codex from implementing integrations before foundations are stable.

## Tasks

### AG-300 — Create CheckRepository use-case shell

**Depends on:** AG-224

**Goal:** Create the application entry point with injected ports and no behavior yet.

**Allowed scope:** packages/core/src/application

**Must not:** Do not implement every pipeline step.

**Acceptance:**
- Use-case can be constructed with test doubles.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-301 — Detect package.json presence

**Depends on:** AG-300

**Goal:** Identify Node project candidate through FileSystemPort.

**Allowed scope:** packages/core/src/domain/project

**Must not:** Do not read lockfiles yet.

**Acceptance:**
- Tests cover Node/non-Node paths.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-302 — Detect Node ecosystem

**Depends on:** AG-301

**Goal:** Map package.json presence to Node ecosystem.

**Allowed scope:** core project domain

**Must not:** Do not infer frameworks.

**Acceptance:**
- ProjectContext ecosystem is correct.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-303 — Detect pnpm

**Depends on:** AG-301

**Goal:** Detect pnpm from lockfile/package metadata.

**Allowed scope:** core project domain

**Must not:** Do not run pnpm.

**Acceptance:**
- Tests cover positive/negative cases.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-304 — Detect npm

**Depends on:** AG-301

**Goal:** Detect npm from lockfile/package metadata.

**Allowed scope:** core project domain

**Must not:** Do not execute npm.

**Acceptance:**
- Tests cover positive/negative cases.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-305 — Detect yarn

**Depends on:** AG-301

**Goal:** Detect Yarn from lockfile/package metadata.

**Allowed scope:** core project domain

**Must not:** No Yarn version management.

**Acceptance:**
- Tests cover positive/negative cases.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-306 — Detect bun

**Depends on:** AG-301

**Goal:** Detect Bun from lockfile/package metadata.

**Allowed scope:** core project domain

**Must not:** No Bun execution behavior.

**Acceptance:**
- Tests cover positive/negative cases.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-307 — Define package-manager precedence

**Depends on:** AG-303 through AG-306

**Goal:** Resolve ambiguous/multiple lockfile cases deterministically.

**Allowed scope:** core project domain

**Must not:** Do not silently pick randomly.

**Acceptance:**
- Ambiguous cases have documented deterministic behavior.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-308 — Detect TypeScript

**Depends on:** AG-301

**Goal:** Detect tsconfig/TypeScript dependency signals.

**Allowed scope:** core project domain

**Must not:** Do not invoke tsc.

**Acceptance:**
- Tests cover TS and JS projects.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-309 — Read package scripts

**Depends on:** AG-301

**Goal:** Parse known package scripts from package.json data.

**Allowed scope:** core project domain

**Must not:** Do not execute scripts.

**Acceptance:**
- test/lint/typecheck/build script names are available semantically.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-310 — Detect test intent

**Depends on:** AG-309

**Goal:** Infer available test verification intent.

**Allowed scope:** core project domain

**Must not:** Do not support arbitrary script selection.

**Acceptance:**
- Tests cover script present/absent.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-311 — Detect lint intent

**Depends on:** AG-309

**Goal:** Infer lint verification intent.

**Allowed scope:** core project domain

**Must not:** No lint execution yet.

**Acceptance:**
- Tests cover script present/absent.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-312 — Detect typecheck intent

**Depends on:** AG-308, AG-309

**Goal:** Infer explicit or safe TypeScript typecheck intent.

**Allowed scope:** core project domain

**Must not:** Do not invent unsafe commands.

**Acceptance:**
- Detection is deterministic.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-313 — Detect build intent

**Depends on:** AG-309

**Goal:** Infer build verification intent.

**Allowed scope:** core project domain

**Must not:** Build remains disabled by default config.

**Acceptance:**
- Detection is tested.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-314 — Assemble ProjectContext

**Depends on:** AG-302 through AG-313

**Goal:** Combine project detectors into contract output.

**Allowed scope:** core project domain

**Must not:** Do not include verifier results.

**Acceptance:**
- ProjectContext represents project facts.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-315 — Parse Git diff changed files

**Depends on:** AG-208, AG-224

**Goal:** Transform raw diff into changed-file records.

**Allowed scope:** core change domain

**Must not:** Do not classify file categories yet.

**Acceptance:**
- Added/modified/deleted/renamed cases are tested.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-316 — Capture additions/deletions

**Depends on:** AG-315

**Goal:** Populate line statistics from diff metadata.

**Allowed scope:** core change domain

**Must not:** Do not score risk.

**Acceptance:**
- Stats are correct for fixture diffs.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-317 — Classify source files

**Depends on:** AG-315

**Goal:** Classify JS/TS implementation paths as source where appropriate.

**Allowed scope:** core change domain

**Must not:** Do not create rule findings.

**Acceptance:**
- Classifier tests cover edge paths.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-318 — Classify test files

**Depends on:** AG-315

**Goal:** Recognize common JS/TS test naming/location patterns.

**Allowed scope:** core change domain

**Must not:** Do not infer semantic test coverage.

**Acceptance:**
- Classifier is deterministic.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-319 — Classify dependency files

**Depends on:** AG-315

**Goal:** Recognize package manifests and supported lockfiles.

**Allowed scope:** core change domain

**Must not:** Do not diff dependencies yet.

**Acceptance:**
- Dependency file paths classify correctly.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-320 — Classify CI files

**Depends on:** AG-315

**Goal:** Recognize GitHub workflow paths.

**Allowed scope:** core change domain

**Must not:** No workflow permission parsing yet.

**Acceptance:**
- CI classification tests pass.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-321 — Classify config/docs/unknown

**Depends on:** AG-315

**Goal:** Complete remaining v0.1 file categories.

**Allowed scope:** core change domain

**Must not:** Do not add dozens of categories.

**Acceptance:**
- Classification exhaustively returns a category.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-322 — Assemble ChangeSet

**Depends on:** AG-316 through AG-321

**Goal:** Create normalized ChangeSet from refs and parsed/classified files.

**Allowed scope:** core change domain

**Must not:** No rule evaluation.

**Acceptance:**
- ChangeSet tests use real fixture diffs.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-323 — Define Verifier interface

**Depends on:** AG-119

**Goal:** Define verifier id/support/run behavior.

**Allowed scope:** packages/core/src/ports/verifier.ts

**Must not:** Do not implement process calls in core.

**Acceptance:**
- Interface is small and composable.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-324 — Implement verification planner

**Depends on:** AG-314, AG-323

**Goal:** Select available test/lint/typecheck/build intents according to project/config.

**Allowed scope:** core verification domain

**Must not:** Do not execute commands.

**Acceptance:**
- Planner output is deterministic and tested.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-325 — Implement package-manager command resolver

**Depends on:** AG-307, AG-324

**Goal:** Map verification intents to safe executable + args.

**Allowed scope:** core verification domain

**Must not:** No shell strings.

**Acceptance:**
- Resolvers are tested for npm/pnpm/yarn/bun.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-326 — Implement verifier execution coordinator

**Depends on:** AG-211, AG-325

**Goal:** Execute planned verifiers through ProcessRunner and collect results.

**Allowed scope:** core verification domain/application

**Must not:** Do not render output.

**Acceptance:**
- Passed/failed/error/skipped states are tested.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-327 — Implement severity weights

**Depends on:** AG-107

**Goal:** Map severity to fixed numeric weights.

**Allowed scope:** core risk domain

**Must not:** No configuration override yet.

**Acceptance:**
- Weights match product spec.
- Normative weights are `info = 0`, `low = 5`, `medium = 15`, `high = 30`, and `critical = 50`.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-328 — Implement verification penalties

**Depends on:** AG-111, AG-327

**Goal:** Apply deterministic penalties for failed verification types.

**Allowed scope:** core risk domain

**Must not:** Do not use AI confidence.

**Acceptance:**
- Penalty tests cover each verifier.
- Normative penalties are: test/typecheck/build `passed = 0`, `skipped = 0`, `error = 30`, `failed = 50`; lint `passed = 0`, `skipped = 0`, `error = 10`, `failed = 15`.
- A verification result with status `error` is scored; AgentGuard internal errors are not scored.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-329 — Implement risk score aggregation

**Depends on:** AG-109, AG-328

**Goal:** Combine findings and verification penalties with 0–100 cap.

**Allowed scope:** core risk domain

**Must not:** Do not render verdict text.

**Acceptance:**
- Score tests cover boundaries.
- Use `FindingScore + VerificationScore`, cap the result at 100, and do not use finding confidence.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-330 — Implement verdict thresholds

**Depends on:** AG-114, AG-329

**Goal:** Map score to pass/review/fail using config thresholds.

**Allowed scope:** core risk domain

**Must not:** Do not hard-code if config supplied.

**Acceptance:**
- Boundary cases are tested.
- Default thresholds are `review = 15` and `fail = 50`; validate `0 <= review < fail <= 100`.
- Map `< review` to `PASS`, `review <= score < fail` to `REVIEW`, and `>= fail` to `FAIL`.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-331 — Assemble AgentGuardReport

**Depends on:** AG-113, AG-314, AG-322, AG-326, AG-329, AG-330

**Goal:** Build final report contract from project/change/findings/verifications/score/verdict.

**Allowed scope:** core application

**Must not:** Do not render terminal output.

**Acceptance:**
- Report is complete and schema-versioned.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-332 — Add determinism integration test

**Depends on:** AG-331

**Goal:** Prove identical repository/config inputs yield identical report semantics.

**Allowed scope:** tests/integration/core

**Must not:** Ignore expected duration/timestamp nondeterminism or normalize it explicitly.

**Acceptance:**
- Repeated runs produce stable findings/score/verdict.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-333 — Verify P3 core phase

**Depends on:** AG-300 through AG-332

**Goal:** Run full quality gate and inspect architecture boundaries.

**Allowed scope:** P3 files only

**Must not:** Do not add built-in rules yet.

**Acceptance:**
- Core pipeline works with zero/placeholder rules.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.
