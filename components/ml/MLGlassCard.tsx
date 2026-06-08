import React from "react";
import { cn } from "@/lib/utils";

type MLGlassCardProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Project-aligned glass card wrapper.
 * Uses the existing `premium-card` styling from `app/styles/cards.css`.
 */
export function MLGlassCard({ children, className }: MLGlassCardProps) {
  return (
    <div
      className={cn(
        "premium-card bg-[var(--bg-secondary)]/40 backdrop-blur-xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

type MLSectionTitleProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
};

export function MLSectionTitle({ eyebrow, title, subtitle }: MLSectionTitleProps) {
  return (
    <header className="space-y-3">
      {eyebrow ? (
        <div className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--text-muted)]">
          {eyebrow}
        </div>
      ) : null}
      <h2 className="text-xl md:text-2xl font-black tracking-tight text-[var(--text-primary)]">
        {title}
      </h2>
      {subtitle ? <p className="text-[var(--text-secondary)] leading-relaxed">{subtitle}</p> : null}
    </header>
  );
}

