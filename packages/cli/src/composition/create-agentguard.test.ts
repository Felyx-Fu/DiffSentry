import type {
  AgentGuardReportAssemblyInput,
  CheckRepositoryDependencies,
} from "@agentguard/core";
import { CheckRepositoryUseCase } from "@agentguard/core";
import { describe, expect, it } from "vitest";
import { createAgentGuard } from "./create-agentguard.js";

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

function createReportInput(): AgentGuardReportAssemblyInput {
  return {
    changes: {
      baseRef: "HEAD~1",
      files: [],
      headRef: "HEAD",
    },
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
  };
}

describe("createAgentGuard", () => {
  it("wires injected runtime, merged configuration, rules, and report", () => {
    const runtime = createTestRuntime();
    const report = {
      assemble: (input: AgentGuardReportAssemblyInput) => ({
        ...input,
        schemaVersion: 1 as const,
      }),
    };

    const composition = createAgentGuard({
      cli: { verification: { build: true } },
      config: { verification: { build: false, lint: false } },
      report,
      runtime,
    });

    expect(composition.checker).toBeInstanceOf(CheckRepositoryUseCase);
    expect(composition.checker.dependencies).toEqual(runtime);
    expect(composition.config.verification).toEqual({
      build: true,
      lint: false,
      test: true,
      typecheck: true,
    });
    expect(composition.report).toBe(report);
    expect(
      composition.rules.map((registration) => registration.metadata.id),
    ).toEqual([
      "ci.workflow-permission-change",
      "dependency.runtime-dependency-added",
      "security.secret-exposure",
      "testing.auth-without-tests",
      "testing.source-without-tests",
    ]);
  });

  it("provides a schema-versioned default report assembler", () => {
    const composition = createAgentGuard();

    expect(composition.report.assemble(createReportInput())).toMatchObject({
      schemaVersion: 1,
      version: "0.1.0",
    });
  });
});
