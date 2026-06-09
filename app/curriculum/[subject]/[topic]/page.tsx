import { getTopicFromFS, getSubjectFromFS, getSubjectsFromFS } from "@/lib/content-registry.server";
import { notFound } from "next/navigation";
import TopicPageClient from "@/components/TopicPageClient";

export const dynamic = 'force-static';
export const dynamicParams = true;

export async function generateStaticParams() {
  const subjects = await getSubjectsFromFS();
  return subjects.flatMap((subject) =>
    subject.topics.map((topic) => ({
      subject: subject.id,
      topic: topic.id,
    }))
  );
}

export default async function TopicPage({ params }: { params: Promise<{ subject: string; topic: string }> }) {
  const { subject: subjectId, topic: topicId } = await params;
  const topic = await getTopicFromFS(subjectId, topicId);
  const subject = await getSubjectFromFS(subjectId);

  if (!topic || !subject) {
    notFound();
  }

  return (
    <TopicPageClient
      subjectId={subject.id}
      topicId={topic.id}
      subjectName={subject.name}
      topicName={topic.name}
      topicDescription={topic.description}
      topic={topic}
    />
  );
}
