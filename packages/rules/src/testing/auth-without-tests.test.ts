import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { BUILT_IN_RULES } from "../registry.js";
import {
  authWithoutTestsRule,
  detectAuthWithoutTests,
} from "./auth-without-tests.js";
import { AUTH_WITHOUT_TESTS_METADATA } from "./auth-without-tests-metadata.js";

const positiveFixture = new URL(
  "../../../../tests/fixtures/rules/auth-without-tests/positive.ts",
  import.meta.url,
);
const negativeFixture = new URL(
  "../../../../tests/fixtures/rules/auth-without-tests/negative.test.ts",
  import.meta.url,
);

describe("testing.auth-without-tests", () => {
  it("emits path-based absence evidence for an auth source without a related test", async () => {
    const contents = await readFile(positiveFixture, "utf8");
    expect(contents).toContain("export function");

    const findings = await authWithoutTestsRule.run({
      files: [
        { category: "source", path: "src/auth/session.ts" },
        { category: "source", path: "src/payment.ts" },
        { category: "test", path: "tests/payment.test.ts" },
      ],
    });

    expect(findings).toEqual([
      {
        confidence: 1,
        evidence: [
          {
            location: { path: "src/auth/session.ts" },
            message:
              "Authentication-related source file src/auth/session.ts changed; no related test file changed in this ChangeSet.",
          },
        ],
        location: { path: "src/auth/session.ts" },
        message:
          "Authentication-related source changes have no related changed test file in this ChangeSet.",
        ruleId: AUTH_WITHOUT_TESTS_METADATA.id,
        severity: "high",
        title: AUTH_WITHOUT_TESTS_METADATA.name,
      },
    ]);
  });

  it("does not emit a finding when every auth source has a related changed test", async () => {
    const contents = await readFile(negativeFixture, "utf8");
    expect(contents).toContain("describe");
    expect(
      detectAuthWithoutTests({
        files: [
          { category: "source", path: "src/auth/session.ts" },
          { category: "test", path: "tests/auth/session.spec.ts" },
        ],
      }),
    ).toBeNull();
  });

  it("is present in the static built-in registry", () => {
    expect(BUILT_IN_RULES.map(({ metadata }) => metadata.id)).toContain(
      AUTH_WITHOUT_TESTS_METADATA.id,
    );
  });

  it("does not treat unrelated source changes or tests as auth evidence", () => {
    expect(
      detectAuthWithoutTests({
        files: [
          { category: "source", path: "src/author.ts" },
          { category: "test", path: "tests/author.test.ts" },
        ],
      }),
    ).toBeNull();
  });

  it("reports only the auth source that lacks a related test in a mixed change set", () => {
    expect(
      detectAuthWithoutTests({
        files: [
          { category: "source", path: "src/auth/session.ts" },
          { category: "source", path: "src/auth/login.ts" },
          { category: "test", path: "tests/auth/session.test.ts" },
        ],
      }),
    ).toEqual({
      authSourcePaths: ["src/auth/login.ts"],
      changedTestPaths: ["tests/auth/session.test.ts"],
    });
  });
});
