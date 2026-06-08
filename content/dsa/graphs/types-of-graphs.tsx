"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Info, ArrowRightLeft, Weight, Activity, RotateCw, Layers } from "lucide-react";

const GRAPH_TYPES = [
  {
    title: "Directed vs Undirected",
    desc: "In directed graphs, edges have a fixed direction (u → v), often representing one-way streets or dependencies. Undirected edges (u ↔ v) represent mutual relationships like friendships.",
    icon: <ArrowRightLeft size={20} />,
    nodes: [{ id: "A", x: 60, y: 75 }, { id: "B", x: 190, y: 75 }],
    edges: [{ from: "A", to: "B", directed: true, weight: undefined }],
  },
  {
    title: "Weighted vs Unweighted",
    desc: "Weighted graphs assign numerical values (costs, distances, or capacities) to edges. In unweighted graphs, all edges are considered equal (cost = 1).",
    icon: <Weight size={20} />,
    nodes: [{ id: "A", x: 60, y: 75 }, { id: "B", x: 190, y: 75 }],
    edges: [{ from: "A", to: "B", directed: false, weight: "15" }],
  },
  {
    title: "Connected vs Disconnected",
    desc: "A graph is connected if a path exists between every vertex. Disconnected graphs consist of multiple isolated 'components'.",
    icon: <Activity size={20} />,
    nodes: [{ id: "A", x: 60, y: 40 }, { id: "B", x: 130, y: 40 }, { id: "C", x: 190, y: 110 }],
    edges: [{ from: "A", to: "B", directed: false, weight: undefined }], // C is isolated
  },
  {
    title: "Cyclic vs Acyclic",
    desc: "Cyclic graphs contain at least one path that loops back to its start. Acyclic graphs (like trees) have no cycles.",
    icon: <RotateCw size={20} />,
    nodes: [{ id: "A", x: 60, y: 40 }, { id: "B", x: 190, y: 40 }, { id: "C", x: 125, y: 110 }],
    edges: [
      { from: "A", to: "B", directed: false, weight: undefined }, 
      { from: "B", to: "C", directed: false, weight: undefined }, 
      { from: "C", to: "A", directed: false, weight: undefined }
    ],
  }
];

export default function TypesOfGraphs() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <div className="badge">Taxonomy</div>
          <h1>Types of Graphs</h1>
          <p className="description">
            Graphs are versatile structures that can be customized to model almost any network. 
            Understanding these fundamental classifications is the first step toward selecting the right algorithm for your problem.
          </p>
          <div className="complexity-grid">
            <div className="complexity-item">
              <span className="label">Classifications</span>
              <span className="value">Basic / Advanced</span>
            </div>
            <div className="complexity-item">
              <span className="label">Focus</span>
              <span className="value">Structure & Edges</span>
            </div>
          </div>
        </div>
      </section>

      <section className="guide">
        <div className="guide-content">
          <div className="card">
            <div className="card-icon"><Info size={20} /></div>
            <h3>Why Classification Matters?</h3>
            <p>Algorithms are often specialized. For example, Dijkstra requires non-negative weights, while Topological Sort requires an Acyclic graph (DAG).</p>
          </div>
          <div className="card highlight">
            <div className="card-icon"><Layers size={20} /></div>
            <h3>Compound Properties</h3>
            <p>A graph can belong to multiple categories—for instance, a Weighted Directed Acyclic Graph (WDAG) is a common model for project schedules.</p>
          </div>
        </div>
      </section>

      <section className="simulator">
        <div className="types-grid">
          {GRAPH_TYPES.map((type, idx) => (
            <div key={idx} className="type-card movable-panel">
              <div className="type-viz">
                <svg viewBox="0 0 250 150">
                  <defs>
                    <marker id="type-arrow" markerWidth="10" markerHeight="7" refX="15" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
                    </marker>
                    <filter id="type-glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="2" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  
                  {type.edges.map((e, i) => {
                    const from = type.nodes.find(n => n.id === e.from)!;
                    const to = type.nodes.find(n => n.id === e.to)!;
                    return (
                      <g key={i}>
                        <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} 
                          className="edge" 
                          markerEnd={e.directed ? "url(#type-arrow)" : ""} 
                        />
                        {e.weight && (
                          <g transform={`translate(${(from.x + to.x)/2}, ${(from.y + to.y)/2 - 12})`}>
                            <rect x="-12" y="-8" width="24" height="16" rx="4" fill="var(--panel-light)" stroke="var(--border)" />
                            <text dy="0.35em" textAnchor="middle" className="weight-text">{e.weight}</text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                  
                  {type.nodes.map(n => (
                    <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
                      <circle r="12" className="node-circle" />
                    </g>
                  ))}
                </svg>
              </div>
              <div className="type-info">
                <div className="title-row">
                  <div className="icon">{type.icon}</div>
                  <h3>{type.title}</h3>
                </div>
                <p>{type.desc}</p>
              </div>
            </div>
          ))}
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

        .simulator { padding: 80px 24px; max-width: 1400px; margin: 0 auto; }
        .types-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(500px, 1fr)); gap: 48px; }
        
        .type-card { background: var(--panel); border: 1px solid var(--border); border-radius: 32px; overflow: auto; resize: both; min-width: 320px; min-height: 220px; max-width: 100%; max-height: 620px; display: flex; align-items: center; padding: 40px; gap: 40px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 10px 30px -10px rgba(0,0,0,0.3); }
        .type-card:hover { transform: translateY(-8px); border-color: var(--accent); box-shadow: 0 20px 40px -15px rgba(0,0,0,0.5); }
        
        .type-viz { width: 250px; background: var(--bg); border-radius: 20px; border: 1px solid var(--border); padding: 12px; }
        .type-info { flex: 1; }
        
        .title-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
        .title-row .icon { color: var(--accent-light); }
        .title-row h3 { font-size: 22px; font-weight: 800; }
        .type-info p { font-size: 14px; color: var(--text-dim); line-height: 1.6; }
        
        svg { width: 100%; height: auto; display: block; }
        .edge { stroke: var(--text-dim); stroke-width: 2.5; opacity: 0.4; }
        .node-circle { fill: var(--panel); stroke: var(--accent); stroke-width: 3; filter: url(#type-glow); }
        .weight-text { fill: var(--accent-light); font-size: 9px; font-weight: 800; font-family: monospace; }

        .movable-panel { cursor: grab; }
        .movable-panel:active { cursor: grabbing; }

        @media (max-width: 1400px) {
          .types-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .type-card { flex-direction: column; text-align: center; }
          .type-viz { width: 100%; }
          .title-row { justify-content: center; }
        }
      `}</style>
    </main>
  );
}

