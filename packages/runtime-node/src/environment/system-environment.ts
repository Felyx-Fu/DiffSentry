import type { NodePlatform } from "../node-platform.js";

export class SystemEnvironment {
  getPlatform(): NodePlatform {
    return process.platform;
  }

  getNodeVersion(): string {
    return process.version;
  }

  getWorkingDirectory(): string {
    return process.cwd();
  }
}
