"use client";
import React from "react";
import { MessageSquare, Info } from "lucide-react";

export default function CommentsInCppLesson() {
  const types = [
    {
      name: "Single-line Comment",
      syntax: "// This is a comment",
      desc: "Everything after // on that line is ignored by the compiler.",
      color: "#10b981",
      useCase: "Quick notes, disabling one line"
    },
    {
      name: "Multi-line Comment",
      syntax: "/* This is a\n   multi-line comment */",
      desc: "Everything between /* and */ is ignored, spanning multiple lines.",
      color: "#8b5cf6",
      useCase: "Block descriptions, documentation"
    }
  ];

  const bestPractices = [
    "Explain WHY, not WHAT — the code shows what, comments explain reasoning",
    "Keep comments up to date when code changes",
    "Use comments to mark TODO items and known issues",
    "Don't over-comment obvious code like i++ // increment i",
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
        Documentation
      </span>

      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 32, letterSpacing: "-0.04em", marginBottom: 12, lineHeight: 1.1 }}>
        <span style={{ color: "#10b981" }}>Comments</span> in C++
      </h2>

      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 600, marginBottom: 32 }}>
        Comments are non-executable text that help developers understand code. The compiler completely ignores them during compilation.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 28 }}>
        {types.map((t, i) => (
          <div key={i} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <MessageSquare size={14} style={{ color: t.color }} />
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 15, color: t.color }}>{t.name}</span>
            </div>
            <pre style={{ margin: 0, fontSize: 13, color: "#fb923c", fontFamily: "monospace", background: "rgba(249,115,22,0.06)", padding: "10px 14px", borderRadius: 8, marginBottom: 10, whiteSpace: "pre-wrap" }}>{t.syntax}</pre>
            <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.5, marginBottom: 6 }}>{t.desc}</p>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Use case: {t.useCase}</span>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 11, fontFamily: "'Syne', sans-serif", fontWeight: 800, color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
        Best Practices
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {bestPractices.map((bp, i) => (
          <div key={i} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 10, padding: "10px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "#f59e0b", fontSize: 12, flexShrink: 0 }}>→</span>
            <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>{bp}</span>
          </div>
        ))}
    </div></div>
  );
}
