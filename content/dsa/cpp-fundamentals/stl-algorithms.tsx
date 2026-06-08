"use client";
import React from "react";

export default function STLAlgorithmsLesson() {
  const algos = [
    { name: "sort()", desc: "Sorts elements in a range in O(N log N).", color: "#10b981" },
    { name: "binary_search()", desc: "Checks if element exists in a sorted range.", color: "#3b82f6" },
    { name: "reverse()", desc: "Reverses the order of elements.", color: "#8b5cf6" },
    { name: "max_element()", desc: "Finds the largest element in a range.", color: "#f97316" },
    { name: "next_permutation()", desc: "Generates lexicographical permutations.", color: "#ec4899" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Prebuilt Logic</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>STL <span style={{ color: "#10b981" }}>Algorithms</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>The <code style={{color: "#10b981"}}>&lt;algorithm&gt;</code> header contains a huge collection of functions for searching, sorting, and manipulating data efficiently.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {algos.map((a, i) => (
          <div key={i} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
            <code style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: a.color, display: "block", marginBottom: 4 }}>{a.name}</code>
            <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>{a.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#10b981", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>SORTING EXAMPLE</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.8 }}>{`vector<int> v = {40, 10, 30, 20};\nsort(v.begin(), v.end());\n\n// To sort in descending order:\nsort(v.begin(), v.end(), greater<int>());`}</pre>
      </div>

      <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#10b981", fontWeight: 700, marginBottom: 8 }}>COMPETITIVE PROGRAMMING</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>Knowing STL algorithms is a massive advantage in CP. They are faster to write and often more optimized than manual implementations.</p>
 
    </div></div>
  );
}
