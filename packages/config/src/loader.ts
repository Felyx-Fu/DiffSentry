import { DIFFSENTRY_CONFIG_FILE_NAME } from "./schema.js";

export interface ConfigFileSystem {
  findUp(startDirectory: string, fileName: string): Promise<string | null>;
}

export function findConfigFile(
  fileSystem: ConfigFileSystem,
  startDirectory: string,
): Promise<string | null> {
  return fileSystem.findUp(startDirectory, DIFFSENTRY_CONFIG_FILE_NAME);
}
