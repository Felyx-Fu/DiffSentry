import type { Clock } from "../ports/clock.js";
import type { FileSystemPort } from "../ports/file-system.js";
import type { GitProvider } from "../ports/git-provider.js";
import type { ProcessRunner } from "../ports/process-runner.js";

export interface CheckRepositoryDependencies {
  readonly clock: Clock;
  readonly fileSystem: FileSystemPort;
  readonly gitProvider: GitProvider;
  readonly processRunner: ProcessRunner;
}

export class CheckRepositoryUseCase {
  constructor(readonly dependencies: CheckRepositoryDependencies) {}
}
