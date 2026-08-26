import type { AssembledAgentGuardReport } from "@agentguard/core";
import { describe, expect, it } from "vitest";
import {
  GitHubActionFailOnError,
  mapGitHubActionStatus,
  parseActionFailOn,
  resolveGitHubActionStatus,
} from "./status-behavior.js";

function resultWithVerdict(verdict: AssembledAgentGuardReport["verdict"]) {
  return {
    report: {
      changes: { baseRef: "base", files: [], headRef: "head" },
      findings: [],
      project: {
        ecosystem: "unknown" as const,
        frameworks: [],
        languages: [],
        packageManager: "pnpm" as const,
        repositoryRoot: "E:/fixture",
      },
      riskScore: 0,
      schemaVersion: 1 as const,
      verdict,
      verifications: [],
      version: "0.1.0",
    },
  };
}

describe("parseActionFailOn", () => {
  it("uses fail as the default and accepts the documented values", () => {
    expect(parseActionFailOn(undefined)).toBe("fail");
    expect(parseActionFailOn("fail")).toBe("fail");
    expect(parseActionFailOn("review")).toBe("review");
    expect(parseActionFailOn("never")).toBe("never");
  });

  it("rejects undocumented behavior values", () => {
    expect(() => parseActionFailOn("always")).toThrowError(
      new GitHubActionFailOnError("always"),
    );
  });
});

describe("mapGitHubActionStatus", () => {
  it("fails only FAIL by default", () => {
    expect(mapGitHubActionStatus("pass")).toMatchObject({ status: "success" });
    expect(mapGitHubActionStatus("review")).toMatchObject({
      status: "success",
    });
    expect(mapGitHubActionStatus("fail")).toMatchObject({ status: "failure" });
  });

  it("fails REVIEW and FAIL when configured to fail on review", () => {
    expect(mapGitHubActionStatus("pass", "review").status).toBe("success");
    expect(mapGitHubActionStatus("review", "review").status).toBe("failure");
    expect(mapGitHubActionStatus("fail", "review").status).toBe("failure");
  });

  it("never fails for never", () => {
    expect(mapGitHubActionStatus("pass", "never").status).toBe("success");
    expect(mapGitHubActionStatus("review", "never").status).toBe("success");
    expect(mapGitHubActionStatus("fail", "never").status).toBe("success");
  });

  it("maps the structured check result without changing core semantics", () => {
    expect(
      resolveGitHubActionStatus(resultWithVerdict("review"), "review"),
    ).toEqual({
      failOn: "review",
      status: "failure",
      verdict: "review",
    });
  });
});
