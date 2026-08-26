export interface EvidenceLocation {
  readonly path: string;
  readonly startLine?: number;
  readonly startColumn?: number;
  readonly endLine?: number;
  readonly endColumn?: number;
}

export interface Evidence {
  readonly message: string;
  readonly location?: EvidenceLocation;
}
