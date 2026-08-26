import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { BUILT_IN_RULES } from "../registry.js";
import { RUNTIME_DEPENDENCY_ADDED_METADATA } from "./metadata.js";
import {
  createRuntimeDependencyEvidence,
  runtimeDependencyAddedRule,
} from "./runtime-dependency-added.js";

const beforeFixture = new URL(
  "../../../../tests/fixtures/rules/runtime-dependency-added/before.json",
  import.meta.url,
);
const afterPositiveFixture = new URL(
  "../../../../tests/fixtures/rules/runtime-dependency-added/after-positive.json",
  import.meta.url,
);
const afterNegativeFixture = new URL(
  "../../../../tests/fixtures/rules/runtime-dependency-added/after-negative.json",
  import.meta.url,
);

describe("dependency.runtime-dependency-added", () => {
  it("emits one finding per added runtime dependency", async () => {
    const [beforeContents, afterContents] = await Promise.all([
      readFile(beforeFixture, "utf8"),
      readFile(afterPositiveFixture, "utf8"),
    ]);

    await expect(
      runtimeDependencyAddedRule.run({
        afterContents,
        beforeContents,
        packagePath: "package.json",
      }),
    ).resolves.toEqual([
      {
        confidence: 1,
        evidence: [
          {
            dependencyName: "jsonwebtoken",
            location: { path: "package.json" },
            message:
              "Runtime dependency jsonwebtoken was added to package.json.",
          },
        ],
        location: { path: "package.json" },
        message: "Runtime dependency jsonwebtoken was added to package.json.",
        ruleId: "dependency.runtime-dependency-added",
        severity: "medium",
        title: "Runtime dependency added",
      },
    ]);
  });

  it("does not emit findings for dev additions or runtime removals", async () => {
    const [beforeContents, afterContents] = await Promise.all([
      readFile(beforeFixture, "utf8"),
      readFile(afterNegativeFixture, "utf8"),
    ]);

    await expect(
      runtimeDependencyAddedRule.run({
        afterContents,
        beforeContents,
        packagePath: "package.json",
      }),
    ).resolves.toEqual([]);
  });

  it("names each dependency in deterministic evidence", () => {
    expect(
      createRuntimeDependencyEvidence("packages/app/package.json", [
        "alpha",
        "zeta",
      ]),
    ).toEqual([
      {
        dependencyName: "alpha",
        location: { path: "packages/app/package.json" },
        message:
          "Runtime dependency alpha was added to packages/app/package.json.",
      },
      {
        dependencyName: "zeta",
        location: { path: "packages/app/package.json" },
        message:
          "Runtime dependency zeta was added to packages/app/package.json.",
      },
    ]);
  });

  it("is present in the static built-in registry", () => {
    expect(BUILT_IN_RULES.map(({ metadata }) => metadata.id)).toContain(
      RUNTIME_DEPENDENCY_ADDED_METADATA.id,
    );
  });
});
