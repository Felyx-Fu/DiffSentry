import { describe, expect, it } from "vitest";
import { classifySourceFile } from "./source-classifier.js";

describe("classifySourceFile", () => {
  it("classifies package and app implementation paths as source", () => {
    expect(classifySourceFile("packages/core/src/domain/project.ts")).toBe(
      "source",
    );
    expect(classifySourceFile("apps/github-action/src/main.ts")).toBe("source");
  });

  it("supports Windows separators", () => {
    expect(classifySourceFile("packages\\core\\src\\domain\\project.ts")).toBe(
      "source",
    );
  });

  it("leaves test paths and declaration files unknown", () => {
    expect(classifySourceFile("packages/core/src/domain/project.test.ts")).toBe(
      "unknown",
    );
    expect(classifySourceFile("packages/core/src/types.d.ts")).toBe("unknown");
    expect(classifySourceFile("packages/core/src/__tests__/project.ts")).toBe(
      "unknown",
    );
  });

  it("leaves root configuration and documentation paths unknown", () => {
    expect(classifySourceFile("vitest.config.ts")).toBe("unknown");
    expect(classifySourceFile("README.md")).toBe("unknown");
  });
});
