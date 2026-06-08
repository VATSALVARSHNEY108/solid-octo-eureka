"use client";
import React from "react";

export default function LogicalOperatorsLesson() {
  const ops = [
    { op: "&&", name: "AND", desc: "Both conditions must be true", truth: ["T&&T=T", "T&&F=F", "F&&T=F", "F&&F=F"], color: "#10b981" },
    { op: "||", name: "OR", desc: "At least one must be true", truth: ["T||T=T", "T||F=T", "F||T=T", "F||F=F"], color: "#3b82f6" },
    { op: "!", name: "NOT", desc: "Inverts the boolean value", truth: ["!T=F", "!F=T"], color: "#ec4899" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Boolean Logic</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>Logical <span style={{ color: "#10b981" }}>Operators</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Logical operators combine boolean expressions. They enable complex decision-making in control flow statements.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
        {ops.map((o, i) => (
          <div key={i} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "18px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <code style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 22, color: o.color }}>{o.op}</code>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: o.color }}>{o.name}</span>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 10 }}>{o.desc}</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {o.truth.map((t, j) => (
                <code key={j} style={{ fontSize: 11, color: t.includes("=T") ? "#10b981" : "#ef4444", background: t.includes("=T") ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", padding: "3px 10px", borderRadius: 6 }}>{t}</code>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#f59e0b", fontWeight: 700, marginBottom: 8 }}>SHORT-CIRCUIT EVALUATION</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", whiteSpace: "pre-wrap" }}>{"// && stops at first false\n// || stops at first true\nif (ptr != NULL && ptr->val > 0)"}</pre>
        <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 8 }}>The second condition is only evaluated if the first doesn't determine the result. This prevents null pointer crashes.</p>
 
    </div></div>
  );
}
