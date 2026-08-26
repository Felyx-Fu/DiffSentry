# DiffSentry launch demo script

## Goal

This script describes a repeatable 15–25 second terminal recording for the
released `@felyx-fu/diffsentry` CLI. It demonstrates one deterministic
secret-exposure finding without using a real credential, private path, username,
token, or email address.

The demo is a product walkthrough, not a benchmark. It shows that a synthetic
credential-like assignment produces a redacted finding, a `50/100` risk score,
and a `FAIL` verdict.

## One-time disposable setup

Use a new disposable directory outside the DiffSentry checkout. The commands
below create a tiny Git repository with one baseline file and then apply the
same synthetic fixture shape used by the verified E2E flow.

### POSIX shell

```bash
mkdir diffsentry-launch-demo
cd diffsentry-launch-demo
git init
git config user.name "DiffSentry Demo"
git config user.email "demo@example.invalid"
printf '%s\n' '{"name":"diffsentry-launch-demo","packageManager":"npm@10.0.0"}' > package.json
printf '%s\n' 'export const safe = true;' > secret.ts
git add package.json secret.ts
git commit -m baseline

printf '%s\n' 'const token = "0123456789abcdef";' '' 'export { token };' > secret.ts
```

### PowerShell

```powershell
New-Item -ItemType Directory -Path diffsentry-launch-demo | Out-Null
Set-Location diffsentry-launch-demo
git init
git config user.name "DiffSentry Demo"
git config user.email "demo@example.invalid"
@'
{"name":"diffsentry-launch-demo","packageManager":"npm@10.0.0"}
'@ | Set-Content -Encoding utf8 package.json
'export const safe = true;' | Set-Content -Encoding utf8 secret.ts
git add package.json secret.ts
git commit -m baseline

@'
const token = "0123456789abcdef";

export { token };
'@ | Set-Content -Encoding utf8 secret.ts
```

The value `0123456789abcdef` is synthetic fixture data only. Do not substitute
a real credential.

## Warm up before recording

Run this once outside the recording so the capture does not include npm's first
download prompt:

```bash
npx @felyx-fu/diffsentry@0.1.0 --version
```

Expected output is `0.1.0`.

## Recording sequence

1. Start on the disposable repository after the baseline commit.
2. Apply the synthetic change shown above before pressing record.
3. Show only a short repository state cue, such as `git status --short`; do not
   show the fake assignment itself if the recording should focus on the result.
4. Run:

   ```bash
   npx @felyx-fu/diffsentry check
   ```

5. Pause on `Verdict: FAIL`, `Risk score: 50/100`, and the redacted evidence.
6. Stop after the report. The expected process exit code is `2`; that is the
   intentional result of the synthetic failing check, not a recording error.

The terminal output has this verified shape:

```text
DiffSentry 0.1.0
Verdict: FAIL
Risk score: 50/100
Findings: 1
Verifications: 0

Findings:
- [CRITICAL] Secret exposure (security.secret-exposure)
  High-signal secret-like material detected in secret.ts; matched values are redacted.
  Evidence: Potential credential-assignment detected; matched value redacted. at secret.ts:1:7-1:32

Verifications: none
```

## Capture hygiene

- Crop or hide the shell prompt if it contains a personal path or username.
- Do not show real credentials, environment variables, npm tokens, private
  repository names, email addresses, or registry output.
- Keep the fake fixture value synthetic and redacted in the final frame.
- Do not add a dependency, application, cloud service, or extra rule for this
  demo.
- Repeat the demo from the same baseline when producing a new recording.
