import type {
  AgentGuardReportAssemblyInput,
  CheckRepositoryDependencies,
} from "@agentguard/core";
import { CheckRepositoryUseCase } from "@agentguard/core";
import { BUILT_IN_RULES } from "@agentguard/rules";
import { describe, expect, it } from "vitest";
import { createGitHubActionComposition } from "./composition.js";
import { parseGitHubEventContext } from "./event-context.js";

function createTestRuntime(): CheckRepositoryDependencies {
  return {
    clock: { now: () => 123 },
    fileSystem: {
      exists: async () => false,
      findUp: async () => null,
      readText: async () => "",
    },
    gitProvider: {
      getDiff: async () => "",
      getRepositoryRoot: async () => null,
      getStatus: async () => ({ isClean: true, entries: [] }),
      getWorkingTreeDiff: async () => "",
      isRepository: async () => false,
    },
    processRunner: {
      run: async () => {
        throw new Error("test double should not execute");
      },
    },
  };
}

describe("createGitHubActionComposition", () => {
  it("reuses the core checker, built-in rules, config merge, and report port", () => {
    const runtime = createTestRuntime();
    const report = {
      assemble: (input: AgentGuardReportAssemblyInput) => ({
        ...input,
        schemaVersion: 1 as const,
      }),
    };
    const context = parseGitHubEventContext("pull_request", {
      pull_request: {
        base: { ref: "main", sha: "base-sha" },
        head: { ref: "feature", sha: "head-sha" },
      },
    });

    const composition = createGitHubActionComposition({
      config: { verification: { build: false, lint: false } },
      context,
      report,
      runtime,
    });

    expect(composition.checker).toBeInstanceOf(CheckRepositoryUseCase);
    expect(composition.checker.dependencies).toEqual(runtime);
    expect(composition.config.verification).toEqual({
      build: false,
      lint: false,
      test: true,
      typecheck: true,
    });
    expect(composition.report).toBe(report);
    expect(composition.rules).toBe(BUILT_IN_RULES);
    expect(composition.baseSha).toBe("base-sha");
    expect(composition.headSha).toBe("head-sha");
  });

  it("provides the same schema-versioned default report assembler", () => {
    const context = parseGitHubEventContext("push", {
      ref: "refs/heads/main",
      before: "before-sha",
      after: "after-sha",
    });
    const composition = createGitHubActionComposition({ context });

    expect(
      composition.report.assemble({
        changes: { baseRef: "before-sha", files: [], headRef: "after-sha" },
        findings: [],
        project: {
          ecosystem: "unknown",
          frameworks: [],
          languages: [],
          packageManager: "pnpm",
          repositoryRoot: "E:/fixture",
        },
        riskScore: 0,
        verdict: "pass",
        verifications: [],
        version: "0.1.0",
      }),
    ).toMatchObject({
      schemaVersion: 1,
      version: "0.1.0",
    });
  });
});
