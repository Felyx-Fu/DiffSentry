# DiffSentry GitHub Action

## Permission contract

The action metadata does not request GitHub token permissions. A consuming
workflow should declare the narrow read-only permission it needs explicitly:

```yaml
permissions:
  contents: read
```

The v0.1 Action reads the checked-out repository and the runner-provided event
payload, then writes only runner-local outputs such as the step summary,
action outputs, and workflow-command annotations. It does not require
`pull-requests: write`, `issues: write`, `contents: write`, or any other write
permission. Pull-request comments and GitHub API mutations are outside this
read-only boundary.
