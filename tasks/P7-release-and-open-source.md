# P7 — Release & Open Source

## Phase objective

Complete this phase in task-ID order unless dependencies clearly allow safe parallel work.

## Phase rule

Do not begin the next phase merely because a few later tasks appear easy. Phase boundaries exist to keep Codex from implementing integrations before foundations are stable.

## Tasks

### AG-700 — Create English README structure

**Depends on:** AG-523

**Goal:** Define problem, demo, quick start, features, principles, roadmap.

**Allowed scope:** README.md

**Must not:** Do not claim unsupported features.

**Acceptance:**
- README describes actual v0.1 behavior.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-701 — Write one-command quick start

**Depends on:** AG-700

**Goal:** Document installation/run/config in minimal steps.

**Allowed scope:** README.md

**Must not:** Do not require global install.

**Acceptance:**
- A new user can reach first check quickly.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-702 — Document sample output

**Depends on:** AG-513, AG-700

**Goal:** Add realistic terminal output matching current renderer.

**Allowed scope:** README.md

**Must not:** Do not fabricate commands/results.

**Acceptance:**
- Example matches tested output shape.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-703 — Create Chinese README

**Depends on:** AG-700

**Goal:** Provide accurate Simplified Chinese version.

**Allowed scope:** README.zh-CN.md

**Must not:** Do not diverge in feature claims.

**Acceptance:**
- Core sections mirror English README.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-704 — Document architecture

**Depends on:** AG-333

**Goal:** Create contributor-facing architecture overview from locked spec.

**Allowed scope:** docs/architecture

**Must not:** Do not duplicate implementation details unnecessarily.

**Acceptance:**
- Dependency direction and pipeline are clear.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-705 — Document configuration

**Depends on:** AG-505

**Goal:** Document every v0.1 config field and precedence.

**Allowed scope:** docs/specs/config.md

**Must not:** No undocumented config features.

**Acceptance:**
- Examples validate against schema.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-706 — Document evidence schema

**Depends on:** AG-331

**Goal:** Explain evidence/finding/report semantics.

**Allowed scope:** docs/specs/evidence.md

**Must not:** Do not promise stable forever without version caveat.

**Acceptance:**
- Schema versioning is explained.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-707 — Document rule authoring

**Depends on:** AG-428

**Goal:** Explain Rule contract, metadata, tests, evidence, registry.

**Allowed scope:** docs/specs/rule.md

**Must not:** Do not promise dynamic plugin loading in v0.1.

**Acceptance:**
- Contributor can add built-in rule correctly.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-708 — Document exit codes

**Depends on:** AG-517

**Goal:** Document CLI and CI meanings.

**Allowed scope:** docs/specs/exit-codes.md

**Must not:** No ambiguous codes.

**Acceptance:**
- 0/1/2/3 meanings are explicit.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-709 — Create basic example repository

**Depends on:** AG-523

**Goal:** Add minimal clean Node/TS example.

**Allowed scope:** examples/basic

**Must not:** Do not make it depend on unpublished private services.

**Acceptance:**
- Example demonstrates PASS.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-710 — Create bad-ai-pr demo fixture

**Depends on:** AG-428, AG-523

**Goal:** Create intentionally risky diff demonstrating multiple findings.

**Allowed scope:** examples/bad-ai-pr

**Must not:** Do not include real secrets.

**Acceptance:**
- Demo produces explainable REVIEW/FAIL output.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-711 — Add contributing rule request template

**Depends on:** AG-707

**Goal:** Create issue template for new deterministic rules.

**Allowed scope:** .github/ISSUE_TEMPLATE

**Must not:** Do not accept vague 'AI says risky' rule definitions.

**Acceptance:**
- Template asks for evidence and false-positive considerations.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-712 — Add bug report template

**Depends on:** None

**Goal:** Create reproduction-focused bug template.

**Allowed scope:** .github/ISSUE_TEMPLATE

**Must not:** Do not request secrets.

**Acceptance:**
- Template asks version/platform/repro safely.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-713 — Add feature request template

**Depends on:** AG-700

**Goal:** Create scope-aware feature template.

**Allowed scope:** .github/ISSUE_TEMPLATE

**Must not:** Do not encourage v0.1 scope creep.

