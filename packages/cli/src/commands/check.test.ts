import type { DiffSentryReport } from "@felyx-fu/diffsentry-contracts";
import type { CheckRepositoryDependencies } from "@felyx-fu/diffsentry-core";
import {
  renderJsonReport,
  renderMarkdownReport,
  renderTerminalReport,
} from "@felyx-fu/diffsentry-report";
import { describe, expect, it } from "vitest";
import { createDiffSentry } from "../composition/create-diffsentry.js";
import {
  CHECK_CI_DEFAULT_FORMAT,
  CheckCommandConfigError,
  CheckCommandFormatError,
  parseCheckFormat,
  renderCheckReport,
  resolveCheckFormat,
  runCheckCommand,
} from "./check.js";

function createRuntime(
  gitProvider: CheckRepositoryDependencies["gitProvider"],
  readText: (path: string) => Promise<string> = async (_path) => "",
): CheckRepositoryDependencies {
  return {
    clock: { now: () => 0 },
    fileSystem: {
      exists: async () => false,
      findUp: async () => null,
      readText,
    },
    gitProvider,
    processRunner: {
      run: async () => {
        throw new Error("process runner should not be used by the basic flow");
      },
    },
  };
}

const report: DiffSentryReport = {
  changes: { baseRef: "main", files: [], headRef: "feature" },
  findings: [],
  project: {
    ecosystem: "unknown",
    frameworks: [],
    languages: [],
    packageManager: "pnpm",
    repositoryRoot: "E:/workspace",
  },
  riskScore: 0,
  schemaVersion: 1,
  verdict: "pass",
  verifications: [],
  version: "0.1.0",
};

