"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Info, Zap, Timer, Skull } from "lucide-react";

interface OrangeStep {
  grid: number[][]; // 0: empty, 1: fresh, 2: rotten
  queue: { r: number; c: number; time: number }[];
  time: number;
  message: string;
  freshLeft: number;
}

const DEFAULT_ROWS = 6;
const DEFAULT_COLS = 8;

const INITIAL_GRID = [
  [2, 1, 1, 0, 0, 0, 0, 0],
  [1, 1, 0, 0, 1, 1, 1, 0],
  [0, 0, 0, 0, 1, 1, 1, 0],
  [0, 1, 1, 0, 0, 1, 1, 0],
  [0, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 2],
];

function generateOrangeSteps(initialGrid: number[][]): OrangeStep[] {
  const rows = initialGrid.length;
  const cols = initialGrid[0].length;
  const grid = initialGrid.map(row => [...row]);
  const steps: OrangeStep[] = [];
  const queue: { r: number; c: number; time: number }[] = [];
  let freshCount = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) queue.push({ r, c, time: 0 });
      if (grid[r][c] === 1) freshCount++;
    }
  }

  steps.push({
    grid: grid.map(row => [...row]),
    queue: [...queue],
    time: 0,
    message: `Initial state: ${freshCount} fresh oranges and ${queue.length} rotten sources found. Starting Multi-source BFS.`,
    freshLeft: freshCount
  });

  let maxTime = 0;
  let head = 0;
  const bfsQueue = [...queue];
  
  while (head < bfsQueue.length) {
    const { r, c, time } = bfsQueue[head++];
    maxTime = Math.max(maxTime, time);

    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    let spreadAtThisSource = false;

    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {
        grid[nr][nc] = 2;
        freshCount--;
        bfsQueue.push({ r: nr, c: nc, time: time + 1 });
        spreadAtThisSource = true;
      }
    }

    if (spreadAtThisSource) {
      steps.push({
        grid: grid.map(row => [...row]),
        queue: bfsQueue.slice(head),
        time: time + 1,
        message: `Rot spreading from orange at (${r}, ${c}) to adjacent fresh oranges.`,
        freshLeft: freshCount
      });
    }
  }

  steps.push({
    grid: grid.map(row => [...row]),
    queue: [],
    time: maxTime,
    message: freshCount === 0 
      ? `All oranges rotten in ${maxTime} minutes!` 
      : `Simulation ended. ${freshCount} oranges isolated from the rot and remain fresh.`,
    freshLeft: freshCount
  });

  return steps;
}

