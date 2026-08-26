import { describe, expect, it } from "vitest";
import {
  GitHubEventContextError,
  parseGitHubEventContext,
  readGitHubEventContext,
} from "./event-context.js";

const pullRequestPayload = {
  pull_request: {
    base: { ref: "main", sha: "base-sha" },
    head: { ref: "feature/guard", sha: "head-sha" },
  },
};

const pushPayload = {
  ref: "refs/heads/main",
  before: "before-sha",
  after: "after-sha",
};

describe("parseGitHubEventContext", () => {
  it("extracts pull-request base and head refs and SHAs", () => {
    expect(parseGitHubEventContext("pull_request", pullRequestPayload)).toEqual(
      {
        eventName: "pull_request",
        kind: "pull-request",
        baseRef: "main",
        baseSha: "base-sha",
        headRef: "feature/guard",
        headSha: "head-sha",
      },
    );
  });

  it("extracts push ref and maps before/after to base/head SHAs", () => {
    expect(parseGitHubEventContext("push", pushPayload)).toEqual({
      eventName: "push",
      kind: "push",
      ref: "refs/heads/main",
      baseSha: "before-sha",
      headSha: "after-sha",
    });
  });

  it("rejects unsupported event names", () => {
    expect(() => parseGitHubEventContext("issues", {})).toThrowError(
      new GitHubEventContextError("unsupported-event"),
    );
    expect(() => parseGitHubEventContext("pull_request_target", {})).toThrow(
      "Only pull_request and push events are supported",
    );
  });

  it("rejects incomplete supported event payloads", () => {
    expect(() =>
      parseGitHubEventContext("pull_request", {
        pull_request: { base: { ref: "main" }, head: {} },
      }),
    ).toThrowError(new GitHubEventContextError("invalid-payload"));
    expect(() =>
      parseGitHubEventContext("push", { ref: "refs/heads/main" }),
    ).toThrowError(new GitHubEventContextError("invalid-payload"));
  });
});

describe("readGitHubEventContext", () => {
  it("reads a pull-request fixture from the configured event path", async () => {
    const paths: string[] = [];

    await expect(
      readGitHubEventContext({
        eventName: "pull_request",
        eventPath: "C:/fixture/event.json",
        readText: async (path) => {
          paths.push(path);
          return JSON.stringify(pullRequestPayload);
        },
      }),
    ).resolves.toMatchObject({
      kind: "pull-request",
      baseSha: "base-sha",
      headSha: "head-sha",
    });
    expect(paths).toEqual(["C:/fixture/event.json"]);
  });

  it("reads a push fixture from the configured event path", async () => {
    await expect(
      readGitHubEventContext({
        eventName: "push",
        eventPath: "C:/fixture/push.json",
        readText: async () => JSON.stringify(pushPayload),
      }),
    ).resolves.toMatchObject({
      kind: "push",
      ref: "refs/heads/main",
      baseSha: "before-sha",
      headSha: "after-sha",
    });
  });

  it("reports missing environment inputs and malformed event files", async () => {
    await expect(
      readGitHubEventContext({ readText: async () => "{}" }),
    ).rejects.toThrowError(new GitHubEventContextError("missing-event-name"));

    await expect(
      readGitHubEventContext({
        eventName: "push",
        eventPath: "C:/fixture/missing.json",
        readText: async () => {
          throw new Error("not found");
        },
      }),
    ).rejects.toThrowError(new GitHubEventContextError("read-failed"));

    await expect(
      readGitHubEventContext({
        eventName: "push",
        eventPath: "C:/fixture/malformed.json",
        readText: async () => "{not-json",
      }),
    ).rejects.toThrowError(new GitHubEventContextError("invalid-json"));
  });
});
