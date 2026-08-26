export function detectProjectEcosystem(
  hasPackageJson: boolean,
): "node" | "unknown" {
  return hasPackageJson ? "node" : "unknown";
}
