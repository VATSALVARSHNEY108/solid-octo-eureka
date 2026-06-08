"use client";
import React from "react";

export default function ExceptionHandlingLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Error Management</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>Exception <span style={{ color: "#ef4444" }}>Handling</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>A way to handle runtime errors (like division by zero or file not found) gracefully without crashing the entire program.</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#ef4444", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>THE TRIAD: try, throw, catch</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.8 }}>{`try {\n    if (b == 0) throw "DivByZero";\n    cout << a / b;\n} catch (const char* msg) {\n    cerr << "Error: " << msg;\n}`}</pre>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {[
          { name: "try", desc: "Block of code where exceptions might occur.", color: "#3b82f6" },
          { name: "throw", desc: "Used to signal that an error has happened.", color: "#f97316" },
          { name: "catch", desc: "Block of code that handles the specific exception.", color: "#10b981" },
        ].map((k, i) => (
          <div key={i} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
            <code style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: k.color, display: "block", marginBottom: 4 }}>{k.name}</code>
            <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>{k.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 700, marginBottom: 8 }}>STANDARD EXCEPTIONS</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>C++ provides a set of standard exceptions in the <code style={{color: "#ef4444"}}>&lt;stdexcept&gt;</code> header, like <code style={{color: "#ef4444"}}>std::runtime_error</code> and <code style={{color: "#ef4444"}}>std::out_of_range</code>.</p>
 
    </div></div>
  );
}
