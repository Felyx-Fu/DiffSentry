import { describe, expect, it } from "vitest";
import type { FileSystemPort } from "../../ports/file-system.js";
import { isYarnProject } from "./package-manager-yarn.js";

describe("isYarnProject", () => {
  it("returns true when yarn.lock is found", async () => {
    const fileSystem: FileSystemPort = {
      exists: async () => false,
      findUp: async (_startDirectory, fileName) =>
        fileName === "yarn.lock" ? "/repository/yarn.lock" : null,
      readText: async () => {
        throw new Error("package.json should not be read");
      },
    };

    await expect(isYarnProject(fileSystem, "/repository")).resolves.toBe(true);
  });

  it("returns true for Yarn packageManager metadata", async () => {
    const fileSystem: FileSystemPort = {
      exists: async () => false,
      findUp: async (_startDirectory, fileName) =>
        fileName === "package.json" ? "/repository/package.json" : null,
      readText: async () => '{"packageManager":"yarn@4.0.0"}',
    };

    await expect(isYarnProject(fileSystem, "/repository")).resolves.toBe(true);
  });

  it("returns false when Yarn signals are absent", async () => {
    const fileSystem: FileSystemPort = {
      exists: async () => false,
      findUp: async () => null,
      readText: async () => '{"packageManager":"npm@11.0.0"}',
    };

    await expect(isYarnProject(fileSystem, "/repository")).resolves.toBe(false);
  });
});
