export default function Foundations() {
  return (
    <section className="px-12 py-24">
      <h1 className="text-3xl font-semibold">Mathematical Foundations</h1>

      <p className="mt-4 text-base">
        ML draws from multiple math areas. This topic is a roadmap: what to learn, why it matters, and how the pieces
        connect.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">The Core Toolkit</h2>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-base">
        <li>
          <span className="font-semibold">Linear algebra</span>: vectors/matrices, projections, decompositions (SVD).
        </li>
        <li>
          <span className="font-semibold">Calculus</span>: derivatives, gradients, chain rule (backprop).
        </li>
        <li>
          <span className="font-semibold">Probability</span>: uncertainty, expectations, Bayes’ rule.
        </li>
        <li>
          <span className="font-semibold">Statistics</span>: estimation, generalization, significance.
        </li>
        <li>
          <span className="font-semibold">Optimization</span>: how training algorithms actually minimize loss.
        </li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold">A Useful “Translation Table”</h2>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-base">
        <li>“Similarity” often means dot products / cosine similarity (linear algebra).</li>
        <li>“Learning” often means gradient-based optimization (calculus + optimization).</li>
        <li>“Uncertainty” often means distributions and expectations (probability).</li>
        <li>“Does it generalize?” often means statistical reasoning and careful evaluation (statistics).</li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold">Suggested Learning Order</h2>
      <ol className="mt-4 list-decimal space-y-2 pl-6 text-base">
        <li>Vectors, matrices, matrix multiplication, dot products.</li>
        <li>Derivatives, gradients, and the chain rule.</li>
        <li>Random variables, expectation, basic distributions.</li>
        <li>MLE/MAP, overfitting, bias–variance, confidence intervals.</li>
        <li>Gradient descent, momentum, Adam, regularization.</li>
      </ol>

      <h2 className="mt-10 text-2xl font-semibold">How To Practice</h2>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-base">
        <li>Derive gradients for simple models (linear/logistic regression) by hand once.</li>
        <li>Check shapes in matrix expressions until it becomes automatic.</li>
        <li>Run small experiments: change learning rate, batch size, weight decay, and observe effects.</li>
      </ul>
    </section>
  );
}
