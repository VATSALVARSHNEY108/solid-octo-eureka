"use client";
import React from "react";

export default function CStyleStringsLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(249,115,22,0.1)", color: "#f97316", border: "1px solid rgba(249,115,22,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Legacy Logic</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>C-Style <span style={{ color: "#f97316" }}>Strings</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Before <code style={{color: "#f97316"}}>std::string</code>, C++ used arrays of characters terminated by a special null character <code style={{color: "#f97316"}}>\0</code>.</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#f97316", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>DECLARATION</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.8 }}>{`char str[] = "Hello"; \n// Memory: ['H', 'e', 'l', 'l', 'o', '\\0']\n\nchar str2[6] = {'H', 'e', 'l', 'l', 'o', '\\0'};`}</pre>
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#3b82f6", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>COMMON &lt;cstring&gt; FUNCTIONS</div>
        <ul style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
          <li><code style={{color: "#3b82f6"}}>strlen(s)</code>: Returns length (excluding null).</li>
          <li><code style={{color: "#3b82f6"}}>strcpy(dest, src)</code>: Copies src to dest.</li>
          <li><code style={{color: "#3b82f6"}}>strcmp(s1, s2)</code>: Compares two strings lexicographically.</li>
          <li><code style={{color: "#3b82f6"}}>strcat(dest, src)</code>: Appends src to end of dest.</li>
        </ul>
      </div>

      <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 700, marginBottom: 8 }}>DANGER ZONE</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>C-style strings are prone to <b style={{color: "#ef4444"}}>Buffer Overflows</b> because they don't track their own size. In modern C++, always prefer <code style={{color: "#10b981"}}>std::string</code>.</p>
 
    </div></div>
  );
}
