import { join } from "node:path";
import { validateConfig } from "@felyx-fu/diffsentry-config";
import { describe, expect, it } from "vitest";
import {
  type InitFileSystem,
  MINIMAL_CONFIG_TEXT,
  runInitCommand,
} from "./init.js";

function createFileSystem(existing: boolean): {
  fileSystem: InitFileSystem;
  writes: Array<{ contents: string; path: string }>;
} {
  const writes: Array<{ contents: string; path: string }> = [];
  return {
    fileSystem: {
      exists: async () => existing,
      writeText: async (path, contents) => {
        writes.push({ contents, path });
      },
    },
    writes,
  };
}

describe("runInitCommand", () => {
  it("creates a minimal schema-conforming JSON config when absent", async () => {
    const { fileSystem, writes } = createFileSystem(false);
    const configPath = join("E:/workspace", "diffsentry.config.json");

    await expect(
      runInitCommand({ cwd: "E:/workspace", fileSystem }),
    ).resolves.toEqual({
      kind: "created",
      path: configPath,
    });
    expect(writes).toEqual([
      {
        contents: MINIMAL_CONFIG_TEXT,
        path: configPath,
      },
    ]);
    expect(validateConfig(JSON.parse(MINIMAL_CONFIG_TEXT))).toBe(true);
  });

  it("does not overwrite an existing config", async () => {
    const { fileSystem, writes } = createFileSystem(true);
    const configPath = join("E:/workspace", "diffsentry.config.json");

    await expect(
      runInitCommand({ cwd: "E:/workspace", fileSystem }),
    ).resolves.toEqual({
      kind: "already-exists",
      path: configPath,
    });
    expect(writes).toEqual([]);
  });
});
