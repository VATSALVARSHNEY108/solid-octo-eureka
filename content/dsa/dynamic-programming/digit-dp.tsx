"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface DigitStep {
  type: string;
  idx: number;
  tight: boolean;
  built: string;
  message: string;
  line?: number;
}

// Visualize Digit DP: Count numbers <= "32"
function simulateDigitDP(): DigitStep[] {
  const steps: DigitStep[] = [];
  const limit = "32";
  const n = limit.length;

  steps.push({ type: "init", idx: 0, tight: true, built: "", message: `Find numbers <= ${limit}. Start at index 0, tight=true.`, line: 0 });

  // Pre-computed traversal for visualization (only exploring valid paths)
  const paths = [
    { idx: 0, t: true, b: "", d: "0", nt: false },
    { idx: 1, t: false, b: "0", d: "0", nt: false },
    { idx: 1, t: false, b: "0", d: "...", nt: false }, // summary
    { idx: 0, t: true, b: "", d: "1", nt: false },
    { idx: 1, t: false, b: "1", d: "0-9", nt: false }, // summary
    { idx: 0, t: true, b: "", d: "2", nt: false },
    { idx: 1, t: false, b: "2", d: "0-9", nt: false }, // summary
    { idx: 0, t: true, b: "", d: "3", nt: true },
    { idx: 1, t: true, b: "3", d: "0", nt: false },
    { idx: 1, t: true, b: "3", d: "1", nt: false },
    { idx: 1, t: true, b: "3", d: "2", nt: true }
  ];

  for (const p of paths) {
    if (p.d.includes("-") || p.d === "...") {
       steps.push({ type: "explore", idx: p.idx, tight: p.t, built: p.b, message: `Prefix "${p.b}" (tight=${p.t}). Append ${p.d}. Subproblem solved via memoization.`, line: 3 });
    } else {
       steps.push({ type: "explore", idx: p.idx, tight: p.t, built: p.b, message: `Prefix "${p.b}" (tight=${p.t}). Upper bound is ${p.t ? limit[p.idx] : '9'}. Try digit ${p.d}.`, line: 1 });
       steps.push({ type: "recurse", idx: p.idx + 1, tight: p.nt, built: p.b + p.d, message: `Recurse: idx=${p.idx + 1}, tight=${p.nt}, prefix="${p.b + p.d}".`, line: 2 });
    }
  }

  steps.push({ type: "done", idx: n, tight: false, built: "", message: `Done. Calculated total valid numbers (33 numbers, 0 to 32).`, line: 4 });
  return steps;
}

export default function DigitDPLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const timerRef = useRef<number | null>(null);

  const steps = useMemo(() => simulateDigitDP(), []);
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
    "function solve(idx, tight) {",
    "  if (idx === n) return 1;",
    "  if (dp[idx][tight] !== -1) return dp[idx][tight];",
    "  let limit = tight ? parseInt(str[idx]) : 9;",
    "  let ans = 0;",
    "  for (let d = 0; d <= limit; d++) {",
    "    ans += solve(idx + 1, tight && (d === limit));",
    "  }",
    "  return dp[idx][tight] = ans;",
    "}"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Dynamic Programming • Combinatorics</span>
          <h1>Digit DP</h1>
          <p className="description">Count the number of integers in a range `[L, R]` that satisfy a certain property using digit-by-digit construction.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(N * States)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(N * States)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>
      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>Overview</h2><p>Instead of iterating all numbers in `[L, R]`, we construct numbers digit by digit. To solve for `[L, R]`, we typically compute `solve(R) - solve(L-1)`.</p></article>
          <article className="guide-card"><h2>The 'Tight' Bound</h2><p>A boolean variable `tight` tracks if the digits chosen so far match the prefix of `R`. If true, the next digit cannot exceed the next digit of `R`.</p></article>
          <article className="guide-card"><h2>Memoization</h2><p>Once `tight` becomes false (we picked a smaller digit), the choices for remaining digits are entirely unconstrained and can be heavily reused (memoized).</p></article>
          <article className="guide-card highlight"><h2>Key Insight</h2><p>The state usually looks like `dp[idx][tight][other_constraints]`. The number of states is extremely small relative to the value of `R` (logarithmic).</p></article>
        </div>
      </section>
      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to watch the recursive tree exploration for limit "32". Notice how 'tight' restricts digits.</span>
              </div>
              <h2>Current Step</h2>
              <p>{step?.message || "Ready."}</p>
              
              <div className="simulation-data">
                <div className="data-group">
                  <h3>Current Prefix</h3>
                  <div className="distances">
                    <span className="active" style={{borderColor: 'var(--amber)', color: 'var(--amber)', fontSize: '20px', fontWeight: 'bold'}}>
                      {step.built || "_"}
                    </span>
                    <span style={{ color: step.tight ? 'var(--red)' : 'var(--green)' }}>
                      Tight: {step.tight ? 'TRUE' : 'FALSE'}
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
               
               <div style={{ padding: '20px', background: 'var(--panel2)', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
                  <div style={{ marginBottom: '16px', color: 'var(--muted)' }}>Recursive Construction Tree (Limit: 32)</div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '18px' }}>
                     <div style={{ padding: '10px', border: '2px solid var(--blue)', borderRadius: '8px', background: step.idx === 0 ? 'color-mix(in srgb, var(--blue) 20%, transparent)' : 'var(--panel)' }}>
                       Idx: 0<br/><span style={{fontSize: '12px', color: 'var(--red)'}}>Tight: True</span>
                     </div>
                     <span style={{ display: 'flex', alignItems: 'center' }}>➡</span>
                     <div style={{ padding: '10px', border: '2px solid var(--amber)', borderRadius: '8px', background: step.idx === 1 ? 'color-mix(in srgb, var(--amber) 20%, transparent)' : 'var(--panel)' }}>
                       Idx: 1<br/><span style={{fontSize: '12px', color: step.tight ? 'var(--red)' : 'var(--green)'}}>Tight: {step.tight ? 'True' : 'False'}</span>
                     </div>
                     <span style={{ display: 'flex', alignItems: 'center' }}>➡</span>
                     <div style={{ padding: '10px', border: '2px solid var(--border)', borderRadius: '8px', background: step.idx === 2 ? 'color-mix(in srgb, var(--green) 20%, transparent)' : 'var(--panel)' }}>
                       Idx: 2<br/><span style={{fontSize: '12px', color: 'var(--muted)'}}>Base Case</span>
                     </div>
                  </div>
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
        .distances { display: flex; flex-wrap: wrap; gap: 6px; margin: 0; }
        .distances span { border: 1px solid var(--border); border-radius: 6px; padding: 5px 8px; color: var(--muted); background: var(--panel2); font-family: monospace; transition: all 0.3s; }
        label { display: grid; gap: 6px; margin-top: 12px; color: var(--muted); font-size: 13px; }
        .counter { font-family: monospace; }
        .gesture-hint { background: var(--panel2); border: 1px solid var(--border); border-radius: 8px; padding: 12px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 4px; font-size: 11px; color: var(--muted); }
        @media (max-width: 900px) { .workspace { grid-template-columns: 1fr; } }
      `}</style>
    </main>
  );
}
