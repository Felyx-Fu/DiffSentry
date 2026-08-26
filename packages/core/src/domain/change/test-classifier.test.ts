import { describe, expect, it } from "vitest";
import { classifyTestFile } from "./test-classifier.js";

describe("classifyTestFile", () => {
  it("classifies common test and spec filename patterns", () => {
    expect(classifyTestFile("packages/core/src/project.test.ts")).toBe("test");
    expect(classifyTestFile("packages/core/src/project.spec.tsx")).toBe("test");
  });

  it("classifies tests and __tests__ directories", () => {
    expect(classifyTestFile("tests/integration/runtime/check.ts")).toBe("test");
    expect(classifyTestFile("packages/core/src/__tests__/check.ts")).toBe(
      "test",
    );
  });

  it("supports Windows separators", () => {
    expect(classifyTestFile("packages\\core\\src\\check.test.ts")).toBe("test");
  });

  it("leaves implementation files unknown", () => {
    expect(classifyTestFile("packages/core/src/domain/project.ts")).toBe(
      "unknown",
    );
    expect(classifyTestFile("README.md")).toBe("unknown");
  });
});
