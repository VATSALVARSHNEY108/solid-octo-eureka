import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.cwd());
const llmVizDir = path.join(root, "llm-viz");
const outDir = path.join(llmVizDir, "out");
const targetDir = path.join(root, "public", "llm-viz");

function rimraf(p) {
  if (!fs.existsSync(p)) return;
  fs.rmSync(p, { recursive: true, force: true });
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

if (!fs.existsSync(llmVizDir)) {
  console.error("Missing llm-viz directory:", llmVizDir);
  process.exit(1);
}

console.log("Building llm-viz as static export...");
execSync("npm install", { cwd: llmVizDir, stdio: "inherit" });
execSync("npm run build", {
  cwd: llmVizDir,
  stdio: "inherit",
  env: { ...process.env, LLM_VIZ_EXPORT: "1" },
});

if (!fs.existsSync(outDir)) {
  console.error("Expected llm-viz/out to exist after build.");
  process.exit(1);
}

console.log("Copying export to public/llm-viz ...");
rimraf(targetDir);
copyDir(outDir, targetDir);

console.log("Done. llm-viz available at /llm-viz/llm");

