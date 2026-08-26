import { describe, expect, it } from "vitest";
import type { ChangeSet } from "./change.js";
import type { DiffSentryConfig } from "./config.js";
import type { Evidence } from "./evidence.js";
import type { Finding } from "./finding.js";
import type { ProjectContext } from "./project.js";
import type { DiffSentryReport } from "./report.js";
import { REPORT_SCHEMA_VERSION } from "./report.js";
import type { VerificationResult } from "./verification.js";

describe("contracts", () => {
  it("represents supported project and change metadata", () => {
    const project: ProjectContext = {
      repositoryRoot: "C:/workspace/example",
      ecosystem: "node",
      packageManager: "pnpm",
      languages: ["typescript"],
      frameworks: [],
    };
    const changes: ChangeSet = {
      baseRef: "base-ref",
      headRef: "head-ref",
      files: [
        {
          path: "src/index.ts",
          status: "modified",
          additions: 3,
          deletions: 1,
          category: "source",
        },
      ],
    };

    expect(project.ecosystem).toBe("node");
    expect(changes.files[0]?.status).toBe("modified");
  });

  it("represents evidence-backed findings and bounded verification output", () => {
    const evidenceLocation = {
      path: "src/auth.ts",
      startLine: 12,
    };
    const evidence: Evidence = {
      message: "A changed source file has no related test file.",
      location: evidenceLocation,
    };
    const finding: Finding = {
      ruleId: "testing.source-without-tests",
      severity: "medium",
      title: "Changed source has no related test",
      message: evidence.message,
      evidence: [evidence],
      confidence: 0.9,
      location: evidenceLocation,
    };
    const verification: VerificationResult = {
      id: "typecheck",
      status: "passed",
      command: {
        executable: "pnpm",
        args: ["typecheck"],
      },
      durationMs: 120,
      exitCode: 0,
      stdout: {
        text: "No errors",
        truncated: false,
      },
      stderr: {
        text: "",
        truncated: false,
      },
    };

    const report: DiffSentryReport = {
      version: "0.1.0",
      schemaVersion: REPORT_SCHEMA_VERSION,
      project: {
        repositoryRoot: "C:/workspace/example",
        ecosystem: "node",
        packageManager: "pnpm",
        languages: ["typescript"],
        frameworks: [],
      },
      changes: {
        baseRef: "base-ref",
        headRef: "head-ref",
        files: [],
      },
      findings: [finding],
      verifications: [verification],
      riskScore: 35,
      verdict: "review",
    };

    expect(report.findings[0]?.evidence[0]?.location?.path).toBe("src/auth.ts");
    expect(report.verifications[0]?.stdout.truncated).toBe(false);
    expect(report.schemaVersion).toBe(1);
  });

  it("represents partial JSON configuration overrides", () => {
    const config: DiffSentryConfig = {
      verification: {
        test: true,
        typecheck: false,
      },
      rules: {
        "security.secret-exposure": {
          enabled: true,
          severity: "critical",
        },
      },
      thresholds: {
        review: 40,
        fail: 70,
      },
    };

    expect(config.rules?.["security.secret-exposure"]?.severity).toBe(
      "critical",
    );
    expect(config.thresholds?.fail).toBe(70);
  });
});
