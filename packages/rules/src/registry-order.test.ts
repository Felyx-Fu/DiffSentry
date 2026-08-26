import { describe, expect, it } from "vitest";
import { BUILT_IN_RULES } from "./registry.js";

describe("BUILT_IN_RULES ordering", () => {
  it("is deterministic, unique, and ordered by stable rule ID", () => {
    const ids = BUILT_IN_RULES.map(({ metadata }) => metadata.id);

    expect(ids).toEqual([
      "ci.workflow-permission-change",
      "dependency.runtime-dependency-added",
      "security.secret-exposure",
      "testing.auth-without-tests",
      "testing.source-without-tests",
    ]);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual([...ids].sort());
  });

  it("does not derive ordering from display names", () => {
    expect(BUILT_IN_RULES.map(({ metadata }) => metadata.name)).not.toEqual(
      [...BUILT_IN_RULES]
        .sort((left, right) =>
          left.metadata.name.localeCompare(right.metadata.name),
        )
        .map(({ metadata }) => metadata.name),
    );
  });
});
