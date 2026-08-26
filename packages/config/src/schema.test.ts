import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import {
  CONFIG_RULE_ID_PATTERN,
  CONFIG_SEVERITIES,
  CONFIG_VERIFICATION_KEYS,
  DIFFSENTRY_CONFIG_FILE_NAME,
  DIFFSENTRY_CONFIG_SCHEMA_FILE_NAME,
} from "./schema.js";

interface JsonSchemaDocument {
  readonly $id: string;
  readonly $schema: string;
  readonly additionalProperties: boolean;
  readonly examples: readonly Record<string, unknown>[];
  readonly properties: Readonly<Record<string, unknown>>;
  readonly type: string;
}

const schemaFile = new URL(
  "../../../diffsentry.config.schema.json",
  import.meta.url,
);

const validExamples: readonly Record<string, unknown>[] = [
  {},
  {
    verification: { test: true, lint: false },
    rules: {
      "security.secret-exposure": { enabled: true, severity: "critical" },
    },
    thresholds: { review: 15, fail: 50 },
  },
];

const invalidExamples = [
  { unexpected: true },
  { thresholds: { review: 15 } },
  { verification: { test: "yes" } },
  { rules: { "security.secret-exposure": { severity: "urgent" } } },
] as const;

describe("DiffSentry JSON configuration schema", () => {
  it("publishes the JSON-only schema and stable configuration constants", async () => {
    const schema = JSON.parse(
      await readFile(schemaFile, "utf8"),
    ) as JsonSchemaDocument;

    expect(DIFFSENTRY_CONFIG_FILE_NAME).toBe("diffsentry.config.json");
    expect(DIFFSENTRY_CONFIG_SCHEMA_FILE_NAME).toBe(
      "diffsentry.config.schema.json",
    );
    expect(schema.$schema).toBe("https://json-schema.org/draft/2020-12/schema");
    expect(schema.$id).toBe(DIFFSENTRY_CONFIG_SCHEMA_FILE_NAME);
    expect(schema.type).toBe("object");
    expect(schema.additionalProperties).toBe(false);
    expect(Object.keys(schema.properties)).toEqual([
      "verification",
      "rules",
      "thresholds",
    ]);
    expect(schema.examples).toHaveLength(2);
    expect(CONFIG_VERIFICATION_KEYS).toEqual([
      "test",
      "lint",
      "typecheck",
      "build",
    ]);
    expect(CONFIG_SEVERITIES).toEqual([
      "info",
      "low",
      "medium",
      "high",
      "critical",
    ]);
    expect(CONFIG_RULE_ID_PATTERN.test("security.secret-exposure")).toBe(true);
  });

  it("keeps valid examples within the schema's documented root shape", () => {
    const allowedKeys = new Set(["verification", "rules", "thresholds"]);

    for (const example of validExamples) {
      expect(Object.keys(example).every((key) => allowedKeys.has(key))).toBe(
        true,
      );
    }
  });

  it("identifies representative invalid examples at documented boundaries", () => {
    expect(Object.keys(invalidExamples[0])).toContain("unexpected");
    expect(invalidExamples[1].thresholds).not.toHaveProperty("fail");
    expect(typeof invalidExamples[2].verification.test).toBe("string");
    const invalidSeverity: unknown =
      invalidExamples[3].rules["security.secret-exposure"].severity;
    expect(
      CONFIG_SEVERITIES.some((severity) => severity === invalidSeverity),
    ).toBe(false);
  });
});
