#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import {
  CheckCommandConfigError,
  CheckCommandFormatError,
  type CheckCommandOptions,
  CheckCommandProjectError,
  renderCheckReport,
  runCheckPipeline,
} from "./commands/check.js";
import { runExplainCommand } from "./commands/explain.js";
import { runInitCommand } from "./commands/init.js";
import type { DiffSentryComposition } from "./composition/create-diffsentry.js";
import { createDiffSentry } from "./composition/create-diffsentry.js";
import { mapCliExitCode } from "./exit-codes.js";

export const CLI_VERSION = "0.1.0";

export interface CliOutput {
  readonly stdout: (text: string) => void;
  readonly stderr: (text: string) => void;
}

export interface CliRunOptions {
  readonly composition?: DiffSentryComposition;
  readonly cwd?: string;
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

class CliUsageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CliUsageError";
  }
}

interface ParsedCheckOptions {
  baseRef?: string;
  ci?: boolean;
  configPath?: string;
  format?: string;
  headRef?: string;
}

function takeOptionValue(
  args: readonly string[],
  index: number,
  option: string,
): { index: number; value: string } {
  const value = args[index + 1];
  if (value === undefined || value.startsWith("-")) {
    throw new CliUsageError(`Missing value for ${option}.`);
  }

  return { index: index + 1, value };
}

function parseCheckOptions(args: readonly string[]): ParsedCheckOptions {
  const parsed: ParsedCheckOptions = {};

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === undefined) {
      continue;
    }

    switch (argument) {
      case "--base": {
        const result = takeOptionValue(args, index, argument);
        parsed.baseRef = result.value;
        index = result.index;
        break;
      }
      case "--head": {
        const result = takeOptionValue(args, index, argument);
        parsed.headRef = result.value;
        index = result.index;
        break;
      }
      case "--config": {
        const result = takeOptionValue(args, index, argument);
        parsed.configPath = result.value;
        index = result.index;
        break;
      }
      case "--format": {
        const result = takeOptionValue(args, index, argument);
        parsed.format = result.value;
        index = result.index;
        break;
      }
      case "--ci":
        parsed.ci = true;
        break;
      default:
        if (argument.startsWith("-")) {
          throw new CliUsageError(`Unknown check option: ${argument}.`);
        }
        throw new CliUsageError(`Unexpected argument for check: ${argument}.`);
    }
  }

  return parsed;
}

function isExpectedCliError(error: unknown): error is Error {
  return (
    error instanceof CliUsageError ||
    error instanceof CheckCommandConfigError ||
    error instanceof CheckCommandFormatError ||
    error instanceof CheckCommandProjectError
  );
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.length > 0) {
    return error.message;
  }

  return "Unknown error";
}

function formatRuleExplanation(
  ruleId: string,
  metadata: {
    readonly category: string;
    readonly defaultSeverity: string;
    readonly description: string;
    readonly name: string;
  },
): string {
  return [
    `Rule: ${ruleId}`,
    `Name: ${metadata.name}`,
    `Category: ${metadata.category}`,
    `Default severity: ${metadata.defaultSeverity}`,
    `Description: ${metadata.description}`,
    "",
  ].join("\n");
}

async function dispatchCheck(
  args: readonly string[],
  output: CliOutput,
  options: CliRunOptions,
): Promise<number> {
  const parsed = parseCheckOptions(args);
  const composition = options.composition ?? createDiffSentry();
  const checkOptions: CheckCommandOptions = {
    ...parsed,
    composition,
    cwd: options.cwd ?? process.cwd(),
  };
  const outcome = await runCheckPipeline(checkOptions);

  if (outcome.kind === "not-a-repository") {
    throw new CheckCommandProjectError(
      `No Git repository was found from ${checkOptions.cwd}.`,
    );
  }

  output.stdout(`${renderCheckReport(outcome.format, outcome.report)}\n`);
  return mapCliExitCode({
    kind: "verdict",
    verdict: outcome.report.verdict,
  });
}

async function dispatchInit(
  args: readonly string[],
  output: CliOutput,
  options: CliRunOptions,
): Promise<number> {
  if (args.length > 0) {
    throw new CliUsageError("Usage: diffsentry init");
  }

  const outcome = await runInitCommand({ cwd: options.cwd ?? process.cwd() });
  if (outcome.kind === "created") {
    output.stdout(`Created ${outcome.path}\n`);
  } else {
    output.stdout(`Config already exists: ${outcome.path}\n`);
  }

  return 0;
}

async function dispatchExplain(
  args: readonly string[],
  output: CliOutput,
): Promise<number> {
  if (args.length !== 1 || args[0] === undefined) {
    throw new CliUsageError("Usage: diffsentry explain <rule-id>");
  }

  const outcome = runExplainCommand({ ruleId: args[0] });
  if (outcome.kind === "unknown") {
    throw new CliUsageError(`Unknown rule: ${outcome.ruleId}.`);
  }

  output.stdout(formatRuleExplanation(outcome.metadata.id, outcome.metadata));
  return 0;
}

export async function runCli(
  args: readonly string[],
  output: CliOutput = DEFAULT_OUTPUT,
  options: CliRunOptions = {},
): Promise<number> {
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

  try {
    const [command, ...commandArgs] = args;
    switch (command) {
      case "check":
        return await dispatchCheck(commandArgs, output, options);
      case "init":
        return await dispatchInit(commandArgs, output, options);
      case "explain":
        return await dispatchExplain(commandArgs, output);
      default:
        output.stderr("Unknown command or option. Use `diffsentry --help`.\n");
        return 1;
    }
  } catch (error) {
    if (isExpectedCliError(error)) {
      output.stderr(`${error.message}\n`);
      return 1;
    }

    output.stderr(`DiffSentry internal error: ${getErrorMessage(error)}\n`);
    return mapCliExitCode({ kind: "internal-error" });
  }
}

function isDirectExecution(): boolean {
  const entryPoint = process.argv[1];
  return (
    entryPoint !== undefined && fileURLToPath(import.meta.url) === entryPoint
  );
}

if (isDirectExecution()) {
  runCli(process.argv.slice(2)).then((exitCode) => {
    process.exitCode = exitCode;
  });
}
