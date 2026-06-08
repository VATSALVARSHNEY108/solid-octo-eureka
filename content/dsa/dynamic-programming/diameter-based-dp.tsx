"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

// Simple hardcoded tree: 0-1, 0-2, 1-3, 1-4
const treeEdges = [[1, 2], [3, 4], [], [], []]; // children of each node 0 to 4

interface TreeStep {
  type: string;
  u: number;
  heights: number[];
  diameter: number;
  message: string;
  line?: number;
}

function simulateTreeDiameter(): TreeStep[] {
  const steps: TreeStep[] = [];
  const heights = new Array(5).fill(0);
  let diameter = 0;

  // We will simulate the post-order traversal iteratively for visualization
  // nodes: 0, 1, 2, 3, 4
  // post-order: 3, 4, 1, 2, 0

  steps.push({ type: "init", u: -1, heights: [...heights], diameter, message: "Start post-order DFS to compute heights and diameter.", line: 0 });

  const postOrder = [3, 4, 1, 2, 0];
  
  for (const u of postOrder) {
    steps.push({ type: "visit", u, heights: [...heights], diameter, message: `Processing node ${u}.`, line: 1 });
    
    let maxH1 = 0, maxH2 = 0;
    
    for (const v of treeEdges[u]) {
      const h = heights[v];
      steps.push({ type: "child", u, heights: [...heights], diameter, message: `Checking child ${v} of node ${u}. Its height is ${h}.`, line: 2 });
      if (h > maxH1) {
        maxH2 = maxH1;
        maxH1 = h;
      } else if (h > maxH2) {
        maxH2 = h;
      }
    }
    
    const currentDiameter = maxH1 + maxH2;
    if (currentDiameter > diameter) {
      diameter = currentDiameter;
      steps.push({ type: "update_diam", u, heights: [...heights], diameter, message: `New max diameter at node ${u}: ${maxH1} + ${maxH2} = ${diameter}.`, line: 3 });
    } else {
      steps.push({ type: "no_diam", u, heights: [...heights], diameter, message: `Diameter through node ${u} is ${maxH1} + ${maxH2} = ${currentDiameter}. Max remains ${diameter}.`, line: 3 });
    }
    
    heights[u] = maxH1 + 1;
    steps.push({ type: "update_height", u, heights: [...heights], diameter, message: `Height of node ${u} is max child height (${maxH1}) + 1 = ${heights[u]}.`, line: 4 });
  }

  steps.push({ type: "done", u: -1, heights: [...heights], diameter, message: `Done. The diameter of the tree is ${diameter}.`, line: 5 });
  return steps;
}

export default function DiameterBasedDPLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const timerRef = useRef<number | null>(null);

  const steps = useMemo(() => simulateTreeDiameter(), []);
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
    "let diameter = 0;",
    "function dfs(u) {",
    "  let maxH1 = 0, maxH2 = 0;",
    "  for (let v of children[u]) {",
    "    let h = dfs(v);",
    "    if (h > maxH1) { maxH2 = maxH1; maxH1 = h; }",
    "    else if (h > maxH2) { maxH2 = h; }",
    "  }",
    "  diameter = Math.max(diameter, maxH1 + maxH2);",
    "  return maxH1 + 1;",
    "}",
    "dfs(root);"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Dynamic Programming • Trees</span>
          <h1>Diameter Based DP</h1>
          <p className="description">Compute the longest path (diameter) between any two nodes in a tree using Post-Order Traversal.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(V)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(H)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>
      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>Overview</h2><p>Tree DP often involves computing a state for a node based on the states of its children. This is naturally done using a post-order traversal (DFS).</p></article>
          <article className="guide-card"><h2>Node Heights</h2><p>The height of a node is the length of the longest path from it down to a leaf. `height(u) = max(height(children)) + 1`.</p></article>
          <article className="guide-card highlight"><h2>The Diameter</h2><p>The diameter path must "peak" at some node. The longest path peaking at node `u` is exactly the sum of the heights of its two tallest subtrees.</p></article>
          <article className="guide-card"><h2>Optimization</h2><p>We compute the heights and update the global diameter simultaneously in one pass, avoiding repeated DFS calls.</p></article>
        </div>
      </section>
      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to watch the post-order DFS calculate heights from leaves up to the root.</span>
              </div>
              <h2>Current Step</h2>
              <p>{step?.message || "Ready."}</p>
              
              <div className="simulation-data">
                <div className="data-group">
                  <h3>Global Max Diameter</h3>
                  <div className="distances">
                    <span className="active" style={{borderColor: 'var(--amber)', color: 'var(--amber)', fontSize: '20px', fontWeight: 'bold'}}>
                      {step.diameter}
                    </span>
                  </div>
                </div>
              </div>
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
               
               {/* 5 node tree layout */}
               <div style={{ position: 'relative', width: '300px', height: '200px', margin: '0 auto', background: 'var(--panel2)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                 
                 {/* Edges SVG */}
                 <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                   {[[0,1], [0,2], [1,3], [1,4]].map((e, idx) => {
                     const isProcessing = step.u === e[0] || step.u === e[1];
                     const [x1, y1] = getTreeNodePos(e[0]);
                     const [x2, y2] = getTreeNodePos(e[1]);
                     
                     return (
                       <line key={idx} x1={x1} y1={y1} x2={x2} y2={y2} stroke={isProcessing ? "var(--amber)" : "var(--border)"} strokeWidth={isProcessing ? 3 : 2} />
                     )
                   })}
                 </svg>
                 
                 {/* Nodes */}
                 {[0, 1, 2, 3, 4].map(node => {
                   const isActive = step.u === node;
                   const [x, y] = getTreeNodePos(node);
                   return (
                     <div key={node} style={{
                       position: 'absolute', left: x - 20, top: y - 20,
                       width: '40px', height: '40px', borderRadius: '50%',
                       display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                       background: isActive ? 'color-mix(in srgb, var(--blue) 20%, transparent)' : 'var(--panel)',
                       border: `2px solid ${isActive ? 'var(--blue)' : 'var(--border)'}`,
                       color: 'var(--text)', fontWeight: 'bold'
                     }}>
                       {node}
                       {step.heights[node] > 0 && <span style={{ position: 'absolute', top: '-18px', fontSize: '10px', color: 'var(--green)' }}>h:{step.heights[node]}</span>}
                     </div>
                   )
                 })}
               </div>
               
               <div style={{ display: 'flex', justifyContent: 'center', height: '240px', marginTop: 'auto' }}>
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

function getTreeNodePos(node: number): [number, number] {
  switch (node) {
    case 0: return [150, 30];
    case 1: return [90, 90];
    case 2: return [210, 90];
    case 3: return [50, 160];
    case 4: return [130, 160];
    default: return [0, 0];
  }
}
