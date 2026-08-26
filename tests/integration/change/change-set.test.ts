import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { assembleChangeSet } from "../../../packages/core/src/domain/change/change-set.js";
import { NodeGitProvider } from "../../../packages/runtime-node/src/index.js";
import { createGitTestFixture } from "../../../packages/runtime-node/src/test-utils/git-fixture.js";

describe("ChangeSet integration", () => {
  it("assembles a ChangeSet from a real Git fixture diff", async () => {
    const fixture = await createGitTestFixture();
    const gitProvider = new NodeGitProvider();
    const sourceDirectory = join(fixture.directory, "src");

    try {
      await mkdir(sourceDirectory, { recursive: true });
      await fixture.writeFile("src/app.ts", "const before = true;\n");
      await fixture.writeFile("README.md", "before\n");
      await fixture.stage("src/app.ts");
      await fixture.stage("README.md");
      await fixture.commit("initial");
      await fixture.writeFile("src/app.ts", "const after = true;\n");
      await fixture.writeFile("README.md", "after\n");

      const rawDiff = await gitProvider.getWorkingTreeDiff(fixture.directory);
      const changeSet = assembleChangeSet(rawDiff, "HEAD", "WORKTREE");

      expect(changeSet).toEqual({
        baseRef: "HEAD",
        headRef: "WORKTREE",
        files: [
          {
            path: "README.md",
            status: "modified",
            additions: 1,
            deletions: 1,
            category: "documentation",
          },
          {
            path: "src/app.ts",
            status: "modified",
            additions: 1,
            deletions: 1,
            category: "source",
          },
        ],
      });
    } finally {
      await fixture.cleanup();
    }
  });
});
