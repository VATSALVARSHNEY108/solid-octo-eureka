"use client";

import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { TheorySection } from "@/components/TheorySection";

// --- Types ---
interface Step {
  type: string;
  message: string;
  line: number | null;
  matrix: number[][];
  traversed: [number, number][];
  bounds: { top: number; bottom: number; left: number; right: number };
  current: [number, number] | null;
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
  "int top = 0, bottom = m - 1, left = 0, right = n - 1;",
  "while (top <= bottom && left <= right) {",
  "    for (int i = left; i <= right; i++) res.push(matrix[top][i]); top++;",
  "    for (int i = top; i <= bottom; i++) res.push(matrix[i][right]); right--;",
  "    if (top <= bottom) for (int i = right; i >= left; i--) res.push(matrix[bottom][i]); bottom--;",
  "    if (left <= right) for (int i = bottom; i >= top; i--) res.push(matrix[i][left]); left++;",
  "}",
];

export default function SpiralMatrixLab() {
  const [matrix, setMatrix] = useState<number[][]>([
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16]
  ]);
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
    const m = matrix.length;
    const n = matrix[0].length;
    let top = 0, bottom = m - 1, left = 0, right = n - 1;
    const traversed: [number, number][] = [];

    s.push({
      type: "init", message: "Initialize boundary pointers: top, bottom, left, right.",
      line: 0, matrix, traversed: [], bounds: { top, bottom, left, right }, current: null,
      panelData: { top, bottom, left, right }
    });

    while (top <= bottom && left <= right) {
      // Left to Right
      for (let i = left; i <= right; i++) {
        traversed.push([top, i]);
        s.push({
          type: "l2r", message: `Moving Right: [${top}, ${i}]`,
          line: 2, matrix, traversed: [...traversed], bounds: { top, bottom, left, right }, current: [top, i],
          panelData: { direction: "Right", val: matrix[top][i] }
        });
      }
      top++;
      s.push({
        type: "topInc", message: "Finished row. Increment top bound.",
        line: 2, matrix, traversed: [...traversed], bounds: { top, bottom, left, right }, current: null,
        panelData: { top, status: "top++" }
      });

      if (top > bottom || left > right) break;

      // Top to Bottom
      for (let i = top; i <= bottom; i++) {
        traversed.push([i, right]);
        s.push({
          type: "t2b", message: `Moving Down: [${i}, ${right}]`,
          line: 3, matrix, traversed: [...traversed], bounds: { top, bottom, left, right }, current: [i, right],
          panelData: { direction: "Down", val: matrix[i][right] }
        });
      }
      right--;
      s.push({
        type: "rightDec", message: "Finished column. Decrement right bound.",
        line: 3, matrix, traversed: [...traversed], bounds: { top, bottom, left, right }, current: null,
        panelData: { right, status: "right--" }
      });

      if (top > bottom || left > right) break;

      // Right to Left
      for (let i = right; i >= left; i--) {
        traversed.push([bottom, i]);
        s.push({
          type: "r2l", message: `Moving Left: [${bottom}, ${i}]`,
          line: 4, matrix, traversed: [...traversed], bounds: { top, bottom, left, right }, current: [bottom, i],
          panelData: { direction: "Left", val: matrix[bottom][i] }
        });
      }
      bottom--;
      s.push({
        type: "bottomDec", message: "Finished row. Decrement bottom bound.",
        line: 4, matrix, traversed: [...traversed], bounds: { top, bottom, left, right }, current: null,
        panelData: { bottom, status: "bottom--" }
      });

      if (top > bottom || left > right) break;

      // Bottom to Top
      for (let i = bottom; i >= top; i--) {
        traversed.push([i, left]);
        s.push({
          type: "b2t", message: `Moving Up: [${i}, ${left}]`,
          line: 5, matrix, traversed: [...traversed], bounds: { top, bottom, left, right }, current: [i, left],
          panelData: { direction: "Up", val: matrix[i][left] }
        });
      }
      left++;
      s.push({
        type: "leftInc", message: "Finished column. Increment left bound.",
        line: 5, matrix, traversed: [...traversed], bounds: { top, bottom, left, right }, current: null,
        panelData: { left, status: "left++" }
      });
    }

    s.push({
      type: "done", message: "Spiral traversal complete.",
      line: 6, matrix, traversed: [...traversed], bounds: { top, bottom, left, right }, current: null,
      panelData: { status: "Done", count: traversed.length }
    });

    return s;
  }, [matrix]);

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
        title="Spiral Matrix"
        definition="Traversing a 2D matrix in a spiral pattern, starting from the top-left and moving inwards in a clockwise direction."
        timeComplexity="O(N * M)"
        spaceComplexity="O(1) (excluding result)"
        keyPoints={[
          "Four boundary trackers",
          "Layer-by-layer traversal",
          "Boundary contraction after each row/col",
          "Handles non-square matrices"
        ]}
      />
      <div style={{
        height:"calc(100vh - 124px)", background: COLORS.bg,
        color: COLORS.textWhite, fontFamily: "'JetBrains Mono', monospace",
        display: "flex", flexDirection: "column", overflow: "hidden"
      }}>
      <div style={{ height: 48, background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", padding: "0 16px", gap: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 800, marginRight: 20 }}>SPIRAL_MATRIX_LAB</div>
        
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: COLORS.bg, padding: "4px 12px", borderRadius: 6, border: `1px solid ${COLORS.border}` }}>
          <span style={{ fontSize: 10, color: COLORS.textMuted }}>DIM:</span>
          <select 
            onChange={(e) => {
              const dim = parseInt(e.target.value);
              const newMat = Array.from({length: dim}, (_, r) => Array.from({length: dim}, (_, c) => r * dim + c + 1));
              setMatrix(newMat);
              setStepIdx(0);
              setIsPlaying(false);
            }}
            style={{ background: "transparent", border: "none", color: COLORS.textWhite, fontSize: 11, outline: "none", cursor: "pointer" }}
          >
            <option value="3">3x3</option>
            <option value="4" selected>4x4</option>
            <option value="5">5x5</option>
          </select>
        </div>

        <button style={btnStyle} onClick={reset}>Reset</button>
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

          {renderPanel("stats", "Boundaries", (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {Object.entries(step.bounds).map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                  <span style={{ color: COLORS.textMuted }}>{k.toUpperCase()}</span>
                  <span style={{ color: COLORS.orange }}>{v}</span>
                </div>
              ))}
            </div>
          ))}

          {renderPanel("logic", "Spiral Logic", (
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
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${matrix[0].length}, 50px)`, gap: 8 }}>
              {matrix.map((row, r) => row.map((val, c) => {
                const isTraversed = step.traversed.some(([tr, tc]) => tr === r && tc === c);
                const isCurrent = step.current && step.current[0] === r && step.current[1] === c;
                
                return (
                  <div key={`${r}-${c}`} style={{
                    width: 50, height: 50, 
                    background: isCurrent ? "rgba(240,136,62,0.15)" : isTraversed ? "rgba(63,185,80,0.1)" : COLORS.surface,
                    border: `1px solid ${isCurrent ? COLORS.orange : isTraversed ? COLORS.green : COLORS.border}`,
                    borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16, fontWeight: 700, color: isCurrent ? COLORS.orange : isTraversed ? COLORS.green : COLORS.textWhite,
                                          }}>{val}</div>
                  );
                }))}
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