export default function RottenOrangesSimulation() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";
  
  const [grid, setGrid] = useState<number[][]>(INITIAL_GRID);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);

  const steps = useMemo(() => generateOrangeSteps(grid), [grid]);
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
    const newGrid = grid.map((row, ri) => 
      ri === r ? row.map((cell, ci) => ci === c ? (cell + 1) % 3 : cell) : [...row]
    );
    setGrid(newGrid);
    setStepIndex(0);
  };

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <div className="badge">BFS Simulation</div>
          <h1>Rotten Oranges</h1>
          <p className="description">
            Watch how corruption spreads through a grid. 
            This is a <strong>Multi-source Breadth-First Search (BFS)</strong> problem, where multiple "rotten" sources contaminate adjacent fresh cells simultaneously.
          </p>
          <div className="complexity-grid">
            <div className="complexity-item">
              <span className="label">Time Complexity</span>
              <span className="value">O(M × N)</span>
            </div>
            <div className="complexity-item">
              <span className="label">Algorithm</span>
              <span className="value">Multi-BFS</span>
            </div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>

      <section className="guide">
        <div className="guide-content">
          <div className="card">
            <div className="card-icon"><Timer size={20} /></div>
            <h3>Time Propagation</h3>
            <p>Every minute, the rot spreads 1 unit distance in all 4 directions. BFS ensures we find the earliest possible time for each orange to rot.</p>
          </div>
          <div className="card highlight">
            <div className="card-icon"><Skull size={20} /></div>
            <h3>Source Management</h3>
            <p>We initialize a queue with all initially rotten oranges. This allows them to "race" outwards simultaneously, calculating the global time.</p>
          </div>
        </div>
      </section>

      <section id="simulator" className="simulator">
        <div className="workspace">
          <aside className="movable-panel">
            <div className="panel-header">
              <Info size={16} />
              <h2>State Dashboard</h2>
            </div>
            
            <div className="status-message">
              {step.message}
            </div>

            <div className="data-section">
              <h3>Simulation Metrics</h3>
              <div className="metrics-row">
                <div className="metric-box">
                  <span className="label">Time</span>
                  <span className="value">{step.time}m</span>
                </div>
                <div className="metric-box">
                  <span className="label">Fresh Left</span>
                  <span className="value">{step.freshLeft}</span>
                </div>
              </div>
            </div>

            <div className="data-section">
              <h3>Legend & Editing</h3>
              <div className="legend-list">
                <div className="legend-item"><span className="dot empty" /> Empty Cell</div>
                <div className="legend-item"><span className="dot fresh" /> Fresh Orange</div>
                <div className="legend-item"><span className="dot rotten" /> Rotten Orange</div>
              </div>
              <p className="hint">Click cells to cycle between states.</p>
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
            <div className="orange-grid">
              {step.grid.map((row, r) => (
                <div key={r} className="orange-row">
                  {row.map((val, c) => {
                    const isInitialSource = grid[r][c] === 2;
                    return (
                      <div key={`${r}-${c}`} 
                        className={`orange-cell type-${val} ${isInitialSource ? 'source' : ''}`}
                        onClick={() => toggleCell(r, c)}
                      >
                        <div className="inner">
                          {val === 1 && "🍊"}
                          {val === 2 && "🤢"}
                        </div>
                        {val === 2 && !isInitialSource && <div className="rot-wave" />}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="gesture-hint-canvas">
               🖱️ Click cells to edit grid configuration
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .page { --bg: #0a0d14; --panel: #111827; --panel-light: #1f2937; --border: #2e3a4e; --text: #f3f4f6; --text-dim: #9ca3af; --accent: #f97316; --accent-light: #fb923c; --green: #10b981; --red: #ef4444; min-height: 100vh; background: var(--bg); color: var(--text); font-family: 'Inter', system-ui, sans-serif; }
        .page[data-theme="light"] { --bg: #f8fafc; --panel: #ffffff; --panel-light: #f1f5f9; --border: #e2e8f0; --text: #0f172a; --text-dim: #64748b; --accent: #f97316; --accent-light: #fb923c; }
        
        .hero { padding: 80px 24px; text-align: center; border-bottom: 1px solid var(--border); }
        .hero .content-width { max-width: 800px; margin: 0 auto; }
        .badge { display: inline-block; padding: 4px 12px; background: color-mix(in srgb, var(--accent) 15%, transparent); color: var(--accent); border-radius: 99px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px; }
        .hero h1 { font-size: 56px; font-weight: 900; letter-spacing: -0.02em; margin-bottom: 24px; }
        .description { font-size: 18px; color: var(--text-dim); line-height: 1.6; margin-bottom: 40px; }
        .complexity-grid { display: flex; justify-content: center; gap: 40px; }
        .complexity-item { display: flex; flex-direction: column; align-items: center; }
        .complexity-item .label { font-size: 12px; font-weight: 600; text-transform: uppercase; color: var(--text-dim); margin-bottom: 4px; }
        .complexity-item .value { font-size: 24px; font-weight: 800; color: var(--accent); font-family: monospace; }

        .guide { padding: 60px 24px; background: color-mix(in srgb, var(--panel) 50%, transparent); }
        .guide-content { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
        .card { padding: 48px; background: var(--panel); border: 1px solid var(--border); border-radius: 24px; }
        .card.highlight { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 5%, var(--panel)); }
        .card-icon { width: 40px; height: 40px; border-radius: 12px; background: color-mix(in srgb, var(--accent) 15%, transparent); color: var(--accent); display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
        .card h3 { font-size: 20px; font-weight: 700; margin-bottom: 12px; }
        .card p { color: var(--text-dim); font-size: 14px; line-height: 1.6; }

        .simulator { padding: 60px 24px; }
        .workspace { max-width: 1400px; margin: 0 auto; display: grid; grid-template-columns: 340px 1fr; gap: 48px; background: var(--panel); padding: 48px; border-radius: 32px; border: 1px solid var(--border); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
        
        aside { display: flex; flex-direction: column; gap: 40px; }
        .panel-header { display: flex; align-items: center; gap: 12px; color: var(--text-dim); }
        .panel-header h2 { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
        .status-message { padding: 20px; background: var(--panel-light); border-radius: 16px; border: 1px solid var(--border); font-size: 14px; line-height: 1.5; color: var(--text); font-weight: 500; min-height: 80px; }
        
        .metrics-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .metric-box { background: var(--bg); border: 1px solid var(--border); padding: 16px; border-radius: 16px; text-align: center; }
        .metric-box .label { font-size: 10px; font-weight: 800; color: var(--text-dim); display: block; margin-bottom: 4px; text-transform: uppercase; }
        .metric-box .value { font-size: 24px; font-weight: 900; color: var(--accent); }

        .legend-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 8px; }
        .legend-item { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 600; color: var(--text-dim); }
        .dot { width: 12px; height: 12px; border-radius: 4px; }
        .dot.fresh { background: var(--accent); }
        .dot.rotten { background: var(--green); }
        .dot.empty { background: var(--panel-light); border: 1px solid var(--border); }
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
        .reset-btn:hover { border-color: var(--red); color: var(--red); }

        .canvas-area { background: color-mix(in srgb, var(--bg) 80%, transparent); border-radius: 24px; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; padding: 40px; overflow: hidden; position: relative; min-height: 500px; }
        .orange-grid { display: flex; flex-direction: column; gap: 8px; }
        .orange-row { display: flex; gap: 8px; }
        .orange-cell { width: 56px; height: 56px; border-radius: 12px; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 28px; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); position: relative; cursor: pointer; }
        
        .orange-cell.type-0 { opacity: 0.05; }
        .orange-cell.type-1 { background: var(--panel-light); }
        .orange-cell.type-2 { background: color-mix(in srgb, var(--green) 15%, var(--panel-light)); border-color: var(--green); }
        .orange-cell.type-2.source { border-width: 3px; border-color: var(--green); box-shadow: 0 0 20px color-mix(in srgb, var(--green) 30%, transparent); }

        .rot-wave { position: absolute; inset: -4px; border: 2px solid var(--green); border-radius: 16px; animation: wave 1s ease-out; pointer-events: none; }
        @keyframes wave { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.5); opacity: 0; } }
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

