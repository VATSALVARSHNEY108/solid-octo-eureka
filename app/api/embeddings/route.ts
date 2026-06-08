import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET() {
  const repoPath = path.resolve(process.cwd(), 'wevi_repo');
  const readDirRecursive = (dir: string, base = ''): { path: string; content: string }[] => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let files: { path: string; content: string }[] = [];
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = path.join(base, entry.name);
      if (entry.isDirectory()) {
        files = files.concat(readDirRecursive(fullPath, relPath));
      } else if (entry.isFile()) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        files.push({ path: relPath, content });
      }
    }
    return files;
  };
  const allFiles = readDirRecursive(repoPath);
  return NextResponse.json(allFiles);
}
