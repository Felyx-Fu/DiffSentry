import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { BUILT_IN_RULES } from "../registry.js";
import { SECRET_EXPOSURE_METADATA } from "./metadata.js";
import { secretExposureRule } from "./secret-exposure.js";

const positiveFixture = new URL(
  "../../../../tests/fixtures/rules/secret-exposure/positive.ts",
  import.meta.url,
);
const negativeFixture = new URL(
  "../../../../tests/fixtures/rules/secret-exposure/negative.ts",
  import.meta.url,
);

describe("security.secret-exposure", () => {
  it("emits one redacted finding for the positive fixture", async () => {
    const contents = await readFile(positiveFixture, "utf8");
    const findings = await secretExposureRule.run({
      changedFiles: [{ contents, path: "src/config.ts" }],
    });

    expect(findings).toHaveLength(1);
    expect(findings[0]?.ruleId).toBe(SECRET_EXPOSURE_METADATA.id);
    expect(findings[0]?.severity).toBe("critical");
    expect(findings[0]?.evidence).not.toHaveLength(0);
    expect(findings[0]?.message).not.toContain("0123456789abcdef");
    expect(findings[0]?.evidence[0]).not.toHaveProperty("value");
  });

  it("does not emit a finding for the negative fixture", async () => {
    const contents = await readFile(negativeFixture, "utf8");

    await expect(
      secretExposureRule.run({
        changedFiles: [{ contents, path: "src/config.ts" }],
      }),
    ).resolves.toEqual([]);
  });

  it("is present in the static built-in registry", () => {
    expect(BUILT_IN_RULES.map(({ metadata }) => metadata.id)).toContain(
      SECRET_EXPOSURE_METADATA.id,
    );
  });
});
