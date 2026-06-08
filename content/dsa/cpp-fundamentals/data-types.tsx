"use client";
import React from "react";
import { Database, Info } from "lucide-react";

export default function DataTypesLesson() {
  const categories = [
    {
      category: "Primitive Types",
      color: "#f97316",
      items: [
        { type: "int", size: "4B", desc: "Whole numbers" },
        { type: "float", size: "4B", desc: "Decimal (6-7 digits)" },
        { type: "double", size: "8B", desc: "Decimal (15-16 digits)" },
        { type: "char", size: "1B", desc: "Single character" },
        { type: "bool", size: "1B", desc: "true / false" },
      ]
    },
    {
      category: "Extended Types",
      color: "#8b5cf6",
      items: [
        { type: "long long", size: "8B", desc: "Large integers" },
        { type: "short", size: "2B", desc: "Small integers" },
        { type: "unsigned int", size: "4B", desc: "Non-negative only" },
        { type: "long double", size: "16B", desc: "Extended precision" },
        { type: "wchar_t", size: "2-4B", desc: "Wide character" },
      ]
    }
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(249,115,22,0.1)", color: "#f97316", border: "1px solid rgba(249,115,22,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
        04 // Type System
      </span>

      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 32, letterSpacing: "-0.04em", marginBottom: 12, lineHeight: 1.1 }}>
        Data <span style={{ color: "#f97316" }}>Types</span>
      </h2>

      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 600, marginBottom: 32 }}>
        C++ is statically typed — every variable must declare its type at compile time. The type determines how much memory is allocated and what operations are valid.
      </p>

      {categories.map((cat, ci) => (
        <div key={ci} style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontFamily: "'Syne', sans-serif", fontWeight: 800, color: cat.color, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
            {cat.category}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {cat.items.map((item, i) => (
              <div key={i} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 12, padding: "12px 18px", display: "flex", alignItems: "center", gap: 16 }}>
                <code style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14, color: cat.color, width: 120, flexShrink: 0 }}>{item.type}</code>
                <span style={{ background: "var(--accent-soft)", padding: "2px 10px", borderRadius: 6, fontSize: 11, color: "var(--text-muted)", flexShrink: 0 }}>{item.size}</span>
                <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ background: "rgba(249,115,22,0.05)", border: "1px solid rgba(249,115,22,0.1)", borderRadius: 16, padding: 20, display: "flex", gap: 16 }}>
        <div style={{ color: "#f97316", marginTop: 2 }}><Info size={18} /></div>
        <div>
          <h5 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 13, color: "#f97316", marginBottom: 6 }}>sizeof() Operator</h5>
          <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>
            Use <code style={{ color: "#f97316" }}>sizeof(type)</code> to check the exact byte size on your system. Sizes may vary across platforms and compilers.
          </p>
 
    </div></div></div>
  );
}
