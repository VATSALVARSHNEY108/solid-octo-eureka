"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { FileText, ArrowRight, CheckCircle2 } from "lucide-react";
import { Topic } from "@/lib/content-types";
import { useRef, useState, MouseEvent } from "react";

interface TopicExplorerProps {
  topics: Topic[];
  subjectId: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
  }
};

function MinimalCard({ children, index }: { children: React.ReactNode, index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group/card overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] transition-colors duration-500 hover:border-[var(--text-primary)]"
    >
      {/* Subtle Mouse Glow */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.04), transparent 40%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />
      
      {/* Faint Background Number */}
      <div className="absolute -right-8 -top-8 text-[120px] font-black text-[var(--text-primary)] opacity-[0.02] pointer-events-none select-none transition-transform duration-700 group-hover/card:-translate-x-4 group-hover/card:translate-y-4">
        {String(index + 1).padStart(2, '0')}
      </div>

      <div className="relative z-10 p-8 md:p-10">{children}</div>
    </div>
  );
}

export default function TopicExplorer({ topics, subjectId }: TopicExplorerProps) {
  return (
    <div className="relative py-12 md:py-24 max-w-5xl mx-auto">
      {/* Elegant Dashed Line */}
      <div className="absolute left-8 md:left-12 top-24 bottom-24 w-px hidden sm:block border-l border-dashed border-[var(--border-subtle)]" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
              className="flex flex-col gap-8 relative z-10"
      >
        {topics.map((topic, i) => (
          <motion.div key={topic.id} variants={itemVariants} className="group/item">
            <Link
              href={`/curriculum/${subjectId}/${topic.id}`}
              className="relative flex flex-col sm:flex-row gap-8 md:gap-14 items-start md:items-center"
            >
              {/* Refined Node */}
              <div className="flex-shrink-0 relative z-20 hidden sm:flex">
                <div className="w-16 h-16 rounded-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center justify-center transition-all duration-500 group-hover/item:border-[var(--text-primary)] group-hover/item:scale-110 shadow-sm">
                    <span className="text-sm font-semibold text-[var(--text-secondary)] group-hover/item:text-[var(--text-primary)] transition-colors duration-300">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                </div>
              </div>

              {/* Minimal Topic Card */}
              <div className="flex-grow w-full">
                <MinimalCard index={i}>
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                    <div className="flex-grow">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="px-3 py-1 rounded-full border border-[var(--border-subtle)] text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 group-hover/card:border-[var(--text-muted)] group-hover/card:text-[var(--text-primary)]">
                            Topic {String(i + 1).padStart(2, "0")}
                        </div>
                      </div>
                      
                      <h3 className="text-2xl md:text-3xl font-bold mb-4 text-[var(--text-primary)] tracking-tight">
                        {topic.name}
                      </h3>

                      {topic.description && (
                        <p className="text-[var(--text-secondary)] text-sm md:text-base leading-relaxed mb-8 max-w-2xl font-medium">
                          {topic.description}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap items-center gap-8">
                        <div className="flex items-center gap-3 text-[var(--text-secondary)] font-medium text-sm transition-colors duration-300 group-hover/card:text-[var(--text-primary)]">
                          <FileText size={16} className="opacity-70" />
                          <span>{topic.lessons.length} Ordered Lessons</span>
                        </div>
                        
                        <div className="flex items-center gap-3 text-[var(--text-secondary)] font-medium text-sm transition-colors duration-300 group-hover/card:text-[var(--text-primary)]">
                          <CheckCircle2 size={16} className="opacity-70" />
                          <span>Sequential Learning</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0 flex items-center gap-5 mt-4 md:mt-0">
                       <div className="hidden lg:flex flex-col items-end">
                          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mb-1">Track Status</span>
                          <span className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-primary)] opacity-50" />
                            Ready for Launch
                          </span>
                       </div>
                       
                       <div className="w-12 h-12 rounded-full border border-[var(--border-subtle)] bg-transparent flex items-center justify-center text-[var(--text-secondary)] transition-all duration-500 group-hover/card:bg-[var(--text-primary)] group-hover/card:text-[var(--bg-primary)] group-hover/card:border-[var(--text-primary)] group-hover/card:scale-110">
                         <ArrowRight size={18} className="transition-transform duration-500 group-hover/card:translate-x-1" />
                       </div>
                    </div>
                  </div>
                </MinimalCard>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
