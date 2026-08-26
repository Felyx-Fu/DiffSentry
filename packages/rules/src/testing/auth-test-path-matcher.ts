const TEST_PATH_MARKER =
  /(?:^|[\\/])(?:__tests__|tests?)(?:[\\/]|$)|(?:^|[._-])(?:spec|test)(?:$|[._-])/i;
const TEST_SUFFIX = /(?:[._-](?:spec|test))$/i;

function pathStem(path: string): string {
  const normalizedPath = path.replaceAll("\\", "/").toLowerCase();
  const lastSegment = normalizedPath.split("/").pop() ?? "";
  return lastSegment.replace(/\.[^.]+$/, "").replace(TEST_SUFFIX, "");
}

/**
 * Matches a test path to an auth source path by explicit test markers and
 * normalized filename identity. This is a naming heuristic, not coverage
 * analysis.
 */
export function isRelatedAuthTestPath(
  authPath: string,
  testPath: string,
): boolean {
  if (!TEST_PATH_MARKER.test(testPath.replaceAll("\\", "/"))) {
    return false;
  }

  return pathStem(authPath) === pathStem(testPath);
}
