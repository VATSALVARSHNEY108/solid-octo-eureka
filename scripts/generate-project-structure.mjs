import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const outputFileName = "project-file-structure.md";
const ignoredNames = new Set([
  ".git",
  ".next",
  "node_modules",
  "venv",
  "__pycache__",
  "tsconfig.tsbuildinfo",
  outputFileName,
]);

function formatEntryName(entry) {
  return entry.isDirectory() ? `${entry.name}/` : entry.name;
}

function sortEntries(left, right) {
  if (left.isDirectory() && !right.isDirectory()) return -1;
  if (!left.isDirectory() && right.isDirectory()) return 1;
  return left.name.localeCompare(right.name);
}

function walkDirectory(currentDir, prefix = "") {
  const entries = fs
    .readdirSync(currentDir, { withFileTypes: true })
    .filter((entry) => !ignoredNames.has(entry.name))
    .sort(sortEntries);

  const lines = [];

  entries.forEach((entry, index) => {
    const isLast = index === entries.length - 1;
    const branch = isLast ? "`-- " : "|-- ";
    lines.push(`${prefix}${branch}${formatEntryName(entry)}`);

    if (entry.isDirectory()) {
      const childPrefix = `${prefix}${isLast ? "    " : "|   "}`;
      lines.push(...walkDirectory(path.join(currentDir, entry.name), childPrefix));
    }
  });

  return lines;
}

const treeLines = walkDirectory(rootDir);
const markdown = [
  "# Project File Structure",
  "",
  "Repository tree for the current code space.",
  "",
  "Excluded from this view: `.git`, `.next`, `node_modules`, `venv`, `__pycache__`, `tsconfig.tsbuildinfo`, and the generated `project-file-structure.md` itself.",
  "",
  "```text",
  ".",
  ...treeLines,
  "```",
  "",
].join("\n");

fs.writeFileSync(path.join(rootDir, outputFileName), markdown, "utf8");
console.log(`Wrote ${outputFileName} with ${treeLines.length} entries.`);
