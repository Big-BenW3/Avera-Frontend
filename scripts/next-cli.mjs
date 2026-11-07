// Runs the Next CLI from the folder's real on-disk casing.
// On Windows a terminal opened at ...\frontend (lowercase) makes webpack see the same
// files under two casings, which loads React twice and crashes the build with
// "Cannot read properties of null (reading 'useContext')".
import { spawn } from "node:child_process";
import { realpathSync } from "node:fs";
import { createRequire } from "node:module";

const cwd = realpathSync.native(process.cwd());
const nextBin = realpathSync.native(createRequire(`${cwd}/package.json`).resolve("next/dist/bin/next"));

const child = spawn(process.execPath, [nextBin, ...process.argv.slice(2)], { cwd, stdio: "inherit" });
child.on("exit", (code, signal) => process.exit(code ?? (signal ? 1 : 0)));
for (const sig of ["SIGINT", "SIGTERM"]) process.on(sig, () => child.kill(sig));
