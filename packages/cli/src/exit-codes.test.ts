import { describe, expect, it } from "vitest";
import {
  CLI_EXIT_CODES,
  type CliExitOutcome,
  mapCliExitCode,
} from "./exit-codes.js";

describe("mapCliExitCode", () => {
  it("maps AgentGuard verdicts to CLI process codes", () => {
    const outcomes: readonly [CliExitOutcome, number][] = [
      [{ kind: "verdict", verdict: "pass" }, 0],
      [{ kind: "verdict", verdict: "review" }, 1],
      [{ kind: "verdict", verdict: "fail" }, 2],
      [{ kind: "internal-error" }, 3],
    ];

    for (const [outcome, expected] of outcomes) {
      expect(mapCliExitCode(outcome)).toBe(expected);
    }
  });

  it("keeps the process code table explicit and immutable", () => {
    expect(CLI_EXIT_CODES).toEqual({
      fail: 2,
      internalError: 3,
      pass: 0,
      review: 1,
    });
  });
});
