"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Info, Grid, Move, Compass, MousePointer2 } from "lucide-react";

export default function GridBasedGraphs() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";
  
  const [hoveredCell, setHoveredCell] = useState<{ r: number, c: number } | null>(null);

  const ROWS = 5;
  const COLS = 5;

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <div className="badge">Implicit Graphs</div>
          <h1>Grid-based Graphs</h1>
          <p className="description">
            In many competitive programming and robotics problems, graphs are not explicitly stored. 
            Instead, a <strong>2D Grid</strong> serves as an implicit graph where each cell <code>(r, c)</code> is a vertex, and edges connect adjacent cells.
          </p>
          <div className="complexity-grid">
            <div className="complexity-item">
              <span className="label">Vertices</span>
              <span className="value">Rows × Cols</span>
            </div>
            <div className="complexity-item">
              <span className="label">Max Degree</span>
              <span className="value">4 or 8</span>
            </div>
          </div>
        </div>
      </section>

      <section className="guide">
        <div className="guide-content">
          <div className="card">
            <div className="card-icon"><Grid size={20} /></div>
            <h3>Implicit Adjacency</h3>
            <p>We don't need an adjacency list. We can calculate neighbors on-the-fly using direction arrays like <code>dx = [0,0,1,-1]</code>.</p>
          </div>
          <div className="card highlight">
            <div className="card-icon"><Compass size={20} /></div>
            <h3>Boundary Checks</h3>
            <p>Crucial for grid traversal: always ensure <code>0 ≤ r &lt; R</code> and <code>0 ≤ c &lt; C</code> before accessing <code>grid[r][c]</code>.</p>
          </div>
        </div>
      </section>

      <section className="simulator">
        <div className="workspace">
          <aside className="movable-panel">
            <div className="panel-header">
              <Info size={16} />
              <h2>Adjacency Logic</h2>
            </div>
            
            <div className="status-message">
              {hoveredCell ? `Inspecting cell (${hoveredCell.r}, ${hoveredCell.c}). Its 4-connected neighbors are highlighted in green.` : "Hover over any cell to see its implicit neighborhood."}
            </div>

            <div className="data-section">
              <h3>Direction Vectors</h3>
              <div className="code-block">
                <pre>
{`dr = [-1, 1, 0, 0]
dc = [0, 0, -1, 1]

for i in 0..3:
  nr = r + dr[i]
  nc = c + dc[i]`}
                </pre>
              </div>
            </div>

            <div className="data-section">
              <h3>Neighbor Set</h3>
              <div className="neighbor-list">
                {hoveredCell ? [
                  {r: hoveredCell.r-1, c: hoveredCell.c},
                  {r: hoveredCell.r+1, c: hoveredCell.c},
                  {r: hoveredCell.r, c: hoveredCell.c-1},
                  {r: hoveredCell.r, c: hoveredCell.c+1},
                ].filter(n => n.r >= 0 && n.r < ROWS && n.c >= 0 && n.c < COLS).map((n, i) => (
                  <div key={i} className="neighbor-item">({n.r}, {n.c})</div>
                )) : <div className="empty">Select a cell...</div>}
              </div>
            </div>

            <div className="playback-controls" style={{ border: 'none' }}>
              <div className="tip">
                <MousePointer2 size={14} />
                <span>Move cursor over the grid</span>
              </div>
            </div>
          </aside>

          <div className="canvas-area">
            <div className="grid-viz-wrapper">
              <div className="grid-board" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
                {Array.from({ length: ROWS * COLS }).map((_, i) => {
                  const r = Math.floor(i / COLS);
                  const c = i % COLS;
                  const isHovered = hoveredCell?.r === r && hoveredCell?.c === c;
                  const isNeighbor = hoveredCell && (Math.abs(hoveredCell.r - r) + Math.abs(hoveredCell.c - c) === 1);
                  
                  return (
                    <div 
                      key={i} 
                      className={`grid-cell ${isHovered ? 'active' : ''} ${isNeighbor ? 'neighbor' : ''}`}
                      onMouseEnter={() => setHoveredCell({ r, c })}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <span className="coord">{r},{c}</span>
                      {isHovered && <div className="cell-pulse" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .page { --bg: #0a0d14; --panel: #111827; --panel-light: #1f2937; --border: #2e3a4e; --text: #f3f4f6; --text-dim: #9ca3af; --accent: #4f46e5; --accent-light: #818cf8; --green: #10b981; --amber: #f59e0b; min-height: 100vh; background: var(--bg); color: var(--text); font-family: 'Inter', system-ui, sans-serif; }
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
        .workspace { max-width: 1400px; margin: 0 auto; display: grid; grid-template-columns: 340px 1fr; gap: 48px; background: var(--panel); padding: 48px; border-radius: 32px; border: 1px solid var(--border); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
        
        aside { display: flex; flex-direction: column; gap: 40px; }
        .panel-header { display: flex; align-items: center; gap: 12px; color: var(--text-dim); }
        .panel-header h2 { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
        .status-message { padding: 20px; background: var(--panel-light); border-radius: 16px; border: 1px solid var(--border); font-size: 14px; line-height: 1.5; color: var(--text); font-weight: 500; min-height: 80px; }
        
        .code-block { background: var(--bg); padding: 16px; border-radius: 12px; border: 1px solid var(--border); }
        .code-block pre { margin: 0; font-family: monospace; font-size: 12px; color: var(--accent-light); line-height: 1.5; }
        
        .neighbor-list { display: flex; flex-wrap: wrap; gap: 8px; }
        .neighbor-item { padding: 6px 12px; background: color-mix(in srgb, var(--green) 15%, transparent); border: 1px solid var(--green); color: var(--green); border-radius: 8px; font-weight: 800; font-family: monospace; font-size: 13px; }
        .empty { font-size: 12px; color: var(--text-dim); font-style: italic; }

        .tip { display: flex; align-items: center; gap: 8px; color: var(--text-dim); font-size: 12px; font-style: italic; }

        .canvas-area { background: color-mix(in srgb, var(--bg) 80%, transparent); border-radius: 24px; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; padding: 40px; }
        .grid-board { display: grid; gap: 8px; background: var(--panel-light); padding: 12px; border-radius: 16px; border: 1px solid var(--border); }
        .grid-cell { width: 64px; height: 64px; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; display: flex; align-items: center; justify-content: center; position: relative; transition: all 0.2s; cursor: crosshair; }
        .grid-cell .coord { font-size: 10px; font-family: monospace; color: var(--text-dim); opacity: 0.5; }
        
        .grid-cell.active { border-color: var(--accent); background: var(--accent); transform: scale(1.1); z-index: 10; box-shadow: 0 10px 20px -5px var(--accent); }
        .grid-cell.active .coord { color: white; opacity: 1; }
        
        .grid-cell.neighbor { border-color: var(--green); background: color-mix(in srgb, var(--green) 8%, transparent); }
        .grid-cell.neighbor .coord { color: var(--green); opacity: 1; }
        
        .cell-pulse { position: absolute; inset: -4px; border: 2px solid var(--accent-light); border-radius: 12px; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.3); opacity: 0; } }
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

