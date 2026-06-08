"use client";
import React from "react";

export default function SettingUpEnvironmentLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(249,115,22,0.1)", color: "#f97316", border: "1px solid rgba(249,115,22,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Configuration</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>Setting Up <span style={{ color: "#f97316" }}>Environment</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Follow these steps to set up a professional C++ development environment on your machine.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
        {[
          { name: "Windows", desc: "Install MinGW-w64 (via MSYS2) or Visual Studio (C++ Desktop Development).", color: "#3b82f6" },
          { name: "macOS", desc: "Install Xcode Command Line Tools by running 'xcode-select --install' in terminal.", color: "#8b5cf6" },
          { name: "Linux", desc: "Install build-essential (sudo apt install build-essential).", color: "#10b981" },
        ].map((os, i) => (
          <div key={i} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: os.color, marginBottom: 4, fontFamily: "'Syne', sans-serif" }}>{os.name}</div>
            <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>{os.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#f97316", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>VERIFY INSTALLATION</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 8 }}>Run this command in your terminal:</p>
        <code style={{ fontSize: 13, color: "#fb923c", background: "var(--accent-soft)", padding: "6px 12px", borderRadius: 6, display: "inline-block" }}>g++ --version</code>
 
    </div></div>
  );
}
