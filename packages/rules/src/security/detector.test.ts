import { describe, expect, it } from "vitest";
import { detectSecretPatterns } from "./detector.js";

describe("detectSecretPatterns", () => {
  it("detects documented high-signal secret markers without returning values", () => {
    const contents = [
      'const apiKey = "0123456789abcdef-secret";',
      "-----BEGIN RSA PRIVATE KEY-----",
      "token=ghp_1234567890abcdefghijklmnopqrstu",
      "accessKey=AKIA1234567890ABCDEF",
      "npmToken=npm_1234567890abcdefghijklmnopqrstu",
      "stripe=sk_live_1234567890abcdef",
    ].join("\n");

    const matches = detectSecretPatterns(contents);

    expect(matches.map(({ patternId }) => patternId)).toEqual([
      "credential-assignment",
      "private-key-marker",
      "credential-assignment",
      "provider-token",
      "provider-token",
      "provider-token",
      "provider-token",
    ]);
    expect(
      matches.every(
        (match) =>
          Object.keys(match).sort().join(",") === "end,patternId,start",
      ),
    ).toBe(true);
  });

  it("does not flag short values, placeholders, or names without assignments", () => {
    expect(
      detectSecretPatterns(
        [
          'const password = "short";',
          'const token = "placeholder";',
          "const apiKey = undefined;",
          "const secretName = 'configuration';",
        ].join("\n"),
      ),
    ).toEqual([]);
  });

  it("returns deterministic source ranges in source order", () => {
    const contents = 'token = "0123456789abcdef";\n';
    const first = detectSecretPatterns(contents);
    const second = detectSecretPatterns(contents);

    expect(second).toEqual(first);
    expect(first[0]).toEqual({
      end: contents.length - 2,
      patternId: "credential-assignment",
      start: 0,
    });
  });
});
