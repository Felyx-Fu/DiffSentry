import { describe, expect, it } from "vitest";
import { isAuthRelatedPath } from "./auth-path-matcher.js";

describe("isAuthRelatedPath", () => {
  it("matches explicit authentication path components", () => {
    expect(
      [
        "src/auth/session.ts",
        "src/authentication.ts",
        "src/login-form.ts",
        "src\\oauth2\\callback.ts",
        "src/access-control/permissions.ts",
      ].every(isAuthRelatedPath),
    ).toBe(true);
  });

  it("matches path components without inspecting file contents", () => {
    expect(isAuthRelatedPath("src/auth/client.ts")).toBe(true);
    expect(isAuthRelatedPath("src/user.ts")).toBe(false);
  });

  it("avoids substring false positives", () => {
    expect(
      [
        "src/author.ts",
        "src/tokenizer.ts",
        "src/sessionary.ts",
        "src/loginHistory.ts",
        "src/permissioning.ts",
      ].some(isAuthRelatedPath),
    ).toBe(false);
  });
});
