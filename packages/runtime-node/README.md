# @agentguard/runtime-node

Node.js adapters for AgentGuard v0.1. The package provides the local
filesystem, Git, process, environment, and clock implementations used by
composition roots.

The adapters are runtime boundaries. Core and contract packages remain
independent of Node.js APIs.

The published entry point is the package root:

```ts
import { NodeGitProvider } from "@agentguard/runtime-node";
```
