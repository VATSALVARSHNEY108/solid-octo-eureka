"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { LayoutGrid, Share2, Info, ArrowRight, Activity, Zap, MousePointer2 } from "lucide-react";

interface GraphNode { id: string; x: number; y: number; }
interface GraphEdge { id: string; from: string; to: string; }
interface GraphData { nodes: GraphNode[]; edges: GraphEdge[]; isDirected: boolean; }

const initialGraph: GraphData = {
  nodes: [
    { id: "A", x: 90, y: 190 },
    { id: "B", x: 250, y: 90 },
    { id: "C", x: 450, y: 150 },
    { id: "D", x: 280, y: 305 },
    { id: "E", x: 520, y: 300 },
  ],
  edges: [
    { id: "e1", from: "A", to: "B" },
    { id: "e2", from: "A", to: "D" },
    { id: "e3", from: "B", to: "C" },
    { id: "e4", from: "B", to: "D" },
    { id: "e5", from: "D", to: "E" },
    { id: "e6", from: "C", to: "E" },
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
  for (let code = 65; code <= 90; code++) {
    const id = String.fromCharCode(code);
    if (!nodes.some((n) => n.id === id)) return id;
  }
  return `N${nodes.length + 1}`;
}

function nextEdgeId(edges: GraphEdge[]) {
  let index = edges.length + 1;
  while (edges.some((e) => e.id === `e${index}`)) index += 1;
  return `e${index}`;
}

export default function AdjacencyListSimulation() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [graph, setGraph] = useState<GraphData>(() => cloneGraph(initialGraph));
  const [selected, setSelected] = useState<{ type: "node" | "edge"; id: string } | null>(null);
  const [edgeSource, setEdgeSource] = useState<string | null>(null);
  const [nodeName, setNodeName] = useState("");
  const [edgeFrom, setEdgeFrom] = useState("A");
  const [edgeTo, setEdgeTo] = useState("B");
  const [dragging, setDragging] = useState<string | null>(null);
  const [panelPos, setPanelPos] = useState({ x: 20, y: 20 });
  const [draggingPanel, setDraggingPanel] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const adjList = useMemo(() => {
    const list: Record<string, string[]> = {};
    graph.nodes.forEach(n => list[n.id] = []);
    graph.edges.forEach(e => {
      list[e.from].push(e.to);
      if (!graph.isDirected) list[e.to].push(e.from);
    });
    return list;
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
    const id = (nodeName.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 3)) || nextNodeId(graph.nodes);
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
          <h1>Adjacency List</h1>
          <p className="description">
            An <strong>Adjacency List</strong> represents a graph as a collection of linked lists or arrays. 
            Each node stores a list of its direct neighbors, making it highly efficient for sparse graphs.
          </p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(V + E)</span></div>
            <div className="complexity-tag"><span className="label">Find Edge</span><span className="value">O(deg(V))</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>

      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card">
            <h2>Overview</h2>
            <p>Instead of a grid, we store only the edges that exist. Each vertex acts as a key to its own list of connected neighbors.</p>
          </article>
          <article className="guide-card">
            <h2>Space Efficiency</h2>
            <p>For a graph with many nodes but few edges (sparse), this saves massive amounts of memory compared to a matrix.</p>
          </article>
          <article className="guide-card highlight">
            <h2>Edge Lookup</h2>
            <p>To check if Node A connects to Node B, we must scan through Node A's list. This is slower than the O(1) lookup of a matrix.</p>
          </article>
          <article className="guide-card">
            <h2>Implementation</h2>
            <p>Commonly implemented using arrays of lists, vectors, or hash maps depending on the programming language.</p>
          </article>
        </div>
      </section>

      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="editor">
            <input value={nodeName} onChange={(e) => setNodeName(e.target.value)} placeholder="Node ID" />
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
                <span>📌 Drag <b>List Header</b> to move the panel</span>
                <span>🖱️ Right‑Click to <b>Remove</b></span>
              </div>
              <h2>Data Structure</h2>
              <p>Observe how the list updates as you modify the graph. This is the exact representation stored in memory.</p>
              
              <div className="stats-mini">
                <div className="stat"><span>Nodes</span><b>{graph.nodes.length}</b></div>
                <div className="stat"><span>Edges</span><b>{graph.edges.length}</b></div>
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
                const isHovered = hoveredNode === edge.from || hoveredNode === edge.to;
                const isSelected = selected?.type === "edge" && selected.id === edge.id;
                return (
                  <g key={edge.id} onPointerDown={(ev) => { ev.stopPropagation(); setSelected({ type: "edge", id: edge.id }); setEdgeFrom(edge.from); setEdgeTo(edge.to); }} onContextMenu={(ev) => handleContextMenu(ev, { type: "edge", id: edge.id })}>
                    <path className="edge-hit" d={path} />
                    <path className={`edge ${isHovered ? "active" : ""} ${isSelected ? "selected" : ""}`} d={path} markerEnd={graph.isDirected ? "url(#arrow)" : ""} />
                  </g>
                );
              })}
              {graph.nodes.map((node) => {
                const isActive = hoveredNode === node.id;
                const isSelected = selected?.type === "node" && selected.id === node.id;
                const classes = ["node", isActive ? "active" : "", isSelected ? "selected" : ""].join(" ");
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
              <foreignObject x={panelPos.x} y={panelPos.y} width="220" height="300" className="movable-panel">
                <div className="panel-container" data-theme={theme}>
                  <div className="panel-header" onPointerDown={startPanelDrag}>
                    <span>Adjacency List</span>
                    <span className="drag-handle">⠿</span>
                  </div>
                  <div className="panel-content list-viz">
                    {graph.nodes.map((node) => (
                      <div key={node.id} className={`list-row ${hoveredNode === node.id ? "active" : ""}`} onMouseEnter={() => setHoveredNode(node.id)} onMouseLeave={() => setHoveredNode(null)}>
                        <div className="list-node-key">{node.id}</div>
                        <div className="list-arrow"><ArrowRight size={12} /></div>
                        <div className="list-neighbors">
                          {adjList[node.id].map((neighbor, i) => (
                            <div key={`${neighbor}-${i}`} className={`list-neighbor ${hoveredNode === neighbor ? "highlight" : ""}`}>{neighbor}</div>
                          ))}
                          {adjList[node.id].length === 0 && <span className="list-empty">∅</span>}
                        </div>
                      </div>
                    ))}
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
        .list-row { display: flex; align-items: center; gap: 8px; padding: 6px 0; border-bottom: 1px solid var(--border); transition: all 0.2s; }
        .list-row:last-child { border-bottom: none; }
        .list-row.active { background: color-mix(in srgb, var(--blue) 8%, transparent); }
        .list-node-key { width: 28px; height: 28px; background: var(--blue); color: white; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 12px; }
        .list-arrow { color: var(--muted); opacity: 0.5; }
        .list-neighbors { display: flex; gap: 4px; flex-wrap: wrap; }
        .list-neighbor { padding: 2px 8px; background: var(--panel2); border: 1px solid var(--border); border-radius: 4px; font-size: 11px; font-family: monospace; font-weight: 700; }
        .list-neighbor.highlight { border-color: var(--blue); color: var(--blue); background: color-mix(in srgb, var(--blue) 10%, transparent); }
        .list-empty { color: var(--muted); opacity: 0.5; font-family: monospace; }
        .gesture-hint { background: var(--panel2); border: 1px solid var(--border); border-radius: 8px; padding: 12px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 4px; font-size: 11px; color: var(--muted); }
        @media (max-width: 900px) { .workspace { grid-template-columns: 1fr; } }
      `}</style>
    </main>
  );
}

