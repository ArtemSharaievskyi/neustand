/* global process */
import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const configDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(configDirectory, "..");
const workDirectory = path.join(
  projectRoot,
  "node_modules",
  ".cache",
  "lhci",
  "work",
);
const cliPath = path.join(projectRoot, "node_modules", "@lhci", "cli", "src", "cli.js");
const configPath = path.join(configDirectory, "lighthouserc.cjs");

mkdirSync(workDirectory, { recursive: true });
const result = spawnSync(
  process.execPath,
  [cliPath, "autorun", `--config=${configPath}`],
  {
    cwd: workDirectory,
    stdio: "inherit",
    windowsHide: true,
    env: { ...process.env, NEUSTAND_PROJECT_ROOT: projectRoot },
  },
);

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
