# P2 — Runtime

## Phase objective

Complete this phase in task-ID order unless dependencies clearly allow safe parallel work.

## Phase rule

Do not begin the next phase merely because a few later tasks appear easy. Phase boundaries exist to keep Codex from implementing integrations before foundations are stable.

## Tasks

### AG-200 — Define FileSystemPort

**Depends on:** AG-119

**Goal:** Define repository-scoped filesystem capabilities needed by core.

**Allowed scope:** packages/core/src/ports/file-system.ts

**Must not:** Do not implement Node filesystem.

**Acceptance:**
- Port is minimal and testable.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-201 — Implement NodeFileSystem.exists

**Depends on:** AG-200

**Goal:** Implement existence checks through Node adapter.

**Allowed scope:** packages/runtime-node/src/filesystem

**Must not:** Do not add globbing yet.

**Acceptance:**
- Tests cover existing and missing paths.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-202 — Implement NodeFileSystem.readText

**Depends on:** AG-200

**Goal:** Implement UTF-8 text reads with typed errors.

**Allowed scope:** packages/runtime-node/src/filesystem

**Must not:** Do not parse JSON here.

**Acceptance:**
- Tests cover normal and missing files.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-203 — Implement NodeFileSystem.findUp

**Depends on:** AG-201

**Goal:** Find a named file while walking toward filesystem root.

**Allowed scope:** packages/runtime-node/src/filesystem

**Must not:** Do not search unrelated subtrees.

**Acceptance:**
- Tests cover found/not-found/root termination.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-204 — Define GitProvider port

**Depends on:** AG-119

**Goal:** Define detect root/status/diff capabilities without Git implementation.

**Allowed scope:** packages/core/src/ports/git-provider.ts

**Must not:** Do not expose shell command strings.

**Acceptance:**
- Port models semantic Git operations.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-205 — Implement Git repository detection

**Depends on:** AG-204

**Goal:** Detect whether a path belongs to a Git worktree.

**Allowed scope:** packages/runtime-node/src/git

**Must not:** Do not parse diffs.

**Acceptance:**
- Tests cover Git and non-Git directories.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-206 — Implement Git repository root

**Depends on:** AG-205

**Goal:** Resolve canonical repository root.

**Allowed scope:** packages/runtime-node/src/git

**Must not:** Do not chdir globally.

**Acceptance:**
- Tests cover nested working directories.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-207 — Implement Git status retrieval

**Depends on:** AG-206

**Goal:** Return machine-usable repository status metadata.

**Allowed scope:** packages/runtime-node/src/git

**Must not:** Do not classify files into AgentGuard categories.

**Acceptance:**
- Tests cover clean and dirty repos.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-208 — Implement raw Git diff retrieval

**Depends on:** AG-206

**Goal:** Return raw diff text between explicit refs.

**Allowed scope:** packages/runtime-node/src/git

**Must not:** Do not parse the diff.

**Acceptance:**
- Valid/invalid refs and empty diff are tested.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-209 — Implement working-tree diff retrieval

**Depends on:** AG-208

**Goal:** Support comparison between HEAD and working tree for local checks.

**Allowed scope:** packages/runtime-node/src/git

**Must not:** Do not include untracked content unless explicitly modeled.

**Acceptance:**
- Tests cover modified working tree.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-210 — Create Git test fixture helper

**Depends on:** AG-205

**Goal:** Create temporary real repositories for adapter tests.

**Allowed scope:** runtime-node test utilities

**Must not:** Do not mock every Git behavior.

**Acceptance:**
- Tests can create commits and deterministic diffs.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-211 — Define ProcessRunner port

**Depends on:** AG-119

**Goal:** Define command, args, cwd, timeout, output limits, result.

**Allowed scope:** packages/core/src/ports/process-runner.ts

**Must not:** Do not expose shell scripts as one string.

**Acceptance:**
- Port requires argument arrays.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-212 — Implement shell-free process spawn

**Depends on:** AG-211

**Goal:** Implement Node process execution with `shell:false`.

**Allowed scope:** packages/runtime-node/src/process

**Must not:** Do not support shell mode.

**Acceptance:**
- Simple command execution is tested.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-213 — Implement process timeout

**Depends on:** AG-212

**Goal:** Terminate commands exceeding configured timeout.

**Allowed scope:** packages/runtime-node/src/process

**Must not:** Do not leave child processes running.

**Acceptance:**
- Timeout path is tested.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-214 — Implement stdout limit

**Depends on:** AG-212

**Goal:** Bound captured stdout and indicate truncation.

**Allowed scope:** packages/runtime-node/src/process

**Must not:** Do not buffer unlimited output.

**Acceptance:**
- Large-output test proves bounded capture.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-215 — Implement stderr limit

**Depends on:** AG-212

**Goal:** Bound captured stderr and indicate truncation.

**Allowed scope:** packages/runtime-node/src/process

**Must not:** Do not buffer unlimited output.

**Acceptance:**
- Large-error-output test proves bounded capture.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-216 — Capture exit code and duration

**Depends on:** AG-212

**Goal:** Return stable exit metadata for process execution.

**Allowed scope:** packages/runtime-node/src/process

**Must not:** Do not interpret exit code as verifier verdict here.

**Acceptance:**
- Success/failure/duration tests pass.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-217 — Normalize process errors

**Depends on:** AG-213, AG-216

**Goal:** Map spawn/timeout failures to typed runtime errors.

**Allowed scope:** runtime-node process adapter

**Must not:** Do not leak opaque Node errors as public API.

**Acceptance:**
- Expected failure categories are distinguishable.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-218 — Define Clock port

**Depends on:** AG-119

**Goal:** Define current-time capability for deterministic testing.

**Allowed scope:** packages/core/src/ports/clock.ts

**Must not:** Do not use Date.now directly in core.

**Acceptance:**
- Port is exported.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-219 — Implement SystemClock adapter

**Depends on:** AG-218

**Goal:** Provide Node/system implementation of Clock.

**Allowed scope:** packages/runtime-node/src/clock

**Must not:** No business logic.

**Acceptance:**
- Clock adapter passes unit tests.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-220 — Implement environment adapter

**Depends on:** AG-119

**Goal:** Expose only environment facts required by composition/runtime.

**Allowed scope:** packages/runtime-node/src/environment

**Must not:** Do not dump all env vars into reports.

**Acceptance:**
- Adapter exposes a deliberately small API.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-221 — Create runtime public API

**Depends on:** AG-201 through AG-220

**Goal:** Export intended adapters from runtime-node root.

**Allowed scope:** packages/runtime-node/src/index.ts

**Must not:** No deep internal exports.

**Acceptance:**
- CLI can later compose runtime via package root.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-222 — Enforce core/runtime boundary

**Depends on:** AG-200, AG-019

**Goal:** Make architecture checks reject node:* imports from core.

**Allowed scope:** scripts/check-architecture.ts

**Must not:** Do not enforce undocumented rules.

**Acceptance:**
- A deliberate violation causes check failure.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-223 — Add runtime integration tests

**Depends on:** AG-221

**Goal:** Exercise filesystem/Git/process adapters together in temporary repo.

**Allowed scope:** tests/integration/runtime

**Must not:** Do not test core behavior.

**Acceptance:**
- Integration suite works cross-platform.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-224 — Verify P2 runtime phase

**Depends on:** AG-200 through AG-223

**Goal:** Run full quality gate on Windows-compatible implementation.

**Allowed scope:** P2 files only

**Must not:** Do not begin P3 project logic.

**Acceptance:**
- Runtime phase passes tests and security constraints.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.
