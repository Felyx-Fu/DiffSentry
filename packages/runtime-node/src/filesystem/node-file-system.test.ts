import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { FileSystemError, NodeFileSystem } from "./node-file-system.js";

describe("NodeFileSystem.exists", () => {
  const fileSystem = new NodeFileSystem();

  it("returns true for an existing file", async () => {
    const directory = await mkdtemp(join(tmpdir(), "agentguard-fs-"));
    const filePath = join(directory, "present.txt");

    try {
      await writeFile(filePath, "present", "utf8");
      await expect(fileSystem.exists(filePath)).resolves.toBe(true);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("returns false for a missing file", async () => {
    const directory = await mkdtemp(join(tmpdir(), "agentguard-fs-"));
    const filePath = join(directory, "missing.txt");

    try {
      await expect(fileSystem.exists(filePath)).resolves.toBe(false);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("reads UTF-8 text without changing its contents", async () => {
    const directory = await mkdtemp(join(tmpdir(), "agentguard-fs-"));
    const filePath = join(directory, "text.txt");
    const contents = "AgentGuard\n安全边界";

    try {
      await writeFile(filePath, contents, "utf8");
      await expect(fileSystem.readText(filePath)).resolves.toBe(contents);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("maps a missing read to a typed filesystem error", async () => {
    const directory = await mkdtemp(join(tmpdir(), "agentguard-fs-"));
    const filePath = join(directory, "missing.txt");

    try {
      await expect(fileSystem.readText(filePath)).rejects.toBeInstanceOf(
        FileSystemError,
      );
      await expect(fileSystem.readText(filePath)).rejects.toMatchObject({
        code: "not-found",
        path: filePath,
      });
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("finds a named file in an ancestor directory", async () => {
    const directory = await mkdtemp(join(tmpdir(), "agentguard-fs-"));
    const nestedDirectory = join(directory, "nested", "deeper");
    const markerPath = join(directory, "agentguard.marker");

    try {
      await mkdir(nestedDirectory, { recursive: true });
      await writeFile(markerPath, "marker", "utf8");
      await expect(
        fileSystem.findUp(nestedDirectory, "agentguard.marker"),
      ).resolves.toBe(markerPath);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("returns null when the upward search reaches the filesystem root", async () => {
    const directory = await mkdtemp(join(tmpdir(), "agentguard-fs-"));

    try {
      await expect(
        fileSystem.findUp(
          directory,
          "agentguard-file-that-does-not-exist-6c3e1b.marker",
        ),
      ).resolves.toBeNull();
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
});
