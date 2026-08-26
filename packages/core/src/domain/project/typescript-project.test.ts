import { describe, expect, it } from "vitest";
import type { FileSystemPort } from "../../ports/file-system.js";
import { isTypeScriptProject } from "./typescript-project.js";

describe("isTypeScriptProject", () => {
  it("returns true when tsconfig.json is found", async () => {
    const fileSystem: FileSystemPort = {
      exists: async () => false,
      findUp: async (_startDirectory, fileName) =>
        fileName === "tsconfig.json" ? "/repository/tsconfig.json" : null,
      readText: async () => {
        throw new Error("package.json should not be read");
      },
    };

    await expect(isTypeScriptProject(fileSystem, "/repository")).resolves.toBe(
      true,
    );
  });

  it("returns true for a TypeScript package dependency", async () => {
    const fileSystem: FileSystemPort = {
      exists: async () => false,
      findUp: async (_startDirectory, fileName) =>
        fileName === "package.json" ? "/repository/package.json" : null,
      readText: async () => '{"devDependencies":{"typescript":"6.0.0"}}',
    };

    await expect(isTypeScriptProject(fileSystem, "/repository")).resolves.toBe(
      true,
    );
  });

  it("returns false for a JavaScript project without TypeScript signals", async () => {
    const fileSystem: FileSystemPort = {
      exists: async () => false,
      findUp: async (_startDirectory, fileName) =>
        fileName === "package.json" ? "/repository/package.json" : null,
      readText: async () => '{"dependencies":{"react":"19.0.0"}}',
    };

    await expect(isTypeScriptProject(fileSystem, "/repository")).resolves.toBe(
      false,
    );
  });
});
