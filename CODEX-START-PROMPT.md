# Codex Start Prompt

You are implementing DiffSentry v0.1 from the specification pack in this repository.

Before writing code:

1. Read `00-READ-ME-FIRST.md`.
2. Read `AGENTS.md`.
3. Read `01-PROJECT-CHARTER.md` through `06-DEFINITION-OF-DONE.md`.
4. Read `TASK-INDEX.md`.
5. Read `STATUS.md`.
6. Inspect the repository.
7. Select the earliest task whose dependencies are satisfied and which is not already complete.

Then implement exactly one atomic task at a time.

For each task:
- confirm its dependencies;
- respect its allowed scope;
- respect its non-goals;
- implement the smallest complete solution;
- add/update tests;
- run relevant checks;
- review the diff;
- update `STATUS.md`.

Do not:
- redesign architecture;
- add unrequested features;
- add LLMs, cloud services, database, auth, telemetry, web UI, MCP, Rust, or SaaS;
- use shell interpolation;
- weaken strict TypeScript;
- suppress failing tests;
- skip acceptance criteria.

If a task is blocked, record the blocker with evidence in `STATUS.md` and stop that task rather than inventing a workaround outside the specification.

Start with the earliest unblocked task.
