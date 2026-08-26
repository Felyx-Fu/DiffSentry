import type { FileSystemPort } from "../../ports/file-system.js";

function hasNpmPackageManagerMetadata(text: string): boolean {
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
      packageManager.trim().startsWith("npm@")
    );
  } catch {
    return false;
  }
}

export async function isNpmProject(
  fileSystem: FileSystemPort,
  startDirectory: string,
): Promise<boolean> {
  for (const lockfile of ["package-lock.json", "npm-shrinkwrap.json"]) {
    if ((await fileSystem.findUp(startDirectory, lockfile)) !== null) {
      return true;
    }
  }

  const packageJsonPath = await fileSystem.findUp(
    startDirectory,
    "package.json",
  );
  if (packageJsonPath === null) {
    return false;
  }

  return hasNpmPackageManagerMetadata(
    await fileSystem.readText(packageJsonPath),
  );
}
