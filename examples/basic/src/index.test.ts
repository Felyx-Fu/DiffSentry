import assert from "node:assert/strict";
import { test } from "node:test";
import { greet } from "./index.ts";

test("greets the supplied name", () => {
  assert.equal(greet("DiffSentry"), "Hello, DiffSentry!");
});
