export type FileStatus = "added" | "modified" | "deleted" | "renamed";

export type FileCategory =
  | "source"
  | "test"
  | "config"
  | "dependency"
  | "documentation"
  | "ci"
  | "unknown";

export interface ChangedFile {
  readonly path: string;
  readonly status: FileStatus;
  readonly additions: number;
  readonly deletions: number;
  readonly category: FileCategory;
}

export interface ChangeSet {
  readonly baseRef: string;
  readonly headRef: string;
  readonly files: readonly ChangedFile[];
}
