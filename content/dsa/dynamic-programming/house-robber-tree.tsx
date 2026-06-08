"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface RobStep {
  type: string;
  node: number;
  robbed: boolean | null;
  val: number;
  message: string;
  line?: number;
}

// Tree logic for House Robber III
function simulateHouseRobberTree(): RobStep[] {
  const steps: RobStep[] = [];
  
  // Minimal tree: 0 has children 1, 2. 1 has child 3. 2 has child 4.
  // Values: 0(3), 1(2), 2(3), 3(3), 4(1)
  const vals = [3, 2, 3, 3, 1];
  
  steps.push({ type: "init", node: -1, robbed: null, val: 0, message: "Start post-order DFS to calculate max money [robThisNode, skipThisNode].", line: 0 });

  const postOrder = [3, 4, 1, 2, 0];
  
  // We'll just show the conceptual evaluation order
  for (const node of postOrder) {
    steps.push({ type: "eval", node, robbed: null, val: vals[node], message: `Evaluating node ${node} (value ${vals[node]}).`, line: 1 });
    steps.push({ type: "rob", node, robbed: true, val: vals[node], message: `If we ROB node ${node}, we CANNOT rob its children.`, line: 2 });
    steps.push({ type: "skip", node, robbed: false, val: vals[node], message: `If we SKIP node ${node}, we take the MAX of robbing or skipping its children.`, line: 3 });
  }

  steps.push({ type: "done", node: 0, robbed: true, val: 7, message: `Done. The max money we can rob is max(robRoot, skipRoot).`, line: 4 });
  return steps;
}

export default function HouseRobberTreeLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const timerRef = useRef<number | null>(null);

  const steps = useMemo(() => simulateHouseRobberTree(), []);
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
    "function rob(node) {",
    "  if (!node) return [0, 0]; // [robbed, skipped]",
    "  ",
    "  let left = rob(node.left);",
    "  let right = rob(node.right);",
    "  ",
    "  let robNode = node.val + left[1] + right[1];",
    "  let skipNode = Math.max(...left) + Math.max(...right);",
    "  ",
    "  return [robNode, skipNode];",
    "}"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Dynamic Programming • Trees</span>
          <h1>House Robber III</h1>
          <p className="description">Rob houses arranged in a binary tree where you cannot rob two directly linked houses.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(N)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(H)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>
      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>Overview</h2><p>This combines Tree DFS with the House Robber state machine logic. A classic "DP on Trees" problem.</p></article>
          <article className="guide-card"><h2>State Return</h2><p>Instead of returning a single integer, the recursive DFS function returns an array of two values: `[maxIfRobbed, maxIfSkipped]`.</p></article>
          <article className="guide-card"><h2>Transitions (Rob)</h2><p>If you rob the current node, you CANNOT rob its children. So `robThis = node.val + leftSkipped + rightSkipped`.</p></article>
          <article className="guide-card highlight"><h2>Transitions (Skip)</h2><p>If you skip the current node, you have the CHOICE to rob or skip the children (whichever is better). `skipThis = max(left) + max(right)`.</p></article>
        </div>
      </section>
      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to watch the tree DP return multiple states (Rob/Skip) per node.</span>
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
               
               <div style={{ position: 'relative', width: '300px', height: '220px', margin: '0 auto' }}>
                 {/* Edges */}
                 <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                   <line x1="150" y1="30" x2="90" y2="100" stroke="var(--border)" strokeWidth="2" />
                   <line x1="150" y1="30" x2="210" y2="100" stroke="var(--border)" strokeWidth="2" />
                   <line x1="90" y1="100" x2="110" y2="180" stroke="var(--border)" strokeWidth="2" />
                   <line x1="210" y1="100" x2="230" y2="180" stroke="var(--border)" strokeWidth="2" />
                 </svg>
                 
                 {/* Nodes */}
                 {[0, 1, 2, 3, 4].map((node) => {
                   let x=0, y=0;
                   if (node===0) {x=150; y=30;}
                   if (node===1) {x=90; y=100;}
                   if (node===2) {x=210; y=100;}
                   if (node===3) {x=110; y=180;}
                   if (node===4) {x=230; y=180;}

                   const isActive = step.node === node;
                   
                   let border = 'var(--border)';
                   if (isActive) {
                     if (step.robbed === true) border = 'var(--red)';
                     else if (step.robbed === false) border = 'var(--green)';
                     else border = 'var(--amber)';
                   }

                   return (
                     <div key={node} style={{
                       position: 'absolute', left: x - 25, top: y - 25,
                       width: '50px', height: '50px', borderRadius: '50%',
                       display: 'flex', alignItems: 'center', justifyContent: 'center',
                       background: isActive ? 'var(--panel2)' : 'var(--panel)',
                       border: `3px solid ${border}`,
                       fontWeight: 'bold', transition: 'all 0.3s'
                     }}>
                       ${[3,2,3,3,1][node]}
                     </div>
                   )
                 })}
               </div>

               <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '13px', fontWeight: 'bold' }}>
                 <span style={{ color: 'var(--red)' }}>Robbed 🔴</span>
                 <span style={{ color: 'var(--green)' }}>Skipped 🟢</span>
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
