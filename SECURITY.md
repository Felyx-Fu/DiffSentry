# Security Policy

## Supported scope

Security reports are welcome for the current AgentGuard v0.1 development line,
including:

- process execution and argument handling;
- configuration loading and validation;
- repository and filesystem boundaries;
- secret detection and evidence redaction;
- GitHub Action permissions and execution behavior; and
- vulnerabilities introduced by the project’s own dependencies.

The security policy does not make a claim about third-party repositories that
AgentGuard inspects. Those repositories remain untrusted input, and their
maintainers are responsible for their own security response.

## Reporting a vulnerability

Please do not include secrets, working exploits, or sensitive reproduction
details in a public issue.

Use the private vulnerability-reporting channel provided by the project host
when that channel is enabled. If no private channel is available, open a
minimal public issue asking the maintainers to establish a private channel and
omit sensitive details.

A useful report should include, where safe to share:

- the affected AgentGuard version or commit;
- the affected file or component;
- a concise description of the security impact;
- safe reproduction steps or a minimal test case; and
- any suggested mitigation.

Maintainers will validate reports, coordinate remediation, and decide on
disclosure timing based on the nature and impact of the issue. No fixed
response or remediation time is promised.

## Security expectations for contributors

Contributors must preserve the project’s trust boundaries. In particular:

- repository content and configuration are untrusted input;
- external commands use argument arrays, `shell: false`, timeouts, and output
  limits;
- configuration is JSON data rather than executable code; and
- reports must redact full secret-like values.
