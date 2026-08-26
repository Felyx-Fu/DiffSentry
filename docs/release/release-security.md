# Release security: npm Trusted Publishing

## SEC-REL-001

DiffSentry's future npm publication path uses npm Trusted Publishing through
GitHub Actions OIDC. The migration is release-infrastructure hardening only;
it does not change product behavior, package names or versions, the v0.1 Risk
Model, the CLI, architecture, or the existing `v0.1.0` tag and GitHub Release.

The seven public packages configured for the trusted publisher are:

- `@felyx-fu/diffsentry`
- `@felyx-fu/diffsentry-contracts`
- `@felyx-fu/diffsentry-core`
- `@felyx-fu/diffsentry-runtime-node`
- `@felyx-fu/diffsentry-rules`
- `@felyx-fu/diffsentry-config`
- `@felyx-fu/diffsentry-report`

The authorized publisher identity is:

- GitHub owner: `Felyx-Fu`
- Repository: `DiffSentry`
- Workflow filename: `release.yml`
- Allowed action: `npm publish`

## Workflow controls

The production workflow is `.github/workflows/release.yml`. Its release job
retains the explicit `RELEASE` workflow confirmation and `main` branch guard,
runs on the GitHub-hosted `ubuntu-latest` runner with Node 24, and retains the
Changesets v2 flow. The job-scoped permissions retain only the existing
Changesets write permissions (`contents: write` and `pull-requests: write`) and
add `id-token: write` for npm OIDC authentication. The repository-wide default
remains read-only.

The workflow no longer references `NODE_AUTH_TOKEN` or `NPM_TOKEN`, and it does
not configure a registry auth token in `.npmrc`. The publish path remains
`pnpm changeset publish`; npm's CLI performs the OIDC exchange when the
authorized Changesets publish step runs. The workflow preserves
`create-github-releases: false` and `push-git-tags: false`.

Before the publish action, the workflow checks that the available npm CLI is
at least `11.5.1`, the current npm Trusted Publishing minimum. It does not
install or upgrade an unrelated dependency; a runner that does not satisfy the
minimum stops before publication.

## Token transition

DiffSentry v0.1.0 was originally bootstrapped with the temporary npm
`NPM_TOKEN`. The existing GitHub `NPM_TOKEN` secret may remain temporarily as
an emergency rollback credential, but its value was not accessed, it is no
longer referenced by the production release workflow, and this task does not
delete or revoke it.

After the next legitimate package release successfully publishes through OIDC,
the old npm token should be revoked and the GitHub `NPM_TOKEN` secret should be
deleted as a separate account/repository administration action.

## Validation boundary

Static workflow inspection and local quality gates can verify the OIDC
permissions, absence of token references, CLI version gate, and preserved
release controls. They cannot prove the npm-side trust exchange. Full OIDC
publication validation remains pending until the next legitimate release
performs a real OIDC-backed `npm publish`.

SEC-REL-001 does not run the release workflow, publish any package, create a
new package version, create an npm tag, create a Git tag, create a GitHub
Release, or use `NPM_TOKEN` for testing.
