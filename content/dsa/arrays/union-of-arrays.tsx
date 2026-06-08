"use client";

import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { TheorySection } from "@/components/TheorySection";

// --- Types ---
interface Step {
  type: string;
  message: string;
  line: number | null;
  arr1: number[];
  arr2: number[];
  i: number | null;
  j: number | null;
  union: number[];
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
  "int i = 0, j = 0;",
  "while (i < n && j < m) {",
  "    if (arr1[i] < arr2[j]) add(arr1[i++]);",
  "    else if (arr2[j] < arr1[i]) add(arr2[j++]);",
  "    else { add(arr1[i++]); j++; }",
  "}",
  "while (i < n) add(arr1[i++]);",
  "while (j < m) add(arr2[j++]);",
];

export default function UnionOfArraysLab() {
  const [arr1, setArr1] = useState<number[]>([1, 2, 4, 5, 6]);
  const [arr2, setArr2] = useState<number[]>([2, 3, 5, 7]);
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  
  const [panels, setPanels] = useState({
    logic: { x: 50, y: 400 },
    stats: { x: 550, y: 100 },
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const panelDrag = useRef<{ panel: string; ox: number; oy: number; sx: number; sy: number } | null>(null);

  const steps = useMemo<Step[]>(() => {
    const s: Step[] = [];
    let i = 0, j = 0;
    const union: number[] = [];

    const add = (val: number) => {
      if (union.length === 0 || union[union.length - 1] !== val) {
        union.push(val);
        return true;
      }
      return false;
    };

    s.push({
      type: "init", message: "Goal: Merge two sorted arrays into a single union set. Using two pointers.",
      line: 0, arr1: [...arr1], arr2: [...arr2], i: 0, j: 0, union: [],
      panelData: { status: "Init" }
    });

    while (i < arr1.length && j < arr2.length) {
      const v1 = arr1[i];
      const v2 = arr2[j];

      s.push({
        type: "compare", message: `Comparing arr1[${i}]=${v1} and arr2[${j}]=${v2}.`,
        line: 1, arr1: [...arr1], arr2: [...arr2], i, j, union: [...union],
        panelData: { v1, v2 }
      });

      if (v1 < v2) {
        const added = add(v1);
        s.push({
          type: "add", message: added ? `Added ${v1} from arr1 to Union.` : `${v1} already in Union. Skipping.`,
          line: 2, arr1: [...arr1], arr2: [...arr2], i, j, union: [...union],
          panelData: { added, val: v1, from: "arr1" }
        });
        i++;
      } else if (v2 < v1) {
        const added = add(v2);
        s.push({
          type: "add", message: added ? `Added ${v2} from arr2 to Union.` : `${v2} already in Union. Skipping.`,
          line: 3, arr1: [...arr1], arr2: [...arr2], i, j, union: [...union],
          panelData: { added, val: v2, from: "arr2" }
        });
        j++;
      } else {
        const added = add(v1);
        s.push({
          type: "add", message: added ? `Both are ${v1}. Added once to Union.` : `${v1} already in Union. Incrementing both pointers.`,
          line: 4, arr1: [...arr1], arr2: [...arr2], i, j, union: [...union],
          panelData: { added, val: v1, from: "both" }
        });
        i++;
        j++;
      }
    }

    while (i < arr1.length) {
      add(arr1[i]);
      s.push({
        type: "drain", message: `Draining remaining elements from arr1: ${arr1[i]}.`,
        line: 6, arr1: [...arr1], arr2: [...arr2], i, j: null, union: [...union],
        panelData: { val: arr1[i], from: "arr1" }
      });
      i++;
    }

    while (j < arr2.length) {
      add(arr2[j]);
      s.push({
        type: "drain", message: `Draining remaining elements from arr2: ${arr2[j]}.`,
        line: 7, arr1: [...arr1], arr2: [...arr2], i: null, j, union: [...union],
        panelData: { val: arr2[j], from: "arr2" }
      });
      j++;
    }

    s.push({
      type: "done", message: "Union complete. All elements unique and sorted.",
      line: null, arr1: [...arr1], arr2: [...arr2], i: null, j: null, union: [...union],
      panelData: { size: union.length }
    });

    return s;
  }, [arr1, arr2]);

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

  const renderArray = (title: string, data: number[], pointer: number | null, color: string) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={labelStyle}>{title}</div>
      <div style={{ display: "flex", gap: 8 }}>
        {data.map((val, idx) => (
          <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 44, height: 44, 
              background: idx === pointer ? `${color}22` : COLORS.surface,
              border: `1px solid ${idx === pointer ? color : COLORS.border}`,
              borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 700, color: COLORS.textWhite,
              transition: "all 0.2s"
            }}>{val}</div>
            <div style={{ fontSize: 8, color: COLORS.textDark }}>{idx === pointer ? "PTR" : `[${idx}]`}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ width: "100vw", height:"calc(100vh - 124px)", overflowY: "auto", background: COLORS.bg, scrollbarWidth: "none" }}>
      <TheorySection 
        title="Union of Two Sorted Arrays"
        definition="Given two sorted arrays, find their union. The union should contain unique elements from both arrays in sorted order."
        timeComplexity="O(N + M)"
        spaceComplexity="O(1) (excluding result array)"
        keyPoints={[
          "Use two pointers approach",
          "Handle duplicates while adding to union",
          "Efficient linear merge style scan",
          "Requires sorted input arrays"
        ]}
      />
      <div style={{
        height:"calc(100vh - 124px)", background: COLORS.bg,
        color: COLORS.textWhite, fontFamily: "'JetBrains Mono', monospace",
        display: "flex", flexDirection: "column", overflow: "hidden"
      }}>
      <div style={{ height: 48, background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", padding: "0 16px", gap: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 800, marginRight: 20 }}>UNION_LAB</div>
        
        <div style={{ display: "flex", gap: 8 }}>
            <input type="text" placeholder="1, 2, 4..." onKeyDown={e => e.key === "Enter" && setArr1((e.target as HTMLInputElement).value.split(",").map(Number))} style={inputSmallStyle} />
            <input type="text" placeholder="2, 3, 5..." onKeyDown={e => e.key === "Enter" && setArr2((e.target as HTMLInputElement).value.split(",").map(Number))} style={inputSmallStyle} />
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
        </div>

        <div style={{ flex: 1, position: "relative" }}>
          <svg style={{ position: "absolute", width: "100%", height: "100%", pointerEvents: "none" }}>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/></pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {renderPanel("stats", "Pointers Monitor", (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
               <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                  <span style={{ color: COLORS.textMuted }}>arr1[i]</span>
                  <span style={{ color: COLORS.blue, fontWeight: 700 }}>{step.i !== null ? step.arr1[step.i] : "EOF"}</span>
               </div>
               <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                  <span style={{ color: COLORS.textMuted }}>arr2[j]</span>
                  <span style={{ color: COLORS.orange, fontWeight: 700 }}>{step.j !== null ? step.arr2[step.j] : "EOF"}</span>
               </div>
            </div>
          ))}

          {renderPanel("logic", "Union Logic", (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {CODE.map((line, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '2px 8px', borderRadius: 4, background: step.line === i ? 'rgba(88,166,255,0.1)' : 'transparent', borderLeft: step.line === i ? `2px solid ${COLORS.blue}` : '2px solid transparent' }}>
                  <span style={{ fontSize: 10, color: COLORS.textDark, minWidth: 16 }}>{i + 1}</span>
                  <span style={{ fontSize: 11, color: step.line === i ? COLORS.textWhite : COLORS.textDark }}>{line}</span>
                </div>
              ))}
            </div>
          ))}

          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 60 }}>
            {renderArray("Array 1 (Sorted)", step.arr1, step.i, COLORS.blue)}
            {renderArray("Array 2 (Sorted)", step.arr2, step.j, COLORS.orange)}
            
            <div style={{ width: "80%", height: 1, background: COLORS.border, margin: "20px 0" }} />
            
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <div style={labelStyle}>Union Set (Result)</div>
              <div style={{ display: "flex", gap: 8, minHeight: 44 }}>
                {step.union.map((v, idx) => (
                  <div key={idx} style={{
                    width: 44, height: 44, background: "rgba(63,185,80,0.1)", border: `1px solid ${COLORS.green}`,
                    borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16, fontWeight: 800, color: COLORS.green,
                    animation: "pop 0.3s ease-out"
                  }}>{v}</div>
                ))}
                {step.union.length === 0 && <div style={{ color: COLORS.textDark, fontSize: 12, marginTop: 12 }}>Union is empty...</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <style jsx>{`
      @keyframes pop {
        0% { transform: scale(0.8); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
    `}</style>
  </div>
);
}

const inputSmallStyle = { background: COLORS.bg, border: `1px solid ${COLORS.border}`, color: COLORS.textWhite, fontSize: 11, outline: "none", width: 120, fontFamily: "inherit", padding: "4px 10px", borderRadius: 6 };
const btnStyle = { background: COLORS.borderLighter, border: `1px solid ${COLORS.border}`, color: COLORS.textWhite, padding: "6px 14px", borderRadius: 6, fontSize: 11, cursor: "pointer", fontFamily: "inherit" };
const ctrlBtnStyle = { width: 32, height: 32, borderRadius: 6, background: COLORS.borderLighter, border: `1px solid ${COLORS.border}`, color: COLORS.textWhite, fontSize: 14, cursor: "pointer" };
const labelStyle = { fontSize: 9, fontWeight: 800, textTransform: "uppercase", color: COLORS.textMuted, marginBottom: 8 };
