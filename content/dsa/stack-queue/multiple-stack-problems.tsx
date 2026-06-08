"use client";

import { useTheme } from "next-themes";

export default function MultipleStackProblemsLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Stack • Advanced Patterns</span>
          <h1>Multiple Stacks Techniques</h1>
          <p className="description">Certain complex problems can be elegantly solved by using two or more Stacks simultaneously to manage state, track histories, or implement Queues.</p>
        </div>
      </section>

      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card highlight">
            <h2>Queue using Two Stacks</h2>
            <p>You can simulate a FIFO Queue using two LIFO Stacks! One stack is the 'Input' stack. When you need to dequeue, if the 'Output' stack is empty, you pop everything from Input and push it to Output. This flips the LIFO to FIFO.</p>
          </article>
          <article className="guide-card">
            <h2>Min/Max Stack</h2>
            <p>As covered earlier, using a `main` stack for data and an `auxiliary` stack to track the minimum or maximum element at that exact state.</p>
          </article>
          <article className="guide-card">
            <h2>Text Editor Undo/Redo</h2>
            <p>Maintain an `Undo` stack and a `Redo` stack. Typing pushes to Undo. Pressing Undo pops from Undo and pushes to Redo. Pressing Redo pops from Redo and pushes to Undo.</p>
          </article>
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
        .detailed-guide { width: min(1120px, calc(100% - 80px)); margin: 0 auto; padding: 100px 0; }
        .guide-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px; }
        .guide-card { background: var(--panel); border: 1px solid var(--border); border-radius: 16px; padding: 48px; }
        .guide-card h2 { font-size: 18px; margin: 0 0 24px 0; color: var(--text); border-bottom: 1px solid var(--border); padding-bottom: 12px; }
        .guide-card p { font-size: 14px; line-height: 1.7; color: var(--muted); }
        .guide-card.highlight { border-bottom: 4px solid var(--amber); }
      `}</style>
    </main>
  );
}
