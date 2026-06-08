export default function Optimization() {
  return (
    <section className="px-12 py-24">
      <h1 className="text-3xl font-semibold">Optimization</h1>
      <p className="mt-4 text-base">
        Optimization is the process of choosing parameters that minimize (or maximize) an objective. Training an ML model
        is optimization: we pick weights that minimize a loss on data while generalizing well to unseen examples.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">Problem Setup</h2>
      <p className="mt-4 text-base">Most supervised learning problems look like:</p>
      <pre className="mt-4 overflow-x-auto rounded-lg border p-4 text-sm">
        <code>{`min_w  L(w) = (1/n) Σᵢ ℓ(f(xᵢ; w), yᵢ) + λ R(w)`}</code>
      </pre>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-base">
        <li>
          <code className="font-mono">ℓ</code> is the per-example loss (MSE, cross-entropy, etc.).
        </li>
        <li>
          <code className="font-mono">R(w)</code> is a regularizer (e.g. L2 weight decay) that discourages overfitting.
        </li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold">First-Order Methods</h2>
      <p className="mt-4 text-base">
        First-order methods use gradients. They scale to huge models because gradients can be computed efficiently with
        backpropagation.
      </p>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-base">
        <li>
          <span className="font-semibold">Gradient Descent</span>: full dataset per step (expensive for large data).
        </li>
        <li>
          <span className="font-semibold">SGD / Mini-batch SGD</span>: estimate gradients from a batch; adds noise that can
          help escape shallow minima.
        </li>
        <li>
          <span className="font-semibold">Momentum</span>: smooths updates by accumulating a velocity.
        </li>
        <li>
          <span className="font-semibold">Adaptive methods</span>: Adam/RMSProp tune step sizes per-parameter.
        </li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold">Second-Order Intuition</h2>
      <p className="mt-4 text-base">
        Curvature matters. The Hessian (matrix of second derivatives) describes how the loss bends; steep curvature can
        require smaller steps for stability.
      </p>
      <pre className="mt-4 overflow-x-auto rounded-lg border p-4 text-sm">
        <code>{`H(w) = ∇²L(w)`}</code>
      </pre>
      <p className="mt-4 text-base">
        Full second-order methods are often too expensive for deep nets, but curvature ideas still guide learning rate
        schedules, normalization, and optimizer design.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">Constraints & Regularization</h2>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-base">
        <li>Constraints (e.g. non-negativity) can be handled via projections or parameterizations.</li>
        <li>Regularization trades off fit vs simplicity; common examples include weight decay, dropout, and early stopping.</li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold">Practical Checklist</h2>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-base">
        <li>Normalize inputs; watch loss curves for divergence or plateaus.</li>
        <li>Start with Adam, then tune learning rate (often the most important hyperparameter).</li>
        <li>Use learning-rate schedules; consider warmup for large models.</li>
        <li>Track validation metrics to detect overfitting early.</li>
      </ul>
    </section>
  );
}
