import { type ParsedFileStatus, parseGitDiff } from "./change-parser.js";
import {
  classifyFileCategory,
  type FileCategory,
} from "./file-category-classifier.js";

export interface AssembledChangedFile {
  readonly path: string;
  readonly status: ParsedFileStatus;
  readonly additions: number;
  readonly deletions: number;
  readonly category: FileCategory;
}

export interface AssembledChangeSet {
  readonly baseRef: string;
  readonly headRef: string;
  readonly files: readonly AssembledChangedFile[];
}

export function assembleChangeSet(
  rawDiff: string,
  baseRef: string,
  headRef: string,
): AssembledChangeSet {
  const parsedChangeSet = parseGitDiff(rawDiff, baseRef, headRef);

  return {
    baseRef: parsedChangeSet.baseRef,
    headRef: parsedChangeSet.headRef,
    files: parsedChangeSet.files.map((file) => ({
      ...file,
      category: classifyFileCategory(file.path),
    })),
  };
}
