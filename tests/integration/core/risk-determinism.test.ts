import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type {
  AgentGuardReportAssemblyInput,
  ReportFinding,
  ReportVerification,
} from "../../../packages/core/src/application/report-assembler.js";
import { assembleAgentGuardReport } from "../../../packages/core/src/application/report-assembler.js";
import { assembleChangeSet } from "../../../packages/core/src/domain/change/change-set.js";
import {
  calculateRiskScore,
  type RiskFindingInput,
} from "../../../packages/core/src/domain/risk/risk-score.js";
import { calculateVerdict } from "../../../packages/core/src/domain/risk/verdict-thresholds.js";
import { NodeGitProvider } from "../../../packages/runtime-node/src/index.js";
import { createGitTestFixture } from "../../../packages/runtime-node/src/test-utils/git-fixture.js";

describe("core risk determinism integration", () => {
  it("produces identical report semantics for identical repository and config inputs", async () => {
    const fixture = await createGitTestFixture();
    const gitProvider = new NodeGitProvider();
    const sourceDirectory = join(fixture.directory, "src");

    try {
      await mkdir(sourceDirectory, { recursive: true });
      await fixture.writeFile("src/auth.ts", "export const before = true;\n");
      await fixture.writeFile("README.md", "before\n");
      await fixture.stage("src/auth.ts");
      await fixture.stage("README.md");
      await fixture.commit("initial");
      await fixture.writeFile("src/auth.ts", "export const after = true;\n");
      await fixture.writeFile("README.md", "after\n");

      const rawDiff = await gitProvider.getWorkingTreeDiff(fixture.directory);
      const changes = assembleChangeSet(rawDiff, "HEAD", "WORKTREE");
      const findings: readonly ReportFinding[] = [
        {
          confidence: 0.8,
          evidence: [{ message: "src/auth.ts changed" }],
          message: "Authentication implementation changed.",
          ruleId: "security.auth-change",
          severity: "high",
          title: "Authentication change",
        },
        {
          confidence: 0.4,
          evidence: [{ message: "A related medium-risk change was detected." }],
          message: "A related medium-risk change was detected.",
          ruleId: "change.medium-risk",
          severity: "medium",
          title: "Medium-risk change",
        },
      ];
      const verifications = [
        {
          command: { args: ["run", "test"], executable: "pnpm" },
          durationMs: 25,
          exitCode: 0,
          id: "test",
          status: "passed",
          stderr: { text: "", truncated: false },
          stdout: { text: "2 passed", truncated: false },
        },
      ] as const satisfies readonly ReportVerification[];
      const config = { review: 15, fail: 50 } as const;

      const evaluate = () => {
        const findingInputs: readonly RiskFindingInput[] = findings.map(
          ({ confidence, severity }) => ({ confidence, severity }),
        );
        const verificationInputs = verifications.map(({ id, status }) => ({
          id,
          status,
        }));
        const riskScore = calculateRiskScore({
          findings: findingInputs,
          verifications: verificationInputs,
        });
        const verdict = calculateVerdict(riskScore, config);
        const reportInput: AgentGuardReportAssemblyInput = {
          changes,
          findings,
          project: {
            ecosystem: "node",
            frameworks: [],
            languages: ["typescript"],
            packageManager: "pnpm",
            repositoryRoot: fixture.directory,
          },
          riskScore,
          verdict,
          verifications,
          version: "0.1.0",
        };

        return assembleAgentGuardReport(reportInput);
      };

      const firstReport = evaluate();
      const secondReport = evaluate();

      expect(secondReport).toEqual(firstReport);
      expect(secondReport.findings).toEqual(firstReport.findings);
      expect(secondReport.riskScore).toBe(45);
      expect(secondReport.verdict).toBe("review");
    } finally {
      await fixture.cleanup();
    }
  });
});
