# Frozen Target Repository Tree

This is the target layout for AgentGuard v0.1.

Do not create every file on day one. Tasks create the structure incrementally. The tree defines ownership and final intended placement.

```text
agentguard/
├─ .github/
│  ├─ workflows/
│  │  ├─ ci.yml
│  │  ├─ release.yml
│  │  └─ dogfood.yml
│  ├─ ISSUE_TEMPLATE/
│  │  ├─ bug.yml
│  │  ├─ feature.yml
│  │  └─ rule-request.yml
│  ├─ pull_request_template.md
│  ├─ dependabot.yml
│  └─ CODEOWNERS
│
├─ apps/
│  └─ github-action/
│     ├─ src/
│     │  └─ main.ts
│     ├─ action.yml
│     ├─ package.json
│     └─ tsconfig.json
│
├─ packages/
│  ├─ contracts/
│  │  ├─ src/
│  │  │  ├─ project.ts
│  │  │  ├─ change.ts
│  │  │  ├─ finding.ts
│  │  │  ├─ evidence.ts
│  │  │  ├─ verification.ts
│  │  │  ├─ report.ts
│  │  │  ├─ config.ts
│  │  │  ├─ verdict.ts
│  │  │  └─ index.ts
│  │  └─ package.json
│  │
│  ├─ core/
│  │  ├─ src/
│  │  │  ├─ application/
│  │  │  │  ├─ check-repository.ts
│  │  │  │  ├─ analyze-changes.ts
│  │  │  │  ├─ plan-verification.ts
│  │  │  │  └─ evaluate-repository.ts
│  │  │  ├─ domain/
│  │  │  │  ├─ project/
│  │  │  │  ├─ change/
│  │  │  │  ├─ verification/
│  │  │  │  ├─ finding/
│  │  │  │  ├─ risk/
│  │  │  │  └─ evidence/
│  │  │  ├─ ports/
│  │  │  │  ├─ git-provider.ts
│  │  │  │  ├─ file-system.ts
│  │  │  │  ├─ process-runner.ts
│  │  │  │  ├─ clock.ts
│  │  │  │  ├─ rule.ts
│  │  │  │  └─ verifier.ts
│  │  │  ├─ errors/
│  │  │  │  ├─ agentguard-error.ts
│  │  │  │  └─ error-code.ts
│  │  │  └─ index.ts
│  │  └─ package.json
│  │
│  ├─ runtime-node/
│  │  ├─ src/
│  │  │  ├─ git/
│  │  │  ├─ filesystem/
│  │  │  ├─ process/
│  │  │  ├─ environment/
│  │  │  ├─ clock/
│  │  │  └─ index.ts
│  │  └─ package.json
│  │
│  ├─ rules/
│  │  ├─ src/
│  │  │  ├─ security/
│  │  │  │  └─ secret-exposure.ts
│  │  │  ├─ testing/
│  │  │  │  ├─ source-without-tests.ts
│  │  │  │  └─ auth-without-tests.ts
│  │  │  ├─ dependency/
│  │  │  │  └─ runtime-dependency-added.ts
│  │  │  ├─ ci/
│  │  │  │  └─ workflow-permission-change.ts
│  │  │  ├─ registry.ts
│  │  │  └─ index.ts
│  │  └─ package.json
│  │
│  ├─ config/
│  │  ├─ src/
│  │  │  ├─ loader.ts
│  │  │  ├─ validator.ts
│  │  │  ├─ defaults.ts
│  │  │  ├─ schema.ts
│  │  │  └─ index.ts
│  │  └─ package.json
│  │
│  ├─ report/
│  │  ├─ src/
│  │  │  ├─ terminal/
│  │  │  ├─ markdown/
│  │  │  ├─ json/
│  │  │  └─ index.ts
│  │  └─ package.json
│  │
│  └─ cli/
│     ├─ src/
│     │  ├─ commands/
│     │  │  ├─ check.ts
│     │  │  ├─ init.ts
│     │  │  └─ explain.ts
│     │  ├─ composition/
│     │  │  └─ create-agentguard.ts
│     │  ├─ main.ts
│     │  └─ index.ts
│     └─ package.json
│
├─ tests/
│  ├─ fixtures/
│  │  ├─ node-basic/
│  │  ├─ typescript-basic/
│  │  ├─ auth-change/
│  │  ├─ dependency-change/
│  │  ├─ exposed-secret/
│  │  └─ broken-project/
│  ├─ integration/
│  └─ e2e/
│
├─ examples/
│  ├─ basic/
│  ├─ bad-ai-pr/
│  └─ github-action/
│
├─ docs/
│  ├─ architecture/
│  ├─ specs/
│  ├─ adr/
│  └─ tasks/
│
├─ scripts/
│  ├─ check-architecture.ts
│  ├─ check-package-boundaries.ts
│  └─ release.ts
│
├─ .changeset/
├─ .editorconfig
├─ .gitignore
├─ .npmrc
├─ agentguard.config.schema.json
├─ AGENTS.md
├─ ARCHITECTURE.md
├─ ROADMAP.md
├─ CONTRIBUTING.md
├─ SECURITY.md
├─ CODE_OF_CONDUCT.md
├─ LICENSE
├─ README.md
├─ README.zh-CN.md
├─ biome.json
├─ package.json
├─ pnpm-lock.yaml
├─ pnpm-workspace.yaml
├─ tsconfig.base.json
└─ turbo.json
```

## Freeze rule

Changing top-level package responsibilities requires an ADR.

Adding a file inside an existing responsibility does not require an ADR unless it changes a public API or trust boundary.
