import { mkdir, realpath } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  NodeFileSystem,
  NodeGitProvider,
  NodeProcessRunner,
} from "../../../packages/runtime-node/src/index.js";
import { createGitTestFixture } from "../../../packages/runtime-node/src/test-utils/git-fixture.js";

describe("runtime adapters integration", () => {
  it("composes filesystem, Git, and process adapters in a temporary repository", async () => {
    const fixture = await createGitTestFixture();
    const fileSystem = new NodeFileSystem();
    const gitProvider = new NodeGitProvider();
    const processRunner = new NodeProcessRunner();
    const trackedFilePath = join(fixture.directory, "tracked.txt");
    const nestedDirectory = join(fixture.directory, "nested");

    try {
      await fixture.writeFile("tracked.txt", "initial\n");
      await fixture.stage("tracked.txt");
      await fixture.commit("initial");
      await mkdir(nestedDirectory, { recursive: true });

      expect(await fileSystem.exists(trackedFilePath)).toBe(true);
      await expect(fileSystem.readText(trackedFilePath)).resolves.toBe(
        "initial\n",
      );
      await expect(
        fileSystem.findUp(nestedDirectory, "tracked.txt"),
      ).resolves.toBe(trackedFilePath);

      await fixture.writeFile("tracked.txt", "updated\n");
      await fixture.writeFile("untracked.txt", "not in diff\n");

      await expect(gitProvider.isRepository(nestedDirectory)).resolves.toBe(
        true,
      );
      await expect(
        gitProvider.getRepositoryRoot(nestedDirectory),
      ).resolves.toBe(await realpath(fixture.directory));
      await expect(gitProvider.getStatus(fixture.directory)).resolves.toEqual({
        isClean: false,
        entries: [
          { path: "tracked.txt", state: "modified" },
          { path: "untracked.txt", state: "untracked" },
        ],
      });

      const workingTreeDiff = await gitProvider.getWorkingTreeDiff(
        fixture.directory,
      );
      expect(workingTreeDiff).toContain("+updated");
      expect(workingTreeDiff).not.toContain("untracked.txt");

      const processResult = await processRunner.run({
        command: {
          executable: process.execPath,
          args: ["-e", "process.stdout.write(process.cwd())"],
        },
        cwd: fixture.directory,
        timeoutMs: 5_000,
        stdoutLimitBytes: 1024,
        stderrLimitBytes: 1024,
      });
      expect(processResult.exitCode).toBe(0);
      expect(await realpath(processResult.stdout.text)).toBe(
        await realpath(fixture.directory),
      );
    } finally {
      await fixture.cleanup();
    }
  });
});
