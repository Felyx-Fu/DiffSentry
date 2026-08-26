# @felyx-fu/diffsentry-core

Core application and domain policies for DiffSentry v0.1. This package
contains deterministic finding aggregation, risk scoring, verdict calculation,
verification planning, and the ports used by composition roots.

The package does not import Node.js APIs, GitHub SDKs, UI frameworks, cloud
services, or LLM functionality.

The published entry point is the package root:

```ts
import { calculateRiskScore } from "@felyx-fu/diffsentry-core";
```
