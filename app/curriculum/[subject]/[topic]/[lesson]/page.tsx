import { notFound } from "next/navigation";
import { getSubjectFromFS, getSubjectsFromFS } from "@/lib/content-registry.server";
import LessonLoader from "@/components/LessonLoader";
import { LESSON_LOADERS } from "@/lib/lesson-loaders.generated";
import { BackgroundSnippets } from "@/components/ui/background-snippets";
import type { ComponentType } from "react";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateStaticParams() {
  const subjects = await getSubjectsFromFS();

  return subjects.flatMap((subject) =>
    subject.topics.flatMap((topic) =>
      topic.lessons.map((lesson) => ({
        subject: subject.id,
        topic: topic.id,
        lesson: lesson.id,
      }))
    )
  );
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{
    subject: string;
    topic: string;
    lesson: string;
  }>;
}) {
  const {
    subject: subjectId,
    topic: topicId,
    lesson: lessonId,
  } = await params;

  const subjectData = await getSubjectFromFS(subjectId);

  if (!subjectData) {
    notFound();
  }

  const topicData = subjectData.topics.find(
    (t) => t.id.toLowerCase() === topicId.toLowerCase()
  );

  if (!topicData) {
    notFound();
  }

  const lessonIdx = topicData.lessons.findIndex(
    (l) => l.id.toLowerCase() === lessonId.toLowerCase()
  );

  if (lessonIdx === -1) {
    notFound();
  }

  const lessonData = topicData.lessons[lessonIdx];

  const prevLesson =
    lessonIdx > 0 ? topicData.lessons[lessonIdx - 1] : null;

  const nextLesson =
    lessonIdx < topicData.lessons.length - 1
      ? topicData.lessons[lessonIdx + 1]
      : null;

  let Component: ComponentType | null = null;

  try {
    const loaderKey = `${subjectData.id}/${topicData.id}/${lessonData.id}`;

    const loader = LESSON_LOADERS[loaderKey];

    if (!loader) {
      throw new Error(`Missing lesson loader: ${loaderKey}`);
    }

    const mod = await loader();
    let exported: any = mod?.default;

    if (exported && typeof exported === "object" && "default" in exported) {
      exported = (exported as { default: unknown }).default;
    }

    if (typeof exported !== "function") {
      throw new Error(`No valid default component export found in lesson: ${loaderKey}`);
    }

    Component = exported as ComponentType;
  } catch (err) {
    console.error(
      `Failed loading lesson: ${subjectData.id}/${topicData.id}/${lessonData.id}`,
      err
    );

    return (
      <div className="p-24 flex flex-col items-center text-center text-white">
        <h2 className="text-xl font-bold mb-3">
          Lesson Load Failed
        </h2>

        <p className="mb-4">
          Failed to load:
        </p>

        <code className="bg-gray-800 px-3 py-2 rounded">
          {subjectData.id}/{topicData.id}/{lessonData.id}
        </code>

        <pre className="mt-4 text-red-400 text-sm whitespace-pre-wrap">
          {String(err)}
        </pre>
      </div>
    );
  }

  if (!Component) {
    return notFound();
  }

  const isAISubject = subjectData.id.toLowerCase() === "artificial-intelligence";

  return (
    <div className="relative min-h-screen">
      {isAISubject ? <BackgroundSnippets /> : null}
      <LessonLoader
        subjectId={subjectData.id}
        topicId={topicData.id}
        lessonId={lessonData.id}
        lessonName={lessonData.name}
        subjectName={subjectData.name}
        topicName={topicData.name}
        lessonIndex={lessonIdx}
        totalLessons={topicData.lessons.length}
        prevLesson={
          prevLesson
            ? {
                id: prevLesson.id,
                name: prevLesson.name,
              }
            : null
        }
        nextLesson={
          nextLesson
            ? {
                id: nextLesson.id,
                name: nextLesson.name,
              }
            : null
        }
      >
        <Component />
      </LessonLoader>
    </div>
  );
}
