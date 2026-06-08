"use client";

import { useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { Info, MoveRight, MoveLeft, Hash, MousePointer2 } from "lucide-react";

interface DegreeData {
  in: number;
  out: number;
}

const INITIAL_NODES = [
  { id: "A", x: 150, y: 150 },
  { id: "B", x: 450, y: 150 },
  { id: "C", x: 150, y: 350 },
  { id: "D", x: 450, y: 350 },
];

const INITIAL_EDGES = [
  { id: "e1", from: "A", to: "B" },
  { id: "e2", from: "A", to: "C" },
  { id: "e3", from: "B", to: "C" },
  { id: "e4", from: "C", to: "A" },
  { id: "e5", from: "D", to: "A" },
  { id: "e6", from: "B", to: "D" },
];

export default function GraphDegreesSimulation() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";
  
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);

  const degrees = useMemo(() => {
    const res: Record<string, DegreeData> = {};
    nodes.forEach(n => res[n.id] = { in: 0, out: 0 });
    INITIAL_EDGES.forEach(e => {
      res[e.from].out++;
      res[e.to].in++;
    });
    return res;
  }, [nodes]);

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
          <div className="badge">Structural Analysis</div>
          <h1>Graph Degrees</h1>
          <p className="description">
            The <strong>Degree</strong> of a vertex quantifies its connectivity within the network. 
            In directed graphs, we track <strong>In-degree</strong> (incoming signals) and <strong>Out-degree</strong> (outgoing signals) independently.
          </p>
          <div className="complexity-grid">
            <div className="complexity-item">
              <span className="label">Handshaking Lemma</span>
              <span className="value">Σ deg(v) = 2|E|</span>
            </div>
            <div className="complexity-item">
              <span className="label">Directed Sum</span>
              <span className="value">Σ d⁻ = Σ d⁺</span>
            </div>
          </div>
        </div>
      </section>

      <section className="guide">
        <div className="guide-content">
          <div className="card">
            <div className="card-icon"><MoveLeft size={20} /></div>
            <h3>In-Degree (d⁻)</h3>
            <p>The number of edges directed towards a vertex. It represents the number of "prerequisites" or incoming dependencies.</p>
          </div>
          <div className="card highlight">
            <div className="card-icon"><MoveRight size={20} /></div>
            <h3>Out-Degree (d⁺)</h3>
            <p>The number of edges originating from a vertex. It represents the "influence" or reach of that node.</p>
          </div>
        </div>
      </section>

      <section className="simulator">
        <div className="workspace">
          <aside className="movable-panel">
            <div className="panel-header">
              <Info size={16} />
              <h2>Degree Inspector</h2>
            </div>
            
            <div className="status-message">
              Hover over nodes or rows to visualize the specific edge relationships.
            </div>

            <div className="data-section">
              <h3>Incidence Matrix</h3>
              <div className="degree-table-wrapper">
                <table className="degree-table">
                  <thead>
                    <tr>
                      <th>Node</th>
                      <th><MoveLeft size={14} /> In</th>
                      <th><MoveRight size={14} /> Out</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nodes.map(n => (
                      <tr key={n.id} 
                        className={activeNode === n.id ? "active" : ""} 
                        onMouseEnter={() => setActiveNode(n.id)} 
                        onMouseLeave={() => setActiveNode(null)}
                      >
                        <td className="node-id">{n.id}</td>
                        <td className="deg-val in">{degrees[n.id].in}</td>
                        <td className="deg-val out">{degrees[n.id].out}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="playback-controls" style={{ border: 'none' }}>
              <div className="tip">
                <MousePointer2 size={14} />
                <span>Drag nodes to adjust visualization</span>
              </div>
            </div>
          </aside>

          <div className="canvas-area">
            <svg viewBox="0 0 600 500" onMouseMove={handleMouseMove} onMouseUp={() => setDraggingNode(null)} onMouseLeave={() => setDraggingNode(null)}>
              <defs>
                <marker id="degree-arrow" markerWidth="10" markerHeight="7" refX="24" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
                </marker>
                <filter id="node-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {INITIAL_EDGES.map((e, i) => {
                const from = nodes.find(n => n.id === e.from)!;
                const to = nodes.find(n => n.id === e.to)!;
                const isActive = activeNode === e.from || activeNode === e.to;
                const isOut = activeNode === e.from;
                const isIn = activeNode === e.to;
                
                return (
                  <line key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y} 
                        className={`edge ${isActive ? 'active' : ''} ${isOut ? 'outgoing' : ''} ${isIn ? 'incoming' : ''}`} 
                        markerEnd="url(#degree-arrow)" />
                );
              })}

              {nodes.map(n => (
                <g key={n.id} className={`node-group ${activeNode === n.id ? 'active' : ''}`}
                  onMouseEnter={() => setActiveNode(n.id)}
                  onMouseLeave={() => setActiveNode(null)}
                  onMouseDown={() => setDraggingNode(n.id)}
                  style={{ cursor: draggingNode ? 'grabbing' : 'grab' }}
                >
                  <circle cx={n.x} cy={n.y} r="26" className="node-circle" />
                  <text x={n.x} y={n.y} dy="0.35em" className="node-text">{n.id}</text>
                  {activeNode === n.id && (
                    <g transform={`translate(${n.x + 35}, ${n.y - 35})`}>
                      <rect x="0" y="0" width="80" height="40" rx="8" fill="var(--panel-light)" stroke="var(--border)" />
                      <text x="10" y="15" className="tooltip-text">In: {degrees[n.id].in}</text>
                      <text x="10" y="30" className="tooltip-text">Out: {degrees[n.id].out}</text>
                    </g>
                  )}
                </g>
              ))}
            </svg>
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
        .workspace { max-width: 1400px; margin: 0 auto; display: grid; grid-template-columns: 320px 1fr; gap: 48px; background: var(--panel); padding: 48px; border-radius: 32px; border: 1px solid var(--border); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
        
        aside { display: flex; flex-direction: column; gap: 40px; }
        .panel-header { display: flex; align-items: center; gap: 12px; color: var(--text-dim); }
        .panel-header h2 { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
        .status-message { padding: 20px; background: var(--panel-light); border-radius: 16px; border: 1px solid var(--border); font-size: 14px; line-height: 1.5; color: var(--text); font-weight: 500; }
        
        .degree-table-wrapper { background: var(--bg); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }
        .degree-table { width: 100%; border-collapse: collapse; }
        .degree-table th { background: var(--panel-light); color: var(--text-dim); font-size: 11px; text-transform: uppercase; padding: 12px; text-align: center; border-bottom: 1px solid var(--border); }
        .degree-table td { padding: 14px; text-align: center; border-bottom: 1px solid var(--border); font-weight: 700; }
        .degree-table tr:last-child td { border-bottom: none; }
        .degree-table tr.active { background: color-mix(in srgb, var(--accent) 8%, transparent); }
        
        .node-id { color: var(--text); font-family: monospace; font-size: 16px; }
        .deg-val.in { color: var(--green); }
        .deg-val.out { color: var(--accent-light); }
        
        .tip { display: flex; align-items: center; gap: 8px; color: var(--text-dim); font-size: 12px; font-style: italic; }

        .canvas-area { background: color-mix(in srgb, var(--bg) 80%, transparent); border-radius: 24px; border: 1px solid var(--border); position: relative; overflow: hidden; }
        svg { width: 100%; height: 500px; display: block; }
        
        .edge { stroke: var(--border); stroke-width: 2.5; opacity: 0.3; transition: all 0.3s; }
        .edge.active { opacity: 0.8; stroke-width: 4; }
        .edge.outgoing { stroke: var(--accent-light); }
        .edge.incoming { stroke: var(--green); }

        .node-group { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .node-circle { fill: var(--panel); stroke: var(--border); stroke-width: 3; transition: all 0.3s; }
        .node-text { fill: var(--text); font-weight: 800; font-size: 14px; text-anchor: middle; pointer-events: none; }
        
        .node-group.active .node-circle { stroke: var(--accent); stroke-width: 5; filter: url(#node-glow); }
        .tooltip-text { fill: var(--text); font-size: 11px; font-weight: 700; }
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

