"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface Edge {
  u: number;
  v: number;
  w: number;
}

interface DagStep {
  type: string;
  u: number;
  v: number;
  dp: number[];
  message: string;
  line?: number;
}

// Fixed DAG for simplicity: 0->1(2), 0->2(5), 1->2(1), 1->3(4), 2->3(2)
const numNodes = 4;
const edges: Edge[] = [
  { u: 0, v: 1, w: 2 },
  { u: 0, v: 2, w: 5 },
  { u: 1, v: 2, w: 1 },
  { u: 1, v: 3, w: 4 },
  { u: 2, v: 3, w: 2 }
];

function simulateDagDP(): DagStep[] {
  const steps: DagStep[] = [];
  const dp = new Array(numNodes).fill(-Infinity);
  dp[0] = 0; // longest path from 0

  steps.push({ type: "init", u: -1, v: -1, dp: [...dp], message: "Initialize DP array with -Infinity. Set dp[0] = 0.", line: 0 });

  // topological sort is naturally 0, 1, 2, 3 for this graph
  for (let u = 0; u < numNodes; u++) {
    steps.push({ type: "process_node", u, v: -1, dp: [...dp], message: `Processing node ${u} in topological order.`, line: 1 });
    
    if (dp[u] === -Infinity) continue;

    for (const edge of edges) {
      if (edge.u === u) {
        const v = edge.v;
        const w = edge.w;
        steps.push({ type: "check_edge", u, v, dp: [...dp], message: `Checking edge ${u} -> ${v} with weight ${w}.`, line: 2 });
        
        if (dp[u] + w > dp[v]) {
          dp[v] = dp[u] + w;
          steps.push({ type: "update", u, v, dp: [...dp], message: `Update dp[${v}] to max(dp[${v}], dp[${u}] + ${w}) = ${dp[v]}.`, line: 3 });
        } else {
          steps.push({ type: "no_update", u, v, dp: [...dp], message: `dp[${v}] is already ${dp[v]}, which is better.`, line: 3 });
        }
      }
    }
  }

  steps.push({ type: "done", u: -1, v: -1, dp: [...dp], message: `Done. Longest paths from node 0 computed.`, line: 4 });
  return steps;
}

