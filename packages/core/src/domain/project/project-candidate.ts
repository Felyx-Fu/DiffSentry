import type { FileSystemPort } from "../../ports/file-system.js";

export async function isNodeProjectCandidate(
  fileSystem: FileSystemPort,
  startDirectory: string,
): Promise<boolean> {
  return (await fileSystem.findUp(startDirectory, "package.json")) !== null;
}
