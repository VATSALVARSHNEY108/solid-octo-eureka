"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { PlayCircle, CheckCircle2, ArrowRight, Lock } from "lucide-react";
import { Lesson } from "@/lib/content-types";
import { useProgress } from "@/lib/useProgress";
import { useRef, useState } from "react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

function LessonCard({
  lesson,
  subjectId,
  topicId,
  index,
  locked,
}: {
  lesson: Lesson;
  subjectId: string;
  topicId: string;
  index: number;
  locked: boolean;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const { isCompleted, toggleLesson } = useProgress();
  const completed = isCompleted(lesson.id);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLesson(lesson.id);
  };

  return (
    <motion.div
      variants={itemVariants}
      className={`group ${locked ? "opacity-70" : ""}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href={`/curriculum/${subjectId}/${topicId}/${lesson.id}`}
        className={`relative block ${locked ? "pointer-events-none" : ""}`}
        ref={cardRef}
        aria-disabled={locked}
      >
        <div className={`relative border border-[var(--border-subtle)] bg-[var(--bg-elevated)] rounded-2xl overflow-hidden shadow-lg transition-colors duration-300 ${locked ? "" : "hover:border-[var(--text-primary)] hover:bg-[var(--bg-primary)]/80 hover:scale-[1.01]"}`}>
          {/* Spotlight */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-500"
            style={{
              background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99,102,241,0.08), transparent 40%)`,
              opacity: hovered ? 1 : 0,
            }}
          />
          {/* Content */}
          <div className="relative z-10 flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center border border-[var(--border-subtle)] ${completed ? "bg-[var(--bg-primary)] text-[var(--text-primary)] border-[var(--text-primary)]" : "bg-[var(--bg-secondary)] text-[var(--text-primary)]"} transition-colors`}
              >
                {completed ? (
                  <CheckCircle2 size={20} />
                ) : locked ? (
                  <Lock size={18} />
                ) : (
                  <PlayCircle size={20} className="group-hover:scale-110 transition-transform" />
                )}
              </div>
              <div className="flex flex-col">
                <h3 className={`text-lg font-bold ${completed ? "text-emerald-500/80" : "text-[var(--text-primary)]"} transition-colors`}>
                  Lesson {String(index + 1).padStart(2, "0")} - {lesson.name}
                </h3>
                {lesson.description && (
                  <p className="text-[var(--text-secondary)] text-sm opacity-70 line-clamp-1">{lesson.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggle}
                disabled={locked}
                className={`p-2 rounded-xl border transition-colors ${completed ? "bg-[var(--bg-primary)] text-[var(--text-primary)] border-[var(--text-primary)]" : "bg-[var(--bg-primary)]/5 border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)]"}`}
                title={completed ? "Mark as Incomplete" : "Mark as Complete"}
              >
                {completed ? <CheckCircle2 size={20} /> : <CheckCircle2 size={20} className="opacity-0" />}
              </button>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
                {completed ? "Review Lab" : locked ? "Complete Previous" : "Enter Lab"}
              </span>
              <ArrowRight size={16} className={`text-[var(--text-secondary)] transition-opacity ${locked ? "opacity-20" : "opacity-0 group-hover:opacity-100"}`} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function LessonList({ lessons, subjectId, topicId }: { lessons: Lesson[]; subjectId: string; topicId: string }) {
  const { isCompleted } = useProgress();

  if (lessons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-6 border-2 border-dashed border-[var(--border-subtle)] rounded-2xl bg-[var(--bg-elevated)]/20 backdrop-blur-xl">
        <div className="w-24 h-24 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-2xl flex items-center justify-center mb-8 text-5xl shadow-premium animate-float">
          📝
        </div>
        <h3 className="text-2xl font-bold mb-4">Laboratory Under Maintenance</h3>
        <p className="text-lg text-[var(--text-secondary)] font-medium max-w-md text-center">
          Our engineering team is currently crafting the interactive simulations for this topic. Check back soon for the full experience.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
            className="flex flex-col gap-4"
    >
      {lessons.map((lesson, i) => (
        <LessonCard
          key={lesson.id}
          lesson={lesson}
          subjectId={subjectId}
          topicId={topicId}
          index={i}
          locked={false}
        />
      ))}
    </motion.div>
  );
}
