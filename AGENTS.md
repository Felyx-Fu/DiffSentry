# AGENTS.md

## Mission

Develop AgentGuard v0.1 exactly according to the repository specifications.

## Mandatory rules

1. Do not expand task scope.
2. Do not add dependencies without explicit need.
3. Do not change architecture boundaries casually.
4. `core` must not import Node runtime APIs or app packages.
5. Every built-in rule requires positive and negative tests.
6. New public API requires intentional export and documentation where applicable.
7. Do not introduce LLM functionality in v0.1.
8. Do not execute untrusted shell strings.
9. Behavior changes require tests.
10. Do not weaken TypeScript strictness.
11. Do not delete or mute tests to make CI green.
12. Configuration is JSON data, not executable code.
13. Core/domain code must not use `console.log`.
14. One task at a time.
15. Update `STATUS.md` after each completed task.

## Primary sources of truth

- `02-ARCHITECTURE.md`
- `03-ENGINEERING-STANDARDS.md`
- `05-SECURITY-AND-TRUST-BOUNDARIES.md`
- `06-DEFINITION-OF-DONE.md`
- current task document

## If uncertain

Prefer:
- smaller implementation;
- deterministic behavior;
- explicit evidence;
- fewer dependencies;
- existing architecture;
- no feature expansion.
