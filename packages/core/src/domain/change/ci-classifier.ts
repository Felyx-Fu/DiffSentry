export type CiClassification = "ci" | "unknown";

export function classifyCiFile(path: string): CiClassification {
  const normalizedPath = path.replaceAll("\\", "/").toLowerCase();
  const workflowDirectory = ".github/workflows/";
  const isWorkflowFile =
    (normalizedPath.startsWith(workflowDirectory) ||
      normalizedPath.includes(`/${workflowDirectory}`)) &&
    /\.(?:yml|yaml)$/.test(normalizedPath);

  return isWorkflowFile ? "ci" : "unknown";
}
