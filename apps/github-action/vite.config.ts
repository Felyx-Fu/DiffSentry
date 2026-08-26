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
      "@felyx-fu/diffsentry-config": workspaceSource("config"),
      "@felyx-fu/diffsentry-contracts": workspaceSource("contracts"),
      "@felyx-fu/diffsentry-core": workspaceSource("core"),
      "@felyx-fu/diffsentry-report": workspaceSource("report"),
      "@felyx-fu/diffsentry-rules": workspaceSource("rules"),
      "@felyx-fu/diffsentry-runtime-node": workspaceSource("runtime-node"),
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
