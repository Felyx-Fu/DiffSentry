import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const gitCommandOptions = {
  shell: false,
  windowsHide: true,
} as const;

async function runGit(args: readonly string[]): Promise<void> {
  await execFileAsync("git", [...args], gitCommandOptions);
}

export interface GitTestFixture {
  readonly directory: string;
  writeFile(relativePath: string, contents: string): Promise<void>;
  stage(relativePath: string): Promise<void>;
  commit(message: string): Promise<void>;
  cleanup(): Promise<void>;
}

export async function createGitTestFixture(): Promise<GitTestFixture> {
  const directory = await mkdtemp(join(tmpdir(), "agentguard-git-fixture-"));

  try {
    await runGit(["init", "--quiet", directory]);
    await runGit(["-C", directory, "config", "user.name", "AgentGuard Test"]);
    await runGit([
      "-C",
      directory,
      "config",
      "user.email",
      "agentguard@example.invalid",
    ]);
  } catch (error) {
    await rm(directory, { recursive: true, force: true });
    throw error;
  }

  return {
    directory,
    async writeFile(relativePath: string, contents: string): Promise<void> {
      await writeFile(join(directory, relativePath), contents, "utf8");
    },
    async stage(relativePath: string): Promise<void> {
      await runGit(["-C", directory, "add", "--", relativePath]);
    },
    async commit(message: string): Promise<void> {
      await runGit(["-C", directory, "commit", "--quiet", "-m", message]);
    },
    async cleanup(): Promise<void> {
      await rm(directory, { recursive: true, force: true });
    },
  };
}
