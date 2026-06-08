"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Grid3X3, Layers, Info, MousePointer2, Activity, Zap } from "lucide-react";

interface GraphNode { id: string; x: number; y: number; }
interface GraphEdge { id: string; from: string; to: string; }
interface GraphData { nodes: GraphNode[]; edges: GraphEdge[]; isDirected: boolean; }

const initialGraph: GraphData = {
  nodes: [
    { id: "0", x: 120, y: 120 },
    { id: "1", x: 380, y: 120 },
    { id: "2", x: 120, y: 380 },
    { id: "3", x: 380, y: 380 },
  ],
  edges: [
    { id: "e1", from: "0", to: "1" },
    { id: "e2", from: "0", to: "2" },
    { id: "e3", from: "1", to: "3" },
    { id: "e4", from: "2", to: "3" },
  ],
  isDirected: false,
};

function cloneGraph(graph: GraphData) {
  return {
    isDirected: graph.isDirected,
    nodes: graph.nodes.map((n) => ({ ...n })),
    edges: graph.edges.map((e) => ({ ...e })),
  };
}

function nextNodeId(nodes: GraphNode[]) {
  // Use numbers for matrix representation usually
  for (let i = 0; i < 100; i++) {
    const id = String(i);
    if (!nodes.some((n) => n.id === id)) return id;
  }
  return `N${nodes.length}`;
}

function nextEdgeId(edges: GraphEdge[]) {
  let index = edges.length + 1;
  while (edges.some((e) => e.id === `e${index}`)) index += 1;
  return `e${index}`;
}

