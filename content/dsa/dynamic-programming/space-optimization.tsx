"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { Info, Layers3, Minimize2, MousePointer2, Pause, Play, RotateCcw, StepBack, StepForward } from "lucide-react";

type RollingEvent = { i: number; prev2: number; prev1: number; current: number; window: [number, number] };

function buildRollingFibEvents(n: number): RollingEvent[] {
  const events: RollingEvent[] = [];
  let prev2 = 0;
  let prev1 = 1;
  events.push({ i: 1, prev2: 0, prev1: 1, current: 1, window: [0, 1] });
  for (let i = 2; i <= n; i += 1) {
    const current = prev1 + prev2;
    events.push({ i, prev2, prev1, current, window: [prev1, current] });
    prev2 = prev1;
    prev1 = current;
  }
  return events;
}

const DEFAULT_N = 16;
const MAX_N = 40;

export default function SpaceOptimizationLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [n, setN] = useState(DEFAULT_N);
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const [speedMs, setSpeedMs] = useState(120);

  const events = useMemo(() => buildRollingFibEvents(n), [n]);
  const maxSteps = Math.max(0, events.length - 1);
  const clampedStep = Math.min(step, maxSteps);
  const active = events[clampedStep] ?? events[events.length - 1];
  const answer = active?.current ?? 1;

  useEffect(() => {
    setStep(0);
    setIsPlaying(false);
  }, [n]);

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

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <div className="badge">Compression Pattern</div>
          <h1>Space Optimization</h1>
          <p className="description">
            If each state only depends on a small window of previous states, you don’t need
            the full table. Keep only the dependencies.
          </p>
          <div className="complexity-grid">
            <div className="complexity-item"><span className="label">Keep</span><span className="value">deps only</span></div>
            <div className="complexity-item"><span className="label">Drop</span><span className="value">old rows</span></div>
          </div>
        </div>
      </section>

      <section className="guide">
        <div className="guide-content">
          <div className="card">
            <div className="card-icon"><Layers3 size={20} /></div>
            <h3>Same Recurrence</h3>
            <p>The math stays identical. Only the storage model changes.</p>
          </div>
          <div className="card highlight">
            <div className="card-icon"><Minimize2 size={20} /></div>
            <h3>Rolling Window</h3>
            <p>When the dependency set is small, use a few variables instead of an array.</p>
          </div>
        </div>
      </section>

      <section className="simulator">
        <div className="workspace">
          <aside className="movable-panel">
            <div className="panel-header"><Info size={16} /><h2>Rolling Controls</h2></div>
            <div className="status-message">
              Rolling window for Fibonacci: compute <strong>F({n})</strong> using only two cells of memory.
            </div>

            <div className="control-row">
              <button className="icon-btn" onClick={reset} title="Reset"><RotateCcw size={16} /></button>
              <button className="icon-btn" onClick={stepBack} disabled={clampedStep === 0} title="Step Back"><StepBack size={16} /></button>
              <button className="icon-btn primary" onClick={() => setIsPlaying((p) => !p)} title={isPlaying ? "Pause" : "Play"}>
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                <span>{isPlaying ? "Pause" : "Play"}</span>
              </button>
              <button className="icon-btn" onClick={stepForward} disabled={clampedStep >= maxSteps} title="Step Forward"><StepForward size={16} /></button>
            </div>

            <div className="range-block">
              <label className="range-label">n</label>
              <input type="range" min={2} max={MAX_N} value={n} onChange={(e) => setN(Number(e.target.value))} />
              <span className="range-val">{n}</span>
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
              <div className="stat-card"><span className="stat-label">Stored cells</span><span className="stat-value">2</span></div>
              <div className="stat-card"><span className="stat-label">Active i</span><span className="stat-value">{active?.i ?? 1}</span></div>
              <div className="stat-card"><span className="stat-label">Answer</span><span className="stat-value">{answer}</span></div>
            </div>

            <div className="playback-controls" style={{ border: "none" }}>
              <div className="tip"><MousePointer2 size={14} /><span>Watch how the window slides: (prev2, prev1) → (prev1, current)</span></div>
            </div>
          </aside>

          <div className="canvas-area">
            <div className="panel">
              <div className="panel-title"><Minimize2 size={16} /><span>Window State</span></div>
              <div className="equation">
                current = prev1 + prev2 = {active?.prev1 ?? 1} + {active?.prev2 ?? 0}
              </div>
              <div className="window">
                <div className="wcell">
                  <span className="k">prev2</span>
                  <b>{active?.prev2 ?? 0}</b>
                </div>
                <div className="wcell">
                  <span className="k">prev1</span>
                  <b>{active?.prev1 ?? 1}</b>
                </div>
                <div className="wcell result">
                  <span className="k">current</span>
                  <b>{active?.current ?? 1}</b>
                </div>
              </div>
              <div className="hint">
                Only two stored cells are needed because Fibonacci reads just the previous two states.
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .page { --bg:#0a0d14; --panel:#111827; --panel-light:#1f2937; --border:#2e3a4e; --text:#f3f4f6; --text-dim:#9ca3af; --accent:#4f46e5; --accent-light:#818cf8; --green:#10b981; min-height:100vh; background:var(--bg); color:var(--text); font-family:"Inter",system-ui,sans-serif; }
        .page[data-theme="light"] { --bg:#f8fafc; --panel:#ffffff; --panel-light:#f1f5f9; --border:#e2e8f0; --text:#0f172a; --text-dim:#64748b; --accent:#4f46e5; --accent-light:#6366f1; }
        .hero { padding:80px 24px; text-align:center; border-bottom:1px solid var(--border); }
        .hero .content-width { max-width:840px; margin:0 auto; }
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
        .range-block { display:grid; grid-template-columns:46px 1fr auto; gap:10px; align-items:center; padding:10px 12px; border:1px solid var(--border); background:var(--bg); border-radius:14px; }
        .range-label { font-size:11px; text-transform:uppercase; color:var(--text-dim); font-weight:800; }
        input[type="range"] { width:100%; }
        .range-val { font-family:monospace; font-weight:900; color:var(--accent-light); }
        .stats-grid { display:grid; gap:12px; }
        .stat-card { padding:14px 16px; background:var(--bg); border:1px solid var(--border); border-radius:14px; display:flex; flex-direction:column; gap:6px; }
        .stat-label { font-size:11px; text-transform:uppercase; color:var(--text-dim); }
        .stat-value { font-size:22px; font-weight:900; color:var(--accent-light); font-family:monospace; }
        .tip { display:flex; align-items:center; gap:8px; color:var(--text-dim); font-size:12px; font-style:italic; }
        .canvas-area { background:color-mix(in srgb, var(--bg) 80%, transparent); border-radius:24px; border:1px solid var(--border); padding:24px; }
        .panel { background:var(--panel-light); border:1px solid var(--border); border-radius:20px; padding:18px; display:flex; flex-direction:column; gap:14px; min-height:520px; }
        .panel-title { display:flex; align-items:center; gap:10px; font-size:12px; text-transform:uppercase; letter-spacing:.06em; color:var(--text-dim); font-weight:900; }
        .equation { padding:12px 14px; border-radius:16px; background:var(--bg); border:1px solid var(--border); font-family:monospace; font-weight:900; color:var(--accent-light); line-height:1.4; }
        .window { display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; }
        .wcell { padding:18px; border-radius:18px; border:1px solid var(--border); background:var(--bg); display:flex; flex-direction:column; gap:8px; text-align:center; }
        .wcell.result { border-color:color-mix(in srgb, var(--green) 30%, var(--border)); }
        .wcell .k { font-size:11px; text-transform:uppercase; color:var(--text-dim); font-weight:800; }
        .wcell b { font-family:monospace; font-size:34px; color:var(--green); }
        .hint { margin-top:8px; padding:14px 16px; border-radius:16px; border:1px solid var(--border); background:color-mix(in srgb, var(--panel) 55%, transparent); color:var(--text-dim); line-height:1.6; font-size:14px; }
        .workspace > aside,.workspace > .inspector-panel,.workspace > .side-panel,.workspace > .control-panel,.workspace > .visual-panel,.workspace > .data-panel { resize:both; overflow:auto; min-width:180px; min-height:140px; max-width:640px; max-height:720px; }
        @media (max-width:960px) { .guide-content,.workspace { grid-template-columns:1fr; } .hero h1 { font-size:42px; } }
      `}</style>
    </main>
  );
}

