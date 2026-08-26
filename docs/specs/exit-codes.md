# AgentGuard v0.1 exit codes and CI status

Exit codes are meaningful only together with the path that produced them. The
CLI verdict mapping applies to a completed check outcome. Informational CLI
commands and top-level usage handling are separate paths.

## Completed CLI check outcomes

`mapCliExitCode` maps the core verdict outcome to the following process code:

| Exit code | Check outcome | Meaning |
| ---: | --- | --- |
| `0` | `PASS` | The final risk score is below the configured `review` threshold. The check completed successfully. |
| `1` | `REVIEW` | The final risk score is at least `review` and below `fail`. The check completed, but human review is required. |
| `2` | `FAIL` | The final risk score is at least the configured `fail` threshold. The check completed with a failing risk verdict. |
| `3` | internal error | AgentGuard could not complete its own check path. This is not a verifier result and is not entered into `RiskScore`. |

The default thresholds are `review = 15` and `fail = 50`, with the invariant
`0 <= review < fail <= 100`. A caller that supplies thresholds changes only the
verdict boundary; it does not change the numeric exit-code table.

A verifier result with status `error` is different from exit code `3`. The
verifier `error` receives the fixed v0.1 verification penalty and can lead to a
`REVIEW` or `FAIL` verdict, which then maps to `1` or `2`. AgentGuard internal
errors bypass risk aggregation and map to `3`.

## Non-check CLI paths

The top-level `runCli` surface also has utility and usage paths:

| Invocation path | Current return code | Meaning |
| --- | ---: | --- |
| empty invocation, `--help`, or `-h` | `0` | Help was displayed; no repository check verdict was produced. |
| `--version` or `-v` | `0` | Version was displayed; no repository check verdict was produced. |
| unknown command or unsupported option | `1` | The invocation was rejected as a usage error; no `REVIEW` report was produced. |

This existing top-level usage behavior is intentionally documented separately
from the completed-check table. Therefore, a bare numeric `1` is interpreted
as `REVIEW` only when it comes from a completed check verdict; on the unknown
command path it means usage rejection. Consumers that need to distinguish the
two must retain the command outcome or inspect whether a report was produced.

## GitHub Action status

The GitHub Action uses the `fail-on` input to map a report verdict to an Action
job status. It does not change the core verdict or the `risk-score`/`verdict`
outputs.

| `fail-on` | `PASS` | `REVIEW` | `FAIL` |
| --- | --- | --- | --- |
| `fail` (default) | success | success | failure |
| `review` | success | failure | failure |
| `never` | success | success | success |

Only `fail`, `review`, and `never` are supported. An unsupported `fail-on`
value is rejected by the Action adapter before a status decision is returned;
it is not silently treated as one of the supported modes.

The Action's declared outputs are:

- `risk-score`: the deterministic final score from `0` to `100`;
- `verdict`: `pass`, `review`, or `fail`.

Step Summary and annotations are presentation outputs. They do not introduce a
second risk score or a different verdict mapping.

## What exit codes do not mean

- Exit code `1` is not a generic “test failed” code when returned by a completed
  AgentGuard check; it specifically represents the `REVIEW` verdict in that
  path.
- A verifier process's own `exitCode` is stored inside its
  `VerificationResult`; it is not automatically reused as the AgentGuard CLI
  exit code.
- A verifier status of `error` is not an AgentGuard internal error.
- A `FAIL` verdict is not proof that an exploit occurred; it is the result of
  deterministic findings, verification penalties, and configured thresholds.
- An Action `failure` status follows `fail-on`; it does not imply that the CLI
  process exit code was `2`.

For the score and verifier semantics behind these mappings, see
[evidence.md](evidence.md) and
[02-ARCHITECTURE.md](../../02-ARCHITECTURE.md).
