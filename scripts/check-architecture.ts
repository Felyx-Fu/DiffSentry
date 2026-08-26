import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const NODE_BUILTINS = new Set([
  "assert",
  "buffer",
  "child_process",
  "cluster",
  "console",
  "constants",
  "crypto",
  "dgram",
  "diagnostics_channel",
  "dns",
  "domain",
  "events",
  "fs",
  "http",
  "http2",
  "https",
  "module",
  "net",
  "os",
  "path",
  "perf_hooks",
  "process",
  "punycode",
  "querystring",
  "readline",
  "repl",
  "stream",
  "string_decoder",
  "sys",
  "timers",
  "tls",
  "trace_events",
  "tty",
  "url",
  "util",
  "v8",
  "vm",
  "wasi",
  "worker_threads",
  "zlib",
]);

const scriptDirectory = fileURLToPath(new URL(".", import.meta.url));
const repositoryRoot = join(scriptDirectory, "..");
const contractsSourceDirectory = join(
  repositoryRoot,
  "packages",
  "contracts",
  "src",
);
const coreSourceDirectory = join(repositoryRoot, "packages", "core", "src");
const contractsManifestPath = join(
  repositoryRoot,
  "packages",
  "contracts",
  "package.json",
);

function collectTypeScriptFiles(directory: string): string[] {
  const entries = readdirSync(directory, { withFileTypes: true }).sort(
    (left, right) => left.name.localeCompare(right.name),
  );
  const files: string[] = [];

  for (const entry of entries) {
    const entryPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectTypeScriptFiles(entryPath));
    } else if (entry.isFile() && entry.name.endsWith(".ts")) {
      files.push(entryPath);
    }
  }

  return files;
}

function collectModuleSpecifiers(source: string): string[] {
  const patterns = [
    /\b(?:import|export)\s+(?:[\s\S]*?\s+from\s+)?["']([^"']+)["']/g,
    /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g,
    /\brequire\s*\(\s*["']([^"']+)["']\s*\)/g,
  ];
  const specifiers = new Set<string>();

  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      const specifier = match[1];
      if (specifier !== undefined) {
        specifiers.add(specifier);
      }
    }
  }

  return [...specifiers].sort((left, right) => left.localeCompare(right));
}

function isForbiddenNodeImport(specifier: string): boolean {
  return specifier.startsWith("node:") || NODE_BUILTINS.has(specifier);
}

function findViolations(): string[] {
  const violations: string[] = [];

  for (const filePath of collectTypeScriptFiles(contractsSourceDirectory)) {
    const relativePath = relative(repositoryRoot, filePath).replaceAll(
      "\\",
      "/",
    );
    const source = readFileSync(filePath, "utf8");

    for (const specifier of collectModuleSpecifiers(source)) {
      if (isForbiddenNodeImport(specifier)) {
        violations.push(`${relativePath}: forbidden Node import ${specifier}`);
      } else if (
        specifier.startsWith("@diffsentry/") ||
        specifier.startsWith("../")
      ) {
        violations.push(
          `${relativePath}: forbidden internal import ${specifier}`,
        );
      }
    }
  }

  const manifest = JSON.parse(readFileSync(contractsManifestPath, "utf8")) as {
    dependencies?: Record<string, string>;
    optionalDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
  };
  for (const section of [
    "dependencies",
    "optionalDependencies",
    "peerDependencies",
  ] as const) {
    for (const dependency of Object.keys(manifest[section] ?? {}).sort()) {
      violations.push(
        `packages/contracts/package.json: runtime dependency ${dependency} in ${section}`,
      );
    }
  }

  for (const filePath of collectTypeScriptFiles(coreSourceDirectory)) {
    const relativePath = relative(repositoryRoot, filePath).replaceAll(
      "\\",
      "/",
    );
    const source = readFileSync(filePath, "utf8");

    for (const specifier of collectModuleSpecifiers(source)) {
      if (isForbiddenNodeImport(specifier)) {
        violations.push(`${relativePath}: forbidden Node import ${specifier}`);
      }
    }
  }

  return violations;
}

const violations = findViolations();
if (violations.length > 0) {
  process.stderr.write(
    `${[
      "Architecture check: FAIL",
      ...violations.map((violation) => `- ${violation}`),
    ].join("\n")}\n`,
  );
  process.exitCode = 1;
} else {
  process.stdout.write(
    [
      "Architecture check: PASS",
      `(contracts source files checked: ${collectTypeScriptFiles(contractsSourceDirectory).length};`,
      `core source files checked: ${collectTypeScriptFiles(coreSourceDirectory).length})\n`,
    ].join(" "),
  );
}
