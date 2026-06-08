"use client";

import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";

// --- Types ---
interface Step {
  type: string;
  message: string;
  text: string;
  hash: number[];
  i: number;
}

// --- Constants ---
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

export default function CharacterHashingStringsLab() {
  const [text, setText] = useState("character");
  const [stepIdx, setStepIdx] = useState(0);

  const steps = useMemo<Step[]>(() => {
    const sArr: Step[] = [];
    const hash = new Array(26).fill(0);
    sArr.push({ type: "init", message: "Goal: Use a fixed-size array to store character frequencies.", text, hash: [...hash], i: -1 });

    for (let i = 0; i < text.length; i++) {
      const idx = text.charCodeAt(i) - 97;
      if (idx >= 0 && idx < 26) {
        hash[idx]++;
        sArr.push({
          type: "update", message: `Found '${text[i]}'. Incrementing hash index ${idx} (char - 'a').`,
          text, hash: [...hash], i
        });
      }
    }

    sArr.push({ type: "done", message: "Final frequency hash constructed.", text, hash: [...hash], i: text.length });
    return sArr;
  }, [text]);

  const step = steps[Math.min(stepIdx, steps.length - 1)];

  return (
    <div style={{
      width: "100vw", height:"calc(100vh - 124px)", background: COLORS.bg,
      color: COLORS.textWhite, fontFamily: "'JetBrains Mono', monospace",
      display: "flex", flexDirection: "column", overflow: "hidden"
    }}>
      <div style={{ height: 48, background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", padding: "0 16px", gap: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 800 }}>CHARACTER_HASH_LAB</div>
        <input type="text" value={text} onChange={e => setText(e.target.value)} style={inputStyle} />
        <button style={btnStyle} onClick={() => setStepIdx(p => Math.min(steps.length - 1, p + 1))}>Next Step</button>
      </div>

      <div style={{ flex: 1, position: "relative", display: "flex", gap: 40, padding: 40 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 60, alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", gap: 12 }}>
            {text.split("").map((c, idx) => (
              <div key={idx} style={{
                width: 50, height: 64, background: idx === step.i ? "rgba(88,166,255,0.15)" : COLORS.surface,
                border: `2px solid ${idx === step.i ? COLORS.blue : COLORS.border}`, borderRadius: 8,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800
              }}>{c}</div>
            ))}
          </div>
          <div style={{ width: 450, padding: 30, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, textAlign: "center" }}>
            <div style={labelStyle}>Analysis</div>
            <div style={{ fontSize: 16, lineHeight: 1.6 }}>{step.message}</div>
          </div>
        </div>

        <div style={{ width: 300, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 24, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {step.hash.map((val, idx) => (
            <div key={idx} style={{
              height: 44, background: val > 0 ? "rgba(63,185,80,0.1)" : COLORS.bg,
              border: `1px solid ${val > 0 ? COLORS.green : COLORS.border}`, borderRadius: 4,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
            }}>
              <div style={{ fontSize: 8, color: COLORS.textMuted }}>{String.fromCharCode(97 + idx)}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: val > 0 ? COLORS.green : COLORS.textDark }}>{val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>


  );
}

const inputStyle = { background: COLORS.bg, border: `1px solid ${COLORS.border}`, color: COLORS.textWhite, fontSize: 11, outline: "none", width: 120, padding: "4px 12px", borderRadius: 6, fontFamily: "inherit" };
const btnStyle = { background: COLORS.borderLighter, border: `1px solid ${COLORS.border}`, color: COLORS.textWhite, padding: "6px 14px", borderRadius: 6, fontSize: 11, cursor: "pointer", fontFamily: "inherit" };
const labelStyle = { fontSize: 9, fontWeight: 800, textTransform: "uppercase", color: COLORS.textMuted, marginBottom: 12 };
