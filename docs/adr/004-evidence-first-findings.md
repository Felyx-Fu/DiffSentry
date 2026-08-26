# ADR-004: Findings must be evidence-first

- Status: Accepted
- Date: 2026-08-26

## Context

A risk message without observable support is not sufficient for a verification
engine. Users need to understand what changed, where it changed, and why a
finding was produced.

## Decision

Model each finding as a claim with severity, evidence, and confidence. Evidence
must identify relevant facts such as changed paths, change types, related test
presence or absence, verifier results, dependency deltas, and workflow
permission deltas. Secret-like values must be redacted.

## Consequences

Rules return structured findings instead of subjective messages. Reporters
render evidence supplied by the engine but do not calculate risk or invent
supporting facts.

## Alternatives considered

Free-form warnings without evidence were not selected because they cannot be
audited or reliably reproduced.

## Verification

Every built-in rule must have positive and negative fixtures, evidence
assertions, stable metadata, deterministic output, registry inclusion, and
documentation.
