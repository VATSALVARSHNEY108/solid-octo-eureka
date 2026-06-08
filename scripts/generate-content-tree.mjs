import { promises as fs } from 'fs';
import path from 'path';
import { SUBJECT_META, TOPIC_ORDER, LESSON_ORDER } from '../lib/content-types'; // types only, not needed at runtime
import { TOPIC_LABELS } from '../lib/content-registry';

// Helper to ensure a directory exists
async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

// Create a placeholder React component for a lesson
function lessonComponent(subject: string, topic: string, lesson: string): string {
  const componentName = lesson.replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\s+/g, '');
  return `import React from 'react';

export default function ${componentName}() {
  return (
    <section className="px-12 py-24">
      <h1 className="text-4xl font-bold mb-6">${lesson.replace(/[-_]/g, ' ')}</h1>
      <p className="text-lg">TODO: Add content for ${lesson} (${subject} → ${topic}).</p>
    </section>
  );
}
`;
}

async function generate() {
  const base = path.resolve('content');
  // For this project we only have AI subject with its topics
  const subject = 'artificial-intelligence';
  const subjectDir = path.join(base, subject);
  await ensureDir(subjectDir);

  // Topics we care about (keys of LESSON_ORDER)
  const topics = Object.keys(LESSON_ORDER);
  for (const topic of topics) {
    const topicDir = path.join(subjectDir, topic);
    await ensureDir(topicDir);
    const lessons = LESSON_ORDER[topic as keyof typeof LESSON_ORDER];
    for (const lesson of lessons) {
      const filePath = path.join(topicDir, `${lesson}.tsx`);
      const content = lessonComponent(subject, topic, lesson);
      await fs.writeFile(filePath, content, { flag: 'wx' }).catch(async (e) => {
        // If file exists, skip
        if ((e as NodeJS.ErrnoException).code !== 'EEXIST') throw e;
      });
    }
  }
  console.log('Content tree generation complete.');
}

generate().catch(err => {
  console.error('Error generating content tree:', err);
  process.exit(1);
});
