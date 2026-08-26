import { describe, expect, it } from "vitest";
import { resolvePackageManager } from "./package-manager-resolution.js";
import { assembleProjectContext } from "./project-context.js";

const noSignals = {
  pnpm: false,
  npm: false,
  yarn: false,
  bun: false,
} as const;

describe("assembleProjectContext", () => {
  it("assembles Node and TypeScript project facts", () => {
    expect(
      assembleProjectContext({
        repositoryRoot: "/repository",
        hasPackageJson: true,
        packageManager: resolvePackageManager({ ...noSignals, pnpm: true }),
        isTypeScriptProject: true,
      }),
    ).toEqual({
      repositoryRoot: "/repository",
      ecosystem: "node",
      packageManager: "pnpm",
      languages: ["typescript"],
      frameworks: [],
    });
  });

  it("uses JavaScript when a Node project has no TypeScript signal", () => {
    expect(
      assembleProjectContext({
        repositoryRoot: "/repository",
        hasPackageJson: true,
        packageManager: resolvePackageManager({ ...noSignals, npm: true }),
        isTypeScriptProject: false,
      }),
    ).toMatchObject({
      ecosystem: "node",
      packageManager: "npm",
      languages: ["javascript"],
      frameworks: [],
    });
  });

  it("returns null for an unresolved package-manager result", () => {
    expect(
      assembleProjectContext({
        repositoryRoot: "/repository",
        hasPackageJson: true,
        packageManager: resolvePackageManager({
          ...noSignals,
          npm: true,
          pnpm: true,
        }),
        isTypeScriptProject: false,
      }),
    ).toBeNull();
  });
});
