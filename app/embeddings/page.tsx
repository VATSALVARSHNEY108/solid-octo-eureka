import fs from 'fs';
import path from 'path';
import React from 'react';

/**
 * Recursively read all files in a directory and return an array of objects
 * containing the relative file path and its content.
 */
function readDirectoryRecursive(dir: string, baseDir: string = ''): { path: string; content: string }[] {
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

export const metadata = {
  title: 'Wevi Repository Explorer',
  description: 'Display all files from the cloned wevi repository',
};

export default function EmbeddingsPage() {
  // Resolve the repository path relative to the project root.
  const repoPath = path.resolve(process.cwd(), 'wevi_repo');
  const allFiles = React.useMemo(() => readDirectoryRecursive(repoPath), [repoPath]);

  return (
    <div
      className="px-12 py-24"
      style={{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
      }}
    >
      <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
        {metadata.title}
      </h1>
      {allFiles.map((file) => (
        <section key={file.path} className="mb-12">
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text-secondary)' }}>
            {file.path}
          </h2>
          <pre
            className="overflow-auto p-4 border rounded bg-white text-sm"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
            }}
          >
            <code>{file.content}</code>
          </pre>
        </section>
      ))}
    </div>
  );
}
