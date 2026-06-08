import fs from 'fs';
import path from 'path';

const contentDir = path.resolve('content');

function fixFile(filePath) {
  const src = fs.readFileSync(filePath, 'utf8');
  // Replace patterns like "export default function 02ObjectivesofControlSystems" with anonymous function
  const newSrc = src.replace(/export\s+default\s+function\s+[0-9][A-Za-z0-9_]*/g, 'export default function');
  if (newSrc !== src) {
    fs.writeFileSync(filePath, newSrc, 'utf8');
    console.log(`Fixed ${filePath}`);
  }
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile() && fullPath.endsWith('.tsx')) {
      fixFile(fullPath);
    }
  }
}

walk(contentDir);
