import FrameworkLessonLayout, {
  type FrameworkLessonMeta,
} from "@/components/frameworks/FrameworkLessonLayout";

const meta: FrameworkLessonMeta = {
  subjectId: "artificial-intelligence",
  topicId: "frameworks",
  lessonId: "PyTorch",
  title: "PyTorch",
  tagline:
    "PyTorch is a deep learning framework built around tensors, GPU acceleration, and automatic differentiation—great for research and production training.",
  install: {
    steps: [
      "Create a virtual environment (recommended) and activate it.",
      "Install PyTorch from the official selector (CPU vs CUDA matters): `pip install torch torchvision torchaudio`.",
      "Verify: `python -c \"import torch; print(torch.__version__, torch.cuda.is_available())\"`.",
      "For MPS (Apple Silicon): use `torch.device('mps')` — supported from PyTorch 1.12+.",
    ],
    notes: [
      "CUDA builds are tied to your GPU driver + CUDA runtime; mismatches are a common install issue.",
      "Use the official install selector at pytorch.org to get the right wheel for your platform.",
      "For reproducibility, pin `torch==X.Y.Z` in requirements.txt.",
    ],
  },
  helloWorld: {
    code: `import torch
import torch.nn as nn

# Tensors + autograd
x = torch.tensor([1.0, 2.0, 3.0])
w = torch.tensor([0.1, 0.2, 0.3], requires_grad=True)
y = (x * w).sum()
y.backward()
print(w.grad)  # tensor([1., 2., 3.])

# Simple linear model
model = nn.Linear(3, 1)
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
loss_fn = nn.MSELoss()

X = torch.randn(16, 3)       # batch of 16
target = torch.randn(16, 1)

optimizer.zero_grad()
pred = model(X)
loss = loss_fn(pred, target)
loss.backward()
optimizer.step()
print(f"loss: {loss.item():.4f}")`,
    notes: [
      "Autograd tracks ops on tensors to compute gradients automatically.",
      "`requires_grad=True` tells PyTorch to record operations for backprop.",
      "Always call `optimizer.zero_grad()` before `loss.backward()` to clear stale gradients.",
    ],
  },
  bestFor: [
    "Training neural networks with custom control (research-friendly).",
    "Fine-tuning transformer models (often via Hugging Face).",
    "GPU acceleration with explicit, debuggable Python code.",
    "Custom loss functions, exotic architectures, and research prototyping.",
    "Reinforcement learning where dynamic computation graphs are essential.",
  ],
  notFor: [
    "Simple tabular baselines where scikit-learn is faster to iterate.",
    "Pure ETL and joins (Pandas/DuckDB is better).",
    "Inference-only serving at scale (consider ONNX export or TorchServe).",
    "Teams that need Keras-style high-level simplicity (TensorFlow/Keras may fit better).",
  ],
  pitfalls: [
    "Silent device bugs: mixing CPU and GPU tensors (use `.to(device)` consistently).",
    "Forgetting `model.train()` / `model.eval()` around training/inference — affects BatchNorm & Dropout.",
    "Not using `torch.no_grad()` during inference (wastes memory and compute).",
    "DataLoader bottlenecks: slow preprocessing can starve the GPU — use `num_workers > 0` and `pin_memory=True`.",
    "Gradient accumulation mistakes: forgetting `zero_grad()` makes gradients add up across batches silently.",
    "Shape errors: PyTorch uses `(batch, channels, H, W)` — always verify with `.shape` before a forward pass.",
    "Using `.detach()` incorrectly and accidentally breaking the computation graph.",
  ],
  related: [
    {
      title: "Hugging Face",
      href: "/curriculum/artificial-intelligence/frameworks/HuggingFace",
      desc: "Transformers + datasets + training utilities on top of PyTorch.",
    },
    {
      title: "TensorFlow",
      href: "/curriculum/artificial-intelligence/frameworks/TensorFlow",
      desc: "Alternative deep learning framework with strong production tooling.",
    },
    {
      title: "NumPy",
      href: "/curriculum/artificial-intelligence/frameworks/NumPy",
      desc: "Array math foundation; PyTorch tensors feel similar.",
    },
    {
      title: "Lightning",
      href: "/curriculum/artificial-intelligence/frameworks/PyTorchLightning",
      desc: "High-level training loop wrapper that removes boilerplate from raw PyTorch.",
    },
  ],
  prev: { title: "scikit-learn", lessonId: "ScikitLearn" },
  next: { title: "TensorFlow", lessonId: "TensorFlow" },
};

