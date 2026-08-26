# DiffSentry basic example

This directory is a small, clean Node.js/TypeScript repository fixture. It has
no runtime dependencies, uses JSON configuration, and includes a matching test
for its source file.

The fixture is intentionally shaped as a baseline `PASS` case under the v0.1
policy:

- the source contains no secret-like value;
- there is no runtime dependency addition;
- there is no workflow permission change;
- no authentication-related path is changed; and
- `src/index.ts` has the matching `src/index.test.ts` file.

With no findings and no verifier penalties, the normative aggregation is
`RawRiskScore = 0`, so the default `review = 15` threshold yields `PASS`. This
is the fixture's deterministic policy expectation; it does not claim that a
published CLI package or a live GitHub runner has already executed this
directory.

## Verify the example

From the DiffSentry repository root:

```bash
pnpm exec tsc -p examples/basic/tsconfig.json
node --experimental-strip-types --test examples/basic/src/index.test.ts
```

The example's `package.json` also exposes the same `typecheck` and `test`
commands for a standalone copy after its public TypeScript and Node type
development dependencies are installed. It does not depend on an unpublished
private service or a network API.
