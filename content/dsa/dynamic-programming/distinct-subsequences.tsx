"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface DistinctStep {
  type: string;
  i: number;
  j: number;
  dp: number[][];
  message: string;
  line?: number;
}

function simulateDistinctSubsequences(s: string, t: string): DistinctStep[] {
  const steps: DistinctStep[] = [];
  const m = s.length;
  const n = t.length;
  
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = 1;

  steps.push({ type: "init", i: -1, j: -1, dp: dp.map(r => [...r]), message: "Initialize dp table. Empty target string T can be formed 1 way.", line: 0 });

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      steps.push({ type: "check", i, j, dp: dp.map(r => [...r]), message: `Comparing S[${i-1}] ('${s[i-1]}') with T[${j-1}] ('${t[j-1]}').`, line: 1 });
      
      if (s[i - 1] === t[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + dp[i - 1][j];
        steps.push({ type: "match", i, j, dp: dp.map(r => [...r]), message: `Match! Can use character or skip it: dp[${i-1}][${j-1}] + dp[${i-1}][${j}] = ${dp[i][j]}.`, line: 2 });
      } else {
        dp[i][j] = dp[i - 1][j];
        steps.push({ type: "no_match", i, j, dp: dp.map(r => [...r]), message: `No match. Must skip character in S: dp[${i-1}][${j}] = ${dp[i][j]}.`, line: 3 });
      }
    }
  }

  steps.push({ type: "done", i: m, j: n, dp: dp.map(r => [...r]), message: `Done. Number of distinct subsequences is ${dp[m][n]}.`, line: 4 });
  return steps;
}

export default function DistinctSubsequencesLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [sInput, setSInput] = useState("rabbbit");
  const [tInput, setTInput] = useState("rabbit");
  const [sStr, setSStr] = useState("rabbbit");
  const [tStr, setTStr] = useState("rabbit");
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const timerRef = useRef<number | null>(null);

  const steps = useMemo(() => simulateDistinctSubsequences(sStr, tStr), [sStr, tStr]);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];

  useEffect(() => {
    setStepIndex(0);
    setPlaying(false);
  }, [sStr, tStr]);

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

  const applyInput = () => {
    if (sInput && tInput) {
      setSStr(sInput);
      setTStr(tInput);
    }
  };

  const codeSnippet = [
    "let dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));",
    "for (let i = 0; i <= m; i++) dp[i][0] = 1;",
    "for (let i = 1; i <= m; i++) {",
    "  for (let j = 1; j <= n; j++) {",
    "    if (S[i-1] === T[j-1]) {",
    "      dp[i][j] = dp[i-1][j-1] + dp[i-1][j];",
    "    } else {",
    "      dp[i][j] = dp[i-1][j];",
    "    }",
    "  }",
    "}"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Dynamic Programming • Strings</span>
          <h1>Distinct Subsequences</h1>
          <p className="description">Given two strings S and T, return the number of distinct subsequences of S which equal T.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(M * N)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(M * N)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>
      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>Overview</h2><p>This is a string matching problem where we can delete characters from the source string to match the target string, counting all distinct ways to do so.</p></article>
          <article className="guide-card"><h2>State Variable</h2><p>Let `dp[i][j]` be the number of ways to form the prefix of `T` of length `j` using the prefix of `S` of length `i`.</p></article>
          <article className="guide-card"><h2>When Characters Match</h2><p>If `S[i] == T[j]`, we can either use `S[i]` to match `T[j]` (`dp[i-1][j-1]`), OR we can ignore `S[i]` and rely on earlier characters (`dp[i-1][j]`).</p></article>
          <article className="guide-card highlight"><h2>When Characters Don't Match</h2><p>If they don't match, we cannot use `S[i]`, so we MUST ignore it: `dp[i][j] = dp[i-1][j]`.</p></article>
        </div>
      </section>
      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="editor" style={{ display: 'flex', gap: '8px', padding: '0 40px', alignItems: 'center' }}>
            <label style={{ margin: 0 }}>String S:</label>
            <input value={sInput} onChange={(e) => setSInput(e.target.value)} placeholder="e.g., rabbbit" style={{ width: '120px' }} />
            <label style={{ margin: '0 0 0 16px' }}>Target T:</label>
            <input value={tInput} onChange={(e) => setTInput(e.target.value)} placeholder="e.g., rabbit" style={{ width: '100px' }} />
            <button onClick={applyInput} style={{ marginLeft: '8px' }}>Set</button>
            <button onClick={() => { setSInput("rabbbit"); setTInput("rabbit"); setSStr("rabbbit"); setTStr("rabbit"); }}>Reset</button>
          </div>
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>🖱️ Adjust the strings S and T.</span>
                <span>▶️ Play to watch the 2D DP table populate.</span>
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
               <div style={{ display: 'flex', overflowX: 'auto', padding: '12px', background: 'var(--panel)', borderRadius: '8px' }}>
                 <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                   <thead>
                     <tr>
                       <th style={{ padding: '8px', borderBottom: '1px solid var(--border)', color: 'var(--muted)' }}>S \ T</th>
                       <th style={{ padding: '8px', borderBottom: '1px solid var(--border)', color: 'var(--muted)' }}>""</th>
                       {tStr.split('').map((char, j) => (
                         <th key={j} style={{ padding: '8px', borderBottom: '1px solid var(--border)', color: step.j === j + 1 ? 'var(--blue)' : 'var(--text)' }}>{char}</th>
                       ))}
                     </tr>
                   </thead>
                   <tbody>
                     {step.dp.map((row, i) => (
                       <tr key={i}>
                         <td style={{ padding: '8px', borderRight: '1px solid var(--border)', fontWeight: 'bold', color: step.i === i ? 'var(--amber)' : 'var(--text)' }}>
                           {i === 0 ? '""' : sStr[i-1]}
                         </td>
                         {row.map((val, j) => {
                           const isActive = step.i === i && step.j === j;
                           const isSourceMatch = step.type === "match" && step.i === i + 1 && (step.j === j + 1 || step.j === j);
                           const isSourceNoMatch = step.type === "no_match" && step.i === i + 1 && step.j === j;
                           
                           let bg = 'transparent';
                           if (isActive) bg = 'color-mix(in srgb, var(--blue) 20%, transparent)';
                           else if (isSourceMatch || isSourceNoMatch) bg = 'color-mix(in srgb, var(--green) 20%, transparent)';
                           
                           return (
                             <td key={j} style={{ 
                               padding: '8px', textAlign: 'center',
                               background: bg,
                               border: isActive ? '1px solid var(--blue)' : ((isSourceMatch || isSourceNoMatch) ? '1px solid var(--green)' : '1px solid var(--border)'),
                               transition: 'all 0.2s'
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
