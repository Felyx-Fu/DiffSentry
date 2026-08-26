# P4 — Rules

## Phase objective

Complete this phase in task-ID order unless dependencies clearly allow safe parallel work.

## Phase rule

Do not begin the next phase merely because a few later tasks appear easy. Phase boundaries exist to keep Codex from implementing integrations before foundations are stable.

## Tasks

### AG-400 — Define Rule port

**Depends on:** AG-333

**Goal:** Define metadata and check contract for deterministic rules.

**Allowed scope:** packages/core/src/ports/rule.ts

**Must not:** Do not implement registry yet.

**Acceptance:**
- Rule interface can return Finding[].
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-401 — Define rule metadata model

**Depends on:** AG-400

**Goal:** Standardize id/name/description/category/default severity.

**Allowed scope:** packages/rules and contracts if required

**Must not:** Do not add localization system.

**Acceptance:**
- Metadata is validated by tests.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-402 — Implement built-in rule registry

**Depends on:** AG-401

**Goal:** Create deterministic built-in rule registration.

**Allowed scope:** packages/rules/src/registry.ts

**Must not:** No dynamic code loading.

**Acceptance:**
- Registry returns stable ordered rules.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-403 — Implement rule execution coordinator

**Depends on:** AG-400, AG-402

**Goal:** Run enabled rules, isolate rule failures, aggregate findings.

**Allowed scope:** core application/rule domain

**Must not:** A single rule error must not crash unrelated rules.

**Acceptance:**
- Failure isolation is tested.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-404 — Implement rule enable/disable config

**Depends on:** AG-114, AG-403

**Goal:** Apply config enable/disable state.

**Allowed scope:** core rule selection/config integration

**Must not:** Do not support remote policies.

**Acceptance:**
- Disabled rule does not execute.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-405 — Implement severity override config

**Depends on:** AG-114, AG-403

**Goal:** Allow configured severity override for known rules.

**Allowed scope:** core rule policy

**Must not:** Do not mutate rule metadata globally.

**Acceptance:**
- Overrides affect findings deterministically.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-406 — Secret rule metadata

**Depends on:** AG-401

**Goal:** Define `security.secret-exposure` metadata.

**Allowed scope:** packages/rules/src/security

**Must not:** Do not detect secrets yet.

**Acceptance:**
- Stable ID and critical default severity exist.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-407 — Secret rule detector

**Depends on:** AG-406

**Goal:** Detect a minimal documented set of high-signal secret patterns.

**Allowed scope:** packages/rules/src/security

**Must not:** Do not become a full secret-scanning product.

**Acceptance:**
- Positive/negative detector tests pass.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-408 — Secret evidence redaction

**Depends on:** AG-407

**Goal:** Ensure secret findings never emit full secret material.

**Allowed scope:** secret rule

**Must not:** Do not include raw matched value in reports.

**Acceptance:**
- Evidence contains location/type but redacted value.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-409 — Secret rule fixtures and registration

**Depends on:** AG-407, AG-408, AG-402

**Goal:** Add fixtures and register rule.

**Allowed scope:** tests/fixtures and rule registry

**Must not:** No extra rules.

**Acceptance:**
- Positive and negative end-to-end cases pass.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-410 — Source-without-tests metadata

**Depends on:** AG-401

**Goal:** Define `testing.source-without-tests`.

**Allowed scope:** packages/rules/src/testing

**Must not:** No detection yet.

**Acceptance:**
- Stable metadata exists.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-411 — Source-without-tests detection

**Depends on:** AG-410, AG-322

**Goal:** Find source changes with no test file change in the change set.

**Allowed scope:** testing rule

**Must not:** Do not claim semantic test coverage.

**Acceptance:**
- Positive/negative tests reflect only changed-file evidence.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-412 — Source-without-tests evidence

**Depends on:** AG-411

**Goal:** Attach changed source/test-change evidence.

**Allowed scope:** testing rule

**Must not:** No opinion-only message.

**Acceptance:**
- Evidence is explainable.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-413 — Source-without-tests fixtures and registration

**Depends on:** AG-411, AG-412, AG-402

**Goal:** Add fixtures and register rule.

**Allowed scope:** fixtures/registry

**Must not:** No unrelated classifiers.

