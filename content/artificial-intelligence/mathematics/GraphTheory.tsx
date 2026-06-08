export default function GraphTheory() {
  return (
    <section className="px-12 py-24">
      <h1 className="text-3xl font-semibold">Graph Theory</h1>

      <p className="mt-4 text-base">
        Graph theory studies relationships. A graph is a set of nodes (entities) and edges (connections). Many ML
        problems are naturally graphs: social networks, molecules, knowledge graphs, recommendation systems, and
        dependency structures in language.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">Basic Definitions</h2>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-base">
        <li>
          <span className="font-semibold">Nodes</span>: items (users, atoms, documents).
        </li>
        <li>
          <span className="font-semibold">Edges</span>: relationships (friendship, bonds, citations). May be directed or
          undirected, weighted or unweighted.
        </li>
        <li>
          <span className="font-semibold">Adjacency matrix</span> <code className="font-mono">A</code>: matrix view of edges.
        </li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold">Graph Neural Networks (GNN) Intuition</h2>
      <p className="mt-4 text-base">
        GNNs learn node representations by repeatedly mixing a node’s features with its neighbors’ features (message
        passing). After several rounds, information can travel multiple hops.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">Why Graphs Are Hard</h2>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-base">
        <li>No fixed ordering of nodes (permutation invariance).</li>
        <li>Variable size (graphs can have very different numbers of nodes/edges).</li>
        <li>Long-range dependencies can require many message-passing steps.</li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold">Common Tasks</h2>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-base">
        <li>Node classification (label each node)</li>
        <li>Link prediction (predict missing edges)</li>
        <li>Graph classification (classify whole graphs, e.g. molecules)</li>
        <li>Community detection and clustering</li>
      </ul>
    </section>
  );
}
