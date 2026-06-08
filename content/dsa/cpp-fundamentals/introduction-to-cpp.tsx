"use client";
import React from "react";
import { Cpu, Zap, Box, Layers, ShieldCheck, Sparkles } from "lucide-react";

export default function IntroductionToCPPLesson() {
  const pillars = [
    { 
      title: "Blazing Performance", 
      desc: "Close-to-hardware execution makes it the industry standard for performance-critical systems.",
      icon: <Zap size={18} className="text-amber-500" />,
      bg: "rgba(245, 158, 11, 0.05)"
    },
    { 
      title: "OOP & Abstraction", 
      desc: "Powerful object-oriented features allow building complex, scalable software architectures.",
      icon: <Box size={18} className="text-indigo-500" />,
      bg: "rgba(99, 102, 241, 0.05)"
    },
    { 
      title: "Memory Control", 
      desc: "Direct memory management (pointers) gives developers ultimate control over system resources.",
      icon: <Layers size={18} className="text-emerald-500" />,
      bg: "rgba(16, 185, 129, 0.05)"
    }
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <span style={{ 
          display: "inline-block", 
          background: "rgba(139,92,246,0.1)", 
          color: "#8b5cf6", 
          border: "1px solid rgba(139,92,246,0.2)", 
          padding: "4px 12px", 
          borderRadius: 100, 
          fontSize: 10, 
          fontFamily: "'Syne', sans-serif", 
          fontWeight: 800, 
          letterSpacing: "0.1em", 
          textTransform: "uppercase" 
        }}>
          01 // Foundation
        </span>
      </div>

      <h2 style={{ 
        fontFamily: "'Syne', sans-serif", 
        fontWeight: 800, 
        fontSize: 32, 
        letterSpacing: "-0.04em", 
        marginBottom: 12,
        lineHeight: 1.1
      }}>
        Introduction to <span style={{ color: "#8b5cf6" }}>C++</span>
      </h2>
      
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 600, marginBottom: 32 }}>
        C++ is a high-performance, general-purpose programming language created by Bjarne Stroustrup. 
        It is often called "C with Classes" and serves as the backbone for game engines, operating systems, 
        and high-frequency trading platforms.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 32 }}>
        {pillars.map((p, i) => (
          <div key={i} style={{ 
            background: "var(--accent-soft)", 
            border: "1px solid var(--border-subtle)", 
            borderRadius: 16, 
            padding: 24,
            transition: "all 0.3s ease"
          }}>
            <div style={{ 
              width: 40, 
              height: 40, 
              borderRadius: 12, 
              background: p.bg, 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              marginBottom: 16 
            }}>
              {p.icon}
            </div>
            <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{p.title}</h4>
            <p style={{ color: "var(--text-muted)", fontSize: 13, lineHeight: 1.6 }}>{p.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ 
        background: "rgba(139,92,246,0.05)", 
        border: "1px solid rgba(139,92,246,0.1)", 
        borderRadius: 20, 
        padding: 24,
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ 
          position: "absolute", 
          top: -20, 
          right: -20, 
          width: 100, 
          height: 100, 
          background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
          borderRadius: "full"
        }} />
        
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <Sparkles size={16} className="text-indigo-400" />
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 12, color: "#8b5cf6", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            The Modern Era
          </span>
        </div>
        
        <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.8, position: "relative", zIndex: 1 }}>
          Modern C++ (C++11 and beyond) has introduced features like **smart pointers**, **lambdas**, 
          and **auto types**, making the language safer and more expressive while maintaining 
          its legendary efficiency.
        </p>
      </div>

      <div style={{ marginTop: 24, padding: "0 8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text-muted)", fontSize: 12, fontWeight: 600 }}>
          <ShieldCheck size={14} className="text-emerald-500" />
          Standard: C++20 / C++23 Optimized
    </div></div></div>
  );
}


