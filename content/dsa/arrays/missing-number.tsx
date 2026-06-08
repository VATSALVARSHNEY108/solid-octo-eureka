"use client";

import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { TheorySection } from "@/components/TheorySection";

// --- Types ---
interface Step {
  type: string;
  message: string;
  line: number | null;
  array: number[];
  sum: number;
  expectedSum: number;
  currentIdx: number | null;
  panelData: Record<string, any>;
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

const CODE = [
  "int n = arr.size();",
  "int expected = n * (n + 1) / 2;",
  "int actual = 0;",
  "for (int x : arr) actual += x;",
  "return expected - actual;",
];

export default function MissingNumberLab() {
  const [array, setArray] = useState<number[]>([3, 0, 1]);
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  
  const [panels, setPanels] = useState({
    logic: { x: 50, y: 400 },
    stats: { x: 50, y: 100 },
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const panelDrag = useRef<{ panel: string; ox: number; oy: number; sx: number; sy: number } | null>(null);

  const steps = useMemo<Step[]>(() => {
    const s: Step[] = [];
    const n = array.length;
    const expectedSum = (n * (n + 1)) / 2;
    let actualSum = 0;

    s.push({
      type: "init", message: `Finding missing number in [0, ${n}]. Gauss sum method.`,
      line: 0, array, sum: 0, expectedSum, currentIdx: null,
      panelData: { n, expectedSum, status: "Init" }
    });

    s.push({
      type: "calcExpected", message: `Sum of 0 to ${n} is n(n+1)/2 = ${expectedSum}`,
      line: 1, array, sum: 0, expectedSum, currentIdx: null,
      panelData: { expectedSum }
    });

    for (let i = 0; i < array.length; i++) {
      actualSum += array[i];
      s.push({
        type: "calcActual", message: `Adding arr[${i}] (${array[i]}) to actual sum: ${actualSum}`,
        line: 3, array, sum: actualSum, expectedSum, currentIdx: i,
        panelData: { actualSum, expectedSum }
      });
    }

    const missing = expectedSum - actualSum;
    s.push({
      type: "done", message: `Missing number = Expected (${expectedSum}) - Actual (${actualSum}) = ${missing}`,
      line: 4, array, sum: actualSum, expectedSum, currentIdx: null,
      panelData: { result: missing, status: "Done" }
    });

    return s;
  }, [array]);

  const step = steps[Math.min(stepIdx, steps.length - 1)];

  const next = useCallback(() => setStepIdx(p => Math.min(p + 1, steps.length - 1)), [steps.length]);
  const prev = useCallback(() => setStepIdx(p => Math.max(0, p - 1)), []);
  const reset = useCallback(() => { setStepIdx(0); setIsPlaying(false); }, []);

  useEffect(() => {
    if (!isPlaying) { if (timerRef.current) clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => {
      setStepIdx(p => {
        if (p >= steps.length - 1) { setIsPlaying(false); return p; }
        return p + 1;
      });
    }, speed);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, speed, steps.length]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!panelDrag.current) return;
      const { panel, ox, oy, sx, sy } = panelDrag.current;
      setPanels(prev => ({ ...prev, [panel]: { x: sx + (e.clientX - ox), y: sy + (e.clientY - oy) } }));
    };
    const handleMouseUp = () => { panelDrag.current = null; };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => { window.removeEventListener("mousemove", handleMouseMove); window.removeEventListener("mouseup", handleMouseUp); };
  }, []);

  const renderPanel = (id: string, title: string, content: React.ReactNode) => {
    const pos = (panels as any)[id];
    return (
      <div style={{
        position: 'absolute', left: pos.x, top: pos.y, width: 260,
        background: 'rgba(22,27,34,0.95)', border: `1px solid ${COLORS.border}`,
        borderRadius: 10, backdropFilter: 'blur(10px)', zIndex: 100
      }}>
        <div onMouseDown={(e) => { panelDrag.current = { panel: id, ox: e.clientX, oy: e.clientY, sx: pos.x, sy: pos.y }; e.stopPropagation(); }} style={{
          cursor: 'grab', padding: '8px 12px', background: COLORS.border,
          fontSize: 10, fontWeight: 700, color: COLORS.textMuted,
          display: 'flex', justifyContent: 'space-between', borderTopLeftRadius: 9, borderTopRightRadius: 9
        }}>
          {title} <span>⠿</span>
        </div>
        <div style={{ padding: '12px 14px' }}>{content}</div>
      </div>
    );
  };