export default function DagDPLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const timerRef = useRef<number | null>(null);

  const steps = useMemo(() => simulateDagDP(), []);
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
    "let dp = Array(V).fill(-Infinity); dp[0] = 0;",
    "let topoOrder = topologicalSort(graph);",
    "for (let u of topoOrder) {",
    "  for (let edge of graph[u]) {",
    "    let v = edge.to, w = edge.weight;",
    "    if (dp[u] + w > dp[v]) {",
    "      dp[v] = dp[u] + w;",
    "    }",
    "  }",
    "}"
  ];

  const fmt = (v: number) => v === -Infinity ? "-inf" : v;

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Dynamic Programming • Graphs</span>
          <h1>DP on DAGs</h1>
          <p className="description">Dynamic Programming naturally aligns with Directed Acyclic Graphs (DAGs) since they define a strict dependency order (Topological Sort).</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(V + E)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(V)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>
      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>Overview</h2><p>In a DAG, there are no cycles, meaning states never depend on themselves. This guarantees that subproblems can be solved in a strict sequential order.</p></article>
          <article className="guide-card"><h2>Topological Sort</h2><p>We first find the topological order of the graph. This ensures that when we process node `u`, all possible paths to `u` have already been computed.</p></article>
          <article className="guide-card"><h2>Transitions</h2><p>For each node `u` in topological order, we relax all its outgoing edges `u -&gt; v`: `dp[v] = max(dp[v], dp[u] + weight)`.</p></article>
          <article className="guide-card highlight"><h2>Key Insight</h2><p>DP state transitions are just edges in a DAG! Any DP problem can be modeled as finding the shortest or longest path in a DAG of subproblems.</p></article>
        </div>
      </section>
      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to watch the relaxation of edges in topological order (0, 1, 2, 3) to find the Longest Path from 0.</span>
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
              <label>Speed<input type="range" min="150" max="1400" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} /></label>
              <label>Timeline<input type="range" min="0" max={Math.max(0, steps.length - 1)} value={stepIndex} onChange={(e) => { setPlaying(false); setStepIndex(Number(e.target.value)); }} /></label>
              <p className="counter">{stepIndex + 1} / {steps.length}</p>
            </aside>
            <div className="canvas" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
               
               {/* 4 node graph layout */}
               <div style={{ position: 'relative', width: '300px', height: '200px', margin: '0 auto', background: 'var(--panel2)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                 
                 {/* Edges SVG */}
                 <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                   {edges.map((e, idx) => {
                     const isProcessing = step.u === e.u && step.v === e.v;
                     const [x1, y1] = getNodePos(e.u);
                     const [x2, y2] = getNodePos(e.v);
                     
                     return (
                       <g key={idx}>
                         <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={isProcessing ? "var(--amber)" : "var(--muted)"} strokeWidth={isProcessing ? 3 : 1} markerEnd={`url(#arrow-${isProcessing ? 'active' : 'normal'})`} />
                         <text x={(x1+x2)/2} y={(y1+y2)/2 - 5} fill={isProcessing ? "var(--amber)" : "var(--muted)"} fontSize="12" textAnchor="middle">{e.w}</text>
                       </g>
                     )
                   })}
                   <defs>
                     <marker id="arrow-normal" viewBox="0 0 10 10" refX="25" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                       <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted)" />
                     </marker>
                     <marker id="arrow-active" viewBox="0 0 10 10" refX="25" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                       <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--amber)" />
                     </marker>
                   </defs>
                 </svg>
                 
                 {/* Nodes */}
                 {[0, 1, 2, 3].map(node => {
                   const isActive = step.u === node;
                   const isTarget = step.v === node;
                   const [x, y] = getNodePos(node);
                   return (
                     <div key={node} style={{
                       position: 'absolute', left: x - 20, top: y - 20,
                       width: '40px', height: '40px', borderRadius: '50%',
                       display: 'flex', alignItems: 'center', justifyContent: 'center',
                       background: isActive ? 'color-mix(in srgb, var(--blue) 20%, transparent)' : (isTarget ? 'color-mix(in srgb, var(--green) 20%, transparent)' : 'var(--panel)'),
                       border: `2px solid ${isActive ? 'var(--blue)' : (isTarget ? 'var(--green)' : 'var(--border)')}`,
                       color: 'var(--text)', fontWeight: 'bold'
                     }}>
                       {node}
                     </div>
                   )
                 })}
               </div>

               {/* DP Array */}
               <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                 {step.dp.map((val, idx) => {
                    const isActive = step.u === idx;
                    const isTarget = step.v === idx;
                    let bg = 'var(--panel2)';
                    let border = 'var(--border)';
                    if (isActive) {
                      bg = 'color-mix(in srgb, var(--blue) 20%, transparent)';
                      border = 'var(--blue)';
                    } else if (isTarget) {
                      bg = 'color-mix(in srgb, var(--green) 20%, transparent)';
                      border = 'var(--green)';
                    }
                    
                    return (
                      <div key={idx} style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                        padding: '12px', borderRadius: '8px', minWidth: '60px',
                        background: bg, border: `2px solid ${border}`,
                        transition: 'all 0.3s'
                      }}>
                         <span style={{ fontSize: '11px', color: 'var(--muted)' }}>dp[{idx}]</span>
                         <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{fmt(val)}</span>
                      </div>
                    );
                 })}
               </div>
               
               <div style={{ display: 'flex', justifyContent: 'center', height: '220px', marginTop: 'auto' }}>
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

// Simple hardcoded node positions for the 4-node DAG
function getNodePos(node: number): [number, number] {
  switch (node) {
    case 0: return [50, 100];
    case 1: return [150, 40];
    case 2: return [150, 160];
    case 3: return [250, 100];
    default: return [0, 0];
  }
}
