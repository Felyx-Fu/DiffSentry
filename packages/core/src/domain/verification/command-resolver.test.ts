import { describe, expect, it } from "vitest";
import type { SupportedPackageManager } from "../project/package-manager-resolution.js";
import { resolveVerificationCommand } from "./command-resolver.js";

const packageManagers: readonly SupportedPackageManager[] = [
  "npm",
  "pnpm",
  "yarn",
  "bun",
];

describe("resolveVerificationCommand", () => {
  it("resolves package scripts through separate executable and args", () => {
    for (const packageManager of packageManagers) {
      expect(
        resolveVerificationCommand(packageManager, {
          id: "test",
          source: "package-script",
        }),
      ).toEqual({
        id: "test",
        executable: packageManager,
        args: ["run", "test"],
      });
    }
  });

  it("resolves safe typecheck defaults for every supported manager", () => {
    const expectedCommands = [
      {
        packageManager: "npm",
        executable: "npm",
        args: ["exec", "--", "tsc", "--noEmit"],
      },
      {
        packageManager: "pnpm",
        executable: "pnpm",
        args: ["exec", "tsc", "--noEmit"],
      },
      {
        packageManager: "yarn",
        executable: "yarn",
        args: ["exec", "tsc", "--noEmit"],
      },
      {
        packageManager: "bun",
        executable: "bun",
        args: ["x", "tsc", "--noEmit"],
      },
    ] as const;

    for (const expectedCommand of expectedCommands) {
      expect(
        resolveVerificationCommand(expectedCommand.packageManager, {
          id: "typecheck",
          source: "safe-default",
        }),
      ).toEqual({
        id: "typecheck",
        executable: expectedCommand.executable,
        args: expectedCommand.args,
      });
    }
  });

  it("rejects a safe-default source for an unsupported intent", () => {
    expect(
      resolveVerificationCommand("pnpm", {
        id: "lint",
        source: "safe-default",
      }),
    ).toBeNull();
  });
});
