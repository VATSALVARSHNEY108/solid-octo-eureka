export default function LinearAlgebra() {
  return (
    <section className="px-12 py-24">
      <h1 className="text-3xl font-semibold">Linear Algebra</h1>
      <p className="mt-4 text-base">
        Linear algebra is the math of vectors, matrices, and linear transformations. Modern ML is implemented as large
        sequences of matrix multiplications plus nonlinearities — so linear algebra is the backbone of efficient model
        computation.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">Vectors, Matrices, Tensors</h2>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-base">
        <li>
          <span className="font-semibold">Vector</span>: an ordered list of numbers (features, embeddings, gradients).
        </li>
        <li>
          <span className="font-semibold">Matrix</span>: a 2D table (linear layers, attention projections, covariance).
        </li>
        <li>
          <span className="font-semibold">Tensor</span>: generalization to N dimensions (batch × sequence × features).
        </li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold">Matrix Multiplication Intuition</h2>
      <p className="mt-4 text-base">
        A matrix <code className="font-mono">W</code> defines a linear map. For input vector{" "}
        <code className="font-mono">x</code>, the output <code className="font-mono">y = Wx</code> is a new vector whose
        components are weighted sums of <code className="font-mono">x</code>.
      </p>
      <pre className="mt-4 overflow-x-auto rounded-lg border p-4 text-sm">
        <code>{`y = Wx + b   (a typical neural network layer)`}</code>
      </pre>

      <h2 className="mt-10 text-2xl font-semibold">Dot Product, Norms, Angles</h2>
      <p className="mt-4 text-base">
        The dot product measures alignment and is fundamental to similarity search and attention.
      </p>
      <pre className="mt-4 overflow-x-auto rounded-lg border p-4 text-sm">
        <code>{`x · y = Σᵢ xᵢ yᵢ`}</code>
      </pre>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-base">
        <li>
          Norms (e.g. <code className="font-mono">||x||₂</code>) measure vector length and are used in regularization and
          normalization.
        </li>
        <li>Cosine similarity compares direction (angle) rather than magnitude.</li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold">Eigenvalues, Eigenvectors, SVD</h2>
      <p className="mt-4 text-base">
        Decompositions reveal structure inside matrices — useful for dimensionality reduction and understanding geometry.
      </p>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-base">
        <li>
          <span className="font-semibold">Eigen</span>: <code className="font-mono">Av = λv</code> captures directions{" "}
          <code className="font-mono">v</code> that a matrix scales by <code className="font-mono">λ</code>.
        </li>
        <li>
          <span className="font-semibold">SVD</span>: <code className="font-mono">A = U Σ Vᵀ</code> generalizes eigen
          ideas to any matrix; PCA is closely related to SVD on centered data.
        </li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold">What To Be Comfortable With</h2>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-base">
        <li>Shapes: verifying dimensions in matrix products.</li>
        <li>Transpose, inverse (when it exists), rank, and conditioning.</li>
        <li>Orthogonality and projections (least squares, embeddings).</li>
        <li>Gradients of simple matrix expressions (useful for ML derivations).</li>
      </ul>
    </section>
  );
}
