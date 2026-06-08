"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type WorkflowStep = {
  id: string;
  label: string;
  hint?: string;
};

type MLWorkflowPipelineProps = {
  steps: WorkflowStep[];
  className?: string;
};

export function MLWorkflowPipeline({ steps, className }: MLWorkflowPipelineProps) {
  return (
    <div className={cn("rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/20 p-4 md:p-6 shadow-premium", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">
          Step-by-step workflow
        </div>
        <div className="text-[10px] font-mono text-[var(--text-secondary)] opacity-70">
          Input → Processing → Learning → Prediction → Output
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 items-start">
        {steps.map((s, idx) => (
          <React.Fragment key={s.id}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
              transition={{ duration: 0.35, delay: idx * 0.03 }}
              className="relative"
            >
              <div className="rounded-[1.2rem] bg-[var(--bg-primary)]/30 border border-[var(--border-subtle)] p-4 min-h-[86px]">
                <div className="flex items-center gap-2">
                  <span className="inline-flex size-2 rounded-full bg-[var(--accent-secondary)]" />
                  <div className="text-sm font-black tracking-tight text-[var(--text-primary)]">
                    {s.label}
                  </div>
                </div>
                {s.hint ? <div className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">{s.hint}</div> : null}
              </div>
            </motion.div>
            {idx < steps.length - 1 ? (
              <div className="hidden lg:flex items-center justify-center mt-6">
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <ArrowRight size={16} className="opacity-70" />
                </div>
              </div>
            ) : null}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

