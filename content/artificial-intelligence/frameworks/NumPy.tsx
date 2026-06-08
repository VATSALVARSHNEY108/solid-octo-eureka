import FrameworkLessonLayout, {
  type FrameworkLessonMeta,
} from "@/components/frameworks/FrameworkLessonLayout";

const meta: FrameworkLessonMeta = {
  subjectId: "artificial-intelligence",
  topicId: "frameworks",
  lessonId: "NumPy",
  title: "NumPy",
  tagline:
    "NumPy is the foundation of scientific Python: fast N-dimensional arrays, broadcasting, vectorized operations, and core linear algebra.",
  install: {
    steps: [
      "Create a virtual environment (recommended) and activate it.",
      "Install NumPy: `pip install numpy`.",
      "Verify: `python -c \"import numpy as np; print(np.__version__)\"`.",
    ],
    notes: ["If you also install pandas/scikit-learn, NumPy comes along automatically."],
  },
  helloWorld: {
    code: `import numpy as np

x = np.array([1, 2, 3])
y = x * 10
print(y)  # [10 20 30]`,
    notes: ["This vectorized style is why NumPy is fast: it pushes work into compiled code."],
  },
  bestFor: [
    "Fast numeric computation on CPU (arrays, matrix multiply, stats).",
    "Prototyping ML math (losses, gradients by hand, toy models).",
    "Preprocessing pipelines before training.",
  ],
  notFor: [
    "Automatic differentiation and deep learning training loops (use PyTorch/TF).",
    "Large-scale distributed training (use specialized frameworks).",
  ],
  pitfalls: [
    "Accidentally using Python loops instead of vectorized ops (slow).",
    "Shape bugs: mixing up (n,) vs (n,1) vs (1,n); always print shapes.",
    "Broadcasting surprises: a computation works but produces the wrong shape.",
    "dtype mismatches (int vs float) causing truncation or overflow.",
  ],
  related: [
    {
      title: "Pandas",
      href: "/curriculum/artificial-intelligence/frameworks/Pandas",
      desc: "Tabular ETL built on NumPy arrays.",
    },
    {
      title: "scikit-learn",
      href: "/curriculum/artificial-intelligence/frameworks/ScikitLearn",
      desc: "Classical ML estimators that often accept NumPy arrays.",
    },
    {
      title: "PyTorch",
      href: "/curriculum/artificial-intelligence/frameworks/PyTorch",
      desc: "Tensors + autodiff + GPU training loops.",
    },
  ],
  prev: { title: "Hugging Face", lessonId: "HuggingFace" },
  next: { title: "Pandas", lessonId: "Pandas" },
};

// ── Code snippets ────────────────────────────────────────────────────────────

const CODE_ARRAY_CREATION = `import numpy as np

# From Python sequences
a = np.array([1, 2, 3])                    # 1-D, dtype=int64
b = np.array([[1.0, 2.0], [3.0, 4.0]])    # 2-D, dtype=float64

# Built-in constructors
np.zeros((3, 4))          # all zeros, shape (3,4)
np.ones((2, 3))           # all ones
np.eye(4)                 # 4x4 identity matrix
np.arange(0, 10, 2)      # [0 2 4 6 8]
np.linspace(0, 1, 5)     # [0.   0.25 0.5  0.75 1.  ]
np.full((2, 2), 7)        # [[7 7] [7 7]]

# Random
rng = np.random.default_rng(seed=42)   # preferred modern API
rng.standard_normal((3, 3))            # Gaussian N(0,1)
rng.integers(0, 10, size=(4,))         # random ints in [0,10)
rng.uniform(0, 1, size=(100,))`;

const CODE_DTYPES = `import numpy as np

# Specify dtype explicitly
a = np.array([1, 2, 3], dtype=np.float32)
b = np.zeros((4,), dtype=np.int16)

# Check and cast
print(a.dtype)              # float32
c = a.astype(np.float64)   # cast to float64

# Common dtypes in ML
# float32  – standard GPU/CPU training dtype
# float64  – NumPy default; use when precision matters
# int32    – class labels, indices
# bool_    – masks`;

