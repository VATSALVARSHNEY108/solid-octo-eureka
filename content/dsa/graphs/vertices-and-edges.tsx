"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Info, Box, Share2, MousePointer2 } from "lucide-react";

export default function VerticesAndEdges() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";
  
  const [activeTab, setActiveTab] = useState<"vertex" | "edge">("vertex");

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <div className="badge">Atomic Elements</div>
          <h1>Vertices and Edges</h1>
          <p className="description">
            The fundamental constituents of any network topology. 
            <strong>Vertices</strong> represent the discrete entities, while <strong>Edges</strong> materialize the interactions between them.
          </p>
          <div className="complexity-grid">
            <div className="complexity-item">
              <span className="label">Node Notation</span>
              <span className="value">V ∈ V</span>
            </div>
            <div className="complexity-item">
              <span className="label">Link Notation</span>
              <span className="value">e = (u, v)</span>
            </div>
          </div>
        </div>
      </section>

      <section className="guide">
        <div className="guide-content">
          <div className="card clickable" onClick={() => setActiveTab("vertex")} style={{ borderColor: activeTab === "vertex" ? 'var(--accent)' : '' }}>
            <div className="card-icon"><Box size={20} /></div>
            <h3>The Vertex</h3>
            <p>An individual point or node in a graph. It's the "who" or "what" in our model. In a social network, a vertex is a person.</p>
          </div>
          <div className="card highlight clickable" onClick={() => setActiveTab("edge")} style={{ borderColor: activeTab === "edge" ? 'var(--accent)' : '' }}>
            <div className="card-icon"><Share2 size={20} /></div>
            <h3>The Edge</h3>
            <p>A connection between two vertices. It's the "how" or "why" they relate. In a social network, an edge is a friendship.</p>
          </div>
        </div>
      </section>

      <section className="simulator">
        <div className="workspace">
          <aside className="movable-panel">
            <div className="panel-header">
              <Info size={16} />
              <h2>Property Inspector</h2>
            </div>
            
            <div className="status-message">
              Exploring the internal attributes of {activeTab === "vertex" ? "a Vertex (V)" : "an Edge (E)"}.
            </div>

            <div className="data-section">
              <h3>Key Metrics</h3>
              <div className="metrics-list">
                {activeTab === "vertex" ? (
                  <>
                    <div className="metric-item">
                      <span className="label">Degree</span>
                      <span className="val">Number of incident edges</span>
                    </div>
                    <div className="metric-item">
                      <span className="label">Adjacency</span>
                      <span className="val">Neighbors connected via edges</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="metric-item">
                      <span className="label">Incidence</span>
                      <span className="val">Vertices connected by the edge</span>
                    </div>
                    <div className="metric-item">
                      <span className="label">Weight</span>
                      <span className="val">Cost, Distance, or Capacity</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="playback-controls" style={{ border: 'none' }}>
              <div className="tip">
                <MousePointer2 size={14} />
                <span>Switch tabs to compare building blocks</span>
              </div>
            </div>
          </aside>

          <div className="canvas-area">
            <div className="visual-focus">
              {activeTab === "vertex" ? (
                <svg viewBox="0 0 300 300">
                  <defs>
                    <filter id="focus-glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="5" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  <circle cx="150" cy="150" r="50" className="hero-node" />
                  <text x="150" y="150" dy="0.35em" textAnchor="middle" className="hero-text">Vertex</text>
                  <circle cx="150" cy="150" r="60" className="node-aura" />
                </svg>
              ) : (
                <svg viewBox="0 0 300 300">
                  <line x1="60" y1="150" x2="240" y2="150" className="hero-edge" />
                  <circle cx="60" cy="150" r="12" className="mini-node" />
                  <circle cx="240" cy="150" r="12" className="mini-node" />
                  <text x="150" y="130" textAnchor="middle" className="hero-text">Edge (u, v)</text>
                </svg>
              )}
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .page { --bg: #0a0d14; --panel: #111827; --panel-light: #1f2937; --border: #2e3a4e; --text: #f3f4f6; --text-dim: #9ca3af; --accent: #4f46e5; --accent-light: #818cf8; --green: #10b981; min-height: 100vh; background: var(--bg); color: var(--text); font-family: 'Inter', system-ui, sans-serif; }
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
        .card { padding: 48px; background: var(--panel); border: 1px solid var(--border); border-radius: 24px; transition: all 0.2s; }
        .card.clickable { cursor: pointer; }
        .card.clickable:hover { transform: scale(1.02); }
        .card.highlight { border-color: color-mix(in srgb, var(--accent) 20%, var(--border)); }
        .card-icon { width: 40px; height: 40px; border-radius: 12px; background: color-mix(in srgb, var(--accent) 15%, transparent); color: var(--accent-light); display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
        .card h3 { font-size: 20px; font-weight: 700; margin-bottom: 12px; }
        .card p { color: var(--text-dim); font-size: 14px; line-height: 1.6; }

        .simulator { padding: 60px 24px; }
        .workspace { max-width: 1400px; margin: 0 auto; display: grid; grid-template-columns: 320px 1fr; gap: 48px; background: var(--panel); padding: 48px; border-radius: 32px; border: 1px solid var(--border); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
        
        aside { display: flex; flex-direction: column; gap: 40px; }
        .panel-header { display: flex; align-items: center; gap: 12px; color: var(--text-dim); }
        .panel-header h2 { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
        .status-message { padding: 20px; background: var(--panel-light); border-radius: 16px; border: 1px solid var(--border); font-size: 14px; line-height: 1.5; color: var(--text); font-weight: 500; }
        
        .metrics-list { display: flex; flex-direction: column; gap: 12px; }
        .metric-item { padding: 12px; background: var(--bg); border: 1px solid var(--border); border-radius: 12px; }
        .metric-item .label { font-size: 10px; font-weight: 800; text-transform: uppercase; color: var(--accent-light); display: block; margin-bottom: 4px; }
        .metric-item .val { font-size: 13px; font-weight: 500; }
        
        .tip { display: flex; align-items: center; gap: 8px; color: var(--text-dim); font-size: 12px; font-style: italic; }

        .canvas-area { background: color-mix(in srgb, var(--bg) 80%, transparent); border-radius: 24px; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; }
        .visual-focus { width: 100%; max-width: 400px; }
        svg { width: 100%; height: auto; }
        
        .hero-node { fill: var(--accent); stroke: var(--accent-light); stroke-width: 4; filter: url(#focus-glow); }
        .node-aura { fill: none; stroke: var(--accent); stroke-width: 1; stroke-dasharray: 4 4; opacity: 0.3; }
        .hero-edge { stroke: var(--accent); stroke-width: 12; stroke-linecap: round; filter: url(#focus-glow); }
        .mini-node { fill: var(--panel-light); stroke: var(--accent-light); stroke-width: 3; }
        .hero-text { fill: var(--text); font-weight: 900; font-size: 18px; }
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

