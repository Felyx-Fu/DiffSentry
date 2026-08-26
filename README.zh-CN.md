# DiffSentry

面向代码变更的确定性、本地优先验证，重点关注 AI 生成变更的证据。

> DiffSentry v0.1.0 已发布。本 README 描述已经验证的源码、已发布的 npm
> packages 以及已发布的 CLI 行为。

## 要解决的问题

代码审查需要的不只是 diff 摘要。DiffSentry 旨在回答四个具体问题：

1. 发生了哪些变化？
2. 哪些客观检查可以运行？
3. 哪些证据表明存在风险？
4. 变更应当通过、需要审查，还是失败？

它让决策保持本地化且可解释：Git 变更、项目信号、验证结果、规则发现、证据位置以及确定性的风险裁决都会以结构化数据表示。

## 演示

仓库在 `tests/e2e` 下包含一个确定性的 Git fixture 流程。它会创建临时仓库，应用现有的 secret-exposure fixture，脱敏匹配到的值，计算 v0.1 风险分数，渲染报告，并将 `FAIL` 裁决映射为 CLI 退出码 `2`。

同一份报告模型可以渲染为终端、JSON 和适用于 GitHub 的 Markdown 输出。确定性 fixture 测试断言了以下终端渲染形状：

```text
DiffSentry 0.1.0
Verdict: FAIL
Risk score: 50/100
Findings: 1
Verifications: 0

Findings:
- [CRITICAL] Secret exposure (security.secret-exposure)
  High-signal secret-like material detected in secret.ts; matched values are redacted.
  Evidence: Potential credential-assignment detected; matched value redacted. at secret.ts:1:7-1:32

Verifications: none
```

这是仓库内 package-local fixture 生成的报告样例；快速开始命令还会检查 `FAIL` 裁决对应的 CLI 退出码。

## 快速开始

对于当前源码 checkout，请使用 Node.js 24 和 pnpm 10.30.3。最快的已验证首次检查是确定性的 Git fixture 流程：

```bash
pnpm install --frozen-lockfile && pnpm exec vitest run tests/e2e/cli-fixture.test.ts
```

该命令会创建临时 Git 仓库，应用仓库内的 secret-exposure fixture，运行 package-local 检查栈，验证 `50/100` 的 `FAIL` 报告，并检查映射后的 CLI 退出码。它不会修改当前 checkout，也不需要全局安装。

如需运行完整源码质量门，请在 fixture 检查之后执行 `pnpm lint`、`pnpm typecheck`、`pnpm test` 和 `pnpm build`。

已发布的 npm CLI 可以直接使用：

```bash
npx @felyx-fu/diffsentry@0.1.0 --version
npx @felyx-fu/diffsentry@0.1.0 check --format json --ci
```

第二条命令在被检查的变更得到预期 `FAIL` 裁决时返回退出码 `2`。v0.1.0
的七个公共 package 已经可以从 npm 安装：`@felyx-fu/diffsentry`、
`@felyx-fu/diffsentry-contracts`、`@felyx-fu/diffsentry-core`、
`@felyx-fu/diffsentry-runtime-node`、`@felyx-fu/diffsentry-rules`、
`@felyx-fu/diffsentry-config` 和 `@felyx-fu/diffsentry-report`。

## 功能

当前 v0.1 源码包含：

- 变更、发现、证据、报告、验证结果、配置和裁决的契约；
- 通过注入文件系统、Git、进程和时钟能力实现的六边形核心边界；
- 确定性的 Git diff 解析、项目信号、验证计划、安全的可执行文件/参数解析以及验证器结果收集；
- 五条内置规则：工作流权限变更、运行时依赖新增、秘密暴露、没有相关测试的认证变更，以及没有测试的源码变更；
- 仅使用 JSON 的配置、schema 校验和确定性的优先级合并；
- 终端、JSON 和 Markdown 报告渲染器；
- CLI 组合、check/config/init/explain 命令面、CI JSON 默认格式以及退出码映射；
- GitHub Action 元数据、只读工作流示例、事件上下文解析、结构化报告交接、Step Summary/输出/注释适配器，以及可由 Node 加载的本地 bundle。

完整发布产物和实时 Action 入口会与这些源码级能力分开跟踪。

## 风险模型

RiskScore 是确定性的，只使用发现的严重程度和验证结果。v0.1 严重程度权重为 `info=0`、`low=5`、`medium=15`、`high=30`、`critical=50`。验证惩罚由验证器和状态固定，最终分数封顶为 `100`。

发现的 confidence 是证据元数据，不影响 RiskScore。默认阈值为 `review=15`、`fail=50`：

- 低于 `review`：`PASS`；
- 大于等于 `review` 且低于 `fail`：`REVIEW`；
- 大于等于 `fail`：`FAIL`。

规范模型请参阅 [01-PROJECT-CHARTER.md](01-PROJECT-CHARTER.md) 和 [02-ARCHITECTURE.md](02-ARCHITECTURE.md)。

## 原则

- 证据优先于观点
- 默认采用确定性行为
- 本地优先执行
- 核心与集成保持独立
- 规则和脱敏证据都应当可解释
- 通过明确的能力边界实现安全执行
- JSON 配置是数据，绝不是可执行代码
- 采用小而可审查的变更，避免推测性的功能扩展

## 路线图

- P0：基础、仓库策略、CI 和架构边界
- P1：契约和端口
- P2：Node runtime 适配器与安全进程执行
- P3：核心变更、验证、风险和报告基础
- P4：内置规则和证据处理
- P5：CLI、JSON 配置和报告格式
- P6：GitHub Action 元数据、适配器、示例、测试和 bundle 工具
- P7：发布文档、示例、打包和发布门

当前任务状态和证据记录在 [STATUS.md](STATUS.md)；任务规范位于 [tasks](tasks)。

## v0.1 的非目标

DiffSentry v0.1 不是 AI 代码审查器、托管式仪表板、软件包漏洞数据库、完整 CI 平台、IDE，也不是所有 SAST 工具的替代品。它不使用 LLM 评分、基于网络的评分、confidence 缩放、类别乘数，也不接受可执行的 JavaScript/TypeScript 配置。

## 参与贡献

修改仓库前请阅读 [AGENTS.md](AGENTS.md)、[04-CODEX-EXECUTION-PROTOCOL.md](04-CODEX-EXECUTION-PROTOCOL.md) 和 [CONTRIBUTING.md](CONTRIBUTING.md)。每个行为变更都需要测试，每条内置规则都需要正向和负向覆盖，并且每完成一个任务都要更新 `STATUS.md`。
