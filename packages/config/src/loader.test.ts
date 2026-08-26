import { describe, expect, it } from "vitest";
import { type ConfigFileSystem, findConfigFile } from "./loader.js";

function createFileSystem(result: string | null): {
  fileSystem: ConfigFileSystem;
  calls: Array<{ startDirectory: string; fileName: string }>;
} {
  const calls: Array<{ startDirectory: string; fileName: string }> = [];
  return {
    calls,
    fileSystem: {
      findUp: async (startDirectory, fileName) => {
        calls.push({ fileName, startDirectory });
        return result;
      },
    },
  };
}

describe("findConfigFile", () => {
  it("finds the fixed JSON config filename from the start hierarchy", async () => {
    const { calls, fileSystem } = createFileSystem(
      "C:/repository/agentguard.config.json",
    );

    await expect(
      findConfigFile(fileSystem, "C:/repository/packages/app"),
    ).resolves.toBe("C:/repository/agentguard.config.json");
    expect(calls).toEqual([
      {
        fileName: "agentguard.config.json",
        startDirectory: "C:/repository/packages/app",
      },
    ]);
  });

  it("returns null when no config exists in the searched hierarchy", async () => {
    const { calls, fileSystem } = createFileSystem(null);

    await expect(
      findConfigFile(fileSystem, "C:/repository"),
    ).resolves.toBeNull();
    expect(calls).toHaveLength(1);
  });
});
