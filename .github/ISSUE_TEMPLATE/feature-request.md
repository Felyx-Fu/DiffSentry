---
name: Feature request
about: Propose a focused, evidence-backed AgentGuard improvement
title: "[Feature]: "
labels: "enhancement,needs-triage"
assignees: ""
---

## Problem

What concrete user or contributor problem is not currently handled? Who is
affected, and in which supported surface does it occur?

## Evidence and current behavior

Describe the observed workflow, limitation, or repeated manual step. Include a
safe synthetic example, report fragment, issue link, or other evidence when
available. Do not include secrets, private repository data, or production
content.

## Proposed outcome

Describe the smallest user-visible outcome. Focus on behavior and acceptance
criteria rather than prescribing an implementation.

- Desired behavior:
- In-scope inputs:
- Explicit non-goals:
- How success can be verified deterministically:

## Alternatives considered

- Existing AgentGuard capability or configuration:
- Smaller change:
- External tool or workflow workaround:
- Why those alternatives are insufficient:

## v0.1 scope impact

Explain how this request fits the current release plan.

- Related phase/task ID:
- Is it required for a stated v0.1 Definition of Done item?
- Does it change a public contract, report schema, config field, exit code, or
  architecture boundary?
- Does it require a new dependency or platform capability?
- What existing task would be delayed or removed to keep scope bounded?

If the proposal is not necessary for v0.1, say so and describe a smaller
follow-up or post-v0.1 option. Do not treat “nice to have” as release-blocking
without evidence.

## Security and trust boundary

- Does the request require network access, arbitrary command execution, a new
  filesystem scope, write permissions, an LLM, or executable configuration?
- If yes, explain the trust boundary, least-privilege design, and why a
  separate specification or ADR is required.
- How will sensitive inputs and outputs remain redacted and bounded?

## Acceptance criteria

List observable, testable conditions:

1.
2.
3.

## Checklist

- [ ] The problem is concrete and supported by evidence.
- [ ] The proposal has a bounded v0.1 or explicitly post-v0.1 scope.
- [ ] Alternatives and their tradeoffs are documented.
- [ ] Success can be verified with deterministic tests or evidence.
- [ ] Security, trust-boundary, dependency, and platform impacts are stated.
- [ ] No secrets or confidential repository data are attached.
- [ ] The request does not rely on “AI says risky” as its only rationale.
