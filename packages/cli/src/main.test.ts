import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
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
  it("executes --help with the version and usage text", async () => {
    const { output, stderr, stdout } = createOutput();

    await expect(runCli(["--help"], output)).resolves.toBe(0);
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

  it("supports long and short version flags", async () => {
    const long = createOutput();
    await expect(runCli(["--version"], long.output)).resolves.toBe(0);
    expect(long.stdout).toEqual([`${CLI_VERSION}\n`]);
    expect(long.stderr).toEqual([]);

    const short = createOutput();
    await expect(runCli(["-v"], short.output)).resolves.toBe(0);
    expect(short.stdout).toEqual([`${CLI_VERSION}\n`]);
    expect(short.stderr).toEqual([]);
  });

  it("shows help for an empty invocation and rejects unsupported input", async () => {
    const empty = createOutput();
    await expect(runCli([], empty.output)).resolves.toBe(0);
    expect(empty.stdout).toEqual([CLI_HELP]);

    const unsupported = createOutput();
    await expect(runCli(["--unsupported"], unsupported.output)).resolves.toBe(
      1,
    );
    expect(unsupported.stdout).toEqual([]);
    expect(unsupported.stderr[0]).toContain("diffsentry --help");
  });

  it("dispatches explain to the built-in rule metadata", async () => {
    const { output, stderr, stdout } = createOutput();

    await expect(
      runCli(["explain", "security.secret-exposure"], output),
    ).resolves.toBe(0);
    expect(stderr).toEqual([]);
    expect(stdout.join("")).toContain("Rule: security.secret-exposure");
    expect(stdout.join("")).toContain("Default severity: critical");
  });

  it("reports unknown rules without network lookup", async () => {
    const { output, stderr, stdout } = createOutput();

    await expect(
      runCli(["explain", "security.not-a-built-in-rule"], output),
    ).resolves.toBe(1);
    expect(stdout).toEqual([]);
    expect(stderr.join("")).toContain("Unknown rule");
  });

  it("dispatches init and preserves the no-overwrite command contract", async () => {
    const directory = await mkdtemp(join(tmpdir(), "diffsentry-cli-main-"));

    try {
      const first = createOutput();
      await expect(
        runCli(["init"], first.output, { cwd: directory }),
      ).resolves.toBe(0);
      await expect(
        readFile(join(directory, "diffsentry.config.json"), "utf8"),
      ).resolves.toBe("{}\n");

      const second = createOutput();
      await expect(
        runCli(["init"], second.output, { cwd: directory }),
      ).resolves.toBe(0);
      expect(second.stdout.join("")).toContain("already exists");
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("rejects unknown check options and missing option values clearly", async () => {
    const missing = createOutput();
    await expect(runCli(["check", "--base"], missing.output)).resolves.toBe(1);
    expect(missing.stderr.join("")).toContain("Missing value for --base");

    const unknown = createOutput();
    await expect(
      runCli(["check", "--unsupported"], unknown.output),
    ).resolves.toBe(1);
    expect(unknown.stderr.join("")).toContain("Unknown check option");
  });
});
