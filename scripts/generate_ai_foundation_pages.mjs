import fs from 'fs';
import path from 'path';

// Directory containing AI foundation lesson .tsx files
const lessonsDir = path.resolve(__dirname, '..', 'content', 'artificial-intelligence', '01-ai-foundations');

// Ensure directory exists
if (!fs.existsSync(lessonsDir)) {
  console.error('Lessons directory not found:', lessonsDir);
  process.exit(1);
}

// Helper to create a human‑readable title from filename
function titleFromFilename(filename) {
  // Remove extension and numeric prefix
  const name = filename.replace(/\.tsx$/, '');
  const parts = name.split('-');
  // Remove leading numeric part if present (e.g., "00", "01")
  if (/^\d+$/.test(parts[0])) parts.shift();
  // Capitalize each word
  return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
}

// Template for lesson component
function generateLessonContent(title) {
  return `import ConceptPage from '@/components/ConceptPage/ConceptPage';
import { LessonData } from '@/lib/content-types';

const lesson: LessonData = {
  title: '${title}',
  theory: 'TODO: Add theoretical explanation.',
  formulas: [],
  visualIntuition: 'TODO: Add visual intuition description.',
  visualization: <div className="flex items-center justify-center h-64 text-gray-500">Visualization placeholder</div>,
  parameters: [],
  failureCases: 'TODO: Add failure cases.',
  applications: 'TODO: Add real‑world applications.',
};

export default function Page() {
  return <ConceptPage lesson={lesson} />;
}
`;
}

// Process each .tsx file
const files = fs.readdirSync(lessonsDir).filter(f => f.endsWith('.tsx'));
files.forEach(file => {
  const title = titleFromFilename(file);
  const content = generateLessonContent(title);
  const filePath = path.join(lessonsDir, file);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated', filePath);
});

console.log('All lesson pages have been regenerated.');
