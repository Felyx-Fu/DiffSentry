# ADR-001: Use the locked TypeScript monorepo toolchain

- Status: Accepted
- Date: 2026-08-26

## Context

AgentGuard v0.1 needs one reproducible development baseline across its
packages, applications, tests, and release automation.

## Decision

Use TypeScript in an ESM pnpm workspace with Turborepo orchestration. The
locked baseline is Node.js 24 LTS, TypeScript 6.0, Biome, Vitest, JSON plus
JSON Schema configuration, Changesets, GitHub Actions, and the MIT license.

## Consequences

The repository shares compiler and quality-tool conventions. Contributors must
keep TypeScript strictness enabled and must not introduce a parallel formatter,
linter, module system, or package manager without a new decision.

## Alternatives considered

CommonJS, JavaScript-only packages, and multiple package-manager toolchains
were not selected because they would weaken the locked v0.1 baseline.

## Verification

The root toolchain metadata, TypeScript base config, Biome command, Vitest
command, and Turborepo task graph are checked by the P0 foundation tasks.
