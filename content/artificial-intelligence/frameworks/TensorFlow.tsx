import FrameworkLessonLayout, {
  type FrameworkLessonMeta,
} from "@/components/frameworks/FrameworkLessonLayout";

const meta: FrameworkLessonMeta = {
  subjectId: "artificial-intelligence",
  topicId: "frameworks",
  lessonId: "TensorFlow",
  title: "TensorFlow",
  tagline:
    "TensorFlow is a deep learning framework with strong production tooling. Keras provides a high-level API for building and training models on CPU/GPU/TPU.",
  install: {
    steps: [
      "Create a virtual environment (recommended) and activate it.",
      "Install: `pip install tensorflow` (GPU-enabled on Linux/Windows with CUDA drivers).",
      "Mac (Apple Silicon): `pip install tensorflow-macos tensorflow-metal` for GPU support.",
      "CPU-only (lighter, no driver headaches): `pip install tensorflow-cpu`.",
      "Verify: `python -c \"import tensorflow as tf; print(tf.__version__, tf.config.list_physical_devices('GPU'))\"`.",
    ],
    notes: [
      "GPU support depends on OS + CUDA driver version — follow the official install matrix at tensorflow.org/install.",
      "TF 2.x ships with Keras 3 by default; `tf.keras` is the standard entry point.",
      "Pin `tensorflow==X.Y.Z` in requirements.txt — minor releases can change layer defaults.",
      "For TPU (Google Cloud), use `tensorflow` with the matching TF version on TPU VMs.",
    ],
  },
  helloWorld: {
    code: `import tensorflow as tf
from tensorflow import keras

# Build with Sequential API
model = keras.Sequential([
    keras.layers.Input(shape=(4,)),
    keras.layers.Dense(64, activation="relu"),
    keras.layers.Dropout(0.3),
    keras.layers.Dense(32, activation="relu"),
    keras.layers.Dense(1),
])

model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=3e-4),
    loss="mse",
    metrics=["mae"],
)

model.summary()   # prints layer shapes + param counts

# Training
history = model.fit(
    X_train, y_train,
    epochs=20,
    batch_size=64,
    validation_split=0.1,
    callbacks=[keras.callbacks.EarlyStopping(patience=3, restore_best_weights=True)],
)

print(model.evaluate(X_test, y_test))`,
    notes: [
      "Always pass Input(shape=...) as the first layer — it locks in the input shape for model.summary() and export.",
      "EarlyStopping with restore_best_weights=True saves the best checkpoint automatically.",
      "model.fit returns a History object — plot history.history['val_loss'] to diagnose training.",
    ],
  },
  bestFor: [
    "Quick model building and training with Keras Sequential or Functional API.",
    "Production export and serving workflows (SavedModel, TF Serving, TFLite, TF.js).",
    "Teams that value a batteries-included ecosystem with tf.data, callbacks, and built-in metrics.",
    "TPU training on Google Cloud — TF has the most mature TPU support.",
    "Mobile and edge deployment via TensorFlow Lite.",
    "When you want Keras's high-level ergonomics without managing the training loop.",
  ],
  notFor: [
    "Highly custom research training loops where PyTorch's dynamic graph feels more natural.",
    "Tabular baselines and cross-validation (scikit-learn is quicker to iterate).",
    "Teams already deeply invested in the PyTorch/HuggingFace ecosystem.",
    "Serverless inference at very low latency (consider ONNX Runtime or TensorRT).",
  ],
  pitfalls: [
    "GPU install confusion: CUDA/cuDNN driver mismatches — always check the official compatibility matrix.",
    "Mixing eager mode expectations with graph/export constraints — test SavedModel export early in the project.",
    "Inconsistent preprocessing between training and serving — package tf.keras preprocessing layers inside the model.",
    "Silent shape issues — log tensor shapes with model.summary() and layer output inspection.",
    "Not using tf.data properly — feeding NumPy arrays directly is fine for small data, but starves the GPU at scale.",
    "Forgetting model.trainable = False when fine-tuning — all layers train by default.",
    "Using model.predict() in a loop — always batch inputs; per-sample predict is very slow.",
  ],
  related: [
    {
      title: "PyTorch",
      href: "/curriculum/artificial-intelligence/frameworks/PyTorch",
      desc: "Alternative deep learning framework with very explicit training loops.",
    },
    {
      title: "Hugging Face",
      href: "/curriculum/artificial-intelligence/frameworks/HuggingFace",
      desc: "Transformer tooling that supports TensorFlow for some workflows.",
    },
    {
      title: "NumPy",
      href: "/curriculum/artificial-intelligence/frameworks/NumPy",
      desc: "Foundational array math; TF tensors feel similar but add autodiff.",
    },
    {
      title: "scikit-learn",
      href: "/curriculum/artificial-intelligence/frameworks/ScikitLearn",
      desc: "Classical ML baselines and evaluation tooling — often the right starting point.",
    },
  ],
  prev: { title: "PyTorch", lessonId: "PyTorch" },
  next: { title: "Hugging Face", lessonId: "HuggingFace" },
};

