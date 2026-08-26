# Security and Trust Boundaries

AgentGuard inspects repositories and may execute repository-defined verification commands. This creates a meaningful trust boundary.

## 1. Security principles

1. No generated shell commands.
2. No string interpolation into a shell.
3. Use argument arrays.
4. `shell: false` by default.
5. Bound execution time.
6. Bound captured output.
7. Record exit code and duration.
8. Treat repository content as untrusted input.
9. Treat configuration as data, not executable code.
10. No network dependence in v0.1 core checks.

## 2. Process execution

Preferred conceptual call:

```ts
spawn(command, args, {
  shell: false
});
```

Forbidden patterns:

```ts
exec(`npm test ${userInput}`);
spawn(userInput, { shell: true });
```

## 3. Configuration

v0.1 accepts JSON configuration only.

Do not support:
- `agentguard.config.ts`
- `agentguard.config.js`
- dynamic `import()` of config
- executable config hooks

Reason: loading config must not become arbitrary code execution.

## 4. Repository scripts

AgentGuard may execute recognized repository scripts only through explicit verification planning.

The initial recognized verification intents are:
- test
- lint
- typecheck
- build

Do not invent arbitrary commands.

## 5. Secrets

Evidence/reporting must avoid printing full detected secret values.

When a secret-like value is detected:
- identify file/path;
- identify detector;
- redact value;
- retain only enough evidence to explain the finding.

## 6. Output limits

Process runner must support:
- timeout;
- stdout byte limit;
- stderr byte limit;
- truncation indicator.

Unbounded subprocess output is prohibited.

## 7. File access

Default behavior must remain repository-scoped where feasible.

Do not recursively scan unrelated parent directories.

## 8. Git input

Treat:
- refs;
- paths;
- filenames;
- commit metadata

as untrusted strings.

Do not construct shell commands from them.

## 9. GitHub Action

The action must use least privilege.

Do not request write permissions unless a feature explicitly requires it.

PR comment/write behavior, if implemented, must be separable from read-only checking.

## 10. LLM policy

No LLM calls in v0.1 core.

A future LLM layer, if added, must be advisory and separate from deterministic evidence unless a future ADR explicitly changes this.

## 11. Dependency policy

Security-sensitive dependencies require special scrutiny, especially packages that:
- spawn commands;
- parse Git;
- glob filesystem;
- load configuration;
- deserialize untrusted input.
