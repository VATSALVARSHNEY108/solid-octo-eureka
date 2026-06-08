"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import {
  GitMerge,
  Goal,
  Grid3X3,
  Info,
  MousePointer2,
  Pause,
  Play,
  RotateCcw,
  StepBack,
  StepForward,
} from "lucide-react";

type GridEvent = {
  r: number;
  c: number;
  dp: number[][];
  fromTop: number;
  fromLeft: number;
  value: number;
};

function buildUniquePathsEvents(rows: number, cols: number): GridEvent[] {
  const dp: number[][] = Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));
  const events: GridEvent[] = [];

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (r === 0 && c === 0) {
        dp[r][c] = 1;
        events.push({ r, c, dp: dp.map((row) => [...row]), fromTop: 0, fromLeft: 0, value: 1 });
        continue;
      }
      const fromTop = r > 0 ? dp[r - 1][c] : 0;
      const fromLeft = c > 0 ? dp[r][c - 1] : 0;
      const value = (r === 0 || c === 0) ? 1 : fromTop + fromLeft;
      dp[r][c] = value;
      events.push({ r, c, dp: dp.map((row) => [...row]), fromTop, fromLeft, value });
    }
  }

  return events;
}

function clampInt(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export default function OptimalSubstructureLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const [speedMs, setSpeedMs] = useState(120);

  const events = useMemo(() => buildUniquePathsEvents(rows, cols), [rows, cols]);
  const maxSteps = Math.max(0, events.length - 1);
  const clampedStep = clampInt(step, 0, maxSteps);
  const active = events[clampedStep] ?? events[events.length - 1];

  useEffect(() => {
    setStep(0);
    setIsPlaying(false);
  }, [rows, cols]);

  useEffect(() => {
    if (!isPlaying) return;
    const t = setTimeout(() => setStep((s) => (s >= maxSteps ? s : s + 1)), speedMs);
    return () => clearTimeout(t);
  }, [clampedStep, isPlaying, maxSteps, speedMs]);

  useEffect(() => {
    if (isPlaying && clampedStep >= maxSteps) setIsPlaying(false);
  }, [clampedStep, isPlaying, maxSteps]);

  const reset = () => {
    setIsPlaying(false);
    setStep(0);
  };
  const stepBack = () => setStep((s) => Math.max(0, s - 1));
  const stepForward = () => setStep((s) => Math.min(maxSteps, s + 1));

  const answer = active?.dp?.[rows - 1]?.[cols - 1] ?? 0;

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <div className="badge">Correctness Property</div>
          <h1>Optimal Substructure</h1>
          <p className="description">
            DP works because the best answer to a larger state can be composed from best answers
            to smaller states. Here, each grid cell’s optimal count comes from the two optimal neighbors.
          </p>
          <div className="complexity-grid">
            <div className="complexity-item">
              <span className="label">Meaning</span>
              <span className="value">Best builds from best</span>
            </div>
            <div className="complexity-item">
              <span className="label">Example</span>
              <span className="value">Grid DP</span>
            </div>
          </div>
        </div>
      </section>

      <section className="guide">
        <div className="guide-content">
          <div className="card">
            <div className="card-icon">
              <Goal size={20} />
            </div>
            <h3>Global Objective</h3>
            <p>The target state asks for the full answer (bottom-right cell).</p>
          </div>
          <div className="card highlight">
            <div className="card-icon">
              <GitMerge size={20} />
            </div>
            <h3>Valid Composition</h3>
            <p>Each cell’s answer is built from optimal answers of its top/left neighbors.</p>
          </div>
        </div>
      </section>

      <section className="simulator">
        <div className="workspace">
          <aside className="movable-panel">
            <div className="panel-header">
              <Info size={16} />
              <h2>Composition Lab</h2>
            </div>

            <div className="status-message">
              Filling a <strong>{rows}×{cols}</strong> DP table for unique paths.
            </div>

            <div className="control-row">
              <button className="icon-btn" onClick={reset} title="Reset">
                <RotateCcw size={16} />
              </button>
              <button className="icon-btn" onClick={stepBack} disabled={clampedStep === 0} title="Step Back">
                <StepBack size={16} />
              </button>
              <button className="icon-btn primary" onClick={() => setIsPlaying((p) => !p)} title={isPlaying ? "Pause" : "Play"}>
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                <span>{isPlaying ? "Pause" : "Play"}</span>
              </button>
              <button className="icon-btn" onClick={stepForward} disabled={clampedStep >= maxSteps} title="Step Forward">
                <StepForward size={16} />
              </button>
            </div>

            <div className="range-block">
              <label className="range-label">rows</label>
              <input type="range" min={2} max={8} value={rows} onChange={(e) => setRows(Number(e.target.value))} />
              <span className="range-val">{rows}</span>
            </div>
            <div className="range-block">
              <label className="range-label">cols</label>
              <input type="range" min={2} max={10} value={cols} onChange={(e) => setCols(Number(e.target.value))} />
              <span className="range-val">{cols}</span>
            </div>
            <div className="range-block">
              <label className="range-label">speed</label>
              <input type="range" min={60} max={420} step={20} value={speedMs} onChange={(e) => setSpeedMs(Number(e.target.value))} />
              <span className="range-val">{speedMs}ms</span>
            </div>
            <div className="range-block">
              <label className="range-label">time</label>
              <input type="range" min={0} max={maxSteps} value={clampedStep} onChange={(e) => setStep(Number(e.target.value))} />
              <span className="range-val">{clampedStep}/{maxSteps}</span>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">Active cell</span>
                <span className="stat-value">{active ? `${active.r},${active.c}` : "-"}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Top + Left</span>
                <span className="stat-value">{active ? `${active.fromTop}+${active.fromLeft}` : "-"}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Answer</span>
                <span className="stat-value">{answer}</span>
              </div>
            </div>

            <div className="playback-controls" style={{ border: "none" }}>
              <div className="tip">
                <MousePointer2 size={14} />
                <span>Scrub time to see exactly which optimal subanswers are combined</span>
              </div>
            </div>
          </aside>

          <div className="canvas-area">
            <div className="canvas-shell">
              <div className="panel">
                <div className="panel-title">
                  <Grid3X3 size={16} />
                  <span>DP Table</span>
                </div>

                <div className="equation">
                  dp[r][c] = dp[r-1][c] + dp[r][c-1]
                </div>

                <div className="grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(82px, 1fr))` }}>
                  {Array.from({ length: rows }, (_, r) =>
                    Array.from({ length: cols }, (_, c) => {
                      const value = active?.dp?.[r]?.[c] ?? 0;
                      const isActive = active && r === active.r && c === active.c;
                      const isDep = active && ((r === active.r - 1 && c === active.c) || (r === active.r && c === active.c - 1));
                      const isStart = r === 0 && c === 0;
                      const isTarget = r === rows - 1 && c === cols - 1;
                      return (
                        <div key={`${r}-${c}`} className={["cell", isActive ? "active" : "", isDep ? "dep" : "", isStart ? "start" : "", isTarget ? "target" : ""].join(" ")}>
                          <span className="idx">{r},{c}</span>
                          <span className="val">{value}</span>
                        </div>
                      );
                    }),
                  )}
                </div>
              </div>

              <div className="panel">
                <div className="panel-title">
                  <GitMerge size={16} />
                  <span>Local Composition</span>
                </div>
                <div className="compose">
                  <div className="compose-card">
                    <span className="k">top</span>
                    <b>{active?.fromTop ?? 0}</b>
                  </div>
                  <div className="compose-plus">+</div>
                  <div className="compose-card">
                    <span className="k">left</span>
                    <b>{active?.fromLeft ?? 0}</b>
                  </div>
                  <div className="compose-eq">=</div>
                  <div className="compose-card result">
                    <span className="k">dp[r][c]</span>
                    <b>{active?.value ?? 0}</b>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .page { --bg:#0a0d14; --panel:#111827; --panel-light:#1f2937; --border:#2e3a4e; --text:#f3f4f6; --text-dim:#9ca3af; --accent:#4f46e5; --accent-light:#818cf8; --green:#10b981; min-height:100vh; background:var(--bg); color:var(--text); font-family:"Inter",system-ui,sans-serif; }
        .page[data-theme="light"] { --bg:#f8fafc; --panel:#ffffff; --panel-light:#f1f5f9; --border:#e2e8f0; --text:#0f172a; --text-dim:#64748b; --accent:#4f46e5; --accent-light:#6366f1; }
        .hero { padding:80px 24px; text-align:center; border-bottom:1px solid var(--border); }
        .hero .content-width { max-width:860px; margin:0 auto; }
        .badge { display:inline-block; padding:4px 12px; background:color-mix(in srgb, var(--accent) 15%, transparent); color:var(--accent-light); border-radius:999px; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:.05em; margin-bottom:16px; }
        .hero h1 { font-size:56px; font-weight:900; letter-spacing:-.02em; margin-bottom:24px; }
        .description { font-size:18px; color:var(--text-dim); line-height:1.6; margin-bottom:40px; }
        .complexity-grid { display:flex; justify-content:center; gap:40px; flex-wrap:wrap; }
        .complexity-item { display:flex; flex-direction:column; align-items:center; }
        .complexity-item .label { font-size:12px; font-weight:600; text-transform:uppercase; color:var(--text-dim); margin-bottom:4px; }
        .complexity-item .value { font-size:24px; font-weight:800; color:var(--accent-light); font-family:monospace; }
        .guide { padding:60px 24px; background:color-mix(in srgb, var(--panel) 50%, transparent); }
        .guide-content { max-width:1200px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; gap:40px; }
        .card { padding:48px; background:var(--panel); border:1px solid var(--border); border-radius:24px; }
        .card.highlight { border-color:var(--accent); background:color-mix(in srgb, var(--accent) 5%, var(--panel)); }
        .card-icon { width:40px; height:40px; border-radius:12px; background:color-mix(in srgb, var(--accent) 15%, transparent); color:var(--accent-light); display:flex; align-items:center; justify-content:center; margin-bottom:20px; }
        .card h3 { font-size:20px; font-weight:700; margin-bottom:12px; }
        .card p { color:var(--text-dim); font-size:14px; line-height:1.6; }
        .simulator { padding:60px 24px; }
        .workspace { max-width:1400px; margin:0 auto; display:grid; grid-template-columns:340px 1fr; gap:48px; background:var(--panel); padding:48px; border-radius:32px; border:1px solid var(--border); box-shadow:0 25px 50px -12px rgba(0,0,0,.5); }
        aside { display:flex; flex-direction:column; gap:16px; }
        .panel-header { display:flex; align-items:center; gap:12px; color:var(--text-dim); }
        .panel-header h2 { font-size:14px; font-weight:700; text-transform:uppercase; letter-spacing:.05em; }
        .status-message { padding:18px; background:var(--panel-light); border-radius:16px; border:1px solid var(--border); font-size:14px; line-height:1.5; color:var(--text); font-weight:500; }
        .control-row { display:flex; gap:10px; flex-wrap:wrap; }
        .icon-btn { border:1px solid var(--border); background:var(--bg); color:var(--text); border-radius:14px; padding:10px 12px; display:flex; align-items:center; gap:8px; font-weight:800; cursor:pointer; }
        .icon-btn[disabled] { opacity:.45; cursor:not-allowed; }
        .icon-btn.primary { border-color:var(--accent); background:color-mix(in srgb, var(--accent) 10%, transparent); color:var(--accent-light); }
        .range-block { display:grid; grid-template-columns:56px 1fr auto; gap:10px; align-items:center; padding:10px 12px; border:1px solid var(--border); background:var(--bg); border-radius:14px; }
        .range-label { font-size:11px; text-transform:uppercase; color:var(--text-dim); font-weight:800; }
        input[type="range"] { width:100%; }
        .range-val { font-family:monospace; font-weight:900; color:var(--accent-light); }
        .stats-grid { display:grid; gap:12px; }
        .stat-card { padding:14px 16px; background:var(--bg); border:1px solid var(--border); border-radius:14px; display:flex; flex-direction:column; gap:6px; }
        .stat-label { font-size:11px; text-transform:uppercase; color:var(--text-dim); }
        .stat-value { font-size:20px; font-weight:900; color:var(--accent-light); font-family:monospace; }
        .tip { display:flex; align-items:center; gap:8px; color:var(--text-dim); font-size:12px; font-style:italic; }
        .canvas-area { background:color-mix(in srgb, var(--bg) 80%, transparent); border-radius:24px; border:1px solid var(--border); padding:24px; }
        .canvas-shell { display:grid; grid-template-columns:1.4fr 1fr; gap:16px; }
        .panel { background:var(--panel-light); border:1px solid var(--border); border-radius:20px; padding:18px; display:flex; flex-direction:column; gap:14px; min-height:520px; }
        .panel-title { display:flex; align-items:center; gap:10px; font-size:12px; text-transform:uppercase; letter-spacing:.06em; color:var(--text-dim); font-weight:900; }
        .equation { padding:12px 14px; border-radius:16px; background:var(--bg); border:1px solid var(--border); font-family:monospace; font-weight:900; color:var(--accent-light); }
        .grid { display:grid; gap:10px; }
        .cell { padding:12px; border-radius:16px; border:1px solid var(--border); background:var(--bg); display:flex; flex-direction:column; gap:8px; }
        .cell.active { border-color:var(--accent); box-shadow:inset 0 0 0 1px color-mix(in srgb, var(--accent) 40%, transparent); transform:translateY(-1px); }
        .cell.dep { border-color:color-mix(in srgb, var(--green) 22%, var(--border)); }
        .cell.start { border-color:color-mix(in srgb, var(--accent) 30%, var(--border)); }
        .cell.target { border-color:color-mix(in srgb, var(--green) 30%, var(--border)); }
        .idx { font-size:11px; text-transform:uppercase; color:var(--text-dim); font-weight:800; }
        .val { font-size:22px; font-family:monospace; font-weight:900; color:var(--green); }
        .compose { display:flex; align-items:center; justify-content:center; gap:12px; flex-wrap:wrap; padding:18px; border-radius:18px; background:var(--bg); border:1px solid var(--border); flex:1; }
        .compose-card { min-width:120px; padding:16px; border-radius:16px; border:1px solid var(--border); background:color-mix(in srgb, var(--panel) 55%, transparent); display:flex; flex-direction:column; gap:6px; text-align:center; }
        .compose-card.result { border-color:var(--accent); }
        .compose-card .k { font-size:11px; text-transform:uppercase; color:var(--text-dim); font-weight:900; }
        .compose-card b { font-family:monospace; font-size:28px; color:var(--accent-light); }
        .compose-plus,.compose-eq { font-family:monospace; font-size:26px; font-weight:900; color:var(--text-dim); }
        @media (max-width:1100px) { .canvas-shell { grid-template-columns:1fr; } }
        @media (max-width:960px) { .guide-content,.workspace { grid-template-columns:1fr; } .hero h1 { font-size:42px; } }
      `}</style>
    </main>
  );
}

