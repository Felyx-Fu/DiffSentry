import { execFile } from "node:child_process";
import { realpath } from "node:fs/promises";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const GIT_CHECK_TIMEOUT_MS = 5_000;
const GIT_OUTPUT_LIMIT_BYTES = 64 * 1024;

type RuntimeGitFileState =
  | "added"
  | "modified"
  | "deleted"
  | "renamed"
  | "untracked"
  | "unknown";

interface RuntimeGitStatusEntry {
  readonly path: string;
  readonly state: RuntimeGitFileState;
}

interface RuntimeGitStatus {
  readonly isClean: boolean;
  readonly entries: readonly RuntimeGitStatusEntry[];
}

function mapGitStatusCode(code: string): RuntimeGitFileState {
  switch (code) {
    case "A":
      return "added";
    case "D":
      return "deleted";
    case "M":
      return "modified";
    case "R":
    case "C":
      return "renamed";
    case "?":
      return "untracked";
    default:
      return "unknown";
  }
}

function parseGitStatus(output: string): RuntimeGitStatusEntry[] {
  return output
    .split(/\r?\n/)
    .filter((line) => line.length >= 3)
    .map((line) => {
      const indexCode = line[0] ?? " ";
      const worktreeCode = line[1] ?? " ";
      const statusCode = indexCode !== " " ? indexCode : worktreeCode;
      const rawPath = line.slice(3).trim();
      const renameSeparator = rawPath.indexOf(" -> ");
      const path =
        renameSeparator === -1
          ? rawPath
          : rawPath.slice(renameSeparator + " -> ".length);

      return {
        path,
        state: mapGitStatusCode(statusCode),
      };
    });
}

export class NodeGitProvider {
  private async runGit(args: readonly string[]): Promise<string> {
    const result = await execFileAsync("git", [...args], {
      encoding: "utf8",
      maxBuffer: GIT_OUTPUT_LIMIT_BYTES,
      shell: false,
      timeout: GIT_CHECK_TIMEOUT_MS,
      windowsHide: true,
    });

    return result.stdout;
  }

  async isRepository(path: string): Promise<boolean> {
    try {
      const output = await this.runGit([
        "-C",
        path,
        "rev-parse",
        "--is-inside-work-tree",
      ]);

      return output.trim() === "true";
    } catch {
      return false;
    }
  }

  async getRepositoryRoot(path: string): Promise<string | null> {
    try {
      const reportedRoot = (
        await this.runGit(["-C", path, "rev-parse", "--show-toplevel"])
      ).trim();

      if (reportedRoot.length === 0) {
        return null;
      }

      return await realpath(reportedRoot);
    } catch {
      return null;
    }
  }

  async getDiff(
    repositoryRoot: string,
    baseRef: string,
    headRef: string,
  ): Promise<string> {
    return this.runGit([
      "-C",
      repositoryRoot,
      "diff",
      "--no-ext-diff",
      "--no-color",
      "--end-of-options",
      baseRef,
      headRef,
      "--",
    ]);
  }

  async getWorkingTreeDiff(repositoryRoot: string): Promise<string> {
    return this.runGit([
      "-C",
      repositoryRoot,
      "diff",
      "--no-ext-diff",
      "--no-color",
      "HEAD",
      "--",
    ]);
  }

  async getStatus(repositoryRoot: string): Promise<RuntimeGitStatus> {
    const output = await this.runGit([
      "-C",
      repositoryRoot,
      "status",
      "--porcelain=v1",
      "--untracked-files=all",
    ]);
    const entries = parseGitStatus(output);

    return {
      isClean: entries.length === 0,
      entries,
    };
  }
}
