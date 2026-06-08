"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface EvalStep {
  type: string;
  charIndex: number;
  stack: number[];
  message: string;
  line?: number;
}

function simulateEvalPostfix(): EvalStep[] {
  const steps: EvalStep[] = [];
  const exp = ["2", "3", "1", "*", "+", "9", "-"]; // 2 + (3 * 1) - 9 = -4
  const stack: number[] = [];

  steps.push({ type: "init", charIndex: -1, stack: [...stack], message: `Evaluating Postfix Expression: 2 3 1 * + 9 -`, line: 0 });

  for (let i = 0; i < exp.length; i++) {
    const token = exp[i];
    steps.push({ type: "read", charIndex: i, stack: [...stack], message: `Reading token: '${token}'.`, line: 1 });

    if (!isNaN(Number(token))) {
      stack.push(Number(token));
      steps.push({ type: "push_op", charIndex: i, stack: [...stack], message: `'${token}' is an operand. Push to stack.`, line: 2 });
    } else {
      const val2 = stack.pop()!;
      const val1 = stack.pop()!;
      steps.push({ type: "pop_vals", charIndex: i, stack: [...stack], message: `'${token}' is an operator. Pop two values: ${val1} and ${val2}.`, line: 4 });

      let res = 0;
      if (token === '+') res = val1 + val2;
      else if (token === '-') res = val1 - val2;
      else if (token === '*') res = val1 * val2;
      else if (token === '/') res = Math.floor(val1 / val2);
      
      stack.push(res);
      steps.push({ type: "eval_push", charIndex: i, stack: [...stack], message: `Evaluate ${val1} ${token} ${val2} = ${res}. Push ${res} back to stack.`, line: 5 });
    }
  }

  steps.push({ type: "done", charIndex: -1, stack: [...stack], message: `Done. Final answer is ${stack[0]}.`, line: 7 });

  return steps;
}

