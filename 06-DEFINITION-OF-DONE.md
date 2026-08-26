# Definition of Done

A task is DONE only when all applicable conditions are satisfied.

## Task-level DoD

- The task goal is implemented.
- Task dependencies were satisfied.
- No unrelated feature was added.
- Relevant tests were added or updated.
- Targeted tests pass.
- TypeScript passes for affected package(s).
- Lint passes for affected package(s).
- No architecture boundary is violated.
- Security constraints are preserved.
- Public API/documentation is updated when applicable.
- `STATUS.md` is updated.
- Diff was reviewed for accidental changes.

## Rule-level DoD

Every built-in rule additionally requires:
- stable rule ID;
- metadata;
- positive case;
- negative case;
- evidence assertions;
- severity;
- deterministic output;
- registry inclusion;
- documentation.

## Phase-level DoD

A phase is DONE only when:
- every task in the phase is done;
- full repository lint passes;
- full typecheck passes;
- all tests pass;
- build passes;
- phase acceptance scenario works;
- no known P0/P1 correctness issue remains.

## Release-level DoD

v0.1.0 requires:
- Windows CI
- Linux CI
- macOS CI
- Node 24
- Node project detection
- Git diff analysis
- test/typecheck/lint verification
- optional build verification
- five built-in rules
- deterministic risk score
- evidence output
- CLI
- GitHub Action
- English README
- Chinese README
- examples
- release notes
- no known critical security issue

## v0.1 package artifact gate

Before release readiness, every public package must pass the artifact gate:

- package-local TypeScript build produces `dist/**/*.js`, declarations,
  declaration maps, and source maps;
- a real pack dry-run or tarball inspection confirms only package metadata,
  package README, MIT LICENSE, and `dist/**` are included;
- packed `package.json` has valid repository metadata, exports, declarations,
  and installable internal dependency ranges;
- every declared export and CLI bin points to a file present in the packed
  artifact;
- source files, tests, fixtures, coverage, development TypeScript configs, and
  temporary files are absent;
- a temporary external consumer imports representative packed ESM package
  roots, resolves TypeScript declarations, and runs `agentguard --help` from
  the packed CLI.

The GitHub Action is excluded from the public npm package list. It remains a
private package with its existing bundled Action artifact and must be checked
separately.

## AG-719 hosted CI evidence gate

AG-719 has limited authorization to create and use the canonical
`Felyx-Fu/AgentGuard` GitHub repository, push the validated source and required
CI fixes, trigger the formal CI workflow, and read hosted-run evidence. This
does not authorize npm publication, Changesets publication, NPM_TOKEN use,
tags, GitHub Releases, release PRs, release-workflow execution, or a
`v0.1.0 READY TO RELEASE` declaration.

The same identifiable source revision must pass the formal quality gate on
`ubuntu-latest`, `windows-latest`, and `macos-latest`, each using Node.js 24.
The evidence record must include the canonical repository, tested commit SHA,
workflow name and run identifier/URL when available, each platform's
conclusion, Node version, quality-gate results, and any failure/root-cause/fix
history. Static YAML inspection and local Windows execution do not substitute
for hosted-run evidence. The existing package-boundary command remains a
placeholder and must be recorded as such.

## Not done

These statements do not mean DONE:
- "It runs on my machine."
- "The happy path works."
- "Tests were skipped because the change is small."
- "The type error is unrelated."
- "Codex thinks it is correct."
