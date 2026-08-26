# DiffSentry

**验证 diff，相信证据。**

面向 AI 生成代码变更的确定性验证。

DiffSentry 针对 Git 变更运行客观检查和确定性规则，收集经过脱敏处理的
证据，计算可复现的 `RiskScore`，并输出 `PASS`、`REVIEW` 或 `FAIL`。

它不是让另一个 AI 来评判 AI 写的代码，而是补上最适合确定性验证的那一
部分。核心 CLI 在本地运行，不需要云端服务。

[![npm version](https://img.shields.io/npm/v/%40felyx-fu%2Fdiffsentry?logo=npm)](https://www.npmjs.com/package/@felyx-fu/diffsentry)
[![CI](https://github.com/Felyx-Fu/DiffSentry/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Felyx-Fu/DiffSentry/actions/workflows/ci.yml)
[![License](https://img.shields.io/github/license/Felyx-Fu/DiffSentry)](https://github.com/Felyx-Fu/DiffSentry/blob/main/LICENSE)
[![Release](https://img.shields.io/github/v/release/Felyx-Fu/DiffSentry)](https://github.com/Felyx-Fu/DiffSentry/releases/tag/v0.1.0)

## 一条命令开始

在安装了 Node.js 24 的 Git 仓库中运行：

```bash
npx @felyx-fu/diffsentry check
```

下面是已经通过仓库 E2E fixture 验证的真实终端报告形状。fixture 中使用的
是合成的 secret-like 值，输出不会泄漏原始值：

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

`FAIL` 裁决对应 CLI 退出码 `2`；证据会保留足够的解释信息，但会对匹配到的
值进行脱敏。

## 为什么是 DiffSentry？

AI 辅助开发很有价值，但再让一个模型判断前一个模型写得对不对，并不能覆盖
所有适合自动验证的问题。DiffSentry 关注输入、检查过程和结果都可以在本地
复现的部分。

| 另一个 AI reviewer 可能提供 | DiffSentry 提供 |
| --- | --- |
| 概率性的意见 | 确定性的证据 |
| 受模型、API 或上下文影响的结果 | 对相同输入和信号给出相同结果 |
| “模型认为哪里有问题”的解释 | 检查和规则实际观察到的证据 |
| 依赖模型服务的审查路径 | 基于真实 Git 变更的本地优先执行 |
| 让 LLM 评判另一个 LLM 的输出 | 客观检查和明确的 `PASS` / `REVIEW` / `FAIL` |

DiffSentry 不是要否定 AI reviewer，而是为 AI 辅助开发补上适合固定规则、真实
验证器输出和脱敏证据的那一层。

## 快速开始

DiffSentry v0.1.0 已正式发布，公共 npm CLI 不需要全局安装：

```bash
# 使用当前 v0.1 版本线
npx @felyx-fu/diffsentry check

# 需要可复现时固定到已发布版本
npx @felyx-fu/diffsentry@0.1.0 check
```

常用命令：

```bash
npx @felyx-fu/diffsentry --help
npx @felyx-fu/diffsentry@0.1.0 --version
npx @felyx-fu/diffsentry check --format json --ci
```

`--ci` 默认选择 JSON 输出。CLI 退出码为：`0` 表示 `PASS`，`1` 表示
`REVIEW`，`2` 表示 `FAIL`，`3` 表示 DiffSentry 内部错误。v0.1 package 要求
Node.js `>=24 <25`。

## 工作方式

```text
Git diff
  ↓
项目信号
  ↓
验证计划
  ↓
测试 / lint / typecheck / build
  ↓
确定性规则
  ↓
脱敏证据
  ↓
RiskScore
  ↓
PASS / REVIEW / FAIL
```

同一份报告模型可以渲染为终端、JSON 或 Markdown。核心流程优先在本地运行，
运行时能力通过明确的适配器边界接入。

## 五条内置规则

DiffSentry v0.1 当前包含五条确定性规则：

- `security.secret-exposure` — 检测高信号的 secret-like 赋值，并对证据中的匹配值脱敏。
- `testing.source-without-tests` — 识别没有相关变更测试的源码变更。
- `testing.auth-without-tests` — 识别没有相关变更测试的认证相关变更。
- `dependency.runtime-dependency-added` — 检测新增的运行时依赖。
- `ci.workflow-permission-change` — 检测扩展 GitHub workflow 权限的变更。

每个 finding 都包含严重程度、规则 ID 和证据。规则注册表是静态且可解释的；
v0.1 不动态加载第三方规则。

## RiskScore

`RiskScore` 是确定性的。v0.1 将固定的 finding severity 权重与固定的验证惩罚
相加，并将最终结果封顶为 `100`。finding 的 confidence 只是证据元数据，不会
改变分数。默认阈值为 `review = 15`、`fail = 50`。

规范权重、验证惩罚、聚合方式和 verifier error 的区别见
[项目章程](01-PROJECT-CHARTER.md) 与[架构规范](02-ARCHITECTURE.md#8-risk-model)。

## GitHub Action

仓库还包含一个私有 GitHub Action bundle，复用同一套核心验证模型。使用示例只
需要由 consuming workflow 明确声明只读的 `contents: read` 权限；Action 只写入
runner 本地的 step summary、outputs 和 annotations。

v0.1 的 Action 仍是私有集成产物，不宣称已经发布到 Marketplace，也不是托管式
服务。

## v0.1 当前边界

DiffSentry v0.1 有意保持聚焦：

- 仅支持 Node.js 24；
- 五条确定性内置规则；
- 本地 CLI、npm packages 和私有 GitHub Action bundle；
- JSON 配置以及 terminal/JSON/Markdown 报告；
- 不使用 LLM 评分或基于网络的评分；
- 不提供云服务、dashboard、database、authentication 或 enterprise policy platform；
- 不是完整的 SAST 或漏洞扫描替代品；
- 深层 public package-boundary 分析仍是 deferred placeholder。

这些边界本身也是可信度的一部分：工具只报告能够真正收集的证据，不承诺一个
尚未实现的更大扫描器。

## 文档

- [Launch demo 脚本](docs/launch/demo-script.md)
- [发布说明](docs/release/v0.1.0.md)
- [发布检查清单](docs/release/v0.1-checklist.md)
- [架构概览](docs/architecture/README.md)
- [证据规范](docs/specs/evidence.md)
- [配置规范](docs/specs/config.md)
- [CLI 退出码](docs/specs/exit-codes.md)
- [安全与信任边界](05-SECURITY-AND-TRUST-BOUNDARIES.md)

## 参与贡献

修改仓库前请阅读 [AGENTS.md](AGENTS.md)、
[04-CODEX-EXECUTION-PROTOCOL.md](04-CODEX-EXECUTION-PROTOCOL.md) 和
[CONTRIBUTING.md](CONTRIBUTING.md)。行为变更需要测试，每条内置规则都需要正向
和负向覆盖，并且每完成一个任务都要更新 `STATUS.md`。

DiffSentry 使用 [MIT License](LICENSE) 开源。
