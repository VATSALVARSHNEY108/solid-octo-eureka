"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Info, Zap, Grid3x3, MapPin } from "lucide-react";

interface GridSPStep {
  grid: number[][];
  dist: number[][];
  queue: { r: number; c: number }[];
  r?: number;
  c?: number;
  message: string;
}

const ROWS = 6;
const COLS = 8;
const INITIAL_GRID = [
  [0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 1, 1, 1, 0],
  [0, 0, 1, 0, 0, 0, 1, 0],
  [0, 0, 0, 1, 1, 0, 1, 0],
  [1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 0],
];

const START = { r: 0, c: 0 };
const END = { r: 5, c: 7 };

function generateSPSteps(): GridSPStep[] {
  const dist = Array.from({ length: ROWS }, () => Array(COLS).fill(Infinity));
  const steps: GridSPStep[] = [];
  const queue: { r: number; c: number }[] = [START];
  dist[START.r][START.c] = 0;

  steps.push({
    grid: INITIAL_GRID,
    dist: dist.map(r => [...r]),
    queue: [...queue],
    message: "Initialization: Starting Breadth-First Search from the source cell (0, 0)."
  });

  while (queue.length > 0) {
    const { r, c } = queue.shift()!;

    if (r === END.r && c === END.c) {
      steps.push({
        grid: INITIAL_GRID,
        dist: dist.map(row => [...row]),
        queue: [],
        r, c,
        message: `Destination Reached! The shortest path distance to (${r}, ${c}) is ${dist[r][c]}.`
      });
      break;
    }

    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && INITIAL_GRID[nr][nc] === 0 && dist[nr][nc] === Infinity) {
        dist[nr][nc] = dist[r][c] + 1;
        queue.push({ r: nr, c: nc });
        steps.push({
          grid: INITIAL_GRID,
          dist: dist.map(row => [...row]),
          queue: [...queue],
          r, c,
          message: `Expanding: Neighbor (${nr}, ${nc}) is accessible. Distance updated to ${dist[nr][nc]}.`
        });
      }
    }
  }

  return steps;
}

