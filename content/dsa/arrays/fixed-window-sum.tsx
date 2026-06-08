"use client";

import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { TheorySection } from "@/components/TheorySection";

// --- Types ---
interface Step {
  type: string;
  message: string;
  line: number | null;
  nums: number[];
  windowStart: number | null;
  windowEnd: number | null;
  currentSum: number;
  maxSum: number;
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
  "int maxSum = 0, currentSum = 0;",
  "for (int i = 0; i < k; i++) currentSum += nums[i];",
  "maxSum = currentSum;",
  "for (int i = k; i < n; i++) {",
  "    currentSum += nums[i] - nums[i - k];",
  "    maxSum = Math.max(maxSum, currentSum);",
  "}",
  "return maxSum;",
];

export default function FixedWindowSumLab() {
  const [nums, setNums] = useState<number[]>([2, 1, 5, 1, 3, 2]);
  const [k, setK] = useState(3);
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
    let currentSum = 0;
    let maxSum = 0;

    // Phase 1: Initial window
    s.push({
      type: "init", message: `Goal: Find max sum of subarray of size K=${k}. Starting with first window.`,
      line: 0, nums: [...nums], windowStart: 0, windowEnd: k - 1, currentSum: 0, maxSum: 0,
      panelData: { status: "Init" }
    });

    for (let i = 0; i < k; i++) {
      currentSum += nums[i];
      s.push({
        type: "build", message: `Adding nums[${i}] (${nums[i]}) to initial window sum.`,
        line: 1, nums: [...nums], windowStart: 0, windowEnd: i, currentSum, maxSum: 0,
        panelData: { adding: nums[i] }
      });
    }
    maxSum = currentSum;
    s.push({
      type: "max", message: `Initial window sum = ${currentSum}. Set maxSum = ${maxSum}.`,
      line: 2, nums: [...nums], windowStart: 0, windowEnd: k - 1, currentSum, maxSum,
      panelData: { maxSum }
    });

    // Phase 2: Sliding
    for (let i = k; i < nums.length; i++) {
      const removed = nums[i - k];
      const added = nums[i];
      currentSum = currentSum + added - removed;
      
      s.push({
        type: "slide", message: `Slide: Subtract nums[${i - k}] (${removed}) and add nums[${i}] (${added}).`,
        line: 4, nums: [...nums], windowStart: i - k + 1, windowEnd: i, currentSum, maxSum,
        panelData: { removed, added, newSum: currentSum }
      });

      if (currentSum > maxSum) {
        maxSum = currentSum;
        s.push({
          type: "new_max", message: `Current sum ${currentSum} > ${maxSum}. Update maxSum.`,
          line: 5, nums: [...nums], windowStart: i - k + 1, windowEnd: i, currentSum, maxSum,
          panelData: { newMax: maxSum }
        });
      }
    }

    s.push({
      type: "done", message: `Scan complete. Maximum window sum of size ${k} is ${maxSum}.`,
      line: 7, nums: [...nums], windowStart: null, windowEnd: null, currentSum: 0, maxSum,
      panelData: { result: maxSum }
    });

    return s;
  }, [nums, k]);

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
        title="Fixed Window Sum"
        definition="The Sliding Window technique is used to find the maximum sum of any contiguous subarray of size K."
        timeComplexity="O(N)"
        spaceComplexity="O(1)"
        keyPoints={[
          "Initial window of size K",
          "Slide window by adding one and removing one",
          "Constant time updates (O(1) per slide)",
          "Optimal for contiguous subproblems"
        ]}
      />
      <div style={{
        height:"calc(100vh - 124px)", background: COLORS.bg,
        color: COLORS.textWhite, fontFamily: "'JetBrains Mono', monospace",
        display: "flex", flexDirection: "column", overflow: "hidden"
      }}>
      <div style={{ height: 48, background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", padding: "0 16px", gap: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 800, marginRight: 20 }}>WINDOW_SUM_LAB</div>
        
        <div style={{ display: "flex", gap: 8 }}>
            <input 
            type="text" 
            placeholder="2, 1, 5, 1, 3, 2..." 
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                const val = (e.target as HTMLInputElement).value;
                const newArr = val.split(",").map(x => parseInt(x.trim())).filter(x => !isNaN(x));
                if (newArr.length > 0) setNums(newArr);
                }
            }}
            style={{ 
                background: COLORS.bg, border: `1px solid ${COLORS.border}`, color: COLORS.textWhite, 
                fontSize: 11, outline: "none", width: 140, fontFamily: "inherit", padding: "4px 10px", borderRadius: 6
            }} 
            />
            <input 
            type="number" 
            placeholder="K" 
            value={k}
            onChange={e => setK(parseInt(e.target.value))}
            style={{ 
                background: COLORS.bg, border: `1px solid ${COLORS.border}`, color: COLORS.textWhite, 
                fontSize: 11, outline: "none", width: 50, fontFamily: "inherit", padding: "4px 10px", borderRadius: 6
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
        </div>

        <div style={{ flex: 1, position: "relative" }}>
          <svg style={{ position: "absolute", width: "100%", height: "100%", pointerEvents: "none" }}>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/></pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {renderPanel("stats", "Window Monitor", (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
               <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                  <span style={{ color: COLORS.textMuted }}>Current Sum</span>
                  <span style={{ color: COLORS.blue, fontWeight: 700 }}>{step.currentSum}</span>
               </div>
               <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                  <span style={{ color: COLORS.textMuted }}>Max Sum</span>
                  <span style={{ color: COLORS.green, fontWeight: 800 }}>{step.maxSum}</span>
               </div>
               <div style={{ height: 1, background: COLORS.border }} />
               <div style={{ fontSize: 10, color: COLORS.textDark }}>
                 K = {k} | Range: [{step.windowStart ?? "?"} to {step.windowEnd ?? "?"}]
               </div>
            </div>
          ))}

          {renderPanel("logic", "Sliding Logic", (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {CODE.map((line, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '2px 8px', borderRadius: 4, background: step.line === i ? 'rgba(88,166,255,0.1)' : 'transparent', borderLeft: step.line === i ? `2px solid ${COLORS.blue}` : '2px solid transparent' }}>
                  <span style={{ fontSize: 10, color: COLORS.textDark, minWidth: 16 }}>{i + 1}</span>
                  <span style={{ fontSize: 11, color: step.line === i ? COLORS.textWhite : COLORS.textDark }}>{line}</span>
                </div>
              ))}
            </div>
          ))}

          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 80 }}>
            <div style={{ display: "flex", gap: 8, position: "relative" }}>
              {step.nums.map((val, idx) => {
                const isInWindow = step.windowStart !== null && step.windowEnd !== null && idx >= step.windowStart && idx <= step.windowEnd;
                return (
                  <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 54, height: 64, 
                      background: isInWindow ? "rgba(88,166,255,0.15)" : COLORS.surface,
                      border: `1px solid ${isInWindow ? COLORS.blue : COLORS.border}`,
                      borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 18, fontWeight: 700, color: COLORS.textWhite,
                      transition: "all 0.3s"
                    }}>{val}</div>
                    <div style={{ fontSize: 9, color: COLORS.textDark }}>[{idx}]</div>
                  </div>
                );
          })}
              
              {/* Overlay Window Highlight */}
              {step.windowStart !== null && (
                 <div style={{
                    position: "absolute", 
                    left: step.windowStart * (54 + 8) - 4,
                    top: -4,
                    width: (step.windowEnd! - step.windowStart! + 1) * (54 + 8) - 4,
                    height: 64 + 8,
                    border: `2px solid ${COLORS.blue}`,
                    borderRadius: 10,
                    pointerEvents: "none",
                    transition: "all 0.3s",
                    boxShadow: `0 0 20px ${COLORS.blue}22`
                 }} />
              )}
            </div>
            
            <div style={{ textAlign: "center" }}>
               <div style={labelStyle}>Current Window Sum</div>
               <div style={{ fontSize: 48, fontWeight: 900, color: COLORS.blue, textShadow: `0 0 20px ${COLORS.blue}44` }}>{step.currentSum}</div>
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
