import type { FileSystemPort } from "../../ports/file-system.js";

export interface KnownPackageScripts {
  readonly test: string | null;
  readonly lint: string | null;
  readonly typecheck: string | null;
  readonly build: string | null;
}

const EMPTY_PACKAGE_SCRIPTS: KnownPackageScripts = {
  test: null,
  lint: null,
  typecheck: null,
  build: null,
};

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null;
}

function getScriptValue(
  scripts: Readonly<Record<string, unknown>>,
  name: keyof KnownPackageScripts,
): string | null {
  const value = scripts[name];
  return typeof value === "string" ? value : null;
}

function parseKnownPackageScripts(text: string): KnownPackageScripts {
  try {
    const value: unknown = JSON.parse(text);
    if (!isRecord(value) || !isRecord(value.scripts)) {
      return EMPTY_PACKAGE_SCRIPTS;
    }

    return {
      test: getScriptValue(value.scripts, "test"),
      lint: getScriptValue(value.scripts, "lint"),
      typecheck: getScriptValue(value.scripts, "typecheck"),
      build: getScriptValue(value.scripts, "build"),
    };
  } catch {
    return EMPTY_PACKAGE_SCRIPTS;
  }
}

export async function readKnownPackageScripts(
  fileSystem: FileSystemPort,
  startDirectory: string,
): Promise<KnownPackageScripts | null> {
  const packageJsonPath = await fileSystem.findUp(
    startDirectory,
    "package.json",
  );
  if (packageJsonPath === null) {
    return null;
  }

  return parseKnownPackageScripts(await fileSystem.readText(packageJsonPath));
}
