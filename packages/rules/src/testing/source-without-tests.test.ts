import { describe, expect, it } from "vitest";
import { detectSourceWithoutTests } from "./source-without-tests.js";

describe("detectSourceWithoutTests", () => {
  it("detects changed source files when no changed test file exists", () => {
    expect(
      detectSourceWithoutTests({
        files: [
          { category: "source", path: "src/auth.ts" },
          { category: "documentation", path: "README.md" },
          { category: "source", path: "src/session.ts" },
        ],
      }),
    ).toEqual({
      sourcePaths: ["src/auth.ts", "src/session.ts"],
      testPaths: [],
    });
  });

  it("returns no detection when a changed test file exists", () => {
    expect(
      detectSourceWithoutTests({
        files: [
          { category: "source", path: "src/auth.ts" },
          { category: "test", path: "tests/auth.test.ts" },
        ],
      }),
    ).toBeNull();
  });

  it("returns no detection when the change set has no source file", () => {
    expect(
      detectSourceWithoutTests({
        files: [{ category: "documentation", path: "README.md" }],
      }),
    ).toBeNull();
  });
});
