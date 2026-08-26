import { readFile } from "node:fs/promises";
import { calculateRiskScore, calculateVerdict } from "@agentguard/core";
import {
  authWithoutTestsRule,
  runtimeDependencyAddedRule,
  sourceWithoutTestsRule,
  workflowPermissionChangeRule,
} from "@agentguard/rules";
import { describe, expect, it } from "vitest";

type Scenario = "review" | "fail";
type Snapshot = "before" | "after";

async function readSnapshot(
  scenario: Scenario,
  snapshot: Snapshot,
  relativePath: string,
): Promise<string> {
  return readFile(
    new URL(`./${scenario}/${snapshot}/${relativePath}`, import.meta.url),
    "utf8",
  );
}

async function runScenario(scenario: Scenario) {
  const beforeWorkflow = await readSnapshot(
    scenario,
    "before",
    ".github/workflows/ci.yml",
  );
  const afterWorkflow = await readSnapshot(
    scenario,
    "after",
    ".github/workflows/ci.yml",
  );
  const workflowFindings = await workflowPermissionChangeRule.run({
    afterContents: afterWorkflow,
    beforeContents: beforeWorkflow,
    workflowPath: ".github/workflows/ci.yml",
  });

  const beforeManifest = await readSnapshot(scenario, "before", "package.json");
  const afterManifest = await readSnapshot(scenario, "after", "package.json");
  const dependencyFindings = await runtimeDependencyAddedRule.run({
    afterContents: afterManifest,
    beforeContents: beforeManifest,
    packagePath: "package.json",
  });

  const changedSourceFiles = [
    { category: "source", path: "src/auth.ts" },
    { category: "source", path: "src/reporting.ts" },
  ] as const;
  const authFindings = await authWithoutTestsRule.run({
    files: changedSourceFiles,
  });
  const sourceFindings = await sourceWithoutTestsRule.run({
    files: changedSourceFiles,
  });

  const findings =
    scenario === "review"
      ? [...workflowFindings, ...dependencyFindings]
      : [
          ...workflowFindings,
          ...dependencyFindings,
          ...authFindings,
          ...sourceFindings,
        ];
  const riskScore = calculateRiskScore({ findings, verifications: [] });

  return {
    findings,
    riskScore,
    verdict: calculateVerdict(riskScore),
  };
}

describe("bad-ai-pr demo", () => {
  it("produces an explainable REVIEW result for the smaller risky diff", async () => {
    const result = await runScenario("review");

    expect(result.riskScore).toBe(45);
    expect(result.verdict).toBe("review");
    expect(result.findings.map((finding) => finding.ruleId)).toEqual([
      "ci.workflow-permission-change",
      "dependency.runtime-dependency-added",
    ]);
  });

  it("caps the expanded risky diff at FAIL without a secret fixture", async () => {
    const result = await runScenario("fail");

    expect(result.riskScore).toBe(100);
    expect(result.verdict).toBe("fail");
    expect(result.findings.map((finding) => finding.ruleId)).toEqual([
      "ci.workflow-permission-change",
      "dependency.runtime-dependency-added",
      "testing.auth-without-tests",
      "testing.source-without-tests",
    ]);
    expect(
      result.findings.every((finding) =>
        finding.evidence.every(
          (evidence) => !evidence.message.includes("secret"),
        ),
      ),
    ).toBe(true);
  });
});
