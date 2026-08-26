# Atomic Task Template

Use this template only when a future task must be added deliberately.

## AG-XXX — Title

**Depends on:** AG-YYY

**Goal:** One observable outcome.

**Allowed scope:**
- exact package/directory;
- exact responsibility.

**Must not:**
- later-phase features;
- unrelated refactors;
- new dependencies unless explicitly justified.

**Implementation notes:**
- only notes required to preserve architecture/safety.

**Tests:**
- positive case;
- negative/error case;
- regression case when relevant.

**Acceptance:**
- expected behavior is demonstrated;
- affected tests pass;
- affected typecheck/lint pass;
- no architecture violation;
- `STATUS.md` updated.
