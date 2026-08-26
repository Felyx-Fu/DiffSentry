import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  createDiffSentry,
  mapCliExitCode,
  renderCheckReport,
  runCheckCommand,
} from "../../packages/cli/src/index.js";
import type { DiffSentryReport } from "../../packages/contracts/src/index.js";
import { assembleChangeSet } from "../../packages/core/src/domain/change/change-set.js";
import {
  calculateRiskScore,
  calculateVerdict,
} from "../../packages/core/src/index.js";
import { secretExposureRule } from "../../packages/rules/src/index.js";
import { createGitTestFixture } from "../../packages/runtime-node/src/test-utils/git-fixture.js";

describe("CLI fixture flow", () => {
  it("runs the real package-local check stack and matches the fail verdict", async () => {
    const fixture = await createGitTestFixture();

    try {
      await fixture.writeFile(
        "package.json",
        JSON.stringify(
          { name: "diffsentry-e2e-fixture", packageManager: "pnpm@10.0.0" },
          null,
          2,
        ),
      );
      await fixture.writeFile("secret.ts", "export const safe = true;\n");
      await fixture.stage("package.json");
      await fixture.stage("secret.ts");
      await fixture.commit("baseline");

      const secretFixture = await readFile(
        new URL(
          "../fixtures/rules/secret-exposure/positive.ts",
          import.meta.url,
        ),
        "utf8",
      );
      await fixture.writeFile("secret.ts", secretFixture);
      await fixture.stage("secret.ts");

      const composition = createDiffSentry();
      const check = await runCheckCommand({
        composition,
        cwd: fixture.directory,
      });

      expect(check.kind).toBe("checked");
      if (check.kind !== "checked") {
        throw new Error("Expected the Git fixture to be a repository");
      }

      const changedContents = await composition.runtime.fileSystem.readText(
        join(check.repositoryRoot, "secret.ts"),
      );
      const findings = await secretExposureRule.run({
        changedFiles: [{ contents: changedContents, path: "secret.ts" }],
      });
      const riskScore = calculateRiskScore({ findings, verifications: [] });
      const verdict = calculateVerdict(
        riskScore,
        composition.config.thresholds,
      );
      const report: DiffSentryReport = {
        changes: assembleChangeSet(check.diff, "HEAD", "WORKTREE"),
        findings,
        project: {
          ecosystem: "node",
          frameworks: [],
          languages: ["typescript"],
          packageManager: "pnpm",
          repositoryRoot: check.repositoryRoot,
        },
        riskScore,
        schemaVersion: 1,
        verdict,
        verifications: [],
        version: "0.1.0",
      };

      expect(renderCheckReport(check.format, report)).toMatchInlineSnapshot(`
        "DiffSentry 0.1.0
        Verdict: FAIL
        Risk score: 50/100
        Findings: 1
        Verifications: 0

        Findings:
        - [CRITICAL] Secret exposure (security.secret-exposure)
          High-signal secret-like material detected in secret.ts; matched values are redacted.
          Evidence: Potential credential-assignment detected; matched value redacted. at secret.ts:1:7-1:32

        Verifications: none"
      `);
      expect(mapCliExitCode({ kind: "verdict", verdict })).toBe(2);
    } finally {
      await fixture.cleanup();
    }
  });
});
