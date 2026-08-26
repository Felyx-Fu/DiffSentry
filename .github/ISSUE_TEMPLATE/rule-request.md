---
name: Deterministic rule request
about: Propose a narrowly scoped built-in DiffSentry rule with reproducible evidence
title: "[Rule]: "
labels: "rule,needs-triage"
assignees: ""
---

## Rule summary

What repository change or deterministic condition should this rule detect?

<!-- Do not write “AI says this is risky”. Describe an observable condition that
can be evaluated from repository data, Git changes, or bounded verifier output. -->

## Proposed rule identity

- Proposed rule ID (category-prefixed, for example `security.example-condition`):
- Category (`ci`, `dependency`, `security`, or `testing`):
- Short name:
- Default severity (`info`, `low`, `medium`, `high`, or `critical`):

## Deterministic trigger

Describe the exact inputs and condition that cause the rule to fire.

- Required context:
- Positive condition:
- Ordering or normalization requirements:
- What the rule must not inspect or infer:

## Positive example

Provide a minimal synthetic or fully redacted before/after fixture that must
produce a finding. Include the changed paths and the expected finding count.

<!-- Never paste credentials, access tokens, private keys, cookies, production
data, or other sensitive material. Replace values with safe placeholders. -->

```text
Before:

After:

Expected finding(s):
```

## Negative examples and false positives

List cases that look similar but must not produce a finding.

- Negative fixture 1:
- Negative fixture 2:
- Known false-positive risk:
- How the rule should avoid or report that false positive:
- Known false-negative risk:

## Evidence contract

What factual evidence should the finding contain?

- Evidence message:
- Evidence path/location:
- Redaction requirements:
- Why this evidence is sufficient to review the claim:

Do not make an exploitability, package reputation, network, or LLM inference
part of the evidence unless a future approved specification explicitly permits
it. v0.1 evidence must remain local, bounded, factual, and explainable.

## Testing plan

- [ ] Positive test fixture and expected finding assertion
- [ ] Negative test fixture with no finding assertion
- [ ] Rule ID, severity, title, and message assertions
- [ ] Evidence message/location assertions
- [ ] Deterministic ordering assertion, when multiple findings are possible
- [ ] Secret-like inputs are synthetic/redacted and never real

## Scope and alternatives

- Why is a new built-in rule necessary instead of extending an existing rule?
- What is the smallest v0.1 scope that solves the stated problem?
- Does this require a new contract, port, configuration field, or public export?
- Does this request require network access, arbitrary command execution, an LLM,
  or dynamic plugin loading? If yes, explain why it is out of v0.1 scope or
  propose a separate design review.

## Contributor checklist

- [ ] The trigger is deterministic and reproducible from declared inputs.
- [ ] Positive and negative cases are concrete and safe to share.
- [ ] False-positive and false-negative behavior is considered.
- [ ] Evidence is factual, location-aware where possible, and redacted.
- [ ] The proposal does not request secrets or production data.
- [ ] The proposal does not assume dynamic rule/plugin loading in v0.1.
