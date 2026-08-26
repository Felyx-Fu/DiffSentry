import type { FileSystemPort } from "../../ports/file-system.js";

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null;
}

function hasTypeScriptDependency(text: string): boolean {
  try {
    const value: unknown = JSON.parse(text);
    if (!isRecord(value)) {
      return false;
    }

    for (const section of [
      "dependencies",
      "devDependencies",
      "peerDependencies",
      "optionalDependencies",
    ]) {
      const dependencies = value[section];
      if (isRecord(dependencies) && "typescript" in dependencies) {
        return true;
      }
    }
  } catch {
    return false;
  }

  return false;
}

export async function isTypeScriptProject(
  fileSystem: FileSystemPort,
  startDirectory: string,
): Promise<boolean> {
  if ((await fileSystem.findUp(startDirectory, "tsconfig.json")) !== null) {
    return true;
  }

  const packageJsonPath = await fileSystem.findUp(
    startDirectory,
    "package.json",
  );
  if (packageJsonPath === null) {
    return false;
  }

  return hasTypeScriptDependency(await fileSystem.readText(packageJsonPath));
}
