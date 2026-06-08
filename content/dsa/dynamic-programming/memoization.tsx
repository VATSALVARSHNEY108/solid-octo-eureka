"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { DatabaseZap, Info, MousePointer2, Pause, Play, RotateCcw, SearchCheck, StepBack, StepForward } from "lucide-react";

type MemoEvent =
  | { type: "call"; n: number; stack: number[]; cache: Record<number, number | null> }
  | { type: "hit"; n: number; value: number; stack: number[]; cache: Record<number, number | null> }
  | { type: "store"; n: number; value: number; stack: number[]; cache: Record<number, number | null> }
  | { type: "return"; n: number; value: number; stack: number[]; cache: Record<number, number | null> };

const DEFAULT_N = 6;
const MAX_N = 10;

function initCache(n: number): Record<number, number | null> {
  const cache: Record<number, number | null> = {};
  for (let i = 0; i <= n; i += 1) cache[i] = null;
  return cache;
}

function buildMemoEvents(n: number): MemoEvent[] {
  const events: MemoEvent[] = [];
  const memo: Record<number, number | null> = initCache(n);
  memo[0] = 0;
  memo[1] = 1;

  const stack: number[] = [];
  const snapshot = () => ({ stack: [...stack], cache: { ...memo } });

  const solve = (k: number): number => {
    stack.push(k);
    events.push({ type: "call", n: k, ...snapshot() });

    const cached = memo[k];
    if (cached !== null && cached !== undefined) {
      events.push({ type: "hit", n: k, value: cached, ...snapshot() });
      stack.pop();
      events.push({ type: "return", n: k, value: cached, ...snapshot() });
      return cached;
    }

    const a = solve(k - 1);
    const b = solve(k - 2);
    const value = a + b;
    memo[k] = value;
    events.push({ type: "store", n: k, value, ...snapshot() });

    stack.pop();
    events.push({ type: "return", n: k, value, ...snapshot() });
    return value;
  };

  solve(n);
  return events;
}

