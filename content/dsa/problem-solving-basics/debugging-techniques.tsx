"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function DebuggingTechniques() {
  const techniques = [
    { name: "Print Debugging", desc: "The simplest method. Print variable values at key steps." },
    { name: "Dry Run", desc: "Manual execution on paper to find logic errors." },
    { name: "Binary Search Debug", desc: "Comment out halves of code to isolate the bug." },
    { name: "Stress Testing", desc: "Compare your output with a brute force solution on random cases." },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Debugging Techniques</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        Debugging is the process of finding and fixing errors in your code. It's a skill as important as problem-solving itself.
      </p>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {techniques.map((t, i) => (
          <div key={i} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"16px 20px" }}>
            <div style={{ fontWeight:700, fontSize:15, marginBottom:4, color:"#8b5cf6" }}>{t.name}</div>
            <div style={{ color: "var(--text-secondary)", fontSize:13 }}>{t.desc}</div>
          </div>
        ))}
      </div>

      <MinimalSimulationStudio 
        title="Debugging Techniques"
        code={["Reproduce the bug with failing test",
          "Dry run the logic on paper",
          "Insert print/log statements",
          "Use a debugger to trace variables",
          "Isolate the faulty code segment",
          "Fix and verify against all tests"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 Debugging Pro Tip</div>
        <p style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.6 }}>
          Always use a **Debugger** (like GDB or VS Code's built-in debugger) when possible. It allows you to pause execution, inspect memory, and step through code line by line.
        </p>
 
    </div></div>
  );
}
