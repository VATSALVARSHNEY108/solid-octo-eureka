"use client";
import React from "react";

export default function STLStackLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(139,92,246,0.1)", color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>LIFO</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>STL <span style={{ color: "#8b5cf6" }}>Stack</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>A container adapter that follows the Last-In, First-Out (LIFO) principle. Elements are pushed and popped from only one end (the top).</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#8b5cf6", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>CORE METHODS</div>
        <ul style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
          <li><code style={{color: "#8b5cf6"}}>push(val)</code>: Adds element to top.</li>
          <li><code style={{color: "#8b5cf6"}}>pop()</code>: Removes top element.</li>
          <li><code style={{color: "#8b5cf6"}}>top()</code>: Returns top element (doesn't remove).</li>
          <li><code style={{color: "#8b5cf6"}}>empty()</code>: Checks if stack is empty.</li>
        </ul>
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 8 }}>Code Example</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.7 }}>{`stack<int> s;\ns.push(10);\ns.push(20);\n\ncout << s.top(); // 20\ns.pop();\ncout << s.top(); // 10`}</pre>
      </div>

      <div style={{ background: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#8b5cf6", fontWeight: 700, marginBottom: 8 }}>APPLICATIONS</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>Used for reversing data, balancing brackets, function calls (recursion stack), and evaluating mathematical expressions.</p>
 
    </div></div>
  );
}
