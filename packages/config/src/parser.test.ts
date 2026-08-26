import { describe, expect, it } from "vitest";
import { ConfigParseError, parseConfigJson } from "./parser.js";

describe("parseConfigJson", () => {
  it("parses JSON data without changing its values", () => {
    expect(
      parseConfigJson(
        '{"verification":{"test":true},"thresholds":{"review":15,"fail":50}}',
      ),
    ).toEqual({
      verification: { test: true },
      thresholds: { review: 15, fail: 50 },
    });
  });

  it("wraps malformed JSON in a typed configuration error", () => {
    expect(() => parseConfigJson('{"verification":')).toThrow(ConfigParseError);
    expect(() => parseConfigJson('{"verification":')).toThrow(
      "Configuration must be valid JSON",
    );
    try {
      parseConfigJson("{");
    } catch (error) {
      expect(error).toMatchObject({
        code: "invalid-json",
        name: "ConfigParseError",
      });
    }
  });

  it("rejects executable JavaScript/TypeScript text instead of evaluating it", () => {
    expect(() =>
      parseConfigJson("module.exports = { thresholds: {} };"),
    ).toThrow(ConfigParseError);
    expect(() => parseConfigJson("export default { test: true };")).toThrow(
      ConfigParseError,
    );
  });
});