export default function EvaluatePostfixLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);

  const steps = useMemo(() => simulateEvalPostfix(), []);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];
  const timerRef = useRef<number | null>(null);

  const expTokens = ["2", "3", "1", "*", "+", "9", "-"];

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

  const codeSnippet = [
    "function evaluatePostfix(exp) {",
    "  let stack = [];",
    "  for (let token of exp) {",
    "    if (!isNaN(token)) {",
    "      stack.push(Number(token));",
    "    } else {",
    "      let val2 = stack.pop();",
    "      let val1 = stack.pop();",
    "      if (token === '+') stack.push(val1 + val2);",
    "      else if (token === '-') stack.push(val1 - val2);",
    "      else if (token === '*') stack.push(val1 * val2);",
    "      else if (token === '/') stack.push(Math.floor(val1 / val2));",
    "    }",
    "  }",
    "  return stack.pop();",
    "}"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Stack • Applications</span>
          <h1>Evaluate Postfix Expression</h1>
          <p className="description">Postfix expressions (Reverse Polish Notation) can be evaluated cleanly in a single left-to-right pass using a Stack. No parentheses or precedence rules are needed!</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(N)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(N)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>

      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>The Logic</h2><p>Read the expression from left to right. If you see a number (operand), push it to the stack. If you see an operator (+, -, *, /), it acts on the two most recent numbers.</p></article>
          <article className="guide-card highlight"><h2>Pop Order Matters</h2><p>When an operator is found, pop TWO numbers. The <i>first</i> pop is the right operand (val2). The <i>second</i> pop is the left operand (val1). Then calculate `val1 OPERATOR val2`.</p></article>
          <article className="guide-card"><h2>The Result</h2><p>Push the calculated result back onto the stack. By the end of the expression, exactly one number will remain in the stack: the final answer.</p></article>
        </div>
      </section>

      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to watch how operands build up in the stack, and collapse down when an operator is encountered.</span>
              </div>
              <h2>Current Step</h2>
              <p>{step?.message || "Ready."}</p>
              
              <div className="controls">
                <button onClick={() => setStepIndex(0)}>|&lt;</button>
                <button onClick={() => setStepIndex((i) => Math.max(0, i - 1))}>&lt;</button>
                <button onClick={() => setPlaying((p) => !p)}>{playing ? "Pause" : "Play"}</button>
                <button onClick={() => setStepIndex((i) => Math.min(steps.length - 1, i + 1))}>&gt;</button>
                <button onClick={() => setStepIndex(steps.length - 1)}>&gt;|</button>
              </div>
              <label>Speed<input type="range" min="500" max="3000" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} /></label>
              <label>Timeline<input type="range" min="0" max={Math.max(0, steps.length - 1)} value={stepIndex} onChange={(e) => { setPlaying(false); setStepIndex(Number(e.target.value)); }} /></label>
            </aside>
            <div className="canvas" style={{ display: 'flex', flexDirection: 'column', gap: '30px', padding: '20px', alignItems: 'center' }}>
               
               <div style={{ display: 'flex', gap: '8px', fontSize: '20px', fontFamily: 'monospace' }}>
                 {expTokens.map((char, i) => {
                   const isActive = step.charIndex === i;
                   return (
                     <span key={i} style={{
                       padding: '8px 12px', borderRadius: '4px',
                       background: isActive ? 'color-mix(in srgb, var(--amber) 20%, transparent)' : 'var(--panel2)',
                       color: isActive ? 'var(--amber)' : 'var(--text)',
                       border: isActive ? '2px solid var(--amber)' : '2px solid var(--border)',
                       transition: 'all 0.2s'
                     }}>
                       {char}
                     </span>
                   )
                 })}
               </div>

               <div style={{ 
                 width: '120px', minHeight: '180px', border: '3px solid var(--border)', borderTop: 'none', 
                 borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px',
                 display: 'flex', flexDirection: 'column-reverse', padding: '10px', gap: '8px',
                 background: 'var(--panel2)'
               }}>
                 {step.stack.map((val, idx) => (
                   <div key={idx} style={{
                     width: '100%', height: '40px', background: 'var(--panel)',
                     border: '2px solid var(--blue)', borderRadius: '6px',
                     display: 'flex', alignItems: 'center', justifyContent: 'center',
                     fontWeight: 'bold', fontSize: '20px', color: 'var(--blue)'
                   }}>
                     {val}
                   </div>
                 ))}
                 {step.stack.length === 0 && <div style={{ color: 'var(--muted)', textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', fontSize: '14px' }}>Empty Stack</div>}
               </div>

               <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: 'auto' }}>
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
        .actions, .controls { display: flex; flex-wrap: wrap; gap: 8px; }
        button, a, input { border: 1px solid var(--border); border-radius: 8px; background: var(--panel2); color: var(--text); min-height: 38px; padding: 8px 12px; }
        button { cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .primary-btn { background: var(--blue); color: white; padding: 14px 32px; font-weight: 600; border-radius: 100px; text-decoration: none; display: inline-flex; }
        .detailed-guide { width: min(1120px, calc(100% - 80px)); margin: 0 auto; padding: 100px 0; }
        .guide-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 40px; }
        .guide-card { background: var(--panel); border: 1px solid var(--border); border-radius: 16px; padding: 48px; }
        .guide-card h2 { font-size: 18px; margin: 0 0 16px 0; color: var(--text); }
        .guide-card p { font-size: 14px; line-height: 1.7; color: var(--muted); }
        .guide-card.highlight { border-bottom: 4px solid var(--blue); }
        .simulator { padding: 60px 0 100px; border-top: 1px solid var(--border); }
        .workspace { display: grid; grid-template-columns: 340px 1fr; gap: 40px; padding: 40px; background: var(--panel); border: 1px solid var(--border); border-radius: 16px; margin: 24px auto 0; max-width: 1200px;}
        aside { display: flex; flex-direction: column; gap: 12px; }
        label { display: grid; gap: 6px; margin-top: 12px; color: var(--muted); font-size: 13px; }
        .gesture-hint { background: var(--panel2); border: 1px solid var(--border); border-radius: 8px; padding: 12px; font-size: 11px; color: var(--muted); }
        @media (max-width: 900px) { .workspace { grid-template-columns: 1fr; } }
      `}</style>
    </main>
  );
}
