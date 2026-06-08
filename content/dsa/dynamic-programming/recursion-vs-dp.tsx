"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import {
  ArrowRightLeft,
  Clock3,
  Info,
  Layers3,
  MousePointer2,
  Pause,
  Play,
  RotateCcw,
  StepBack,
  StepForward,
} from "lucide-react";

const DEFAULT_N = 8;
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

type FillEvent = {
  i: number;
  table: number[];
  prev2: number;
  prev1: number;
  value: number;
};

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

function clampInt(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export default function RecursionVsDpLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [n, setN] = useState(DEFAULT_N);
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const [speedMs, setSpeedMs] = useState(55);

  const recursionEvents = useMemo(() => buildNaiveCallEvents(n), [n]);
  const dpEvents = useMemo(() => buildFibFillEvents(n), [n]);

  const maxSteps = Math.max(0, Math.max(recursionEvents.length - 1, dpEvents.length - 1));
  const clampedStep = clampInt(step, 0, maxSteps);

  const recIndex = useMemo(() => {
    if (maxSteps === 0) return 0;
    const idx = Math.floor((clampedStep / maxSteps) * Math.max(0, recursionEvents.length - 1));
    return clampInt(idx, 0, Math.max(0, recursionEvents.length - 1));
  }, [clampedStep, maxSteps, recursionEvents.length]);

  const dpIndex = useMemo(() => {
    if (maxSteps === 0) return 0;
    const idx = Math.floor((clampedStep / maxSteps) * Math.max(0, dpEvents.length - 1));
    return clampInt(idx, 0, Math.max(0, dpEvents.length - 1));
  }, [clampedStep, maxSteps, dpEvents.length]);

  const recActive = recursionEvents[recIndex] ?? { n, path: [n] };
  const dpActive = dpEvents[dpIndex] ?? dpEvents[dpEvents.length - 1];
  const dpTable = dpActive?.table ?? [0, 1];

  useEffect(() => {
    setStep(0);
    setIsPlaying(false);
  }, [n]);

  useEffect(() => {
    if (!isPlaying) return;
    const t = setTimeout(() => {
      setStep((s) => (s >= maxSteps ? s : s + 1));
    }, speedMs);
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

  const memoStates = n + 1;
  const recursionCalls = recursionEvents.length;
  const answer = dpTable[n] ?? dpTable[dpTable.length - 1];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <div className="badge">Decision Framework</div>
          <h1>Recursion vs DP</h1>
          <p className="description">
            Recursion describes the structure. DP keeps the structure but eliminates repeated
            subcalls by storing each distinct state once. Same recurrence, different cost.
          </p>
          <div className="complexity-grid">
            <div className="complexity-item">
              <span className="label">Recursion</span>
              <span className="value">Branching</span>
            </div>
            <div className="complexity-item">
              <span className="label">DP</span>
              <span className="value">Compression</span>
            </div>
          </div>
        </div>
      </section>

      <section className="guide">
        <div className="guide-content">
          <div className="card">
            <div className="card-icon">
              <Clock3 size={20} />
            </div>
            <h3>Plain Recursion</h3>
            <p>Walks a tree of calls. Duplicate subcalls appear across branches.</p>
          </div>
          <div className="card highlight">
            <div className="card-icon">
              <Layers3 size={20} />
            </div>
            <h3>DP Upgrade</h3>
            <p>Stores each state once and reuses it. The tree collapses into a table.</p>
          </div>
        </div>
      </section>

      <section className="simulator">
        <div className="workspace">
          <aside className="movable-panel">
            <div className="panel-header">
              <Info size={16} />
              <h2>Sync Timeline</h2>
            </div>

            <div className="status-message">
              This timeline scrubs both views: recursion’s call path and DP’s fill frontier for{" "}
              <strong>F({n})</strong>.
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
              <input type="range" min={0} max={maxSteps} value={clampedStep} onChange={(e) => setStep(Number(e.target.value))} />
              <span className="range-val">{clampedStep}/{maxSteps}</span>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">Answer</span>
                <span className="stat-value">{answer}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Recursive calls</span>
                <span className="stat-value">{recursionCalls}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">DP states</span>
                <span className="stat-value">{memoStates}</span>
              </div>
            </div>

            <div className="playback-controls" style={{ border: "none" }}>
              <div className="tip">
                <MousePointer2 size={14} />
                <span>Scrub: recursion path changes while DP fill advances smoothly</span>
              </div>
            </div>
          </aside>

          <div className="canvas-area">
            <div className="canvas-shell">
              <div className="panel">
                <div className="panel-title">
                  <Clock3 size={16} />
                  <span>Recursion (Active Path)</span>
                </div>
                <div className="path">
                  {recActive.path
                    .slice()
                    .reverse()
                    .map((k, idx) => (
                      <div key={`${k}-${idx}`} className={idx === 0 ? "chip active" : "chip"}>
                        F({k})
                      </div>
                    ))}
                </div>
                <div className="meta">
                  <span>call index</span>
                  <b>{recIndex}/{Math.max(0, recursionEvents.length - 1)}</b>
                </div>
              </div>

              <div className="panel">
                <div className="panel-title">
                  <Layers3 size={16} />
                  <span>DP (Fill Frontier)</span>
                </div>
                <div className="equation">
                  dp[{dpActive.i}] = dp[{Math.max(0, dpActive.i - 1)}] + dp[{Math.max(0, dpActive.i - 2)}] = {dpActive.prev1} + {dpActive.prev2}
                </div>
                <div className="table-grid">
                  {Array.from({ length: n + 1 }, (_, index) => {
                    const value = dpTable[index];
                    const isFilled = value !== undefined;
                    const isActive = index === dpActive.i;
                    const isDep = index === dpActive.i - 1 || index === dpActive.i - 2;
                    return (
                      <div key={index} className={["cell", isActive ? "active" : "", isDep ? "dep" : "", !isFilled ? "empty" : ""].join(" ")}>
                        <span className="idx">dp[{index}]</span>
                        <span className="val">{isFilled ? value : "?"}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="meta">
                  <span>fill index</span>
                  <b>{dpIndex}/{Math.max(0, dpEvents.length - 1)}</b>
                </div>
              </div>
            </div>

            <div className="bridge">
              <ArrowRightLeft size={18} />
              <span>DP removes repeated subcalls by caching states</span>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .page { --bg:#0a0d14; --panel:#111827; --panel-light:#1f2937; --border:#2e3a4e; --text:#f3f4f6; --text-dim:#9ca3af; --accent:#4f46e5; --accent-light:#818cf8; --green:#10b981; --red:#ef4444; min-height:100vh; background:var(--bg); color:var(--text); font-family:"Inter",system-ui,sans-serif; }
        .page[data-theme="light"] { --bg:#f8fafc; --panel:#ffffff; --panel-light:#f1f5f9; --border:#e2e8f0; --text:#0f172a; --text-dim:#64748b; --accent:#4f46e5; --accent-light:#6366f1; }
        .hero { padding:80px 24px; text-align:center; border-bottom:1px solid var(--border); }
        .hero .content-width { max-width:820px; margin:0 auto; }
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
        .stat-value { font-size:24px; font-weight:800; color:var(--accent-light); font-family:monospace; }
        .tip { display:flex; align-items:center; gap:8px; color:var(--text-dim); font-size:12px; font-style:italic; }
        .canvas-area { background:color-mix(in srgb, var(--bg) 80%, transparent); border-radius:24px; border:1px solid var(--border); padding:24px; display:flex; flex-direction:column; gap:16px; }
        .canvas-shell { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        .panel { background:var(--panel-light); border:1px solid var(--border); border-radius:20px; padding:18px; display:flex; flex-direction:column; gap:14px; min-height:420px; }
        .panel-title { display:flex; align-items:center; gap:10px; font-size:12px; text-transform:uppercase; letter-spacing:.06em; color:var(--text-dim); font-weight:900; }
        .path { display:flex; flex-direction:column; gap:10px; padding:6px; border-radius:16px; background:color-mix(in srgb, var(--panel) 50%, transparent); border:1px solid var(--border); min-height:260px; overflow:auto; }
        .chip { padding:10px 12px; border-radius:14px; border:1px solid var(--border); background:var(--bg); font-family:monospace; font-weight:900; }
        .chip.active { border-color:var(--accent); color:var(--accent-light); box-shadow:inset 0 0 0 1px color-mix(in srgb, var(--accent) 40%, transparent); }
        .equation { padding:12px 14px; border-radius:16px; background:var(--bg); border:1px solid var(--border); font-family:monospace; font-weight:900; color:var(--accent-light); line-height:1.4; }
        .table-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(96px, 1fr)); gap:10px; }
        .cell { padding:12px; border-radius:16px; background:var(--bg); border:1px solid var(--border); display:flex; flex-direction:column; gap:8px; }
        .cell.active { border-color:var(--accent); box-shadow:inset 0 0 0 1px color-mix(in srgb, var(--accent) 40%, transparent); transform:translateY(-1px); }
        .cell.dep { border-color:color-mix(in srgb, var(--green) 22%, var(--border)); }
        .cell.empty { opacity:.65; }
        .idx { font-size:11px; text-transform:uppercase; color:var(--text-dim); font-weight:800; }
        .val { font-size:22px; font-family:monospace; font-weight:900; color:var(--green); }
        .meta { display:flex; justify-content:space-between; align-items:center; color:var(--text-dim); font-size:11px; text-transform:uppercase; letter-spacing:.06em; }
        .meta b { font-family:monospace; color:var(--accent-light); font-size:14px; }
        .bridge { display:flex; align-items:center; gap:10px; padding:14px 16px; background:color-mix(in srgb, var(--accent) 7%, transparent); border:1px solid color-mix(in srgb, var(--accent) 25%, var(--border)); border-radius:16px; color:var(--accent-light); font-weight:900; text-transform:uppercase; letter-spacing:.06em; font-size:12px; }
        @media (max-width:960px) { .guide-content,.workspace,.canvas-shell { grid-template-columns:1fr; } .hero h1 { font-size:42px; } }
      `}</style>
    </main>
  );
}

