"use client";
import React from "react";

export default function StringFunctionsLesson() {
  const funcs = [
    { name: "length() / size()", desc: "Returns the number of characters in the string.", color: "#10b981" },
    { name: "append(str) / +=", desc: "Adds text to the end of the string.", color: "#3b82f6" },
    { name: "substr(pos, len)", desc: "Returns a part of the string starting at 'pos'.", color: "#8b5cf6" },
    { name: "find(str)", desc: "Returns the index of the first occurrence of 'str'.", color: "#f97316" },
    { name: "clear()", desc: "Removes all characters from the string.", color: "#ef4444" },
    { name: "empty()", desc: "Checks if the string length is 0.", color: "#ec4899" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(6,182,212,0.1)", color: "var(--accent-secondary)", border: "1px solid rgba(6,182,212,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Toolbox</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>String <span style={{ color: "var(--accent-secondary)" }}>Functions</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>The <code style={{color: "var(--accent-secondary)"}}>std::string</code> class provides a rich set of member functions to manipulate and analyze text data.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10, marginBottom: 24 }}>
        {funcs.map((f, i) => (
          <div key={i} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
            <code style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14, color: f.color, display: "block", marginBottom: 4 }}>{f.name}</code>
            <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>{f.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "var(--accent-secondary)", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>PRACTICAL EXAMPLE</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.8 }}>{`string s = "C++ Programming";\n\nif (s.find("Prog") != string::npos) {\n    string sub = s.substr(4, 4); // "Prog"\n    cout << sub.length();        // 4\n}`}</pre>
        <p style={{ color: "var(--text-muted)", fontSize: 11, marginTop: 10 }}><code style={{color: "#ef4444"}}>string::npos</code> is a constant returned by <code style={{color: "var(--accent-secondary)"}}>find()</code> if the substring is not found.</p>
 
    </div></div>
  );
}
