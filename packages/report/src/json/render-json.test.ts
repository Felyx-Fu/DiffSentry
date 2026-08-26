import type { DiffSentryReport } from "@felyx-fu/diffsentry-contracts";
import { describe, expect, it } from "vitest";
import { renderJsonReport } from "./render-json.js";

const report: DiffSentryReport = {
  changes: {
    baseRef: "main",
    files: [],
    headRef: "feature",
  },
  findings: [],
  project: {
    ecosystem: "unknown",
    frameworks: [],
    languages: [],
    packageManager: "pnpm",
    repositoryRoot: "E:/workspace",
  },
  riskScore: 15,
  schemaVersion: 1,
  verdict: "review",
  verifications: [],
  version: "0.1.0",
};

describe("renderJsonReport", () => {
  it("serializes a stable schema-versioned report", () => {
    expect(renderJsonReport(report)).toMatchInlineSnapshot(`
      "{
        "version": "0.1.0",
        "schemaVersion": 1,
        "project": {
          "ecosystem": "unknown",
          "frameworks": [],
          "languages": [],
          "packageManager": "pnpm",
          "repositoryRoot": "E:/workspace"
        },
        "changes": {
          "baseRef": "main",
          "files": [],
          "headRef": "feature"
        },
        "findings": [],
        "verifications": [],
        "riskScore": 15,
        "verdict": "review"
      }"
    `);
    expect(JSON.parse(renderJsonReport(report))).toMatchObject({
      riskScore: 15,
      schemaVersion: 1,
      verdict: "review",
    });
  });
});
