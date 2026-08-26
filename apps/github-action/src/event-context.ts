/// <reference types="node" />

import { readFile } from "node:fs/promises";

export type SupportedGitHubEventName = "pull_request" | "push";

export interface PullRequestEventContext {
  readonly eventName: "pull_request";
  readonly kind: "pull-request";
  readonly baseRef: string;
  readonly baseSha: string;
  readonly headRef: string;
  readonly headSha: string;
}

export interface PushEventContext {
  readonly eventName: "push";
  readonly kind: "push";
  readonly ref: string;
  /** The push payload's `before` commit, used as the base SHA. */
  readonly baseSha: string;
  /** The push payload's `after` commit, used as the head SHA. */
  readonly headSha: string;
}

export type GitHubEventContext = PullRequestEventContext | PushEventContext;

export type GitHubEventContextErrorCode =
  | "missing-event-name"
  | "missing-event-path"
  | "unsupported-event"
  | "read-failed"
  | "invalid-json"
  | "invalid-payload";

const ERROR_MESSAGES: Readonly<Record<GitHubEventContextErrorCode, string>> = {
  "missing-event-name": "GITHUB_EVENT_NAME is required",
  "missing-event-path": "GITHUB_EVENT_PATH is required",
  "unsupported-event": "Only pull_request and push events are supported",
  "read-failed": "The GitHub event payload could not be read",
  "invalid-json": "The GitHub event payload is not valid JSON",
  "invalid-payload": "The GitHub event payload has an unsupported shape",
};

export class GitHubEventContextError extends Error {
  readonly code: GitHubEventContextErrorCode;

  constructor(code: GitHubEventContextErrorCode) {
    super(ERROR_MESSAGES[code]);
    this.name = "GitHubEventContextError";
    this.code = code;
  }
}

type JsonObject = Record<string, unknown>;

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readRequiredString(object: JsonObject, key: string): string {
  const value = object[key];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new GitHubEventContextError("invalid-payload");
  }

  return value;
}

function readPullRequestContext(payload: unknown): PullRequestEventContext {
  if (!isJsonObject(payload) || !isJsonObject(payload.pull_request)) {
    throw new GitHubEventContextError("invalid-payload");
  }

  const pullRequest = payload.pull_request;
  if (!isJsonObject(pullRequest.base) || !isJsonObject(pullRequest.head)) {
    throw new GitHubEventContextError("invalid-payload");
  }

  return {
    eventName: "pull_request",
    kind: "pull-request",
    baseRef: readRequiredString(pullRequest.base, "ref"),
    baseSha: readRequiredString(pullRequest.base, "sha"),
    headRef: readRequiredString(pullRequest.head, "ref"),
    headSha: readRequiredString(pullRequest.head, "sha"),
  };
}

function readPushContext(payload: unknown): PushEventContext {
  if (!isJsonObject(payload)) {
    throw new GitHubEventContextError("invalid-payload");
  }

  return {
    eventName: "push",
    kind: "push",
    ref: readRequiredString(payload, "ref"),
    baseSha: readRequiredString(payload, "before"),
    headSha: readRequiredString(payload, "after"),
  };
}

export function parseGitHubEventContext(
  eventName: string,
  payload: unknown,
): GitHubEventContext {
  switch (eventName) {
    case "pull_request":
      return readPullRequestContext(payload);
    case "push":
      return readPushContext(payload);
    default:
      throw new GitHubEventContextError("unsupported-event");
  }
}

export interface ReadGitHubEventContextOptions {
  readonly eventName?: string;
  readonly eventPath?: string;
  readonly readText?: (path: string) => Promise<string>;
}

async function readEventFile(path: string): Promise<string> {
  return readFile(path, { encoding: "utf8" });
}

export async function readGitHubEventContext(
  options: ReadGitHubEventContextOptions = {},
): Promise<GitHubEventContext> {
  const eventName = options.eventName ?? process.env.GITHUB_EVENT_NAME;
  if (eventName === undefined || eventName.length === 0) {
    throw new GitHubEventContextError("missing-event-name");
  }

  const eventPath = options.eventPath ?? process.env.GITHUB_EVENT_PATH;
  if (eventPath === undefined || eventPath.length === 0) {
    throw new GitHubEventContextError("missing-event-path");
  }

  let eventText: string;
  try {
    eventText = await (options.readText ?? readEventFile)(eventPath);
  } catch {
    throw new GitHubEventContextError("read-failed");
  }

  let payload: unknown;
  try {
    payload = JSON.parse(eventText) as unknown;
  } catch {
    throw new GitHubEventContextError("invalid-json");
  }

  return parseGitHubEventContext(eventName, payload);
}
