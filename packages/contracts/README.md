# @agentguard/contracts

Public TypeScript contracts for AgentGuard v0.1 reports, findings, changes,
projects, verification results, and configuration values.

The package contains data types and the report schema version constant. It does
not read files, access Git, execute processes, or perform risk calculations.

The published entry point is the package root:

```ts
import type { Finding } from "@agentguard/contracts";
```
