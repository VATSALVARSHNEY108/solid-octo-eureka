"use client";
import React from "react";

export default function STLMapLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Key-Value Pair</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>STL <span style={{ color: "#3b82f6" }}>Map</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>An associative container that stores elements as a pair of key and value. Each key must be unique, and it acts as an index to its value.</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#3b82f6", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>USAGE</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.8 }}>{`#include <map>\nmap<string, int> ageMap;\n\nageMap["Alice"] = 25;\nageMap["Bob"] = 30;\n\ncout << ageMap["Alice"]; // 25\ncout << ageMap.size();    // 2`}</pre>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 24 }}>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#10b981", fontWeight: 700, marginBottom: 6 }}>ORDERED MAP</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>Keys are sorted. O(log N) for search/insert. Uses Red-Black Tree.</p>
        </div>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 700, marginBottom: 6 }}>UNORDERED MAP</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>Keys are NOT sorted. O(1) average for search/insert. Uses Hashing.</p>
        </div>
      </div>

      <div style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#3b82f6", fontWeight: 700, marginBottom: 8 }}>ITERATING OVER MAP</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 12, fontFamily: "monospace", lineHeight: 1.6 }}>{`for (auto const& [key, val] : ageMap) {\n    cout << key << ":" << val << endl;\n}`}</pre>
        <p style={{ color: "var(--text-muted)", fontSize: 11, marginTop: 8 }}>The above structured binding syntax requires C++17.</p>
 
    </div></div>
  );
}
