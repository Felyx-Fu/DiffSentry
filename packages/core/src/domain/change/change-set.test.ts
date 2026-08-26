import { describe, expect, it } from "vitest";
import { assembleChangeSet } from "./change-set.js";

describe("assembleChangeSet", () => {
  it("normalizes parsed files and applies their categories", () => {
    const rawDiff = [
      "diff --git a/src/app.ts b/src/app.ts",
      "--- a/src/app.ts",
      "+++ b/src/app.ts",
      "@@ -1 +1 @@",
      "-before",
      "+after",
      "diff --git a/README.md b/README.md",
      "--- a/README.md",
      "+++ b/README.md",
      "@@ -1 +1 @@",
      "-old",
      "+new",
    ].join("\n");

    expect(assembleChangeSet(rawDiff, "base", "head")).toEqual({
      baseRef: "base",
      headRef: "head",
      files: [
        {
          path: "src/app.ts",
          status: "modified",
          additions: 1,
          deletions: 1,
          category: "source",
        },
        {
          path: "README.md",
          status: "modified",
          additions: 1,
          deletions: 1,
          category: "documentation",
        },
      ],
    });
  });

  it("returns an empty normalized ChangeSet for an empty diff", () => {
    expect(assembleChangeSet("", "base", "head")).toEqual({
      baseRef: "base",
      headRef: "head",
      files: [],
    });
  });
});
