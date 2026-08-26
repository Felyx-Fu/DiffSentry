# DiffSentry — Codex Development Pack

This directory is the authoritative development specification for DiffSentry v0.1.

## Read order

Codex MUST read these files before editing code:

1. `00-READ-ME-FIRST.md`
2. `01-PROJECT-CHARTER.md`
3. `02-ARCHITECTURE.md`
4. `03-ENGINEERING-STANDARDS.md`
5. `04-CODEX-EXECUTION-PROTOCOL.md`
6. `05-SECURITY-AND-TRUST-BOUNDARIES.md`
7. `06-DEFINITION-OF-DONE.md`
8. `AGENTS.md`
9. `TASK-INDEX.md`
10. The task file for the current phase under `tasks/`

If documents conflict, the precedence is:

`Security > Architecture > Engineering Standards > Task document > implementation convenience`

## Product objective

DiffSentry verifies code changes using deterministic evidence rather than another model's opinion.

Core statement:

> Do not ask another AI whether AI-written code is correct. Verify it.

## v0.1 scope

Supported:
- Git repositories
- Node.js projects
- JavaScript / TypeScript
- npm / pnpm / yarn / bun detection
- deterministic checks
- evidence collection
- risk scoring
- CLI
- GitHub Action
- five built-in rules

Explicitly out of scope:
- LLM integration
- SaaS
- Web dashboard
- database
- authentication
- billing
- VS Code extension
- MCP server
- remote runner
- Docker sandbox
- Rust rewrite
- enterprise features

## Development rule

Never implement "DiffSentry" as one large task.

The project is developed in this order:

P0 Foundation  
P1 Contracts  
P2 Runtime  
P3 Core Engine  
P4 Rules  
P5 CLI  
P6 GitHub Action  
P7 Release & Open Source

Complete only tasks whose dependencies are satisfied.

## Repository truth

The repository itself, these specifications, and tests are the source of truth. Do not infer missing requirements from marketing language or add features because they "seem useful."
