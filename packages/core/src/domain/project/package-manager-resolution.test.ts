import { describe, expect, it } from "vitest";
import type { FileSystemPort } from "../../ports/file-system.js";
import {
  detectPackageManager,
  resolvePackageManager,
} from "./package-manager-resolution.js";

const noSignals = {
  pnpm: false,
  npm: false,
  yarn: false,
  bun: false,
} as const;

describe("resolvePackageManager", () => {
  it("resolves a single detected package manager", () => {
    expect(resolvePackageManager({ ...noSignals, pnpm: true })).toEqual({
      status: "resolved",
      manager: "pnpm",
      candidates: ["pnpm"],
    });
  });

  it("returns unknown when no package manager signal exists", () => {
    expect(resolvePackageManager(noSignals)).toEqual({
      status: "unknown",
      manager: null,
      candidates: [],
    });
  });

  it("returns an ordered ambiguous result for multiple signals", () => {
    expect(
      resolvePackageManager({
        ...noSignals,
        bun: true,
        npm: true,
        pnpm: true,
      }),
    ).toEqual({
      status: "ambiguous",
      manager: null,
      candidates: ["pnpm", "npm", "bun"],
    });
  });
});

describe("detectPackageManager", () => {
  it("combines the existing filesystem-backed package manager signals", async () => {
    const fileSystem: FileSystemPort = {
      exists: async () => false,
      findUp: async (_startDirectory, fileName) =>
        fileName === "package.json" ? "/repository/package.json" : null,
      readText: async () => '{"packageManager":"pnpm@10.0.0"}',
    };

    await expect(
      detectPackageManager(fileSystem, "/repository"),
    ).resolves.toEqual({
      status: "resolved",
      manager: "pnpm",
      candidates: ["pnpm"],
    });
  });
});