const CODE_SHAPE_INDEX = `import numpy as np

a = np.arange(24).reshape(2, 3, 4)   # shape (2,3,4)

# Indexing
a[0]            # first slice along axis 0 → shape (3,4)
a[0, 1, 2]     # scalar element
a[:, 1, :]     # all along axis 0 and 2, index 1 on axis 1

# Slicing
a[0, :2, 1:]   # rows 0-1, cols 1-3 of first block

# Boolean indexing
x = np.array([10, 20, 30, 40])
mask = x > 15
x[mask]        # [20 30 40]
x[x % 20 == 0] # [20 40]

# Fancy indexing
idx = np.array([0, 2])
x[idx]         # [10 30]

# Shape manipulation
a.reshape(6, 4)        # same data, new shape
a.flatten()            # always returns a copy
a.ravel()              # returns view when possible
a.T                    # transpose
np.expand_dims(x, 0)  # (4,) -> (1,4)
x[:, np.newaxis]       # (4,) -> (4,1)`;

const CODE_VECTORIZED = `import numpy as np

x = np.array([1.0, 2.0, 3.0, 4.0])

# Elementwise arithmetic
x + 10          # [11. 12. 13. 14.]
x * x           # [ 1.  4.  9. 16.]
np.sqrt(x)      # [1.   1.41 1.73 2.  ]
np.exp(x)
np.log(x)

# Aggregations
x.sum()         # 10.0
x.mean()        # 2.5
x.std()         # 1.118...
x.min(), x.max()
x.argmin(), x.argmax()   # index of min/max

# Axis-wise aggregation (2-D example)
m = np.array([[1, 2, 3], [4, 5, 6]])
m.sum(axis=0)   # sum each column → [5 7 9]
m.sum(axis=1)   # sum each row    → [ 6 15]
m.mean(axis=0)  # [2.5 3.5 4.5]`;

const CODE_BROADCASTING = `import numpy as np

# Rule: align shapes from the right; size-1 dims are stretched.

a = np.ones((3, 4))     # shape (3,4)
b = np.ones((4,))       # shape   (4,) -> broadcast to (3,4)
(a + b).shape           # (3,4)  ✓

# Outer product via broadcasting
col = np.array([[1], [2], [3]])   # (3,1)
row = np.array([10, 20, 30])      # (3,)  treated as (1,3)
col * row   # (3,3) — outer product without np.outer

# Common pitfall: (n,) vs (n,1) vs (1,n)
x = np.arange(4)        # shape (4,)
x + x[:, np.newaxis]    # (4,4) — outer sum, intended?
x + x                   # (4,)  — elementwise, different`;

const CODE_LINALG = `import numpy as np

A = np.array([[1., 2.], [3., 4.]])
b = np.array([5., 6.])

# Matrix multiply
A @ A               # matrix product (preferred over np.dot)
np.dot(A, b)        # also works

# Solve linear system Ax = b
x = np.linalg.solve(A, b)

# Decompositions
U, S, Vh = np.linalg.svd(A)     # singular value decomposition
Q, R     = np.linalg.qr(A)      # QR decomposition
vals, vecs = np.linalg.eig(A)   # eigenvalues / eigenvectors

# Norms
np.linalg.norm(b)           # L2 norm (default)
np.linalg.norm(b, ord=1)    # L1 norm
np.linalg.norm(A, ord='fro') # Frobenius norm

# Other useful ops
np.linalg.det(A)    # determinant
np.linalg.inv(A)    # inverse (prefer solve over inv @ b)
np.linalg.matrix_rank(A)`;

