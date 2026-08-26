# DiffSentry v0.1 JSON configuration

This document describes the complete v0.1 configuration surface. The checked-in
JSON Schema is [diffsentry.config.schema.json](../../diffsentry.config.schema.json);
the runtime validator additionally enforces the cross-field threshold rule.

## Configuration files

The only supported configuration filename is:

```text
diffsentry.config.json
```

The schema filename is `diffsentry.config.schema.json`. v0.1 accepts JSON data
only. These are intentionally unsupported:

- `diffsentry.config.ts`;
- `diffsentry.config.js`;
- dynamic imports of configuration;
- executable configuration hooks or functions.

Configuration is input data. It is never evaluated as JavaScript or TypeScript.

## Complete shape

The root object has three optional properties. Unknown root properties are
rejected, as are unknown properties inside any nested object.

```json
{}
```

The following is a complete schema-conforming example:

```json
{
  "verification": {
    "test": true,
    "lint": true,
    "typecheck": true,
    "build": false
  },
  "rules": {
    "security.secret-exposure": {
      "enabled": true,
      "severity": "critical"
    },
    "testing.source-without-tests": {
      "enabled": false,
      "severity": "high"
    }
  },
  "thresholds": {
    "review": 15,
    "fail": 50
  }
}
```

## Fields

### `verification`

`verification` is an optional object controlling the four recognized v0.1
verification intents. Every present value must be a boolean.

| Field | Type | Default | Meaning |
| --- | --- | --- | --- |
| `test` | boolean | `true` | Enable or disable the test verification intent. |
| `lint` | boolean | `true` | Enable or disable the lint verification intent. |
| `typecheck` | boolean | `true` | Enable or disable the typecheck verification intent. |
| `build` | boolean | `false` | Enable or disable the build verification intent. |

Only these four keys are valid. This section selects recognized verification
intents; it does not provide arbitrary commands or shell fragments.

### `rules`

`rules` is an optional object whose keys are rule IDs and whose values are
partial rule overrides. A rule override may contain either or both of these
fields:

| Field | Type | Meaning |
| --- | --- | --- |
| `enabled` | boolean | Enable or disable the rule. |
| `severity` | `info`, `low`, `medium`, `high`, or `critical` | Set the rule's configured severity. |

Rule IDs must match this schema pattern:

```text
(ci|dependency|security|testing)\.[a-z0-9]+(?:-[a-z0-9]+)*
```

The five built-in v0.1 rule IDs are:

- `ci.workflow-permission-change`;
- `dependency.runtime-dependency-added`;
- `security.secret-exposure`;
- `testing.auth-without-tests`;
- `testing.source-without-tests`.

The schema validates the rule ID shape and override data. A policy should use
registered rule IDs; a syntactically valid but unregistered ID is not a new
rule and does not add rule behavior.

### `thresholds`

`thresholds` is an optional object. When it is present in JSON configuration,
both fields are required:

| Field | Type | Range | Default |
| --- | --- | --- | --- |
| `review` | finite number | `0 <= review <= 100` | `15` |
| `fail` | finite number | `0 <= fail <= 100` | `50` |

The runtime validator additionally requires the pair to satisfy:

```text
0 <= review < fail <= 100
```

The thresholds only select the PASS/REVIEW/FAIL boundaries. They do not change
the v0.1 risk aggregation formula or introduce another score adjustment.

## Defaults

An omitted field inherits the following immutable defaults:

```json
{
  "verification": {
    "build": false,
    "lint": true,
    "test": true,
    "typecheck": true
  },
  "rules": {},
  "thresholds": {
    "fail": 50,
    "review": 15
  }
}
```

An empty `diffsentry.config.json` containing `{}` is therefore a valid way to
select the default policy.

## Precedence

Configuration is merged at field level in this order, from lowest to highest
precedence:

```text
v0.1 defaults  <  JSON config layer  <  CLI override layer
```

The higher layer wins only when it supplies that field. A missing field in the
higher layer does not erase a lower-layer value. Rule overrides are merged by
rule ID and then by their individual `enabled` and `severity` fields. The
resulting rule map is ordered deterministically by rule ID before validation.

Examples:

- a JSON value of `verification.lint: false` is replaced by a CLI value of
  `verification.lint: true` when the CLI layer supplies it;
- a JSON threshold of `review: 20` remains in force when the CLI layer supplies
  only `fail: 80`;
- a JSON rule override can set `enabled`, while a CLI override for the same rule
  can set only `severity`; both fields remain in the merged override.

The final merged object must still satisfy the complete v0.1 validation rules,
including `0 <= review < fail <= 100`.

## Loading and validation behavior

The config package exposes upward lookup for the fixed
`diffsentry.config.json` filename. The current check command also supports an
explicit configuration path through its composition API. Whichever loading
path is used, the contents go through JSON parsing and schema validation before
they become a configuration layer.

Invalid input is rejected rather than executed:

- malformed JSON is a configuration parse error;
- an unknown field or invalid nested value is an invalid-shape error;
- a missing or unreadable explicit path is a read error.

The `init` command creates only the minimal `{}` file when the fixed filename is
absent and never overwrites an existing configuration file.

For the normative trust boundary, see
[05-SECURITY-AND-TRUST-BOUNDARIES.md](../../05-SECURITY-AND-TRUST-BOUNDARIES.md).
For the architecture and composition boundary, see
[docs/architecture](../architecture) and
[02-ARCHITECTURE.md](../../02-ARCHITECTURE.md).
