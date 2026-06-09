"use client";

export default function GPTSimulationPage() {
  const vizUrl =
    process.env.NEXT_PUBLIC_LLM_VIZ_URL ??
    (process.env.NODE_ENV === "development"
      ? "http://127.0.0.1:3002/llm"
      : "/llm-viz/out/llm.html");

  return (
    <section className="px-12 py-24 max-w-7xl mx-auto flex flex-col gap-12 bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <header className="text-center">
        <h1 className="text-5xl font-bold text-[var(--text-primary)]">GPT &amp; LLM Simulation Hub</h1>
        <p className="mt-4 text-lg text-[var(--text-secondary)]">
          Interact with the assistant bot and explore the full LLM pipeline visualization.
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-center w-full h-[550px] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-xl">
            Assistant will be available soon.
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-end justify-between gap-4 mb-3">
            <div className="text-sm text-[var(--text-secondary)]">LLM Visualization</div>
            <a
              className="text-sm underline underline-offset-4 text-[var(--text-primary)] hover:text-[var(--text-secondary)]"
              href={vizUrl}
              target="_blank"
              rel="noreferrer"
            >
              Open full screen
            </a>
          </div>
          <div className="w-full h-[600px] overflow-hidden bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-xl">
            <iframe
              title="LLM Visualization"
              src={vizUrl}
              className="w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer"
              sandbox="allow-same-origin allow-scripts allow-pointer-lock allow-forms"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
