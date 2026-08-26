import { describe, expect, it } from "vitest";
import { classifyDependencyFile } from "./dependency-classifier.js";

describe("classifyDependencyFile", () => {
  it("classifies package manifests", () => {
    expect(classifyDependencyFile("package.json")).toBe("dependency");
    expect(classifyDependencyFile("apps/example/package.json")).toBe(
      "dependency",
    );
  });

  it("classifies all supported lockfile names", () => {
    for (const path of [
      "pnpm-lock.yaml",
      "package-lock.json",
      "npm-shrinkwrap.json",
      "yarn.lock",
      "bun.lock",
      "bun.lockb",
    ]) {
      expect(classifyDependencyFile(path)).toBe("dependency");
    }
  });

  it("supports Windows separators and leaves unrelated files unknown", () => {
    expect(classifyDependencyFile("packages\\app\\package.json")).toBe(
      "dependency",
    );
    expect(classifyDependencyFile("packages/core/src/index.ts")).toBe(
      "unknown",
    );
    expect(classifyDependencyFile("pnpm-workspace.yaml")).toBe("unknown");
  });
});
