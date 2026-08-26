import { afterEach, describe, expect, it, vi } from "vitest";
import { SystemClock } from "./system-clock.js";

describe("SystemClock", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns the current system time in milliseconds", () => {
    vi.spyOn(Date, "now").mockReturnValue(1_234_567_890);

    expect(new SystemClock().now()).toBe(1_234_567_890);
  });
});
