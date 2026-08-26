import { describe, expect, it } from "vitest";
import type { FileSystemPort } from "../../ports/file-system.js";
import { isNpmProject } from "./package-manager-npm.js";

describe("isNpmProject", () => {
  it("returns true when package-lock.json is found", async () => {
    const fileSystem: FileSystemPort = {
      exists: async () => false,
      findUp: async (_startDirectory, fileName) =>
        fileName === "package-lock.json"
          ? "/repository/package-lock.json"
          : null,
      readText: async () => {
        throw new Error("package.json should not be read");
      },
    };

    await expect(isNpmProject(fileSystem, "/repository")).resolves.toBe(true);
  });

  it("returns true for npm packageManager metadata", async () => {
    const fileSystem: FileSystemPort = {
      exists: async () => false,
      findUp: async (_startDirectory, fileName) =>
        fileName === "package.json" ? "/repository/package.json" : null,
      readText: async () => '{"packageManager":"npm@11.0.0"}',
    };

    await expect(isNpmProject(fileSystem, "/repository")).resolves.toBe(true);
  });

  it("returns false when npm signals are absent", async () => {
    const fileSystem: FileSystemPort = {
      exists: async () => false,
      findUp: async () => null,
      readText: async () => '{"packageManager":"pnpm@10.0.0"}',
    };

    await expect(isNpmProject(fileSystem, "/repository")).resolves.toBe(false);
  });
});
