import { describe, expect, it } from "vitest";
import { classifyFileCategory } from "./file-category-classifier.js";

describe("classifyFileCategory", () => {
  it("classifies source, test, dependency, and CI files", () => {
    expect(classifyFileCategory("packages/core/src/domain/project.ts")).toBe(
      "source",
    );
    expect(classifyFileCategory("packages/core/src/project.test.ts")).toBe(
      "test",
    );
    expect(classifyFileCategory("package.json")).toBe("dependency");
    expect(classifyFileCategory(".github/workflows/ci.yml")).toBe("ci");
  });

  it("classifies common configuration files", () => {
    expect(classifyFileCategory("tsconfig.json")).toBe("config");
    expect(classifyFileCategory("tsconfig.base.json")).toBe("config");
    expect(classifyFileCategory("pnpm-workspace.yaml")).toBe("config");
    expect(classifyFileCategory("vitest.config.ts")).toBe("config");
    expect(classifyFileCategory(".editorconfig")).toBe("config");
  });

  it("classifies documentation and leaves unrelated paths unknown", () => {
    expect(classifyFileCategory("README.md")).toBe("documentation");
    expect(classifyFileCategory("docs/architecture.md")).toBe("documentation");
    expect(classifyFileCategory("LICENSE")).toBe("documentation");
    expect(classifyFileCategory("assets/logo.png")).toBe("unknown");
  });

  it("keeps dependency precedence over generic config names", () => {
    expect(classifyFileCategory("packages/example/package.json")).toBe(
      "dependency",
    );
  });
});
