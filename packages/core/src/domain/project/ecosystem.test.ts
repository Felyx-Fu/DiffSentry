import { describe, expect, it } from "vitest";
import { detectProjectEcosystem } from "./ecosystem.js";

describe("detectProjectEcosystem", () => {
  it("maps package.json presence to the Node ecosystem", () => {
    expect(detectProjectEcosystem(true)).toBe("node");
  });

  it("maps missing package.json to the unknown ecosystem", () => {
    expect(detectProjectEcosystem(false)).toBe("unknown");
  });
});
