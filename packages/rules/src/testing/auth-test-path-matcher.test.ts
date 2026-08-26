import { describe, expect, it } from "vitest";
import { isRelatedAuthTestPath } from "./auth-test-path-matcher.js";

describe("isRelatedAuthTestPath", () => {
  it("matches same-name tests in colocated and mirrored test layouts", () => {
    expect(
      isRelatedAuthTestPath("src/auth/session.ts", "src/auth/session.test.ts"),
    ).toBe(true);
    expect(
      isRelatedAuthTestPath(
        "src/auth/session.ts",
        "tests/auth/session.spec.ts",
      ),
    ).toBe(true);
  });

  it("handles Windows separators and case differences", () => {
    expect(
      isRelatedAuthTestPath(
        "src\\Auth\\Session.ts",
        "tests\\auth\\session.TEST.ts",
      ),
    ).toBe(true);
  });

  it("rejects missing test markers and unrelated filenames", () => {
    expect(
      isRelatedAuthTestPath("src/auth/session.ts", "src/auth/session.ts"),
    ).toBe(false);
    expect(
      isRelatedAuthTestPath("src/auth/session.ts", "tests/auth/login.test.ts"),
    ).toBe(false);
    expect(
      isRelatedAuthTestPath(
        "src/auth/session.ts",
        "tests/auth/sessionary.test.ts",
      ),
    ).toBe(false);
  });
});
