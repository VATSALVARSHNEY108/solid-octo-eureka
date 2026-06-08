"use client";
import React from "react";
import { Terminal, ArrowRight, ArrowLeft, Info } from "lucide-react";

export default function InputOutputLesson() {
  const streams = [
    { name: "cout", dir: "Output", desc: "Sends data to the console screen", op: "<<", color: "#10b981", icon: <ArrowRight size={14} /> },
    { name: "cin", dir: "Input", desc: "Reads data from the keyboard", op: ">>", color: "#3b82f6", icon: <ArrowLeft size={14} /> },
    { name: "cerr", dir: "Error", desc: "Outputs unbuffered error messages", op: "<<", color: "#ef4444", icon: <ArrowRight size={14} /> },
    { name: "clog", dir: "Log", desc: "Outputs buffered log messages", op: "<<", color: "#f59e0b", icon: <ArrowRight size={14} /> },
  ];

  const examples = [
    { label: "Basic Output", code: 'cout << "Hello, World!" << endl;' },
    { label: "Variable Output", code: 'int x = 42;\ncout << "Value: " << x << endl;' },
    { label: "Basic Input", code: 'int age;\ncin >> age;' },
    { label: "Multiple Inputs", code: 'int a, b;\ncin >> a >> b;' },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
        03 // I/O Streams
      </span>

      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 32, letterSpacing: "-0.04em", marginBottom: 12, lineHeight: 1.1 }}>
        Input & <span style={{ color: "#10b981" }}>Output</span>
      </h2>

      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 600, marginBottom: 32 }}>
        C++ uses stream objects for I/O operations. The <code style={{ color: "#10b981" }}>iostream</code> header provides <code style={{ color: "#10b981" }}>cin</code> and <code style={{ color: "#10b981" }}>cout</code> as the primary channels for reading input and displaying output.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 32 }}>
        {streams.map((s, i) => (
          <div key={i} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "16px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ color: s.color }}>{s.icon}</span>
              <code style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: s.color }}>{s.name}</code>
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>{s.dir} Stream</div>
            <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.5 }}>{s.desc}</p>
            <div style={{ marginTop: 8, background: "var(--accent-soft)", padding: "4px 8px", borderRadius: 6, display: "inline-block" }}>
              <code style={{ fontSize: 11, color: "#8b5cf6" }}>operator {s.op}</code>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
        {examples.map((ex, i) => (
          <div key={i} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius: 12, padding: "14px 18px" }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 6 }}>{ex.label}</div>
            <pre style={{ margin: 0, fontSize: 13, color: "#fb923c", fontFamily: "monospace", whiteSpace: "pre-wrap" }}>{ex.code}</pre>
          </div>
        ))}
      </div>

      <div style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.1)", borderRadius: 16, padding: 20, display: "flex", gap: 16 }}>
        <div style={{ color: "#3b82f6", marginTop: 2 }}><Info size={18} /></div>
        <div>
          <h5 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 13, color: "#3b82f6", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            endl vs \\n
          </h5>
          <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>
            Both create a newline, but <code style={{ color: "#3b82f6" }}>endl</code> also flushes the buffer. In competitive programming, use <code style={{ color: "#3b82f6" }}>\n</code> for faster output.
          </p>
 
    </div></div></div>
  );
}
