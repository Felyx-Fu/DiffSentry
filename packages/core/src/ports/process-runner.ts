export interface ProcessCommand {
  readonly executable: string;
  readonly args: readonly string[];
}

export interface ProcessRequest {
  readonly command: ProcessCommand;
  readonly cwd: string;
  readonly timeoutMs: number;
  readonly stdoutLimitBytes: number;
  readonly stderrLimitBytes: number;
}

export interface ProcessStreamOutput {
  readonly text: string;
  readonly truncated: boolean;
}

export interface ProcessResult {
  readonly command: ProcessCommand;
  readonly cwd: string;
  readonly stdout: ProcessStreamOutput;
  readonly stderr: ProcessStreamOutput;
  readonly exitCode: number | null;
  readonly durationMs: number;
}

export interface ProcessRunner {
  run(request: ProcessRequest): Promise<ProcessResult>;
}