const CODE_ML_PATTERNS = `import numpy as np

# ── Sigmoid ──────────────────────────────────────────────────
def sigmoid(z):
    return 1 / (1 + np.exp(-z))

# ── Softmax (numerically stable) ─────────────────────────────
def softmax(z):
    e = np.exp(z - z.max(axis=-1, keepdims=True))
    return e / e.sum(axis=-1, keepdims=True)

# ── Binary cross-entropy loss ────────────────────────────────
def bce_loss(y_pred, y_true, eps=1e-7):
    y_pred = np.clip(y_pred, eps, 1 - eps)
    return -np.mean(y_true * np.log(y_pred) + (1 - y_true) * np.log(1 - y_pred))

# ── Cosine similarity ────────────────────────────────────────
def cosine_sim(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# ── Z-score normalisation ────────────────────────────────────
def z_norm(X):
    return (X - X.mean(axis=0)) / (X.std(axis=0) + 1e-8)

# ── Min-max normalisation ────────────────────────────────────
def minmax(X):
    mn, mx = X.min(axis=0), X.max(axis=0)
    return (X - mn) / (mx - mn + 1e-8)

# ── Train / val / test split (no sklearn) ───────────────────
def split(X, y, val=0.1, test=0.1, seed=0):
    rng = np.random.default_rng(seed)
    idx = rng.permutation(len(X))
    n_test = int(len(X) * test)
    n_val  = int(len(X) * val)
    return (X[idx[n_test+n_val:]], y[idx[n_test+n_val:]],
            X[idx[n_test:n_test+n_val]], y[idx[n_test:n_test+n_val]],
            X[idx[:n_test]], y[idx[:n_test]])`;

const CODE_SAVE_LOAD = `import numpy as np

arr = np.arange(100).reshape(10, 10)

# Single array
np.save("arr.npy", arr)
loaded = np.load("arr.npy")

# Multiple arrays in one file
np.savez("data.npz", X=arr, y=arr[:, 0])
data = np.load("data.npz")
X, y = data["X"], data["y"]

# Compressed (good for large arrays)
np.savez_compressed("data_c.npz", X=arr)

# Text (CSV-like, slower, loses dtype)
np.savetxt("arr.csv", arr, delimiter=",")
loaded_txt = np.loadtxt("arr.csv", delimiter=",")`;

const CODE_INTEROP = `import numpy as np

# NumPy <-> PyTorch
import torch
t = torch.from_numpy(arr)   # zero-copy when possible
a = t.numpy()               # back to NumPy (CPU tensors only)

# NumPy <-> Pandas
import pandas as pd
df = pd.DataFrame(arr, columns=[f"f{i}" for i in range(arr.shape[1])])
back = df.to_numpy()        # or df.values

# NumPy <-> PIL image
from PIL import Image
img = Image.fromarray(np.uint8(np.random.randint(0,255,(64,64,3))))
arr_img = np.array(img)     # HxWxC uint8`;

// ── Sub-components ───────────────────────────────────────────────────────────

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="mt-4 rounded-xl bg-[var(--bg-secondary)]/60 border border-[var(--border-subtle)] p-5 text-xs leading-relaxed overflow-x-auto text-[var(--text-primary)]">
      <code>{code}</code>
    </pre>
  );
}

function KeyCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-[1.5rem] bg-[var(--bg-secondary)]/40 border border-[var(--border-subtle)] p-6">
      <h3 className="text-sm font-black uppercase tracking-[0.25em] text-[var(--text-primary)]">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{desc}</p>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function NumPy() {
  return (
    <FrameworkLessonLayout meta={meta}>

      {/* Why ML uses NumPy */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Why ML uses NumPy
        </h2>
        <ul className="mt-5 space-y-3 text-[var(--text-secondary)]">
          <li>Represents data as arrays: vectors, matrices, tensors.</li>
          <li>Fast elementwise ops without Python loops (vectorization).</li>
          <li>Broadcasting makes shape math ergonomic.</li>
          <li>Most ML frameworks (PyTorch, TF, JAX, scikit-learn) accept or return NumPy arrays.</li>
          <li>The universal interchange format for numeric data in Python.</li>
        </ul>
      </section>

      {/* Key ideas */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">Key ideas</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            { title: "ndarray", desc: "A strided view over a contiguous memory buffer with a shape, dtype, and strides. Slices return views, not copies." },
            { title: "Broadcasting", desc: "Rules for aligning shapes in elementwise operations. Shapes are compared from the right; size-1 dims are stretched." },
            { title: "Vectorization", desc: "Replace Python for-loops with array ops that delegate to compiled C/Fortran routines — typically 10-100x faster." },
            { title: "Linear algebra", desc: "Dot products, matrix multiply, decompositions (SVD, QR, Eigen), norms, and solvers via np.linalg." },
            { title: "dtype system", desc: "float32, float64, int32, bool_, complex128 and more. Mismatched dtypes cause silent truncation; always check." },
            { title: "Views vs copies", desc: "Reshape and slicing return views. Fancy indexing and boolean indexing return copies. Use .copy() when in doubt." },
          ].map(({ title, desc }) => (
            <KeyCard key={title} title={title} desc={desc} />
          ))}
        </div>
      </section>

      {/* Array creation */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Array creation
        </h2>
        <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed">
          NumPy provides many constructors. Use <code>np.random.default_rng(seed)</code> (the
          modern API) rather than the legacy <code>np.random.seed()</code> for reproducible
          random arrays.
        </p>
        <CodeBlock code={CODE_ARRAY_CREATION} />
      </section>

      {/* dtypes */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          dtypes
        </h2>
        <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed">
          NumPy infers dtype from the input. ML code almost always wants <code>float32</code> to
          match GPU memory layout; the NumPy default of <code>float64</code> doubles memory
          usage and slows data transfer to PyTorch/TF.
        </p>
        <CodeBlock code={CODE_DTYPES} />
      </section>

      {/* Shapes, indexing, slicing */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Shapes, indexing, and slicing
        </h2>
        <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed">
          Shape bugs are the most common NumPy mistake. Print <code>.shape</code> liberally
          during development and distinguish between rank-1 arrays <code>(n,)</code> and
          column/row vectors <code>(n,1)</code> / <code>(1,n)</code>.
        </p>
        <CodeBlock code={CODE_SHAPE_INDEX} />
      </section>

      {/* Vectorized ops */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Vectorized operations and aggregations
        </h2>
        <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed">
          Every arithmetic operator and universal function (ufunc) works elementwise on arrays.
          Aggregations accept an <code>axis</code> argument — axis 0 collapses rows, axis 1
          collapses columns.
        </p>
        <CodeBlock code={CODE_VECTORIZED} />
      </section>

      {/* Broadcasting */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Broadcasting — rules and pitfalls
        </h2>
        <div className="mt-5 space-y-3 text-sm text-[var(--text-secondary)] leading-relaxed">
          <p>NumPy aligns shapes from the right and stretches size-1 dimensions to match. Three rules:</p>
          <ol className="list-decimal list-inside space-y-1 pl-2">
            <li>If arrays have different numbers of dimensions, prepend 1s to the smaller shape.</li>
            <li>Dimensions with size 1 are stretched to match the other array.</li>
            <li>If sizes differ and neither is 1, NumPy raises a ValueError.</li>
          </ol>
        </div>
        <CodeBlock code={CODE_BROADCASTING} />
      </section>

      {/* Linear algebra */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Linear algebra (np.linalg)
        </h2>
        <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed">
          Use the <code>@</code> operator for matrix multiplication — it is cleaner than{" "}
          <code>np.dot</code> and works on stacks of matrices. Prefer{" "}
          <code>np.linalg.solve(A, b)</code> over computing <code>inv(A) @ b</code> — it is
          faster and numerically more stable.
        </p>
        <CodeBlock code={CODE_LINALG} />
      </section>

      {/* ML patterns */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Common ML patterns in NumPy
        </h2>
        <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed">
          Implementing these from scratch is the best way to understand what frameworks do
          internally — and to catch shape/dtype bugs before they hide behind autograd.
        </p>
        <CodeBlock code={CODE_ML_PATTERNS} />
      </section>

      {/* ufunc and where */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Useful functions quick-reference
        </h2>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm text-left text-[var(--text-secondary)] border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-subtle)]">
                <th className="py-3 pr-8 font-black text-[var(--text-primary)] uppercase tracking-wider text-xs">Function</th>
                <th className="py-3 font-black text-[var(--text-primary)] uppercase tracking-wider text-xs">What it does</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {[
                ["np.where(cond, x, y)", "Elementwise ternary: x where cond is True, else y"],
                ["np.clip(a, lo, hi)", "Clamp values to [lo, hi] — essential before log()"],
                ["np.unique(a)", "Sorted unique elements (+ counts with return_counts=True)"],
                ["np.concatenate([a,b], axis=0)", "Join arrays along an existing axis"],
                ["np.stack([a,b], axis=0)", "Join arrays along a new axis"],
                ["np.split(a, n, axis=0)", "Split into n equal pieces along axis"],
                ["np.pad(a, pad_width)", "Pad array edges (zero, reflect, wrap, etc.)"],
                ["np.einsum('ij,jk->ik', A, B)", "Einstein summation — expressive tensor contractions"],
                ["np.cumsum(a, axis=0)", "Cumulative sum along axis"],
                ["np.diff(a)", "First discrete difference"],
                ["np.percentile(a, 75)", "Percentile / quantile"],
                ["np.nan_to_num(a)", "Replace NaN/inf with finite values"],
                ["np.isnan(a).any()", "Check for NaNs in an array"],
                ["np.allclose(a, b)", "Element-wise equality with tolerance (for testing)"],
              ].map(([fn, desc]) => (
                <tr key={fn as string}>
                  <td className="py-3 pr-8 font-mono text-xs text-[var(--text-primary)]">{fn}</td>
                  <td className="py-3 text-sm">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Save and load */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Saving and loading arrays
        </h2>
        <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed">
          Prefer <code>.npy</code> / <code>.npz</code> over CSV — they preserve dtype and shape
          and are an order of magnitude faster to read and write.
        </p>
        <CodeBlock code={CODE_SAVE_LOAD} />
      </section>

      {/* Interop */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Interoperability
        </h2>
        <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed">
          NumPy arrays move between PyTorch, Pandas, and Pillow with near-zero overhead thanks to
          the buffer protocol. PyTorch tensors and NumPy arrays share memory when the tensor is on
          CPU — mutating one mutates the other.
        </p>
        <CodeBlock code={CODE_INTEROP} />
      </section>

      {/* Pitfalls deep-dive */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Common pitfalls — in depth
        </h2>
        <div className="mt-6 space-y-5 text-sm text-[var(--text-secondary)] leading-relaxed">
          {[
            {
              title: "Python loops instead of vectorized ops",
              body: "A Python for-loop over array elements is 10-100x slower than the equivalent NumPy ufunc. Profile with %timeit and replace loops with array operations, np.where, or np.apply_along_axis (last resort).",
            },
            {
              title: "Shape (n,) vs (n,1) vs (1,n)",
              body: "A rank-1 array (n,) behaves differently from a column vector (n,1) under broadcasting and matrix multiply. Use x.reshape(-1,1) or x[:,np.newaxis] to promote deliberately, and print .shape at every step while debugging.",
            },
            {
              title: "Silent broadcasting surprises",
              body: "An operation may succeed but produce the wrong shape — e.g. subtracting a (3,) mean from a (3,4) matrix may broadcast along the wrong axis. Always verify the output shape before moving on.",
            },
            {
              title: "dtype truncation",
              body: "Mixing int and float arrays can silently truncate results. If your loss is always 0.0, check whether your arrays are integer. Cast explicitly with .astype(np.float32) before arithmetic.",
            },
            {
              title: "Mutating a view",
              body: "Slices return views. Modifying a slice modifies the original array. If that is not intended, call .copy() on the slice before editing.",
            },
            {
              title: "Using np.random.seed() (legacy)",
              body: "The legacy global random state (np.random.seed / np.random.randn) is not thread-safe and causes reproducibility issues in multiprocessing. Use np.random.default_rng(seed) instead.",
            },
          ].map(({ title, body }) => (
            <div key={title}>
              <h3 className="font-black text-[var(--text-primary)]">{title}</h3>
              <p className="mt-1">{body}</p>
            </div>
          ))}
        </div>
      </section>

    </FrameworkLessonLayout>
  );
}