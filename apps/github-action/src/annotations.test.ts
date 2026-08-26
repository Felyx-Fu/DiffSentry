import type { AssembledDiffSentryReport } from "@felyx-fu/diffsentry-core";
import { describe, expect, it } from "vitest";
import {
  createGitHubAnnotations,
  formatGitHubAnnotation,
  publishGitHubAnnotations,
} from "./annotations.js";

function createReport(): AssembledDiffSentryReport {
  return {
    changes: { baseRef: "base", files: [], headRef: "head" },
    findings: [
      {
        confidence: 1,
        evidence: [
          {
            location: { path: "src/evidence.ts", startLine: 8 },
            message: "Evidence location",
          },
        ],
        message: "Finding message",
        ruleId: "security.example",
        severity: "high",
        title: "High finding",
      },
      {
        confidence: 1,
        evidence: [
          {
            location: { path: "src/medium.ts", startLine: 3, endLine: 4 },
            message: "Medium evidence",
          },
        ],
        location: {
          endColumn: 9,
          endLine: 2,
          path: "src/medium.ts",
          startColumn: 2,
          startLine: 2,
        },
        message: "Medium finding",
        ruleId: "testing.example",
        severity: "medium",
        title: "Medium finding",
      },
      {
        confidence: 1,
        evidence: [
          {
            location: { path: "src/invalid.ts" },
            message: "Missing line must be ignored",
          },
        ],
        message: "Invalid location",
        ruleId: "config.example",
        severity: "low",
        title: "Invalid finding",
      },
    ],
    project: {
      ecosystem: "unknown",
      frameworks: [],
      languages: [],
      packageManager: "pnpm",
      repositoryRoot: "E:/fixture",
    },
    riskScore: 45,
    schemaVersion: 1,
    verdict: "review",
    verifications: [],
    version: "0.1.0",
  };
}

describe("createGitHubAnnotations", () => {
  it("uses valid finding locations and falls back to valid evidence locations", () => {
    expect(createGitHubAnnotations(createReport())).toEqual([
      {
        file: "src/evidence.ts",
        level: "error",
        message: "Finding message",
        startLine: 8,
        title: "High finding",
      },
      {
        endColumn: 9,
        endLine: 2,
        file: "src/medium.ts",
        level: "warning",
        message: "Medium finding",
        startColumn: 2,
        startLine: 2,
        title: "Medium finding",
      },
    ]);
  });

  it("does not fabricate an annotation for a location without a line", () => {
    expect(createGitHubAnnotations(createReport())).not.toContainEqual(
      expect.objectContaining({ file: "src/invalid.ts" }),
    );
  });
});

describe("formatGitHubAnnotation and publishGitHubAnnotations", () => {
  it("escapes workflow-command delimiters and writes only valid annotations", () => {
    const annotation = {
      file: "src/a,b.ts",
      level: "error" as const,
      message: "line one\nline two%",
      startLine: 4,
      title: "Title: sensitive",
    };

    expect(formatGitHubAnnotation(annotation)).toBe(
      "::error file=src/a%2Cb.ts,line=4,title=Title%3A sensitive::line one%0Aline two%25",
    );

    const lines: string[] = [];
    expect(
      publishGitHubAnnotations({
        report: createReport(),
        writeLine: (line) => lines.push(line),
      }),
    ).toHaveLength(2);
    expect(lines).toHaveLength(2);
    expect(lines[0]).toContain("::error");
    expect(lines[1]).toContain("::warning");
  });
});