export default function AdjacencyMatrixSimulation() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [graph, setGraph] = useState<GraphData>(() => cloneGraph(initialGraph));
  const [selected, setSelected] = useState<{ type: "node" | "edge"; id: string } | null>(null);
  const [edgeSource, setEdgeSource] = useState<string | null>(null);
  const [nodeName, setNodeName] = useState("");
  const [edgeFrom, setEdgeFrom] = useState("0");
  const [edgeTo, setEdgeTo] = useState("1");
  const [dragging, setDragging] = useState<string | null>(null);
  const [panelPos, setPanelPos] = useState({ x: 20, y: 20 });
  const [draggingPanel, setDraggingPanel] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ r: string, c: string } | null>(null);

  const matrix = useMemo(() => {
    const nodes = graph.nodes.map(n => n.id).sort((a, b) => parseInt(a) - parseInt(b));
    const m: Record<string, Record<string, number>> = {};
    nodes.forEach(u => {
      m[u] = {};
      nodes.forEach(v => m[u][v] = 0);
    });
    graph.edges.forEach(e => {
      if (m[e.from] && m[e.from][e.to] !== undefined) {
        m[e.from][e.to] = 1;
        if (!graph.isDirected) m[e.to][e.from] = 1;
      }
    });
    return { nodes, m };
  }, [graph]);

  const nodeMap = useMemo(() => Object.fromEntries(graph.nodes.map((n) => [n.id, n])), [graph.nodes]);

  const svgPoint = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    return pt.matrixTransform(svg.getScreenCTM()!.inverse());
  }, []);

  const addNode = useCallback((x = 330, y = 215) => {
    const id = (nodeName.trim().replace(/[^0-9]/g, "")) || nextNodeId(graph.nodes);
    if (graph.nodes.some((n) => n.id === id)) return;
    setGraph((g) => ({
      ...g,
      nodes: [...g.nodes, { id, x, y }],
    }));
    setSelected({ type: "node", id });
    setNodeName("");
  }, [graph.nodes, nodeName]);

  const addEdge = useCallback((from = edgeFrom, to = edgeTo) => {
    const edge = { id: nextEdgeId(graph.edges), from, to };
    setGraph((g) => ({ ...g, edges: [...g.edges, edge] }));
    setSelected({ type: "edge", id: edge.id });
    setEdgeSource(null);
  }, [edgeFrom, edgeTo, graph.edges]);

  const removeSelected = useCallback(() => {
    if (!selected) return;
    setGraph((g) => {
      if (selected.type === "edge") {
        return { ...g, edges: g.edges.filter((e) => e.id !== selected.id) };
      }
      const nodes = g.nodes.filter((n) => n.id !== selected.id);
      const edges = g.edges.filter((e) => e.from !== selected.id && e.to !== selected.id);
      return { ...g, nodes, edges };
    });
    setSelected(null);
  }, [selected]);

  const handleCanvasClick = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.target !== svgRef.current) return;
    const pt = svgPoint(e);
    addNode(pt.x, pt.y);
    setSelected(null);
    setEdgeSource(null);
  };

  const handleNodePointerDown = (e: React.PointerEvent, node: GraphNode) => {
    e.stopPropagation();
    if (edgeSource === node.id) {
      setEdgeSource(null);
      setSelected(null);
      return;
    }
    if (edgeSource && edgeSource !== node.id) {
      addEdge(edgeSource, node.id);
      setEdgeSource(null);
      setSelected(null);
      return;
    }
    if (e.shiftKey) {
      setEdgeSource(node.id);
      setSelected({ type: "node", id: node.id });
    } else {
      setEdgeSource(node.id);
      setSelected({ type: "node", id: node.id });
      setDragging(node.id);
    }
  };

  const handleNodePointerUp = (e: React.PointerEvent, node: GraphNode) => {
    if (e.shiftKey && edgeSource && edgeSource !== node.id) {
      addEdge(edgeSource, node.id);
      setEdgeSource(null);
    }
    setDragging(null);
  };

  const handleContextMenu = (e: React.MouseEvent, item: { type: "node" | "edge"; id: string }) => {
    e.preventDefault();
    e.stopPropagation();
    if (item.type === "node") {
      setGraph((g) => {
        if (g.nodes.length <= 1) return g;
        const nodes = g.nodes.filter((n) => n.id !== item.id);
        const edges = g.edges.filter((ed) => ed.from !== item.id && ed.to !== item.id);
        return { ...g, nodes, edges };
      });
    } else {
      setGraph((g) => ({ ...g, edges: g.edges.filter((ed) => ed.id !== item.id) }));
    }
    setSelected(null);
  };

  const handleMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging && !draggingPanel) return;
    const pt = svgPoint(e);
    if (dragging) {
      setGraph((g) => ({
        ...g,
        nodes: g.nodes.map((n) => n.id === dragging ? { ...n, x: Math.max(40, Math.min(640, pt.x)), y: Math.max(45, Math.min(390, pt.y)) } : n),
      }));
    } else if (draggingPanel) {
      setPanelPos({ x: pt.x - dragOffset.x, y: pt.y - dragOffset.y });
    }
  };

  const startPanelDrag = (e: React.PointerEvent) => {
    e.stopPropagation();
    const pt = svgPoint(e as any);
    setDraggingPanel(true);
    setDragOffset({ x: pt.x - panelPos.x, y: pt.y - panelPos.y });
  };

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Graph Theory • Representations</span>
          <h1>Adjacency Matrix</h1>
          <p className="description">
            An <strong>Adjacency Matrix</strong> is a square matrix used to represent a finite graph. 
            The element at row <code>i</code> and column <code>j</code> indicates if an edge exists between vertex <code>i</code> and <code>j</code>.
          </p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(V²)</span></div>
            <div className="complexity-tag"><span className="label">Find Edge</span><span className="value">O(1)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>

      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card">
            <h2>Overview</h2>
            <p>A 2D array representation where nodes are indices. A '1' at (i, j) means an edge exists; a '0' means no connection.</p>
          </article>
          <article className="guide-card">
            <h2>Symmetry</h2>
            <p>For undirected graphs, the matrix is symmetric across the main diagonal (M[i,j] == M[j,i]).</p>
          </article>
          <article className="guide-card highlight">
            <h2>Fast Lookups</h2>
            <p>Checking if Node A connects to Node B takes constant time O(1), making it ideal for dense graphs.</p>
          </article>
          <article className="guide-card">
            <h2>Space Tradeoff</h2>
            <p>It always takes V² space, even if the graph has very few edges. This makes it inefficient for sparse graphs.</p>
          </article>
        </div>
      </section>

      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="editor">
            <input value={nodeName} onChange={(e) => setNodeName(e.target.value)} placeholder="Node ID (Num)" />
            <button onClick={() => addNode()}>Add Node</button>
            <select value={edgeFrom} onChange={(e) => setEdgeFrom(e.target.value)}>
              {graph.nodes.map((n) => (<option key={n.id}>{n.id}</option>))}
            </select>
            <select value={edgeTo} onChange={(e) => setEdgeTo(e.target.value)}>
              {graph.nodes.map((n) => (<option key={n.id}>{n.id}</option>))}
            </select>
            <button onClick={() => addEdge()}>Join Nodes</button>
            <button onClick={() => setGraph(g => ({ ...g, isDirected: !g.isDirected }))} className={graph.isDirected ? "active" : ""}>
              {graph.isDirected ? "Directed: ON" : "Directed: OFF"}
            </button>
            <button onClick={removeSelected} disabled={!selected}>Remove</button>
            <button onClick={() => setGraph(cloneGraph(initialGraph))}>Reset Graph</button>
          </div>
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>🖱️ Click background to <b>Add Node</b></span>
                <span>↔️ Drag to <b>Move</b> • ⌨️ Shift+Drag to <b>Join</b></span>
                <span>🔗 Click Node A then Node B to <b>Join</b></span>
                <span>🔄 Toggle <b>Directed</b> for arrows</span>
                <span>📌 Drag <b>Matrix Header</b> to move the panel</span>
                <span>🖱️ Right‑Click to <b>Remove</b></span>
              </div>
              <h2>Coordinated Inspection</h2>
              <p>Hover over the matrix cells or the graph nodes to see linked highlighting across the representations.</p>
              
              <div className="stats-mini">
                <div className="stat"><span>Storage</span><b>{graph.nodes.length}² slots</b></div>
                <div className="stat"><span>Density</span><b>{(graph.edges.length / (graph.nodes.length * (graph.nodes.length - 1 || 1)) * 100).toFixed(0)}%</b></div>
              </div>
            </aside>
            <svg 
              ref={svgRef} 
              viewBox="0 0 680 430" 
              onPointerDown={handleCanvasClick} 
              onPointerMove={handleMove} 
              onPointerUp={() => { setDragging(null); setDraggingPanel(false); }}
            >
              <defs>
                <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="currentColor" /></marker>
              </defs>
              {graph.edges.map((edge) => {
                const from = nodeMap[edge.from];
                const to = nodeMap[edge.to];
                if (!from || !to) return null;
                const dx = to.x - from.x;
                const dy = to.y - from.y;
                const length = Math.hypot(dx, dy) || 1;
                const endX = to.x - (dx / length) * 30;
                const endY = to.y - (dy / length) * 30;
                const midX = (from.x + to.x) / 2 - dy * 0.12;
                const midY = (from.y + to.y) / 2 + dx * 0.12;
                const path = `M ${from.x} ${from.y} Q ${midX} ${midY} ${endX} ${endY}`;
                
                const isCellHovered = (hoveredCell?.r === edge.from && hoveredCell?.c === edge.to) ||
                                     (!graph.isDirected && hoveredCell?.r === edge.to && hoveredCell?.c === edge.from);
                const isNodeHovered = hoveredNode === edge.from || hoveredNode === edge.to;
                const isSelected = selected?.type === "edge" && selected.id === edge.id;
                
                return (
                  <g key={edge.id} onPointerDown={(ev) => { ev.stopPropagation(); setSelected({ type: "edge", id: edge.id }); setEdgeFrom(edge.from); setEdgeTo(edge.to); }} onContextMenu={(ev) => handleContextMenu(ev, { type: "edge", id: edge.id })}>
                    <path className="edge-hit" d={path} />
                    <path className={`edge ${isCellHovered || isNodeHovered ? "active" : ""} ${isSelected ? "selected" : ""}`} d={path} markerEnd={graph.isDirected ? "url(#arrow)" : ""} />
                  </g>
                );
              })}
              {graph.nodes.map((node) => {
                const isFocused = hoveredNode === node.id || 
                                 hoveredCell?.r === node.id || 
                                 hoveredCell?.c === node.id;
                const isSelected = selected?.type === "node" && selected.id === node.id;
                const classes = ["node", isFocused ? "active" : "", isSelected ? "selected" : ""].join(" ");
                return (
                  <g key={node.id} className={classes} 
                    onPointerDown={(ev) => handleNodePointerDown(ev, node)} 
                    onPointerUp={(ev) => handleNodePointerUp(ev, node)} 
                    onContextMenu={(ev) => handleContextMenu(ev, { type: "node", id: node.id })}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    <circle cx={node.x} cy={node.y} r="27" />
                    <text x={node.x} y={node.y + 5}>{node.id}</text>
                  </g>
                );
              })}

              {/* Movable Panel */}
              <foreignObject x={panelPos.x} y={panelPos.y} width="260" height="300" className="movable-panel">
                <div className="panel-container" data-theme={theme}>
                  <div className="panel-header" onPointerDown={startPanelDrag}>
                    <span>Adjacency Matrix</span>
                    <span className="drag-handle">⠿</span>
                  </div>
                  <div className="panel-content matrix-viz">
                    <table className="mini-matrix">
                      <thead>
                        <tr>
                          <th></th>
                          {matrix.nodes.map(id => (
                            <th key={id} className={hoveredNode === id ? "active" : ""}>{id}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {matrix.nodes.map(r => (
                          <tr key={r}>
                            <th className={hoveredNode === r ? "active" : ""}>{r}</th>
                            {matrix.nodes.map(c => {
                              const val = matrix.m[r][c];
                              const isFocused = hoveredCell?.r === r && hoveredCell?.c === c;
                              const isNodeLinked = (hoveredNode === r || hoveredNode === c) && val === 1;
                              return (
                                <td key={c} 
                                  className={`${val === 1 ? "has-edge" : ""} ${isFocused || isNodeLinked ? "focused" : ""}`}
                                  onMouseEnter={() => setHoveredCell({ r, c })}
                                  onMouseLeave={() => setHoveredCell(null)}
                                >
                                  {val}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </foreignObject>
            </svg>
          </div>
        </div>
      </section>
      <style jsx>{`
        .page { --bg: #0a0d14; --panel: #111827; --panel2: #172033; --border: #2b3447; --text: #e5e7eb; --muted: #98a2b3; --blue: #4f7ef8; --green: #35c486; --amber: #f5a623; --red: #ef4444; min-height: 100vh; background: var(--bg); color: var(--text); font-family: Arial, sans-serif; }
        .page[data-theme="light"] { --bg: #f7f9fc; --panel: #ffffff; --panel2: #edf2f7; --border: #d7deea; --text: #172033; --muted: #526174; --blue: #285bd6; --green: #087f5b; --amber: #b76705; --red: #c92a2a; }
        .hero { padding: 120px 24px 80px; background: radial-gradient(circle at 10% 20%, #4f7ef810, transparent 40%), radial-gradient(circle at 90% 80%, #35c48608, transparent 40%), var(--bg); border-bottom: 1px solid var(--border); }
        .hero h1 { margin: 16px 0; font-size: clamp(48px, 9vw, 92px); font-weight: 800; letter-spacing: -0.04em; line-height: 0.95; background: linear-gradient(to bottom right, var(--text), var(--muted)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .content-width { max-width: 1200px; margin: 0 auto; }
        .description { font-size: 19px; max-width: 800px; margin: 24px 0 40px; line-height: 1.6; color: var(--muted); }
        .complexity-tag-group { display: flex; gap: 16px; margin-bottom: 48px; }
        .complexity-tag { background: var(--panel); border: 1px solid var(--border); padding: 12px 20px; border-radius: 12px; display: flex; flex-direction: column; gap: 4px; }
        .complexity-tag .label { font-size: 11px; text-transform: uppercase; color: var(--muted); }
        .complexity-tag .value { font-size: 20px; font-weight: 700; color: var(--blue); font-family: monospace; }
        .actions, .editor { display: flex; flex-wrap: wrap; gap: 8px; }
        button, a, input, select { border: 1px solid var(--border); border-radius: 8px; background: var(--panel2); color: var(--text); min-height: 38px; padding: 0 12px; }
        button.active { border-color: var(--blue); color: var(--blue); background: color-mix(in srgb, var(--blue) 14%, transparent); }
        .primary-btn { background: var(--blue); color: white; padding: 14px 32px; font-weight: 600; border-radius: 100px; transition: all 0.3s; box-shadow: 0 4px 14px 0 rgba(79,126,248,0.39); }
        .detailed-guide { width: min(1120px, calc(100% - 80px)); margin: 0 auto; padding: 100px 0; }
        .guide-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 40px; }
        .guide-card { background: var(--panel); border: 1px solid var(--border); border-radius: 16px; padding: 48px; }
        .guide-card h2 { font-size: 18px; margin-bottom: 16px; }
        .guide-card p { font-size: 14px; line-height: 1.7; color: var(--muted); }
        .guide-card.highlight { border-bottom: 4px solid var(--blue); }
        .simulator { padding: 60px 0 100px; border-top: 1px solid var(--border); }
        .workspace { display: grid; grid-template-columns: 340px 1fr; gap: 40px; padding: 40px; background: var(--panel); border: 1px solid var(--border); border-radius: 16px; box-shadow: 0 20px 50px -20px rgba(0,0,0,0.5); }
        aside { min-width: 0; display: flex; flex-direction: column; gap: 12px; }
        .stats-mini { display: flex; gap: 16px; margin-top: 20px; }
        .stat { display: flex; flex-direction: column; gap: 4px; }
        .stat span { font-size: 11px; text-transform: uppercase; color: var(--muted); }
        .stat b { font-size: 20px; color: var(--blue); font-family: monospace; }
        svg { width: 100%; min-height: 500px; background: linear-gradient(var(--panel2) 1px, transparent 1px), linear-gradient(90deg, var(--panel2) 1px, transparent 1px), var(--bg); background-size: 34px 34px; border: 1px solid var(--border); border-radius: 8px; }
        .edge { fill: none; stroke: var(--muted); stroke-width: 2; transition: all 0.3s; opacity: 0.6; }
        .edge.active { stroke: var(--blue); stroke-width: 4; opacity: 1; filter: drop-shadow(0 0 8px var(--blue)); }
        .edge.selected { stroke: var(--amber); stroke-width: 3; }
        .edge-hit { fill: none; stroke: transparent; stroke-width: 20; cursor: pointer; }
        .node circle { fill: var(--panel); stroke: var(--muted); stroke-width: 2; transition: all 0.3s; }
        .node.active circle { stroke: var(--blue); stroke-width: 3; }
        .node.selected circle { stroke: var(--amber); stroke-width: 3; }
        text { fill: var(--text); font-size: 13px; text-anchor: middle; font-weight: 700; user-select: none; }
        .movable-panel { cursor: grab; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3)); overflow: visible; }
        .movable-panel:active { cursor: grabbing; }
        .movable-panel > div { resize: both; overflow: auto; min-width: 140px; min-height: 110px; max-width: 620px; max-height: 430px; }
        .panel-container { background: color-mix(in srgb, var(--panel) 85%, transparent); backdrop-filter: blur(8px); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; height: 100%; display: flex; flex-direction: column; }
        .panel-header { background: var(--panel2); padding: 6px 10px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); }
        .panel-header span { font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--muted); letter-spacing: 0.05em; }
        .drag-handle { opacity: 0.5; }
        .panel-content { padding: 12px; flex: 1; overflow-y: auto; }
        .mini-matrix { width: 100%; border-collapse: separate; border-spacing: 2px; }
        .mini-matrix th { width: 24px; height: 24px; font-size: 10px; color: var(--muted); font-weight: 800; border-radius: 4px; }
        .mini-matrix th.active { color: var(--blue); background: color-mix(in srgb, var(--blue) 12%, transparent); }
        .mini-matrix td { width: 24px; height: 24px; text-align: center; font-size: 11px; font-weight: 700; background: var(--panel2); border: 1px solid var(--border); border-radius: 4px; color: var(--muted); transition: all 0.2s; }
        .mini-matrix td.has-edge { color: var(--blue); border-color: var(--blue); background: color-mix(in srgb, var(--blue) 8%, transparent); }
        .mini-matrix td.focused { background: var(--blue); color: white; transform: scale(1.15); border-color: var(--blue); z-index: 5; }
        .gesture-hint { background: var(--panel2); border: 1px solid var(--border); border-radius: 8px; padding: 12px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 4px; font-size: 11px; color: var(--muted); }
        @media (max-width: 900px) { .workspace { grid-template-columns: 1fr; } }
      `}</style>
    </main>
  );
}

