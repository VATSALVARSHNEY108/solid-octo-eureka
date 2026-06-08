export default function InformationTheory() {
  return (
    <section className="px-12 py-24">
      <h1 className="text-3xl font-semibold">Information Theory</h1>

      <p className="mt-4 text-base">
        Information theory quantifies uncertainty and “surprise”. It explains why cross-entropy is the standard loss for
        classification and why KL divergence appears everywhere in generative modeling.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">Entropy</h2>
      <p className="mt-4 text-base">Entropy measures the uncertainty of a distribution.</p>
      <pre className="mt-4 overflow-x-auto rounded-lg border p-4 text-sm">
        <code>{`H(P) = - Σₓ P(x) log P(x)`}</code>
      </pre>

      <h2 className="mt-10 text-2xl font-semibold">Cross-Entropy</h2>
      <p className="mt-4 text-base">
        Cross-entropy measures how well a predicted distribution <code className="font-mono">Q</code> matches the true
        distribution <code className="font-mono">P</code>.
      </p>
      <pre className="mt-4 overflow-x-auto rounded-lg border p-4 text-sm">
        <code>{`H(P, Q) = - Σₓ P(x) log Q(x)`}</code>
      </pre>

      <h2 className="mt-10 text-2xl font-semibold">KL Divergence</h2>
      <p className="mt-4 text-base">
        KL divergence measures how different <code className="font-mono">Q</code> is from <code className="font-mono">P</code>.
      </p>
      <pre className="mt-4 overflow-x-auto rounded-lg border p-4 text-sm">
        <code>{`KL(P || Q) = Σₓ P(x) log (P(x) / Q(x))`}</code>
      </pre>

      <h2 className="mt-10 text-2xl font-semibold">Mutual Information</h2>
      <p className="mt-4 text-base">Mutual information measures shared information between variables.</p>
      <pre className="mt-4 overflow-x-auto rounded-lg border p-4 text-sm">
        <code>{`I(X; Y) = KL(P(X,Y) || P(X)P(Y))`}</code>
      </pre>
    </section>
  );
}
