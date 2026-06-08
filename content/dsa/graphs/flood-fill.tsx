"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Info, Zap, Palette, Pipette, MousePointer2, Activity } from "lucide-react";

interface FloodStep {
  grid: number[][];
  visited: boolean[][];
  r?: number;
  c?: number;
  message: string;
  depth: number;
  stack: string[];
}

const ROWS = 8;
const COLS = 10;

// 0: Empty, 1: Wall/Border, 2: Target Area, 3: Filled
const INITIAL_GRID = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 1, 0, 0, 0, 0, 1],
  [1, 2, 2, 2, 1, 0, 1, 1, 0, 1],
  [1, 2, 2, 2, 1, 0, 1, 1, 0, 1],
  [1, 1, 1, 1, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 1, 1, 1],
  [1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

function generateFloodSteps(initialGrid: number[][], startR: number, startC: number): FloodStep[] {
  const grid = initialGrid.map(row => [...row]);
  const rows = grid.length;
  const cols = grid[0].length;
  
  if (startR < 0 || startR >= rows || startC < 0 || startC >= cols) return [];

  const targetValue = grid[startR][startC];
  const replacementValue = 3;
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const steps: FloodStep[] = [];
  const currentStack: string[] = [];

  steps.push({
    grid: grid.map(r => [...r]),
    visited: visited.map(r => [...r]),
    message: `Ready to start the flood fill operation from (${startR}, ${startC}).`,
    depth: 0,
    stack: []
  });

  if (targetValue === replacementValue) return steps;

  function fill(r: number, c: number, d: number) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;
    if (grid[r][c] !== targetValue || visited[r][c]) return;

    visited[r][c] = true;
    grid[r][c] = replacementValue;
    currentStack.push(`(${r}, ${c})`);

    steps.push({
      grid: grid.map(row => [...row]),
      visited: visited.map(row => [...row]),
      r, c,
      message: `Filling cell [${r}, ${c}]. Checking adjacent neighbors.`,
      depth: d,
      stack: [...currentStack]
    });

    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (const [dr, dc] of dirs) {
      fill(r + dr, c + dc, d + 1);
    }

    currentStack.pop();
    steps.push({
      grid: grid.map(row => [...row]),
      visited: visited.map(row => [...row]),
      r, c,
      message: `Finished processing [${r}, ${c}]. Backtracking stack.`,
      depth: d,
      stack: [...currentStack]
    });
  }

  fill(startR, startC, 0);

  steps.push({
    grid: grid.map(row => [...row]),
    visited: visited.map(row => [...row]),
    message: "Flood fill operation completed successfully.",
    depth: 0,
    stack: []
  });

  return steps;
}

