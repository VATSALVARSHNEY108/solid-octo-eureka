"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface BoolStep {
  type: string;
  len: number;
  i: number;
  j: number;
  k: number;
  dpT: number[][];
  dpF: number[][];
  message: string;
  line?: number;
}

function simulateBoolParen(S: string): BoolStep[] {
  const steps: BoolStep[] = [];
  const n = S.length;
  
  const dpT = Array.from({ length: n }, () => Array(n).fill(0));
  const dpF = Array.from({ length: n }, () => Array(n).fill(0));

  steps.push({ type: "init", len: 1, i: -1, j: -1, k: -1, dpT: dpT.map(r => [...r]), dpF: dpF.map(r => [...r]), message: "Initialize DP tables for True and False counts.", line: 0 });

  for (let i = 0; i < n; i += 2) {
    if (S[i] === 'T') dpT[i][i] = 1;
    else dpF[i][i] = 1;
    steps.push({ type: "base", len: 1, i, j: i, k: -1, dpT: dpT.map(r => [...r]), dpF: dpF.map(r => [...r]), message: `Base case length 1: '${S[i]}' at index ${i}.`, line: 1 });
  }

  for (let len = 3; len <= n; len += 2) {
    for (let i = 0; i <= n - len; i += 2) {
      const j = i + len - 1;
      steps.push({ type: "loop_len", len, i, j, k: -1, dpT: dpT.map(r => [...r]), dpF: dpF.map(r => [...r]), message: `Evaluating substring [${i}, ${j}]: "${S.slice(i, j + 1)}"`, line: 2 });
      
      for (let k = i + 1; k < j; k += 2) {
        steps.push({ type: "loop_k", len, i, j, k, dpT: dpT.map(r => [...r]), dpF: dpF.map(r => [...r]), message: `Split at operator '${S[k]}' (index ${k}). Left: [${i}, ${k-1}], Right: [${k+1}, ${j}].`, line: 3 });
        
        const leftT = dpT[i][k - 1];
        const leftF = dpF[i][k - 1];
        const rightT = dpT[k + 1][j];
        const rightF = dpF[k + 1][j];
        
        const totalWays = (leftT + leftF) * (rightT + rightF);
        
        if (S[k] === '&') {
          dpT[i][j] += leftT * rightT;
          dpF[i][j] += totalWays - (leftT * rightT);
        } else if (S[k] === '|') {
          dpF[i][j] += leftF * rightF;
          dpT[i][j] += totalWays - (leftF * rightF);
        } else if (S[k] === '^') {
          dpT[i][j] += leftT * rightF + leftF * rightT;
          dpF[i][j] += leftT * rightT + leftF * rightF;
        }
        
        steps.push({ type: "update", len, i, j, k, dpT: dpT.map(r => [...r]), dpF: dpF.map(r => [...r]), message: `Update using '${S[k]}'. New dpT[${i}][${j}] = ${dpT[i][j]}, dpF[${i}][${j}] = ${dpF[i][j]}.`, line: 4 });
      }
    }
  }

  steps.push({ type: "done", len: n, i: 0, j: n - 1, k: -1, dpT: dpT.map(r => [...r]), dpF: dpF.map(r => [...r]), message: `Done. Number of ways to evaluate to True is dpT[0][${n-1}] = ${dpT[0][n-1]}.`, line: 5 });
  return steps;
}

