import { describe, expect, it } from "vitest";
import {
  FileSystemError,
  NodeFileSystem,
  NodeGitProvider,
  NodeProcessRunner,
  ProcessError,
  SystemClock,
  SystemEnvironment,
} from "./index.js";

describe("runtime-node public API", () => {
  it("exports intended adapters from the package root", () => {
    expect([
      FileSystemError,
      NodeFileSystem,
      NodeGitProvider,
      NodeProcessRunner,
      ProcessError,
      SystemClock,
      SystemEnvironment,
    ]).toHaveLength(7);
  });
});
