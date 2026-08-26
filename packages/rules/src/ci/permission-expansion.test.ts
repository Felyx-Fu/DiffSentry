import { describe, expect, it } from "vitest";
import { detectWorkflowPermissionExpansions } from "./permission-expansion.js";

describe("detectWorkflowPermissionExpansions", () => {
  it("detects a scoped read-to-write expansion", () => {
    expect(
      detectWorkflowPermissionExpansions(
        "permissions:\n  contents: read\n",
        "permissions:\n  contents: write\n",
      ),
    ).toEqual([{ after: "write", before: "read", permission: "contents" }]);
  });

  it("detects read-all to write-all expansion", () => {
    expect(
      detectWorkflowPermissionExpansions(
        "permissions: read-all\n",
        "permissions: write-all\n",
      ),
    ).toEqual([{ after: "write", before: "read", permission: "all" }]);
  });

  it("detects job-level permission expansion without executing YAML", () => {
    expect(
      detectWorkflowPermissionExpansions(
        "jobs:\n  build:\n    permissions:\n      contents: read\n",
        "jobs:\n  build:\n    permissions:\n      contents: write\n",
      ),
    ).toEqual([{ after: "write", before: "read", permission: "contents" }]);
  });

  it("does not report unrelated changes or additions without a baseline", () => {
    expect(
      detectWorkflowPermissionExpansions(
        "permissions:\n  contents: read\n\nrun: echo permissions: read\n",
        "permissions:\n  contents: read\n\nrun: echo permissions: write\n",
      ),
    ).toEqual([]);
    expect(
      detectWorkflowPermissionExpansions(
        "name: CI\n",
        "permissions: write-all\n",
      ),
    ).toEqual([]);
  });

  it("does not report a downgrade or an unchanged permission", () => {
    expect(
      detectWorkflowPermissionExpansions(
        "permissions: write-all\n",
        "permissions: read-all\n",
      ),
    ).toEqual([]);
    expect(
      detectWorkflowPermissionExpansions(
        "permissions: { contents: read }\n",
        "permissions: { contents: read }\n",
      ),
    ).toEqual([]);
  });
});
