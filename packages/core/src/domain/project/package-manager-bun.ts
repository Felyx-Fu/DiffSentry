import type { FileSystemPort } from "../../ports/file-system.js";

function hasBunPackageManagerMetadata(text: string): boolean {
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
      packageManager.trim().startsWith("bun@")
    );
  } catch {
    return false;
  }
}

export async function isBunProject(
  fileSystem: FileSystemPort,
  startDirectory: string,
): Promise<boolean> {
  for (const lockfile of ["bun.lock", "bun.lockb"]) {
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

  return hasBunPackageManagerMetadata(
    await fileSystem.readText(packageJsonPath),
  );
}
