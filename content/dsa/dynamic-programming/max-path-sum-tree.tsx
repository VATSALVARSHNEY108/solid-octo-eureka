"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface TreeStep {
  type: string;
  nodeId: number;
  leftMax: number;
  rightMax: number;
  curPath: number;
  globalMax: number;
  message: string;
  line?: number;
}

function simulateTreePathSum(): TreeStep[] {
  const steps: TreeStep[] = [];
  
  // Tree structure:
  //      -10
  //      /  \
  //     9   20
  //        /  \
  //       15   7
  const nodes = [
    { id: 1, val: -10, left: 2, right: 3 },
    { id: 2, val: 9, left: null, right: null },
    { id: 3, val: 20, left: 4, right: 5 },
    { id: 4, val: 15, left: null, right: null },
    { id: 5, val: 7, left: null, right: null },
  ];

  let globalMax = -Infinity;

  function dfs(nodeId: number | null): number {
    if (!nodeId) return 0;
    const node = nodes.find(n => n.id === nodeId)!;
    
    steps.push({ type: "visit", nodeId, leftMax: 0, rightMax: 0, curPath: 0, globalMax, message: `Visiting Node ${node.val}. Recursively solving left and right children.`, line: 1 });
    
    // Ignore negative paths by taking max with 0
    const leftMax = Math.max(0, dfs(node.left));
    const rightMax = Math.max(0, dfs(node.right));
    
    const curPath = node.val + leftMax + rightMax;
    if (curPath > globalMax) {
      globalMax = curPath;
    }

    steps.push({ type: "calc", nodeId, leftMax, rightMax, curPath, globalMax, message: `At Node ${node.val}: Left provides ${leftMax}, Right provides ${rightMax}. Local path sum is ${curPath}.`, line: 3 });
    
    const returnVal = node.val + Math.max(leftMax, rightMax);
    steps.push({ type: "return", nodeId, leftMax, rightMax, curPath, globalMax, message: `Node ${node.val} returns ${returnVal} to its parent (can only pick ONE path: left or right).`, line: 5 });
    
    return returnVal;
  }

  steps.push({ type: "init", nodeId: -1, leftMax: 0, rightMax: 0, curPath: 0, globalMax: -Infinity, message: "Initialize Global Max to -Infinity. Start Post-Order DFS.", line: 0 });
  dfs(1);
  steps.push({ type: "done", nodeId: -1, leftMax: 0, rightMax: 0, curPath: 0, globalMax, message: `Done. The Maximum Path Sum anywhere in the tree is ${globalMax}.`, line: 6 });
  
  return steps;
}

export default function MaxPathSumTreeLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const timerRef = useRef<number | null>(null);

  const steps = useMemo(() => simulateTreePathSum(), []);
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
    "let globalMax = -Infinity;",
    "function dfs(node) {",
    "  if (!node) return 0;",
    "  let leftMax = Math.max(0, dfs(node.left));",
    "  let rightMax = Math.max(0, dfs(node.right));",
    "  ",
    "  globalMax = Math.max(globalMax, node.val + leftMax + rightMax);",
    "  ",
    "  return node.val + Math.max(leftMax, rightMax);",
    "}"
  ];

  // Visual layout helpers
  const getPos = (id: number) => {
    switch(id) {
      case 1: return { top: '10px', left: '150px', val: -10 };
      case 2: return { top: '80px', left: '70px', val: 9 };
      case 3: return { top: '80px', left: '230px', val: 20 };
      case 4: return { top: '150px', left: '160px', val: 15 };
      case 5: return { top: '150px', left: '300px', val: 7 };
      default: return { top: '0', left: '0', val: 0 };
    }
  };

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Dynamic Programming • Trees</span>
          <h1>Maximum Path Sum in Binary Tree</h1>
          <p className="description">Find the maximum path sum between ANY two nodes in a binary tree. The path does not need to pass through the root.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(N)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(H)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>
      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>Overview</h2><p>This is DP on Trees. We use a post-order DFS to process children before their parents. At each node, we make decisions based on the max paths coming from its subtrees.</p></article>
          <article className="guide-card"><h2>Ignoring Negatives</h2><p>If a subtree returns a negative sum, it's better to just not include it. We use `Math.max(0, dfs(child))` to "clip" negative branches.</p></article>
          <article className="guide-card"><h2>The Global Arc</h2><p>The highest path sum might arch over the current node, combining both left and right subtrees: `node.val + left + right`. We update `globalMax` with this.</p></article>
          <article className="guide-card highlight"><h2>The Return Value</h2><p>However, when a node returns to its parent, it can only offer ONE path (it can't split). So it returns `node.val + max(left, right)`.</p></article>
        </div>
      </section>
      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to watch the Post-Order Traversal resolve paths from the bottom up.</span>
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

              <div style={{ marginTop: '20px', padding: '16px', background: 'var(--panel2)', borderRadius: '8px', border: '2px solid var(--amber)' }}>
                <span style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>Global Max Sum</span>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--amber)' }}>{step.globalMax === -Infinity ? '-∞' : step.globalMax}</div>
              </div>
            </aside>
            <div className="canvas" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
               
               <div style={{ position: 'relative', width: '360px', height: '220px', margin: '0 auto' }}>
                 {/* Edges */}
                 <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
                   <line x1="170" y1="30" x2="90" y2="100" stroke="var(--border)" strokeWidth="2" />
                   <line x1="170" y1="30" x2="250" y2="100" stroke="var(--border)" strokeWidth="2" />
                   <line x1="250" y1="100" x2="180" y2="170" stroke="var(--border)" strokeWidth="2" />
                   <line x1="250" y1="100" x2="320" y2="170" stroke="var(--border)" strokeWidth="2" />
                 </svg>

                 {/* Nodes */}
                 {[1, 2, 3, 4, 5].map(id => {
                   const pos = getPos(id);
                   const isActive = step.nodeId === id;
                   const isReturning = step.type === "return" && isActive;
                   
                   let bg = 'var(--panel)';
                   let border = 'var(--border)';
                   if (isActive) {
                     bg = 'color-mix(in srgb, var(--blue) 20%, transparent)';
                     border = 'var(--blue)';
                   }
                   if (isReturning) {
                     bg = 'color-mix(in srgb, var(--green) 20%, transparent)';
                     border = 'var(--green)';
                   }

                   return (
                     <div key={id} style={{
                       position: 'absolute', top: pos.top, left: pos.left,
                       width: '40px', height: '40px', borderRadius: '50%',
                       display: 'flex', alignItems: 'center', justifyContent: 'center',
                       background: bg, border: `3px solid ${border}`, zIndex: 1,
                       fontWeight: 'bold', transition: 'all 0.3s'
                     }}>
                       {pos.val}
                     </div>
                   );
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
