"use client";

import { useTheme } from "next-themes";

export default function ComplexityStackLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Stack & Queue • Theory</span>
          <h1>Stack Complexity Analysis</h1>
          <p className="description">Understanding the Time and Space complexity of core Stack operations is critical. Stack provides hyper-efficient access as long as you strictly follow the LIFO rule.</p>
        </div>
      </section>

      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card highlight">
            <h2>Time Complexity</h2>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
              <li><strong>Push(): O(1)</strong> - Adding to the top involves a single index update or pointer change.</li>
              <li><strong>Pop(): O(1)</strong> - Removing from the top is instantaneous.</li>
              <li><strong>Peek()/Top(): O(1)</strong> - Accessing the top element doesn't require traversal.</li>
              <li><strong>Search/Access(i): O(N)</strong> - Getting a random element requires popping N elements to reach it.</li>
            </ul>
          </article>
          <article className="guide-card">
            <h2>Space Complexity</h2>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
              <li><strong>Overall: O(N)</strong> - For N elements, you need N memory locations.</li>
              <li><strong>Dynamic Resizing:</strong> If implemented via arrays (like `std::vector`), pushing can occasionally take O(N) during a reallocation event, but the <i>Amortized</i> time remains O(1).</li>
              <li><strong>Linked List:</strong> O(1) guaranteed push time, but has extra memory overhead for pointers.</li>
            </ul>
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
        .guide-card.highlight { border-bottom: 4px solid var(--blue); }
      `}</style>
    </main>
  );
}
