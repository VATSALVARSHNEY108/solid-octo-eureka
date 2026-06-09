export default function MultiModelAi() {
  return (
    <section className="px-12 py-24">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] px-5 py-2 text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-secondary)]">
            <span className="inline-block size-2 rounded-full bg-[var(--text-primary)]" />
            Generative AI
          </div>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl text-[var(--text-primary)]">
            Multimodal AI
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-[var(--text-secondary)]">
            Interactive Distill article embed for the multimodal neurons lesson.
          </p>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">
            If the embed looks cropped, open it in a new tab:{" "}
            <a
              className="underline decoration-[var(--border-subtle)] underline-offset-4 hover:text-[var(--text-primary)]"
              href="https://distill.pub/2021/multimodal-neurons/"
              target="_blank"
              rel="noreferrer"
            >
              https://distill.pub/2021/multimodal-neurons/
            </a>
          </p>
        </header>

        <div className="mt-16 rounded-[2rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)] shadow-premium overflow-hidden">
          <iframe
            title="Distill: Multimodal"
            src="https://distill.pub/2021/multimodal-neurons/"
            className="block w-full h-[80vh] min-h-[720px] bg-[var(--bg-primary)]"
          />
        </div>
      </div>
    </section>
  );
}

