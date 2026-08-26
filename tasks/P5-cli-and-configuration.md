# P5 — CLI & Configuration

## Phase objective

Complete this phase in task-ID order unless dependencies clearly allow safe parallel work.

## Phase rule

Do not begin the next phase merely because a few later tasks appear easy. Phase boundaries exist to keep Codex from implementing integrations before foundations are stable.

## Tasks

### AG-500 — Create config JSON schema

**Depends on:** AG-428

**Goal:** Define v0.1 config schema for verification/rules/thresholds.

**Allowed scope:** packages/config and schema file

**Must not:** Do not support executable config.

**Acceptance:**
- Valid/invalid examples are tested.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-501 — Implement default config

**Depends on:** AG-500

**Goal:** Provide deterministic built-in defaults.

**Allowed scope:** packages/config/src/defaults.ts

**Must not:** Do not read disk.

**Acceptance:**
- Defaults match project charter.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-502 — Implement config file discovery

**Depends on:** AG-203, AG-500

**Goal:** Find `agentguard.config.json` from repository root.

**Allowed scope:** packages/config/src/loader.ts

**Must not:** Do not search outside intended root hierarchy.

**Acceptance:**
- Present/absent config tests pass.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-503 — Implement config parsing

**Depends on:** AG-502

**Goal:** Parse JSON with typed configuration errors.

**Allowed scope:** config package

**Must not:** Do not evaluate JS/TS.

**Acceptance:**
- Malformed JSON produces clear error.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-504 — Implement config validation

**Depends on:** AG-503

**Goal:** Validate configuration against v0.1 schema.

**Allowed scope:** config package

**Must not:** Do not silently accept unknown critical shapes.

**Acceptance:**
- Valid/invalid config tests pass.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-505 — Implement config merge precedence

**Depends on:** AG-501, AG-504

**Goal:** Apply CLI > config > defaults precedence.

**Allowed scope:** config package/core composition

**Must not:** Do not mutate defaults.

**Acceptance:**
- Merge behavior is tested.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-506 — Create CLI executable

**Depends on:** AG-428

**Goal:** Create package bin entry and main command dispatch.

**Allowed scope:** packages/cli

**Must not:** Do not implement all commands.

**Acceptance:**
- `agentguard --help` can execute.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-507 — Create CLI composition root

**Depends on:** AG-221, AG-428, AG-505, AG-506

**Goal:** Wire runtime, rules, config, report dependencies.

**Allowed scope:** packages/cli/src/composition

**Must not:** Do not instantiate adapters inside core.

**Acceptance:**
- Composition constructs a runnable checker.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-508 — Implement check command basic flow

**Depends on:** AG-507, AG-331

**Goal:** Run AgentGuard against current repo/working tree.

**Allowed scope:** packages/cli/src/commands/check.ts

**Must not:** No GitHub-specific behavior.

**Acceptance:**
- Command returns structured outcome.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-509 — Add --base option

**Depends on:** AG-508

**Goal:** Allow explicit base ref.

**Allowed scope:** CLI check command

**Must not:** Do not accept shell fragments.

**Acceptance:**
- Ref is passed semantically to GitProvider.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-510 — Add --head option

**Depends on:** AG-509

**Goal:** Allow explicit head ref.

**Allowed scope:** CLI check command

**Must not:** No shell construction.

**Acceptance:**
- Base/head combination is tested.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-511 — Add --config option

**Depends on:** AG-508, AG-504

**Goal:** Allow explicit JSON config path.

**Allowed scope:** CLI/config integration

**Must not:** No JS config.

**Acceptance:**
- Custom valid/invalid paths are tested.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-512 — Add --format option

**Depends on:** AG-508

**Goal:** Select terminal/json/markdown report format.

**Allowed scope:** CLI argument layer

**Must not:** Do not implement renderers here.

**Acceptance:**
- Invalid format fails clearly.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-513 — Implement terminal renderer

**Depends on:** AG-113

**Goal:** Create concise human-readable report.

**Allowed scope:** packages/report/src/terminal

**Must not:** Do not calculate score in renderer.

**Acceptance:**
- Snapshot tests cover pass/review/fail.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-514 — Implement JSON renderer

**Depends on:** AG-113

**Goal:** Serialize stable machine-readable report.

**Allowed scope:** packages/report/src/json

**Must not:** Do not omit schema version.

**Acceptance:**
- JSON snapshot is stable.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-515 — Implement Markdown renderer

**Depends on:** AG-113

**Goal:** Create GitHub-friendly Markdown output.

**Allowed scope:** packages/report/src/markdown

**Must not:** No GitHub API calls.

**Acceptance:**
- Markdown snapshots cover findings/evidence.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-516 — Wire renderers to CLI

**Depends on:** AG-512, AG-513, AG-514, AG-515

**Goal:** Connect --format to report package.

**Allowed scope:** CLI/report packages

**Must not:** No duplicated rendering.

**Acceptance:**
- All three formats work end-to-end.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-517 — Implement CLI exit codes

**Depends on:** AG-508

**Goal:** Map pass=0, review=1, fail=2, internal error=3.

**Allowed scope:** CLI process boundary

**Must not:** Do not reuse verifier exit codes directly.

**Acceptance:**
- Exit-code integration tests pass.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-518 — Implement --ci mode

**Depends on:** AG-517

**Goal:** Provide CI-friendly defaults without changing core semantics.

**Allowed scope:** CLI command/options

**Must not:** Do not add GitHub-specific APIs.

**Acceptance:**
- CI mode behavior is documented/tested.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-519 — Implement init command

**Depends on:** AG-500, AG-506

**Goal:** Generate a minimal JSON config if absent.

**Allowed scope:** packages/cli/src/commands/init.ts

**Must not:** Do not overwrite existing config without explicit behavior.

**Acceptance:**
- Init creates valid schema-conforming config.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-520 — Implement explain command

**Depends on:** AG-402, AG-506

**Goal:** Explain a known finding/rule from local metadata.

**Allowed scope:** packages/cli/src/commands/explain.ts

**Must not:** Do not call network/LLM.

**Acceptance:**
- Known/unknown rule cases are tested.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-521 — Add help/version UX

**Depends on:** AG-506

**Goal:** Provide useful command help and package version.

**Allowed scope:** CLI

**Must not:** No marketing bloat.

**Acceptance:**
- Help lists only supported commands/options.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-522 — Add CLI end-to-end fixture test

**Depends on:** AG-516 through AG-521

**Goal:** Run built CLI against fixture repository.

**Allowed scope:** tests/e2e

**Must not:** Do not mock the full CLI stack.

**Acceptance:**
- Output and exit code match expected verdict.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-523 — Verify P5 CLI phase

**Depends on:** AG-500 through AG-522

**Goal:** Run full quality gate and manually inspect one-command UX.

**Allowed scope:** P5 files only

**Must not:** Do not start GitHub Action.

**Acceptance:**
- `npx`/package-local equivalent check experience is coherent.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.
