export default function CVBasics() {
  return (
    <section className="px-12 py-24">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold">Computer Vision Basics</h1>
        <p className="mt-4 text-base">
          Visual systems learn features—edges, textures, parts, and eventually objects—by composing many simple detectors. The interactive demo below
          (Distill: Feature Visualization) lets you explore what different layers and neurons respond to.
        </p>
      </header>

      <div className="mt-10">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">Interactive: Feature Visualization</h2>
          <a
            className="text-sm underline underline-offset-4"
            href="/post--feature-visualization/public/index.html"
            target="_blank"
            rel="noreferrer"
          >
            Open in new tab
          </a>
        </div>

        <div
          className="mt-4 overflow-hidden rounded-lg border"
          style={{ borderColor: "var(--border-primary)" }}
        >
          <iframe
            title="Distill Feature Visualization"
            src="/post--feature-visualization/public/index.html"
            className="h-[75vh] w-full bg-transparent"
          />
        </div>

        <p className="mt-4 text-sm" style={{ color: "var(--text-secondary)" }}>
          If the demo appears blank, make sure your browser allows cross-origin requests for local assets and that the page is served from this site (not
          opened directly from disk).
        </p>
      </div>
    </section>
  );
}
