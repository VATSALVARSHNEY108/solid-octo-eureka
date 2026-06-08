export default function Statistics() {
  return (
    <section className="px-12 py-24">
      <h1 className="text-3xl font-semibold">Statistics</h1>
      <p className="mt-4 text-base">
        Statistics turns data into conclusions. In ML, statistics helps you reason about estimation, generalization,
        uncertainty, and whether observed improvements are real or just noise.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">Population vs Sample</h2>
      <p className="mt-4 text-base">
        You rarely see the full population; you observe a sample. Statistics studies how sample-based estimates behave.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">Estimation</h2>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-base">
        <li>
          <span className="font-semibold">Point estimates</span>: mean, variance, regression coefficients.
        </li>
        <li>
          <span className="font-semibold">Bias–variance tradeoff</span>: bias is systematic error; variance is sensitivity
          to sampling noise.
        </li>
        <li>
          <span className="font-semibold">Maximum likelihood (MLE)</span>: choose parameters maximizing{" "}
          <code className="font-mono">p(data | θ)</code>.
        </li>
        <li>
          <span className="font-semibold">MAP</span>: adds a prior, maximizing <code className="font-mono">p(θ|data)</code>.
        </li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold">Hypothesis Testing & Confidence</h2>
      <p className="mt-4 text-base">
        When comparing models (A/B tests, new architecture vs baseline), you want to know if gains are statistically
        significant and practically meaningful.
      </p>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-base">
        <li>
          <span className="font-semibold">p-value</span>: how surprising your result is under a null hypothesis.
        </li>
        <li>
          <span className="font-semibold">Confidence interval</span>: plausible range for an estimated quantity.
        </li>
        <li>
          <span className="font-semibold">Effect size</span>: how large the improvement is (not just whether it exists).
        </li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold">Generalization & Overfitting</h2>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-base">
        <li>Train/validation/test splits approximate performance on unseen data.</li>
        <li>Cross-validation reduces variance for small datasets.</li>
        <li>Regularization and early stopping reduce overfitting.</li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold">Useful Mental Models</h2>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-base">
        <li>Correlation ≠ causation; confounding can create misleading relationships.</li>
        <li>Multiple comparisons can produce false “wins” if you test many variants.</li>
        <li>Data leakage can inflate metrics; guard the test set carefully.</li>
      </ul>
    </section>
  );
}
