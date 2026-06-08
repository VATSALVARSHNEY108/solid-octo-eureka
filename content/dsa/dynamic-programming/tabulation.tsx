"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { Grid3X3, Info, Layers3, MousePointer2, Pause, Play, RotateCcw, StepBack, StepForward } from "lucide-react";

type FillEvent = { i: number; table: number[]; prev2: number; prev1: number; value: number };

function buildFibFillEvents(n: number): FillEvent[] {
  const table: number[] = [];
  const events: FillEvent[] = [];

  table[0] = 0;
  events.push({ i: 0, table: [...table], prev2: 0, prev1: 0, value: 0 });
  table[1] = 1;
  events.push({ i: 1, table: [...table], prev2: 0, prev1: 1, value: 1 });

  for (let i = 2; i <= n; i += 1) {
    const prev2 = table[i - 2];
    const prev1 = table[i - 1];
    const value = prev1 + prev2;
    table[i] = value;
    events.push({ i, table: [...table], prev2, prev1, value });
  }

  return events;
}

const DEFAULT_N = 10;
const MAX_N = 24;

export default function TabulationLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [n, setN] = useState(DEFAULT_N);
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const [speedMs, setSpeedMs] = useState(180);

  const events = useMemo(() => buildFibFillEvents(n), [n]);
  const maxSteps = Math.max(0, events.length - 1);
  const clampedStep = Math.min(step, maxSteps);
  const active = events[clampedStep] ?? events[events.length - 1];
  const table = active?.table ?? [0, 1];

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
          <div className="badge">Bottom-Up Build</div>
          <h1>Tabulation</h1>
          <p className="description">
            Tabulation is DP done in dependency order. You fill the table from base cases
            upward so every state is available when needed.
          </p>
          <div className="complexity-grid">
            <div className="complexity-item">
              <span className="label">Order</span>
              <span className="value">deterministic</span>
            </div>
            <div className="complexity-item">
              <span className="label">Storage</span>
              <span className="value">table</span>
            </div>
          </div>
        </div>
      </section>

      <section className="guide">
        <div className="guide-content">
          <div className="card">
            <div className="card-icon"><Grid3X3 size={20} /></div>
            <h3>Fill Frontier</h3>
            <p>The “frontier” is the next state whose dependencies are already computed.</p>
          </div>
          <div className="card highlight">
            <div className="card-icon"><Layers3 size={20} /></div>
            <h3>No Recursion Needed</h3>
            <p>Tabulation avoids call-stack overhead and makes progress easy to inspect.</p>
          </div>
        </div>
      </section>

      <section className="simulator">
        <div className="workspace">
          <aside className="movable-panel">
            <div className="panel-header"><Info size={16} /><h2>Fill Controls</h2></div>
            <div className="status-message">
              Filling Fibonacci tabulation up to <strong>dp[{n}]</strong>.
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
              <input type="range" min={80} max={650} step={20} value={speedMs} onChange={(e) => setSpeedMs(Number(e.target.value))} />
              <span className="range-val">{speedMs}ms</span>
            </div>
            <div className="range-block">
              <label className="range-label">time</label>
              <input type="range" min={0} max={maxSteps} value={clampedStep} onChange={(e) => setStep(Number(e.target.value))} />
              <span className="range-val">{clampedStep}/{maxSteps}</span>
            </div>

            <div className="stats-grid">
              <div className="stat-card"><span className="stat-label">Active i</span><span className="stat-value">{active?.i ?? 0}</span></div>
              <div className="stat-card"><span className="stat-label">Transition</span><span className="stat-value">{active ? `${active.prev1}+${active.prev2}` : "-"}</span></div>
              <div className="stat-card"><span className="stat-label">Answer</span><span className="stat-value">{table[n] ?? table[table.length - 1]}</span></div>
            </div>

            <div className="playback-controls" style={{ border: "none" }}>
              <div className="tip"><MousePointer2 size={14} /><span>Tabulation is “loop-driven DP” — the loop is the algorithm.</span></div>
            </div>
          </aside>

          <div className="canvas-area">
            <div className="panel">
              <div className="panel-title"><Layers3 size={16} /><span>DP Table</span></div>
              <div className="equation">
                dp[{active?.i ?? 0}] = dp[{Math.max(0, (active?.i ?? 0) - 1)}] + dp[{Math.max(0, (active?.i ?? 0) - 2)}]
              </div>
              <div className="grid">
                {Array.from({ length: n + 1 }, (_, index) => {
                  const value = table[index];
                  const isFilled = value !== undefined;
                  const isActive = index === (active?.i ?? 0);
                  const isDep = index === (active?.i ?? 0) - 1 || index === (active?.i ?? 0) - 2;
                  return (
                    <div key={index} className={["cell", isActive ? "active" : "", isDep ? "dep" : "", !isFilled ? "empty" : ""].join(" ")}>
                      <span className="idx">dp[{index}]</span>
                      <span className="val">{isFilled ? value : "?"}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{baseStyles}</style>
    </main>
  );
}

const baseStyles = `
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
  .grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(110px, 1fr)); gap:12px; }
  .cell { padding:16px; border-radius:16px; background:var(--bg); border:1px solid var(--border); display:flex; flex-direction:column; gap:8px; transition:transform .12s ease, border-color .12s ease; }
  .cell.active { border-color:var(--accent); box-shadow:inset 0 0 0 1px color-mix(in srgb, var(--accent) 40%, transparent); transform:translateY(-1px); }
  .cell.dep { border-color:color-mix(in srgb, var(--green) 22%, var(--border)); }
  .cell.empty { opacity:.65; }
  .idx { font-size:11px; text-transform:uppercase; color:var(--text-dim); font-weight:800; }
  .val { font-size:28px; font-family:monospace; font-weight:900; color:var(--green); }
  .workspace > aside,.workspace > .inspector-panel,.workspace > .side-panel,.workspace > .control-panel,.workspace > .visual-panel,.workspace > .data-panel { resize:both; overflow:auto; min-width:180px; min-height:140px; max-width:640px; max-height:720px; }
  @media (max-width:960px) { .guide-content,.workspace { grid-template-columns:1fr; } .hero h1 { font-size:42px; } }
`;

