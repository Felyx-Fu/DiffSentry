import { describe, expect, it } from "vitest";
import { detectSecretPatterns } from "./detector.js";
import { createRedactedSecretEvidence } from "./redaction.js";

describe("createRedactedSecretEvidence", () => {
  it("preserves type/location while redacting matched secret material", () => {
    const contents = 'const token = "0123456789abcdef";\n';
    const matches = detectSecretPatterns(contents);
    const evidence = createRedactedSecretEvidence(
      "src/config.ts",
      contents,
      matches,
    );

    expect(evidence).toEqual([
      {
        location: {
          endColumn: 32,
          endLine: 1,
          path: "src/config.ts",
          startColumn: 7,
          startLine: 1,
        },
        message:
          "Potential credential-assignment detected; matched value redacted.",
        patternId: "credential-assignment",
      },
    ]);
    const firstEvidence = evidence[0];
    expect(firstEvidence).toBeDefined();
    if (firstEvidence === undefined) {
      return;
    }
    expect(firstEvidence.message).not.toContain("0123456789abcdef");
    expect("value" in firstEvidence).toBe(false);
  });

  it("computes 1-based positions across lines and returns no evidence for no matches", () => {
    const contents = "first\n\npassword: 0123456789abcdef\n";
    const matches = detectSecretPatterns(contents);
    const evidence = createRedactedSecretEvidence(".env", contents, matches);

    const firstEvidence = evidence[0];
    expect(firstEvidence).toBeDefined();
    if (firstEvidence === undefined) {
      return;
    }
    expect(firstEvidence.location.startLine).toBe(3);
    expect(firstEvidence.location.startColumn).toBe(1);
    expect(
      createRedactedSecretEvidence("src/clean.ts", "const value = 1;", []),
    ).toEqual([]);
  });
});
