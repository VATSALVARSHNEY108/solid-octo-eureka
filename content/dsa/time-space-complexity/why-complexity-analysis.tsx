"use client";
import React from "react";
import { Clock, Zap, Target, Activity, ShieldCheck, Sparkles, Database, Layers, TrendingUp, AlertTriangle, ArrowDown, Shield, Lock, Repeat, AlertCircle, Minimize, XCircle } from "lucide-react";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function WhyComplexityAnalysisLesson() {
  const highlights = [
    { 
      title: "Time Complexity", 
      desc: "Measures how time scales with input size.",
      icon: <Clock size={18} className="text-amber-500" />,
      bg: "rgba(245, 158, 11, 0.05)"
    },
    { 
      title: "Space Complexity", 
      desc: "Measures how memory scales with input size.",
      icon: <Database size={18} className="text-indigo-500" />,
      bg: "rgba(99, 102, 241, 0.05)"
    },
    { 
      title: "Asymptotic Analysis", 
      desc: "Focuses on large-scale growth rates.",
      icon: <TrendingUp size={18} className="text-emerald-500" />,
      bg: "rgba(16, 185, 129, 0.05)"
    }
  ];

  return (
    <div style={{ fontVariantNumeric: "tabular-nums", fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
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
          Complexity Analysis
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
        Why Complexity Analysis <span style={{ color: "#8b5cf6" }}></span>
      </h2>
      
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 600, marginBottom: 32 }}>
        Understanding the efficiency and scalability of algorithms as input size grows.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 32 }}>
        {highlights.map((h, i) => (
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
              background: h.bg, 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              marginBottom: 16 
            }}>
              {h.icon}
            </div>
            <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{h.title}</h4>
            <p style={{ color: "var(--text-muted)", fontSize: 13, lineHeight: 1.6 }}>{h.desc}</p>
          </div>
        ))}
      </div>

      <MinimalSimulationStudio 
        type="complexity"
        title="Why Complexity Analysis"
        code={["Analyze input size N", "Count basic operations", "Identify dominant loops", "Estimate growth rate", "Drop constants", "Express in Big-O notation"]}
      />

      <div style={{ 
        background: "rgba(139,92,246,0.05)", 
        border: "1px solid rgba(139,92,246,0.1)", 
        borderRadius: 20, 
        padding: 24,
        marginTop: 32
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <Sparkles size={16} className="text-indigo-400" />
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 12, color: "#8b5cf6", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            The Core Principle
          </span>
        </div>
        
        <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.8 }}>
          Algorithmic analysis allows us to predict performance without hardware bias. By focusing on Big-O, 
          we ensure our solutions remain scalable as data grows exponentially.
        </p>
 
    </div></div>
  );
}
