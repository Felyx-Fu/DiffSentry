import { describe, expect, it } from "vitest";
import {
  getVerificationPenalty,
  VERIFICATION_PENALTIES,
} from "./verification-penalty.js";

describe("verification penalties", () => {
  it("applies the fixed penalty matrix to every verifier status", () => {
    expect(getVerificationPenalty({ id: "test", status: "passed" })).toBe(0);
    expect(getVerificationPenalty({ id: "test", status: "skipped" })).toBe(0);
    expect(getVerificationPenalty({ id: "test", status: "error" })).toBe(30);
    expect(getVerificationPenalty({ id: "test", status: "failed" })).toBe(50);

    expect(getVerificationPenalty({ id: "typecheck", status: "passed" })).toBe(
      0,
    );
    expect(getVerificationPenalty({ id: "typecheck", status: "skipped" })).toBe(
      0,
    );
    expect(getVerificationPenalty({ id: "typecheck", status: "error" })).toBe(
      30,
    );
    expect(getVerificationPenalty({ id: "typecheck", status: "failed" })).toBe(
      50,
    );

    expect(getVerificationPenalty({ id: "build", status: "passed" })).toBe(0);
    expect(getVerificationPenalty({ id: "build", status: "skipped" })).toBe(0);
    expect(getVerificationPenalty({ id: "build", status: "error" })).toBe(30);
    expect(getVerificationPenalty({ id: "build", status: "failed" })).toBe(50);

    expect(getVerificationPenalty({ id: "lint", status: "passed" })).toBe(0);
    expect(getVerificationPenalty({ id: "lint", status: "skipped" })).toBe(0);
    expect(getVerificationPenalty({ id: "lint", status: "error" })).toBe(10);
    expect(getVerificationPenalty({ id: "lint", status: "failed" })).toBe(15);
  });

  it("scores verification errors but has no DiffSentry internal-error entry", () => {
    expect(getVerificationPenalty({ id: "test", status: "error" })).toBe(30);
    expect(Object.keys(VERIFICATION_PENALTIES)).toEqual([
      "build",
      "lint",
      "test",
      "typecheck",
    ]);
    expect(
      Object.values(VERIFICATION_PENALTIES).every(
        (penalties) => !Object.hasOwn(penalties, "internal-error"),
      ),
    ).toBe(true);
  });
});
