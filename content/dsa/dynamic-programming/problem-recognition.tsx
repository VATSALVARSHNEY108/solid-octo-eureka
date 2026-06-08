"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";

// This is a conceptual/flowchart lesson. No strict algorithm, but a decision tree.

interface RecogStep {
  id: string;
  question: string;
  yes: string;
  no: string;
  message: string;
  highlightPath?: string;
}

function simulateRecognition(): RecogStep[] {
  const steps: RecogStep[] = [];

  steps.push({ 
    id: "start", question: "Does it ask for an optimal value (min/max), counting ways, or 'is it possible'?", 
    yes: "overlapping", no: "not_dp", 
    message: "Step 1: Check the objective. DP is for optimization or counting." 
  });

  steps.push({ 
    id: "overlapping", question: "Are there overlapping subproblems? (Does the recursive tree repeat states?)", 
    yes: "dp_found", no: "greedy_or_dc", 
    message: "Step 2: If subproblems don't overlap, it might just be Divide & Conquer or Greedy." 
  });

  steps.push({ 
    id: "dp_found", question: "DP Confirmed! Does the state depend on a range/interval [i, j]?", 
    yes: "interval_dp", no: "linear_dp", 
    message: "Step 3: Determine the pattern. Intervals usually mean O(N³) Interval DP." 
  });

  steps.push({ 
    id: "linear_dp", question: "Does the state involve 2 strings or arrays?", 
    yes: "lcs_dp", no: "knapsack_dp", 
    message: "Step 4: If comparing two sequences, it's likely LCS or Edit Distance pattern." 
  });

  steps.push({ 
    id: "knapsack_dp", question: "Is it a 'Pick / Don't Pick' scenario with a constraint (like capacity)?", 
    yes: "knapsack", no: "lis_dp", 
    message: "Step 5: Pick/Skip with capacity is classic 0/1 Knapsack." 
  });

  return steps;
}

export default function ProblemRecognitionLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(2000);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const timerRef = useRef<number | null>(null);

  const steps = useMemo(() => simulateRecognition(), []);
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

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Dynamic Programming • Fundamentals</span>
          <h1>Problem Recognition</h1>
          <p className="description">Learn how to read a problem description and instantly recognize whether it requires Dynamic Programming, and if so, which pattern to apply.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Difficulty</span><span className="value">Conceptual</span></div>
            <div className="complexity-tag"><span className="label">Focus</span><span className="value">Pattern Matching</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>
      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>Keywords</h2><p>Look for words like "Minimum", "Maximum", "Largest", "Smallest", "Longest", "Number of Ways", or "Is it possible". These are huge DP giveaways.</p></article>
          <article className="guide-card"><h2>Constraints Hint</h2><p>If N is ~10-20, it might be Backtracking or Bitmask DP. If N is ~100-500, it's likely O(N²) or O(N³) DP. If N is ~10^5, it must be O(N) linear DP or O(N log N).</p></article>
          <article className="guide-card"><h2>The DP Trinity</h2><p>Every DP problem boils down to three things: 1. Objective function (What to maximize?), 2. Base cases, 3. Transition function (How do states connect?).</p></article>
          <article className="guide-card highlight"><h2>Greedy vs DP</h2><p>Greedy makes the best local choice right now and never looks back. DP makes choices, but keeps all options open (memoized) because a bad local choice might lead to a great global choice later.</p></article>
        </div>
      </section>
      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to walk through the DP decision tree to categorize a problem.</span>
              </div>
              <h2>Current Question</h2>
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
              <label>Speed<input type="range" min="150" max="3000" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} /></label>
              <label>Timeline<input type="range" min="0" max={Math.max(0, steps.length - 1)} value={stepIndex} onChange={(e) => { setPlaying(false); setStepIndex(Number(e.target.value)); }} /></label>
              <p className="counter">{stepIndex + 1} / {steps.length}</p>
            </aside>
            <div className="canvas" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '40px', alignItems: 'center' }}>
               
               <div style={{
                 padding: '24px', background: 'var(--panel)', border: '2px solid var(--blue)',
                 borderRadius: '12px', maxWidth: '400px', textAlign: 'center',
                 boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
               }}>
                 <div style={{ fontSize: '14px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '12px', fontWeight: 'bold' }}>Decision Node</div>
                 <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text)', lineHeight: '1.5' }}>
                   {step.question}
                 </div>
               </div>

               <div style={{ display: 'flex', gap: '40px', marginTop: '20px' }}>
                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   <div style={{ width: '2px', height: '30px', background: 'var(--border)' }}></div>
                   <div style={{ padding: '8px 16px', background: 'color-mix(in srgb, var(--green) 20%, transparent)', border: '1px solid var(--green)', borderRadius: '20px', color: 'var(--green)', fontWeight: 'bold' }}>
                     YES → {step.yes.toUpperCase().replace('_', ' ')}
                   </div>
                 </div>

                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   <div style={{ width: '2px', height: '30px', background: 'var(--border)' }}></div>
                   <div style={{ padding: '8px 16px', background: 'color-mix(in srgb, var(--red) 20%, transparent)', border: '1px solid var(--red)', borderRadius: '20px', color: 'var(--red)', fontWeight: 'bold' }}>
                     NO → {step.no.toUpperCase().replace('_', ' ')}
                   </div>
                 </div>
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