**Acceptance:**
- Template asks problem, evidence, alternatives, scope impact.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-714 — Add pull request template

**Depends on:** AG-017

**Goal:** Require What/Why/Tests/Breaking changes/task ID.

**Allowed scope:** .github/pull_request_template.md

**Must not:** Do not add ceremonial fields with no value.

**Acceptance:**
- Template reinforces task discipline.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-715 — Configure Changesets

**Depends on:** AG-523

**Goal:** Set package version/release workflow foundation.

**Allowed scope:** .changeset and package metadata

**Must not:** Do not publish yet.

**Acceptance:**
- Changeset command works across workspace.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-716 — Create release workflow

**Depends on:** AG-715, AG-615

**Goal:** Build/test then publish intended packages/action artifacts.

**Allowed scope:** .github/workflows/release.yml

**Must not:** Do not publish on arbitrary PRs.

**Acceptance:**
- Workflow requires deliberate release trigger.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-717 — Validate package metadata

**Depends on:** AG-715

**Goal:** Ensure names, exports, files, engines, licenses, repository metadata are correct.

**Allowed scope:** package manifests, package-local build configurations,
package-local README/LICENSE files, and the package build scripts required to
produce the approved public artifacts.

**Must not:** Do not publish internal-only packages accidentally.

**Acceptance:**
- The canonical repository metadata identifies `Felyx-Fu/AgentGuard`.
- Every public package has a package-local `tsconfig.build.json` and explicit
  `build` script using unbundled TypeScript output under `dist`.
- `pnpm build` produces all seven public package `dist` directories and keeps
  the GitHub Action's private bundle model unchanged.
- Every public package exposes `./dist/index.js` and `./dist/index.d.ts`; the
  CLI bin resolves to `./dist/main.js`.
- Actual packed artifacts contain only package metadata, package README, MIT
  LICENSE, and `dist/**`; source, tests, fixtures, coverage, configs, and
  temporary files are absent.
- Packed `package.json` files contain installable internal dependency ranges,
  not unresolved `workspace:` protocol specifiers.
- A temporary external consumer imports representative packed ESM package
  roots, resolves declarations, and runs the packed CLI `--help` smoke test.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-718 — Create v0.1 release checklist

**Depends on:** AG-716

**Goal:** Document final platform, security, docs, examples, package checks.

**Allowed scope:** docs/release or ROADMAP.md

**Must not:** Do not mark items complete automatically.

**Acceptance:**
- Checklist maps to release-level DoD.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-719 — Run cross-platform CI matrix

**Depends on:** AG-023, AG-615

**Goal:** Validate Windows/Linux/macOS with Node 24.

**Allowed scope:** `.github/workflows/ci.yml` and the smallest source, test,
configuration, or dependency metadata change required to repair an ordinary
cross-platform issue exposed by the authorized hosted runners.

**Must not:** Do not add unsupported Node versions as a release requirement;
do not publish, tag, create a GitHub Release, execute the release workflow, or
expand the v0.1 scope.

**Acceptance:**
- The canonical `Felyx-Fu/AgentGuard` repository is used with `main` as the
  default branch.
- The same identifiable source revision passes on `ubuntu-latest`,
  `windows-latest`, and `macos-latest`, all with Node 24.
- Each hosted job runs frozen-lockfile install, lint, typecheck, test, build,
  architecture validation where configured, and the existing package-boundary
  command where configured.
- `STATUS.md` records the commit SHA, workflow/run identifier or URL when
  available, workflow name, Node version, each platform conclusion, and any
  failure/root-cause/fix history.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-720 — Prepare v0.1.0 release candidate

**Depends on:** AG-700 through AG-719

**Goal:** Run clean install, full checks, pack/build, examples, action validation.

**Allowed scope:** release-related files only

**Must not:** Do not add last-minute features.

**Acceptance:**
- Release candidate satisfies all release gates.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.

### AG-721 — Tag v0.1.0 readiness

**Depends on:** AG-720

**Goal:** Record final readiness status and unresolved non-blocking issues.

**Allowed scope:** STATUS.md, release notes

**Must not:** Do not publish if critical acceptance criteria fail.

**Acceptance:**
- Project is explicitly READY or NOT READY with evidence.
- No unrelated architecture or dependency changes.
- Update `STATUS.md` after completion.