export default function MemoizationLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";
  const [n, setN] = useState(DEFAULT_N);
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const [speedMs, setSpeedMs] = useState(260);

  const events = useMemo(() => buildMemoEvents(n), [n]);
  const clampedStep = Math.min(step, Math.max(0, events.length - 1));
  const active = events[clampedStep];

  useEffect(() => {
    setStep(0);
    setIsPlaying(false);
  }, [n]);

  useEffect(() => {
    if (!isPlaying) return;
    const t = setTimeout(() => {
      setStep((s) => {
        if (s >= events.length - 1) return s;
        return s + 1;
      });
    }, speedMs);
    return () => clearTimeout(t);
  }, [events.length, isPlaying, speedMs, clampedStep]);

  useEffect(() => {
    if (isPlaying && clampedStep >= events.length - 1) setIsPlaying(false);
  }, [clampedStep, events.length, isPlaying]);

  const reset = () => {
    setIsPlaying(false);
    setStep(0);
  };

  const stepBack = () => setStep((s) => Math.max(0, s - 1));
  const stepForward = () => setStep((s) => Math.min(events.length - 1, s + 1));

  const cacheKeys = useMemo(() => Object.keys(active.cache).map(Number).sort((a, b) => b - a), [active.cache]);
  const memoHits = useMemo(() => events.filter((e) => e.type === "hit").length, [events]);

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <div className="badge">Optimization Tool</div>
          <h1>Memoization</h1>
          <p className="description">
            Memoization is top-down dynamic programming. You keep the recursive structure,
            but before solving a state you first ask whether it is already computed. If yes, return the cached answer immediately.
          </p>
          <div className="complexity-grid">
            <div className="complexity-item"><span className="label">Style</span><span className="value">Top-down DP</span></div>
            <div className="complexity-item"><span className="label">Speedup</span><span className="value">Cache hits</span></div>
          </div>
        </div>
      </section>
      <section className="guide">
        <div className="guide-content">
          <div className="card"><div className="card-icon"><SearchCheck size={20} /></div><h3>Lookup First</h3><p>Every recursive call starts with a cache check. That single guard eliminates whole subtrees of repeated work.</p></div>
          <div className="card highlight"><div className="card-icon"><DatabaseZap size={20} /></div><h3>Store on Return</h3><p>Once a state is solved, save it. The next time recursion asks for the same state, you answer in O(1).</p></div>
        </div>
      </section>
      <section className="simulator">
        <div className="workspace">
          <aside className="movable-panel">
            <div className="panel-header"><Info size={16} /><h2>Cache Monitor</h2></div>
            <div className="status-message">
              Simulating memoized calls for <strong>F({n})</strong>. Scrub time, or hit play to watch the stack and cache evolve.
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
              <input type="range" min={120} max={700} step={20} value={speedMs} onChange={(e) => setSpeedMs(Number(e.target.value))} />
              <span className="range-val">{speedMs}ms</span>
            </div>

            <div className="range-block">
              <label className="range-label">time</label>
              <input type="range" min={0} max={Math.max(0, events.length - 1)} value={clampedStep} onChange={(e) => setStep(Number(e.target.value))} />
              <span className="range-val">{clampedStep}/{Math.max(0, events.length - 1)}</span>
            </div>

            <div className="stats-grid">
              <div className="stat-card"><span className="stat-label">Cached states</span><span className="stat-value">{Object.values(active.cache).filter((v) => v !== null).length}</span></div>
              <div className="stat-card"><span className="stat-label">Memo hits</span><span className="stat-value">{memoHits}</span></div>
              <div className="stat-card"><span className="stat-label">Event</span><span className="stat-value">{active.type}</span></div>
            </div>
            <div className="playback-controls" style={{ border: "none" }}><div className="tip"><MousePointer2 size={14} /><span>Advance until the cache fills, then repeated requests become instant hits</span></div></div>
          </aside>
          <div className="canvas-area">
            <div className="split">
              <div className="stack-panel">
                <div className="stack-header">Call Stack</div>
                <div className="stack-body">
                  {active.stack.length === 0 ? (
                    <div className="stack-empty">empty</div>
                  ) : (
                    active.stack
                      .slice()
                      .reverse()
                      .map((frame, idx) => (
                        <div key={`${frame}-${idx}`} className={idx === 0 ? "stack-frame active" : "stack-frame"}>
                          {`fib(${frame})`}
                        </div>
                      ))
                  )}
                </div>
              </div>

              <div className="cache-panel">
                <div className="cache-header">Memo Table</div>
                <div className="cache-grid">
                  {cacheKeys.map((state) => {
                    const value = active.cache[state];
                    const isCached = value !== null && value !== undefined;
                    const isActive = state === active.n;
                    return (
                      <div key={state} className={["cache-card", isCached ? "stored" : "empty", isActive ? "active" : ""].join(" ")}>
                        <span className="cache-key">memo[{state}]</span>
                        <strong>{isCached ? value : "?"}</strong>
                        <span className="cache-status">{isCached ? "stored" : "empty"}</span>
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
        .page { --bg:#0a0d14; --panel:#111827; --panel-light:#1f2937; --border:#2e3a4e; --text:#f3f4f6; --text-dim:#9ca3af; --accent:#4f46e5; --accent-light:#818cf8; --green:#10b981; min-height:100vh; background:var(--bg); color:var(--text); font-family:"Inter",system-ui,sans-serif; }
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
        input[type=\"range\"] { width:100%; }
        .range-val { font-family:monospace; font-weight:900; color:var(--accent-light); }
        .stats-grid { display:grid; gap:12px; } .stat-card { padding:14px 16px; background:var(--bg); border:1px solid var(--border); border-radius:14px; display:flex; flex-direction:column; gap:6px; } .stat-label { font-size:11px; text-transform:uppercase; color:var(--text-dim); } .stat-value { font-size:24px; font-weight:800; color:var(--accent-light); font-family:monospace; } .tip { display:flex; align-items:center; gap:8px; color:var(--text-dim); font-size:12px; font-style:italic; }
        .canvas-area { background:color-mix(in srgb, var(--bg) 80%, transparent); border-radius:24px; border:1px solid var(--border); padding:24px; }
        .split { display:grid; grid-template-columns:240px 1fr; gap:18px; }
        .stack-panel,.cache-panel { background:var(--panel-light); border:1px solid var(--border); border-radius:20px; overflow:hidden; display:flex; flex-direction:column; min-height:520px; }
        .stack-header,.cache-header { padding:14px 16px; border-bottom:1px solid var(--border); font-size:12px; text-transform:uppercase; letter-spacing:.06em; color:var(--text-dim); font-weight:900; background:color-mix(in srgb, var(--panel) 60%, transparent); }
        .stack-body { padding:16px; display:flex; flex-direction:column; gap:10px; overflow:auto; }
        .stack-empty { padding:14px; border:1px dashed var(--border); border-radius:14px; text-transform:uppercase; font-size:11px; color:var(--text-dim); text-align:center; }
        .stack-frame { padding:12px 12px; border-radius:14px; border:1px solid var(--border); background:var(--bg); font-family:monospace; font-weight:900; }
        .stack-frame.active { border-color:var(--accent); box-shadow:inset 0 0 0 1px color-mix(in srgb, var(--accent) 40%, transparent); color:var(--accent-light); }
        .cache-grid { padding:16px; display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:14px; overflow:auto; }
        .cache-card { min-height:138px; border-radius:18px; background:var(--bg); border:1px solid var(--border); display:flex; flex-direction:column; justify-content:space-between; padding:16px; }
        .cache-card.stored { border-color:color-mix(in srgb, var(--green) 30%, var(--border)); }
        .cache-card.active { border-color:var(--accent); box-shadow:0 0 0 1px color-mix(in srgb, var(--accent) 40%, transparent) inset; }
        .cache-key { font-size:11px; color:var(--text-dim); text-transform:uppercase; letter-spacing:.05em; }
        .cache-card strong { font-size:36px; font-family:monospace; color:var(--accent-light); }
        .cache-status { font-size:12px; text-transform:uppercase; color:var(--text-dim); }
        .workspace > aside,.workspace > .inspector-panel,.workspace > .side-panel,.workspace > .control-panel,.workspace > .visual-panel,.workspace > .data-panel { resize:both; overflow:auto; min-width:180px; min-height:140px; max-width:640px; max-height:720px; }
        @media (max-width:960px) { .guide-content,.workspace,.split { grid-template-columns:1fr; } .hero h1 { font-size:42px; } .stack-panel,.cache-panel { min-height:auto; } }
      `}</style>
    </main>
  );
}
