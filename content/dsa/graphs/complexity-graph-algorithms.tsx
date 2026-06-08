"use client";

import { useTheme } from "next-themes";
import { Info, Zap, Clock, ShieldAlert, Cpu } from "lucide-react";

const ALGO_COMPLEXITY = [
  { name: "BFS / DFS", time: "O(V + E)", space: "O(V)", type: "Traversal" },
  { name: "Dijkstra", time: "O(E log V)", space: "O(V)", type: "Shortest Path" },
  { name: "Bellman-Ford", time: "O(V × E)", space: "O(V)", type: "Shortest Path" },
  { name: "Floyd-Warshall", time: "O(V³)", space: "O(V²)", type: "All-Pairs" },
  { name: "Kruskal / Prim", time: "O(E log E)", space: "O(V + E)", type: "MST" },
  { name: "Tarjan's SCC", time: "O(V + E)", space: "O(V)", type: "Connectivity" },
  { name: "Topological Sort", time: "O(V + E)", space: "O(V)", type: "DAG" },
];

export default function ComplexityGraphAlgorithms() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <div className="badge">Efficiency Analysis</div>
          <h1>Algorithm Complexity</h1>
          <p className="description">
            A comprehensive guide to the time and space complexity of fundamental graph algorithms. 
            Understanding these bounds is essential for selecting the optimal approach based on the size and density of your input data.
          </p>
          <div className="complexity-grid">
            <div className="complexity-item">
              <span className="label">Notation</span>
              <span className="value">Big O (Worst Case)</span>
            </div>
            <div className="complexity-item">
              <span className="label">Variables</span>
              <span className="value">V = Nodes, E = Edges</span>
            </div>
          </div>
        </div>
      </section>

      <section className="guide">
        <div className="guide-content">
          <div className="card">
            <div className="card-icon"><Clock size={20} /></div>
            <h3>Time Bounds</h3>
            <p>Most basic traversals are linear <code>O(V+E)</code>, while complex pathfinding involving edge weights or multiple pairs scales quadratically or cubically.</p>
          </div>
          <div className="card highlight">
            <div className="card-icon"><ShieldAlert size={20} /></div>
            <h3>Dense vs Sparse</h3>
            <p>For sparse graphs <code>(E ≈ V)</code>, linear algorithms shine. For dense graphs <code>(E ≈ V²)</code>, the overhead of priority queues (log V) becomes significant.</p>
          </div>
        </div>
      </section>

      <section className="simulator">
        <div className="workspace">
          <aside className="movable-panel">
            <div className="panel-header">
              <Info size={16} />
              <h2>Efficiency Guide</h2>
            </div>
            
            <div className="status-message">
              Refer to this table to determine which algorithm fits your performance requirements.
            </div>

            <div className="data-section">
              <h3>Resource Usage</h3>
              <div className="legend-pills">
                <div className="pill linear">Linear</div>
                <div className="pill log">Log-Linear</div>
                <div className="pill cubic">Polynomial</div>
              </div>
            </div>

            <div className="playback-controls" style={{ border: 'none' }}>
              <div className="tip">
                <Cpu size={14} />
                <span>Performance is hardware dependent, Big O is theoretical</span>
              </div>
            </div>
          </aside>

          <div className="canvas-area">
            <div className="table-wrapper">
              <table className="complexity-table">
                <thead>
                  <tr>
                    <th>Algorithm</th>
                    <th>Category</th>
                    <th>Time</th>
                    <th>Space</th>
                  </tr>
                </thead>
                <tbody>
                  {ALGO_COMPLEXITY.map((algo, i) => (
                    <tr key={i}>
                      <td className="algo-name">{algo.name}</td>
                      <td><span className="type-badge">{algo.type}</span></td>
                      <td className="complexity-val time">{algo.time}</td>
                      <td className="complexity-val space">{algo.space}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .page { --bg: #0a0d14; --panel: #111827; --panel-light: #1f2937; --border: #2e3a4e; --text: #f3f4f6; --text-dim: #9ca3af; --accent: #4f46e5; --accent-light: #818cf8; --green: #10b981; --amber: #f59e0b; --red: #ef4444; min-height: 100vh; background: var(--bg); color: var(--text); font-family: 'Inter', system-ui, sans-serif; }
        .page[data-theme="light"] { --bg: #f8fafc; --panel: #ffffff; --panel-light: #f1f5f9; --border: #e2e8f0; --text: #0f172a; --text-dim: #64748b; --accent: #4f46e5; --accent-light: #6366f1; }
        
        .hero { padding: 80px 24px; text-align: center; border-bottom: 1px solid var(--border); }
        .hero .content-width { max-width: 800px; margin: 0 auto; }
        .badge { display: inline-block; padding: 4px 12px; background: color-mix(in srgb, var(--accent) 15%, transparent); color: var(--accent-light); border-radius: 99px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px; }
        .hero h1 { font-size: 56px; font-weight: 900; letter-spacing: -0.02em; margin-bottom: 24px; }
        .description { font-size: 18px; color: var(--text-dim); line-height: 1.6; margin-bottom: 40px; }
        .complexity-grid { display: flex; justify-content: center; gap: 40px; }
        .complexity-item { display: flex; flex-direction: column; align-items: center; }
        .complexity-item .label { font-size: 12px; font-weight: 600; text-transform: uppercase; color: var(--text-dim); margin-bottom: 4px; }
        .complexity-item .value { font-size: 24px; font-weight: 800; color: var(--accent-light); font-family: monospace; }

        .guide { padding: 60px 24px; background: color-mix(in srgb, var(--panel) 50%, transparent); }
        .guide-content { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
        .card { padding: 48px; background: var(--panel); border: 1px solid var(--border); border-radius: 24px; }
        .card.highlight { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 5%, var(--panel)); }
        .card-icon { width: 40px; height: 40px; border-radius: 12px; background: color-mix(in srgb, var(--accent) 15%, transparent); color: var(--accent-light); display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
        .card h3 { font-size: 20px; font-weight: 700; margin-bottom: 12px; }
        .card p { color: var(--text-dim); font-size: 14px; line-height: 1.6; }

        .simulator { padding: 60px 24px; }
        .workspace { max-width: 1400px; margin: 0 auto; display: grid; grid-template-columns: 320px 1fr; gap: 48px; background: var(--panel); padding: 48px; border-radius: 32px; border: 1px solid var(--border); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
        
        aside { display: flex; flex-direction: column; gap: 40px; }
        .panel-header { display: flex; align-items: center; gap: 12px; color: var(--text-dim); }
        .panel-header h2 { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
        .status-message { padding: 20px; background: var(--panel-light); border-radius: 16px; border: 1px solid var(--border); font-size: 14px; line-height: 1.5; color: var(--text); font-weight: 500; }
        
        .legend-pills { display: flex; flex-direction: column; gap: 8px; }
        .pill { padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 800; text-transform: uppercase; text-align: center; border: 1px solid var(--border); }
        .pill.linear { color: var(--green); border-color: var(--green); background: color-mix(in srgb, var(--green) 10%, transparent); }
        .pill.log { color: var(--accent-light); border-color: var(--accent-light); background: color-mix(in srgb, var(--accent) 10%, transparent); }
        .pill.cubic { color: var(--red); border-color: var(--red); background: color-mix(in srgb, var(--red) 10%, transparent); }

        .tip { display: flex; align-items: center; gap: 8px; color: var(--text-dim); font-size: 12px; font-style: italic; }

        .canvas-area { background: color-mix(in srgb, var(--bg) 80%, transparent); border-radius: 24px; border: 1px solid var(--border); padding: 40px; overflow-x: auto; }
        .table-wrapper { width: 100%; min-width: 600px; }
        .complexity-table { width: 100%; border-collapse: separate; border-spacing: 0 12px; }
        .complexity-table th { color: var(--text-dim); font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; padding: 0 16px; text-align: left; }
        .complexity-table td { padding: 20px 16px; background: var(--panel); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .complexity-table td:first-child { border-left: 1px solid var(--border); border-top-left-radius: 16px; border-bottom-left-radius: 16px; }
        .complexity-table td:last-child { border-right: 1px solid var(--border); border-top-right-radius: 16px; border-bottom-right-radius: 16px; }
        
        .algo-name { font-weight: 800; font-size: 16px; color: var(--text); }
        .type-badge { font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 4px 8px; background: var(--panel-light); border-radius: 6px; color: var(--text-dim); }
        .complexity-val { font-family: monospace; font-weight: 700; font-size: 15px; }
        .complexity-val.time { color: var(--accent-light); }
        .complexity-val.space { color: var(--text-dim); }
        .workspace > aside,
        .workspace > .inspector-panel,
        .workspace > .side-panel,
        .workspace > .control-panel,
        .workspace > .visual-panel,
        .workspace > .data-panel {
          resize: both;
          overflow: auto;
          min-width: 180px;
          min-height: 140px;
          max-width: 640px;
          max-height: 720px;
        }
      `}</style>
    </main>
  );
}