export default function FloodFillSimulation() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";
  
  const [grid, setGrid] = useState<number[][]>(INITIAL_GRID);
  const [startPoint, setStartPoint] = useState({ r: 1, c: 1 });
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const steps = useMemo(() => generateFloodSteps(grid, startPoint.r, startPoint.c), [grid, startPoint]);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || (steps.length ? steps[0] : { grid, visited: [], message: "Select a point to start.", depth: 0, stack: [] });

  useEffect(() => {
    let timer: number;
    if (playing && stepIndex < steps.length - 1) {
      timer = window.setInterval(() => setStepIndex(s => s + 1), 2100 - speed);
    } else if (stepIndex >= steps.length - 1) {
      setPlaying(false);
    }
    return () => clearInterval(timer);
  }, [playing, stepIndex, steps.length, speed]);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.1;
    window.speechSynthesis.speak(utter);
  }, []);

  useEffect(() => {
    if (isSpeechEnabled && step) speak(step.message);
  }, [step, isSpeechEnabled, speak]);

  const handleCellClick = (r: number, c: number) => {
    if (playing) return;
    if (isEditMode) {
      const newGrid = grid.map((row, ri) => 
        ri === r ? row.map((cell, ci) => ci === c ? (cell + 1) % 3 : cell) : [...row]
      );
      setGrid(newGrid);
      setStepIndex(0);
    } else {
      setStartPoint({ r, c });
      setStepIndex(0);
    }
  };

  const colorMap: Record<number, string> = {
    0: "transparent",
    1: "var(--border)",
    2: "var(--amber)",
    3: "var(--green)",
  };

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Graph Algorithms • Grid Traversal</span>
          <h1>Flood Fill Algorithm</h1>
          <p className="description">
            The <strong>Flood Fill</strong> algorithm identifies and changes the color of a connected region in a multi-dimensional array. 
            It's the foundation for "Paint Bucket" tools and area detection in computer vision.
          </p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(N × M)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(N × M)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Launch Simulator</a></div>
        </div>
      </section>

      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card">
            <h2>Connectivity</h2>
            <p>The algorithm spreads through 4-directional or 8-directional neighbors that share the same initial property.</p>
          </article>
          <article className="guide-card">
            <h2>Recursion Stack</h2>
            <p>Typically implemented via DFS, each call handles one pixel and triggers neighbors until a boundary is hit.</p>
          </article>
          <article className="guide-card highlight">
            <h2>Base Cases</h2>
            <p>Crucial for preventing infinite loops: check if the cell is out of bounds or already colored with the replacement.</p>
          </article>
          <article className="guide-card">
            <h2>Alternative: BFS</h2>
            <p>Flood fill can also be implemented using a Queue (BFS), which spreads in levels rather than deep paths.</p>
          </article>
        </div>
      </section>

      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="mode-toggle">
                <button className={!isEditMode ? "active" : ""} onClick={() => setIsEditMode(false)}><Pipette size={16} /> Fill Mode</button>
                <button className={isEditMode ? "active" : ""} onClick={() => setIsEditMode(true)}><Palette size={16} /> Edit Mode</button>
              </div>
              <div className="status-panel">
                <h2>Current Step</h2>
                <p className="status-msg">{step.message}</p>
                <div className="playback-controls">
                  <button onClick={() => { setStepIndex(0); setPlaying(false); }} className="secondary"><RotateCcw size={16} /></button>
                  <button onClick={() => setStepIndex(i => Math.max(0, i - 1))} className="secondary"><ChevronLeft size={20} /></button>
                  <button onClick={() => setPlaying(!playing)} className="play-btn">{playing ? <Pause size={20} /> : <Play size={20} />}</button>
                  <button onClick={() => setStepIndex(i => Math.min(steps.length - 1, i + 1))} className="secondary"><ChevronRight size={20} /></button>
                  <button onClick={() => setIsSpeechEnabled(!isSpeechEnabled)} className={isSpeechEnabled ? "secondary active" : "secondary"}>{isSpeechEnabled ? "🔊" : "🔇"}</button>
                </div>
                <div className="speed-ctrl">
                  <span>Speed</span>
                  <input type="range" min="100" max="2000" step="100" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} />
                </div>
                <div className="stats-box">
                    <div className="stat-item">
                        <span className="stat-label">Stack Depth</span>
                        <span className="stat-value">{step.depth}</span>
                    </div>
                </div>
                <button className="reset-btn" onClick={() => { setGrid(INITIAL_GRID); setStartPoint({ r: 1, c: 1 }); setStepIndex(0); setPlaying(false); }}>Reset Grid</button>
              </div>
            </aside>

            <div className="canvas-area">
              <div className="grid-canvas">
                {step.grid.map((row, r) => (
                  <div key={r} className="grid-row">
                    {row.map((val, c) => {
                      const isCurrent = step.r === r && step.c === c;
                      const isVisited = step.visited?.[r]?.[c];
                      const isStart = startPoint.r === r && startPoint.c === c;
                      return (
                        <div key={`${r}-${c}`} 
                          className={`grid-cell type-${val} ${isCurrent ? 'active' : ''} ${isVisited ? 'visited' : ''} ${isStart && !isVisited ? 'start' : ''}`}
                          style={{ backgroundColor: isVisited ? colorMap[3] : colorMap[val] }}
                          onClick={() => handleCellClick(r, c)}
                        >
                          {isCurrent && <div className="target-pulse" />}
                          {isStart && !isVisited && <div className="start-indicator">⌖</div>}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="gesture-hint-canvas">
                {isEditMode ? "🖱️ Click cells to cycle between states" : "🖱️ Click a cell to set start point"}
              </div>
            </div>
            
            <div className="stack-container">
               <div className="panel-header">
                  <span>Recursion Stack</span>
               </div>
               <div className="stack-viz">
                  {[...step.stack].reverse().map((id, idx) => (
                    <div key={idx} className="stack-item">{id}</div>
                  ))}
                  {step.stack.length === 0 && <span className="empty-msg">Empty</span>}
               </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .page { --bg: #0a0d14; --panel: #111827; --panel2: #172033; --border: #2b3447; --text: #e5e7eb; --muted: #98a2b3; --blue: #4f7ef8; --green: #35c486; --amber: #f5a623; --red: #ef4444; min-height: 100vh; background: var(--bg); color: var(--text); font-family: 'Inter', system-ui, sans-serif; }
        .page[data-theme="light"] { --bg: #f7f9fc; --panel: #ffffff; --panel2: #edf2f7; --border: #d7deea; --text: #172033; --muted: #526174; --blue: #285bd6; --green: #087f5b; --amber: #b76705; --red: #c92a2a; }
        
        .hero { padding: 120px 24px 80px; background: radial-gradient(circle at 10% 20%, #4f7ef810, transparent 40%), var(--bg); border-bottom: 1px solid var(--border); text-align: center; }
        .hero h1 { margin: 16px 0; font-size: clamp(40px, 8vw, 72px); font-weight: 800; letter-spacing: -0.04em; line-height: 1.1; background: linear-gradient(to bottom right, var(--text), var(--muted)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .eyebrow { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.2em; color: var(--blue); }
        .content-width { max-width: 1200px; margin: 0 auto; }
        .description { font-size: 19px; max-width: 800px; margin: 24px auto 40px; line-height: 1.6; color: var(--muted); }
        .complexity-tag-group { display: flex; justify-content: center; gap: 16px; margin-bottom: 48px; }
        .complexity-tag { background: var(--panel); border: 1px solid var(--border); padding: 12px 20px; border-radius: 12px; display: flex; flex-direction: column; gap: 4px; }
        .complexity-tag .label { font-size: 11px; text-transform: uppercase; color: var(--muted); }
        .complexity-tag .value { font-size: 20px; font-weight: 700; color: var(--blue); font-family: monospace; }

        .detailed-guide { max-width: 1120px; margin: 0 auto; padding: 80px 24px; }
        .guide-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 40px; }
        .guide-card { background: var(--panel); border: 1px solid var(--border); border-radius: 16px; padding: 48px; }
        .guide-card h2 { font-size: 18px; margin-bottom: 16px; font-weight: 700; }
        .guide-card p { font-size: 14px; line-height: 1.7; color: var(--muted); }
        .guide-card.highlight { border-bottom: 4px solid var(--green); }

        .simulator { padding: 60px 24px 100px; border-top: 1px solid var(--border); }
        .workspace { display: grid; grid-template-columns: 320px 1fr 200px; gap: 40px; max-width: 1300px; margin: 0 auto; background: var(--panel); padding: 40px; border: 1px solid var(--border); border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
        
        aside { display: flex; flex-direction: column; gap: 20px; }
        .mode-toggle { display: flex; gap: 4px; background: var(--bg); padding: 4px; border-radius: 10px; border: 1px solid var(--border); }
        .mode-toggle button { flex: 1; height: 32px; font-size: 11px; font-weight: 700; border: none; background: transparent; border-radius: 6px; }
        .mode-toggle button.active { background: var(--panel2); color: var(--blue); box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        
        .status-panel { display: flex; flex-direction: column; gap: 16px; }
        .status-panel h2 { font-size: 12px; font-weight: 800; text-transform: uppercase; color: var(--muted); }
        .status-msg { font-size: 14px; line-height: 1.5; min-height: 60px; color: var(--text); }
        
        .playback-controls { display: flex; flex-wrap: wrap; gap: 8px; }
        .playback-controls button { height: 40px; min-width: 40px; display: flex; align-items: center; justify-content: center; border-radius: 10px; background: var(--bg); }
        .playback-controls button.play-btn { background: var(--blue); color: white; border: none; flex: 2; }
        .playback-controls button.active { color: var(--blue); border-color: var(--blue); }
        
        .speed-ctrl { display: flex; flex-direction: column; gap: 8px; font-size: 11px; color: var(--muted); font-weight: 700; }
        .speed-ctrl input { width: 100%; accent-color: var(--blue); }
        
        .stats-box { background: var(--bg); padding: 16px; border-radius: 14px; border: 1px solid var(--border); }
        .stat-item { display: flex; justify-content: space-between; align-items: center; }
        .stat-label { font-size: 10px; text-transform: uppercase; color: var(--muted); }
        .stat-value { font-size: 20px; font-weight: 900; color: var(--blue); }
        .reset-btn { width: 100%; height: 36px; border-radius: 8px; font-size: 11px; font-weight: 700; background: var(--bg); border-color: var(--border); }

        .canvas-area { background: color-mix(in srgb, var(--bg) 80%, transparent); border-radius: 16px; border: 1px solid var(--border); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; position: relative; }
        .grid-canvas { display: flex; flex-direction: column; gap: 4px; padding: 12px; background: var(--panel2); border-radius: 12px; border: 1px solid var(--border); }
        .grid-row { display: flex; gap: 4px; }
        .grid-cell { width: 44px; height: 44px; border-radius: 8px; border: 1px solid var(--border); transition: all 0.3s; position: relative; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .grid-cell.active { transform: scale(1.1); z-index: 10; box-shadow: 0 0 20px var(--green); border-color: white; }
        .grid-cell.visited { border-color: var(--green); }
        .grid-cell.start { border-color: var(--blue); border-width: 2px; }
        .start-indicator { font-size: 18px; color: var(--blue); font-weight: 900; }
        
        .target-pulse { position: absolute; inset: 0; border: 2px solid white; border-radius: 8px; animation: pulse 1s infinite; pointer-events: none; }
        @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.5); opacity: 0; } }

        .stack-container { display: flex; flex-direction: column; border-left: 1px solid var(--border); padding-left: 24px; }
        .stack-viz { flex: 1; display: flex; flex-direction: column; gap: 4px; overflow-y: auto; max-height: 400px; padding: 4px; }
        .stack-item { padding: 6px; background: var(--bg); border: 1px solid var(--border); border-radius: 6px; font-size: 10px; text-align: center; font-family: monospace; font-weight: 800; color: var(--blue); }
        .panel-header { font-size: 10px; font-weight: 800; text-transform: uppercase; color: var(--muted); margin-bottom: 12px; }
        .empty-msg { font-size: 11px; color: var(--muted); font-style: italic; }
        .gesture-hint-canvas { position: absolute; bottom: 12px; right: 12px; font-size: 9px; color: var(--muted); }

        .workspace > aside,
        .workspace > .inspector-panel,
        .workspace > .side-panel,
        .workspace > .control-panel,
        .workspace > .visual-panel,
        .workspace > .data-panel {
          resize: both;
          overflow: auto;
          min-width: 180px;
          min-height: 140px;
          max-width: 640px;
          max-height: 720px;
        }
        .movable-panel { cursor: grab; }
        .movable-panel:active { cursor: grabbing; }

        @media (max-width: 1200px) { .workspace { grid-template-columns: 1fr; } .stack-container { border-left: none; border-top: 1px solid var(--border); padding-left: 0; padding-top: 24px; } }
      `}</style>
    </main>
  );
}

