import { access, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

type FileSystemErrorCode = "not-found" | "read-failed";

export class FileSystemError extends Error {
  readonly code: FileSystemErrorCode;
  readonly path: string;

  constructor(code: FileSystemErrorCode, path: string) {
    super(`Filesystem ${code} error for ${path}`);
    this.name = "FileSystemError";
    this.code = code;
    this.path = path;
  }
}

function getNodeErrorCode(error: unknown): string | undefined {
  if (typeof error !== "object" || error === null || !("code" in error)) {
    return undefined;
  }

  const code = error.code;
  return typeof code === "string" ? code : undefined;
}

function isMissingPathError(error: unknown): boolean {
  const code = getNodeErrorCode(error);
  return code === "ENOENT" || code === "ENOTDIR";
}

export class NodeFileSystem {
  async exists(path: string): Promise<boolean> {
    try {
      await access(path);
      return true;
    } catch (error) {
      if (isMissingPathError(error)) {
        return false;
      }

      throw error;
    }
  }

  async readText(path: string): Promise<string> {
    try {
      return await readFile(path, { encoding: "utf8" });
    } catch (error) {
      if (isMissingPathError(error)) {
        throw new FileSystemError("not-found", path);
      }

      throw new FileSystemError("read-failed", path);
    }
  }

  async findUp(
    startDirectory: string,
    fileName: string,
  ): Promise<string | null> {
    let currentDirectory = resolve(startDirectory);

    while (true) {
      const candidatePath = join(currentDirectory, fileName);
      if (await this.exists(candidatePath)) {
        return candidatePath;
      }

      const parentDirectory = dirname(currentDirectory);
      if (parentDirectory === currentDirectory) {
        return null;
      }

      currentDirectory = parentDirectory;
    }
  }
}
