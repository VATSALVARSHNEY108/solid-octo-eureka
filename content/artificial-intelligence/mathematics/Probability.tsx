export default function Probability() {
  return (
    <section className="px-12 py-24">
      <h1 className="text-3xl font-semibold">Probability</h1>
      <p className="mt-4 text-base">
        Probability gives a language for uncertainty. ML models often output probabilities (classification), assume
        probabilistic data-generating processes (Bayesian methods), or use randomness for sampling and generalization.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">Random Variables & Distributions</h2>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-base">
        <li>
          <span className="font-semibold">Discrete</span>: probabilities <code className="font-mono">P(X = x)</code> sum to 1.
        </li>
        <li>
          <span className="font-semibold">Continuous</span>: densities <code className="font-mono">p(x)</code> integrate to 1.
        </li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold">Expectation & Variance</h2>
      <p className="mt-4 text-base">Expectation is the average value under a distribution; variance measures spread.</p>
      <pre className="mt-4 overflow-x-auto rounded-lg border p-4 text-sm">
        <code>{`E[X] = Σₓ x P(X=x)   or   E[X] = ∫ x p(x) dx`}</code>
      </pre>
      <pre className="mt-4 overflow-x-auto rounded-lg border p-4 text-sm">
        <code>{`Var(X) = E[(X - E[X])²]`}</code>
      </pre>

      <h2 className="mt-10 text-2xl font-semibold">Conditional Probability & Bayes’ Rule</h2>
      <p className="mt-4 text-base">
        Conditioning updates beliefs given evidence. Bayes’ rule is the foundation of Bayesian inference.
      </p>
      <pre className="mt-4 overflow-x-auto rounded-lg border p-4 text-sm">
        <code>{`P(A|B) = P(B|A) P(A) / P(B)`}</code>
      </pre>

      <h2 className="mt-10 text-2xl font-semibold">Independence & Correlation</h2>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-base">
        <li>
          Independence: <code className="font-mono">P(A,B) = P(A)P(B)</code> (stronger than “uncorrelated”).
        </li>
        <li>Correlation measures linear relationship; zero correlation does not imply independence in general.</li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold">Common ML Distributions</h2>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-base">
        <li>Bernoulli / Categorical (classification targets)</li>
        <li>Gaussian (noise models, regression, latent variables)</li>
        <li>Multinomial (counts, bag-of-words)</li>
        <li>Exponential family (unifies many models; links to GLMs)</li>
      </ul>
    </section>
  );
}
