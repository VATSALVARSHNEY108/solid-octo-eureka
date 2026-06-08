"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

// Traveling Salesperson Problem (TSP) using Bitmask DP
interface TSPStep {
  type: string;
  u: number;
  mask: number;
  v: number;
  message: string;
  line?: number;
}

function simulateTSP(): TSPStep[] {
  const steps: TSPStep[] = [];
  const N = 3;
  const dist = [
    [0, 10, 15],
    [10, 0, 20],
    [15, 20, 0]
  ];
  
  steps.push({ type: "init", u: 0, mask: 1, v: -1, message: "Start at Node 0. Mask = 001 (Node 0 visited). Goal: Visit all nodes exactly once and return to 0.", line: 0 });

  // Simulate just a few key transitions conceptually
  steps.push({ type: "dfs", u: 0, mask: 1, v: -1, message: "From Node 0 (Mask 001), try visiting unvisited nodes: Node 1 and Node 2.", line: 1 });
  
  steps.push({ type: "move", u: 0, mask: 1, v: 1, message: "Try moving to Node 1. Dist = 10. Next mask will be 011.", line: 2 });
  steps.push({ type: "dfs", u: 1, mask: 3, v: -1, message: "At Node 1 (Mask 011). Unvisited nodes: Node 2.", line: 3 });
  
  steps.push({ type: "move", u: 1, mask: 3, v: 2, message: "Move to Node 2. Dist = 20. Next mask will be 111.", line: 4 });
  steps.push({ type: "base", u: 2, mask: 7, v: -1, message: "Mask is 111 (all visited!). Return to start (Node 0). Dist = 15. Total for this path: 10+20+15 = 45.", line: 5 });

  steps.push({ type: "backtrack", u: 0, mask: 1, v: -1, message: "Backtrack to Node 0. Now try the other branch.", line: 6 });

  steps.push({ type: "move", u: 0, mask: 1, v: 2, message: "Try moving to Node 2. Dist = 15. Next mask will be 101.", line: 7 });
  steps.push({ type: "dfs", u: 2, mask: 5, v: -1, message: "At Node 2 (Mask 101). Unvisited nodes: Node 1.", line: 8 });
  
  steps.push({ type: "move", u: 2, mask: 5, v: 1, message: "Move to Node 1. Dist = 20. Next mask will be 111.", line: 9 });
  steps.push({ type: "base", u: 1, mask: 7, v: -1, message: "Mask is 111 (all visited!). Return to start (Node 0). Dist = 10. Total for this path: 15+20+10 = 45.", line: 10 });

  steps.push({ type: "done", u: 0, mask: 1, v: -1, message: "Done. Both paths yield 45. Min distance is 45.", line: 11 });

  return steps;
}

export default function TSPLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(2500);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const timerRef = useRef<number | null>(null);

  const steps = useMemo(() => simulateTSP(), []);
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
    "function tsp(u, mask) {",
    "  // All nodes visited",
    "  if (mask === (1 << N) - 1) {",
    "    return dist[u][0];",
    "  }",
    "  if (dp[u][mask] !== -1) return dp[u][mask];",
    "",
    "  let ans = Infinity;",
    "  for (let v = 0; v < N; v++) {",
    "    // If node v is not visited yet",
    "    if ((mask & (1 << v)) === 0) {",
    "      let cost = dist[u][v] + tsp(v, mask | (1 << v));",
    "      ans = Math.min(ans, cost);",
    "    }",
    "  }",
    "  return dp[u][mask] = ans;",
    "}"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Dynamic Programming • Bitmask</span>
          <h1>Traveling Salesperson Problem (TSP)</h1>
          <p className="description">Find the shortest possible route that visits every node exactly once and returns to the origin node. We use Bitmask DP to reduce O(N!) time to O(N² * 2^N).</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(N² * 2^N)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(N * 2^N)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>
      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>Overview</h2><p>Naive TSP checks all permutations of paths, taking `O(N!)`. This becomes impossible around N=12. DP with Bitmasking allows us to solve up to N=20.</p></article>
          <article className="guide-card"><h2>The State</h2><p>The state needs two things: `u` (Where are we currently?) and `mask` (Which nodes have we already visited?).</p></article>
          <article className="guide-card"><h2>The Transition</h2><p>From node `u`, try visiting every unvisited node `v`. The cost is `dist[u][v] + tsp(v, mask | (1 &lt;&lt; v))`.</p></article>
          <article className="guide-card highlight"><h2>The Base Case</h2><p>When `mask == (1 &lt;&lt; N) - 1`, all bits are 1, meaning all nodes are visited. The only thing left is to return to the start node (usually Node 0), so return `dist[u][0]`.</p></article>
        </div>
      </section>
      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to conceptualize the TSP recursion tree. Notice how the bitmask tracks the visited state.</span>
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
              <label>Speed<input type="range" min="150" max="4000" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} /></label>
              <label>Timeline<input type="range" min="0" max={Math.max(0, steps.length - 1)} value={stepIndex} onChange={(e) => { setPlaying(false); setStepIndex(Number(e.target.value)); }} /></label>
              <p className="counter">{stepIndex + 1} / {steps.length}</p>
            </aside>
            <div className="canvas" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px', alignItems: 'center' }}>
               
               <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
                 <div style={{ padding: '8px 16px', background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>
                   Current Node: <span style={{ color: 'var(--amber)' }}>{step.u}</span>
                 </div>
                 <div style={{ padding: '8px 16px', background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', fontFamily: 'monospace' }}>
                   Mask: <span style={{ color: 'var(--blue)' }}>{step.mask.toString(2).padStart(3, '0')}</span>
                 </div>
               </div>

               <div style={{ position: 'relative', width: '200px', height: '200px' }}>
                 {/* Triangle Graph edges */}
                 <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
                   <line x1="100" y1="20" x2="30" y2="160" stroke={step.u === 0 && step.v === 1 ? 'var(--amber)' : 'var(--border)'} strokeWidth={step.u === 0 && step.v === 1 ? '4' : '2'} />
                   <line x1="100" y1="20" x2="170" y2="160" stroke={step.u === 0 && step.v === 2 ? 'var(--amber)' : 'var(--border)'} strokeWidth={step.u === 0 && step.v === 2 ? '4' : '2'} />
                   <line x1="30" y1="160" x2="170" y2="160" stroke={(step.u === 1 && step.v === 2) || (step.u === 2 && step.v === 1) ? 'var(--amber)' : 'var(--border)'} strokeWidth={(step.u === 1 && step.v === 2) || (step.u === 2 && step.v === 1) ? '4' : '2'} />
                 </svg>

                 {[0, 1, 2].map(id => {
                   const pos = id === 0 ? {x:80, y:0} : id === 1 ? {x:10, y:140} : {x:150, y:140};
                   const isActive = step.u === id;
                   const isTarget = step.v === id;
                   const isVisited = (step.mask & (1 << id)) !== 0;

                   let bg = 'var(--panel)';
                   let border = 'var(--border)';

                   if (isActive) {
                     bg = 'color-mix(in srgb, var(--amber) 20%, transparent)';
                     border = 'var(--amber)';
                   } else if (isTarget) {
                     bg = 'color-mix(in srgb, var(--blue) 20%, transparent)';
                     border = 'var(--blue)';
                   } else if (isVisited) {
                     bg = 'var(--panel2)';
                     border = 'var(--green)';
                   }

                   return (
                     <div key={id} style={{
                       position: 'absolute', top: `${pos.y}px`, left: `${pos.x}px`,
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
               
               <div style={{ display: 'flex', justifyContent: 'center', height: '240px', width: '100%', marginTop: 'auto' }}>
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
