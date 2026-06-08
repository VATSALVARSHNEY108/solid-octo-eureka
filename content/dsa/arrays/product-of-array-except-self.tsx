"use client";

import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { TheorySection } from "@/components/TheorySection";

// --- Types ---
interface Step {
  type: string;
  message: string;
  line: number | null;
  nums: number[];
  prefix: (number | null)[];
  suffix: (number | null)[];
  result: (number | null)[];
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
  "int[] res = new int[n];",
  "res[0] = 1;",
  "for (int i = 1; i < n; i++) res[i] = res[i-1] * nums[i-1];",
  "int right = 1;",
  "for (int i = n - 1; i >= 0; i--) {",
  "    res[i] *= right;",
  "    right *= nums[i];",
  "}",
];

export default function ProductOfArrayExceptSelfLab() {
  const [nums, setNums] = useState<number[]>([1, 2, 3, 4]);
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  
  const [panels, setPanels] = useState({
    logic: { x: 50, y: 400 },
    math: { x: 550, y: 100 },
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const panelDrag = useRef<{ panel: string; ox: number; oy: number; sx: number; sy: number } | null>(null);

  const steps = useMemo<Step[]>(() => {
    const s: Step[] = [];
    const n = nums.length;
    const prefix = new Array(n).fill(null);
    const suffix = new Array(n).fill(null);
    const result = new Array(n).fill(null);

    s.push({
      type: "init", message: "Goal: Calculate product of all elements except current, without using division.",
      line: 0, nums: [...nums], prefix: [...prefix], suffix: [...suffix], result: [...result], currentIdx: null,
      panelData: { status: "Init" }
    });

    // Pass 1: Prefix
    prefix[0] = 1;
    s.push({
      type: "prefix_init", message: "Initialize prefix[0] = 1 (nothing to the left).",
      line: 1, nums: [...nums], prefix: [...prefix], suffix: [...suffix], result: [...result], currentIdx: 0,
      panelData: { val: 1 }
    });

    for (let i = 1; i < n; i++) {
      prefix[i] = prefix[i - 1] * nums[i - 1];
      s.push({
        type: "prefix", message: `prefix[${i}] = prefix[${i-1}] * nums[${i-1}] = ${prefix[i]}.`,
        line: 2, nums: [...nums], prefix: [...prefix], suffix: [...suffix], result: [...result], currentIdx: i,
        panelData: { val: prefix[i] }
      });
    }

    // Pass 2: Suffix
    suffix[n - 1] = 1;
    s.push({
      type: "suffix_init", message: "Initialize suffix[n-1] = 1 (nothing to the right).",
      line: 3, nums: [...nums], prefix: [...prefix], suffix: [...suffix], result: [...result], currentIdx: n - 1,
      panelData: { val: 1 }
    });

    for (let i = n - 2; i >= 0; i--) {
      suffix[i] = suffix[i + 1] * nums[i + 1];
      s.push({
        type: "suffix", message: `suffix[${i}] = suffix[${i+1}] * nums[${i+1}] = ${suffix[i]}.`,
        line: 4, nums: [...nums], prefix: [...prefix], suffix: [...suffix], result: [...result], currentIdx: i,
        panelData: { val: suffix[i] }
      });
    }

    // Final result
    for (let i = 0; i < n; i++) {
      result[i] = prefix[i] * suffix[i];
      s.push({
        type: "result", message: `result[${i}] = prefix[${i}] * suffix[${i}] = ${result[i]}.`,
        line: 5, nums: [...nums], prefix: [...prefix], suffix: [...suffix], result: [...result], currentIdx: i,
        panelData: { res: result[i] }
      });
    }

    s.push({
      type: "done", message: "Result complete. Each element is the product of all others.",
      line: null, nums: [...nums], prefix: [...prefix], suffix: [...suffix], result: [...result], currentIdx: null,
      panelData: { status: "Done" }
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
        position: 'absolute', left: pos.x, top: pos.y, width: 240,
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

  const renderRow = (title: string, data: (number | null)[], isActiveRow: boolean, activeIdx: number | null, color: string) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
       <div style={labelStyle}>{title}</div>
       <div style={{ display: "flex", gap: 12 }}>
          {data.map((val, idx) => (
            <div key={idx} style={{
                width: 50, height: 50, 
                background: isActiveRow && activeIdx === idx ? `${color}22` : COLORS.surface,
                border: `1px solid ${isActiveRow && activeIdx === idx ? color : COLORS.border}`,
                borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 700, color: val === null ? COLORS.textDark : COLORS.textWhite,
                transition: "all 0.2s"
            }}>{val ?? "?"}</div>
          ))}
       </div>
    </div>
  );

  return (
    <div style={{ width: "100vw", height:"calc(100vh - 124px)", overflowY: "auto", background: COLORS.bg, scrollbarWidth: "none" }}>
      <TheorySection 
        title="Product of Array Except Self"
        definition="Given an array of integers, return an array such that each element is the product of all elements of the array except itself. Crucially, this must be solved without using the division operator."
        timeComplexity="O(N)"
        spaceComplexity="O(N)"
        keyPoints={[
          "Calculate prefix products",
          "Calculate suffix products",
          "Result[i] = Prefix[i] * Suffix[i]",
          "Division-free approach is more robust"
        ]}
      />
      <div style={{
        height:"calc(100vh - 124px)", background: COLORS.bg,
        color: COLORS.textWhite, fontFamily: "'JetBrains Mono', monospace",
        display: "flex", flexDirection: "column", overflow: "hidden"
      }}>
      <div style={{ height: 48, background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", padding: "0 16px", gap: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 800, marginRight: 20 }}>PRODUCT_EXCEPT_SELF_LAB</div>
        
        <input 
          type="text" 
          placeholder="1, 2, 3, 4..." 
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const val = (e.target as HTMLInputElement).value;
              const newArr = val.split(",").map(Number).filter(x => !isNaN(x));
              if (newArr.length > 0) setNums(newArr);
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

          {renderPanel("math", "Math Tracker", (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
               <div style={{ fontSize: 11, color: COLORS.textMuted }}>
                 {step.type === "prefix" && `prefix[i] = prefix[i-1] * nums[i-1]`}
                 {step.type === "suffix" && `suffix[i] = suffix[i+1] * nums[i+1]`}
                 {step.type === "result" && `res[i] = prefix[i] * suffix[i]`}
               </div>
            </div>
          ))}

          {renderPanel("logic", "Double Pass Logic", (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {CODE.map((line, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '2px 8px', borderRadius: 4, background: step.line === i ? 'rgba(88,166,255,0.1)' : 'transparent', borderLeft: step.line === i ? `2px solid ${COLORS.blue}` : '2px solid transparent' }}>
                  <span style={{ fontSize: 10, color: COLORS.textDark, minWidth: 16 }}>{i + 1}</span>
                  <span style={{ fontSize: 11, color: step.line === i ? COLORS.textWhite : COLORS.textDark }}>{line}</span>
                </div>
              ))}
            </div>
          ))}

          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30 }}>
            {renderRow("Original Array", step.nums.map(x => x), true, step.currentIdx, COLORS.textWhite)}
            <div style={{ height: 2, width: "60%", background: COLORS.border }} />
            {renderRow("Prefix Products (Left)", step.prefix, step.type.startsWith("prefix"), step.currentIdx, COLORS.blue)}
            {renderRow("Suffix Products (Right)", step.suffix, step.type.startsWith("suffix"), step.currentIdx, COLORS.orange)}
            <div style={{ height: 2, width: "60%", background: COLORS.border }} />
            {renderRow("Final Result Array", step.result, step.type === "result", step.currentIdx, COLORS.green)}
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
