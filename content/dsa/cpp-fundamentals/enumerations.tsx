"use client";
import React from "react";

export default function EnumerationsLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Named Constants</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>C++ <span style={{ color: "#3b82f6" }}>Enumerations</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>An <code style={{color: "#3b82f6"}}>enum</code> is a user-defined type consisting of a set of named integer constants. It makes code more readable and self-documenting.</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#3b82f6", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>BASIC ENUM</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.8 }}>{`enum Color { RED, GREEN, BLUE };\n\nColor myColor = GREEN;\nif (myColor == GREEN) {\n    // RED is 0, GREEN is 1, BLUE is 2\n}`}</pre>
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#10b981", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>ENUM CLASS (C++11+)</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.8 }}>{`enum class Status { PENDING, SUCCESS, FAILED };\n\nStatus s = Status::SUCCESS; // Scoped & Type-safe!`}</pre>
        <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 8 }}>Always prefer <code style={{color: "#10b981"}}>enum class</code> to prevent naming collisions and accidental integer conversions.</p>
      </div>

      <div style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#3b82f6", fontWeight: 700, marginBottom: 8 }}>CUSTOM VALUES</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>You can assign specific values to enum members. By default, they start at 0 and increment by 1.</p>
        <code style={{ fontSize: 12, color: "#fb923c", display: "block", marginTop: 8 }}>enum HTTP {'{ OK = 200, ERROR = 404, TIMEOUT = 408 }'};</code>
 
    </div></div>
  );
}
