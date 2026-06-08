import fs from 'fs';
import path from 'path';
import React from 'react';
import { ClientEmbeddings } from './_components/ClientEmbeddings';

/**
 * Server‑side wrapper for the Embeddings lesson.
 * Reads all files from the cloned `wevi_repo` and hands them to ClientEmbeddings.
 */
export default function Embeddings() {
  const repoPath = path.resolve(process.cwd(), 'wevi_repo');
  
  const allFiles = (function readDirectoryRecursive(dir: string, base = ''): { path: string; content: string }[] {
    if (!fs.existsSync(dir)) {
      return [];
    }
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let files: { path: string; content: string }[] = [];
    for (const entry of entries) {
      if (entry.name === '.git') continue;
      const fullPath = path.join(dir, entry.name);
      const relPath = path.join(base, entry.name);
      if (entry.isDirectory()) {
        files = files.concat(readDirectoryRecursive(fullPath, relPath));
      } else if (entry.isFile()) {
        try {
          const content = fs.readFileSync(fullPath, 'utf-8');
          files.push({ path: relPath.replace(/\\/g, '/'), content });
        } catch (e) {
          // Skip binaries or unreadable files
        }
      }
    }
    return files;
  })(repoPath);

  return <ClientEmbeddings allFiles={allFiles} />;
}
