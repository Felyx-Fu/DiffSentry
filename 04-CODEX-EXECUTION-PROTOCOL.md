# Codex Execution Protocol

This file defines how Codex must develop AgentGuard.

## 1. Before editing

For every new Codex session:

1. Read `00-READ-ME-FIRST.md`.
2. Read `AGENTS.md`.
3. Read architecture, standards, security, and Definition of Done.
4. Read `TASK-INDEX.md`.
5. Identify the earliest unblocked task.
6. Read that phase's task document.
7. Inspect existing code before changing anything.

Do not assume a task is incomplete solely because the task document says so. Verify repository state first.

## 2. Atomic task rule

Work on one `AG-xxx` task at a time unless a task explicitly permits a paired implementation.

A task must not silently absorb unrelated cleanup.

## 3. Required task cycle

For each task:

```text
Inspect
  ↓
Confirm dependencies
  ↓
Implement smallest valid change
  ↓
Add/update tests
  ↓
Run targeted checks
  ↓
Run required package checks
  ↓
Review diff
  ↓
Update STATUS.md
```

## 4. Scope discipline

If implementation exposes a missing prerequisite:
- do not opportunistically redesign the project;
- record the blocker in `STATUS.md`;
- implement the missing prerequisite only if it is explicitly within the current task scope or already defined as an earlier task.

## 5. Forbidden autonomous behavior

Codex must not:
- introduce an LLM;
- add cloud services;
- add telemetry;
- add analytics;
- add a database;
- add authentication;
- add a web application;
- rewrite in Rust;
- execute untrusted shell strings;
- change architecture boundaries;
- change task IDs;
- delete tests merely to make CI pass;
- weaken TypeScript strictness;
- suppress lint/type errors globally;
- add dependencies without justification.

## 6. Diff budget

Prefer a task to modify:
- 1–3 responsibility areas;
- under ~300 new logical lines when practical.

If a task becomes materially larger, stop and split it rather than hiding complexity.

## 7. Status tracking

Maintain `STATUS.md`.

For each completed task:

```text
AG-214 DONE
- summary:
- tests:
- files:
- notes:
```

For blockers:

```text
AG-214 BLOCKED
- blocker:
- evidence:
- proposed next action:
```

Do not mark a task done if acceptance criteria are not met.

## 8. Commit discipline

Suggested commit pattern:

```text
feat(runtime): implement git diff provider
test(rules): cover auth change without tests
fix(cli): preserve fail exit code
docs(architecture): clarify process boundary
```

One atomic task should usually map to one commit or one coherent commit group.

## 9. Architecture change protocol

If a task truly requires architecture change:
1. stop implementation;
2. create/update an ADR proposal;
3. explain affected dependency boundaries;
4. do not proceed until the architecture decision is explicitly accepted.

## 10. Final self-review for every task

Ask:
- Did I modify only allowed areas?
- Did I add behavior outside the task?
- Did I add a dependency?
- Did I weaken safety?
- Did I bypass a port?
- Did I change public contracts unnecessarily?
- Are tests meaningful?
- Does the implementation remain deterministic?
