"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { Copy, GitBranch, Info, MousePointer2, Pause, Play, RotateCcw, StepBack, StepForward } from "lucide-react";

const DEFAULT_N = 7;
const MAX_N = 12;

type CallEvent = { n: number; path: number[] };

function buildNaiveCallEvents(n: number): CallEvent[] {
  const events: CallEvent[] = [];
  const path: number[] = [];

  const dfs = (k: number) => {
    path.push(k);
    events.push({ n: k, path: [...path] });
    if (k <= 1) {
      path.pop();
      return;
    }
    dfs(k - 1);
    dfs(k - 2);
    path.pop();
  };

  dfs(n);
  return events;
}

export default function OverlappingSubproblemsLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";
  const [n, setN] = useState(DEFAULT_N);
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const [speedMs, setSpeedMs] = useState(55);
  const [hoverState, setHoverState] = useState<number | null>(null);

  const events = useMemo(() => buildNaiveCallEvents(n), [n]);
  const clampedStep = Math.min(step, Math.max(0, events.length - 1));
  const active = events[clampedStep] ?? { n, path: [n] };

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
  }, [clampedStep, events.length, isPlaying, speedMs]);

  useEffect(() => {
    if (isPlaying && clampedStep >= events.length - 1) setIsPlaying(false);
  }, [clampedStep, events.length, isPlaying]);

  const counts = useMemo(() => {
    const map = new Map<number, number>();
    for (const e of events) map.set(e.n, (map.get(e.n) ?? 0) + 1);
    return map;
  }, [events]);

  const entries = useMemo(() => {
    const list = Array.from(counts.entries()).map(([state, count]) => ({ state, count }));
    list.sort((a, b) => b.state - a.state);
    return list;
  }, [counts]);

  const duplicatedStates = useMemo(() => entries.filter((e) => e.count > 1).length, [entries]);
  const worstRepeat = useMemo(() => Math.max(1, ...entries.map((e) => e.count)), [entries]);
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
          <div className="badge">Recognition Pattern</div>
          <h1>Overlapping Subproblems</h1>
          <p className="description">
            A problem has overlapping subproblems when the recursion tree revisits the same
            smaller state multiple times. That repetition is the signal that memoization or tabulation can pay off.
          </p>
          <div className="complexity-grid">
            <div className="complexity-item"><span className="label">Signal</span><span className="value">Duplicates</span></div>
            <div className="complexity-item"><span className="label">Action</span><span className="value">Cache once</span></div>
          </div>
        </div>
      </section>
      <section className="guide">
        <div className="guide-content">
          <div className="card"><div className="card-icon"><GitBranch size={20} /></div><h3>Recursion Tree View</h3><p>If the same node label appears again and again in different branches, you are paying for the same reasoning more than once.</p></div>
          <div className="card highlight"><div className="card-icon"><Copy size={20} /></div><h3>DP Trigger</h3><p>Duplicate states mean you can replace branch repetition with one stored answer per unique state.</p></div>
        </div>
      </section>
      <section className="simulator">
        <div className="workspace">
          <aside className="movable-panel">
            <div className="panel-header"><Info size={16} /><h2>Overlap Scanner</h2></div>
            <div className="status-message">
              Watching a naive recursion walk the tree for <strong>F({n})</strong>. The counter heats up whenever a subproblem is revisited.
            </div>

            <div className="control-row">
              <button className="icon-btn" onClick={reset} title="Reset"><RotateCcw size={16} /></button>
              <button className="icon-btn" onClick={stepBack} disabled={clampedStep === 0} title="Step Back"><StepBack size={16} /></button>
              <button className="icon-btn primary" onClick={() => setIsPlaying((p) => !p)} title={isPlaying ? "Pause" : "Play"}>
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                <span>{isPlaying ? "Pause" : "Play"}</span>
              </button>
              <button className="icon-btn" onClick={stepForward} disabled={clampedStep >= events.length - 1} title="Step Forward"><StepForward size={16} /></button>
            </div>

            <div className="range-block">
              <label className="range-label">n</label>
              <input type="range" min={2} max={MAX_N} value={n} onChange={(e) => setN(Number(e.target.value))} />
              <span className="range-val">{n}</span>
            </div>
            <div className="range-block">
              <label className="range-label">speed</label>
              <input type="range" min={20} max={160} step={5} value={speedMs} onChange={(e) => setSpeedMs(Number(e.target.value))} />
              <span className="range-val">{speedMs}ms</span>
            </div>
            <div className="range-block">
              <label className="range-label">time</label>
              <input type="range" min={0} max={Math.max(0, events.length - 1)} value={clampedStep} onChange={(e) => setStep(Number(e.target.value))} />
              <span className="range-val">{clampedStep}/{Math.max(0, events.length - 1)}</span>
            </div>

            <div className="stats-grid">
              <div className="stat-card"><span className="stat-label">Unique states</span><span className="stat-value">{entries.length}</span></div>
              <div className="stat-card"><span className="stat-label">States repeated</span><span className="stat-value">{duplicatedStates}</span></div>
              <div className="stat-card"><span className="stat-label">Worst repetition</span><span className="stat-value">{worstRepeat}x</span></div>
            </div>
            <div className="playback-controls" style={{ border: "none" }}><div className="tip"><MousePointer2 size={14} /><span>The hottest rows are exactly the states memoization should cache</span></div></div>
          </aside>
          <div className="canvas-area">
            <div className="canvas-shell">
              <div className="path-panel">
                <div className="path-header">Active Path</div>
                <div className="path-body">
                  {active.path.slice().reverse().map((k, idx) => (
                    <div key={`${k}-${idx}`} className={idx === 0 ? "path-chip active" : "path-chip"}>
                      F({k})
                    </div>
                  ))}
                </div>
              </div>

              <div className="heat-panel">
                <div className="heat-header">Heat Map (Call Counts)</div>
                <div className="heat-grid">
                  {entries.map((entry) => {
                    const isHot = entry.count > 1;
                    const isActive = entry.state === active.n;
                    const isHover = hoverState === entry.state;
                    return (
                      <div
                        key={entry.state}
                        className={["heat-row", isActive ? "active" : "", isHover ? "hover" : ""].join(" ")}
                        onMouseEnter={() => setHoverState(entry.state)}
                        onMouseLeave={() => setHoverState(null)}
                      >
                        <div className="heat-meta">
                          <span className="state-name">F({entry.state})</span>
                          <span className="state-count">{entry.count} calls</span>
                        </div>
                        <div className="heat-bar-shell">
                          <div
                            className={isHot ? "heat-bar active" : "heat-bar"}
                            style={{ width: `${(entry.count / worstRepeat) * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <style jsx>{`
        .page { --bg:#0a0d14; --panel:#111827; --panel-light:#1f2937; --border:#2e3a4e; --text:#f3f4f6; --text-dim:#9ca3af; --accent:#4f46e5; --accent-light:#818cf8; --amber:#f59e0b; min-height:100vh; background:var(--bg); color:var(--text); font-family:"Inter",system-ui,sans-serif; }
        .page[data-theme="light"] { --bg:#f8fafc; --panel:#ffffff; --panel-light:#f1f5f9; --border:#e2e8f0; --text:#0f172a; --text-dim:#64748b; --accent:#4f46e5; --accent-light:#6366f1; }
        .hero { padding:80px 24px; text-align:center; border-bottom:1px solid var(--border); } .hero .content-width { max-width:820px; margin:0 auto; } .badge { display:inline-block; padding:4px 12px; background:color-mix(in srgb, var(--accent) 15%, transparent); color:var(--accent-light); border-radius:999px; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:.05em; margin-bottom:16px; } .hero h1 { font-size:56px; font-weight:900; letter-spacing:-.02em; margin-bottom:24px; } .description { font-size:18px; color:var(--text-dim); line-height:1.6; margin-bottom:40px; } .complexity-grid { display:flex; justify-content:center; gap:40px; flex-wrap:wrap; } .complexity-item { display:flex; flex-direction:column; align-items:center; } .complexity-item .label { font-size:12px; font-weight:600; text-transform:uppercase; color:var(--text-dim); margin-bottom:4px; } .complexity-item .value { font-size:24px; font-weight:800; color:var(--accent-light); font-family:monospace; }
        .guide { padding:60px 24px; background:color-mix(in srgb, var(--panel) 50%, transparent); } .guide-content { max-width:1200px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; gap:40px; } .card { padding:48px; background:var(--panel); border:1px solid var(--border); border-radius:24px; } .card.highlight { border-color:var(--accent); background:color-mix(in srgb, var(--accent) 5%, var(--panel)); } .card-icon { width:40px; height:40px; border-radius:12px; background:color-mix(in srgb, var(--accent) 15%, transparent); color:var(--accent-light); display:flex; align-items:center; justify-content:center; margin-bottom:20px; } .card h3 { font-size:20px; font-weight:700; margin-bottom:12px; } .card p { color:var(--text-dim); font-size:14px; line-height:1.6; }
        .simulator { padding:60px 24px; } .workspace { max-width:1400px; margin:0 auto; display:grid; grid-template-columns:340px 1fr; gap:48px; background:var(--panel); padding:48px; border-radius:32px; border:1px solid var(--border); box-shadow:0 25px 50px -12px rgba(0,0,0,.5); } aside { display:flex; flex-direction:column; gap:16px; } .panel-header { display:flex; align-items:center; gap:12px; color:var(--text-dim); } .panel-header h2 { font-size:14px; font-weight:700; text-transform:uppercase; letter-spacing:.05em; } .status-message { padding:18px; background:var(--panel-light); border-radius:16px; border:1px solid var(--border); font-size:14px; line-height:1.5; color:var(--text); font-weight:500; }
        .control-row { display:flex; gap:10px; flex-wrap:wrap; }
        .icon-btn { border:1px solid var(--border); background:var(--bg); color:var(--text); border-radius:14px; padding:10px 12px; display:flex; align-items:center; gap:8px; font-weight:800; cursor:pointer; }
        .icon-btn[disabled] { opacity:.45; cursor:not-allowed; }
        .icon-btn.primary { border-color:var(--accent); background:color-mix(in srgb, var(--accent) 10%, transparent); color:var(--accent-light); }
        .range-block { display:grid; grid-template-columns:46px 1fr auto; gap:10px; align-items:center; padding:10px 12px; border:1px solid var(--border); background:var(--bg); border-radius:14px; }
        .range-label { font-size:11px; text-transform:uppercase; color:var(--text-dim); font-weight:800; }
        input[type="range"] { width:100%; }
        .range-val { font-family:monospace; font-weight:900; color:var(--accent-light); }
        .stats-grid { display:grid; gap:12px; } .stat-card { padding:14px 16px; background:var(--bg); border:1px solid var(--border); border-radius:14px; display:flex; flex-direction:column; gap:6px; } .stat-label { font-size:11px; text-transform:uppercase; color:var(--text-dim); } .stat-value { font-size:24px; font-weight:800; color:var(--accent-light); font-family:monospace; } .tip { display:flex; align-items:center; gap:8px; color:var(--text-dim); font-size:12px; font-style:italic; }
        .canvas-area { background:color-mix(in srgb, var(--bg) 80%, transparent); border-radius:24px; border:1px solid var(--border); padding:20px; }
        .canvas-shell { display:grid; grid-template-columns:240px 1fr; gap:16px; min-height:520px; }
        .path-panel,.heat-panel { background:var(--panel-light); border:1px solid var(--border); border-radius:20px; overflow:hidden; display:flex; flex-direction:column; }
        .path-header,.heat-header { padding:14px 16px; border-bottom:1px solid var(--border); font-size:12px; text-transform:uppercase; letter-spacing:.06em; color:var(--text-dim); font-weight:900; background:color-mix(in srgb, var(--panel) 60%, transparent); }
        .path-body { padding:16px; display:flex; flex-direction:column; gap:10px; overflow:auto; }
        .path-chip { padding:10px 12px; border-radius:14px; border:1px solid var(--border); background:var(--bg); font-family:monospace; font-weight:900; }
        .path-chip.active { border-color:var(--accent); color:var(--accent-light); box-shadow:inset 0 0 0 1px color-mix(in srgb, var(--accent) 40%, transparent); }
        .heat-grid { padding:16px; display:grid; gap:14px; overflow:auto; }
        .heat-row { display:grid; grid-template-columns:120px 1fr; gap:14px; align-items:center; padding:12px; border-radius:16px; border:1px solid var(--border); background:var(--bg); transition:transform .12s ease, border-color .12s ease; cursor:default; }
        .heat-row.hover { transform:translateY(-1px); border-color:color-mix(in srgb, var(--accent) 35%, var(--border)); }
        .heat-row.active { border-color:var(--accent); box-shadow:inset 0 0 0 1px color-mix(in srgb, var(--accent) 40%, transparent); }
        .heat-meta { display:flex; flex-direction:column; gap:4px; }
        .state-name { font-family:monospace; font-size:15px; font-weight:900; color:var(--text); }
        .state-count { font-size:11px; color:var(--text-dim); text-transform:uppercase; }
        .heat-bar-shell { min-height:42px; border-radius:14px; background:var(--panel-light); border:1px solid var(--border); overflow:hidden; }
        .heat-bar { height:100%; min-width:6%; background:linear-gradient(90deg,var(--accent),var(--accent-light)); opacity:.55; }
        .heat-bar.active { background:linear-gradient(90deg,var(--amber),#fb7185); opacity:.9; }
        .workspace > aside,.workspace > .inspector-panel,.workspace > .side-panel,.workspace > .control-panel,.workspace > .visual-panel,.workspace > .data-panel { resize:both; overflow:auto; min-width:180px; min-height:140px; max-width:640px; max-height:720px; }
        @media (max-width:960px) { .guide-content,.workspace,.canvas-shell { grid-template-columns:1fr; } .heat-row { grid-template-columns:1fr; } .hero h1 { font-size:42px; } }
      `}</style>
    </main>
  );
}
