import { describe, expect, it } from "vitest";
import { CLI_HELP, CLI_VERSION, runCli } from "./main.js";

function createOutput(): {
  output: { stderr: (text: string) => void; stdout: (text: string) => void };
  stderr: string[];
  stdout: string[];
} {
  const stderr: string[] = [];
  const stdout: string[] = [];
  return {
    output: {
      stderr: (text) => stderr.push(text),
      stdout: (text) => stdout.push(text),
    },
    stderr,
    stdout,
  };
}

describe("runCli", () => {
  it("executes --help with the version and usage text", () => {
    const { output, stderr, stdout } = createOutput();

    expect(runCli(["--help"], output)).toBe(0);
    expect(stdout).toEqual([CLI_HELP]);
    expect(stdout[0]).toContain(`DiffSentry ${CLI_VERSION}`);
    expect(stdout[0]).toContain("diffsentry --help");
    expect(stderr).toEqual([]);
  });

  it("lists only supported commands and check options in help", () => {
    expect(CLI_HELP).toContain("diffsentry check [options]");
    expect(CLI_HELP).toContain("diffsentry init");
    expect(CLI_HELP).toContain("diffsentry explain <rule-id>");
    expect(CLI_HELP).toContain("--base <ref>");
    expect(CLI_HELP).toContain("--head <ref>");
    expect(CLI_HELP).toContain("--config <path>");
    expect(CLI_HELP).toContain("--format <terminal|json|markdown>");
    expect(CLI_HELP).toContain("--ci");
    expect(CLI_HELP).not.toContain("--force");
    expect(CLI_HELP).not.toContain("--network");
  });

  it("supports long and short version flags", () => {
    const long = createOutput();
    expect(runCli(["--version"], long.output)).toBe(0);
    expect(long.stdout).toEqual([`${CLI_VERSION}\n`]);
    expect(long.stderr).toEqual([]);

    const short = createOutput();
    expect(runCli(["-v"], short.output)).toBe(0);
    expect(short.stdout).toEqual([`${CLI_VERSION}\n`]);
    expect(short.stderr).toEqual([]);
  });

  it("shows help for an empty invocation and rejects unsupported input", () => {
    const empty = createOutput();
    expect(runCli([], empty.output)).toBe(0);
    expect(empty.stdout).toEqual([CLI_HELP]);

    const unsupported = createOutput();
    expect(runCli(["--unsupported"], unsupported.output)).toBe(1);
    expect(unsupported.stdout).toEqual([]);
    expect(unsupported.stderr[0]).toContain("diffsentry --help");
  });
});
