"use client";
import React from "react";

export default function STLQueueLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>FIFO</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>STL <span style={{ color: "#3b82f6" }}>Queue</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>A container adapter following First-In, First-Out (FIFO). Elements are added at the back and removed from the front.</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#3b82f6", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>CORE METHODS</div>
        <ul style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
          <li><code style={{color: "#3b82f6"}}>push(val)</code>: Adds element to back.</li>
          <li><code style={{color: "#3b82f6"}}>pop()</code>: Removes front element.</li>
          <li><code style={{color: "#3b82f6"}}>front()</code>: Returns front element.</li>
          <li><code style={{color: "#3b82f6"}}>back()</code>: Returns back element.</li>
        </ul>
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 8 }}>Code Example</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.7 }}>{`queue<int> q;\nq.push(10); q.push(20);\n\ncout << q.front(); // 10\nq.pop();\ncout << q.front(); // 20`}</pre>
      </div>

      <div style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#3b82f6", fontWeight: 700, marginBottom: 8 }}>APPLICATIONS</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>Used in Breadth-First Search (BFS), task scheduling, printer spooling, and handling asynchronous data streams.</p>
 
    </div></div>
  );
}