describe("runCheckCommand", () => {
  it("collects the current repository status and working-tree diff", async () => {
    const calls: string[] = [];
    const composition = createDiffSentry({
      runtime: createRuntime({
        getDiff: async () => "",
        getRepositoryRoot: async (path) => {
          calls.push(`root:${path}`);
          return "E:/workspace";
        },
        getStatus: async (repositoryRoot) => {
          calls.push(`status:${repositoryRoot}`);
          return {
            entries: [{ path: "src/index.ts", state: "modified" }],
            isClean: false,
          };
        },
        getWorkingTreeDiff: async (repositoryRoot) => {
          calls.push(`diff:${repositoryRoot}`);
          return "diff --git a/src/index.ts b/src/index.ts";
        },
        isRepository: async () => true,
      }),
    });

    await expect(
      runCheckCommand({
        composition,
        cwd: "E:/workspace/packages/cli",
      }),
    ).resolves.toEqual({
      kind: "checked",
      repositoryRoot: "E:/workspace",
      status: {
        entries: [{ path: "src/index.ts", state: "modified" }],
        isClean: false,
      },
      diff: "diff --git a/src/index.ts b/src/index.ts",
      diffSelection: { kind: "working-tree" },
      config: {
        rules: {},
        thresholds: { fail: 50, review: 15 },
        verification: { build: false, lint: true, test: true, typecheck: true },
      },
      format: "terminal",
    });
    expect(calls).toEqual([
      "root:E:/workspace/packages/cli",
      "status:E:/workspace",
      "diff:E:/workspace",
    ]);
  });

  it("passes an explicit base ref as a semantic GitProvider argument", async () => {
    const calls: string[] = [];
    const composition = createDiffSentry({
      runtime: createRuntime({
        getDiff: async (repositoryRoot, baseRef, headRef) => {
          calls.push(`diff:${repositoryRoot}:${baseRef}:${headRef}`);
          return "base diff";
        },
        getRepositoryRoot: async () => "E:/workspace",
        getStatus: async () => ({ entries: [], isClean: true }),
        getWorkingTreeDiff: async () => {
          calls.push("working-tree-diff");
          return "working tree diff";
        },
        isRepository: async () => true,
      }),
    });

    await expect(
      runCheckCommand({
        baseRef: "origin/main",
        composition,
        cwd: "E:/workspace",
      }),
    ).resolves.toMatchObject({
      diff: "base diff",
      diffSelection: {
        baseRef: "origin/main",
        headRef: "HEAD",
        kind: "base-to-head",
      },
    });
    expect(calls).toEqual(["diff:E:/workspace:origin/main:HEAD"]);
  });

  it("passes explicit base and head refs together without shell construction", async () => {
    const calls: string[] = [];
    const composition = createDiffSentry({
      runtime: createRuntime({
        getDiff: async (repositoryRoot, baseRef, headRef) => {
          calls.push(`diff:${repositoryRoot}:${baseRef}:${headRef}`);
          return "combined ref diff";
        },
        getRepositoryRoot: async () => "E:/workspace",
        getStatus: async () => ({ entries: [], isClean: true }),
        getWorkingTreeDiff: async () => "should not be used",
        isRepository: async () => true,
      }),
    });

    await expect(
      runCheckCommand({
        baseRef: "origin/main",
        composition,
        cwd: "E:/workspace",
        headRef: "feature/ref",
      }),
    ).resolves.toMatchObject({
      diff: "combined ref diff",
      diffSelection: {
        baseRef: "origin/main",
        headRef: "feature/ref",
        kind: "base-to-head",
      },
    });
    expect(calls).toEqual(["diff:E:/workspace:origin/main:feature/ref"]);
  });

  it("uses HEAD as the semantic base when only a head ref is supplied", async () => {
    const calls: string[] = [];
    const composition = createDiffSentry({
      runtime: createRuntime({
        getDiff: async (repositoryRoot, baseRef, headRef) => {
          calls.push(`diff:${repositoryRoot}:${baseRef}:${headRef}`);
          return "head-only diff";
        },
        getRepositoryRoot: async () => "E:/workspace",
        getStatus: async () => ({ entries: [], isClean: true }),
        getWorkingTreeDiff: async () => "should not be used",
        isRepository: async () => true,
      }),
    });

    await expect(
      runCheckCommand({
        composition,
        cwd: "E:/workspace",
        headRef: "feature/ref",
      }),
    ).resolves.toMatchObject({
      diff: "head-only diff",
      diffSelection: {
        baseRef: "HEAD",
        headRef: "feature/ref",
        kind: "base-to-head",
      },
    });
    expect(calls).toEqual(["diff:E:/workspace:HEAD:feature/ref"]);
  });

  it("returns a structured non-repository outcome without collecting a diff", async () => {
    const calls: string[] = [];
    const composition = createDiffSentry({
      runtime: createRuntime({
        getDiff: async () => "",
        getRepositoryRoot: async () => null,
        getStatus: async () => {
          calls.push("status");
          return { entries: [], isClean: true };
        },
        getWorkingTreeDiff: async () => {
          calls.push("diff");
          return "";
        },
        isRepository: async () => false,
      }),
    });

    await expect(
      runCheckCommand({ composition, cwd: "E:/not-a-repository" }),
    ).resolves.toEqual({
      kind: "not-a-repository",
      repositoryRoot: null,
      status: null,
      diff: null,
      diffSelection: null,
      config: {
        rules: {},
        thresholds: { fail: 50, review: 15 },
        verification: { build: false, lint: true, test: true, typecheck: true },
      },
      format: "terminal",
    });
    expect(calls).toEqual([]);
  });

  it("loads and validates an explicit JSON config path before checking", async () => {
    const readPaths: string[] = [];
    const composition = createDiffSentry({
      runtime: createRuntime(
        {
          getDiff: async () => "",
          getRepositoryRoot: async () => "E:/workspace",
          getStatus: async () => ({ entries: [], isClean: true }),
          getWorkingTreeDiff: async () => "",
          isRepository: async () => true,
        },
        async (path) => {
          readPaths.push(path);
          return JSON.stringify({
            thresholds: { fail: 80, review: 20 },
            verification: { build: true, lint: false },
          });
        },
      ),
    });

    await expect(
      runCheckCommand({
        composition,
        configPath: "E:/workspace/diffsentry.custom.json",
        cwd: "E:/workspace",
      }),
    ).resolves.toMatchObject({
      config: {
        thresholds: { fail: 80, review: 20 },
        verification: {
          build: true,
          lint: false,
          test: true,
          typecheck: true,
        },
      },
    });
    expect(readPaths).toEqual(["E:/workspace/diffsentry.custom.json"]);
  });

  it("accepts only the supported report format names", () => {
    expect(parseCheckFormat(undefined)).toBe("terminal");
    expect(parseCheckFormat("terminal")).toBe("terminal");
    expect(parseCheckFormat("json")).toBe("json");
    expect(parseCheckFormat("markdown")).toBe("markdown");
    expect(() => parseCheckFormat("html")).toThrow(CheckCommandFormatError);
    expect(() => parseCheckFormat("html")).toThrow(
      "Expected terminal, json, or markdown",
    );
  });

  it("uses JSON as the CI default without overriding an explicit format", () => {
    expect(CHECK_CI_DEFAULT_FORMAT).toBe("json");
    expect(resolveCheckFormat(undefined, false)).toBe("terminal");
    expect(resolveCheckFormat(undefined, true)).toBe("json");
    expect(resolveCheckFormat("markdown", true)).toBe("markdown");
  });

  it("delegates every supported format to the report package renderer", () => {
    expect(renderCheckReport("terminal", report)).toBe(
      renderTerminalReport(report),
    );
    expect(renderCheckReport("json", report)).toBe(renderJsonReport(report));
    expect(renderCheckReport("markdown", report)).toBe(
      renderMarkdownReport(report),
    );
  });

  it("rejects malformed, non-JSON, and invalid-schema config paths", async () => {
    const composition = createDiffSentry({
      runtime: createRuntime(
        {
          getDiff: async () => "",
          getRepositoryRoot: async () => "E:/workspace",
          getStatus: async () => ({ entries: [], isClean: true }),
          getWorkingTreeDiff: async () => "",
          isRepository: async () => true,
        },
        async (path) =>
          path.endsWith("malformed.json")
            ? "{"
            : path.endsWith("javascript.json")
              ? "module.exports = {};"
              : JSON.stringify({ verification: { test: "yes" } }),
      ),
    });

    await expect(
      runCheckCommand({
        composition,
        configPath: "E:/workspace/malformed.json",
        cwd: "E:/workspace",
      }),
    ).rejects.toMatchObject({
      code: "invalid-json",
      name: "CheckCommandConfigError",
      path: "E:/workspace/malformed.json",
    });
    await expect(
      runCheckCommand({
        composition,
        configPath: "E:/workspace/javascript.json",
        cwd: "E:/workspace",
      }),
    ).rejects.toBeInstanceOf(CheckCommandConfigError);
    await expect(
      runCheckCommand({
        composition,
        configPath: "E:/workspace/invalid-shape.json",
        cwd: "E:/workspace",
      }),
    ).rejects.toMatchObject({
      code: "invalid-shape",
      path: "E:/workspace/invalid-shape.json",
    });
  });

  it("reports an unreadable explicit config path without executing anything", async () => {
    const composition = createDiffSentry({
      runtime: createRuntime(
        {
          getDiff: async () => "",
          getRepositoryRoot: async () => "E:/workspace",
          getStatus: async () => ({ entries: [], isClean: true }),
          getWorkingTreeDiff: async () => "",
          isRepository: async () => true,
        },
        async () => {
          throw new Error("missing config");
        },
      ),
    });

    await expect(
      runCheckCommand({
        composition,
        configPath: "E:/workspace/missing.json",
        cwd: "E:/workspace",
      }),
    ).rejects.toMatchObject({
      code: "read-failed",
      path: "E:/workspace/missing.json",
    });
  });
});
