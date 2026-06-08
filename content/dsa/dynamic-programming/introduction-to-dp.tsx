"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { BarChart3, Boxes, Info, Layers3, MousePointer2, Pause, Play, RotateCcw, StepBack, StepForward } from "lucide-react";

// ---------- Helper: generic event builder (to be replaced per lesson) ----------
function buildEvents(_n: number): any[] {
  // TODO: implement the deterministic event list for this DP problem.
  return [];
}

export default function DPLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [n, setN] = useState(7);
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const [speedMs, setSpeedMs] = useState(220);

  const events = useMemo(() => buildEvents(n), [n]);
  const clampedStep = Math.min(step, Math.max(0, events.length - 1));
  const active = events[clampedStep] ?? {};

  useEffect(() => {
    setStep(0);
    setIsPlaying(false);
  }, [n]);

  useEffect(() => {
    if (!isPlaying) return;
    const t = setTimeout(() => {
      setStep((s) => (s >= events.length - 1 ? s : s + 1));
    }, speedMs);
    return () => clearTimeout(t);
  }, [isPlaying, speedMs, events.length, clampedStep]);

  useEffect(() => {
    if (isPlaying && clampedStep >= events.length - 1) setIsPlaying(false);
  }, [isPlaying, clampedStep, events.length]);

  const reset = () => {
    setIsPlaying(false);
    setStep(0);
  };
  const stepBack = () => setStep((s) => Math.max(0, s - 1));
  const stepForward = () => setStep((s) => Math.min(events.length - 1, s + 1));

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <div className="badge">Dynamic Programming</div>
          <h1>DP Lesson</h1>
          <p className="description">Explore the DP formulation, state definition, and transition for this problem.</p>
        </div>
      </section>

      <section className="guide">
        <div className="guide-content">
          <div className="card">
            <div className="card-icon"><Boxes size={20} /></div>
            <h3>State Definition</h3>
            <p>Describe the DP state and recurrence here.</p>
          </div>
          <div className="card highlight">
            <div className="card-icon"><Layers3 size={20} /></div>
            <h3>Key Insight</h3>
            <p>Highlight the crucial observation or optimization.</p>
          </div>
        </div>
      </section>

      <section className="simulator">
        <div className="workspace">
          <aside className="movable-panel">
            <div className="panel-header"><Info size={16} /><h2>Controls</h2></div>
            <div className="control-row">
              <button className="icon-btn" onClick={reset} title="Reset"><RotateCcw size={16} /></button>
              <button className="icon-btn" onClick={stepBack} disabled={clampedStep === 0} title="Step Back"><StepBack size={16} /></button>
              <button className="icon-btn primary" onClick={() => setIsPlaying(p => !p)} title={isPlaying ? "Pause" : "Play"}>
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                <span>{isPlaying ? "Pause" : "Play"}</span>
              </button>
              <button className="icon-btn" onClick={stepForward} disabled={clampedStep >= events.length - 1} title="Step Forward"><StepForward size={16} /></button>
            </div>
            <div className="range-block"><label className="range-label">n</label><input type="range" min={2} max={18} value={n} onChange={e => setN(Number(e.target.value))} /><span className="range-val">{n}</span></div>
            <div className="range-block"><label className="range-label">speed</label><input type="range" min={120} max={700} step={20} value={speedMs} onChange={e => setSpeedMs(Number(e.target.value))} /><span className="range-val">{speedMs}ms</span></div>
            <div className="range-block"><label className="range-label">time</label><input type="range" min={0} max={Math.max(0, events.length - 1)} value={clampedStep} onChange={e => setStep(Number(e.target.value))} /><span className="range-val">{clampedStep}/{Math.max(0, events.length - 1)}</span></div>
          </aside>
          <div className="canvas-area">
            <div className="canvas-shell">
              <div className="canvas-column">
                <div className="canvas-label"><BarChart3 size={16} /> Visualization</div>
                {/* Placeholder for visual representation of DP state */}
                <div className="equation">{JSON.stringify(active)}</div>
              </div>
              <div className="canvas-column">
                <div className="canvas-label"><Layers3 size={16} /> Details</div>
                {/* Additional panels can be added here */}
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
        .hero h1 { font-size:56px; font-weight:900; margin-bottom:24px; }
        .description { font-size:18px; color:var(--text-dim); line-height:1.6; margin-bottom:40px; }
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
        .control-row { display:flex; gap:10px; flex-wrap:wrap; }
        .icon-btn { border:1px solid var(--border); background:var(--bg); color:var(--text); border-radius:14px; padding:10px 12px; display:flex; align-items:center; gap:8px; font-weight:800; cursor:pointer; }
        .icon-btn[disabled] { opacity:.45; cursor:not-allowed; }
        .icon-btn.primary { border-color:var(--accent); background:color-mix(in srgb, var(--accent) 10%, transparent); color:var(--accent-light); }
        .range-block { display:grid; grid-template-columns:46px 1fr auto; gap:10px; align-items:center; padding:10px 12px; border:1px solid var(--border); background:var(--bg); border-radius:14px; }
        .range-label { font-size:11px; text-transform:uppercase; color:var(--text-dim); font-weight:800; }
        input[type="range"] { width:100%; }
        .range-val { font-family:monospace; font-weight:900; color:var(--accent-light); }
        .canvas-area { background:color-mix(in srgb, var(--bg) 80%, transparent); border-radius:24px; border:1px solid var(--border); padding:24px; }
        .canvas-shell { display:grid; grid-template-columns:1fr 1fr; gap:24px; height:100%; }
        .canvas-column { background:var(--panel-light); border:1px solid var(--border); border-radius:20px; padding:20px; display:flex; flex-direction:column; gap:16px; }
        .canvas-label { display:flex; align-items:center; gap:10px; font-size:13px; text-transform:uppercase; letter-spacing:.05em; color:var(--text-dim); font-weight:900; }
        .equation { padding:14px 16px; border-radius:16px; background:var(--bg); border:1px solid var(--border); font-family:monospace; font-weight:900; color:var(--accent-light); line-height:1.4; }
      `}</style>
    </main>
  );
}
