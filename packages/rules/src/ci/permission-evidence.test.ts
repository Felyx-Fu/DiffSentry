import { describe, expect, it } from "vitest";
import { createWorkflowPermissionEvidence } from "./permission-evidence.js";

describe("createWorkflowPermissionEvidence", () => {
  it("attaches workflow path and factual permission deltas", () => {
    expect(
      createWorkflowPermissionEvidence(".github/workflows/ci.yml", [
        { after: "write", before: "read", permission: "contents" },
        { after: "write", before: "none", permission: "packages" },
      ]),
    ).toEqual([
      {
        after: "write",
        before: "read",
        location: { path: ".github/workflows/ci.yml" },
        message:
          "Workflow .github/workflows/ci.yml permission contents expanded from read to write.",
        permission: "contents",
      },
      {
        after: "write",
        before: "none",
        location: { path: ".github/workflows/ci.yml" },
        message:
          "Workflow .github/workflows/ci.yml permission packages expanded from none to write.",
        permission: "packages",
      },
    ]);
  });

  it("returns no evidence when there is no detected expansion", () => {
    expect(
      createWorkflowPermissionEvidence(".github/workflows/ci.yml", []),
    ).toEqual([]);
  });
});
