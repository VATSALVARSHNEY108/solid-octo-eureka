"use client";

import { useMemo } from "react";
import { useProgress } from "@/lib/useProgress";
import LessonList from "./LessonList";
import { Lesson } from "@/lib/content-types";
import Link from "next/link";
import { ArrowLeft, BookOpen, CheckCircle2, GraduationCap } from "lucide-react";

interface TopicPageClientProps {
  subjectId: string;
  topicId: string;
  subjectName: string;
  topicName: string;
  topicDescription?: string;
  topic: { lessons: Lesson[] };
}

export default function TopicPageClient({
  subjectId,
  topicId,
  subjectName,
  topicName,
  topicDescription,
  topic,
}: TopicPageClientProps) {
  const { isCompleted } = useProgress();
  const completedCount = useMemo(
    () => topic.lessons.filter((lesson) => isCompleted(lesson.id)).length,
    [topic.lessons, isCompleted]
  );
  const totalLessons = topic.lessons.length;
  const progress = totalLessons === 0 ? 0 : Math.round((completedCount / totalLessons) * 100);

  return (
    <div className="relative min-h-screen selection:bg-indigo-500/30">
      <div className="relative z-10 section-container pt-28 pb-24">
        <Link
          href={`/curriculum/${subjectId}`}
          className="inline-flex items-center gap-2 text-[10px] font-black text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-10 uppercase tracking-[0.3em] group"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          Back to Topics
        </Link>

        <header className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/80 backdrop-blur-xl p-8 md:p-10 mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border-subtle)] text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">
              <GraduationCap size={12} className="text-indigo-500" />
              {subjectName}
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">
              <BookOpen size={12} />
              Topic Learning Path
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--text-primary)] mb-4">
            {topicName}
          </h1>
          <p className="text-[var(--text-secondary)] max-w-3xl leading-relaxed mb-8">
            {topicDescription || "Complete lessons in sequence to build fundamentals first, then advanced understanding."}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/60 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-2">Total Lessons</p>
              <p className="text-2xl font-black text-[var(--text-primary)]">{totalLessons}</p>
            </div>
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/60 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-2">Completed</p>
              <p className="text-2xl font-black text-[var(--text-primary)]">{completedCount}</p>
            </div>
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/60 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-2">Progress</p>
              <p className="text-2xl font-black text-[var(--text-primary)]">{progress}%</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="h-2 rounded-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-3 text-xs text-[var(--text-secondary)] inline-flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-500" />
              Follow the lesson order below. A lesson unlocks after the previous one is completed.
            </p>
          </div>
        </header>

        <LessonList lessons={topic.lessons} subjectId={subjectId} topicId={topicId} />
      </div>
    </div>
  );
}
