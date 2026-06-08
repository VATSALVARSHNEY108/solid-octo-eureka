"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Info, Zap, Fingerprint, Search } from "lucide-react";

interface GridCycleStep {
  grid: string[][];
  visited: boolean[][];
  r?: number;
  c?: number;
  pr?: number;
  pc?: number;
  isCycle: boolean;
  message: string;
}

const DEFAULT_ROWS = 4;
const DEFAULT_COLS = 6;

const INITIAL_GRID = [
  ["A", "A", "A", "A", "B", "B"],
  ["B", "B", "A", "B", "B", "B"],
  ["A", "A", "A", "A", "A", "B"],
  ["B", "B", "B", "B", "A", "A"],
];

function generateCycleSteps(grid: string[][]): GridCycleStep[] {
  const rows = grid.length;
  const cols = grid[0].length;
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const steps: GridCycleStep[] = [];

  steps.push({
    grid,
    visited: visited.map(r => [...r]),
    isCycle: false,
    message: "Starting Search: Looking for a path of length ≥ 4 of identical characters that returns to a visited cell."
  });

  function dfs(r: number, c: number, pr: number, pc: number, char: string): boolean {
    visited[r][c] = true;
    steps.push({
      grid,
      visited: visited.map(row => [...row]),
      r, c, pr, pc,
      isCycle: false,
      message: `Scanning '${char}' at [${r}, ${c}]. Checking neighbors...`
    });

    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === char) {
        if (nr === pr && nc === pc) continue;
        if (visited[nr][nc]) {
          steps.push({
            grid,
            visited: visited.map(row => [...row]),
            r: nr, c: nc, pr: r, pc: c,
            isCycle: true,
            message: `🎯 CYCLE DETECTED! Re-visited cell [${nr}, ${nc}] which is part of the current '${char}' component.`
          });
          return true;
        }
        if (dfs(nr, nc, r, c, char)) return true;
      }
    }
    return false;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!visited[r][c]) {
        if (dfs(r, c, -1, -1, grid[r][c])) {
          return steps;
        }
      }
    }
  }

  steps.push({
    grid,
    visited: visited.map(r => [...r]),
    isCycle: false,
    message: "Scan complete. No cycles of identical characters found in the grid."
  });

  return steps;
}

