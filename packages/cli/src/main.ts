#!/usr/bin/env node
import { fileURLToPath } from "node:url";

export const CLI_VERSION = "0.1.0";

export interface CliOutput {
  readonly stdout: (text: string) => void;
  readonly stderr: (text: string) => void;
}

export const CLI_HELP = `DiffSentry ${CLI_VERSION}

Usage:
  diffsentry check [options]
  diffsentry init
  diffsentry explain <rule-id>
  diffsentry --help
  diffsentry --version

Check options:
  --base <ref>                     Compare from a base Git ref.
  --head <ref>                     Compare to a head Git ref.
  --config <path>                  Read an explicit JSON config file.
  --format <terminal|json|markdown> Select report output format.
  --ci                             Use JSON output by default.
`;

const DEFAULT_OUTPUT: CliOutput = {
  stderr: (text) => process.stderr.write(text),
  stdout: (text) => process.stdout.write(text),
};

export function runCli(
  args: readonly string[],
  output: CliOutput = DEFAULT_OUTPUT,
): number {
  if (
    args.length === 0 ||
    (args.length === 1 && (args[0] === "--help" || args[0] === "-h"))
  ) {
    output.stdout(CLI_HELP);
    return 0;
  }

  if (args.length === 1 && (args[0] === "--version" || args[0] === "-v")) {
    output.stdout(`${CLI_VERSION}\n`);
    return 0;
  }

  output.stderr("Unknown command or option. Use `diffsentry --help`.\n");
  return 1;
}

function isDirectExecution(): boolean {
  const entryPoint = process.argv[1];
  return (
    entryPoint !== undefined && fileURLToPath(import.meta.url) === entryPoint
  );
}

if (isDirectExecution()) {
  process.exitCode = runCli(process.argv.slice(2));
}
