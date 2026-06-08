"use client";
import React from "react";
import { FileCode, ArrowRight, Info } from "lucide-react";

export default function HeaderFilesLesson() {
  const headers = [
    { name: "<iostream>", purpose: "Input/Output streams (cin, cout)", color: "#10b981" },
    { name: "<cmath>", purpose: "Math functions (sqrt, pow, abs)", color: "#3b82f6" },
    { name: "<string>", purpose: "String class and operations", color: "#8b5cf6" },
    { name: "<vector>", purpose: "Dynamic array container", color: "#f97316" },
    { name: "<algorithm>", purpose: "sort(), find(), max(), min()", color: "#ec4899" },
    { name: "<cstdlib>", purpose: "General utilities (rand, exit)", color: "#f59e0b" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(236,72,153,0.1)", color: "#ec4899", border: "1px solid rgba(236,72,153,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
        Includes
      </span>

      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 32, letterSpacing: "-0.04em", marginBottom: 12, lineHeight: 1.1 }}>
        Header <span style={{ color: "#ec4899" }}>Files</span>
      </h2>

      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 600, marginBottom: 28 }}>
        Header files contain declarations of functions and classes. The <code style={{ color: "#ec4899" }}>#include</code> directive copies the header contents into your file before compilation.
      </p>

      <div style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200, background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#10b981", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 8 }}>SYSTEM HEADERS</div>
          <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace" }}>{`#include <iostream>\n#include <vector>`}</pre>
          <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 8 }}>Uses angle brackets — searched in system directories</p>
        </div>
        <div style={{ flex: 1, minWidth: 200, background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#8b5cf6", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 8 }}>USER HEADERS</div>
          <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace" }}>{`#include "myfile.h"\n#include "utils.h"`}</pre>
          <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 8 }}>Uses quotes — searched in current directory first</p>
        </div>
      </div>

      <div style={{ fontSize: 11, fontFamily: "'Syne', sans-serif", fontWeight: 800, color: "#f97316", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
        Common STL Headers
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 24 }}>
        {headers.map((h, i) => (
          <div key={i} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 10, padding: "10px 16px", display: "flex", alignItems: "center", gap: 14 }}>
            <code style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14, color: h.color, width: 130, flexShrink: 0 }}>{h.name}</code>
            <ArrowRight size={12} style={{ color: "var(--text-muted)" }} />
            <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>{h.purpose}</span>
          </div>
        ))}
      </div>

      <div style={{ background: "rgba(236,72,153,0.05)", border: "1px solid rgba(236,72,153,0.1)", borderRadius: 16, padding: 20, display: "flex", gap: 16 }}>
        <div style={{ color: "#ec4899", marginTop: 2 }}><Info size={18} /></div>
        <div>
          <h5 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 13, color: "#ec4899", marginBottom: 6 }}>Competitive Trick</h5>
          <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>
            Use <code style={{ color: "#ec4899" }}>#include {"<bits/stdc++.h>"}</code> to include everything at once. Only works with GCC — not portable, but saves time in contests.
          </p>
 
    </div></div></div>
  );
}
