"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface DecodeStep {
  type: string;
  idx: number;
  dp: number[];
  message: string;
  line?: number;
}

function simulateDecodeWays(s: string): DecodeStep[] {
  const steps: DecodeStep[] = [];
  const n = s.length;
  
  if (n === 0 || s[0] === '0') {
    steps.push({ type: "invalid", idx: 0, dp: [], message: "Invalid string. Must not be empty and cannot start with '0'.", line: 0 });
    return steps;
  }

  const dp = new Array(n + 1).fill(0);
  dp[0] = 1; // 1 way to decode empty string
  dp[1] = 1; // 1 way to decode first character (already checked not '0')

  steps.push({ type: "init", idx: 1, dp: [...dp], message: `Initialize dp[0]=1, dp[1]=1. String starts with '${s[0]}'.`, line: 0 });

  for (let i = 2; i <= n; i++) {
    steps.push({ type: "loop_i", idx: i, dp: [...dp], message: `Processing character '${s[i-1]}' at index ${i-1} (dp length ${i}).`, line: 1 });
    
    // Check single digit
    const singleDigit = parseInt(s.substring(i - 1, i));
    if (singleDigit >= 1 && singleDigit <= 9) {
      dp[i] += dp[i - 1];
      steps.push({ type: "single", idx: i, dp: [...dp], message: `'${singleDigit}' is valid (1-9). dp[${i}] += dp[${i-1}] (adds ${dp[i-1]}).`, line: 2 });
    } else {
      steps.push({ type: "single_invalid", idx: i, dp: [...dp], message: `'${s[i-1]}' is '0', cannot decode as single digit.`, line: 2 });
    }

    // Check double digit
    const doubleDigit = parseInt(s.substring(i - 2, i));
    if (doubleDigit >= 10 && doubleDigit <= 26) {
      dp[i] += dp[i - 2];
      steps.push({ type: "double", idx: i, dp: [...dp], message: `'${doubleDigit}' is valid (10-26). dp[${i}] += dp[${i-2}] (adds ${dp[i-2]}).`, line: 3 });
    } else {
      steps.push({ type: "double_invalid", idx: i, dp: [...dp], message: `'${s.substring(i-2, i)}' is invalid as double digit (must be 10-26).`, line: 3 });
    }
    
    steps.push({ type: "update", idx: i, dp: [...dp], message: `Total ways for prefix of length ${i}: dp[${i}] = ${dp[i]}.`, line: 4 });
  }

  steps.push({ type: "done", idx: n, dp: [...dp], message: `Done. Total ways to decode "${s}" is ${dp[n]}.`, line: 5 });
  return steps;
}

export default function DecodeWaysLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [strInput, setStrInput] = useState("226");
  const [str, setStr] = useState("226");
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const timerRef = useRef<number | null>(null);

  const steps = useMemo(() => simulateDecodeWays(str), [str]);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];

  useEffect(() => {
    setStepIndex(0);
    setPlaying(false);
  }, [str]);

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
    const val = strInput.trim();
    if (/^[0-9]+$/.test(val)) {
      setStr(val);
    } else {
      alert("Please enter only digits.");
    }
  };

  const codeSnippet = [
    "let dp = Array(n + 1).fill(0);",
    "dp[0] = 1; dp[1] = s[0] === '0' ? 0 : 1;",
    "for (let i = 2; i <= n; i++) {",
    "  let single = parseInt(s.substring(i - 1, i));",
    "  let double = parseInt(s.substring(i - 2, i));",
    "  if (single >= 1 && single <= 9) dp[i] += dp[i - 1];",
    "  if (double >= 10 && double <= 26) dp[i] += dp[i - 2];",
    "}"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Dynamic Programming • Strings</span>
          <h1>Decode Ways</h1>
          <p className="description">Given a string of digits, find the number of ways to decode it into letters ('A' = 1, 'B' = 2 ... 'Z' = 26).</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(N)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(N)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>
      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>Overview</h2><p>This problem is similar to the Fibonacci sequence but with constraints. At each step, we can either take 1 digit or 2 digits to decode.</p></article>
          <article className="guide-card"><h2>State Variable</h2><p>Let `dp[i]` be the number of ways to decode the prefix of the string of length `i`.</p></article>
          <article className="guide-card"><h2>Single Digit</h2><p>If the 1-digit substring `s[i-1:i]` is between "1" and "9", it can be decoded on its own. We add `dp[i-1]` to `dp[i]`.</p></article>
          <article className="guide-card highlight"><h2>Double Digit</h2><p>If the 2-digit substring `s[i-2:i]` is between "10" and "26", it forms a valid letter. We add `dp[i-2]` to `dp[i]`.</p></article>
        </div>
      </section>
      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="editor" style={{ display: 'flex', gap: '8px', padding: '0 40px', alignItems: 'center' }}>
            <label style={{ margin: 0 }}>Digit String:</label>
            <input value={strInput} onChange={(e) => setStrInput(e.target.value)} placeholder="e.g., 226" style={{ flex: 1, maxWidth: '200px' }} />
            <button onClick={applyInput}>Set</button>
            <button onClick={() => { setStrInput("226"); setStr("226"); }}>Reset</button>
          </div>
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>🖱️ Adjust the string of digits.</span>
                <span>▶️ Play to watch how the DP builds up combinations.</span>
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
            <div className="canvas" style={{ display: 'flex', flexDirection: 'column', gap: '40px', padding: '20px' }}>
               
               <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
                 {str.split('').map((char, i) => {
                   // Map string index i to dp index i+1
                   const isActive1 = step.idx === i + 1 && (step.type === "single" || step.type === "single_invalid");
                   const isActive2 = step.idx === i + 1 && (step.type === "double" || step.type === "double_invalid");
                   const isPrevDouble = step.idx === i + 2 && (step.type === "double" || step.type === "double_invalid");
                   
                   let border = 'var(--border)';
                   if (isActive1 || isActive2 || isPrevDouble) {
                     border = step.type.includes('invalid') ? 'var(--red)' : 'var(--amber)';
                   }

                   return (
                     <div key={i} style={{
                       width: '40px', height: '50px', borderRadius: '8px',
                       display: 'flex', alignItems: 'center', justifyContent: 'center',
                       background: 'var(--panel)', border: `2px solid ${border}`,
                       fontSize: '24px', fontWeight: 'bold'
                     }}>
                       {char}
                     </div>
                   )
                 })}
               </div>

               <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                 {step.dp?.map((val, idx) => {
                    const isActive = step.idx === idx;
                    const isSource1 = step.idx === idx + 1;
                    const isSource2 = step.idx === idx + 2;
                    let bg = 'var(--panel2)';
                    let border = 'var(--border)';
                    if (isActive) {
                      bg = 'color-mix(in srgb, var(--blue) 20%, transparent)';
                      border = 'var(--blue)';
                    } else if ((isSource1 && step.type === "single") || (isSource2 && step.type === "double")) {
                      bg = 'color-mix(in srgb, var(--green) 20%, transparent)';
                      border = 'var(--green)';
                    }
                    
                    return (
                      <div key={idx} style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                        padding: '12px', borderRadius: '8px', minWidth: '50px',
                        background: bg, border: `2px solid ${border}`,
                        transition: 'all 0.3s'
                      }}>
                         <span style={{ fontSize: '11px', color: 'var(--muted)' }}>dp[{idx}]</span>
                         <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{val}</span>
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
