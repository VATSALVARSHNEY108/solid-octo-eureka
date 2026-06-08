export default function NumericalMethods() {
  return (
    <section className="px-12 py-24">
      <h1 className="text-3xl font-semibold">Numerical Methods</h1>

      <p className="mt-4 text-base">
        Numerical methods are algorithms for approximate computation when exact math is too slow or impossible. ML relies
        on numerical methods constantly: optimization, solving linear systems, stability of training, and efficient
        computation at scale.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">Approximation & Error</h2>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-base">
        <li>
          <span className="font-semibold">Floating point</span>: limited precision can cause rounding and overflow/underflow.
        </li>
        <li>
          <span className="font-semibold">Stability</span>: small numerical errors should not explode during computation.
        </li>
        <li>
          <span className="font-semibold">Conditioning</span>: some problems amplify tiny input errors (ill-conditioned).
        </li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold">Solving Linear Systems</h2>
      <p className="mt-4 text-base">
        Many ML methods reduce to solving <code className="font-mono">Ax = b</code> (least squares, ridge regression). For
        large problems, iterative solvers can be faster than direct matrix inversion.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">Numerical Integration</h2>
      <p className="mt-4 text-base">
        When modeling continuous-time dynamics (ODEs), we approximate integrals with methods like Euler or Runge–Kutta.
        Step size trades off speed vs accuracy.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">Practical Tips For ML</h2>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-base">
        <li>Normalize inputs; use stable loss implementations (log-sum-exp).</li>
        <li>Watch for NaNs/infs; use gradient clipping for exploding gradients.</li>
        <li>Prefer numerically stable decompositions (e.g. QR/SVD) over naive inversion.</li>
      </ul>
    </section>
  );
}
