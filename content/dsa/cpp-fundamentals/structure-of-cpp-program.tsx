"use client";
import React from "react";
import { Braces, Terminal, Hash, ChevronRight, Info } from "lucide-react";

export default function StructureOfCPPProgramLesson() {
  const sections = [
    {
      code: "#include <iostream>",
      title: "Preprocessor Directive",
      desc: "Tells the compiler to include the standard input-output stream library, enabling cout and cin.",
      icon: <Hash size={14} className="text-pink-500" />
    },
    {
      code: "int main() { ... }",
      title: "The Main Function",
      desc: "The entry point of every C++ program. Execution begins at the opening brace '{' and ends at '}'.",
      icon: <Braces size={14} className="text-indigo-500" />
    },
    {
      code: 'std::cout << "Hello";',
      title: "Standard Output",
      desc: "Used to print text to the console. The '<<' is the insertion operator.",
      icon: <Terminal size={14} className="text-emerald-500" />
    }
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <span style={{ 
          display: "inline-block", 
          background: "rgba(16,185,129,0.1)", 
          color: "#10b981", 
          border: "1px solid rgba(16,185,129,0.2)", 
          padding: "4px 12px", 
          borderRadius: 100, 
          fontSize: 10, 
          fontFamily: "'Syne', sans-serif", 
          fontWeight: 800, 
          letterSpacing: "0.1em", 
          textTransform: "uppercase" 
        }}>
          02 // Anatomy
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
        Program <span style={{ color: "#10b981" }}>Structure</span>
      </h2>
      
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 600, marginBottom: 32 }}>
        Every C++ program follows a specific blueprint. Understanding this anatomy is the first step 
        to writing clean, compilable code.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
        {sections.map((s, i) => (
          <div key={i} style={{ 
            background: "var(--bg-secondary)", 
            border: "1px solid var(--border-subtle)", 
            borderRadius: 16, 
            padding: "16px 20px",
            display: "flex",
            alignItems: "flex-start",
            gap: 20
          }}>
            <div style={{ 
              background: "var(--accent-soft)", 
              padding: 12, 
              borderRadius: 12,
              border: "1px solid var(--border-subtle)"
            }}>
              {s.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14 }}>{s.title}</h4>
                <ChevronRight size={12} className="opacity-20" />
                <code style={{ fontSize: 11, background: "var(--accent-soft)", padding: "2px 6px", borderRadius: 4, color: "#8b5cf6" }}>{s.code}</code>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: 13, lineHeight: 1.5 }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ 
        background: "rgba(16,185,129,0.03)", 
        border: "1px solid rgba(16,185,129,0.1)", 
        borderRadius: 16, 
        padding: 20,
        display: "flex",
        gap: 16
      }}>
        <div style={{ color: "#10b981", marginTop: 2 }}>
          <Info size={18} />
        </div>
        <div>
          <h5 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 13, color: "#10b981", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            The semicolon (;)
          </h5>
          <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>
            In C++, the semicolon is a statement terminator. Every individual instruction must end 
            with a semicolon to tell the compiler where the command finishes.
          </p>
 
    </div></div></div>
  );
}


