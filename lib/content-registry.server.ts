/*
 * Server‑only utilities for filesystem access.
 * This file is imported only in server components to avoid bundling Node built‑ins into client bundles.
 */

import type { Subject, Topic, Lesson } from "./content-types";
import { SUBJECT_META, TOPIC_ORDER, LESSON_ORDER, TOPIC_LABELS, TOPIC_DESCRIPTIONS } from "./content-registry";

/** Helper to format lesson/file names */
function formatLessonName(fileName: string): string {
  const name = fileName.replace(/\.(jsx|tsx|js|ts)$/, "");
  return name
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function extractLeadingOrder(value: string): number {
  const match = value.match(/^(\d{1,3})/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

function sortLessonsInLearningOrder(lessons: Lesson[], topicId: string): Lesson[] {
  const ordered = [...lessons];
  const order = LESSON_ORDER[topicId];

  if (order && order.length > 0) {
    ordered.sort((a, b) => {
      const ia = order.indexOf(a.id);
      const ib = order.indexOf(b.id);
      if (ia === -1 && ib === -1) {
        return a.name.localeCompare(b.name);
      }
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });
    return ordered;
  }

  ordered.sort((a, b) => {
    const orderA = extractLeadingOrder(a.id);
    const orderB = extractLeadingOrder(b.id);
    if (orderA !== orderB) return orderA - orderB;
    return a.name.localeCompare(b.name);
  });

  return ordered;
}

/** Fetch all subjects from the filesystem (server only) */
export async function getSubjectsFromFS(): Promise<Subject[]> {
  const fs = await import("fs");
  const path = await import("path");
  const contentRoot = path.resolve(process.cwd(), "content");

  if (!fs.existsSync(contentRoot)) return [];
  const allFiles = fs.readdirSync(contentRoot);
  const subjects: Subject[] = [];

  for (const folder of allFiles) {
    const metaKey = Object.keys(SUBJECT_META).find(
      (k) => k.toLowerCase() === folder.toLowerCase()
    );
    const meta = metaKey ? SUBJECT_META[metaKey] : null;
    if (!meta) continue;
    const subjectPath = path.join(contentRoot, folder);
    const topicDirs = fs
      .readdirSync(subjectPath, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    // sort topics if order is defined
    const orderKey = Object.keys(TOPIC_ORDER).find(
      (k) => k.toLowerCase() === folder.toLowerCase()
    );
    if (orderKey && TOPIC_ORDER[orderKey]) {
      const order = TOPIC_ORDER[orderKey];
      topicDirs.sort((a, b) => {
        const ia = order.indexOf(a);
        const ib = order.indexOf(b);
        if (ia === -1 && ib === -1) return 0;
        if (ia === -1) return 1;
        if (ib === -1) return -1;
        return ia - ib;
      });
    }

    const topics: Topic[] = topicDirs.map((topicId) => {
      const topicPath = path.join(subjectPath, topicId);
      const lessonFiles = fs
        .readdirSync(topicPath)
        .filter((f) => /\.(jsx|tsx|js|ts)$/.test(f));

      const lessons: Lesson[] = lessonFiles.map((file) => ({
        id: file.replace(/\.(jsx|tsx|js|ts)$/, ""),
        name: formatLessonName(file),
        topicId,
        subjectId: folder,
        path: `../content/${folder}/${topicId}/${file}`,
      }));

      const sortedLessons = sortLessonsInLearningOrder(lessons, topicId);

      return {
        id: topicId,
        name: TOPIC_LABELS[topicId] ?? formatLessonName(topicId),
        description:
          TOPIC_DESCRIPTIONS[topicId] ??
          "A specialized module designed for deep engineering comprehension.",
        subjectId: folder,
        lessons: sortedLessons,
      };
    });

    subjects.push({
      id: folder,
      name: meta.label,
      description: meta.description,
      icon: meta.icon,
      color: meta.color,
      topics,
    });
  }

  return subjects;
}

/** Fetch a single subject (server only) */
export async function getSubjectFromFS(
  subjectId: string
): Promise<Subject | null> {
  const fs = await import("fs");
  const path = await import("path");
  const contentRoot = path.resolve(process.cwd(), "content");

  if (!fs.existsSync(contentRoot)) return null;
  const allFiles = fs.readdirSync(contentRoot);
  const actualFolder = allFiles.find(
    (f) => f.toLowerCase() === subjectId.toLowerCase()
  );

  const metaKey = Object.keys(SUBJECT_META).find(
    (k) => k.toLowerCase() === subjectId.toLowerCase()
  );
  const meta = metaKey ? SUBJECT_META[metaKey] : null;

  if (!actualFolder || !meta) return null;

  const subjectPath = path.join(contentRoot, actualFolder);
  const topicDirs = fs
    .readdirSync(subjectPath, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  const orderKey = Object.keys(TOPIC_ORDER).find(
    (k) => k.toLowerCase() === subjectId.toLowerCase()
  );
  if (orderKey && TOPIC_ORDER[orderKey]) {
    const order = TOPIC_ORDER[orderKey];
    topicDirs.sort((a, b) => {
      const ia = order.indexOf(a);
      const ib = order.indexOf(b);
      if (ia === -1 && ib === -1) return 0;
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });
  }

  const topics: Topic[] = topicDirs.map((topicId) => {
    const topicPath = path.join(subjectPath, topicId);
    const lessonFiles = fs
      .readdirSync(topicPath)
      .filter((f) => /\.(jsx|tsx|js|ts)$/.test(f));

    const lessons: Lesson[] = lessonFiles.map((file) => ({
      id: file.replace(/\.(jsx|tsx|js|ts)$/, ""),
      name: formatLessonName(file),
      topicId,
      subjectId,
      path: `../content/${subjectId}/${topicId}/${file}`,
    }));

    const sortedLessons = sortLessonsInLearningOrder(lessons, topicId);

    return {
      id: topicId,
      name: TOPIC_LABELS[topicId] ?? formatLessonName(topicId),
      description:
        TOPIC_DESCRIPTIONS[topicId] ??
        "A specialized module designed for deep engineering comprehension.",
      subjectId,
      lessons: sortedLessons,
    };
  });

  return {
    id: actualFolder,
    name: meta.label,
    description: meta.description,
    icon: meta.icon,
    color: meta.color,
    topics,
  };
}

/** Fetch a topic within a subject (server only) */
export async function getTopicFromFS(
  subjectId: string,
  topicId: string
): Promise<Topic | null> {
  const subject = await getSubjectFromFS(subjectId);
  if (!subject) return null;

  const normalize = (v: string) =>
    decodeURIComponent(v)
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const wanted = normalize(topicId);
  const topic =
    subject.topics.find((t) => normalize(t.id) === wanted) ?? null;
  return topic;
}
