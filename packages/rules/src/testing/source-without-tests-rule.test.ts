import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { BUILT_IN_RULES } from "../registry.js";
import { SOURCE_WITHOUT_TESTS_METADATA } from "./source-without-tests-metadata.js";
import { sourceWithoutTestsRule } from "./source-without-tests-rule.js";

const positiveFixture = new URL(
  "../../../../tests/fixtures/rules/source-without-tests/positive.ts",
  import.meta.url,
);
const negativeFixture = new URL(
  "../../../../tests/fixtures/rules/source-without-tests/negative.test.ts",
  import.meta.url,
);

describe("testing.source-without-tests", () => {
  it("emits one high-severity finding for a source fixture without a changed test", async () => {
    const contents = await readFile(positiveFixture, "utf8");
    expect(contents).toContain("export function");

    const findings = await sourceWithoutTestsRule.run({
      files: [{ category: "source", path: "src/auth.ts" }],
    });

    expect(findings).toHaveLength(1);
    expect(findings[0]?.ruleId).toBe(SOURCE_WITHOUT_TESTS_METADATA.id);
    expect(findings[0]?.severity).toBe("high");
    expect(findings[0]?.evidence).toEqual([
      {
        location: { path: "src/auth.ts" },
        message:
          "Changed source file src/auth.ts; no related test file changed in this ChangeSet.",
      },
    ]);
    expect(findings[0]?.location).toEqual({ path: "src/auth.ts" });
  });

  it("does not emit a finding when the related test fixture also changed", async () => {
    const contents = await readFile(negativeFixture, "utf8");
    expect(contents).toContain("describe");

    await expect(
      sourceWithoutTestsRule.run({
        files: [
          { category: "source", path: "src/auth.ts" },
          { category: "test", path: "tests/auth.test.ts" },
        ],
      }),
    ).resolves.toEqual([]);
  });

  it("is present in the static built-in registry", () => {
    expect(BUILT_IN_RULES.map(({ metadata }) => metadata.id)).toContain(
      SOURCE_WITHOUT_TESTS_METADATA.id,
    );
  });
});
