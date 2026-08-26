import { describe, expect, it } from "vitest";
import { parsePackageDependencyDelta } from "./package-dependency-delta.js";

describe("parsePackageDependencyDelta", () => {
  it("reports runtime and development additions/removals", () => {
    expect(
      parsePackageDependencyDelta(
        JSON.stringify({
          dependencies: { legacy: "^1.0.0", shared: "^1.0.0" },
          devDependencies: { oldLint: "^1.0.0", sharedTool: "^1.0.0" },
        }),
        JSON.stringify({
          dependencies: { added: "^2.0.0", shared: "^2.0.0" },
          devDependencies: { newLint: "^2.0.0", sharedTool: "^2.0.0" },
        }),
      ),
    ).toEqual({
      addedDevDependencies: ["newLint"],
      addedRuntimeDependencies: ["added"],
      removedDevDependencies: ["oldLint"],
      removedRuntimeDependencies: ["legacy"],
    });
  });

  it("does not treat version-only changes or non-runtime fields as additions", () => {
    expect(
      parsePackageDependencyDelta(
        JSON.stringify({
          dependencies: { shared: "^1.0.0" },
          peerDependencies: { peerOnly: "^1.0.0" },
        }),
        JSON.stringify({
          dependencies: { shared: "^2.0.0" },
          peerDependencies: { peerOnly: "^2.0.0", anotherPeer: "^1.0.0" },
        }),
      ),
    ).toEqual({
      addedDevDependencies: [],
      addedRuntimeDependencies: [],
      removedDevDependencies: [],
      removedRuntimeDependencies: [],
    });
  });

  it("returns deterministic empty deltas when dependency fields are absent", () => {
    expect(parsePackageDependencyDelta("{}", "{}")).toEqual({
      addedDevDependencies: [],
      addedRuntimeDependencies: [],
      removedDevDependencies: [],
      removedRuntimeDependencies: [],
    });
  });

  it("rejects invalid JSON and non-string dependency versions", () => {
    expect(() => parsePackageDependencyDelta("{", "{}")).toThrow(
      "Invalid package.json",
    );
    expect(() =>
      parsePackageDependencyDelta(
        JSON.stringify({ dependencies: { invalid: 1 } }),
        "{}",
      ),
    ).toThrow("Invalid dependencies in package.json");
  });
});
