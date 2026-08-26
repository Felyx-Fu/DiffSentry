# @agentguard/rules

Deterministic built-in AgentGuard v0.1 rules and the static rule registry.
Rules classify repository changes and return explainable findings with
bounded evidence.

The package does not load dynamic plugins, call a network service, execute
arbitrary shell strings, or use an LLM.

The published entry point is the package root:

```ts
import { BUILT_IN_RULES } from "@agentguard/rules";
```
