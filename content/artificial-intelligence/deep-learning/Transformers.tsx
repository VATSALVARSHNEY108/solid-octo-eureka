export default function Transformers() {
  return (
    <section className="w-full px-4 py-8 md:px-8">
      <div className="w-full border border-[var(--border-primary)] bg-[var(--bg-primary)]">
        <iframe
          src="/transformer-explainer-site/index.html"
          title="Transformer Explainer"
          className="w-full"
          style={{ border: 0, height: "85vh" }}
          allow="fullscreen; clipboard-read; clipboard-write"
        />
      </div>
    </section>
  );
}
