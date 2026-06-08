"use client";

import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { TheorySection } from "@/components/TheorySection";

// --- Types ---
interface Step {
  type: string;
  message: string;
  line: number | null;
  nums: number[];
  i: number | null;
  leftSum: number;
  rightSum: number;
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
  "int total = sum(nums);",
  "int left = 0;",
  "for (int i = 0; i < n; i++) {",
  "    int right = total - left - nums[i];",
  "    if (left == right) return i;",
  "    left += nums[i];",
  "}",
  "return -1;",
];

export default function EquilibriumIndexLab() {
  const [nums, setNums] = useState<number[]>([1, 7, 3, 6, 5, 6]);
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  
  const [panels, setPanels] = useState({
    logic: { x: 50, y: 400 },
    sums: { x: 550, y: 100 },
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const panelDrag = useRef<{ panel: string; ox: number; oy: number; sx: number; sy: number } | null>(null);

  const steps = useMemo<Step[]>(() => {
    const s: Step[] = [];
    const total = nums.reduce((a, b) => a + b, 0);
    let left = 0;

    s.push({
      type: "init", message: `Calculate total sum of array: ${total}. Initialize left sum = 0.`,
      line: 0, nums: [...nums], i: null, leftSum: 0, rightSum: total,
      panelData: { total }
    });

    for (let i = 0; i < nums.length; i++) {
      const right = total - left - nums[i];
      
      s.push({
        type: "check", message: `Checking index ${i} (${nums[i]}). Left Sum: ${left}, Right Sum: ${right}.`,
        line: 3, nums: [...nums], i, leftSum: left, rightSum: right,
        panelData: { left, right, current: nums[i], match: left === right }
      });

      if (left === right) {
        s.push({
          type: "found", message: `Equilibrium point found at index ${i}! Both sides sum to ${left}.`,
          line: 4, nums: [...nums], i, leftSum: left, rightSum: right,
          panelData: { status: "Found", index: i }
        });
        return s;
      }

      left += nums[i];
      s.push({
        type: "update_left", message: `Moving to next index. Adding ${nums[i]} to left sum.`,
        line: 5, nums: [...nums], i, leftSum: left, rightSum: right,
        panelData: { newLeft: left }
      });
    }

    s.push({
      type: "not_found", message: "Finished scan. No equilibrium point exists.",
      line: 7, nums: [...nums], i: null, leftSum: left, rightSum: 0,
      panelData: { status: "Not Found" }
    });

    return s;
  }, [nums]);

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
        title="Equilibrium Index"
        definition="An equilibrium index of an array is an index such that the sum of elements at lower indexes is equal to the sum of elements at higher indexes."
        timeComplexity="O(N)"
        spaceComplexity="O(1)"
        keyPoints={[
          "Calculate total sum first",
          "Track left sum while iterating",
          "Right sum = total - left - current",
          "Efficient linear scan approach"
        ]}
      />
      <div style={{
        height:"calc(100vh - 124px)", background: COLORS.bg,
        color: COLORS.textWhite, fontFamily: "'JetBrains Mono', monospace",
        display: "flex", flexDirection: "column", overflow: "hidden"
      }}>
      <div style={{ height: 48, background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", padding: "0 16px", gap: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 800, marginRight: 20 }}>EQUILIBRIUM_LAB</div>
        
        <input 
          type="text" 
          placeholder="1, 7, 3, 6, 5, 6..." 
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const val = (e.target as HTMLInputElement).value;
              const newArr = val.split(",").map(x => parseInt(x.trim())).filter(x => !isNaN(x));
              if (newArr.length > 0) { setNums(newArr); setStepIdx(0); setIsPlaying(false); }
            }
          }}
          style={{ 
            background: COLORS.bg, border: `1px solid ${COLORS.border}`, color: COLORS.textWhite, 
            fontSize: 11, outline: "none", width: 220, fontFamily: "inherit", padding: "4px 10px", borderRadius: 6
          }} 
        />

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

          {renderPanel("sums", "Sum Monitor", (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
               <div style={{ background: "rgba(88,166,255,0.05)", padding: 8, borderRadius: 6 }}>
                  <div style={labelStyle}>Left Sum</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.blue }}>{step.leftSum}</div>
               </div>
               <div style={{ background: "rgba(240,136,62,0.05)", padding: 8, borderRadius: 6 }}>
                  <div style={labelStyle}>Right Sum</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.orange }}>{step.rightSum}</div>
               </div>
               <div style={{ textAlign: "center", fontSize: 10, color: step.leftSum === step.rightSum ? COLORS.green : COLORS.red }}>
                 {step.leftSum === step.rightSum ? "MATCH!" : "NO MATCH"}
               </div>
            </div>
          ))}

          {renderPanel("logic", "Scanning Logic", (
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
            <div style={{ display: "flex", gap: 8 }}>
              {step.nums.map((val, idx) => {
                const isI = idx === step.i;
                const isLeft = step.i !== null && idx < step.i;
                const isRight = step.i !== null && idx > step.i;
                return (
                  <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 50, height: 60, 
                      background: isI ? "rgba(63,185,80,0.15)" : isLeft ? "rgba(88,166,255,0.05)" : isRight ? "rgba(240,136,62,0.05)" : COLORS.surface,
                      border: `1px solid ${isI ? COLORS.green : isLeft ? COLORS.blue : isRight ? COLORS.orange : COLORS.border}`,
                      borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 16, fontWeight: 700, color: COLORS.textWhite,
                      transition: "all 0.3s"
                    }}>{val}</div>
                    <div style={{ fontSize: 9, color: COLORS.textDark }}>{isI ? "EQ?" : `[${idx}]`}</div>
                  </div>
                );
          })}
            </div>
            
            <div style={{ display: "flex", gap: 100, alignItems: "center" }}>
               <div style={{ textAlign: "center" }}>
                  <div style={labelStyle}>Σ Left</div>
                  <div style={{ width: 80, height: 40, border: `1px dashed ${COLORS.blue}`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: COLORS.blue }}>{step.leftSum}</div>
               </div>
               <div style={{ fontSize: 24, color: COLORS.textDark }}>{step.leftSum === step.rightSum ? "==" : "!="}</div>
               <div style={{ textAlign: "center" }}>
                  <div style={labelStyle}>Σ Right</div>
                  <div style={{ width: 80, height: 40, border: `1px dashed ${COLORS.orange}`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: COLORS.orange }}>{step.rightSum}</div>
               </div>
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
