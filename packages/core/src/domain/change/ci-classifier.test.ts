import { describe, expect, it } from "vitest";
import { classifyCiFile } from "./ci-classifier.js";

describe("classifyCiFile", () => {
  it("classifies GitHub Actions workflow YAML files", () => {
    expect(classifyCiFile(".github/workflows/ci.yml")).toBe("ci");
    expect(classifyCiFile(".github/workflows/release.yaml")).toBe("ci");
  });

  it("supports Windows separators and nested workflow paths", () => {
    expect(classifyCiFile(".github\\workflows\\nested\\check.yml")).toBe("ci");
  });

  it("leaves non-workflow files unknown", () => {
    expect(classifyCiFile(".github/ISSUE_TEMPLATE/bug.yml")).toBe("unknown");
    expect(classifyCiFile("scripts/ci.ts")).toBe("unknown");
    expect(classifyCiFile(".github/workflows/README.md")).toBe("unknown");
  });
});
