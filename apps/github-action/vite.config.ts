import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

function workspaceSource(packageName: string): string {
  return fileURLToPath(
    new URL(`../../packages/${packageName}/src/index.ts`, import.meta.url),
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
  build: {
    emptyOutDir: true,
    lib: {
      entry: fileURLToPath(new URL("./src/main.ts", import.meta.url)),
      fileName: () => "main.js",
      formats: ["es"],
    },
    outDir: fileURLToPath(new URL("./dist", import.meta.url)),
    rollupOptions: {
      external: [/^node:/],
    },
    sourcemap: true,
    target: "node24",
  },
});
