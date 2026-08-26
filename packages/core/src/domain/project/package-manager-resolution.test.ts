import { describe, expect, it } from "vitest";
import { resolvePackageManager } from "./package-manager-resolution.js";

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
