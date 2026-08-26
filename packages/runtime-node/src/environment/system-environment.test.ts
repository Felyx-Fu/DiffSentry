import { describe, expect, it } from "vitest";
import { SystemEnvironment } from "./system-environment.js";

describe("SystemEnvironment", () => {
  it("exposes only the runtime facts needed by composition", () => {
    const environment = new SystemEnvironment();

    expect(environment.getPlatform()).toBe(process.platform);
    expect(environment.getNodeVersion()).toBe(process.version);
    expect(environment.getWorkingDirectory()).toBe(process.cwd());
  });
});
