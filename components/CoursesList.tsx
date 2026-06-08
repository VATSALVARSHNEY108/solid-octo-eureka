"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform, Variants } from "framer-motion";
import { Layers, ArrowUpRight, Sparkles, Zap, GraduationCap } from "lucide-react";
import { Subject } from "@/lib/content-types";
import { useRef, useState } from "react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  },
};

function CourseCard({ subject, index }: { subject: Subject, index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 20 });

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // For Tilt
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);

    // For Spotlight
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const lessonCount = subject.topics.reduce((a, t) => a + t.lessons.length, 0);

  return (
    <motion.div 
      variants={itemVariants} 
      className="group h-full"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1500 }}
    >
      <Link href={`/curriculum/${subject.id}`} className="block h-full">
        <motion.div
          ref={cardRef}
          style={{ rotateX, rotateY }}
          className="relative h-full p-1 border border-[var(--border-subtle)] bg-[var(--bg-primary)] rounded-[3rem] overflow-hidden transition-all duration-300 hover:border-[var(--text-primary)] hover:bg-[var(--bg-primary)]/80"
        >
          {/* Simple spotlight */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-500"
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99,102,241,0.08), transparent 40%)`,
              opacity: isHovered ? 1 : 0,
            }}
          />
          {/* Content */}
          <div className="relative z-10 flex flex-col md:flex-row gap-8 p-10 md:p-12">
            <div className="flex-shrink-0">
              <div className="relative w-28 h-28 rounded-[2rem] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-6xl shadow-sm">
                {subject.icon}
              </div>
            </div>
            <div className="flex-grow flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-[10px] font-black tracking-[0.3em] text-[var(--text-primary)] uppercase">
                  Unit {String(index + 1).padStart(2, '0')}
                </span>
                <div className="h-px flex-grow bg-[var(--border-subtle)]" />
              </div>
              <h3 className="display-heading text-4xl md:text-5xl mb-6 leading-tight text-[var(--text-primary)]">
                {subject.name}
              </h3>
              <p className="text-[var(--text-secondary)] text-lg mb-10 leading-relaxed font-medium line-clamp-2">
                {subject.description}
              </p>
              <div className="mt-auto flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-[var(--bg-primary)]/50 border border-[var(--border-subtle)] shadow-sm">
                  <Layers size={18} className="text-[var(--text-primary)]" />
                  <span className="text-[12px] font-bold text-[var(--text-primary)] uppercase tracking-wider">
                    {subject.topics.length} Sections
                  </span>
                </div>
                <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-[var(--bg-primary)]/50 border border-[var(--border-subtle)] shadow-sm">
                  <Zap size={18} className="text-[var(--text-primary)]" />
                  <span className="text-[12px] font-bold text-[var(--text-primary)] uppercase tracking-wider">
                    {lessonCount} Labs
                  </span>
                </div>
              </div>
            </div>
            {/* Corner arrow */}
            <div className="absolute top-10 right-10 w-16 h-16 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] group-hover:bg-[var(--text-primary)] group-hover:text-white transition-all duration-300">
              <ArrowUpRight size={28} />
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default function CoursesList({ subjects }: { subjects: Subject[] }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="grid grid-cols-1 xl:grid-cols-2 gap-12"
    >
      {subjects.map((subject, i) => (
        <CourseCard key={subject.id} subject={subject} index={i} />
      ))}
    </motion.div>
  );
}