// ─── Code snippet helpers ─────────────────────────────────────────────────────

const snippets = {
  trainingLoop: `
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = MyModel().to(device)
optimizer = torch.optim.AdamW(model.parameters(), lr=3e-4, weight_decay=1e-2)
scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=10)

for epoch in range(num_epochs):
    model.train()
    for X, y in train_loader:
        X, y = X.to(device), y.to(device)
        optimizer.zero_grad()
        pred = model(X)
        loss = loss_fn(pred, y)
        loss.backward()
        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)  # gradient clipping
        optimizer.step()
    scheduler.step()

    model.eval()
    with torch.no_grad():
        val_loss = sum(loss_fn(model(X.to(device)), y.to(device)) for X, y in val_loader)
    print(f"Epoch {epoch}: val_loss={val_loss:.4f}")
`.trim(),

  customModule: `
class ResBlock(nn.Module):
    def __init__(self, dim: int):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(dim, dim),
            nn.LayerNorm(dim),
            nn.GELU(),
            nn.Linear(dim, dim),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return x + self.net(x)   # residual connection

class MLP(nn.Module):
    def __init__(self, in_dim: int, out_dim: int, depth: int = 4):
        super().__init__()
        self.stem = nn.Linear(in_dim, 256)
        self.blocks = nn.ModuleList([ResBlock(256) for _ in range(depth)])
        self.head = nn.Linear(256, out_dim)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.stem(x)
        for block in self.blocks:
            x = block(x)
        return self.head(x)
`.trim(),

  dataLoader: `
from torch.utils.data import Dataset, DataLoader

class TabularDataset(Dataset):
    def __init__(self, X: np.ndarray, y: np.ndarray):
        self.X = torch.from_numpy(X).float()
        self.y = torch.from_numpy(y).float()

    def __len__(self):
        return len(self.X)

    def __getitem__(self, idx):
        return self.X[idx], self.y[idx]

train_loader = DataLoader(
    TabularDataset(X_train, y_train),
    batch_size=256,
    shuffle=True,
    num_workers=4,        # parallel CPU workers
    pin_memory=True,      # faster CPU→GPU transfer
)
`.trim(),

  saveLoad: `
# Save
torch.save({
    "epoch": epoch,
    "model_state_dict": model.state_dict(),
    "optimizer_state_dict": optimizer.state_dict(),
    "loss": best_loss,
}, "checkpoint.pt")

# Load
checkpoint = torch.load("checkpoint.pt", map_location=device)
model.load_state_dict(checkpoint["model_state_dict"])
optimizer.load_state_dict(checkpoint["optimizer_state_dict"])

# Export to ONNX for serving
dummy_input = torch.randn(1, in_dim, device=device)
torch.onnx.export(model, dummy_input, "model.onnx", opset_version=17)
`.trim(),
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function PyTorch() {
  return (
    <FrameworkLessonLayout meta={meta}>

      {/* ── The training loop ── */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          The PyTorch training loop
        </h2>
        <ol className="mt-5 space-y-3 text-[var(--text-secondary)] list-decimal pl-5">
          <li><strong className="text-[var(--text-primary)]">Forward pass</strong> — compute predictions by calling <code>model(X)</code>.</li>
          <li><strong className="text-[var(--text-primary)]">Loss</strong> — compare predictions vs targets with a loss function.</li>
          <li><strong className="text-[var(--text-primary)]">Backward pass</strong> — call <code>loss.backward()</code> to compute gradients via autodiff.</li>
          <li><strong className="text-[var(--text-primary)]">Optimizer step</strong> — call <code>optimizer.step()</code> to update parameters.</li>
          <li><strong className="text-[var(--text-primary)]">Zero gradients</strong> — call <code>optimizer.zero_grad()</code> before the next batch.</li>
        </ol>
        <pre className="mt-6 overflow-x-auto rounded-xl bg-[var(--bg-secondary)] p-5 text-xs leading-relaxed text-[var(--text-secondary)]">
          <code>{snippets.trainingLoop}</code>
        </pre>
        <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed">
          Gradient clipping (<code>clip_grad_norm_</code>) prevents exploding gradients — especially important when training RNNs or large transformers. The cosine LR scheduler gradually cools the learning rate over training.
        </p>
      </section>

      {/* ── Key abstractions ── */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Key abstractions
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "Tensor",
              desc: "N-D array with CPU/GPU/MPS storage and NumPy-like ops. Supports float16/bfloat16 for mixed-precision training.",
              code: "x = torch.randn(3, 4, device='cuda')\nx.half()   # float16",
            },
            {
              title: "autograd",
              desc: "Records a dynamic computation graph during the forward pass; traverses it in reverse during `.backward()` to compute exact gradients.",
              code: "with torch.no_grad():   # disable grad tracking\n    pred = model(X)",
            },
            {
              title: "nn.Module",
              desc: "Base class for all models and layers. Composable — modules can contain other modules. Tracks parameters automatically.",
              code: "class Net(nn.Module):\n    def forward(self, x): ...",
            },
            {
              title: "DataLoader",
              desc: "Handles batching, shuffling, and parallel loading. The main tool for feeding data to the GPU without bottlenecks.",
              code: "DataLoader(ds, batch_size=64,\n  num_workers=4, pin_memory=True)",
            },
            {
              title: "Optimizer",
              desc: "Updates model parameters based on gradients. Common choices: SGD (simple, stable), Adam (fast convergence), AdamW (Adam + weight decay).",
              code: "optim.AdamW(model.parameters(),\n  lr=3e-4, weight_decay=1e-2)",
            },
            {
              title: "Loss functions",
              desc: "nn.MSELoss for regression, nn.CrossEntropyLoss for classification, nn.BCEWithLogitsLoss for binary tasks. All differentiable.",
              code: "loss = nn.CrossEntropyLoss()\nloss(logits, targets)",
            },
          ].map(({ title, desc, code }) => (
            <div
              key={title}
              className="rounded-[1.5rem] bg-[var(--bg-secondary)]/40 border border-[var(--border-subtle)] p-6 flex flex-col gap-3"
            >
              <h3 className="text-sm font-black uppercase tracking-[0.25em] text-[var(--text-primary)]">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{desc}</p>
              <pre className="rounded-lg bg-[var(--bg-secondary)] px-3 py-2 text-xs text-[var(--text-secondary)] overflow-x-auto">
                <code>{code}</code>
              </pre>
            </div>
          ))}
        </div>
      </section>

      {/* ── Building custom modules ── */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Building custom nn.Modules
        </h2>
        <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
          Every model is a subclass of <code>nn.Module</code>. Define parameters in <code>__init__</code>, forward logic in <code>forward</code>. Compose modules freely — PyTorch handles parameter registration and device movement automatically.
        </p>
        <pre className="mt-5 overflow-x-auto rounded-xl bg-[var(--bg-secondary)] p-5 text-xs leading-relaxed text-[var(--text-secondary)]">
          <code>{snippets.customModule}</code>
        </pre>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { label: "nn.Sequential", note: "Ordered chain of layers — use for simple feed-forward stacks." },
            { label: "nn.ModuleList", note: "List of modules tracked by PyTorch — use when you need dynamic indexing." },
            { label: "nn.ModuleDict", note: "Dict of named modules — useful for multi-head or multi-task models." },
          ].map(({ label, note }) => (
            <div key={label} className="rounded-xl border border-[var(--border-subtle)] p-4">
              <code className="text-xs font-bold text-[var(--text-primary)]">{label}</code>
              <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">{note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Data pipeline ── */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Data pipeline: Dataset + DataLoader
        </h2>
        <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
          Implement two methods on <code>Dataset</code>: <code>__len__</code> and <code>__getitem__</code>. PyTorch handles the rest. For image data, use <code>torchvision.transforms</code> inside <code>__getitem__</code> for on-the-fly augmentation.
        </p>
        <pre className="mt-5 overflow-x-auto rounded-xl bg-[var(--bg-secondary)] p-5 text-xs leading-relaxed text-[var(--text-secondary)]">
          <code>{snippets.dataLoader}</code>
        </pre>
        <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed">
          <code>pin_memory=True</code> keeps tensors in pinned (page-locked) CPU memory, enabling faster async transfers to the GPU. Always profile with <code>torch.profiler</code> if training is slower than expected — DataLoader workers are the most common bottleneck.
        </p>
      </section>

      {/* ── Mixed precision & performance ── */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Mixed precision & performance tips
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "torch.amp (AMP)",
              desc: "Automatic Mixed Precision runs forward/backward in float16 while keeping master weights in float32. Cuts memory use by ~50% and speeds up training on Tensor Core GPUs.",
              code: `scaler = torch.cuda.amp.GradScaler()
with torch.autocast(device_type='cuda'):
    loss = loss_fn(model(X), y)
scaler.scale(loss).backward()
scaler.step(optimizer)
scaler.update()`,
            },
            {
              title: "torch.compile (PyTorch 2.x)",
              desc: "JIT-compiles your model into optimised kernels via TorchInductor. Often 1.5–3× faster with a single line change.",
              code: `model = torch.compile(model)
# rest of training loop unchanged`,
            },
            {
              title: "torch.no_grad()",
              desc: "Context manager that disables gradient tracking — always use during inference and validation to save memory and compute.",
              code: `model.eval()
with torch.no_grad():
    preds = model(X_test)`,
            },
            {
              title: "Gradient checkpointing",
              desc: "Trades compute for memory by re-computing activations during backprop instead of storing them. Use for very deep or large models.",
              code: `from torch.utils.checkpoint import checkpoint
out = checkpoint(layer, x)  # recompute on backward`,
            },
          ].map(({ title, desc, code }) => (
            <div
              key={title}
              className="rounded-[1.5rem] bg-[var(--bg-secondary)]/40 border border-[var(--border-subtle)] p-6 flex flex-col gap-3"
            >
              <h3 className="text-sm font-black uppercase tracking-[0.25em] text-[var(--text-primary)]">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{desc}</p>
              <pre className="rounded-lg bg-[var(--bg-secondary)] px-3 py-2 text-xs text-[var(--text-secondary)] overflow-x-auto">
                <code>{code}</code>
              </pre>
            </div>
          ))}
        </div>
      </section>

      {/* ── Saving & exporting ── */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Saving, loading & exporting
        </h2>
        <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
          Save checkpoints with both model and optimizer state so training can resume. For inference serving, export to ONNX or use <code>torch.export</code> (PyTorch 2.x) for a portable, framework-agnostic representation.
        </p>
        <pre className="mt-5 overflow-x-auto rounded-xl bg-[var(--bg-secondary)] p-5 text-xs leading-relaxed text-[var(--text-secondary)]">
          <code>{snippets.saveLoad}</code>
        </pre>
      </section>

      {/* ── Debugging ── */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Debugging & inspecting models
        </h2>
        <div className="mt-5 space-y-3">
          {[
            {
              cmd: "print(model)",
              desc: "Prints the full module hierarchy — useful for verifying architecture at a glance.",
            },
            {
              cmd: "sum(p.numel() for p in model.parameters())",
              desc: "Counts total trainable parameters.",
            },
            {
              cmd: "torchinfo.summary(model, input_size=(1, 3, 224, 224))",
              desc: "Like Keras model.summary() — shows each layer's output shape and param count (pip install torchinfo).",
            },
            {
              cmd: "torch.autograd.set_detect_anomaly(True)",
              desc: "Raises an error with a traceback the moment a NaN or Inf appears in the gradient — great for debugging unstable training.",
            },
            {
              cmd: "tensor.shape, tensor.dtype, tensor.device",
              desc: "The three attributes to check first when debugging shape or device mismatches.",
            },
          ].map(({ cmd, desc }) => (
            <div key={cmd} className="flex gap-4 rounded-xl border border-[var(--border-subtle)] p-4">
              <code className="shrink-0 text-xs font-bold text-[var(--text-primary)] leading-relaxed break-all">{cmd}</code>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

    </FrameworkLessonLayout>
  );
}