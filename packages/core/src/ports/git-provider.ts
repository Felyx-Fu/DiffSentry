export type GitFileState =
  | "added"
  | "modified"
  | "deleted"
  | "renamed"
  | "untracked"
  | "unknown";

export interface GitStatusEntry {
  readonly path: string;
  readonly state: GitFileState;
}

export interface GitStatus {
  readonly isClean: boolean;
  readonly entries: readonly GitStatusEntry[];
}

export interface GitProvider {
  isRepository(path: string): Promise<boolean>;
  getRepositoryRoot(path: string): Promise<string | null>;
  getStatus(repositoryRoot: string): Promise<GitStatus>;
  getDiff(
    repositoryRoot: string,
    baseRef: string,
    headRef: string,
  ): Promise<string>;
  getWorkingTreeDiff(repositoryRoot: string): Promise<string>;
}
