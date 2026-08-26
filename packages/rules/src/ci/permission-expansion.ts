export type WorkflowPermissionLevel = "none" | "read" | "write";

export interface WorkflowPermissionExpansion {
  readonly permission: string;
  readonly before: WorkflowPermissionLevel;
  readonly after: WorkflowPermissionLevel;
}

const PERMISSION_LEVELS: Readonly<Record<WorkflowPermissionLevel, number>> = {
  none: 0,
  read: 1,
  write: 2,
};

function comparePermissionNames(left: string, right: string): number {
  if (left < right) {
    return -1;
  }
  if (left > right) {
    return 1;
  }
  return 0;
}

function stripComment(value: string): string {
  const commentStart = value.indexOf("#");
  return (commentStart === -1 ? value : value.slice(0, commentStart)).trim();
}

function parseInlinePermissions(
  value: string,
): Map<string, WorkflowPermissionLevel> | null {
  const normalizedValue = stripComment(value);
  if (normalizedValue === "read-all") {
    return new Map([["*", "read"]]);
  }
  if (normalizedValue === "write-all") {
    return new Map([["*", "write"]]);
  }
  if (normalizedValue === "{}") {
    return new Map([["*", "none"]]);
  }

  const inlineBody = /^\{\s*(.*?)\s*\}$/.exec(normalizedValue)?.[1];
  if (inlineBody === undefined) {
    return null;
  }

  const permissions = new Map<string, WorkflowPermissionLevel>();
  if (inlineBody.trim().length === 0) {
    permissions.set("*", "none");
    return permissions;
  }

  for (const entry of inlineBody.split(",")) {
    const match =
      /^\s*([A-Za-z][A-Za-z0-9_-]*)\s*:\s*(read|write|none)\s*$/.exec(entry);
    if (match === null) {
      return null;
    }
    const permission = match[1];
    const level = match[2] as WorkflowPermissionLevel | undefined;
    if (permission === undefined || level === undefined) {
      return null;
    }
    permissions.set(permission, level);
  }

  return permissions;
}

function parseWorkflowPermissions(
  contents: string,
): ReadonlyMap<string, WorkflowPermissionLevel> {
  const permissions = new Map<string, WorkflowPermissionLevel>();
  let activeBlockIndent: number | null = null;

  for (const line of contents.split(/\r?\n/)) {
    const trimmedLine = line.trim();
    if (trimmedLine.length === 0 || trimmedLine.startsWith("#")) {
      continue;
    }

    const indentation = line.length - line.trimStart().length;
    if (activeBlockIndent !== null && indentation <= activeBlockIndent) {
      activeBlockIndent = null;
    }

    if (activeBlockIndent !== null && indentation > activeBlockIndent) {
      const entry =
        /^([A-Za-z][A-Za-z0-9_-]*)\s*:\s*(read|write|none)\s*(?:#.*)?$/.exec(
          trimmedLine,
        );
      if (entry !== null) {
        const permission = entry[1];
        const level = entry[2] as WorkflowPermissionLevel | undefined;
        if (permission !== undefined && level !== undefined) {
          permissions.set(permission, level);
        }
      }
      continue;
    }

    const declaration = /^(\s*)permissions\s*:\s*(.*?)\s*$/.exec(line);
    if (declaration === null) {
      continue;
    }

    const value = declaration[2];
    if (value === undefined || ![0, 4].includes(indentation)) {
      continue;
    }

    if (value.trim().length === 0) {
      activeBlockIndent = indentation;
      continue;
    }

    const inlinePermissions = parseInlinePermissions(value);
    if (inlinePermissions === null) {
      continue;
    }
    for (const [permission, level] of inlinePermissions) {
      permissions.set(permission, level);
    }
  }

  return permissions;
}

function effectiveLevel(
  permissions: ReadonlyMap<string, WorkflowPermissionLevel>,
  permission: string,
): WorkflowPermissionLevel | undefined {
  return permissions.get(permission) ?? permissions.get("*");
}

function isExpansion(
  before: WorkflowPermissionLevel | undefined,
  after: WorkflowPermissionLevel | undefined,
): before is WorkflowPermissionLevel {
  return (
    before !== undefined &&
    after !== undefined &&
    PERMISSION_LEVELS[after] > PERMISSION_LEVELS[before]
  );
}

export function detectWorkflowPermissionExpansions(
  beforeContents: string,
  afterContents: string,
): readonly WorkflowPermissionExpansion[] {
  const before = parseWorkflowPermissions(beforeContents);
  const after = parseWorkflowPermissions(afterContents);
  const expansions: WorkflowPermissionExpansion[] = [];

  const beforeAll = before.get("*");
  const afterAll = after.get("*");
  if (
    beforeAll !== undefined &&
    afterAll !== undefined &&
    isExpansion(beforeAll, afterAll)
  ) {
    return [
      {
        after: afterAll,
        before: beforeAll,
        permission: "all",
      },
    ];
  }

  const permissionNames = new Set<string>();
  for (const permission of before.keys()) {
    if (permission !== "*") {
      permissionNames.add(permission);
    }
  }
  for (const permission of after.keys()) {
    if (permission !== "*") {
      permissionNames.add(permission);
    }
  }

  for (const permission of [...permissionNames].sort(comparePermissionNames)) {
    const beforeLevel = effectiveLevel(before, permission);
    const afterLevel = effectiveLevel(after, permission);
    if (!isExpansion(beforeLevel, afterLevel)) {
      continue;
    }
    if (afterLevel === undefined) {
      continue;
    }
    expansions.push({
      after: afterLevel,
      before: beforeLevel,
      permission,
    });
  }

  return expansions;
}
