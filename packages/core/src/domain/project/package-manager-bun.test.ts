import { describe, expect, it } from "vitest";
import type { FileSystemPort } from "../../ports/file-system.js";
import { isBunProject } from "./package-manager-bun.js";

describe("isBunProject", () => {
  it("returns true when bun.lock is found", async () => {
    const fileSystem: FileSystemPort = {
      exists: async () => false,
      findUp: async (_startDirectory, fileName) =>
        fileName === "bun.lock" ? "/repository/bun.lock" : null,
      readText: async () => {
        throw new Error("package.json should not be read");
      },
    };

    await expect(isBunProject(fileSystem, "/repository")).resolves.toBe(true);
  });

  it("returns true for Bun packageManager metadata", async () => {
    const fileSystem: FileSystemPort = {
      exists: async () => false,
      findUp: async (_startDirectory, fileName) =>
        fileName === "package.json" ? "/repository/package.json" : null,
      readText: async () => '{"packageManager":"bun@1.0.0"}',
    };

    await expect(isBunProject(fileSystem, "/repository")).resolves.toBe(true);
  });

  it("returns false when Bun signals are absent", async () => {
    const fileSystem: FileSystemPort = {
      exists: async () => false,
      findUp: async () => null,
      readText: async () => '{"packageManager":"npm@11.0.0"}',
    };

    await expect(isBunProject(fileSystem, "/repository")).resolves.toBe(false);
  });
});
