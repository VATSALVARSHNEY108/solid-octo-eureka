"use client";
import React from "react";

export default function TimeComplexityBasicsLesson() {
  const notations = [
    { name: "O(1)", desc: "Constant Time. The operation always takes the same time regardless of input size.", color: "#10b981" },
    { name: "O(log N)", desc: "Logarithmic Time. The data is halved in each step (e.g., Binary Search).", color: "#3b82f6" },
    { name: "O(N)", desc: "Linear Time. The time grows proportionally with input size (e.g., Simple Loop).", color: "#8b5cf6" },
    { name: "O(N log N)", desc: "Log-linear Time. Standard for efficient sorting (e.g., Merge Sort).", color: "#f97316" },
    { name: "O(N²)", desc: "Quadratic Time. Nested loops over the data.", color: "#ef4444" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(139,92,246,0.1)", color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Big O Notation</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>Time <span style={{ color: "#8b5cf6" }}>Complexity</span> Basics</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Time complexity is a way to describe how the execution time of an algorithm grows as the size of the input (<code style={{color: "#8b5cf6"}}>N</code>) increases.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {notations.map((n, i) => (
          <div key={i} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <code style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: n.color }}>{n.name}</code>
              <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>{n.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#8b5cf6", fontWeight: 700, marginBottom: 8 }}>WHY DOES IT MATTER?</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>An <code style={{color: "#8b5cf6"}}>O(N²)</code> algorithm might work for 1,000 items, but it could take YEARS to run for 1,000,000 items. Understanding Big O helps you choose the right algorithm for the scale of your data.</p>
 
    </div></div>
  );
}
