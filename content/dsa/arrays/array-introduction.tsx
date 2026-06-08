"use client";

import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { TheorySection } from "@/components/TheorySection";

// --- Types ---
interface Step {
  type: string;
  message: string;
  line: number | null;
  array: (number | null)[];
  highlightIdx: number | null;
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
  "// Initialize an array of size 5",
  "int arr[5] = {10, 20, 30, 40, 50};",
  "// Accessing element at index 2",
  "int value = arr[2]; // value is 30",
  "// Arrays are contiguous in memory",
];

export default function ArrayIntroductionLab() {
  // --- State ---
  const [array, setArray] = useState<(number | null)[]>([10, 20, 30, 40, 50]);
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  
  // Panel Positions
  const [panels, setPanels] = useState({
    logic: { x: 50, y: 400 },
    info: { x: 500, y: 100 },
    memory: { x: 50, y: 100 },
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const panelDrag = useRef<{ panel: string; ox: number; oy: number; sx: number; sy: number } | null>(null);

  // --- Step Generation ---
  const steps = useMemo<Step[]>(() => [
    {
      type: "init",
      message: "An array is a collection of elements stored at contiguous memory locations.",
      line: 0,
      array: [10, 20, 30, 40, 50],
      highlightIdx: null,
      panelData: { size: 5, type: "Static", address: "0x7ffee3" }
    },
    {
      type: "declaration",
      message: "Declaring arr[5] allocates 5 * sizeof(int) bytes in memory.",
      line: 1,
      array: [10, 20, 30, 40, 50],
      highlightIdx: null,
      panelData: { size: 5, type: "Static", address: "0x7ffee3" }
    },
    {
      type: "access",
      message: "Accessing index 2: The CPU calculates Address + (2 * Size).",
      line: 3,
      array: [10, 20, 30, 40, 50],
      highlightIdx: 2,
      panelData: { index: 2, value: 30, offset: "8 bytes" }
    },
    {
      type: "done",
      message: "Arrays provide O(1) random access time.",
      line: 4,
      array: [10, 20, 30, 40, 50],
      highlightIdx: null,
      panelData: { complexity: "O(1)", search: "O(n)" }
    },
  ], []);

  const step = steps[Math.min(stepIdx, steps.length - 1)];

  // --- Handlers ---
  const next = useCallback(() => setStepIdx(p => Math.min(p + 1, steps.length - 1)), [steps.length]);
  const prev = useCallback(() => setStepIdx(p => Math.max(0, p - 1)), []);
  const reset = useCallback(() => { setStepIdx(0); setIsPlaying(false); }, []);

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setStepIdx(p => {
        if (p >= steps.length - 1) { setIsPlaying(false); return p; }
        return p + 1;
      });
    }, speed);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, speed, steps.length]);

  // --- Panel Dragging ---
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!panelDrag.current) return;
      const { panel, ox, oy, sx, sy } = panelDrag.current;
      const dx = e.clientX - ox;
      const dy = e.clientY - oy;
      setPanels(prev => ({
        ...prev,
        [panel]: { x: sx + dx, y: sy + dy }
      }));
    };
    const handleMouseUp = () => { panelDrag.current = null; };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const startPanelDrag = (panel: string, e: React.MouseEvent) => {
    panelDrag.current = {
      panel,
      ox: e.clientX,
      oy: e.clientY,
      sx: (panels as any)[panel].x,
      sy: (panels as any)[panel].y
    };
    e.stopPropagation();
  };

  // --- Render Helpers ---
  const renderPanel = (id: string, title: string, content: React.ReactNode) => {
    const pos = (panels as any)[id];
    return (
      <div style={{
        position: 'absolute', left: pos.x, top: pos.y, width: 280,
        background: 'rgba(22,27,34,0.92)', border: `1px solid ${COLORS.border}`,
        borderRadius: 10, backdropFilter: 'blur(8px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)', userSelect: 'none',
        zIndex: 100
      }}>
        <div onMouseDown={(e) => startPanelDrag(id, e)} style={{
          cursor: 'grab', padding: '8px 12px', background: COLORS.border,
          fontSize: 10, fontWeight: 700, letterSpacing: '.12em',
          textTransform: 'uppercase', color: COLORS.textMuted,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderTopLeftRadius: 9, borderTopRightRadius: 9
        }}>
          {title} <span>⠿</span>
        </div>
        <div style={{ padding: '12px 14px' }}>
          {content}
        </div>
      </div>
    );
  };

  return (
    <div style={{ width: "100vw", height:"calc(100vh - 124px)", overflowY: "auto", background: COLORS.bg, scrollbarWidth: "none" }}>
      <TheorySection 
        title="Array Introduction"
        definition="A fundamental data structure that stores elements of the same type in contiguous memory locations, allowing for efficient index-based access."
        timeComplexity="Access: O(1), Search: O(N)"
        spaceComplexity="O(N) for storage"
        keyPoints={[
          "Contiguous memory allocation",
          "Fixed size (static arrays)",
          "Index-based random access",
          "Homogeneous data elements"
        ]}
      />
      <div style={{
        height:"calc(100vh - 124px)", background: COLORS.bg,
        color: COLORS.textWhite, fontFamily: "'JetBrains Mono', monospace",
        display: "flex", flexDirection: "column", overflow: "hidden"
      }}>
      {/* --- TOP TOOLBAR --- */}
      <div style={{
        height: 48, background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`,
        display: "flex", alignItems: "center", padding: "0 16px", gap: 12
      }}>
        <div style={{ fontSize: 14, fontWeight: 800, marginRight: 20 }}>ARRAY_LAB v1.0</div>
        
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: COLORS.bg, padding: "4px 12px", borderRadius: 6, border: `1px solid ${COLORS.border}` }}>
          <span style={{ fontSize: 10, color: COLORS.textMuted }}>ARRAY:</span>
          <input 
            type="text" 
            placeholder="10, 20, 30..." 
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

        <button style={buttonStyle()} onClick={() => setArray([10,20,30,40,50])}>Static Init</button>
        <button style={buttonStyle()} onClick={() => setArray(Array.from({length:5}, () => Math.floor(Math.random()*100)))}>Randomize</button>
      </div>

      <div style={{ flex: 1, display: "flex" }}>
        {/* --- LEFT SIDEBAR --- */}
        <div style={{
          width: 260, background: COLORS.surface, borderRight: `1px solid ${COLORS.border}`,
          display: "flex", flexDirection: "column", padding: 20, gap: 24
        }}>
          <div>
            <div style={labelStyle}>Hints</div>
            <div style={{ fontSize: 10, color: COLORS.textDark, lineHeight: 1.8 }}>
              • Drag panel headers to rearrange<br/>
              • Hover over elements for details<br/>
              • Use Play to watch execution
            </div>
          </div>

          <div>
            <div style={labelStyle}>Current Step</div>
            <div style={{ fontSize: 11, color: COLORS.textWhite, lineHeight: 1.5 }}>
              {step.message}
            </div>
          </div>

          <div>
            <div style={labelStyle}>Playback Controls</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={ctrlBtnStyle} onClick={reset}>↺</button>
              <button style={ctrlBtnStyle} onClick={prev}>‹</button>
              <button style={{ ...ctrlBtnStyle, background: isPlaying ? COLORS.blueDark : COLORS.borderLighter, color: isPlaying ? "white" : COLORS.textWhite }} onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? "⏸" : "▶"}
              </button>
              <button style={ctrlBtnStyle} onClick={next}>›</button>
              <button style={ctrlBtnStyle} onClick={() => setStepIdx(steps.length - 1)}>⏭</button>
            </div>
          </div>

          <div>
            <div style={labelStyle}>Speed</div>
            <input 
              type="range" min="100" max="2000" step="100" value={speed} 
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              style={{ width: "100%", accentColor: COLORS.red }} 
            />
          </div>

          <div style={{ marginTop: "auto" }}>
            <div style={{ height: 2, background: COLORS.border, borderRadius: 2 }}>
              <div style={{ 
                height: "100%", background: COLORS.blue, 
                width: `${((stepIdx + 1) / steps.length) * 100}%`,
                transition: "width 0.3s"
              }} />
            </div>
            <div style={{ textAlign: "right", fontSize: 10, marginTop: 4, color: COLORS.textDark }}>
              STEP {stepIdx + 1} / {steps.length}
            </div>
          </div>
        </div>

        {/* --- MAIN CANVAS --- */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          {/* Grid Background */}
          <svg style={{ position: "absolute", width: "100%", height: "100%", pointerEvents: "none" }}>
            <defs>
              <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Draggable Panels */}
          {renderPanel("memory", "Memory View", (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {Object.entries(step.panelData).map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                  <span style={{ color: COLORS.textMuted }}>{k.toUpperCase()}</span>
                  <span style={{ color: COLORS.blue }}>{v}</span>
                </div>
              ))}
            </div>
          ))}

          {renderPanel("info", "Data Tracker", (
            <div style={{ fontSize: 11, color: COLORS.textWhite }}>
              <div style={{ marginBottom: 8, color: COLORS.green }}>✓ ACTIVE PROCESS</div>
              <div style={{ color: COLORS.textMuted }}>{step.type.toUpperCase()}...</div>
            </div>
          ))}

          {renderPanel("logic", "Logic Tracker", (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {CODE.map((line, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 10, padding: '4px 8px', borderRadius: 4,
                  background: step.line === i ? 'rgba(88,166,255,0.1)' : 'transparent',
                  borderLeft: step.line === i ? `2px solid ${COLORS.blue}` : '2px solid transparent',
                  transition: 'background .2s'
                }}>
                  <span style={{ fontSize: 10, color: COLORS.textDark, minWidth: 16 }}>{i + 1}</span>
                  <span style={{ fontSize: 11, color: step.line === i ? COLORS.textWhite : COLORS.textDark }}>{line}</span>
                </div>
              ))}
            </div>
          ))}

          {/* Array Visualization */}
          <div style={{
            position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <div style={{ display: "flex", gap: 8 }}>
              {array.map((val, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 64, height: 64, background: step.highlightIdx === i ? "rgba(240,136,62,0.1)" : COLORS.surface,
                    border: `2px solid ${step.highlightIdx === i ? COLORS.orange : COLORS.border}`,
                    borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 20, fontWeight: 700, color: step.highlightIdx === i ? COLORS.orange : COLORS.textWhite,
                    boxShadow: step.highlightIdx === i ? `0 0 20px ${COLORS.orange}33` : "none",
                    transition: "all 0.3s"
                  }}>
                    {val}
                  </div>
                  <div style={{ fontSize: 10, color: COLORS.textDark }}>0x7f{i*4}</div>
                  <div style={{ fontSize: 12, color: COLORS.blue, fontWeight: 800 }}>[{i}]</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

// --- Styles ---
const buttonStyle = (active = false) => ({
  background: active ? COLORS.blueDark : COLORS.borderLighter,
  border: `1px solid ${active ? COLORS.blue : COLORS.borderLighter}`,
  color: active ? "white" : COLORS.textWhite,
  padding: "6px 14px",
  borderRadius: 6,
  fontSize: 11,
  cursor: "pointer",
  fontFamily: "inherit",
  transition: "all 0.2s"
});

const ctrlBtnStyle: React.CSSProperties = {
  width: 32, height: 32, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
  background: COLORS.borderLighter, border: `1px solid ${COLORS.border}`, color: COLORS.textWhite,
  fontSize: 14, cursor: "pointer", transition: "all 0.2s"
};

const labelStyle: React.CSSProperties = {
  fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".1em",
  color: COLORS.textMuted, marginBottom: 8
};
