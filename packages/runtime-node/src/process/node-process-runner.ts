import { spawn } from "node:child_process";
import { performance } from "node:perf_hooks";

interface NodeProcessCommand {
  readonly executable: string;
  readonly args: readonly string[];
}

interface NodeProcessRequest {
  readonly command: NodeProcessCommand;
  readonly cwd: string;
  readonly timeoutMs: number;
  readonly stdoutLimitBytes: number;
  readonly stderrLimitBytes: number;
}

interface NodeProcessStreamOutput {
  readonly text: string;
  readonly truncated: boolean;
}

interface NodeProcessResult {
  readonly command: NodeProcessCommand;
  readonly cwd: string;
  readonly stdout: NodeProcessStreamOutput;
  readonly stderr: NodeProcessStreamOutput;
  readonly exitCode: number | null;
  readonly durationMs: number;
}

export type ProcessErrorCode = "spawn-failed" | "timeout";

export class ProcessError extends Error {
  readonly code: ProcessErrorCode;
  readonly executable: string;
  readonly cwd: string;
  readonly timeoutMs: number;

  constructor(
    code: ProcessErrorCode,
    executable: string,
    cwd: string,
    timeoutMs: number,
  ) {
    const message =
      code === "timeout"
        ? `Process timed out after ${timeoutMs} millisecond(s)`
        : `Failed to spawn process: ${executable}`;
    super(message);
    this.name = "ProcessError";
    this.code = code;
    this.executable = executable;
    this.cwd = cwd;
    this.timeoutMs = timeoutMs;
  }
}

interface OutputCapture {
  readonly chunks: Buffer[];
  bytes: number;
  truncated: boolean;
}

function normalizeLimit(limitBytes: number): number {
  if (!Number.isFinite(limitBytes) || limitBytes <= 0) {
    return 0;
  }

  return Math.floor(limitBytes);
}

function captureChunk(
  capture: OutputCapture,
  chunk: Buffer | string,
  limitBytes: number,
): void {
  const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, "utf8");
  const remainingBytes = Math.max(limitBytes - capture.bytes, 0);

  if (remainingBytes > 0) {
    const retained = buffer.subarray(0, remainingBytes);
    capture.chunks.push(retained);
    capture.bytes += retained.byteLength;
  }

  if (buffer.byteLength > remainingBytes) {
    capture.truncated = true;
  }
}

function finishCapture(capture: OutputCapture): NodeProcessStreamOutput {
  return {
    text: Buffer.concat(capture.chunks).toString("utf8"),
    truncated: capture.truncated,
  };
}

export class NodeProcessRunner {
  run(request: NodeProcessRequest): Promise<NodeProcessResult> {
    const stdoutLimitBytes = normalizeLimit(request.stdoutLimitBytes);
    const stderrLimitBytes = normalizeLimit(request.stderrLimitBytes);
    const startedAt = performance.now();

    return new Promise((resolve, reject) => {
      const child = spawn(
        request.command.executable,
        [...request.command.args],
        {
          cwd: request.cwd,
          shell: false,
          windowsHide: true,
        },
      );
      const stdoutCapture: OutputCapture = {
        chunks: [],
        bytes: 0,
        truncated: false,
      };
      const stderrCapture: OutputCapture = {
        chunks: [],
        bytes: 0,
        truncated: false,
      };
      let settled = false;
      let timedOut = false;
      let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

      const clearTimeoutHandle = (): void => {
        if (timeoutHandle !== undefined) {
          clearTimeout(timeoutHandle);
          timeoutHandle = undefined;
        }
      };

      child.stdout?.on("data", (chunk: Buffer | string) => {
        captureChunk(stdoutCapture, chunk, stdoutLimitBytes);
      });
      child.stderr?.on("data", (chunk: Buffer | string) => {
        captureChunk(stderrCapture, chunk, stderrLimitBytes);
      });
      child.once("error", () => {
        if (settled) {
          return;
        }

        if (timedOut) {
          return;
        }

        settled = true;
        clearTimeoutHandle();
        reject(
          new ProcessError(
            "spawn-failed",
            request.command.executable,
            request.cwd,
            request.timeoutMs,
          ),
        );
      });
      child.once("close", (exitCode: number | null) => {
        if (settled) {
          return;
        }

        settled = true;
        clearTimeoutHandle();

        if (timedOut) {
          reject(
            new ProcessError(
              "timeout",
              request.command.executable,
              request.cwd,
              request.timeoutMs,
            ),
          );
          return;
        }

        resolve({
          command: {
            executable: request.command.executable,
            args: [...request.command.args],
          },
          cwd: request.cwd,
          stdout: finishCapture(stdoutCapture),
          stderr: finishCapture(stderrCapture),
          exitCode,
          durationMs: Math.max(0, Math.round(performance.now() - startedAt)),
        });
      });

      if (Number.isFinite(request.timeoutMs) && request.timeoutMs > 0) {
        timeoutHandle = setTimeout(
          () => {
            if (settled) {
              return;
            }

            timedOut = true;
            child.kill();
          },
          Math.max(1, Math.floor(request.timeoutMs)),
        );
      }
    });
  }
}
