# AgentGuard intentionally risky diff

This directory is a deterministic, secret-free demo of a risky change. It
contains before/after snapshots for two scenarios and a package-local test that
runs the existing built-in rules and core Risk Model against those snapshots.
It does not install the fixture's placeholder runtime dependency and does not
call a network service.

## Scenarios

The `review` scenario contains two explainable findings:

- `ci.workflow-permission-change`: `contents` expands from `read` to `write`,
  worth `high = 30`;
- `dependency.runtime-dependency-added`: a runtime dependency is added, worth
  `medium = 15`.

With no verifier penalties, the raw score is `45`, so the default thresholds
produce `REVIEW`.

The `fail` scenario contains those same changes plus:

- `testing.auth-without-tests`: an authentication-related source file changes
  without a related changed test, worth `high = 30`;
- `testing.source-without-tests`: changed source has no changed test file, worth
  `high = 30`.

The raw score is `105`, which the v0.1 cap reduces to `100`, so the result is
`FAIL`. The findings and their paths are asserted by `check.test.ts`.

No credential, token, private key, or secret-like value is included. The demo
shows deterministic rule evidence and score aggregation, not exploitability or
package reputation.

## Verify

From the AgentGuard repository root:

```bash
pnpm exec vitest run examples/bad-ai-pr/check.test.ts
```

The test uses the local `@agentguard/rules` and `@agentguard/core` source
through the repository's test configuration. It does not claim a published CLI
package or a live GitHub runner invocation.
