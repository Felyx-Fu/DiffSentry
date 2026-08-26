import { describe, expect, it } from "vitest";
import { hasBuildVerificationIntent } from "./build-intent.js";

const scriptsWithoutBuild = {
  test: null,
  lint: null,
  typecheck: null,
  build: null,
} as const;

describe("hasBuildVerificationIntent", () => {
  it("keeps build disabled by default even when a script exists", () => {
    expect(
      hasBuildVerificationIntent({
        ...scriptsWithoutBuild,
        build: "tsc -b",
      }),
    ).toBe(false);
  });

  it("enables build only when explicitly requested and present", () => {
    expect(
      hasBuildVerificationIntent(
        {
          ...scriptsWithoutBuild,
          build: "tsc -b",
        },
        true,
      ),
    ).toBe(true);
  });

  it("returns false when the build script is absent", () => {
    expect(hasBuildVerificationIntent(scriptsWithoutBuild, true)).toBe(false);
  });
});
