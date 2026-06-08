"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface SchedStep {
  type: string;
  queue: string[];
  cpu: string | null;
  message: string;
}

function simulateScheduling(): SchedStep[] {
  const steps: SchedStep[] = [];
  const q = ["P1 (10ms)", "P2 (5ms)", "P3 (8ms)"];
  
  steps.push({ type: "init", queue: [...q], cpu: null, message: "Queue loaded with incoming OS processes." });

  const current = q.shift()!;
  steps.push({ type: "process", queue: [...q], cpu: current, message: `CPU loads ${current} from front of queue.` });
  
  steps.push({ type: "slice_end", queue: [...q], cpu: current, message: "Time slice expires. Preempting process." });
  
  q.push("P1 (6ms)"); // time slice was 4ms
  steps.push({ type: "requeue", queue: [...q], cpu: null, message: "P1 not finished. Re-enqueue at the rear." });

  const next = q.shift()!;
  steps.push({ type: "process", queue: [...q], cpu: next, message: `CPU loads next process ${next}.` });

  return steps;
}

export default function CPUSchedulingLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(2500);

  const steps = useMemo(() => simulateScheduling(), []);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];
  const timerRef = useRef<number | null>(null);

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

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Queue • Real World Applications</span>
          <h1>CPU Scheduling (Round Robin)</h1>
          <p className="description">Operating systems utilize Queues to manage processes competing for CPU time. Round Robin assigns a fixed time quantum to each process in FIFO order.</p>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>

      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>The Ready Queue</h2><p>When you open an app, its process goes into a "Ready Queue". The OS pulls from the front of this queue to assign it to a CPU core.</p></article>
          <article className="guide-card highlight"><h2>Time Slice (Quantum)</h2><p>In Round Robin, the CPU only runs a process for a few milliseconds. If it doesn't finish, it gets paused (preempted) and pushed to the back of the queue.</p></article>
          <article className="guide-card"><h2>Fairness</h2><p>This strict FIFO rotation ensures that no single heavy process can freeze the entire computer, giving the illusion of multitasking.</p></article>
        </div>
      </section>

      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to watch how the OS uses a Queue to cycle processes in and out of the CPU.</span>
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
              <label>Speed<input type="range" min="1000" max="4000" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} /></label>
              <label>Timeline<input type="range" min="0" max={Math.max(0, steps.length - 1)} value={stepIndex} onChange={(e) => { setPlaying(false); setStepIndex(Number(e.target.value)); }} /></label>
            </aside>
            <div className="canvas" style={{ display: 'flex', flexDirection: 'column', gap: '40px', padding: '20px', alignItems: 'center' }}>
               
               <div style={{ display: 'flex', gap: '8px', alignItems: 'center', height: '60px', border: '3px solid var(--border)', borderLeft: 'none', borderRight: 'none', padding: '0 20px', background: 'var(--panel2)', minWidth: '400px' }}>
                 <span style={{ color: 'var(--muted)', fontSize: '12px' }}>CPU Front &larr;</span>
                 {step.queue.map((item, idx) => (
                   <div key={`${item}-${idx}`} style={{
                     padding: '8px 12px', background: 'var(--panel)',
                     border: '2px solid var(--blue)', borderRadius: '6px',
                     display: 'flex', alignItems: 'center', justifyContent: 'center',
                     fontWeight: 'bold', fontSize: '14px', color: 'var(--blue)'
                   }}>
                     {item}
                   </div>
                 ))}
                 <span style={{ color: 'var(--muted)', fontSize: '12px', marginLeft: 'auto' }}>&larr; Enqueue Rear</span>
               </div>
               
               <div style={{ 
                 width: '200px', height: '120px', background: 'var(--panel)',
                 border: '4px solid var(--amber)', borderRadius: '12px',
                 display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                 position: 'relative'
               }}>
                 <span style={{ position: 'absolute', top: '8px', fontSize: '12px', color: 'var(--amber)', fontWeight: 'bold' }}>CPU CORE 1</span>
                 {step.cpu ? (
                   <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text)' }}>{step.cpu}</span>
                 ) : (
                   <span style={{ fontSize: '16px', color: 'var(--muted)' }}>IDLE</span>
                 )}
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
