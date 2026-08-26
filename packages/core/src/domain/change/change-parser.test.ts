import { describe, expect, it } from "vitest";
import { parseGitDiff } from "./change-parser.js";

describe("parseGitDiff", () => {
  it("parses added, modified, deleted, and renamed files", () => {
    const rawDiff = [
      "diff --git a/added.ts b/added.ts",
      "new file mode 100644",
      "--- /dev/null",
      "+++ b/added.ts",
      "@@ -0,0 +1 @@",
      "+added",
      "diff --git a/changed.ts b/changed.ts",
      "--- a/changed.ts",
      "+++ b/changed.ts",
      "@@ -1 +1 @@",
      "-before",
      "+after",
      "diff --git a/removed.ts b/removed.ts",
      "deleted file mode 100644",
      "--- a/removed.ts",
      "+++ /dev/null",
      "@@ -1 +0,0 @@",
      "-removed",
      "diff --git a/old.ts b/new.ts",
      "similarity index 100%",
      "rename from old.ts",
      "rename to new.ts",
    ].join("\n");

    expect(parseGitDiff(rawDiff, "base", "head")).toEqual({
      baseRef: "base",
      headRef: "head",
      files: [
        {
          path: "added.ts",
          status: "added",
          additions: 1,
          deletions: 0,
          category: "unknown",
        },
        {
          path: "changed.ts",
          status: "modified",
          additions: 1,
          deletions: 1,
          category: "unknown",
        },
        {
          path: "removed.ts",
          status: "deleted",
          additions: 0,
          deletions: 1,
          category: "unknown",
        },
        {
          path: "new.ts",
          status: "renamed",
          additions: 0,
          deletions: 0,
          category: "unknown",
        },
      ],
    });
  });

  it("returns no files for an empty diff", () => {
    expect(parseGitDiff("", "base", "head")).toEqual({
      baseRef: "base",
      headRef: "head",
      files: [],
    });
  });
});
