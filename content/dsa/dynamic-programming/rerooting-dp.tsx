"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

// Rerooting DP (e.g., Sum of Distances in Tree)

interface RerootStep {
  type: string;
  node: number;
  parent: number | null;
  val: number;
  message: string;
  line?: number;
}

function simulateRerooting(): RerootStep[] {
  const steps: RerootStep[] = [];
  
  // Minimal tree: 0-1-2
  steps.push({ type: "info", node: -1, parent: null, val: 0, message: "Phase 1: Precompute (DFS 1) to find subtree sizes and initial root answer.", line: 0 });
  
  steps.push({ type: "dfs1", node: 0, parent: null, val: 3, message: "DFS 1 at Root 0. Subtree size is 3. Sum of distances is 3.", line: 1 });
  steps.push({ type: "dfs1", node: 1, parent: 0, val: 2, message: "DFS 1 at Node 1. Subtree size is 2.", line: 2 });
  steps.push({ type: "dfs1", node: 2, parent: 1, val: 1, message: "DFS 1 at Node 2. Subtree size is 1.", line: 3 });

  steps.push({ type: "info", node: -1, parent: null, val: 0, message: "Phase 2: Rerooting (DFS 2). Shift root from parent to child.", line: 4 });

  steps.push({ type: "dfs2", node: 1, parent: 0, val: 2, message: "Rerooting from 0 to 1. Nodes moving closer: 2 (subtree size). Nodes moving further: 1 (N - size). Result: 3 - 2 + 1 = 2.", line: 5 });
  
  steps.push({ type: "dfs2", node: 2, parent: 1, val: 3, message: "Rerooting from 1 to 2. Nodes moving closer: 1 (size). Nodes moving further: 2 (N - size). Result: 2 - 1 + 2 = 3.", line: 6 });

  steps.push({ type: "done", node: -1, parent: null, val: 0, message: "Done. We computed the answer for ALL nodes in O(N) instead of O(N²).", line: 7 });

  return steps;
}

