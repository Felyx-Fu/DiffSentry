import { describe, expect, it } from "vitest";
import { detectTypecheckIntent } from "./typecheck-intent.js";

const scriptsWithoutTypecheck = {
  test: null,
  lint: null,
  typecheck: null,
  build: null,
} as const;

describe("detectTypecheckIntent", () => {
  it("prefers an explicit typecheck script", () => {
    expect(
      detectTypecheckIntent(
        {
          ...scriptsWithoutTypecheck,
          typecheck: "tsc --noEmit",
        },
        false,
      ),
    ).toBe("explicit");
  });

  it("returns a safe default for a TypeScript project without a script", () => {
    expect(detectTypecheckIntent(scriptsWithoutTypecheck, true)).toBe(
      "safe-default",
    );
  });

  it("returns none for a JavaScript project without a script", () => {
    expect(detectTypecheckIntent(scriptsWithoutTypecheck, false)).toBe("none");
  });

  it("does not treat a whitespace-only script as explicit", () => {
    expect(
      detectTypecheckIntent(
        {
          ...scriptsWithoutTypecheck,
          typecheck: "   ",
        },
        true,
      ),
    ).toBe("safe-default");
  });
});
