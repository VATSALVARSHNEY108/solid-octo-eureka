"use client";
import React from "react";

export default function StringClassLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(6,182,212,0.1)", color: "var(--accent-secondary)", border: "1px solid rgba(6,182,212,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Modern Strings</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>The <span style={{ color: "var(--accent-secondary)" }}>string</span> Class</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>The <code style={{color: "var(--accent-secondary)"}}>std::string</code> is a powerful class provided by the C++ Standard Library to handle text data safely and efficiently.</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "var(--accent-secondary)", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>WHY IT'S BETTER THAN char[]</div>
        <ul style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
          <li><b style={{color: "var(--text-primary)"}}>Auto-Resizing:</b> Grows as you add text.</li>
          <li><b style={{color: "var(--text-primary)"}}>Intuitive Operators:</b> Use <code style={{color: "var(--accent-secondary)"}}>+</code> for concatenation and <code style={{color: "var(--accent-secondary)"}}>==</code> for comparison.</li>
          <li><b style={{color: "var(--text-primary)"}}>Safety:</b> Bounds checking with <code style={{color: "var(--accent-secondary)"}}>.at()</code>.</li>
          <li><b style={{color: "var(--text-primary)"}}>Memory:</b> Automatically manages allocation/deallocation.</li>
        </ul>
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#3b82f6", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>QUICK EXAMPLE</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.8 }}>{`string s = "C++";\ns += " is fun";\n\nif (s == "C++ is fun") {\n    cout << s.substr(0, 3); // "C++"\n}`}</pre>
      </div>

      <div style={{ background: "rgba(6,182,212,0.05)", border: "1px solid rgba(6,182,212,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "var(--accent-secondary)", fontWeight: 700, marginBottom: 8 }}>STL COMPATIBILITY</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>Since <code style={{color: "var(--accent-secondary)"}}>std::string</code> is a container, it works seamlessly with STL algorithms like <code style={{color: "var(--accent-secondary)"}}>sort()</code>, <code style={{color: "var(--accent-secondary)"}}>reverse()</code>, and <code style={{color: "var(--accent-secondary)"}}>find()</code>.</p>
 
    </div></div>
  );
}
