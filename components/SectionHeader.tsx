// components/SectionHeader.tsx
"use client";

import React from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  actionLabel,
  onAction,
}) => {
  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
      <div>
        <h1 className="text-4xl font-bold text-[var(--text-primary)]">{title}</h1>
        {subtitle && (
          <p className="mt-2 text-lg text-[var(--text-secondary)]">{subtitle}</p>
        )}
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 sm:mt-0 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          {actionLabel}
        </button>
      )}
    </header>
  );
};
