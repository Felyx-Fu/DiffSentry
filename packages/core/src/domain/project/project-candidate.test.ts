import { describe, expect, it } from "vitest";
import type { FileSystemPort } from "../../ports/file-system.js";
import { isNodeProjectCandidate } from "./project-candidate.js";

describe("isNodeProjectCandidate", () => {
  it("returns true when package.json is found through the filesystem port", async () => {
    const queries: string[] = [];
    const fileSystem: FileSystemPort = {
      exists: async () => false,
      findUp: async (_startDirectory, fileName) => {
        queries.push(fileName);
        return "/repository/package.json";
      },
      readText: async () => "",
    };

    await expect(
      isNodeProjectCandidate(fileSystem, "/repository/packages/app"),
    ).resolves.toBe(true);
    expect(queries).toEqual(["package.json"]);
  });

  it("returns false when package.json is not found", async () => {
    const fileSystem: FileSystemPort = {
      exists: async () => false,
      findUp: async () => null,
      readText: async () => "",
    };

    await expect(
      isNodeProjectCandidate(fileSystem, "/repository"),
    ).resolves.toBe(false);
  });
});
