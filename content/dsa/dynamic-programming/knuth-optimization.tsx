"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

// Simulating the bounds restriction of Knuth Optimization
interface KnuthStep {
  type: string;
  len: number;
  i: number;
  j: number;
  kLeft: number;
  kRight: number;
  k: number;
  message: string;
  line?: number;
}

function simulateKnuth(): KnuthStep[] {
  const steps: KnuthStep[] = [];
  const n = 5;

  steps.push({ type: "init", len: -1, i: -1, j: -1, kLeft: -1, kRight: -1, k: -1, message: "Initialize DP and optimal split (opt) tables.", line: 0 });

  // Base cases are skipped for brevity, just showing the concept
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;
      
      // Knuth bounds: opt[i][j-1] <= k <= opt[i+1][j]
      // Simulating the bounds visually
      const kLeft = i; // Normally opt[i][j-1]
      const kRight = j; // Normally opt[i+1][j]
      
      steps.push({ type: "bounds", len, i, j, kLeft, kRight, k: -1, message: `For interval [${i}, ${j}], we don't need to test all k. Knuth bounds restrict k.`, line: 1 });
      
      for (let k = kLeft; k <= kRight; k++) {
        steps.push({ type: "test_k", len, i, j, kLeft, kRight, k, message: `Testing restricted k=${k}.`, line: 2 });
      }
      
      steps.push({ type: "opt", len, i, j, kLeft, kRight, k: -1, message: `Found optimal k. Store in opt[${i}][${j}] for future bounds.`, line: 3 });
    }
  }

  steps.push({ type: "done", len: -1, i: -1, j: -1, kLeft: -1, kRight: -1, k: -1, message: `Knuth optimization reduces O(N³) to O(N²)!`, line: 4 });
  return steps;
}

export default function KnuthOptimizationLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const timerRef = useRef<number | null>(null);

  const steps = useMemo(() => simulateKnuth(), []);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];
  const n = 5;

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
    "// Instead of k from i to j-1",
    "// We bound k using previously found optimal splits",
    "for (let len = 2; len <= n; len++) {",
    "  for (let i = 0; i <= n - len; i++) {",
    "    let j = i + len - 1;",
    "    let kLeft = opt[i][j - 1];",
    "    let kRight = opt[i + 1][j];",
    "    ",
    "    for (let k = kLeft; k <= kRight; k++) {",
    "      // test cost and find minimum",
    "      // update opt[i][j] = best_k",
    "    }",
    "  }",
    "}"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Dynamic Programming • Optimization</span>
          <h1>Knuth Optimization</h1>
          <p className="description">An advanced technique to optimize certain O(N³) Interval DP problems down to O(N²) by bounding the search space of the split point k.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Original</span><span className="value">O(N³)</span></div>
            <div className="complexity-tag"><span className="label">Optimized</span><span className="value">O(N²)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>
      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>Overview</h2><p>In standard Interval DP, we test `k` from `i` to `j`, taking O(N) time per state, leading to O(N³). Knuth Optimization limits `k` to a tiny range.</p></article>
          <article className="guide-card"><h2>The Condition</h2><p>Knuth applies when the cost function satisfies the Quadrangle Inequality and monotonicity on the lattice of intervals.</p></article>
          <article className="guide-card"><h2>The Bounds</h2><p>Instead of <code>i &le; k &lt; j</code>, we use <code>opt[i][j-1] &le; k &le; opt[i+1][j]</code>. The optimal split for <code>[i, j]</code> is bounded by the optimal splits of its slightly smaller sub-intervals.</p></article>
          <article className="guide-card highlight"><h2>Telescoping Sum</h2><p>Because the upper bound of one interval is the lower bound of the next, the work done in the inner loop telescopes, amortizing the total time to exactly O(N²).</p></article>
        </div>
      </section>
      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to visualize how the search space for `k` is restricted by previously computed optimal splits.</span>
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
               
               <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
                 {Array.from({length: n}).map((_, idx) => {
                   const inInterval = step.i !== -1 && idx >= step.i && idx <= step.j;
                   const isK = step.k === idx;
                   const inBounds = step.kLeft !== -1 && idx >= step.kLeft && idx <= step.kRight;
                   
                   let bg = 'var(--panel)';
                   let border = 'var(--border)';
                   if (isK) {
                     bg = 'color-mix(in srgb, var(--amber) 20%, transparent)';
                     border = 'var(--amber)';
                   } else if (inBounds) {
                     bg = 'color-mix(in srgb, var(--blue) 10%, transparent)';
                     border = 'var(--blue)';
                   } else if (inInterval) {
                     bg = 'color-mix(in srgb, var(--panel2) 50%, transparent)';
                   }

                   return (
                     <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                       <span style={{ fontSize: '10px', color: 'var(--muted)' }}>
                         {idx === step.kLeft ? 'kLeft' : (idx === step.kRight ? 'kRight' : '')}
                       </span>
                       <div style={{
                         width: '50px', height: '50px', borderRadius: '8px',
                         display: 'flex', alignItems: 'center', justifyContent: 'center',
                         background: bg, border: `2px solid ${border}`,
                         fontWeight: 'bold'
                       }}>
                         {idx}
                       </div>
                     </div>
                   )
                 })}
               </div>
               
               <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--muted)', marginTop: '20px' }}>
                 Search space is restricted. Instead of O(N) inner loop, it's O(1) amortized.
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
