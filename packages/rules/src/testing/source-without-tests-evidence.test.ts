import { describe, expect, it } from "vitest";
import { createSourceWithoutTestsEvidence } from "./source-without-tests-evidence.js";

describe("createSourceWithoutTestsEvidence", () => {
  it("attaches changed source paths and explicit absence evidence", () => {
    expect(
      createSourceWithoutTestsEvidence({
        sourcePaths: ["src/auth.ts", "src/session.ts"],
        testPaths: [],
      }),
    ).toEqual([
      {
        location: { path: "src/auth.ts" },
        message:
          "Changed source file src/auth.ts; no related test file changed in this ChangeSet.",
      },
      {
        location: { path: "src/session.ts" },
        message:
          "Changed source file src/session.ts; no related test file changed in this ChangeSet.",
      },
    ]);
  });

  it("returns no evidence for an empty source detection", () => {
    expect(
      createSourceWithoutTestsEvidence({ sourcePaths: [], testPaths: [] }),
    ).toEqual([]);
  });
});
