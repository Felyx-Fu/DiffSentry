import { describe, expect, it } from "vitest";
import { NodeProcessRunner, ProcessError } from "./node-process-runner.js";

describe("NodeProcessRunner", () => {
  it("executes an executable with an argument array without a shell", async () => {
    const processRunner = new NodeProcessRunner();

    const result = await processRunner.run({
      command: {
        executable: process.execPath,
        args: ["-e", "process.stdout.write('agentguard')"],
      },
      cwd: process.cwd(),
      timeoutMs: 5_000,
      stdoutLimitBytes: 1024,
      stderrLimitBytes: 1024,
    });

    expect(result.command).toEqual({
      executable: process.execPath,
      args: ["-e", "process.stdout.write('agentguard')"],
    });
    expect(result.stdout).toEqual({ text: "agentguard", truncated: false });
    expect(result.stderr).toEqual({ text: "", truncated: false });
    expect(result.exitCode).toBe(0);
  });

  it("terminates a process that exceeds the configured timeout", async () => {
    const processRunner = new NodeProcessRunner();

    await expect(
      processRunner.run({
        command: {
          executable: process.execPath,
          args: ["-e", "setTimeout(() => {}, 10_000)"],
        },
        cwd: process.cwd(),
        timeoutMs: 50,
        stdoutLimitBytes: 1024,
        stderrLimitBytes: 1024,
      }),
    ).rejects.toMatchObject({
      code: "timeout",
      name: "ProcessError",
    });
  });

  it("bounds captured stdout and marks truncation", async () => {
    const processRunner = new NodeProcessRunner();

    const result = await processRunner.run({
      command: {
        executable: process.execPath,
        args: ["-e", "process.stdout.write('x'.repeat(4096))"],
      },
      cwd: process.cwd(),
      timeoutMs: 5_000,
      stdoutLimitBytes: 64,
      stderrLimitBytes: 1024,
    });

    expect(result.stdout.text).toHaveLength(64);
    expect(Buffer.byteLength(result.stdout.text, "utf8")).toBe(64);
    expect(result.stdout.truncated).toBe(true);
    expect(result.exitCode).toBe(0);
  });

  it("bounds captured stderr and marks truncation", async () => {
    const processRunner = new NodeProcessRunner();

    const result = await processRunner.run({
      command: {
        executable: process.execPath,
        args: ["-e", "process.stderr.write('e'.repeat(4096))"],
      },
      cwd: process.cwd(),
      timeoutMs: 5_000,
      stdoutLimitBytes: 1024,
      stderrLimitBytes: 64,
    });

    expect(result.stderr.text).toHaveLength(64);
    expect(Buffer.byteLength(result.stderr.text, "utf8")).toBe(64);
    expect(result.stderr.truncated).toBe(true);
    expect(result.exitCode).toBe(0);
  });

  it("returns a nonzero exit code and measured duration", async () => {
    const processRunner = new NodeProcessRunner();

    const result = await processRunner.run({
      command: {
        executable: process.execPath,
        args: ["-e", "setTimeout(() => process.exit(7), 50)"],
      },
      cwd: process.cwd(),
      timeoutMs: 5_000,
      stdoutLimitBytes: 1024,
      stderrLimitBytes: 1024,
    });

    expect(result.exitCode).toBe(7);
    expect(result.durationMs).toBeGreaterThanOrEqual(25);
  });

  it("maps spawn failures to a typed process error", async () => {
    const processRunner = new NodeProcessRunner();

    const result = processRunner.run({
      command: {
        executable: "agentguard-command-that-does-not-exist",
        args: [],
      },
      cwd: process.cwd(),
      timeoutMs: 5_000,
      stdoutLimitBytes: 1024,
      stderrLimitBytes: 1024,
    });

    await expect(result).rejects.toBeInstanceOf(ProcessError);
    await expect(result).rejects.toMatchObject({
      code: "spawn-failed",
      name: "ProcessError",
    });
  });
});
