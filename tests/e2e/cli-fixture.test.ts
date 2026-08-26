import { execFile } from "node:child_process";
import { access, readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";
import { createGitTestFixture } from "../../packages/runtime-node/src/test-utils/git-fixture.js";

const execFileAsync = promisify(execFile);

interface ChildProcessOutcome {
  readonly code: number;
  readonly stderr: string;
  readonly stdout: string;
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null;
}

function getErrorField(error: unknown, field: "stderr" | "stdout"): string {
  if (!isRecord(error)) {
    return "";
  }

  const value = error[field];
  return typeof value === "string" ? value : "";
}

function getErrorCode(error: unknown): number {
  if (!isRecord(error)) {
    return 1;
  }

  const value = error.code;
  return typeof value === "number" ? value : 1;
}

async function runCommand(
  executable: string,
  args: readonly string[],
  cwd: string,
): Promise<ChildProcessOutcome> {
  try {
    const result = await execFileAsync(executable, [...args], {
      cwd,
      encoding: "utf8",
      shell: false,
      windowsHide: true,
    });
    return { code: 0, stderr: result.stderr, stdout: result.stdout };
  } catch (error) {
    return {
      code: getErrorCode(error),
      stderr: getErrorField(error, "stderr"),
      stdout: getErrorField(error, "stdout"),
    };
  }
}

async function buildWorkspace(): Promise<void> {
  const repositoryRoot = resolve(
    fileURLToPath(new URL("../..", import.meta.url)),
  );
  // biome-ignore lint/suspicious/noUndeclaredEnvVars: pnpm supplies its script path to the test process.
  const packageManagerScript = process.env.npm_execpath;
  if (packageManagerScript !== undefined && packageManagerScript.length > 0) {
    const isJavaScriptEntryPoint = /\.(?:cjs|js|mjs)$/iu.test(
      packageManagerScript,
    );
    await execFileAsync(
      isJavaScriptEntryPoint ? process.execPath : packageManagerScript,
      isJavaScriptEntryPoint ? [packageManagerScript, "build"] : ["build"],
      {
        cwd: repositoryRoot,
        shell: false,
        windowsHide: true,
      },
    );
    return;
  }

  if (process.platform !== "win32") {
    await execFileAsync("pnpm", ["build"], {
      cwd: repositoryRoot,
      shell: false,
      windowsHide: true,
    });
    return;
  }

  // `pnpm exec` does not always expose npm_execpath on Windows. Resolve the
  // standalone pnpm executable installed by pnpm/action-setup or pnpm Home so
  // this test never needs shell interpolation of a .cmd wrapper.
  // biome-ignore lint/suspicious/noUndeclaredEnvVars: PNPM_HOME is the documented pnpm executable location.
  const pnpmHome = process.env.PNPM_HOME;
  if (pnpmHome !== undefined && pnpmHome.length > 0) {
    const executableCandidates = [
      join(pnpmHome, "pnpm.exe"),
      ...(
        await readdir(join(pnpmHome, ".tools", "pnpm-exe"), {
          withFileTypes: true,
        }).catch(() => [])
      )
        .filter((entry) => entry.isDirectory())
        .sort((left, right) => right.name.localeCompare(left.name))
        .map((entry) =>
          join(pnpmHome, ".tools", "pnpm-exe", entry.name, "pnpm.exe"),
        ),
    ];

    for (const executable of executableCandidates) {
      if (
        await access(executable).then(
          () => true,
          () => false,
        )
      ) {
        await execFileAsync(executable, ["build"], {
          cwd: repositoryRoot,
          shell: false,
          windowsHide: true,
        });
        return;
      }
    }
  }

  throw new Error("Unable to resolve a shell-free pnpm executable for E2E.");
}

describe("CLI fixture flow", () => {
  it("runs the built executable through the dispatcher and matches the fail verdict", async () => {
    await buildWorkspace();
    const fixture = await createGitTestFixture();
    const repositoryRoot = resolve(
      fileURLToPath(new URL("../..", import.meta.url)),
    );
    const executable = join(
      repositoryRoot,
      "packages",
      "cli",
      "dist",
      "main.js",
    );

    try {
      await fixture.writeFile(
        "package.json",
        JSON.stringify(
          { name: "diffsentry-e2e-fixture", packageManager: "npm@10.0.0" },
          null,
          2,
        ),
      );
      await fixture.writeFile("secret.ts", "export const safe = true;\n");
      await fixture.writeFile(
        "secret.test.ts",
        "export const covered = true;\n",
      );
      await fixture.stage("package.json");
      await fixture.stage("secret.ts");
      await fixture.stage("secret.test.ts");
      await fixture.commit("baseline");

      const secretFixture = await readFile(
        new URL(
          "../fixtures/rules/secret-exposure/positive.ts",
          import.meta.url,
        ),
        "utf8",
      );
      await fixture.writeFile("secret.ts", secretFixture);
      await fixture.stage("secret.ts");

      const result = await runCommand(
        process.execPath,
        [executable, "check"],
        fixture.directory,
      );

      expect(result.code, `${result.stdout}\n${result.stderr}`).toBe(2);
      expect(result.stderr).toBe("");
      expect(result.stdout).toContain("DiffSentry 0.1.0");
      expect(result.stdout).toContain("Verdict: FAIL");
      expect(result.stdout).toContain("Risk score: 50/100");
      expect(result.stdout).toContain("security.secret-exposure");
      expect(result.stdout).toContain("matched value redacted");

      const configPath = join(fixture.directory, "diffsentry.config.json");
      await fixture.writeFile(
        "diffsentry.config.json",
        JSON.stringify(
          { rules: { "security.secret-exposure": { enabled: false } } },
          null,
          2,
        ),
      );
      const configuredResult = await runCommand(
        process.execPath,
        [executable, "check", "--config", configPath, "--format", "json"],
        fixture.directory,
      );

      expect(configuredResult.code).toBe(0);
      expect(configuredResult.stderr).toBe("");
      const configuredReport = JSON.parse(configuredResult.stdout) as {
        readonly riskScore: number;
        readonly verdict: string;
      };
      expect(configuredReport.riskScore).toBe(0);
      expect(configuredReport.verdict).toBe("pass");
    } finally {
      await fixture.cleanup();
    }
  }, 30_000);
});
