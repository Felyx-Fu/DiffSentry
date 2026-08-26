import { describe, expect, it } from "vitest";
import type { FileSystemPort } from "../../ports/file-system.js";
import { readKnownPackageScripts } from "./package-scripts.js";

describe("readKnownPackageScripts", () => {
  it("returns only the known verification script meanings", async () => {
    const fileSystem: FileSystemPort = {
      exists: async () => false,
      findUp: async () => "/repository/package.json",
      readText: async () =>
        JSON.stringify({
          scripts: {
            build: "turbo run build",
            custom: "node custom.js",
            lint: "biome check .",
            test: "vitest run",
            typecheck: "tsc --noEmit",
          },
        }),
    };

    await expect(
      readKnownPackageScripts(fileSystem, "/repository"),
    ).resolves.toEqual({
      test: "vitest run",
      lint: "biome check .",
      typecheck: "tsc --noEmit",
      build: "turbo run build",
    });
  });

  it("returns null when package.json is absent", async () => {
    const fileSystem: FileSystemPort = {
      exists: async () => false,
      findUp: async () => null,
      readText: async () => "",
    };

    await expect(
      readKnownPackageScripts(fileSystem, "/repository"),
    ).resolves.toBeNull();
  });

  it("does not expose non-string or malformed script data", async () => {
    const fileSystem: FileSystemPort = {
      exists: async () => false,
      findUp: async () => "/repository/package.json",
      readText: async () => '{"scripts":{"test":true}',
    };

    await expect(
      readKnownPackageScripts(fileSystem, "/repository"),
    ).resolves.toEqual({
      test: null,
      lint: null,
      typecheck: null,
      build: null,
    });
  });
});