  return (
    <div style={{ width: "100vw", height:"calc(100vh - 124px)", overflowY: "auto", background: COLORS.bg, scrollbarWidth: "none" }}>
      <TheorySection 
        title="Missing Number"
        definition="Given an array containing n distinct numbers in the range [0, n], finding the one number that is missing from the sequence."
        timeComplexity="O(N)"
        spaceComplexity="O(1)"
        keyPoints={[
          "Gauss Sum Formula: n*(n+1)/2",
          "XOR-based property",
          "No extra memory required",
          "Linear scan efficiency"
        ]}
      />
      <div style={{
        height:"calc(100vh - 124px)", background: COLORS.bg,
        color: COLORS.textWhite, fontFamily: "'JetBrains Mono', monospace",
        display: "flex", flexDirection: "column", overflow: "hidden"
      }}>
      <div style={{ height: 48, background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", padding: "0 16px", gap: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 800, marginRight: 20 }}>MISSING_NUMBER_LAB</div>
        
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: COLORS.bg, padding: "4px 12px", borderRadius: 6, border: `1px solid ${COLORS.border}` }}>
          <span style={{ fontSize: 10, color: COLORS.textMuted }}>ARRAY:</span>
          <input 
            type="text" 
            placeholder="3, 0, 1..." 
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const val = (e.target as HTMLInputElement).value;
                const newArr = val.split(",").map(x => parseInt(x.trim())).filter(x => !isNaN(x));
                if (newArr.length > 0) {
                  setArray(newArr);
                  setStepIdx(0);
                  setIsPlaying(false);
                }
              }
            }}
            style={{ 
              background: "transparent", border: "none", color: COLORS.textWhite, 
              fontSize: 11, outline: "none", width: 120, fontFamily: "inherit" 
            }} 
          />
        </div>

        <button style={btnStyle} onClick={reset}>Reset Demo</button>
      </div>

      <div style={{ flex: 1, display: "flex" }}>
        <div style={{ width: 260, background: COLORS.surface, borderRight: `1px solid ${COLORS.border}`, padding: 20, display: "flex", flexDirection: "column", gap: 24 }}>
          <div><div style={labelStyle}>Current Step</div><div style={{ fontSize: 11, lineHeight: 1.5 }}>{step.message}</div></div>
          <div><div style={labelStyle}>Playback</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={ctrlBtnStyle} onClick={reset}>↺</button>
              <button style={ctrlBtnStyle} onClick={prev}>‹</button>
              <button style={{ ...ctrlBtnStyle, background: isPlaying ? COLORS.blueDark : COLORS.borderLighter }} onClick={() => setIsPlaying(!isPlaying)}>{isPlaying ? "⏸" : "▶"}</button>
              <button style={ctrlBtnStyle} onClick={next}>›</button>
            </div>
          </div>
          <div style={{ marginTop: "auto" }}><div style={{ height: 2, background: COLORS.border }}><div style={{ height: "100%", background: COLORS.blue, width: `${((stepIdx + 1) / steps.length) * 100}%` }} /></div></div>
        </div>

        <div style={{ flex: 1, position: "relative" }}>
          <svg style={{ position: "absolute", width: "100%", height: "100%", pointerEvents: "none" }}>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/></pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {renderPanel("stats", "Sum Tracker", (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                <span style={{ color: COLORS.textMuted }}>EXPECTED</span>
                <span style={{ color: COLORS.green }}>{step.expectedSum}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                <span style={{ color: COLORS.textMuted }}>ACTUAL</span>
                <span style={{ color: COLORS.orange }}>{step.sum}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, borderTop: `1px solid ${COLORS.border}`, paddingTop: 8, marginTop: 4 }}>
                <span style={{ color: COLORS.textMuted }}>DIFFERENCE</span>
                <span style={{ color: COLORS.blue, fontWeight: 800 }}>{step.expectedSum - step.sum}</span>
              </div>
            </div>
          ))}

          {renderPanel("logic", "Gauss Sum Logic", (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {CODE.map((line, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '4px 8px', borderRadius: 4, background: step.line === i ? 'rgba(88,166,255,0.1)' : 'transparent', borderLeft: step.line === i ? `2px solid ${COLORS.blue}` : '2px solid transparent' }}>
                  <span style={{ fontSize: 10, color: COLORS.textDark, minWidth: 16 }}>{i + 1}</span>
                  <span style={{ fontSize: 11, color: step.line === i ? COLORS.textWhite : COLORS.textDark }}>{line}</span>
                </div>
              ))}
            </div>
          ))}

          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ display: "flex", gap: 12 }}>
              {array.map((val, i) => {
                const isCurrent = i === step.currentIdx;
                return (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 54, height: 54, 
                      background: isCurrent ? "rgba(88,166,255,0.1)" : COLORS.surface,
                      border: `2px solid ${isCurrent ? COLORS.blue : COLORS.border}`,
                      borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 20, fontWeight: 700, color: COLORS.textWhite,
                      transition: "all 0.3s"
                    }}>{val}</div>
                    <div style={{ fontSize: 9, color: COLORS.textDark }}>{isCurrent ? "ADD" : `idx ${i}`}</div>
                  </div>
                );
          })}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

const btnStyle = { background: COLORS.borderLighter, border: `1px solid ${COLORS.border}`, color: COLORS.textWhite, padding: "6px 14px", borderRadius: 6, fontSize: 11, cursor: "pointer", fontFamily: "inherit" };
const ctrlBtnStyle = { width: 32, height: 32, borderRadius: 6, background: COLORS.borderLighter, border: `1px solid ${COLORS.border}`, color: COLORS.textWhite, fontSize: 14, cursor: "pointer" };
const labelStyle = { fontSize: 9, fontWeight: 800, textTransform: "uppercase", color: COLORS.textMuted, marginBottom: 8 };
