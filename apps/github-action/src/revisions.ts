import type { GitHubEventContext } from "./event-context.js";

/**
 * Resolves the explicit base commit selected by the event context.
 *
 * Pull requests provide `pull_request.base.sha`; push events provide the
 * previous commit as `before`, which the event reader exposes as `baseSha`.
 * The value is returned as data and is never interpolated into a command.
 */
export function resolveBaseSha(context: GitHubEventContext): string {
  return context.baseSha;
}

/**
 * Resolves the explicit head commit selected by the event context.
 *
 * Pull requests provide `pull_request.head.sha`; push events provide the
 * new commit as `after`, which the event reader exposes as `headSha`.
 * This is a read-only projection and does not mutate the repository.
 */
export function resolveHeadSha(context: GitHubEventContext): string {
  return context.headSha;
}
