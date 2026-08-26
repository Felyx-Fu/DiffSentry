# Changesets

This directory contains release intents for AgentGuard's public workspace
packages. A release intent is a small Markdown file that names the package,
selects a semver bump, and explains the user-visible change.

## Contributor workflow

1. Run `pnpm changeset` from the repository root.
2. Select the affected public package or packages and the smallest appropriate
   semver bump.
3. Write a concise user-facing summary in the generated Markdown file.
4. Commit that file with the implementation change.
5. Run `pnpm changeset status` to inspect pending release intent without
   changing package versions.

The checked-in configuration keeps `@agentguard/github-action` private and
does not version or tag private packages. Public packages use independent
versions; no fixed or linked package groups are configured for v0.1.

This task only establishes the versioning foundation. Do not run
`changeset publish` locally. Publishing is reserved for the deliberate release
workflow and its later release checks.
