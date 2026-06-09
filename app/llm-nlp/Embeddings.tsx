import fs from 'fs';
import path from 'path';
import React from 'react';

/**
 * Recursively reads all files from a given directory and returns an array of
 * objects containing the relative path and file contents.
 */
function readDirectoryRecursive(dir: string, baseDir = ''): { path: string; content: string }[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files: { path: string; content: string }[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.join(baseDir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(readDirectoryRecursive(fullPath, relPath));
    } else if (entry.isFile()) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      files.push({ path: relPath, content });
    }
  }
  return files;
}

/**
 * Embeddings component for the LLM & NLP section.
 * It loads the entire cloned `wevi_repo` and renders each file with its content.
 * Styling follows the project's high‑contrast theme using CSS variables
 * and Tailwind 4 utility classes.
 */
export default function Embeddings() {
  const repoPath = React.useMemo(() => path.resolve(process.cwd(), 'wevi_repo'), []);
  const allFiles = React.useMemo(() => readDirectoryRecursive(repoPath), [repoPath]);

  return (
    <section className="px-12 py-24" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
        LLM & NLP – Repository Files
      </h1>
      {allFiles.map((file) => (
        <article key={file.path} className="mb-12">
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text-secondary)' }}>
            {file.path}
          </h2>
          <pre
            className="overflow-auto p-4 border rounded bg-white text-sm"
            style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
          >
            <code>{file.content}</code>
          </pre>
        </article>
      ))}
    </section>
  );
}
