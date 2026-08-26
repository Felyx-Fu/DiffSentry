import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { BUILT_IN_RULES } from "../registry.js";
import { WORKFLOW_PERMISSION_CHANGE_METADATA } from "./metadata.js";
import { workflowPermissionChangeRule } from "./workflow-permission-change.js";

const beforeFixture = new URL(
  "../../../../tests/fixtures/rules/workflow-permission-change/before.yml",
  import.meta.url,
);
const afterPositiveFixture = new URL(
  "../../../../tests/fixtures/rules/workflow-permission-change/after-positive.yml",
  import.meta.url,
);
const afterNegativeFixture = new URL(
  "../../../../tests/fixtures/rules/workflow-permission-change/after-negative.yml",
  import.meta.url,
);

describe("ci.workflow-permission-change", () => {
  it("emits one high-severity finding for a workflow permission expansion", async () => {
    const [beforeContents, afterContents] = await Promise.all([
      readFile(beforeFixture, "utf8"),
      readFile(afterPositiveFixture, "utf8"),
    ]);

    await expect(
      workflowPermissionChangeRule.run({
        afterContents,
        beforeContents,
        workflowPath: ".github/workflows/ci.yml",
      }),
    ).resolves.toEqual([
      {
        confidence: 1,
        evidence: [
          {
            after: "write",
            before: "read",
            location: { path: ".github/workflows/ci.yml" },
            message:
              "Workflow .github/workflows/ci.yml permission contents expanded from read to write.",
            permission: "contents",
          },
        ],
        location: { path: ".github/workflows/ci.yml" },
        message:
          "Workflow .github/workflows/ci.yml permission contents expanded from read to write.",
        ruleId: WORKFLOW_PERMISSION_CHANGE_METADATA.id,
        severity: "high",
        title: "CI workflow permission change",
      },
    ]);
  });

  it("does not emit a finding for unchanged permissions", async () => {
    const [beforeContents, afterContents] = await Promise.all([
      readFile(beforeFixture, "utf8"),
      readFile(afterNegativeFixture, "utf8"),
    ]);

    await expect(
      workflowPermissionChangeRule.run({
        afterContents,
        beforeContents,
        workflowPath: ".github/workflows/ci.yml",
      }),
    ).resolves.toEqual([]);
  });

  it("is present in the static built-in registry", () => {
    expect(BUILT_IN_RULES.map(({ metadata }) => metadata.id)).toContain(
      WORKFLOW_PERMISSION_CHANGE_METADATA.id,
    );
  });
});
