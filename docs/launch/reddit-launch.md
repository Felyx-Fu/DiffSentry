# Reddit launch copy

## Suggested title

I built a deterministic verifier for AI-generated code instead of another AI reviewer

## Suggested post

AI-assisted development makes it easier to produce a code change quickly. It
does not remove the need to verify what changed, which checks actually ran, and
what evidence supports a risk decision.

I built DiffSentry to cover that part with deterministic local checks. It reads a
Git change, collects project and verifier signals, runs five built-in rules,
redacts secret-like evidence, calculates the v0.1 `RiskScore`, and reports
`PASS`, `REVIEW`, or `FAIL`.

The distinction from another AI reviewer is intentional: DiffSentry does not
ask an LLM to judge another LLM's output, and it does not use LLM or network
scoring. For the same inputs and signals, the core result is designed to be
reproducible. It complements AI-assisted development; it is not a claim that
model-based review has no value.

Try the released npm CLI from any Git repository with Node 24:

```bash
npx @felyx-fu/diffsentry check
```

The current v0.1 release includes:

- `security.secret-exposure`
- `testing.source-without-tests`
- `testing.auth-without-tests`
- `dependency.runtime-dependency-added`
- `ci.workflow-permission-change`

It is deliberately not a full SAST replacement, vulnerability database,
enterprise policy platform, or hosted service. The GitHub Action remains a
private integration artifact, and deep package-boundary analysis is still a
deferred placeholder.

The project and release evidence are here:

<https://github.com/Felyx-Fu/DiffSentry>

I would especially appreciate technical feedback on false positives, whether
the evidence is useful during review, and which deterministic signals are worth
adding after the v0.1 scope is revisited.
