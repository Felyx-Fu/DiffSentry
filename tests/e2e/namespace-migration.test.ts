import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

interface PackageManifest {
  readonly name?: string;
  readonly version?: string;
  readonly private?: boolean;
  readonly type?: string;
  readonly main?: string;
  readonly types?: string;
  readonly exports?: Readonly<Record<string, Readonly<Record<string, string>>>>;
  readonly bin?: Readonly<Record<string, string>>;
  readonly files?: readonly string[];
  readonly publishConfig?: Readonly<Record<string, unknown>>;
  readonly repository?: Readonly<Record<string, string>>;
  readonly bugs?: Readonly<Record<string, string>>;
  readonly homepage?: string;
  readonly dependencies?: Readonly<Record<string, string>>;
}

const repositoryUrl = "git+https://github.com/Felyx-Fu/DiffSentry.git" as const;
const bugsUrl = "https://github.com/Felyx-Fu/DiffSentry/issues" as const;
const homepage = "https://github.com/Felyx-Fu/DiffSentry#readme" as const;
const rootDirectory = fileURLToPath(new URL("../../", import.meta.url));

const publicPackages = [
  ["packages/cli", "@felyx-fu/diffsentry"],
  ["packages/contracts", "@felyx-fu/diffsentry-contracts"],
  ["packages/core", "@felyx-fu/diffsentry-core"],
  ["packages/runtime-node", "@felyx-fu/diffsentry-runtime-node"],
  ["packages/rules", "@felyx-fu/diffsentry-rules"],
  ["packages/config", "@felyx-fu/diffsentry-config"],
  ["packages/report", "@felyx-fu/diffsentry-report"],
] as const;

async function readManifest(
  relativeDirectory: string,
): Promise<PackageManifest> {
  const contents = await readFile(
    join(rootDirectory, relativeDirectory, "package.json"),
    "utf8",
  );
  return JSON.parse(contents) as PackageManifest;
}

async function collectFiles(path: string): Promise<string[]> {
  const entries = await readdir(path, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const entryPath = join(path, entry.name);
    if (entry.isDirectory()) {
      if (
        [".git", ".turbo", "coverage", "dist", "node_modules"].includes(
          entry.name,
        )
      ) {
        continue;
      }
      files.push(...(await collectFiles(entryPath)));
      continue;
    }

    if (entry.isFile()) {
      files.push(entryPath);
    }
  }

  return files;
}

async function readCurrentProductSurface(): Promise<string> {
  const paths = [
    ".github",
    "apps",
    "docs/architecture",
    "docs/release",
    "docs/specs",
    "examples",
    "packages",
    "00-READ-ME-FIRST.md",
    "01-PROJECT-CHARTER.md",
    "02-ARCHITECTURE.md",
    "03-ENGINEERING-STANDARDS.md",
    "04-CODEX-EXECUTION-PROTOCOL.md",
    "05-SECURITY-AND-TRUST-BOUNDARIES.md",
    "06-DEFINITION-OF-DONE.md",
    "07-TARGET-REPOSITORY-TREE.md",
    "AGENTS.md",
    "CODEX-START-PROMPT.md",
    "CONTRIBUTING.md",
    "README.md",
    "README.zh-CN.md",
    "ROADMAP.md",
    "SECURITY.md",
    "TASK-INDEX.md",
  ];
  const files: string[] = [];

  for (const relativePath of paths) {
    const absolutePath = join(rootDirectory, relativePath);
    const entries = await readdir(absolutePath, { withFileTypes: true }).catch(
      () => null,
    );
    if (entries === null) {
      files.push(absolutePath);
      continue;
    }
    files.push(...(await collectFiles(absolutePath)));
  }

  const contents = await Promise.all(
    files.map(async (file) => {
      const text = await readFile(file, "utf8");
      return `${relative(rootDirectory, file)}\n${text}`;
    }),
  );
  return contents.join("\n");
}

describe("DiffSentry namespace migration", () => {
  it("keeps the seven public package manifests on the final identity", async () => {
    for (const [relativeDirectory, expectedName] of publicPackages) {
      const manifest = await readManifest(relativeDirectory);

      expect(manifest.name).toBe(expectedName);
      expect(manifest.version).toBe("0.1.0");
      expect(manifest.type).toBe("module");
      expect(manifest.main).toBe("./dist/index.js");
      expect(manifest.types).toBe("./dist/index.d.ts");
      expect(manifest.files).toEqual(["README.md", "LICENSE", "dist"]);
      expect(manifest.publishConfig?.access).toBe("public");
      expect(manifest.repository).toEqual({
        type: "git",
        url: repositoryUrl,
        directory: relativeDirectory,
      });
      expect(manifest.bugs?.url).toBe(bugsUrl);
      expect(manifest.homepage).toBe(homepage);

      expect(manifest.exports?.["."]).toEqual({
        types: "./dist/index.d.ts",
        import: "./dist/index.js",
      });
    }
  });

  it("uses the new public dependency graph and CLI executable", async () => {
    const cli = await readManifest("packages/cli");
    expect(cli.bin).toEqual({ diffsentry: "./dist/main.js" });
    expect(cli.dependencies).toEqual({
      "@felyx-fu/diffsentry-config": "workspace:*",
      "@felyx-fu/diffsentry-contracts": "workspace:*",
      "@felyx-fu/diffsentry-core": "workspace:*",
      "@felyx-fu/diffsentry-report": "workspace:*",
      "@felyx-fu/diffsentry-rules": "workspace:*",
      "@felyx-fu/diffsentry-runtime-node": "workspace:*",
    });

    const report = await readManifest("packages/report");
    expect(report.dependencies).toEqual({
      "@felyx-fu/diffsentry-contracts": "workspace:*",
    });

    const action = await readManifest("apps/github-action");
    expect(action.name).toBe("@felyx-fu/diffsentry-github-action");
    expect(action.private).toBe(true);
  });

  it("keeps current production and documentation surfaces free of old identity refs", async () => {
    const currentSurface = await readCurrentProductSurface();
    const oldScope = ["@agent", "guard"].join("");
    const oldProduct = ["Agent", "Guard"].join("");
    const oldBinary = ["agent", "guard"].join("");
    const oldRepository = `Felyx-Fu/${oldProduct}`;

    expect(currentSurface).not.toContain(oldScope);
    expect(currentSurface).not.toContain(oldProduct);
    expect(currentSurface).not.toContain(oldBinary);
    expect(currentSurface).not.toContain(oldRepository);
    expect(currentSurface).toContain("DiffSentry");
    expect(currentSurface).toContain("@felyx-fu/diffsentry");
  });
});
