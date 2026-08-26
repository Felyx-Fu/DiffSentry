import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

function workspaceSource(packageName: string): string {
  return fileURLToPath(
    new URL(`./packages/${packageName}/src/index.ts`, import.meta.url),
  );
}

export default defineConfig({
  resolve: {
    alias: {
      "@agentguard/config": workspaceSource("config"),
      "@agentguard/contracts": workspaceSource("contracts"),
      "@agentguard/core": workspaceSource("core"),
      "@agentguard/report": workspaceSource("report"),
      "@agentguard/rules": workspaceSource("rules"),
      "@agentguard/runtime-node": workspaceSource("runtime-node"),
    },
  },
  test: {
    passWithNoTests: true,
  },
});
