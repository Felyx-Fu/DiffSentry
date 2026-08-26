const AUTH_PATH_TOKEN_PATTERN =
  /(?:^|[\\/_.-])(?:access-control|auth|authentication|authorization|credential|credentials|identity|login|logout|oauth2?|password|permission|permissions|rbac|session|signin|sign-in|signout|sign-out|sso|token)(?=$|[\\/_.-])/i;

/**
 * Matches only explicit authentication-related path components.
 *
 * This is intentionally a path-only heuristic. It does not inspect file
 * contents, syntax, or symbol names, and it requires component boundaries so
 * words such as `author` and `tokenizer` do not match accidentally.
 */
export function isAuthRelatedPath(path: string): boolean {
  return AUTH_PATH_TOKEN_PATTERN.test(path.replaceAll("\\", "/"));
}