// ─── Code snippets ────────────────────────────────────────────────────────────

const snippets = {
  functionalAPI: `
import tensorflow as tf
from tensorflow import keras

# Functional API — for multi-input, multi-output, or skip connections
inputs = keras.Input(shape=(128,), name="features")
x = keras.layers.Dense(64, activation="relu")(inputs)
x = keras.layers.BatchNormalization()(x)
x = keras.layers.Dropout(0.3)(x)
x = keras.layers.Dense(32, activation="relu")(x)
outputs = keras.layers.Dense(10, activation="softmax", name="predictions")(x)

model = keras.Model(inputs=inputs, outputs=outputs)
model.compile(
    optimizer="adam",
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"],
)
`.trim(),

  customLayer: `
import tensorflow as tf
from tensorflow import keras

class ResidualBlock(keras.layers.Layer):
    def __init__(self, units: int, **kwargs):
        super().__init__(**kwargs)
        self.dense1 = keras.layers.Dense(units, activation="relu")
        self.dense2 = keras.layers.Dense(units)
        self.norm = keras.layers.LayerNormalization()
        self.add = keras.layers.Add()

    def call(self, x, training=False):
        residual = x
        x = self.dense1(x)
        x = self.dense2(x)
        x = self.add([x, residual])
        return self.norm(x, training=training)

# Use inside any model
inputs = keras.Input(shape=(64,))
x = ResidualBlock(64)(inputs)
x = ResidualBlock(64)(x)
outputs = keras.layers.Dense(1)(x)
model = keras.Model(inputs, outputs)
`.trim(),

  gradientTape: `
import tensorflow as tf

optimizer = tf.keras.optimizers.Adam(learning_rate=3e-4)
loss_fn = tf.keras.losses.SparseCategoricalCrossentropy()
train_acc = tf.keras.metrics.SparseCategoricalAccuracy()

@tf.function   # compile to a graph for speed
def train_step(X_batch, y_batch):
    with tf.GradientTape() as tape:
        logits = model(X_batch, training=True)
        loss = loss_fn(y_batch, logits)
    grads = tape.gradient(loss, model.trainable_variables)
    optimizer.apply_gradients(zip(grads, model.trainable_variables))
    train_acc.update_state(y_batch, logits)
    return loss

for epoch in range(num_epochs):
    train_acc.reset_state()
    for X_batch, y_batch in train_dataset:
        loss = train_step(X_batch, y_batch)
    print(f"Epoch {epoch}: acc={train_acc.result():.4f}")
`.trim(),

  tfData: `
import tensorflow as tf

AUTOTUNE = tf.data.AUTOTUNE

def parse_example(path, label):
    img = tf.io.read_file(path)
    img = tf.image.decode_jpeg(img, channels=3)
    img = tf.image.resize(img, [224, 224])
    img = tf.cast(img, tf.float32) / 255.0
    return img, label

train_ds = (
    tf.data.Dataset.from_tensor_slices((image_paths, labels))
    .shuffle(buffer_size=1000)
    .map(parse_example, num_parallel_calls=AUTOTUNE)
    .batch(32)
    .prefetch(AUTOTUNE)   # overlap preprocessing + GPU compute
)
`.trim(),

  callbacks: `
import tensorflow as tf
from tensorflow import keras

callbacks = [
    # Stop early and restore best weights
    keras.callbacks.EarlyStopping(
        monitor="val_loss", patience=5, restore_best_weights=True
    ),
    # Save best checkpoint to disk
    keras.callbacks.ModelCheckpoint(
        "best_model.keras", monitor="val_loss", save_best_only=True
    ),
    # Reduce LR when plateau
    keras.callbacks.ReduceLROnPlateau(
        monitor="val_loss", factor=0.5, patience=3, min_lr=1e-6
    ),
    # TensorBoard logging
    keras.callbacks.TensorBoard(log_dir="./logs", histogram_freq=1),
]

model.fit(X_train, y_train, epochs=100, validation_split=0.1, callbacks=callbacks)
`.trim(),

  saveExport: `
# Save the full model (architecture + weights + optimizer state)
model.save("my_model.keras")             # Keras native format (recommended)
model.save("my_model_savedmodel")        # TF SavedModel format (for TF Serving)

# Load
loaded = tf.keras.models.load_model("my_model.keras")

# Export for mobile / edge — TensorFlow Lite
converter = tf.lite.TFLiteConverter.from_saved_model("my_model_savedmodel")
converter.optimizations = [tf.lite.Optimize.DEFAULT]   # quantization
tflite_model = converter.convert()
with open("model.tflite", "wb") as f:
    f.write(tflite_model)

# Weights only (transfer learning)
model.save_weights("weights.h5")
model.load_weights("weights.h5")
`.trim(),

  transferLearning: `
import tensorflow as tf
from tensorflow import keras

# Load pretrained base (ImageNet weights, no top classifier)
base = keras.applications.MobileNetV3Small(
    input_shape=(224, 224, 3),
    include_top=False,
    weights="imagenet",
)
base.trainable = False   # freeze base during initial training

# Add custom head
inputs = keras.Input(shape=(224, 224, 3))
x = keras.applications.mobilenet_v3.preprocess_input(inputs)
x = base(x, training=False)
x = keras.layers.GlobalAveragePooling2D()(x)
x = keras.layers.Dropout(0.2)(x)
outputs = keras.layers.Dense(num_classes, activation="softmax")(x)
model = keras.Model(inputs, outputs)

# Phase 1: train head only
model.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])
model.fit(train_ds, epochs=10, validation_data=val_ds)

# Phase 2: unfreeze top layers and fine-tune
base.trainable = True
for layer in base.layers[:-20]:   # keep early layers frozen
    layer.trainable = False

model.compile(
    optimizer=keras.optimizers.Adam(1e-5),   # very low LR for fine-tuning
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"],
)
model.fit(train_ds, epochs=10, validation_data=val_ds)
`.trim(),
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function TensorFlow() {
  return (
    <FrameworkLessonLayout meta={meta}>

      {/* ── What TF gives you ── */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          What TensorFlow gives you
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "Tensors + acceleration",
              desc: "N-D arrays with automatic dispatch to CPU, GPU, or TPU. Operations mirror NumPy but add device management and autodiff.",
            },
            {
              title: "Keras API",
              desc: "High-level model building via Sequential, Functional, and Subclassing APIs. Handles the training loop, metrics, and callbacks for you.",
            },
            {
              title: "GradientTape",
              desc: "Low-level autodiff for custom training loops. Record forward ops, then call tape.gradient() to get exact gradients for any variable.",
            },
            {
              title: "tf.data",
              desc: "Declarative data pipeline API. Chains map, filter, batch, shuffle, prefetch. AUTOTUNE overlaps preprocessing with GPU compute.",
            },
            {
              title: "tf.function",
              desc: "Decorator that traces Python functions into optimised TF graphs. Speeds up training steps significantly — especially on loops.",
            },
            {
              title: "Export & serving",
              desc: "SavedModel format works with TF Serving, TFLite (mobile/edge), and TF.js (browser). Package preprocessing inside the model for consistent inference.",
            },
          ].map(({ title, desc }) => (
            <div
              key={title}
              className="rounded-[1.5rem] bg-[var(--bg-secondary)]/40 border border-[var(--border-subtle)] p-6"
            >
              <h3 className="text-sm font-black uppercase tracking-[0.25em] text-[var(--text-primary)]">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Three model-building APIs ── */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Three ways to build a model
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            {
              label: "Sequential",
              when: "Simple, linear stacks",
              note: "Layers in order, one input → one output. Quickest to write; not suitable for skip connections or multiple inputs.",
              code: `keras.Sequential([\n  Dense(64, activation='relu'),\n  Dense(1)\n])`,
            },
            {
              label: "Functional API",
              when: "Multi-input/output, skip connections",
              note: "Define a directed acyclic graph of layers explicitly. The standard choice for most non-trivial architectures.",
              code: `x = Dense(64)(inputs)\nout = Dense(1)(x)\nkeras.Model(inputs, out)`,
            },
            {
              label: "Subclassing",
              when: "Custom research loops",
              note: "Full Python flexibility — define __init__ and call(). Use when the Functional API is too constrained.",
              code: `class MyModel(keras.Model):\n  def call(self, x):\n    return self.dense(x)`,
            },
          ].map(({ label, when, note, code }) => (
            <div key={label} className="rounded-[1.5rem] bg-[var(--bg-secondary)]/40 border border-[var(--border-subtle)] p-6 flex flex-col gap-3">
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.25em] text-[var(--text-primary)]">{label}</h3>
                <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{when}</p>
              </div>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{note}</p>
              <pre className="rounded-lg bg-[var(--bg-secondary)] px-3 py-2 text-xs text-[var(--text-secondary)] overflow-x-auto">
                <code>{code}</code>
              </pre>
            </div>
          ))}
        </div>
        <p className="mt-5 text-sm text-[var(--text-secondary)] leading-relaxed">
          The Functional API is the recommended default for production code — its explicit, visualisable with <code>keras.utils.plot_model</code>, and serialises cleanly to SavedModel.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-xl bg-[var(--bg-secondary)] p-5 text-xs leading-relaxed text-[var(--text-secondary)]">
          <code>{snippets.functionalAPI}</code>
        </pre>
      </section>

      {/* ── Keras training loop ── */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Keras vs low-level GradientTape
        </h2>
        <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed">
          <code>model.fit()</code> handles the training loop, metrics, callbacks, and validation split. Use it unless you need behaviour that Keras cant express. For custom loops — non-standard gradient updates, meta-learning, RL — drop to <code>GradientTape</code> directly.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.5rem] bg-[var(--bg-secondary)]/40 border border-[var(--border-subtle)] p-6">
            <h3 className="text-sm font-black uppercase tracking-[0.25em] text-[var(--text-primary)] mb-3">Keras fit() — high level</h3>
            <pre className="text-xs text-[var(--text-secondary)] overflow-x-auto leading-relaxed"><code>{`model.compile(
    optimizer="adam",
    loss="mse",
    metrics=["mae"],
)
model.fit(
    X_train, y_train,
    epochs=20,
    batch_size=64,
    validation_split=0.1,
)`}</code></pre>
            <p className="mt-3 text-xs text-[var(--text-secondary)] leading-relaxed">Handles progress bars, history logging, callbacks, and distributed training. The right default for most projects.</p>
          </div>
          <div className="rounded-[1.5rem] bg-[var(--bg-secondary)]/40 border border-[var(--border-subtle)] p-6">
            <h3 className="text-sm font-black uppercase tracking-[0.25em] text-[var(--text-primary)] mb-3">GradientTape — low level</h3>
            <pre className="text-xs text-[var(--text-secondary)] overflow-x-auto leading-relaxed"><code>{`with tf.GradientTape() as tape:
    preds = model(X, training=True)
    loss = loss_fn(y, preds)
grads = tape.gradient(
    loss, model.trainable_variables
)
optimizer.apply_gradients(
    zip(grads, model.trainable_variables)
)`}</code></pre>
            <p className="mt-3 text-xs text-[var(--text-secondary)] leading-relaxed">Full control over every gradient. Decorate the step function with <code>@tf.function</code> for graph-mode speed.</p>
          </div>
        </div>
        <pre className="mt-5 overflow-x-auto rounded-xl bg-[var(--bg-secondary)] p-5 text-xs leading-relaxed text-[var(--text-secondary)]">
          <code>{snippets.gradientTape}</code>
        </pre>
      </section>

      {/* ── Custom layers ── */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Custom layers
        </h2>
        <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
          Subclass <code>keras.layers.Layer</code>. Define sub-layers in <code>__init__</code> and forward logic in <code>call</code>. Pass <code>training=False</code> through to sub-layers that behave differently at inference (BatchNorm, Dropout). Custom layers are fully composable with the Functional API and serialise correctly.
        </p>
        <pre className="mt-5 overflow-x-auto rounded-xl bg-[var(--bg-secondary)] p-5 text-xs leading-relaxed text-[var(--text-secondary)]">
          <code>{snippets.customLayer}</code>
        </pre>
      </section>

      {/* ── tf.data ── */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Data pipelines with tf.data
        </h2>
        <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
          <code>tf.data</code> is TensorFlow s declarative data pipeline API. It chains transformations lazily and can overlap CPU preprocessing with GPU compute via <code>prefetch(AUTOTUNE)</code>. Always prefer it over feeding NumPy arrays for anything beyond small toy datasets.
        </p>
        <pre className="mt-5 overflow-x-auto rounded-xl bg-[var(--bg-secondary)] p-5 text-xs leading-relaxed text-[var(--text-secondary)]">
          <code>{snippets.tfData}</code>
        </pre>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { label: ".shuffle(buffer)", note: "Randomly samples from a buffer — set buffer_size ≥ dataset size for true shuffling." },
            { label: ".map(fn, AUTOTUNE)", note: "Apply a preprocessing function. AUTOTUNE parallelises across CPU cores automatically." },
            { label: ".prefetch(AUTOTUNE)", note: "Prepares the next batch while the GPU processes the current one — eliminates idle GPU time." },
            { label: ".cache()", note: "Cache the dataset in memory (or on disk) after the first epoch — great for small datasets with expensive parsing." },
            { label: ".repeat()", note: "Repeat the dataset indefinitely — useful when specifying steps_per_epoch instead of epochs." },
            { label: ".batch(n, drop_remainder)", note: "Set drop_remainder=True for static shapes — required when exporting to TFLite or TF.js." },
          ].map(({ label, note }) => (
            <div key={label} className="rounded-xl border border-[var(--border-subtle)] p-4">
              <code className="text-xs font-bold text-[var(--text-primary)]">{label}</code>
              <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">{note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Callbacks ── */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Callbacks
        </h2>
        <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
          Callbacks hook into <code>model.fit()</code> at epoch start/end, batch start/end, and on training end. Always use at least <code>EarlyStopping</code> + <code>ModelCheckpoint</code> in production training runs.
        </p>
        <pre className="mt-5 overflow-x-auto rounded-xl bg-[var(--bg-secondary)] p-5 text-xs leading-relaxed text-[var(--text-secondary)]">
          <code>{snippets.callbacks}</code>
        </pre>
        <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed">
          For custom behaviour, subclass <code>keras.callbacks.Callback</code> and override <code>on_epoch_end</code>, <code>on_batch_end</code>, etc. Useful for logging to experiment trackers (W&amp;B, MLflow) or early stopping on custom metrics.
        </p>
      </section>

      {/* ── Transfer learning ── */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Transfer learning & fine-tuning
        </h2>
        <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
          <code>keras.applications</code> ships pretrained image models (MobileNet, EfficientNet, ResNet, etc.) with ImageNet weights. Freeze the base, train a new head, then unfreeze the top layers for fine-tuning at a very low learning rate.
        </p>
        <pre className="mt-5 overflow-x-auto rounded-xl bg-[var(--bg-secondary)] p-5 text-xs leading-relaxed text-[var(--text-secondary)]">
          <code>{snippets.transferLearning}</code>
        </pre>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            { label: "Phase 1 — train head only", note: "Keep base.trainable=False. Use a normal LR (1e-3 to 3e-4). Converges quickly — the base features are already good." },
            { label: "Phase 2 — fine-tune top layers", note: "Unfreeze the last N layers of the base. Use a very low LR (1e-5) to avoid destroying pretrained weights." },
            { label: "base(x, training=False)", note: "Pass training=False when the base is frozen — keeps BatchNorm in inference mode even during model.fit()." },
            { label: "Preprocessing layers", note: "Use keras.applications.mobilenet_v3.preprocess_input inside the model so inference doesn't require separate normalisation." },
          ].map(({ label, note }) => (
            <div key={label} className="rounded-xl border border-[var(--border-subtle)] p-4">
              <code className="text-xs font-bold text-[var(--text-primary)]">{label}</code>
              <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">{note}</p>
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
          The <code>.keras</code> format (Keras native) is the recommended save format — it stores architecture, weights, and optimizer state. Use <strong>SavedModel</strong> for TF Serving. Use <strong>TFLite</strong> for mobile and edge. Always include preprocessing layers inside the model before exporting so the serving artifact is self-contained.
        </p>
        <pre className="mt-5 overflow-x-auto rounded-xl bg-[var(--bg-secondary)] p-5 text-xs leading-relaxed text-[var(--text-secondary)]">
          <code>{snippets.saveExport}</code>
        </pre>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { label: ".keras format", note: "Keras native — stores everything. Best for resuming training or sharing with other Keras users." },
            { label: "SavedModel", note: "TF's portable format — works with TF Serving, TF.js converter, and TFLite converter. Language-agnostic." },
            { label: "TFLite", note: "Optimised for mobile and microcontrollers. Supports quantisation (INT8/FP16) to shrink model size by 4×." },
          ].map(({ label, note }) => (
            <div key={label} className="rounded-xl border border-[var(--border-subtle)] p-4">
              <code className="text-xs font-bold text-[var(--text-primary)]">{label}</code>
              <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">{note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Layer reference ── */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Common layers reference
        </h2>
        <div className="mt-5 space-y-2">
          {[
            { name: "Dense(units, activation)", note: "Fully connected layer. The building block of MLPs." },
            { name: "Conv2D(filters, kernel_size)", note: "2D convolution for image feature extraction." },
            { name: "LSTM(units) / GRU(units)", note: "Recurrent layers for sequences. Set return_sequences=True to stack." },
            { name: "MultiHeadAttention(heads, key_dim)", note: "Transformer-style attention. Use with positional encoding for sequences." },
            { name: "Embedding(vocab, dim)", note: "Learnable lookup table — converts token IDs to dense vectors." },
            { name: "BatchNormalization()", note: "Normalises activations per batch. Pass training=True/False correctly — critical for frozen layers." },
            { name: "LayerNormalization()", note: "Normalises across features (not batch). Preferred in Transformers and RNNs." },
            { name: "Dropout(rate)", note: "Zeros random activations during training. Use training=True/False — it's a no-op at inference." },
            { name: "GlobalAveragePooling2D()", note: "Collapses spatial dims to a vector — standard pooling head for CNNs." },
            { name: "Reshape / Flatten / Permute", note: "Shape manipulation layers — keep transformations inside the model for correct export." },
          ].map(({ name, note }) => (
            <div key={name} className="flex gap-4 items-start rounded-xl border border-[var(--border-subtle)] p-3">
              <code className="shrink-0 text-xs font-bold text-[var(--text-primary)] w-60">{name}</code>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{note}</p>
            </div>
          ))}
        </div>
      </section>

    </FrameworkLessonLayout>
  );
}