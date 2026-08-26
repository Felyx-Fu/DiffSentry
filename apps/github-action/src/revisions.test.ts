import { describe, expect, it } from "vitest";
import { parseGitHubEventContext } from "./event-context.js";
import { resolveBaseSha, resolveHeadSha } from "./revisions.js";

describe("resolveBaseSha", () => {
  it("resolves the explicit pull-request base SHA", () => {
    const context = parseGitHubEventContext("pull_request", {
      pull_request: {
        base: { ref: "main", sha: "base-commit-sha" },
        head: { ref: "feature", sha: "head-commit-sha" },
      },
    });

    expect(resolveBaseSha(context)).toBe("base-commit-sha");
  });

  it("resolves the push before commit as the base SHA", () => {
    const context = parseGitHubEventContext("push", {
      ref: "refs/heads/main",
      before: "before-commit-sha",
      after: "after-commit-sha",
    });

    expect(resolveBaseSha(context)).toBe("before-commit-sha");
  });

  it("returns the SHA as data without shell interpolation or rewriting", () => {
    const untrustedBaseSha = "$(do-not-run); base value";
    const context = parseGitHubEventContext("pull_request", {
      pull_request: {
        base: { ref: "main", sha: untrustedBaseSha },
        head: { ref: "feature", sha: "head-commit-sha" },
      },
    });

    expect(resolveBaseSha(context)).toBe(untrustedBaseSha);
  });

  it("resolves the explicit pull-request head SHA without changing context", () => {
    const context = parseGitHubEventContext("pull_request", {
      pull_request: {
        base: { ref: "main", sha: "base-commit-sha" },
        head: { ref: "feature", sha: "head-commit-sha" },
      },
    });
    const before = { ...context };

    expect(resolveHeadSha(context)).toBe("head-commit-sha");
    expect(context).toEqual(before);
  });

  it("resolves the push after commit as the head SHA", () => {
    const context = parseGitHubEventContext("push", {
      ref: "refs/heads/main",
      before: "before-commit-sha",
      after: "after-commit-sha",
    });

    expect(resolveHeadSha(context)).toBe("after-commit-sha");
  });
});
