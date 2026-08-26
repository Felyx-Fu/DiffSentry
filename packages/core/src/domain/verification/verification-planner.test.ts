import { describe, expect, it } from "vitest";
import { planVerifications } from "./verification-planner.js";

const allScripts = {
  test: "vitest run",
  lint: "biome check .",
  typecheck: "tsc --noEmit",
  build: "tsc -b",
} as const;

const noScripts = {
  test: null,
  lint: null,
  typecheck: null,
  build: null,
} as const;

describe("planVerifications", () => {
  it("selects deterministic default intents and keeps build disabled", () => {
    expect(
      planVerifications({
        scripts: allScripts,
        isTypeScriptProject: true,
      }),
    ).toEqual([
      { id: "test", source: "package-script" },
      { id: "lint", source: "package-script" },
      { id: "typecheck", source: "package-script" },
    ]);
  });

  it("selects a safe typecheck default for a TypeScript project", () => {
    expect(
      planVerifications({
        scripts: noScripts,
        isTypeScriptProject: true,
      }),
    ).toEqual([{ id: "typecheck", source: "safe-default" }]);
  });

  it("respects explicit toggles, including build opt-in", () => {
    expect(
      planVerifications({
        scripts: allScripts,
        isTypeScriptProject: true,
        toggles: {
          test: false,
          lint: false,
          typecheck: false,
          build: true,
        },
      }),
    ).toEqual([{ id: "build", source: "package-script" }]);
  });

  it("returns an empty plan when no verification signal exists", () => {
    expect(
      planVerifications({
        scripts: noScripts,
        isTypeScriptProject: false,
      }),
    ).toEqual([]);
  });
});
