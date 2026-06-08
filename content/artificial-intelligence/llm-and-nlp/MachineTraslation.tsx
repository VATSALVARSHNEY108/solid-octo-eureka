const modelFamilies = [
  "Rule-Based MT (RBMT): hand-written linguistic rules and dictionaries.",
  "Statistical MT (SMT): phrase/word probabilities from aligned corpora.",
  "Neural MT (NMT): encoder-decoder and transformer-based end-to-end models.",
  "Large Language Model MT: instruction-tuned translation with context awareness.",
];

const pipeline = [
  "Collect and clean parallel corpora (source-target sentence pairs).",
  "Normalize text and tokenize with language-aware tokenizers.",
  "Train baseline model (often Transformer) with teacher forcing.",
  "Evaluate using BLEU, chrF, COMET, and human fluency checks.",
  "Improve domain adaptation with fine-tuning and glossary constraints.",
  "Deploy with latency, cost, and safety monitoring.",
];

export default function MachineTraslation() {
  return (
    <section className="px-12 py-24">
      <header className="max-w-4xl">
        <h1 className="text-3xl font-semibold">Machine Translation</h1>
        <p className="mt-4 text-base">
          Machine Translation converts text from one language to another while preserving meaning, tone, and context. Modern systems use attention-based
          sequence models and transformers to handle long-range dependencies and multilingual transfer.
        </p>
      </header>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <article className="rounded-lg border p-6" style={{ borderColor: "var(--border-primary)" }}>
          <h2 className="text-xl font-semibold">Where It Is Used</h2>
          <ul className="mt-4 space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            <li>Cross-border customer support chat.</li>
            <li>Localization of apps, websites, and product documentation.</li>
            <li>Real-time subtitle translation for media and meetings.</li>
            <li>Multilingual search and knowledge retrieval.</li>
          </ul>
        </article>

        <article className="rounded-lg border p-6" style={{ borderColor: "var(--border-primary)" }}>
          <h2 className="text-xl font-semibold">Model Families</h2>
          <ul className="mt-4 space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            {modelFamilies.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>

      <article className="mt-6 rounded-lg border p-6" style={{ borderColor: "var(--border-primary)" }}>
        <h2 className="text-xl font-semibold">End-to-End Workflow</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm" style={{ color: "var(--text-secondary)" }}>
          {pipeline.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </article>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <article className="rounded-lg border p-6" style={{ borderColor: "var(--border-primary)" }}>
          <h2 className="text-xl font-semibold">Key Challenges</h2>
          <ul className="mt-4 space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            <li>Low-resource languages with limited parallel data.</li>
            <li>Idioms and culture-specific phrasing.</li>
            <li>Domain drift (legal, medical, technical jargon).</li>
            <li>Named entity consistency across long documents.</li>
          </ul>
        </article>

        <article className="rounded-lg border p-6" style={{ borderColor: "var(--border-primary)" }}>
          <h2 className="text-xl font-semibold">Best Practices</h2>
          <ul className="mt-4 space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            <li>Maintain a terminology glossary for critical terms.</li>
            <li>Use domain fine-tuning and quality estimation.</li>
            <li>Add human review for high-stakes outputs.</li>
            <li>Track hallucinations, omissions, and fluency errors.</li>
          </ul>
        </article>
      </div>
    </section>
  );
}
