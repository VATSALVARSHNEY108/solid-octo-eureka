"use client";
import React from "react";

export default function ReadingFromFilesLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Data Input</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>Reading from <span style={{ color: "#3b82f6" }}>Files</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Using the <code style={{color: "#3b82f6"}}>ifstream</code> class to read data from the disk back into your program.</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#3b82f6", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>WORD BY WORD</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.8 }}>{`ifstream inFile("data.txt");\nstring word;\nwhile (inFile >> word) {\n    cout << word << endl;\n}\ninFile.close();`}</pre>
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#10b981", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>LINE BY LINE</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.8 }}>{`string line;\nwhile (getline(inFile, line)) {\n    cout << line << endl;\n}`}</pre>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 24 }}>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#f97316", fontWeight: 700, marginBottom: 6 }}>EOF CHECK</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>The loop <code style={{color: "#f97316"}}>while(inFile &gt;&gt; x)</code> automatically stops when it hits the End of File (EOF).</p>
        </div>
        <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.1)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 700, marginBottom: 6 }}>FILE MISSING</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>If the file doesn't exist, <code style={{color: "#ef4444"}}>is_open()</code> will return false. Always check this first!</p>
 
    </div></div></div>
  );
}
