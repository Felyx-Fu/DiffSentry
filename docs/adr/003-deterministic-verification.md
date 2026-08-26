# ADR-003: Keep v0.1 verification deterministic

- Status: Accepted
- Date: 2026-08-26

## Context

AgentGuard is intended to verify code changes with reproducible objective
evidence rather than another model’s opinion.

## Decision

For the same repository contents, Git refs, AgentGuard version, configuration,
and relevant verifier outputs, the engine must produce the same findings, risk
score, and verdict. Core scoring must not depend on network access, LLM output,
wall-clock randomness, or hidden mutable state.

## Consequences

Rules and aggregation logic must be explainable and stable. External command
results, configuration, and other inputs must be represented explicitly so a
result can be reproduced and audited.

## Alternatives considered

Network-based scoring, probabilistic review, and time-dependent heuristics were
not selected for v0.1 because they would make equivalent checks diverge.

## Verification

Core and rule tasks must include deterministic-output tests and evidence
assertions. Phase gates must run the same quality commands from a clean setup.
