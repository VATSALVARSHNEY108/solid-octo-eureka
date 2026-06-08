export default function Calculus() {
  return (
    <section className="px-12 py-24">
      <h1 className="text-3xl font-semibold">Calculus</h1>
      <p className="mt-4 text-base">
        Calculus studies how quantities change. In AI/ML it shows up every time we optimize a model: we measure how a
        loss changes when we nudge parameters, then move parameters in the direction that improves the loss.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">Core Ideas</h2>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-base">
        <li>
          <span className="font-semibold">Limits</span>: formalize “approaching” a value, enabling precise definitions of
          continuity and derivatives.
        </li>
        <li>
          <span className="font-semibold">Derivatives</span>: local rate of change (slope). For a loss{" "}
          <code className="font-mono">L(w)</code>, the derivative tells how sensitive the loss is to parameters{" "}
          <code className="font-mono">w</code>.
        </li>
        <li>
          <span className="font-semibold">Integrals</span>: accumulation/area. In probability, continuous densities are
          normalized by integration and expectations are integrals.
        </li>
        <li>
          <span className="font-semibold">Multivariable calculus</span>: gradients, Jacobians, Hessians — the language of
          deep learning.
        </li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold">Gradient (Multivariable Derivative)</h2>
      <p className="mt-4 text-base">
        For a scalar function <code className="font-mono">L(w)</code> where <code className="font-mono">w ∈ R^d</code>, the
        gradient is the vector of partial derivatives:
      </p>
      <pre className="mt-4 overflow-x-auto rounded-lg border p-4 text-sm">
        <code>{`∇L(w) = [∂L/∂w₁, ∂L/∂w₂, …, ∂L/∂w_d]`}</code>
      </pre>
      <p className="mt-4 text-base">
        In gradient descent we update parameters using a step size (learning rate){" "}
        <code className="font-mono">η</code>:
      </p>
      <pre className="mt-4 overflow-x-auto rounded-lg border p-4 text-sm">
        <code>{`w ← w - η ∇L(w)`}</code>
      </pre>

      <h2 className="mt-10 text-2xl font-semibold">Chain Rule (Why Backprop Works)</h2>
      <p className="mt-4 text-base">
        Neural networks are compositions of functions. The chain rule tells us how to compute derivatives through a
        composition efficiently:
      </p>
      <pre className="mt-4 overflow-x-auto rounded-lg border p-4 text-sm">
        <code>{`If y = f(g(x)), then dy/dx = f'(g(x)) · g'(x).`}</code>
      </pre>
      <p className="mt-4 text-base">
        Backpropagation is the chain rule applied repeatedly across layers, reusing intermediate results to avoid
        expensive recomputation.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">What To Be Comfortable With</h2>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-base">
        <li>Taking derivatives of common functions (polynomials, exp, log, sigmoid, tanh).</li>
        <li>Gradients in vector form; interpreting a gradient as the direction of steepest increase.</li>
        <li>Second derivatives / Hessians for curvature and optimization intuition.</li>
        <li>Basic integrals and expectations for continuous probability.</li>
      </ul>
    </section>
  );
}
