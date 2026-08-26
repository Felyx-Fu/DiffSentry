# 中文发布文案

Canonical repository：<https://github.com/Felyx-Fu/DiffSentry>

## V2EX 版本

### 标题

AI 写代码越来越快，但我想做一个“确定性验证器”，而不是再做一个 AI reviewer

### 正文

AI 辅助开发让写出一段代码变得更快，但“再让另一个 AI 判断它写得对不对”并
不能替代所有可复现的检查。

我做了 DiffSentry：它读取真实的 Git diff，运行能够执行的测试、lint、
typecheck、build 信号，应用五条确定性规则，收集脱敏证据，计算固定的
`RiskScore`，最后输出 `PASS` / `REVIEW` / `FAIL`。

它的定位不是否定 AI reviewer，而是把适合固定规则和真实验证器输出的那一层补
上。核心 CLI 本地运行，不使用 LLM 评分，也不依赖云端评分服务。

v0.1.0 已发布，Node.js 24 环境可以直接试：

```bash
npx @felyx-fu/diffsentry check
```

当前版本只有五条内置规则，GitHub Action 仍是私有集成产物，也不是完整 SAST 或
漏洞扫描替代品。欢迎反馈误报、证据是否有用，以及哪些确定性信号值得继续讨论。

项目地址：<https://github.com/Felyx-Fu/DiffSentry>

## 掘金 / 知乎短版

AI 生成代码之后，未必需要再找一个 AI 来评判它。DiffSentry 走的是另一条路：
运行真实检查、读取 Git 变更、使用固定规则、收集脱敏证据，并输出可复现的
`PASS` / `REVIEW` / `FAIL` 和 `RiskScore`。

v0.1.0 已发布，支持 Node.js 24，可直接运行：

```bash
npx @felyx-fu/diffsentry check
```

它目前包含五条内置规则，不使用 LLM 评分，不是完整 SAST 替代品。项目地址：
<https://github.com/Felyx-Fu/DiffSentry>

## GitHub 中文介绍短版

DiffSentry 是一个面向 AI 生成代码变更的确定性验证器：运行真实检查、收集脱敏
证据、计算固定风险分，并输出 `PASS` / `REVIEW` / `FAIL`。核心 CLI 本地运行，
v0.1.0 已通过 npm 发布。

```bash
npx @felyx-fu/diffsentry check
```

当前版本使用 Node.js 24，包含五条确定性规则，不使用 LLM 评分，也不宣称替代
完整 SAST 或漏洞扫描平台。
