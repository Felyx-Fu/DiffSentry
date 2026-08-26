# P6 — GitHub Action

## Phase objective

Complete this phase in task-ID order unless dependencies clearly allow safe parallel work.

## Phase rule

Do not begin the next phase merely because a few later tasks appear easy. Phase boundaries exist to keep Codex from implementing integrations before foundations are stable.

## Tasks

### AG-600 — Define GitHub Action inputs

**Depends on:** AG-523

**Goal:** Specify base/head/config/format/fail behavior inputs.

**Allowed scope:** apps/github-action/action.yml

**Must not:** Do not request write permission.

**Acceptance:**
- Action metadata is valid.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-601 — Read GitHub event context

**Depends on:** AG-600

**Goal:** Extract supported PR/push context safely.

**Allowed scope:** apps/github-action/src

**Must not:** Do not implement API calls unnecessarily.

**Acceptance:**
- PR and push fixture contexts are tested.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-602 — Resolve PR base SHA

**Depends on:** AG-601

**Goal:** Derive explicit base commit for pull requests.

**Allowed scope:** github-action app

**Must not:** No shell interpolation.

**Acceptance:**
- Base resolution tests pass.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-603 — Resolve PR head SHA

**Depends on:** AG-601

**Goal:** Derive explicit head commit for pull requests.

**Allowed scope:** github-action app

**Must not:** No mutation of repository.

**Acceptance:**
- Head resolution tests pass.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-604 — Compose AgentGuard inside action

**Depends on:** AG-507, AG-603

**Goal:** Reuse CLI/core composition concepts with action-specific inputs.

**Allowed scope:** github-action app

**Must not:** Do not reimplement rule/core logic.

**Acceptance:**
- Action invokes same core pipeline.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-605 — Run check in action

**Depends on:** AG-604

**Goal:** Execute check and obtain report/verdict.

**Allowed scope:** github-action app

**Must not:** Do not render via console-only logic.

**Acceptance:**
- Action test harness receives structured result.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-606 — Publish job summary Markdown

**Depends on:** AG-515, AG-605

**Goal:** Write report summary to GitHub step summary.

**Allowed scope:** github-action app

**Must not:** No PR comment yet.

**Acceptance:**
- Summary contains verdict/findings/evidence.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-607 — Expose action outputs

**Depends on:** AG-605

**Goal:** Expose risk score and verdict as action outputs.

**Allowed scope:** action metadata/app

**Must not:** Do not expose secrets/raw sensitive evidence.

**Acceptance:**
- Outputs are documented/tested.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-608 — Map action status behavior

**Depends on:** AG-605

**Goal:** Map verdict to configurable success/failure behavior.

**Allowed scope:** github-action app

**Must not:** Do not alter core exit semantics.

**Acceptance:**
- Pass/review/fail behavior is tested.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-609 — Add annotations for findings

**Depends on:** AG-605

**Goal:** Create GitHub annotations where location exists.

**Allowed scope:** github-action app

**Must not:** Do not fabricate line locations.

**Acceptance:**
- Only valid locations become annotations.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-610 — Keep default permissions read-only

**Depends on:** AG-600

**Goal:** Document and enforce least-privilege default action permissions.

**Allowed scope:** action docs/examples

**Must not:** Do not require pull-requests:write by default.

**Acceptance:**
- Example workflow is read-only.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-611 — Create GitHub Action example

**Depends on:** AG-608, AG-610

**Goal:** Add a copy-paste workflow example.

**Allowed scope:** examples/github-action and related docs

**Must not:** Do not include unpublished version references without note.

**Acceptance:**
- Example accurately reflects action inputs.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-612 — Add action integration test

**Depends on:** AG-609

**Goal:** Exercise action with representative PR context.

**Allowed scope:** github-action tests

**Must not:** Do not rely on live GitHub API.

**Acceptance:**
- Test is deterministic.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-613 — Bundle action distribution artifact

**Depends on:** AG-612

**Goal:** Produce action-compatible bundled JS if required.

**Allowed scope:** github-action build tooling

**Must not:** Do not bundle unrelated workspace packages blindly.

**Acceptance:**
- Build artifact runs in GitHub Action environment.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-614 — Add dogfood workflow

**Depends on:** AG-613

**Goal:** Run AgentGuard against its own pull requests where feasible.

**Allowed scope:** .github/workflows/dogfood.yml

**Must not:** Do not make repository unusable on initial rollout.

**Acceptance:**
- Workflow is initially conservative and documented.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-615 — Verify P6 GitHub Action phase

**Depends on:** AG-600 through AG-614

**Goal:** Run full quality gate and validate example workflow structure.

**Allowed scope:** P6 files only

**Must not:** Do not add SaaS integration.

**Acceptance:**
- GitHub Action reuses core and remains least privilege.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.
