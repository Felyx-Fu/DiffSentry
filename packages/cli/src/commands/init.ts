import { access, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  DIFFSENTRY_CONFIG_FILE_NAME,
  validateConfig,
} from "@felyx-fu/diffsentry-config";

export const MINIMAL_CONFIG_TEXT = "{}\n";

export interface InitFileSystem {
  exists(path: string): Promise<boolean>;
  writeText(path: string, contents: string): Promise<void>;
}

export interface InitCommandOptions {
  readonly cwd?: string;
  readonly fileSystem?: InitFileSystem;
}

export interface InitCommandCreated {
  readonly kind: "created";
  readonly path: string;
}

export interface InitCommandAlreadyExists {
  readonly kind: "already-exists";
  readonly path: string;
}

export type InitCommandOutcome = InitCommandAlreadyExists | InitCommandCreated;

const DEFAULT_FILE_SYSTEM: InitFileSystem = {
  async exists(path): Promise<boolean> {
    try {
      await access(path);
      return true;
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "ENOENT"
      ) {
        return false;
      }

      throw error;
    }
  },
  async writeText(path, contents): Promise<void> {
    await writeFile(path, contents, {
      encoding: "utf8",
      flag: "wx",
    });
  },
};

export async function runInitCommand(
  options: InitCommandOptions = {},
): Promise<InitCommandOutcome> {
  const cwd = options.cwd ?? process.cwd();
  const path = join(cwd, DIFFSENTRY_CONFIG_FILE_NAME);
  const fileSystem = options.fileSystem ?? DEFAULT_FILE_SYSTEM;

  if (await fileSystem.exists(path)) {
    return { kind: "already-exists", path };
  }

  const parsedMinimalConfig: unknown = JSON.parse(MINIMAL_CONFIG_TEXT);
  if (!validateConfig(parsedMinimalConfig)) {
    throw new Error("Internal error: minimal config does not satisfy schema");
  }

  await fileSystem.writeText(path, MINIMAL_CONFIG_TEXT);
  return { kind: "created", path };
}
