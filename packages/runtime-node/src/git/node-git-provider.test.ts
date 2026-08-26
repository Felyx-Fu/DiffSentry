import { mkdir, mkdtemp, realpath, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { createGitTestFixture } from "../test-utils/git-fixture.js";
import { NodeGitProvider } from "./node-git-provider.js";

describe("NodeGitProvider.isRepository", () => {
  const gitProvider = new NodeGitProvider();

  it("returns true for a real Git worktree", async () => {
    const fixture = await createGitTestFixture();

    try {
      await expect(gitProvider.isRepository(fixture.directory)).resolves.toBe(
        true,
      );
    } finally {
      await fixture.cleanup();
    }
  });

  it("returns false for a directory outside Git", async () => {
    const directory = await mkdtemp(join(tmpdir(), "diffsentry-non-git-"));

    try {
      await expect(gitProvider.isRepository(directory)).resolves.toBe(false);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("resolves the canonical root from a nested working directory", async () => {
    const fixture = await createGitTestFixture();
    const nestedDirectory = join(fixture.directory, "nested", "working-tree");

    try {
      await mkdir(nestedDirectory, { recursive: true });
      await expect(
        gitProvider.getRepositoryRoot(nestedDirectory),
      ).resolves.toBe(await realpath(fixture.directory));
    } finally {
      await fixture.cleanup();
    }
  });

  it("reports a clean repository with no status entries", async () => {
    const fixture = await createGitTestFixture();

    try {
      await expect(gitProvider.getStatus(fixture.directory)).resolves.toEqual({
        isClean: true,
        entries: [],
      });
    } finally {
      await fixture.cleanup();
    }
  });

  it("reports an untracked file in a dirty repository", async () => {
    const fixture = await createGitTestFixture();

    try {
      await fixture.writeFile("untracked.txt", "untracked");
      await expect(gitProvider.getStatus(fixture.directory)).resolves.toEqual({
        isClean: false,
        entries: [{ path: "untracked.txt", state: "untracked" }],
      });
    } finally {
      await fixture.cleanup();
    }
  });
});

describe("NodeGitProvider.getDiff", () => {
  const gitProvider = new NodeGitProvider();

  it("returns raw diff text between valid refs", async () => {
    const fixture = await createGitTestFixture();

    try {
      await fixture.writeFile("tracked.txt", "first line\n");
      await fixture.stage("tracked.txt");
      await fixture.commit("initial");
      await fixture.writeFile("tracked.txt", "first line\nsecond line\n");
      await fixture.stage("tracked.txt");
      await fixture.commit("second");

      const diff = await gitProvider.getDiff(
        fixture.directory,
        "HEAD~1",
        "HEAD",
      );

      expect(diff).toContain("diff --git a/tracked.txt b/tracked.txt");
      expect(diff).toContain("+second line");
    } finally {
      await fixture.cleanup();
    }
  });

  it("returns an empty string for identical valid refs", async () => {
    const fixture = await createGitTestFixture();

    try {
      await fixture.writeFile("tracked.txt", "content\n");
      await fixture.stage("tracked.txt");
      await fixture.commit("initial");

      await expect(
        gitProvider.getDiff(fixture.directory, "HEAD", "HEAD"),
      ).resolves.toBe("");
    } finally {
      await fixture.cleanup();
    }
  });

  it("rejects an invalid ref without constructing a shell command", async () => {
    const fixture = await createGitTestFixture();

    try {
      await expect(
        gitProvider.getDiff(fixture.directory, "does-not-exist", "HEAD"),
      ).rejects.toBeDefined();
    } finally {
      await fixture.cleanup();
    }
  });
});

describe("NodeGitProvider.getWorkingTreeDiff", () => {
  const gitProvider = new NodeGitProvider();

  it("includes tracked changes and excludes untracked content", async () => {
    const fixture = await createGitTestFixture();

    try {
      await fixture.writeFile("tracked.txt", "first line\n");
      await fixture.stage("tracked.txt");
      await fixture.commit("initial");
      await fixture.writeFile("tracked.txt", "first line\nsecond line\n");
      await fixture.stage("tracked.txt");
      await fixture.writeFile("untracked.txt", "must not appear\n");

      const diff = await gitProvider.getWorkingTreeDiff(fixture.directory);

      expect(diff).toContain("diff --git a/tracked.txt b/tracked.txt");
      expect(diff).toContain("+second line");
      expect(diff).not.toContain("untracked.txt");
      expect(diff).not.toContain("must not appear");
    } finally {
      await fixture.cleanup();
    }
  });
});
