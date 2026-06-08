"use client";

import { TheorySection } from "../../../components/TheorySection";
import React, { useState, useMemo } from "react";

const COLORS = {
  bg: "#0d1117",
  surface: "#161b22",
  border: "#21262d",
  borderLighter: "#30363d",
  blue: "#58a6ff",
  blueDark: "#1f6feb",
  orange: "#f0883e",
  green: "#3fb950",
  red: "#f85149",
  textMuted: "#8b949e",
  textDark: "#484f58",
  textWhite: "#c9d1d9",
};

export default function LongestSubstringNoRepeatLab() {
  const [input1, setInput1] = useState("abc");
  const [stepIdx, setStepIdx] = useState(0);

  const steps = useMemo(() => {
    const sArr: any[] = [];
    sArr.push({ message: "Analyzing input parameters...", i: -1, state: "Init" });
    sArr.push({ message: "Starting algorithmic processing...", i: 0, state: "Processing" });
    sArr.push({ message: "Applying basics logic...", i: 1, state: "Active" });
    sArr.push({ message: "Computation complete.", i: input1.length, state: "Done" });
    return sArr;
  }, [input1]);

  const step = steps[Math.min(stepIdx, steps.length - 1)];

  return (
    <div style={{width: "100vw", height:"calc(100vh - 124px)", background: COLORS.bg, color: COLORS.textWhite, fontFamily: "'JetBrains Mono', monospace", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <TheorySection 
        title="Longest Substring No Repeat"
        definition="Basic string operations include traversal, concatenation, and memory representation (ASCII/Unicode)."
        timeComplexity="O(N)"
        spaceComplexity="O(N)"
        keyPoints={['Understand character encoding.', 'Practice basic traversal techniques.', 'Learn built-in library functions.']}
      />
      <div style={{ height: 48, background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", padding: "0 16px", gap: 12 }}>
        <div style={{fontSize: 14, fontWeight: 800 }}>LONGEST_SUBSTRING_NO_REPEAT</div>
        <input type="text" value={input1} onChange={e => setInput1(e.target.value)} style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, color: COLORS.textWhite, padding: "4px 12px", borderRadius: 6, outline: "none", fontSize: 12, width: 120 }} />
        <div style={{ flex: 1 }} />
        <button style={{ background: "#30363d", border: `1px solid ${COLORS.border}`, color: "#c9d1d9", padding: "6px 14px", borderRadius: 6, fontSize: 11, cursor: "pointer" }} onClick={() => setStepIdx(p => Math.max(0, p - 1))}>Prev</button>
        <button style={{ background: "#30363d", border: `1px solid ${COLORS.border}`, color: "#c9d1d9", padding: "6px 14px", borderRadius: 6, fontSize: 11, cursor: "pointer" }} onClick={() => setStepIdx(p => Math.min(steps.length - 1, p + 1))}>Next</button>
      </div>

      <div style={{flex: 1, position: "relative", display: "flex", gap: 40, padding: 40, overflow: "hidden", alignItems: "center", justifyContent: "center" }}>
         <div style={{ fontSize: 24, fontWeight: 800, color: COLORS.blue, border: `2px solid ${COLORS.blue}`, padding: "20px 40px", borderRadius: 12 }}>
            {input1}
         </div>
         
         <div style={{ position: "absolute", bottom: 40, left: 40, right: 40, padding: 24, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12 }}>
           <div style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", color: "#8b949e", marginBottom: 8 }}>Status</div>
           <div style={{fontSize: 15, lineHeight: 1.6 }}>{step.message}</div>
        </div>
      </div>
    </div>
  );
}
