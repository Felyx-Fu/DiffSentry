# ADR-002: Keep the core behind ports and adapters

- Status: Accepted
- Date: 2026-08-26

## Context

AgentGuard must inspect repositories and run integrations without coupling
deterministic domain behavior to Node.js, the CLI, GitHub, or a UI.

## Decision

Use a core-first hexagonal architecture. Contracts define cross-package data;
core contains application and domain behavior plus ports; runtime-node, rules,
config, and report provide adapters; CLI and GitHub Action are composition
roots. Concrete I/O adapters are created only at composition roots.

## Consequences

Core code remains independently testable and cannot import Node runtime APIs,
CLI packages, GitHub SDKs, UI frameworks, cloud services, or instantiate
runtime adapters. Integration code must pass capabilities explicitly through
ports.

## Alternatives considered

A single application package or direct filesystem/process access from core was
not selected because either choice would cross the specified trust and
dependency boundaries.

## Verification

The architecture and package-boundary scripts will enforce forbidden imports
as their implementation tasks are completed; the current P0 entries are
explicit placeholders.
