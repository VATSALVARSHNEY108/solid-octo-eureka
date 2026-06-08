"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface TourStep {
  type: string;
  idx: number;
  start: number;
  tank: number;
  totalDeficit: number;
  message: string;
  line?: number;
}

function simulateCircularTour(): TourStep[] {
  const steps: TourStep[] = [];
  const petrol = [4, 6, 7, 4];
  const distance = [6, 5, 3, 5];
  
  let start = 0;
  let tank = 0;
  let totalDeficit = 0;

  steps.push({ type: "init", idx: -1, start, tank, totalDeficit, message: "Initialize tank, deficit, and start index at 0.", line: 0 });

  for (let i = 0; i < petrol.length; i++) {
    steps.push({ type: "check", idx: i, start, tank, totalDeficit, message: `At station ${i}: Petrol = ${petrol[i]}, Distance to next = ${distance[i]}`, line: 1 });
    
    tank += petrol[i] - distance[i];
    steps.push({ type: "add", idx: i, start, tank, totalDeficit, message: `Updated tank: tank += (petrol - distance) = ${tank}`, line: 2 });
    
    if (tank < 0) {
      steps.push({ type: "fail", idx: i, start, tank, totalDeficit, message: `Tank is negative! Cannot reach next station from start ${start}.`, line: 3 });
      
      start = i + 1;
      totalDeficit += tank;
      tank = 0;
      
      steps.push({ type: "reset", idx: i, start, tank, totalDeficit, message: `Reset tank to 0. Add deficit. New potential start is ${start}.`, line: 4 });
    } else {
      steps.push({ type: "success", idx: i, start, tank, totalDeficit, message: `Successfully reached next station. Tank is ${tank}.`, line: 7 });
    }
  }

  if (tank + totalDeficit >= 0) {
    steps.push({ type: "done_success", idx: -1, start, tank, totalDeficit, message: `Total sum >= 0. Valid tour found starting at index ${start}.`, line: 9 });
  } else {
    steps.push({ type: "done_fail", idx: -1, start: -1, tank, totalDeficit, message: `Total sum < 0. No circular tour is possible.`, line: 10 });
  }

  return steps;
}

export default function CircularTourLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);

  const steps = useMemo(() => simulateCircularTour(), []);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];
  const timerRef = useRef<number | null>(null);

  const petrol = [4, 6, 7, 4];
  const distance = [6, 5, 3, 5];

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
    "let start = 0, tank = 0, totalDeficit = 0;",
    "for (let i = 0; i < N; i++) {",
    "  tank += petrol[i] - distance[i];",
    "  if (tank < 0) {",
    "    start = i + 1;",
    "    totalDeficit += tank;",
    "    tank = 0;",
    "  }",
    "}",
    "return (tank + totalDeficit >= 0) ? start : -1;"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Queue • Optimization</span>
          <h1>Circular Tour / Gas Station</h1>
          <p className="description">Given a circular route with petrol pumps, find the starting pump from which the truck can complete the entire circle without running out of petrol.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(N)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(1)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>

      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>The Logic</h2><p>If we start at `A` and run out of gas before reaching `B`, it means NO station between `A` and `B` can be a valid starting point either! So our next potential start is `B+1`.</p></article>
          <article className="guide-card highlight"><h2>Queue Tie-in</h2><p>This problem is often solved natively using a Queue by enqueuing and dequeuing stations. However, the optimized O(N) O(1) approach presented here conceptually slides a window over the route without actually needing queue memory.</p></article>
          <article className="guide-card"><h2>Total Deficit</h2><p>We keep track of the gas deficit generated by failed starting points. At the very end, if the gas left in the tank covers the historical deficit, a tour is possible.</p></article>
        </div>
      </section>

      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to watch the window advance. Notice how the start point jumps forward whenever the tank hits negative!</span>
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
            <div className="canvas" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
               
               <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                 {petrol.map((p, i) => {
                   const isCurrent = step.idx === i;
                   const isStart = step.start === i;
                   const isInWindow = i >= step.start && i <= (step.idx >= step.start ? step.idx : step.idx + petrol.length);
                   
                   let bg = 'var(--panel2)';
                   let border = 'var(--border)';

                   if (isCurrent && step.type === "fail") {
                     bg = 'color-mix(in srgb, var(--red) 20%, transparent)';
                     border = 'var(--red)';
                   } else if (isCurrent) {
                     bg = 'color-mix(in srgb, var(--amber) 20%, transparent)';
                     border = 'var(--amber)';
                   } else if (isInWindow) {
                     border = 'var(--blue)';
                   }

                   return (
                     <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                       <span style={{ fontSize: '11px', fontWeight: 'bold', color: isStart ? 'var(--blue)' : 'transparent' }}>START</span>
                       <div style={{
                         width: '50px', padding: '10px 0', background: bg,
                         border: `2px solid ${border}`, borderRadius: '6px',
                         display: 'flex', flexDirection: 'column', alignItems: 'center'
                       }}>
                         <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--green)' }}>+ {p}</span>
                         <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--red)' }}>- {distance[i]}</span>
                       </div>
                       <span style={{ fontSize: '10px', color: 'var(--muted)' }}>Stat {i}</span>
                     </div>
                   )
                 })}
               </div>

               <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '20px' }}>
                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   <span style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase' }}>Current Tank</span>
                   <span style={{ fontSize: '24px', fontWeight: 'bold', color: step.tank < 0 ? 'var(--red)' : 'var(--blue)' }}>{step.tank}</span>
                 </div>
                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   <span style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase' }}>Total Deficit</span>
                   <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--amber)' }}>{step.totalDeficit}</span>
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