export default function GridShortestPathSimulation() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";
  
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);

  const steps = useMemo(() => generateSPSteps(), []);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];

  useEffect(() => {
    let timer: number;
    if (playing && stepIndex < steps.length - 1) {
      timer = window.setInterval(() => {
        setStepIndex(s => s + 1);
      }, 2100 - speed);
    } else if (stepIndex >= steps.length - 1) {
      setPlaying(false);
    }
    return () => clearInterval(timer);
  }, [playing, stepIndex, steps.length, speed]);

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <div className="badge">Pathfinding</div>
          <h1>Shortest Path in Matrix</h1>
          <p className="description">
            Discover the most efficient route through a binary maze. 
            By treating each empty cell as a node and adjacent cells as edges of weight 1, <strong>BFS</strong> identifies the absolute shortest distance in O(V+E) time.
          </p>
          <div className="complexity-grid">
            <div className="complexity-item">
              <span className="label">BFS Complexity</span>
              <span className="value">O(M × N)</span>
            </div>
            <div className="complexity-item">
              <span className="label">Metric</span>
              <span className="value">L1 Distance</span>
            </div>
          </div>
        </div>
      </section>

      <section className="guide">
        <div className="guide-content">
          <div className="card">
            <div className="card-icon"><Grid3x3 size={20} /></div>
            <h3>Grid Representation</h3>
            <p>0 represents an open path, while 1 represents an impassable wall. We only explore cells that are within boundaries and not blocked.</p>
          </div>
          <div className="card highlight">
            <div className="card-icon"><MapPin size={20} /></div>
            <h3>Wave Propagation</h3>
            <p>BFS acts like a wave spreading outward from the start. The first time the "wave" hits a cell, we've found its shortest distance.</p>
          </div>
        </div>
      </section>

      <section className="simulator">
        <div className="workspace">
          <aside className="movable-panel">
            <div className="panel-header">
              <Info size={16} />
              <h2>Navigation Monitor</h2>
            </div>
            
            <div className="status-message">
              {step.message}
            </div>

            <div className="data-section">
              <h3>Search Queue</h3>
              <div className="queue-list">
                {step.queue.map((q, i) => (
                  <div key={i} className="q-item">
                    ({q.r}, {q.c})
                  </div>
                ))}
                {step.queue.length === 0 && <span className="empty">Queue cleared</span>}
              </div>
            </div>

            <div className="playback-controls">
              <div className="buttons">
                <button onClick={() => { setStepIndex(0); setPlaying(false); }} className="secondary"><RotateCcw size={16} /></button>
                <button onClick={() => setStepIndex(i => Math.max(0, i - 1))} className="secondary"><ChevronLeft size={20} /></button>
                <button onClick={() => setPlaying(!playing)} className="primary">
                  {playing ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button onClick={() => setStepIndex(i => Math.min(steps.length - 1, i + 1))} className="secondary"><ChevronRight size={20} /></button>
              </div>
              <div className="speed-slider">
                <span>Speed</span>
                <input type="range" min="100" max="2000" step="100" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} />
              </div>
            </div>
          </aside>

          <div className="canvas-area">
            <div className="binary-grid">
              {step.grid.map((row, r) => (
                <div key={r} className="grid-row">
                  {row.map((val, c) => {
                    const d = step.dist[r][c];
                    const isStart = START.r === r && START.c === c;
                    const isEnd = END.r === r && END.c === c;
                    const isCurrent = step.r === r && step.c === c;
                    const isReached = d !== Infinity;
                    
                    return (
                      <div key={`${r}-${c}`} 
                        className={`grid-cell ${val === 1 ? 'wall' : 'path'} ${isReached ? 'reached' : ''} ${isCurrent ? 'active' : ''} ${isStart ? 'start' : ''} ${isEnd ? 'end' : ''}`}
                      >
                        <div className="content">
                          {isStart ? 'S' : isEnd ? 'T' : val === 1 ? '🧱' : ''}
                        </div>
                        {isReached && val === 0 && <div className="dist-tag">{d}</div>}
                        {isCurrent && <div className="scanner" />}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .page { --bg: #0a0d14; --panel: #111827; --panel-light: #1f2937; --border: #2e3a4e; --text: #f3f4f6; --text-dim: #9ca3af; --accent: #3b82f6; --accent-light: #60a5fa; --green: #10b981; --amber: #f59e0b; --red: #ef4444; min-height: 100vh; background: var(--bg); color: var(--text); font-family: 'Inter', system-ui, sans-serif; }
        .page[data-theme="light"] { --bg: #f8fafc; --panel: #ffffff; --panel-light: #f1f5f9; --border: #e2e8f0; --text: #0f172a; --text-dim: #64748b; --accent: #2563eb; --accent-light: #3b82f6; }
        
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
        .workspace { max-width: 1400px; margin: 0 auto; display: grid; grid-template-columns: 360px 1fr; gap: 48px; background: var(--panel); padding: 48px; border-radius: 32px; border: 1px solid var(--border); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
        
        aside { display: flex; flex-direction: column; gap: 40px; }
        .panel-header { display: flex; align-items: center; gap: 12px; color: var(--text-dim); }
        .panel-header h2 { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
        .status-message { padding: 20px; background: var(--panel-light); border-radius: 16px; border: 1px solid var(--border); font-size: 14px; line-height: 1.5; color: var(--text); font-weight: 500; min-height: 80px; }
        
        .queue-list { display: flex; flex-wrap: wrap; gap: 6px; background: var(--bg); padding: 12px; border-radius: 16px; border: 1px solid var(--border); }
        .q-item { padding: 4px 8px; background: var(--panel-light); border: 1px solid var(--border); border-radius: 6px; font-size: 11px; font-weight: 800; font-family: monospace; color: var(--accent-light); }

        .playback-controls { margin-top: auto; padding-top: 24px; border-top: 1px solid var(--border); }
        .buttons { display: flex; gap: 12px; margin-bottom: 24px; }
        .buttons button { flex: 1; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; cursor: pointer; border: none; }
        .buttons button.primary { background: var(--accent); color: white; }
        .buttons button.secondary { background: var(--panel-light); color: var(--text); border: 1px solid var(--border); }
        .speed-slider { display: flex; align-items: center; gap: 12px; font-size: 12px; font-weight: 600; color: var(--text-dim); }
        .speed-slider input { flex: 1; accent-color: var(--accent); }

        .canvas-area { background: color-mix(in srgb, var(--bg) 80%, transparent); border-radius: 24px; border: 1px solid var(--border); padding: 40px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .binary-grid { display: flex; flex-direction: column; gap: 6px; }
        .grid-row { display: flex; gap: 6px; }
        .grid-cell { width: 48px; height: 48px; border-radius: 8px; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; position: relative; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        
        .grid-cell.wall { background: var(--panel-light); opacity: 0.3; }
        .grid-cell.path { background: transparent; }
        .grid-cell.reached { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 5%, transparent); }
        .grid-cell.active { transform: scale(1.15); border-color: var(--green); background: var(--green); z-index: 10; box-shadow: 0 0 20px var(--green); }
        .grid-cell.active .content { color: white; font-weight: 900; }
        .grid-cell.start { border-color: var(--accent-light); border-width: 3px; }
        .grid-cell.end { border-color: var(--amber); border-width: 3px; }
        
        .content { font-size: 16px; font-weight: 800; }
        .dist-tag { position: absolute; bottom: 2px; right: 4px; font-size: 10px; font-weight: 900; color: var(--accent-light); font-family: monospace; }
        .scanner { position: absolute; inset: -4px; border: 2px solid white; border-radius: 12px; animation: grid-scan 1s infinite; }
        @keyframes grid-scan { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.4); opacity: 0; } }
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

