# ADR-005: Treat configuration as JSON data only

- Status: Accepted
- Date: 2026-08-26

## Context

Configuration is an input boundary. Loading executable configuration would
turn a repository or user-controlled file into arbitrary code execution.

## Decision

v0.1 accepts `agentguard.config.json` validated as JSON data, with JSON Schema
support where specified. It does not support TypeScript or JavaScript config,
dynamic imports, executable hooks, `eval`, or equivalent evaluation.

## Consequences

Configuration loading can remain deterministic and auditable. Expressiveness
is intentionally limited, and future executable configuration would require a
new security and architecture decision.

## Alternatives considered

`agentguard.config.ts`, `agentguard.config.js`, dynamic import, and executable
hooks were rejected because they enlarge the code-execution boundary.

## Verification

Configuration tasks must validate the accepted filename and schema, reject
executable formats, and test malformed and unsafe inputs.
