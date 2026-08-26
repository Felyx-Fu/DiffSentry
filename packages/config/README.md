# @agentguard/config

JSON configuration loading, parsing, validation, and deterministic merging for
AgentGuard v0.1.

Configuration is data in `agentguard.config.json`. This package does not load
TypeScript or JavaScript configuration and does not execute configuration as
code.

The published entry point is the package root:

```ts
import { validateConfig } from "@agentguard/config";
```
