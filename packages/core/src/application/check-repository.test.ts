import { describe, expect, it } from "vitest";
import type { CheckRepositoryDependencies } from "./check-repository.js";
import { CheckRepositoryUseCase } from "./check-repository.js";

describe("CheckRepositoryUseCase", () => {
  it("can be constructed with injected test doubles", () => {
    const dependencies: CheckRepositoryDependencies = {
      clock: {
        now: () => 0,
      },
      fileSystem: {
        exists: async () => false,
        findUp: async () => null,
        readText: async () => "",
      },
      gitProvider: {
        getDiff: async () => "",
        getRepositoryRoot: async () => null,
        getStatus: async () => ({ isClean: true, entries: [] }),
        getWorkingTreeDiff: async () => "",
        isRepository: async () => false,
      },
      processRunner: {
        run: async () => {
          throw new Error("test double should not execute");
        },
      },
    };

    const useCase = new CheckRepositoryUseCase(dependencies);

    expect(useCase).toBeInstanceOf(CheckRepositoryUseCase);
    expect(useCase.dependencies).toBe(dependencies);
  });
});
