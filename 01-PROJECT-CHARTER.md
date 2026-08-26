# AgentGuard Project Charter

## 1. Product definition

AgentGuard is a local-first verification engine for code changes, especially AI-generated changes.

It answers four questions:

1. What changed?
2. What objective checks can be run?
3. What evidence indicates risk?
4. Should the change pass, require review, or fail?

## 2. Product principles

1. **Evidence over opinion**
2. **Deterministic by default**
3. **Local-first**
4. **Core independent from integrations**
5. **One command to value**
6. **Rules must be explainable**
7. **Safe execution by default**
8. **Scope aggressively**

## 3. v0.1 user experience

Primary command:

```bash
npx agentguard check
```

Expected output shape:

```text
AgentGuard

✓ Node.js project detected
✓ TypeScript detected
✓ Typecheck passed
✓ 38 tests passed

⚠ 2 findings

HIGH
Authentication implementation changed without related test changes.
Evidence: src/auth/session.ts changed; no related test file changed.

MEDIUM
New runtime dependency detected: jsonwebtoken

Risk Score: 45/100
Verdict: REVIEW REQUIRED
```

### Normative v0.1 Risk Model

The following Risk Model is normative for AgentGuard v0.1. A finding's
confidence does not affect its risk contribution.

Severity weights:

| Severity | Weight |
| --- | ---: |
| info | 0 |
| low | 5 |
| medium | 15 |
| high | 30 |
| critical | 50 |

Verification penalties are applied by verification intent and status:

| Verification | passed | skipped | error | failed |
| --- | ---: | ---: | ---: | ---: |
| test | 0 | 0 | 30 | 50 |
| typecheck | 0 | 0 | 30 | 50 |
| build | 0 | 0 | 30 | 50 |
| lint | 0 | 0 | 10 | 15 |

The score is calculated as:

```text
FindingScore = sum(severityWeight for every Finding)
VerificationScore = sum(penalty for every VerificationResult)
RawRiskScore = FindingScore + VerificationScore
RiskScore = min(100, RawRiskScore)
```

`Finding.confidence` does not participate in this calculation. No additional
multiplier, normalization, category scaling, network-based scoring, or LLM
scoring is used in v0.1.

The default thresholds are `review = 15` and `fail = 50`. Configuration must
validate `0 <= review < fail <= 100`. Verdict mapping is:

```text
score < review        => PASS
review <= score < fail => REVIEW
score >= fail         => FAIL
```

A `VerificationResult` with status `error` is a verification result and uses
the fixed penalty above. An AgentGuard internal error is a separate failure
path: it does not enter `RiskScore` and uses the existing internal-error path
and CLI exit code 3.

## 4. Public / commercial boundary

Open source:
- contracts
- core
- local runtime
- built-in rules
- config
- CLI
- evidence
- JSON / Markdown / terminal reporting
- GitHub Action

Potential future commercial layer:
- hosted dashboard
- history
- organization policy
- private-repository analytics
- RBAC / SSO
- audit trail
- cross-repository analytics
- managed cloud execution

The OSS core must remain genuinely useful.

## 5. Success criteria for v0.1

The release is successful when a developer can:
- install or run AgentGuard with one command;
- check a changed Node/TypeScript repository;
- receive deterministic verification results;
- receive explainable findings with evidence;
- use the same engine locally and in GitHub Actions;
- reproduce the same verdict for the same repository state and config.

## 6. Non-goals

AgentGuard v0.1 is not:
- an AI code reviewer;
- a SAST replacement;
- a full CI platform;
- a sandbox;
- a package vulnerability database;
- a code formatter;
- an IDE;
- a hosted service.
