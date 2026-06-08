"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface SCSPrintStep {
  type: string;
  i: number;
  j: number;
  result: string;
  message: string;
  line?: number;
}

function simulatePrintSCS(): SCSPrintStep[] {
  const steps: SCSPrintStep[] = [];
  const s1 = "abac";
  const s2 = "cab";
  
  // Precomputed LCS DP Table
  const dp = [
    [0, 0, 0, 0], // ""
    [0, 0, 1, 1], // a
    [0, 0, 1, 2], // b
    [0, 0, 2, 2], // a
    [0, 1, 2, 2]  // c
  ];

  let i = 4;
  let j = 3;
  let result = "";

  steps.push({ type: "init", i, j, result, message: "Start from the bottom-right of the DP table. We will construct the SCS backwards.", line: 0 });

  while (i > 0 && j > 0) {
    steps.push({ type: "check", i, j, result, message: `Checking s1[${i-1}] ('${s1[i-1]}') and s2[${j-1}] ('${s2[j-1]}').`, line: 1 });
    
    if (s1[i - 1] === s2[j - 1]) {
      result = s1[i - 1] + result;
      steps.push({ type: "match", i, j, result, message: `Match! Both strings share '${s1[i-1]}'. Add it once to SCS. Move diagonally.`, line: 2 });
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      result = s1[i - 1] + result;
      steps.push({ type: "s1_char", i, j, result, message: `Mismatch. dp[i-1][j] is larger. We drop '${s1[i-1]}' from s1, so add it to SCS. Move UP.`, line: 3 });
      i--;
    } else {
      result = s2[j - 1] + result;
      steps.push({ type: "s2_char", i, j, result, message: `Mismatch. dp[i][j-1] is larger (or equal). Drop '${s2[j-1]}' from s2, add to SCS. Move LEFT.`, line: 4 });
      j--;
    }
  }

  while (i > 0) {
    result = s1[i - 1] + result;
    steps.push({ type: "flush_s1", i, j, result, message: `s2 is empty. Add remaining character '${s1[i-1]}' from s1 to SCS.`, line: 5 });
    i--;
  }

  while (j > 0) {
    result = s2[j - 1] + result;
    steps.push({ type: "flush_s2", i, j, result, message: `s1 is empty. Add remaining character '${s2[j-1]}' from s2 to SCS.`, line: 6 });
    j--;
  }

  steps.push({ type: "done", i, j, result, message: `Done. The Shortest Common Supersequence is "${result}".`, line: 7 });
  return steps;
}

export default function SCSLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const timerRef = useRef<number | null>(null);

  const steps = useMemo(() => simulatePrintSCS(), []);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];

  const s1 = "abac";
  const s2 = "cab";
  const dp = [
    [0, 0, 0, 0],
    [0, 0, 1, 1],
    [0, 0, 1, 2],
    [0, 0, 2, 2],
    [0, 1, 2, 2]
  ];

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
    "let result = '';",
    "let i = s1.length, j = s2.length;",
    "while (i > 0 && j > 0) {",
    "  if (s1[i - 1] === s2[j - 1]) {",
    "    result = s1[i - 1] + result; // Add once",
    "    i--; j--;",
    "  } else if (dp[i - 1][j] > dp[i][j - 1]) {",
    "    result = s1[i - 1] + result; // Add s1 char",
    "    i--;",
    "  } else {",
    "    result = s2[j - 1] + result; // Add s2 char",
    "    j--;",
    "  }",
    "}",
    "// Add remaining chars",
    "while (i > 0) { result = s1[i - 1] + result; i--; }",
    "while (j > 0) { result = s2[j - 1] + result; j--; }",
    "return result;"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Dynamic Programming • Traceback</span>
          <h1>Shortest Common Supersequence</h1>
          <p className="description">Find the shortest string that has both given strings as subsequences. It's intimately tied to finding the Longest Common Subsequence (LCS).</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(M * N)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(M * N)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>
      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>Overview</h2><p>A supersequence contains both strings. To make it the *shortest* possible, we must reuse as many characters as possible. What characters can be reused? The characters in their LCS!</p></article>
          <article className="guide-card"><h2>The Math</h2><p>The length of the SCS is exactly: `Length(S1) + Length(S2) - Length(LCS)`. We subtract the LCS because those characters are shared and only need to be written once.</p></article>
          <article className="guide-card"><h2>Printing the SCS</h2><p>We trace back through the LCS DP table. If characters match, we add it to our result ONCE. If they don't match, we add the character from the string we are "dropping" and move towards the larger DP value.</p></article>
          <article className="guide-card highlight"><h2>Flushing Leftovers</h2><p>If we hit the edge of the DP table (`i=0` or `j=0`), we just append whatever is left of the other string, because we must include all characters to form a valid supersequence.</p></article>
        </div>
      </section>
      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to watch the traceback algorithm reconstruct the SCS from the LCS DP table.</span>
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
              <label>Speed<input type="range" min="150" max="1500" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} /></label>
              <label>Timeline<input type="range" min="0" max={Math.max(0, steps.length - 1)} value={stepIndex} onChange={(e) => { setPlaying(false); setStepIndex(Number(e.target.value)); }} /></label>
              <p className="counter">{stepIndex + 1} / {steps.length}</p>

              <div style={{ marginTop: '20px', padding: '16px', background: 'var(--panel2)', borderRadius: '8px', border: '2px solid var(--amber)' }}>
                <span style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>Constructed SCS</span>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--amber)', minHeight: '30px', letterSpacing: '2px' }}>
                  {step.result}
                </div>
              </div>
            </aside>
            <div className="canvas" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
               
               <div style={{ display: 'flex', justifyContent: 'center' }}>
                 <table style={{ borderCollapse: 'collapse' }}>
                   <thead>
                     <tr>
                       <th style={{ padding: '8px', borderBottom: '1px solid var(--border)', color: 'var(--muted)' }}>S1 \ S2</th>
                       <th style={{ padding: '8px', borderBottom: '1px solid var(--border)', color: 'var(--muted)' }}>""</th>
                       {s2.split('').map((char, j) => (
                         <th key={j} style={{ padding: '8px', borderBottom: '1px solid var(--border)', color: step.j === j + 1 ? 'var(--blue)' : 'var(--text)' }}>{char}</th>
                       ))}
                     </tr>
                   </thead>
                   <tbody>
                     {dp.map((row, i) => (
                       <tr key={i}>
                         <td style={{ padding: '8px', borderRight: '1px solid var(--border)', fontWeight: 'bold', color: step.i === i ? 'var(--amber)' : 'var(--text)' }}>
                           {i === 0 ? '""' : s1[i-1]}
                         </td>
                         {row.map((val, j) => {
                           const isActive = step.i === i && step.j === j;
                           let bg = 'transparent';
                           let border = '1px solid var(--border)';
                           
                           if (isActive) {
                             bg = step.type === "match" ? 'color-mix(in srgb, var(--green) 30%, transparent)' : 'color-mix(in srgb, var(--blue) 20%, transparent)';
                             border = step.type === "match" ? '2px solid var(--green)' : '2px solid var(--blue)';
                           }
                           
                           return (
                             <td key={j} style={{ 
                               padding: '8px', textAlign: 'center', width: '40px',
                               background: bg, border, transition: 'all 0.2s',
                               color: 'var(--text)', fontWeight: isActive ? 'bold' : 'normal'
                             }}>
                               {val}
                             </td>
                           );
                         })}
                       </tr>
                     ))}
                   </tbody>
                 </table>
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