**Acceptance:**
- End-to-end rule tests pass.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-414 — Auth-without-tests metadata

**Depends on:** AG-401

**Goal:** Define `testing.auth-without-tests`.

**Allowed scope:** packages/rules/src/testing

**Must not:** No path matching yet.

**Acceptance:**
- Stable metadata exists.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-415 — Auth path matcher

**Depends on:** AG-414

**Goal:** Define conservative auth-related path matching.

**Allowed scope:** auth rule

**Must not:** Do not inspect semantic AST in v0.1.

**Acceptance:**
- Matcher tests avoid obvious false positives.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-416 — Auth-related test matcher

**Depends on:** AG-415

**Goal:** Define related test path heuristic.

**Allowed scope:** auth rule

**Must not:** Do not claim true coverage.

**Acceptance:**
- Heuristic behavior is documented/tested.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-417 — Auth-without-tests finding and evidence

**Depends on:** AG-415, AG-416, AG-322

**Goal:** Emit finding when auth change lacks related changed tests.

**Allowed scope:** auth rule

**Must not:** No AI interpretation.

**Acceptance:**
- Finding includes paths and absence evidence.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-418 — Auth rule fixtures and registration

**Depends on:** AG-417, AG-402

**Goal:** Add positive/negative fixtures and registry entry.

**Allowed scope:** fixtures/registry

**Must not:** No extra auth analysis.

**Acceptance:**
- End-to-end tests pass.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-419 — Runtime dependency rule metadata

**Depends on:** AG-401

**Goal:** Define `dependency.runtime-dependency-added`.

**Allowed scope:** packages/rules/src/dependency

**Must not:** No manifest diff logic yet.

**Acceptance:**
- Stable metadata exists.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-420 — Parse package dependency delta

**Depends on:** AG-419, GitProvider support available

**Goal:** Compare package.json before/after for dependencies additions.

**Allowed scope:** dependency rule

**Must not:** Do not query registries/network.

**Acceptance:**
- Tests cover add/remove/devDependency cases.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-421 — Runtime dependency finding/evidence

**Depends on:** AG-420

**Goal:** Emit finding only for runtime dependency additions.

**Allowed scope:** dependency rule

**Must not:** Do not classify package reputation.

**Acceptance:**
- Evidence names dependency without network lookup.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-422 — Dependency fixtures and registration

**Depends on:** AG-421, AG-402

**Goal:** Add fixtures and registry entry.

**Allowed scope:** fixtures/registry

**Must not:** No vulnerability scanning.

**Acceptance:**
- End-to-end tests pass.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-423 — CI permission rule metadata

**Depends on:** AG-401

**Goal:** Define `ci.workflow-permission-change`.

**Allowed scope:** packages/rules/src/ci

**Must not:** No YAML parsing yet.

**Acceptance:**
- Stable metadata exists.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-424 — Detect workflow permission expansion

**Depends on:** AG-423

**Goal:** Compare workflow permission-related changes conservatively.

**Allowed scope:** ci rule

**Must not:** Do not execute workflow YAML.

**Acceptance:**
- Positive/negative parsing tests pass.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-425 — CI permission evidence

**Depends on:** AG-424

**Goal:** Attach workflow path and permission delta evidence.

**Allowed scope:** ci rule

**Must not:** Do not claim exploitability.

**Acceptance:**
- Evidence explains factual permission expansion.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-426 — CI permission fixtures and registration

**Depends on:** AG-425, AG-402

**Goal:** Add fixtures and register rule.

**Allowed scope:** fixtures/registry

**Must not:** No additional CI rules.

**Acceptance:**
- End-to-end tests pass.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-427 — Rule registry ordering test

**Depends on:** AG-409, AG-413, AG-418, AG-422, AG-426

**Goal:** Guarantee stable built-in rule execution/report ordering.

**Allowed scope:** rules tests

**Must not:** Do not sort by localized display text.

**Acceptance:**
- Ordering is deterministic.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-428 — Verify P4 rules phase

**Depends on:** AG-400 through AG-427

**Goal:** Run full suite and inspect all five rule evidence outputs.

**Allowed scope:** P4 files only

**Must not:** Do not start CLI rendering.

**Acceptance:**
- Five rules satisfy rule-level DoD.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.
