"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface ConvertStep {
  type: string;
  charIndex: number;
  stack: string[];
  message: string;
  line?: number;
}

function simulatePrefixToInfix(): ConvertStep[] {
  const steps: ConvertStep[] = [];
  const exp = "*+ab-cd"; // (a+b)*(c-d)
  const stack: string[] = [];

  steps.push({ type: "init", charIndex: -1, stack: [...stack], message: `Convert Prefix to Infix: ${exp}`, line: 0 });

  // Read right-to-left
  for (let i = exp.length - 1; i >= 0; i--) {
    const char = exp[i];
    steps.push({ type: "read", charIndex: i, stack: [...stack], message: `Read character '${char}' (right-to-left).`, line: 1 });

    if (char.match(/[a-zA-Z0-9]/)) {
      stack.push(char);
      steps.push({ type: "operand", charIndex: i, stack: [...stack], message: `'${char}' is an operand. Push directly to stack.`, line: 2 });
    } else {
      const val1 = stack.pop()!;
      const val2 = stack.pop()!;
      const newExp = `(${val1}${char}${val2})`;
      stack.push(newExp);
      steps.push({ type: "operator", charIndex: i, stack: [...stack], message: `'${char}' is an operator. Pop val1 (${val1}) and val2 (${val2}). Combine as ${newExp} and push back.`, line: 4 });
    }
  }

  steps.push({ type: "done", charIndex: -1, stack: [...stack], message: `Done! Final Infix: ${stack[0]}`, line: 6 });

  return steps;
}

export default function PrefixToInfixLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);

  const steps = useMemo(() => simulatePrefixToInfix(), []);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];
  const timerRef = useRef<number | null>(null);

  const exp = "*+ab-cd";

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
    "function prefixToInfix(exp) {",
    "  let stack = [];",
    "  for (let i = exp.length - 1; i >= 0; i--) {",
    "    let char = exp[i];",
    "    if (isOperand(char)) {",
    "      stack.push(char);",
    "    } else {",
    "      let val1 = stack.pop();",
    "      let val2 = stack.pop();",
    "      stack.push('(' + val1 + char + val2 + ')');",
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
          <h1>Prefix to Infix Conversion</h1>
          <p className="description">Converting Prefix back to Infix requires reading the string backwards and wrapping elements in parentheses as they are joined.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(N)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(N)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>

      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>Backwards Scan</h2><p>Because Prefix notation puts the operator before the operands, we must scan from Right to Left to hit the operands first.</p></article>
          <article className="guide-card highlight"><h2>Pop Order</h2><p>Because we are scanning backwards, the FIRST popped element is `val1` (the left operand) and the SECOND popped element is `val2` (the right operand).</p></article>
          <article className="guide-card"><h2>The String Stack</h2><p>As always, the stack stores intermediate string chunks wrapped in `()`. When the loop finishes, the one remaining string is the full Infix expression.</p></article>
        </div>
      </section>

      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to watch the Right-to-Left string assembly.</span>
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
               
               <div style={{ display: 'flex', gap: '8px', fontSize: '24px', fontFamily: 'monospace' }}>
                 {exp.split('').map((char, i) => {
                   const isActive = step.charIndex === i;
                   return (
                     <span key={i} style={{
                       padding: '8px 12px', borderRadius: '4px',
                       background: isActive ? 'color-mix(in srgb, var(--amber) 20%, transparent)' : 'transparent',
                       color: isActive ? 'var(--amber)' : 'var(--text)',
                       borderBottom: isActive ? '2px solid var(--amber)' : '2px solid transparent',
                       transition: 'all 0.2s'
                     }}>
                       {char}
                     </span>
                   )
                 })}
               </div>

               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginTop: '20px' }}>
                 <span style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>String Stack</span>
                 <div style={{ 
                   width: '240px', minHeight: '150px', border: '3px solid var(--border)', borderTop: 'none', 
                   borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px',
                   display: 'flex', flexDirection: 'column-reverse', padding: '10px', gap: '4px',
                   background: 'var(--panel2)'
                 }}>
                   {step.stack.map((str, idx) => (
                     <div key={idx} style={{
                       width: '100%', height: '40px', background: 'var(--panel)',
                       border: '2px solid var(--blue)', borderRadius: '4px',
                       display: 'flex', alignItems: 'center', justifyContent: 'center',
                       fontWeight: 'bold', fontSize: '16px', color: 'var(--blue)'
                     }}>
                       {str}
                     </div>
                   ))}
                   {step.stack.length === 0 && <div style={{ color: 'var(--muted)', textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', fontSize: '14px' }}>Empty</div>}
                 </div>
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
