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
      "@felyx-fu/diffsentry-config": workspaceSource("config"),
      "@felyx-fu/diffsentry-contracts": workspaceSource("contracts"),
      "@felyx-fu/diffsentry-core": workspaceSource("core"),
      "@felyx-fu/diffsentry-report": workspaceSource("report"),
      "@felyx-fu/diffsentry-rules": workspaceSource("rules"),
      "@felyx-fu/diffsentry-runtime-node": workspaceSource("runtime-node"),
    },
  },
  test: {
    passWithNoTests: true,
  },
});
