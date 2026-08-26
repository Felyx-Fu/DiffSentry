export type VerificationStatus = "passed" | "failed" | "skipped" | "error";

export interface VerificationCommand {
  readonly executable: string;
  readonly args: readonly string[];
}

export interface VerificationOutputSummary {
  readonly text: string;
  readonly truncated: boolean;
}

export interface VerificationResult {
  readonly id: string;
  readonly status: VerificationStatus;
  readonly command: VerificationCommand;
  readonly durationMs: number;
  readonly exitCode: number | null;
  readonly stdout: VerificationOutputSummary;
  readonly stderr: VerificationOutputSummary;
}
