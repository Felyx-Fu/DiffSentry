import { describe, expect, it } from "vitest";
import type {
  ProcessRequest,
  ProcessRunner,
} from "../../ports/process-runner.js";
import {
  VerificationExecutionCoordinator,
  type VerificationExecutionRequest,
} from "./verification-coordinator.js";
import type { PlannedVerification } from "./verification-planner.js";

const options = {
  timeoutMs: 1_000,
  stdoutLimitBytes: 1_024,
  stderrLimitBytes: 1_024,
} as const;

const requestBase = {
  repositoryRoot: "/repository",
  packageManager: "pnpm",
} as const;

function createRequest(
  plan: readonly PlannedVerification[],
): VerificationExecutionRequest {
  return { ...requestBase, plan };
}

describe("VerificationExecutionCoordinator", () => {
  it("maps a zero exit code to passed and forwards runner limits", async () => {
    let receivedRequest: ProcessRequest | undefined;
    const processRunner: ProcessRunner = {
      run: async (request) => {
        receivedRequest = request;
        return {
          command: request.command,
          cwd: request.cwd,
          stdout: { text: "ok", truncated: false },
          stderr: { text: "", truncated: false },
          exitCode: 0,
          durationMs: 12,
        };
      },
    };
    const coordinator = new VerificationExecutionCoordinator(
      processRunner,
      options,
    );

    await expect(
      coordinator.execute(
        createRequest([{ id: "test", source: "package-script" }]),
      ),
    ).resolves.toEqual([
      {
        id: "test",
        status: "passed",
        command: { id: "test", executable: "pnpm", args: ["run", "test"] },
        durationMs: 12,
        exitCode: 0,
        stdout: { text: "ok", truncated: false },
        stderr: { text: "", truncated: false },
      },
    ]);
    expect(receivedRequest).toMatchObject({
      cwd: "/repository",
      timeoutMs: 1_000,
      stdoutLimitBytes: 1_024,
      stderrLimitBytes: 1_024,
    });
  });

  it("maps a nonzero exit code to failed", async () => {
    const processRunner: ProcessRunner = {
      run: async (request) => ({
        command: request.command,
        cwd: request.cwd,
        stdout: { text: "", truncated: false },
        stderr: { text: "failed", truncated: false },
        exitCode: 2,
        durationMs: 5,
      }),
    };

    await expect(
      new VerificationExecutionCoordinator(processRunner, options).execute(
        createRequest([{ id: "lint", source: "package-script" }]),
      ),
    ).resolves.toMatchObject([{ id: "lint", status: "failed", exitCode: 2 }]);
  });

  it("maps a runner rejection to error", async () => {
    const processRunner: ProcessRunner = {
      run: async () => {
        throw new Error("injected failure");
      },
    };

    await expect(
      new VerificationExecutionCoordinator(processRunner, options).execute(
        createRequest([{ id: "test", source: "package-script" }]),
      ),
    ).resolves.toMatchObject([{ id: "test", status: "error", exitCode: null }]);
  });

  it("marks an unresolvable plan entry as skipped", async () => {
    const processRunner: ProcessRunner = {
      run: async () => {
        throw new Error("runner should not be called");
      },
    };

    await expect(
      new VerificationExecutionCoordinator(processRunner, options).execute(
        createRequest([{ id: "lint", source: "safe-default" }]),
      ),
    ).resolves.toMatchObject([
      { id: "lint", status: "skipped", command: null, exitCode: null },
    ]);
  });
});
