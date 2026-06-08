// components/SubjectCard.tsx
"use client";

import React from "react";
import Link from "next/link";


export interface SubjectCardProps {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ id, name, description, icon, color }) => {
  return (
    <Link
      href={`/curriculum/${id}`}
      className="group block bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl p-6 hover:bg-[var(--bg-secondary)] transition-colors"
      aria-label={name}
    >
      <div className="flex items-center space-x-4">
        {icon && (
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-bg)] text-[var(--accent)]"
            style={{ background: color ? color : undefined }}
          >
            {icon}
          </div>
        )}
        <h2 className="text-xl font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
          {name}
        </h2>
      </div>
      {description && (
        <p className="mt-2 text-sm text-[var(--text-secondary)] line-clamp-3">
          {description}
        </p>
      )}
    </Link>
  );
};