export default function GridCycleSimulation() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";
  
  const [grid, setGrid] = useState<string[][]>(INITIAL_GRID);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1100);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);

  const steps = useMemo(() => generateCycleSteps(grid), [grid]);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];

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

  const toggleCell = (r: number, c: number) => {
    if (playing) return;
    const chars = ["A", "B", "C"];
    const newGrid = grid.map((row, ri) => 
      ri === r ? row.map((cell, ci) => ci === c ? chars[(chars.indexOf(cell) + 1) % chars.length] : cell) : [...row]
    );
    setGrid(newGrid);
    setStepIndex(0);
  };

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <div className="badge">DFS Logic</div>
          <h1>Detect Cycle in Grid</h1>
          <p className="description">
            A cycle in a 2D grid consists of 4 or more cells of the <strong>same value</strong> that form a closed loop. 
            This simulation uses DFS to track the traversal path and detect re-entry points.
          </p>
          <div className="complexity-grid">
            <div className="complexity-item">
              <span className="label">Time Complexity</span>
              <span className="value">O(V + E)</span>
            </div>
            <div className="complexity-item">
              <span className="label">Constraint</span>
              <span className="value">Length ≥ 4</span>
            </div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>

      <section className="guide">
        <div className="guide-content">
          <div className="card">
            <div className="card-icon"><Fingerprint size={20} /></div>
            <h3>Parent Tracking</h3>
            <p>To detect a cycle, we must avoid immediately moving back to the cell we just came from (the parent).</p>
          </div>
          <div className="card highlight">
            <div className="card-icon"><Search size={20} /></div>
            <h3>Backtracking</h3>
            <p>If we reach a cell that is already 'visited' and is NOT the parent, we've successfully closed a loop.</p>
          </div>
        </div>
      </section>

      <section id="simulator" className="simulator">
        <div className="workspace">
          <aside className="movable-panel">
            <div className="panel-header">
              <Info size={16} />
              <h2>Analysis Panel</h2>
            </div>
            
            <div className={`status-message ${step.isCycle ? 'success' : ''}`}>
              {step.message}
            </div>

            <div className="data-section">
              <h3>Cycle Status</h3>
              <div className={`status-pill ${step.isCycle ? 'active' : ''}`}>
                {step.isCycle ? "Loop Detected" : "Searching..."}
              </div>
            </div>

            <div className="data-section">
              <h3>Editing Tools</h3>
              <p className="hint">Click cells to cycle between 'A', 'B', and 'C'.</p>
            </div>

            <div className="playback-controls">
              <div className="buttons">
                <button onClick={() => { setStepIndex(0); setPlaying(false); }} className="secondary"><RotateCcw size={16} /></button>
                <button onClick={() => setStepIndex(i => Math.max(0, i - 1))} className="secondary"><ChevronLeft size={20} /></button>
                <button onClick={() => setPlaying(!playing)} className="primary">
                  {playing ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button onClick={() => setStepIndex(i => Math.min(steps.length - 1, i + 1))} className="secondary"><ChevronRight size={20} /></button>
                <button onClick={() => setIsSpeechEnabled(!isSpeechEnabled)} className={isSpeechEnabled ? "secondary active" : "secondary"}>{isSpeechEnabled ? "🔊" : "🔇"}</button>
              </div>
              <div className="speed-slider">
                <span>Speed</span>
                <input type="range" min="100" max="2000" step="100" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} />
              </div>
              <button className="reset-btn" onClick={() => { setGrid(INITIAL_GRID); setStepIndex(0); setPlaying(false); }}>Reset Grid</button>
            </div>
          </aside>

          <div className="canvas-area">
            <div className="grid-detective">
              {step.grid.map((row, r) => (
                <div key={r} className="detective-row">
                  {row.map((char, c) => {
                    const isCurrent = step.r === r && step.c === c;
                    const isParent = step.pr === r && step.pc === c;
                    const isVisited = step.visited[r][c];
                    return (
                      <div key={`${r}-${c}`} 
                        className={`detective-cell char-${char} ${isVisited ? 'visited' : ''} ${isCurrent ? 'active' : ''} ${isParent ? 'parent' : ''}`}
                        onClick={() => toggleCell(r, c)}
                      >
                        <div className="inner">{char}</div>
                        {isCurrent && <div className="radar" />}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="gesture-hint-canvas">
               🖱️ Click cells to change character values
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .page { --bg: #0a0d14; --panel: #111827; --panel-light: #1f2937; --border: #2e3a4e; --text: #f3f4f6; --text-dim: #9ca3af; --accent: #8b5cf6; --accent-light: #a78bfa; --green: #10b981; --amber: #f59e0b; --blue: #3b82f6; --pink: #ec4899; min-height: 100vh; background: var(--bg); color: var(--text); font-family: 'Inter', system-ui, sans-serif; }
        .page[data-theme="light"] { --bg: #f8fafc; --panel: #ffffff; --panel-light: #f1f5f9; --border: #e2e8f0; --text: #0f172a; --text-dim: #64748b; --accent: #7c3aed; --accent-light: #8b5cf6; }
        
        .hero { padding: 80px 24px; text-align: center; border-bottom: 1px solid var(--border); }
        .hero .content-width { max-width: 800px; margin: 0 auto; }
        .badge { display: inline-block; padding: 4px 12px; background: color-mix(in srgb, var(--accent) 15%, transparent); color: var(--accent-light); border-radius: 99px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px; }
        .hero h1 { font-size: 56px; font-weight: 900; letter-spacing: -0.02em; margin-bottom: 24px; }
        .description { font-size: 18px; color: var(--text-dim); line-height: 1.6; margin-bottom: 40px; }
        .complexity-grid { display: flex; justify-content: center; gap: 40px; }
        .complexity-item { display: flex; flex-direction: column; align-items: center; }
        .complexity-item .label { font-size: 12px; font-weight: 600; text-transform: uppercase; color: var(--text-dim); margin-bottom: 4px; }
        .complexity-item .value { font-size: 24px; font-weight: 800; color: var(--accent-light); font-family: monospace; }

        .guide { padding: 60px 24px; background: color-mix(in srgb, var(--panel) 50%, transparent); }
        .guide-content { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
        .card { padding: 48px; background: var(--panel); border: 1px solid var(--border); border-radius: 24px; }
        .card.highlight { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 5%, var(--panel)); }
        .card-icon { width: 40px; height: 40px; border-radius: 12px; background: color-mix(in srgb, var(--accent) 15%, transparent); color: var(--accent-light); display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
        .card h3 { font-size: 20px; font-weight: 700; margin-bottom: 12px; }
        .card p { color: var(--text-dim); font-size: 14px; line-height: 1.6; }

        .simulator { padding: 60px 24px; }
        .workspace { max-width: 1400px; margin: 0 auto; display: grid; grid-template-columns: 340px 1fr; gap: 48px; background: var(--panel); padding: 48px; border-radius: 32px; border: 1px solid var(--border); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
        
        aside { display: flex; flex-direction: column; gap: 40px; }
        .panel-header { display: flex; align-items: center; gap: 12px; color: var(--text-dim); }
        .panel-header h2 { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
        .status-message { padding: 20px; background: var(--panel-light); border-radius: 16px; border: 1px solid var(--border); font-size: 14px; line-height: 1.5; color: var(--text); font-weight: 500; min-height: 80px; }
        .status-message.success { border-color: var(--green); color: var(--green); background: color-mix(in srgb, var(--green) 10%, var(--panel-light)); }
        
        .status-pill { padding: 12px; background: var(--bg); border: 1px solid var(--border); border-radius: 14px; text-align: center; font-size: 14px; font-weight: 800; color: var(--text-dim); }
        .status-pill.active { border-color: var(--green); color: var(--green); background: color-mix(in srgb, var(--green) 15%, transparent); }
        .hint { font-size: 11px; color: var(--text-dim); font-style: italic; }

        .playback-controls { margin-top: auto; padding-top: 24px; border-top: 1px solid var(--border); display: flex; flex-direction: column; gap: 16px; }
        .buttons { display: flex; flex-wrap: wrap; gap: 12px; }
        .buttons button { flex: 1; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; cursor: pointer; border: none; }
        .buttons button.primary { background: var(--accent); color: white; }
        .buttons button.secondary { background: var(--panel-light); color: var(--text); border: 1px solid var(--border); }
        .buttons button.active { border-color: var(--accent); color: var(--accent-light); }
        .speed-slider { display: flex; align-items: center; gap: 12px; font-size: 12px; font-weight: 600; color: var(--text-dim); }
        .speed-slider input { flex: 1; accent-color: var(--accent); }
        .reset-btn { width: 100%; height: 40px; border-radius: 10px; background: var(--bg); border: 1px solid var(--border); color: var(--text-dim); font-size: 12px; font-weight: 700; cursor: pointer; }

        .canvas-area { background: color-mix(in srgb, var(--bg) 80%, transparent); border-radius: 24px; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; padding: 40px; position: relative; min-height: 500px; }
        .grid-detective { display: flex; flex-direction: column; gap: 8px; }
        .detective-row { display: flex; gap: 8px; }
        .detective-cell { width: 64px; height: 64px; border-radius: 12px; border: 2px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 900; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); position: relative; cursor: pointer; }
        
        .char-A { color: var(--blue); }
        .char-B { color: var(--amber); }
        .char-C { color: var(--pink); }
        
        .detective-cell.visited { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 10%, transparent); }
        .detective-cell.active { transform: scale(1.15); border-color: var(--green); z-index: 20; box-shadow: 0 0 30px var(--green); background: var(--green); color: white; }
        .detective-cell.parent { border-style: dashed; border-color: var(--text-dim); }

        .radar { position: absolute; inset: -4px; border: 2px solid white; border-radius: 16px; animation: radar-ping 1s infinite; pointer-events: none; }
        @keyframes radar-ping { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.6); opacity: 0; } }
        .gesture-hint-canvas { position: absolute; bottom: 12px; right: 12px; font-size: 10px; color: var(--text-dim); pointer-events: none; }
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
      `}</style>
    </main>
  );
}

