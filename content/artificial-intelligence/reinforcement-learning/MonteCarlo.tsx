export default function MonteCarlo() {
  return (
    <section className="px-12 py-24">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold">Monte Carlo Methods</h1>
        <p className="mt-4 text-base">
          Monte Carlo reinforcement learning estimates value functions from complete sampled episodes. The Distill TD Paths article helps compare Monte Carlo
          and temporal-difference style credit assignment in an intuitive visual way.
        </p>
      </header>

      <div className="mt-10">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">Interactive: TD Paths</h2>
          <a className="text-sm underline underline-offset-4" href="/post--td-paths/public/index.html" target="_blank" rel="noreferrer">
            Open in new tab
          </a>
        </div>

        <div className="mt-4 overflow-hidden rounded-lg border" style={{ borderColor: "var(--border-primary)" }}>
          <iframe title="Distill TD Paths" src="/post--td-paths/public/index.html" className="h-[75vh] w-full bg-transparent" />
        </div>
      </div>
    </section>
  );
}
