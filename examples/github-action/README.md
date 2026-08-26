# DiffSentry workflow example

`diffsentry.yml` is the read-only, in-repository example for DiffSentry v0.1.
It checks pull-request and `main` push events, grants only `contents: read`,
and uses the Action inputs currently defined in `apps/github-action/action.yml`.

The relative `uses: ./apps/github-action` reference is intentionally used here
so the example does not claim an unpublished release tag. It becomes runnable
after AG-613 produces `apps/github-action/dist`. An external consumer should
replace that relative reference with a real published repository/ref after a
release exists; no such ref is asserted by this example.
