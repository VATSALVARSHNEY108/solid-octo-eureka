export default function DifferentialEquaions() {
  return (
    <section className="px-12 py-24">
      <h1 className="text-3xl font-semibold">Differential Equations</h1>

      <p className="mt-4 text-base">
        Differential equations describe systems that change over time using relationships between a function and its
        derivatives. They appear in ML when modeling dynamics (physics, robotics, time series) and in modern approaches
        like neural ODEs.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">Why They Matter In ML</h2>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-base">
        <li>Time-evolving systems: motion, fluids, population dynamics, chemical reactions.</li>
        <li>Continuous-time modeling: irregularly sampled sequences and latent dynamics.</li>
        <li>Stability intuition: how small perturbations grow or decay over time.</li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold">Simple Example</h2>
      <p className="mt-4 text-base">Exponential growth/decay is modeled by:</p>
      <pre className="mt-4 overflow-x-auto rounded-lg border p-4 text-sm">
        <code>{`dy/dt = k y`}</code>
      </pre>
      <p className="mt-4 text-base">
        Its solution is <code className="font-mono">{`y(t) = y(0) e^{kt}`}</code>. This pattern shows up in decay processes
        and continuous-time hidden states.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">Neural ODE Intuition</h2>
      <p className="mt-4 text-base">A neural ODE defines dynamics with a neural network:</p>
      <pre className="mt-4 overflow-x-auto rounded-lg border p-4 text-sm">
        <code>{`dz/dt = f(z, t; θ)`}</code>
      </pre>
      <p className="mt-4 text-base">
        Given an initial state <code className="font-mono">z(t₀)</code>, we integrate forward to get{" "}
        <code className="font-mono">z(t₁)</code>. Training adjusts <code className="font-mono">θ</code> so the resulting
        trajectories fit data.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">What To Learn First</h2>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-base">
        <li>First-order ODEs and separation of variables.</li>
        <li>Linear ODEs and stability (equilibria, eigenvalues).</li>
        <li>Numerical solvers (Euler, Runge–Kutta) and step-size tradeoffs.</li>
      </ul>
    </section>
  );
}
