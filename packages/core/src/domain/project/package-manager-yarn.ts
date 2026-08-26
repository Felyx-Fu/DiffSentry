import type { FileSystemPort } from "../../ports/file-system.js";

function hasYarnPackageManagerMetadata(text: string): boolean {
  try {
    const value: unknown = JSON.parse(text);
    if (
      typeof value !== "object" ||
      value === null ||
      !("packageManager" in value)
    ) {
      return false;
    }

    const packageManager = value.packageManager;
    return (
      typeof packageManager === "string" &&
      packageManager.trim().startsWith("yarn@")
    );
  } catch {
    return false;
  }
}

export async function isYarnProject(
  fileSystem: FileSystemPort,
  startDirectory: string,
): Promise<boolean> {
  if ((await fileSystem.findUp(startDirectory, "yarn.lock")) !== null) {
    return true;
  }

  const packageJsonPath = await fileSystem.findUp(
    startDirectory,
    "package.json",
  );
  if (packageJsonPath === null) {
    return false;
  }

  return hasYarnPackageManagerMetadata(
    await fileSystem.readText(packageJsonPath),
  );
}
