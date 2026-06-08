"use client";
import React from "react";

export default function DebuggingBasicsLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Troubleshooting</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}><span style={{ color: "#10b981" }}>Debugging</span> Basics</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Debugging is the art of finding and fixing bugs (errors) in your program. It's an essential skill for every developer.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 24 }}>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px" }}>
          <div style={{ fontSize: 11, color: "#3b82f6", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 10 }}>DEBUG BY PRINT</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>Inserting <code style={{color: "#3b82f6"}}>cout</code> statements to track variable values and program flow. Simple but effective for small bugs.</p>
        </div>

        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px" }}>
          <div style={{ fontSize: 11, color: "#10b981", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 10 }}>USE A DEBUGGER</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>Using tools like GDB or VS Code debugger to step through code line-by-line and inspect memory in real-time.</p>
        </div>
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#f97316", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>COMMON DEBUGGER TERMS</div>
        <ul style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.7, paddingLeft: 20, margin: 0 }}>
          <li><b style={{color: "var(--text-primary)"}}>Breakpoint:</b> A mark where execution pauses.</li>
          <li><b style={{color: "var(--text-primary)"}}>Step Over:</b> Run the current line and move to next.</li>
          <li><b style={{color: "var(--text-primary)"}}>Step Into:</b> Enter inside a function call.</li>
          <li><b style={{color: "var(--text-primary)"}}>Watch:</b> Monitor specific variable changes.</li>
        </ul>
      </div>

      <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#10b981", fontWeight: 700, marginBottom: 8 }}>PRO TIP</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>Always try to reproduce the bug with the smallest possible input. This makes it much easier to isolate the cause.</p>
 
    </div></div>
  );
}
