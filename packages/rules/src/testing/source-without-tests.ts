export type TestingFileCategory = "source" | "test" | string;

export interface TestingChangedFile {
  readonly path: string;
  readonly category: TestingFileCategory;
}

export interface SourceWithoutTestsContext {
  readonly files: readonly TestingChangedFile[];
}

export interface SourceWithoutTestsDetection {
  readonly sourcePaths: readonly string[];
  readonly testPaths: readonly string[];
}

export function detectSourceWithoutTests(
  context: SourceWithoutTestsContext,
): SourceWithoutTestsDetection | null {
  const sourcePaths = context.files
    .filter((file) => file.category === "source")
    .map((file) => file.path);
  const testPaths = context.files
    .filter((file) => file.category === "test")
    .map((file) => file.path);

  if (sourcePaths.length === 0 || testPaths.length > 0) {
    return null;
  }

  return { sourcePaths, testPaths };
}
