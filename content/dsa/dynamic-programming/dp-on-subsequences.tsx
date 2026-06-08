"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

export default function DPOnSubsequencesLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const timerRef = useRef<number | null>(null);

  // General conceptual visualizer for Subsequence generation (Pick/No Pick tree)
  const steps = useMemo(() => {
    return [
      { msg: "To process Subsequences, we decide for each element: Pick it, or Skip it.", active: "root", line: 0 },
      { msg: "Element 1: Skip.", active: "skip1", line: 1 },
      { msg: "Element 1: Pick.", active: "pick1", line: 2 },
      { msg: "This forms a binary decision tree. DP merges overlapping states.", active: "both", line: 3 },
      { msg: "When state constraints match, we memoize and prune redundant branches.", active: "prune", line: 4 }
    ];
  }, []);
  
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
      speak(step.msg);
    }
  }, [step, isSpeechEnabled, speak]);

  const codeSnippet = [
    "function solve(idx, currentSum) {",
    "  if (idx === n) return currentSum === target;",
    "  if (dp[idx][currentSum] !== -1) return dp[idx][currentSum];",
    "  ",
    "  let skip = solve(idx + 1, currentSum);",
    "  let pick = solve(idx + 1, currentSum + nums[idx]);",
    "  ",
    "  return dp[idx][currentSum] = skip || pick;",
    "}"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Dynamic Programming • Pattern</span>
          <h1>DP on Subsequences</h1>
          <p className="description">Subsequence problems involve iterating through an array and making a "Pick" or "Skip" decision for each element.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(N * Target)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(N * Target)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>
      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>Overview</h2><p>Subsequences (unlike substrings) don't have to be contiguous. The most common pattern is generating subsets to hit a specific sum or property.</p></article>
          <article className="guide-card"><h2>The Decision Tree</h2><p>For every element at index `i`, we branch into two recursive paths: one where we include `nums[i]` in our subsequence, and one where we don't.</p></article>
          <article className="guide-card"><h2>Memoization</h2><p>Because there are 2^N total subsequences, brute force is too slow. But the number of distinct `(index, currentSum)` states is often small, allowing DP.</p></article>
          <article className="guide-card highlight"><h2>Knapsack Relation</h2><p>The 0/1 Knapsack problem is the classic example of DP on subsequences. Each item is picked or skipped to maximize value within a weight limit.</p></article>
        </div>
      </section>
      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to visualize the Pick / Skip decision tree.</span>
              </div>
              <h2>Current Concept</h2>
              <p>{step?.msg || "Ready."}</p>
              
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
               
               <div style={{ position: 'relative', width: '300px', height: '200px', margin: '0 auto' }}>
                 {/* Root */}
                 <div style={{ position: 'absolute', top: '10px', left: '130px', width: '40px', height: '40px', background: 'var(--panel2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--border)' }}>[ ]</div>
                 
                 {/* Skip Branch */}
                 {(step.active === "skip1" || step.active === "both" || step.active === "prune") && (
                   <>
                     <div style={{ position: 'absolute', top: '50px', left: '90px', width: '2px', height: '40px', background: 'var(--muted)', transform: 'rotate(45deg)' }}></div>
                     <div style={{ position: 'absolute', top: '90px', left: '40px', width: '40px', height: '40px', background: 'var(--panel2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--border)' }}>[ ]</div>
                     <span style={{ position: 'absolute', top: '60px', left: '50px', fontSize: '12px', color: 'var(--muted)' }}>Skip</span>
                   </>
                 )}

                 {/* Pick Branch */}
                 {(step.active === "pick1" || step.active === "both" || step.active === "prune") && (
                   <>
                     <div style={{ position: 'absolute', top: '50px', left: '210px', width: '2px', height: '40px', background: 'var(--blue)', transform: 'rotate(-45deg)' }}></div>
                     <div style={{ position: 'absolute', top: '90px', left: '220px', width: '40px', height: '40px', background: 'color-mix(in srgb, var(--blue) 20%, transparent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--blue)' }}>[3]</div>
                     <span style={{ position: 'absolute', top: '60px', left: '230px', fontSize: '12px', color: 'var(--blue)' }}>Pick</span>
                   </>
                 )}
                 
                 {/* Pruning indicator */}
                 {step.active === "prune" && (
                   <div style={{ position: 'absolute', top: '150px', left: '40px', color: 'var(--amber)', fontSize: '14px', fontWeight: 'bold' }}>
                     * Sub-tree memoized
                   </div>
                 )}
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
