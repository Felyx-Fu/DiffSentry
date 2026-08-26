---
name: Bug report
about: Report a reproducible DiffSentry problem without sharing sensitive data
title: "[Bug]: "
labels: "bug,needs-triage"
assignees: ""
---

## Summary

Describe the observed problem in one or two sentences.

## Environment

- DiffSentry version or commit:
- Operating system and version:
- Node.js version:
- pnpm version (if applicable):
- CLI, GitHub Action, or package surface:
- Shell/terminal (if relevant):

## Safe reproduction

List the smallest safe sequence that reproduces the problem.

1.
2.
3.

Use a synthetic repository or a public fixture whenever possible. Do not attach
private repositories, production data, credentials, access tokens, private
keys, cookies, or other confidential material. If a log or fixture contains
sensitive content, replace it with a clear placeholder such as `<redacted>`.

## Expected behavior

What should DiffSentry have done? Include the expected verdict, report field,
status, or exit code when applicable.

## Actual behavior

What happened instead? Include the observed verdict, report field, status, exit
code, error class, or concise message when applicable.

## Minimal fixture or diff

Provide a small synthetic before/after snippet or a link to a safe public
fixture. Keep paths and values minimal. Never include a real secret to reproduce
a secret-detection issue; use a synthetic placeholder and explain the detector
shape instead.

```text
Before:

After:
```

## Safe output

Paste only the smallest relevant, fully reviewed output. Redact repository
names, user names, absolute paths, tokens, keys, URLs with credentials, and
other sensitive values before posting.

```text
<redacted output>
```

## Additional context

- Does the issue reproduce deterministically?
- Does it occur on a clean checkout or only with existing local changes?
- Is the issue specific to a report format, verifier, rule, configuration
  field, or integration boundary?
- Are there any known false positives or false negatives?

## Checklist

- [ ] I provided a version/commit and platform.
- [ ] I provided a minimal, reproducible, safe fixture or reproduction path.
- [ ] I compared expected and actual behavior.
- [ ] I removed secrets and confidential data from all attachments and output.
- [ ] I used synthetic values instead of real credentials or production data.
- [ ] I searched the existing issues for a duplicate.
