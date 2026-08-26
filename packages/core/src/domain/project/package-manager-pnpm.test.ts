import { describe, expect, it } from "vitest";
import type { FileSystemPort } from "../../ports/file-system.js";
import { isPnpmProject } from "./package-manager-pnpm.js";

describe("isPnpmProject", () => {
  it("returns true when pnpm-lock.yaml is found", async () => {
    const fileSystem: FileSystemPort = {
      exists: async () => false,
      findUp: async (_startDirectory, fileName) =>
        fileName === "pnpm-lock.yaml" ? "/repository/pnpm-lock.yaml" : null,
      readText: async () => {
        throw new Error("package.json should not be read");
      },
    };

    await expect(isPnpmProject(fileSystem, "/repository")).resolves.toBe(true);
  });

  it("returns true for pnpm packageManager metadata", async () => {
    const fileSystem: FileSystemPort = {
      exists: async () => false,
      findUp: async (_startDirectory, fileName) =>
        fileName === "package.json" ? "/repository/package.json" : null,
      readText: async () => '{"packageManager":"pnpm@10.0.0"}',
    };

    await expect(isPnpmProject(fileSystem, "/repository")).resolves.toBe(true);
  });

  it("returns false when pnpm signals are absent", async () => {
    const fileSystem: FileSystemPort = {
      exists: async () => false,
      findUp: async () => null,
      readText: async () => '{"packageManager":"npm@11.0.0"}',
    };

    await expect(isPnpmProject(fileSystem, "/repository")).resolves.toBe(false);
  });
});
