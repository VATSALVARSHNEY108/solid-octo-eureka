"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Info, Box, Share2, MousePointer2 } from "lucide-react";

export default function GraphDefinition() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";
  
  const [nodes, setNodes] = useState([
    { id: "V1", x: 150, y: 150 },
    { id: "V2", x: 450, y: 100 },
    { id: "V3", x: 150, y: 350 },
    { id: "V4", x: 450, y: 400 },
  ]);

  const [edges, setEdges] = useState([
    { id: "E1", from: "V1", to: "V2" },
    { id: "E2", from: "V1", to: "V3" },
    { id: "E3", from: "V2", to: "V4" },
    { id: "E4", from: "V3", to: "V4" },
  ]);

  const [draggingNode, setDraggingNode] = useState<string | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingNode) return;
    const svg = e.currentTarget as SVGSVGElement;
    const CTM = svg.getScreenCTM();
    if (!CTM) return;
    const x = (e.clientX - CTM.e) / CTM.a;
    const y = (e.clientY - CTM.f) / CTM.d;
    
    setNodes(prev => prev.map(n => n.id === draggingNode ? { ...n, x, y } : n));
  };

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <div className="badge">Fundamental Concepts</div>
          <h1>What is a Graph?</h1>
          <p className="description">
            A <strong>Graph</strong> is a non-linear data structure that captures relationships between pairs of objects. 
            Formally defined as <strong>G = (V, E)</strong>, it consists of a set of <strong>Vertices</strong> connected by <strong>Edges</strong>.
          </p>
          <div className="complexity-grid">
            <div className="complexity-item">
              <span className="label">V</span>
              <span className="value">Vertices</span>
            </div>
            <div className="complexity-item">
              <span className="label">E</span>
              <span className="value">Edges</span>
            </div>
          </div>
        </div>
      </section>

      <section className="guide">
        <div className="guide-content">
          <div className="card">
            <div className="card-icon"><Box size={20} /></div>
            <h3>Vertices (Nodes)</h3>
            <p>Vertices represent individual entities, such as cities on a map, users in a social network, or tasks in a project schedule.</p>
          </div>
          <div className="card highlight">
            <div className="card-icon"><Share2 size={20} /></div>
            <h3>Edges (Links)</h3>
            <p>Edges define the relationship or connection between two vertices. They can be directed (one-way) or undirected (mutual).</p>
          </div>
        </div>
      </section>

      <section className="simulator">
        <div className="workspace">
          <aside className="movable-panel">
            <div className="panel-header">
              <Info size={16} />
              <h2>Formal Notation</h2>
            </div>
            
            <div className="status-message">
              The graph currently displayed is defined by the following sets:
            </div>

            <div className="data-section">
              <h3>Vertex Set (V)</h3>
              <div className="set-viz">
                {"{"} {nodes.map(n => n.id).join(", ")} {"}"}
              </div>
            </div>

            <div className="data-section">
              <h3>Edge Set (E)</h3>
              <div className="edge-list">
                {edges.map(e => (
                  <div key={e.id} className="edge-item">
                    ({e.from}, {e.to})
                  </div>
                ))}
              </div>
            </div>

            <div className="playback-controls" style={{ border: 'none' }}>
              <div className="tip">
                <MousePointer2 size={14} />
                <span>Drag nodes to explore the layout</span>
              </div>
            </div>
          </aside>

          <div className="canvas-area">
            <svg viewBox="0 0 600 500" onMouseMove={handleMouseMove} onMouseUp={() => setDraggingNode(null)} onMouseLeave={() => setDraggingNode(null)}>
              <defs>
                <filter id="node-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              
              {edges.map(edge => {
                const from = nodes.find(n => n.id === edge.from)!;
                const to = nodes.find(n => n.id === edge.to)!;
                return <line key={edge.id} x1={from.x} y1={from.y} x2={to.x} y2={to.y} className="edge" />;
              })}
              
              {nodes.map(node => (
                <g key={node.id} className="node-group"
                  onMouseDown={() => setDraggingNode(node.id)}
                  style={{ cursor: draggingNode ? 'grabbing' : 'grab' }}
                >
                  <circle cx={node.x} cy={node.y} r="28" className="node-circle" />
                  <text x={node.x} y={node.y} dy="0.35em" className="node-text">{node.id}</text>
                </g>
              ))}
            </svg>
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
        
        .set-viz { padding: 16px; background: var(--bg); border: 1px solid var(--border); border-radius: 12px; font-family: monospace; font-size: 18px; color: var(--accent-light); text-align: center; }
        .edge-list { display: flex; flex-wrap: wrap; gap: 8px; padding: 12px; background: var(--bg); border: 1px solid var(--border); border-radius: 16px; }
        .edge-item { padding: 6px 12px; background: var(--panel-light); border: 1px solid var(--border); border-radius: 8px; font-family: monospace; font-size: 13px; font-weight: 700; }
        
        .tip { display: flex; align-items: center; gap: 8px; color: var(--text-dim); font-size: 12px; font-style: italic; }

        .canvas-area { background: color-mix(in srgb, var(--bg) 80%, transparent); border-radius: 24px; border: 1px solid var(--border); position: relative; overflow: hidden; }
        svg { width: 100%; height: 500px; display: block; }
        
        .edge { stroke: var(--border); stroke-width: 3; transition: all 0.3s; opacity: 0.6; }

        .node-group { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .node-circle { fill: var(--panel); stroke: var(--accent); stroke-width: 4; filter: url(#node-glow); transition: all 0.3s; }
        .node-text { fill: var(--text); font-weight: 800; font-size: 14px; text-anchor: middle; pointer-events: none; }
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