export default function BooleanParenthesizationLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [exprInput, setExprInput] = useState("T|T&F^T");
  const [expr, setExpr] = useState("T|T&F^T");
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(750);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const timerRef = useRef<number | null>(null);

  const steps = useMemo(() => simulateBoolParen(expr), [expr]);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];

  useEffect(() => {
    setStepIndex(0);
    setPlaying(false);
  }, [expr]);

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

  const applyExpr = () => {
    const val = exprInput.trim().toUpperCase();
    let isValid = true;
    for (let i = 0; i < val.length; i++) {
      if (i % 2 === 0) {
        if (val[i] !== 'T' && val[i] !== 'F') isValid = false;
      } else {
        if (val[i] !== '&' && val[i] !== '|' && val[i] !== '^') isValid = false;
      }
    }
    if (isValid && val.length % 2 === 1) {
      setExpr(val);
    } else {
      alert("Invalid expression. Must alternate T/F and &/|/^, starting and ending with T/F.");
    }
  };

  const codeSnippet = [
    "for (let len = 3; len <= N; len += 2)",
    "  for (let i = 0; i <= N - len; i += 2) {",
    "    let j = i + len - 1;",
    "    for (let k = i + 1; k < j; k += 2) {",
    "      let leftT = dpT[i][k-1], leftF = dpF[i][k-1];",
    "      let rightT = dpT[k+1][j], rightF = dpF[k+1][j];",
    "      // update dpT[i][j] and dpF[i][j] based on op S[k]",
    "    }",
    "  }"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Dynamic Programming • Interval DP</span>
          <h1>Boolean Parenthesization</h1>
          <p className="description">Find the number of ways to parenthesize a boolean expression so that it evaluates to True.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(N^3)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(N^2)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>
      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>Overview</h2><p>This is a classic Interval DP problem. We evaluate every possible substring and partition it into left and right sub-expressions.</p></article>
          <article className="guide-card"><h2>Two States</h2><p>Because operators like XOR (`^`) need both True and False values to produce True, we must track the number of ways to evaluate to both True and False.</p></article>
          <article className="guide-card"><h2>Partitioning</h2><p>For a substring from `i` to `j`, we iterate a split point `k` on the operators. The total combinations come from multiplying the left ways and right ways.</p></article>
          <article className="guide-card highlight"><h2>Key Insight</h2><p>By splitting at the operator, we reduce the problem to two smaller, independent problems. The results are combined based on the truth table of the operator.</p></article>
        </div>
      </section>
      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="editor" style={{ display: 'flex', gap: '8px', padding: '0 40px' }}>
            <input value={exprInput} onChange={(e) => setExprInput(e.target.value)} placeholder="e.g., T|T&F^T" style={{ flex: 1, maxWidth: '300px' }} />
            <button onClick={applyExpr}>Update Expression</button>
            <button onClick={() => { setExprInput("T|T&F^T"); setExpr("T|T&F^T"); }}>Reset</button>
          </div>
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>🖱️ Use the input to change the expression (e.g., T|F&T).</span>
                <span>▶️ Play to watch how the interval splits recursively.</span>
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
               <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '20px' }}>
                 {expr.split('').map((char, idx) => {
                    const isOp = idx % 2 === 1;
                    const inInterval = idx >= step.i && idx <= step.j;
                    const isSplit = idx === step.k;
                    
                    let bg = 'var(--panel2)';
                    let border = 'var(--border)';
                    if (isSplit) {
                      bg = 'color-mix(in srgb, var(--red) 20%, transparent)';
                      border = 'var(--red)';
                    } else if (inInterval) {
                      bg = 'color-mix(in srgb, var(--blue) 20%, transparent)';
                      border = 'var(--blue)';
                    }
                    
                    return (
                      <div key={idx} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: isOp ? '30px' : '40px', 
                        height: isOp ? '30px' : '40px', 
                        borderRadius: '8px',
                        background: bg, border: `2px solid ${border}`,
                        fontWeight: 'bold', fontSize: isOp ? '16px' : '20px',
                        color: isOp ? 'var(--amber)' : (char === 'T' ? 'var(--green)' : 'var(--muted)'),
                        transition: 'all 0.3s'
                      }}>{char}</div>
                    );
                 })}
               </div>
               
               {step.i !== -1 && step.j !== -1 && step.i !== step.j && step.k !== -1 && (
                 <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                   <div style={{ padding: '16px', background: 'var(--panel)', border: '1px solid var(--blue)', borderRadius: '8px', textAlign: 'center' }}>
                     <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>Left Substring</div>
                     <div style={{ fontWeight: 'bold' }}>T: {step.dpT[step.i]?.[step.k - 1]} | F: {step.dpF[step.i]?.[step.k - 1]}</div>
                   </div>
                   <div style={{ padding: '16px', background: 'var(--panel)', border: '1px solid var(--amber)', borderRadius: '8px', textAlign: 'center' }}>
                     <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>Right Substring</div>
                     <div style={{ fontWeight: 'bold' }}>T: {step.dpT[step.k + 1]?.[step.j]} | F: {step.dpF[step.k + 1]?.[step.j]}</div>
                   </div>
                 </div>
               )}
               
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
        .canvas { width: 100%; min-height: 560px; background: linear-gradient(var(--panel2) 1px, transparent 1px), linear-gradient(90deg, var(--panel2) 1px, transparent 1px), var(--bg); background-size: 34px 34px; border: 1px solid var(--border); border-radius: 8px; }
        .gesture-hint { background: var(--panel2); border: 1px solid var(--border); border-radius: 8px; padding: 12px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 4px; font-size: 11px; color: var(--muted); }
        @media (max-width: 900px) { .workspace { grid-template-columns: 1fr; } }
      `}</style>
    </main>
  );
}