export default function RerootingDPLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const timerRef = useRef<number | null>(null);

  const steps = useMemo(() => simulateRerooting(), []);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];

  useEffect(() => {
    if (!playing) return;
    timerRef.current = window.setInterval(() => {
      setStepIndex((cur) => {
        if (cur >= steps.length - 1) {
          setPlaying(false);
          return cur;
        }
        return cur + 1;
      });
    }, speed);
    return () => window.clearInterval(timerRef.current as number);
  }, [playing, speed, steps.length]);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.1;
    utter.pitch = 1;
    window.speechSynthesis.speak(utter);
  }, []);

  useEffect(() => {
    if (isSpeechEnabled && step) {
      speak(step.message);
    }
  }, [step, isSpeechEnabled, speak]);

  const codeSnippet = [
    "// Phase 1: Post-order DFS",
    "function dfs1(u, p) {",
    "  for (let v of adj[u]) {",
    "    if (v === p) continue;",
    "    dfs1(v, u);",
    "    count[u] += count[v];",
    "    ans[u] += ans[v] + count[v];",
    "  }",
    "}",
    "// Phase 2: Pre-order DFS (Rerooting)",
    "function dfs2(u, p) {",
    "  for (let v of adj[u]) {",
    "    if (v === p) continue;",
    "    // Shift root from u to v",
    "    ans[v] = ans[u] - count[v] + (N - count[v]);",
    "    dfs2(v, u);",
    "  }",
    "}"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Dynamic Programming • Trees</span>
          <h1>Rerooting DP</h1>
          <p className="description">An advanced tree DP technique to compute an answer for ALL nodes acting as the root in O(N) time, rather than the naive O(N²).</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(N)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(N)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>
      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>Overview</h2><p>If you need to find something like "Sum of Distances to all nodes" for EVERY node in a tree, running a DFS from every node takes O(N²). Rerooting DP does it in O(N).</p></article>
          <article className="guide-card"><h2>Phase 1: Precompute</h2><p>Run a standard post-order DFS starting from an arbitrary root (e.g., node 0). Calculate the answer just for this root, and also compute auxiliary data like subtree sizes.</p></article>
          <article className="guide-card"><h2>Phase 2: Shift Root</h2><p>Run a second, pre-order DFS. When you move the root from node `u` down to its child `v`, you don't recompute from scratch. You just adjust `u`'s answer based on the shift.</p></article>
          <article className="guide-card highlight"><h2>The Adjustment</h2><p>When shifting root to `v`, all nodes in `v`'s subtree get 1 step closer (subtract `count[v]`). All other nodes in the tree get 1 step further (add `N - count[v]`).</p></article>
        </div>
      </section>
      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to watch the 2-Phase process: DFS1 aggregates data upwards, DFS2 pushes rerooted answers downwards.</span>
              </div>
              <h2>Current Step</h2>
              <p>{step?.message || "Ready."}</p>
              
              <div className="controls">
                <button onClick={() => setStepIndex(0)}>|&lt;</button>
                <button onClick={() => setStepIndex((i) => Math.max(0, i - 1))}>&lt;</button>
                <button onClick={() => setPlaying((p) => !p)}>{playing ? "Pause" : "Play"}</button>
                <button onClick={() => setStepIndex((i) => Math.min(steps.length - 1, i + 1))}>&gt;</button>
                <button onClick={() => setStepIndex(steps.length - 1)}>&gt;|</button>
                <button onClick={() => setIsSpeechEnabled(!isSpeechEnabled)} className={isSpeechEnabled ? "active" : ""} title="Toggle Voice Narration">
                  {isSpeechEnabled ? "🔊" : "🔇"}
                </button>
              </div>
              <label>Speed<input type="range" min="150" max="2500" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} /></label>
              <label>Timeline<input type="range" min="0" max={Math.max(0, steps.length - 1)} value={stepIndex} onChange={(e) => { setPlaying(false); setStepIndex(Number(e.target.value)); }} /></label>
              <p className="counter">{stepIndex + 1} / {steps.length}</p>
            </aside>
            <div className="canvas" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
               
               <div style={{ position: 'relative', width: '200px', height: '240px', margin: '0 auto' }}>
                 <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
                   <line x1="100" y1="30" x2="100" y2="100" stroke={step.type === "dfs1" ? "var(--blue)" : "var(--amber)"} strokeWidth="3" />
                   <line x1="100" y1="100" x2="100" y2="170" stroke={step.type === "dfs1" ? "var(--blue)" : "var(--amber)"} strokeWidth="3" />
                 </svg>

                 {[0, 1, 2].map(id => {
                   const pos = id === 0 ? 10 : id === 1 ? 80 : 150;
                   const isActive = step.node === id;
                   
                   let bg = 'var(--panel)';
                   let border = 'var(--border)';
                   if (isActive) {
                     bg = step.type === "dfs1" ? 'color-mix(in srgb, var(--blue) 20%, transparent)' : 'color-mix(in srgb, var(--amber) 20%, transparent)';
                     border = step.type === "dfs1" ? 'var(--blue)' : 'var(--amber)';
                   }

                   return (
                     <div key={id} style={{
                       position: 'absolute', top: `${pos}px`, left: '80px',
                       width: '40px', height: '40px', borderRadius: '50%',
                       display: 'flex', alignItems: 'center', justifyContent: 'center',
                       background: bg, border: `3px solid ${border}`, zIndex: 1,
                       fontWeight: 'bold', transition: 'all 0.3s'
                     }}>
                       {id}
                     </div>
                   );
                 })}
               </div>
               
               <div style={{ display: 'flex', justifyContent: 'center', height: '200px', marginTop: 'auto' }}>
                 <CodeTracker code={codeSnippet} activeLine={step.line || 0} />
               </div>
            </div>
          </div>
        </div>
      </section>
      <style jsx>{`
        .page { --bg: #0a0d14; --panel: #111827; --panel2: #172033; --border: #2b3447; --text: #e5e7eb; --muted: #98a2b3; --blue: #4f7ef8; --green: #35c486; --amber: #f5a623; --red: #ef4444; min-height: 100vh; background: var(--bg); color: var(--text); font-family: Arial, sans-serif; }
        .page[data-theme="light"] { --bg: #f7f9fc; --panel: #ffffff; --panel2: #edf2f7; --border: #d7deea; --text: #172033; --muted: #526174; --blue: #285bd6; --green: #087f5b; --amber: #b76705; --red: #c92a2a; }
        .hero { padding: 120px 24px 80px; background: radial-gradient(circle at 10% 20%, #4f7ef810, transparent 40%), radial-gradient(circle at 90% 80%, #35c48608, transparent 40%), var(--bg); border-bottom: 1px solid var(--border); }
        .hero h1 { margin: 16px 0; font-size: clamp(48px, 9vw, 92px); font-weight: 800; letter-spacing: -0.04em; line-height: 0.95; background: linear-gradient(to bottom right, var(--text), var(--muted)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 2px 10px rgba(0,0,0,0.1)); }
        .eyebrow { font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--blue); }
        .content-width { max-width: 1200px; margin: 0 auto; }
        .description { font-size: 19px; max-width: 800px; margin: 24px 0 40px; line-height: 1.6; color: var(--muted); }
        .complexity-tag-group { display: flex; gap: 16px; margin-bottom: 48px; }
        .complexity-tag { background: var(--panel); border: 1px solid var(--border); padding: 12px 20px; border-radius: 12px; display: flex; flex-direction: column; gap: 4px; }
        .complexity-tag .label { font-size: 11px; text-transform: uppercase; color: var(--muted); }
        .complexity-tag .value { font-size: 20px; font-weight: 700; color: var(--blue); font-family: monospace; }
        .actions, .editor, .controls { display: flex; flex-wrap: wrap; gap: 8px; }
        button, a, input, select, textarea { border: 1px solid var(--border); border-radius: 8px; background: var(--panel2); color: var(--text); min-height: 38px; padding: 8px 12px; }
        button { cursor: pointer; display: flex; align-items: center; justify-content: center; }
        button.active { border-color: var(--blue); color: var(--blue); background: color-mix(in srgb, var(--blue) 14%, transparent); }
        .primary-btn { background: var(--blue); color: white; padding: 14px 32px; font-weight: 600; border-radius: 100px; transition: all 0.3s; box-shadow: 0 4px 14px 0 rgba(79,126,248,0.39); display: inline-flex; text-decoration: none; }
        .primary-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(79,126,248,0.5); filter: brightness(1.1); }
        .detailed-guide { width: min(1120px, calc(100% - 80px)); margin: 0 auto; padding: 100px 0; }
        .guide-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 40px; margin-bottom: 80px; }
        .guide-card { background: var(--panel); border: 1px solid var(--border); border-radius: 16px; padding: 48px; transition: transform 0.3s, border-color 0.3s; }
        .guide-card:hover { transform: translateY(-4px); border-color: var(--blue); }
        .guide-card h2 { font-size: 18px; margin: 0 0 16px 0; color: var(--text); }
        .guide-card p { font-size: 14px; line-height: 1.7; color: var(--muted); }
        .guide-card.highlight { background: linear-gradient(135deg, var(--panel), var(--panel2)); border-bottom: 4px solid var(--blue); }
        .simulator { padding: 60px 0 100px; margin-top: 40px; border-top: 1px solid var(--border); }
        .workspace { display: grid; grid-template-columns: 340px 1fr; gap: 40px; padding: 40px; background: var(--panel); border: 1px solid var(--border); border-radius: 16px; box-shadow: 0 20px 50px -20px rgba(0,0,0,0.5); margin-top: 24px; }
        aside { min-width: 0; display: flex; flex-direction: column; gap: 12px; }
        .simulation-data { display: flex; flex-direction: column; gap: 16px; margin-top: 16px; }
        .data-group h3 { font-size: 11px; text-transform: uppercase; color: var(--muted); letter-spacing: 0.05em; margin-bottom: 8px; }
        label { display: grid; gap: 6px; margin-top: 12px; color: var(--muted); font-size: 13px; }
        .counter { font-family: monospace; }
        .gesture-hint { background: var(--panel2); border: 1px solid var(--border); border-radius: 8px; padding: 12px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 4px; font-size: 11px; color: var(--muted); }
        @media (max-width: 900px) { .workspace { grid-template-columns: 1fr; } }
      `}</style>
    </main>
  );
}
