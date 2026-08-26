# ADR-006: Do not add LLM functionality to v0.1

- Status: Accepted
- Date: 2026-08-26

## Context

AgentGuard’s v0.1 value proposition is deterministic verification of code
changes. Introducing a model would add network, cost, privacy, and
reproducibility concerns to the core product.

## Decision

Do not call or embed OpenAI, Claude, Gemini, or another LLM in v0.1. The core
engine, rules, scoring, CLI, and GitHub Action use deterministic evidence and
recognized local verification commands only.

## Consequences

Results remain local-first, predictable, and auditable. A future advisory LLM
layer is not implied by this decision and would require an explicit ADR while
remaining separate from deterministic risk judgment.

## Alternatives considered

Model-assisted review and remote model APIs were not selected because they are
outside the locked v0.1 scope and would cross the stated trust boundaries.

## Verification

Reviews and architecture checks must reject unapproved model integrations,
network-dependent core scoring, and remote execution added under the v0.1
implementation.
