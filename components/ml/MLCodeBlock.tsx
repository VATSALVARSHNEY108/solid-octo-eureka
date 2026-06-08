"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

type MLCodeBlockProps = {
  title?: string;
  language?: string;
  code: string;
  defaultExpanded?: boolean;
  className?: string;
};

export function MLCodeBlock({
  title,
  language,
  code,
  defaultExpanded = true,
  className,
}: MLCodeBlockProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [copied, setCopied] = useState(false);

  const normalized = useMemo(() => {
    // Keep user-provided indentation stable for a beginner-friendly "read" experience.
    return code.replace(/\n{3,}/g, "\n\n");
  }, [code]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(normalized);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 900);
    } catch {
      // Clipboard might be blocked; silently ignore.
    }
  };

  return (
    <div
      className={cn(
        "rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/20 overflow-hidden shadow-premium",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3 bg-[var(--bg-secondary)]/40 backdrop-blur-xl border-b border-[var(--border-subtle)]">
        <div className="min-w-0">
          {title ? (
            <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">
              {title}
            </div>
          ) : null}
          <div className="text-[11px] font-mono text-[var(--text-secondary)] mt-1">
            {language ? language : "code"}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onCopy}
            className="p-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] transition-all active:scale-95"
            aria-label="Copy code"
            title="Copy code"
          >
            <Copy size={16} />
          </button>

          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="p-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] transition-all active:scale-95"
            aria-label={expanded ? "Collapse code block" : "Expand code block"}
            title={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            key="code-expanded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
          >
            <div className="px-4 py-4">
              <pre className="overflow-x-auto text-xs leading-relaxed text-[var(--text-secondary)]">
                <code className="font-mono">{normalized}</code>
              </pre>
              {copied ? (
                <div className="mt-3 text-[10px] font-black uppercase tracking-[0.25em] text-indigo-400">
                  Copied
                </div>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

