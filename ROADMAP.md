# AgentGuard v0.1 Roadmap

## P0 Foundation
Repository, toolchain, CI, governance, ADRs.

## P1 Contracts
Stable public contracts for project/change/evidence/finding/verification/report/config.

## P2 Runtime
Safe Node adapters for filesystem, Git, process execution, environment, clock.

## P3 Core Engine
Project detection, diff analysis, verification planning/execution, risk score, verdict, report assembly.

## P4 Rules
Five deterministic built-in rules:
- security.secret-exposure
- testing.source-without-tests
- testing.auth-without-tests
- dependency.runtime-dependency-added
- ci.workflow-permission-change

## P5 CLI
JSON config, check/init/explain, terminal/JSON/Markdown rendering, exit codes.

## P6 GitHub Action
PR/push context, summaries, outputs, annotations, least-privilege workflow.

## P7 Release & Open Source
README, docs, examples, contribution UX, release workflow, cross-platform validation.

## After v0.1

Not automatically approved:
- more ecosystems;
- dynamic rule plugins;
- hosted dashboard;
- remote runners;
- AI advisory layer;
- enterprise policy.

Every post-v0.1 expansion requires evidence of user demand and an ADR when architecture changes.
