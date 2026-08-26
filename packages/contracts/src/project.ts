export type Ecosystem = "node" | "unknown";

export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

export interface ProjectContext {
  readonly repositoryRoot: string;
  readonly ecosystem: Ecosystem;
  readonly packageManager: PackageManager;
  readonly languages: readonly string[];
  readonly frameworks: readonly string[];
}
