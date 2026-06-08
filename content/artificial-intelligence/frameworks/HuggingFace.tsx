import FrameworkLessonLayout, {
  type FrameworkLessonMeta,
} from "@/components/frameworks/FrameworkLessonLayout";

const meta: FrameworkLessonMeta = {
  subjectId: "artificial-intelligence",
  topicId: "frameworks",
  lessonId: "HuggingFace",
  title: "Hugging Face",
  tagline:
    "Hugging Face is an ecosystem for using, training, and sharing ML models—especially transformers—through a model hub plus libraries like Transformers, Datasets, and Tokenizers.",
  install: {
    steps: [
      "Create a virtual environment (recommended) and activate it.",
      "Install: `pip install transformers datasets tokenizers accelerate`.",
      "If you train, install a backend: PyTorch or TensorFlow.",
    ],
    notes: [
      "For GPU training, install a CUDA-enabled PyTorch build. CPU-only is fine for demos.",
      "Many workflows download model weights; expect a first-run network + disk hit.",
    ],
  },
  helloWorld: {
    code: `from transformers import pipeline

clf = pipeline("sentiment-analysis")
print(clf("I love clean interfaces and fast iterations."))`,
    notes: ["`pipeline(...)` is the fastest on-ramp; later you'll control tokenizers/models directly."],
  },
  bestFor: [
    "Running strong pretrained transformer baselines quickly.",
    "Fine-tuning and evaluating NLP/multimodal models.",
    "Sharing models and datasets reproducibly (Hub + cards).",
  ],
  notFor: [
    "Pure classical ML without transformers (use scikit-learn).",
    "Low-level tensor math (use NumPy), or ETL (use Pandas).",
  ],
  pitfalls: [
    "Version mismatches between Transformers, PyTorch/TF, and CUDA builds.",
    "Out-of-memory errors on GPUs; start with smaller models or smaller batch sizes.",
    "Tokenizer/model mismatch (wrong checkpoint family). Always load both from the same model id.",
    "Assuming `pipeline` defaults match your task (labels, truncation, max_length).",
  ],
  related: [
    {
      title: "PyTorch",
      href: "/curriculum/artificial-intelligence/frameworks/PyTorch",
      desc: "Common backend for training and fine-tuning.",
    },
    {
      title: "TensorFlow",
      href: "/curriculum/artificial-intelligence/frameworks/TensorFlow",
      desc: "Alternative backend; some HF workflows support TF.",
    },
    {
      title: "Pandas",
      href: "/curriculum/artificial-intelligence/frameworks/Pandas",
      desc: "For cleaning datasets before tokenization and training.",
    },
  ],
  prev: { title: "TensorFlow", lessonId: "TensorFlow" },
  next: { title: "NumPy", lessonId: "NumPy" },
};

// ── Code snippets as plain JS strings (no JSX escaping issues) ──────────────

const CODE_AUTO_MODEL = `from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

model_id = "distilbert-base-uncased-finetuned-sst-2-english"

tokenizer = AutoTokenizer.from_pretrained(model_id)
model     = AutoModelForSequenceClassification.from_pretrained(model_id)

inputs  = tokenizer("Hugging Face makes ML accessible.", return_tensors="pt")
outputs = model(**inputs)
probs   = torch.softmax(outputs.logits, dim=-1)
label   = model.config.id2label[probs.argmax().item()]
print(label, probs.max().item())`;

const CODE_DATASET = `from datasets import load_dataset, DatasetDict

ds = load_dataset("imdb")          # DatasetDict with train/test splits
print(ds["train"][0])              # {'text': '...', 'label': 1}

# Tokenize the whole split in parallel (fast Rust tokenizer)
def tokenize(batch):
    return tokenizer(batch["text"], truncation=True, padding="max_length")

tokenized = ds.map(tokenize, batched=True, num_proc=4)`;

const CODE_TRAINER = `from transformers import TrainingArguments, Trainer
import numpy as np
from evaluate import load as load_metric

accuracy = load_metric("accuracy")

def compute_metrics(eval_pred):
    logits, labels = eval_pred
    preds = np.argmax(logits, axis=-1)
    return accuracy.compute(predictions=preds, references=labels)

args = TrainingArguments(
    output_dir="./results",
    num_train_epochs=3,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=32,
    evaluation_strategy="epoch",
    save_strategy="epoch",
    load_best_model_at_end=True,
    logging_dir="./logs",
)

trainer = Trainer(
    model=model,
    args=args,
    train_dataset=tokenized["train"],
    eval_dataset=tokenized["test"],
    compute_metrics=compute_metrics,
)

trainer.train()`;

const CODE_LORA = `from peft import LoraConfig, get_peft_model, TaskType

lora_cfg = LoraConfig(
    task_type=TaskType.SEQ_CLS,
    r=8,               # rank of the low-rank matrices
    lora_alpha=16,     # scaling factor
    lora_dropout=0.1,
    target_modules=["q_lin", "v_lin"],
)

peft_model = get_peft_model(model, lora_cfg)
peft_model.print_trainable_parameters()
# trainable params: 294,912 || all params: 66,955,010 || trainable%: 0.44

trainer = Trainer(model=peft_model, args=args, ...)`;

const CODE_PUSH = `# Authenticate once in terminal:  huggingface-cli login

trainer.push_to_hub("my-org/distilbert-sst2-finetuned")

# Or push individually:
model.push_to_hub("my-org/my-model")
tokenizer.push_to_hub("my-org/my-model")`;

const CODE_ACCELERATE = `from accelerate import Accelerator

accelerator = Accelerator()

model, optimizer, train_dl, eval_dl = accelerator.prepare(
    model, optimizer, train_dataloader, eval_dataloader
)

for batch in train_dl:
    outputs = model(**batch)
    loss = outputs.loss
    accelerator.backward(loss)
    optimizer.step()
    optimizer.zero_grad()`;

const CODE_DATASETS_OPS = `from datasets import load_dataset, DatasetDict, Dataset

# Load
ds = load_dataset("glue", "mrpc")
ds = load_dataset("csv", data_files={"train": "train.csv", "test": "test.csv"})
ds = load_dataset("json", data_files="data.jsonl")

# Inspect
print(ds)
print(ds["train"].features)

# Select / filter
small    = ds["train"].select(range(1000))
filtered = ds["train"].filter(lambda x: len(x["text"]) > 50)

# Map (batched for speed)
def preprocess(batch):
    return tokenizer(batch["sentence1"], batch["sentence2"],
                     truncation=True, padding="max_length")

encoded = ds.map(preprocess, batched=True,
                 remove_columns=["sentence1","sentence2","idx"])
encoded.set_format("torch", columns=["input_ids","attention_mask","label"])

# Save / load from disk
encoded.save_to_disk("./encoded_mrpc")
reloaded = DatasetDict.load_from_disk("./encoded_mrpc")`;

const CODE_EVALUATE = `from evaluate import load, combine

# Single metric
rouge = load("rouge")
results = rouge.compute(
    predictions=["The quick brown fox"],
    references=["The fast brown fox jumps"]
)
print(results)  # {'rouge1': 0.8, 'rouge2': 0.5, 'rougeL': 0.8, ...}

# Multiple metrics at once
clf_metrics = combine(["accuracy", "f1", "precision", "recall"])
clf_metrics.add_batch(predictions=[0,1,1,0], references=[0,1,0,0])
print(clf_metrics.compute())`;

const CODE_HUB_CLIENT = `from huggingface_hub import hf_hub_download, list_models, snapshot_download

# Download a single file
path = hf_hub_download(repo_id="bert-base-uncased", filename="config.json")

# Clone the whole repo (useful for non-Transformers models)
snapshot_download(repo_id="stabilityai/stable-diffusion-2-1", local_dir="./sd21")

# Search the Hub
models = list_models(filter="text-classification", sort="downloads", limit=5)
for m in models:
    print(m.modelId, m.downloads)`;

const CODE_SPACES = `# app.py  (push this file + requirements.txt to your Space repo)
import gradio as gr
from transformers import pipeline

pipe = pipeline("sentiment-analysis")

def predict(text):
    result = pipe(text)[0]
    return f"{result['label']} ({result['score']:.2%})"

gr.Interface(fn=predict, inputs="text", outputs="text").launch()`;

// ── Sub-components ───────────────────────────────────────────────────────────

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="mt-4 rounded-xl bg-[var(--bg-secondary)]/60 border border-[var(--border-subtle)] p-5 text-xs leading-relaxed overflow-x-auto text-[var(--text-primary)]">
      <code>{code}</code>
    </pre>
  );
}

function SectionCard({ title, desc }: { title: string; desc: string }) {
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

export default function HuggingFace() {
  return (
    <FrameworkLessonLayout meta={meta}>

      {/* When to use */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          When to use it
        </h2>
        <ul className="mt-5 space-y-3 text-[var(--text-secondary)]">
          <li>Quickly download and run a strong baseline model.</li>
          <li>Fine-tune a pretrained model on your dataset.</li>
          <li>Share models, datasets, and demos reproducibly.</li>
          <li>Run multi-modal tasks (text, image, audio, video) with a single unified API.</li>
          <li>Evaluate model performance with standardised benchmark suites.</li>
        </ul>
      </section>

      {/* Core building blocks */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Core building blocks
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            { title: "Model Hub", desc: "Hosted models with versioned weights, configs, and cards. Search 500k+ public checkpoints; push your own with huggingface_hub." },
            { title: "Transformers", desc: "High-level APIs for inference and training across tasks: NLP, vision, speech, multimodal. Supports PyTorch, TensorFlow, and JAX." },
            { title: "Datasets", desc: "Dataset loading, preprocessing, caching, and streaming. Memory-mapped Arrow format keeps RAM usage low even for huge corpora." },
            { title: "Tokenizers", desc: "Fast Rust-backed tokenization aligned with pretrained model vocabularies. Handles BPE, WordPiece, Unigram, and SentencePiece." },
            { title: "Accelerate", desc: "Minimal wrapper to run the same PyTorch training loop on CPU, multi-GPU, or TPU without rewriting your code." },
            { title: "PEFT", desc: "Parameter-Efficient Fine-Tuning methods (LoRA, Prefix Tuning, Adapter layers) that fine-tune large models with a fraction of the compute." },
            { title: "Evaluate", desc: "Standardised metric implementations (BLEU, F1, Accuracy, ROUGE) with consistent interfaces across tasks." },
            { title: "Spaces", desc: "Free hosting for Gradio or Streamlit demos backed by your Hub models — shareable links with zero DevOps." },
          ].map(({ title, desc }) => (
            <SectionCard key={title} title={title} desc={desc} />
          ))}
        </div>
      </section>

      {/* Mental model */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">Mental model</h2>
        <p className="mt-4 text-[var(--text-secondary)] leading-relaxed">
          Treat Hugging Face as a package manager for models + the runtime tooling to use them.
          You pick a checkpoint, load it with the right tokenizer, and run inference or fine-tuning
          with a trainer.
        </p>
        <p className="mt-4 text-[var(--text-secondary)] leading-relaxed">
          Every workflow follows the same three-step pattern:{" "}
          <strong className="text-[var(--text-primary)]">checkpoint → tokenizer → model</strong>.
          The checkpoint ID (e.g. <code>bert-base-uncased</code>) is the single source of truth;
          passing it to both <code>AutoTokenizer.from_pretrained()</code> and{" "}
          <code>AutoModel.from_pretrained()</code> guarantees they always match.
        </p>
      </section>

      {/* Pipeline tasks */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Pipeline tasks at a glance
        </h2>
        <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed">
          <code>pipeline(task)</code> selects a sensible default model. Pass an explicit{" "}
          <code>model=</code> argument to override.
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm text-left text-[var(--text-secondary)] border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-subtle)]">
                <th className="py-3 pr-6 font-black text-[var(--text-primary)] uppercase tracking-wider text-xs">Task string</th>
                <th className="py-3 pr-6 font-black text-[var(--text-primary)] uppercase tracking-wider text-xs">What it does</th>
                <th className="py-3 font-black text-[var(--text-primary)] uppercase tracking-wider text-xs">Example model</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {[
                ["sentiment-analysis", "Classify text sentiment (pos/neg/neutral)", "distilbert-base-uncased-finetuned-sst-2-english"],
                ["text-generation", "Auto-regressively generate text", "gpt2"],
                ["text2text-generation", "Seq2seq: summarise, translate, Q&A", "t5-small"],
                ["fill-mask", "Predict masked tokens in a sentence", "bert-base-uncased"],
                ["question-answering", "Extract an answer span from a passage", "deepset/roberta-base-squad2"],
                ["summarization", "Compress long text to a shorter summary", "facebook/bart-large-cnn"],
                ["translation", "Translate between language pairs", "Helsinki-NLP/opus-mt-en-fr"],
                ["ner", "Named-entity recognition", "dbmdz/bert-large-cased-finetuned-conll03-english"],
                ["zero-shot-classification", "Classify without task-specific training", "facebook/bart-large-mnli"],
                ["image-classification", "Classify an image into categories", "google/vit-base-patch16-224"],
                ["object-detection", "Bounding-box detection in images", "facebook/detr-resnet-50"],
                ["automatic-speech-recognition", "Transcribe audio to text", "openai/whisper-base"],
              ].map(([task, desc, model]) => (
                <tr key={task}>
                  <td className="py-3 pr-6 font-mono text-xs text-[var(--text-primary)]">{task}</td>
                  <td className="py-3 pr-6">{desc}</td>
                  <td className="py-3 font-mono text-xs opacity-70">{model}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Key code patterns */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Key code patterns
        </h2>

        <div className="mt-6 space-y-8">
          <div>
            <h3 className="text-base font-black text-[var(--text-primary)]">1 · Tokenizer + Model directly</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
              Use <code>Auto*</code> classes whenever you do not know the exact architecture ahead
              of time — they inspect the config and load the right class automatically.
            </p>
            <CodeBlock code={CODE_AUTO_MODEL} />
          </div>

          <div>
            <h3 className="text-base font-black text-[var(--text-primary)]">2 · Loading a dataset</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
              <code>load_dataset</code> downloads, caches, and memory-maps the data as Apache Arrow.
              Use <code>streaming=True</code> for datasets that do not fit in RAM.
            </p>
            <CodeBlock code={CODE_DATASET} />
          </div>

          <div>
            <h3 className="text-base font-black text-[var(--text-primary)]">3 · Fine-tuning with Trainer</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
              <code>Trainer</code> handles the training loop, gradient accumulation, evaluation,
              checkpointing, and logging to TensorBoard / W&amp;B with zero boilerplate.
            </p>
            <CodeBlock code={CODE_TRAINER} />
          </div>

          <div>
            <h3 className="text-base font-black text-[var(--text-primary)]">4 · LoRA fine-tuning with PEFT</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
              LoRA freezes the base model and injects trainable low-rank matrices into attention
              layers. You typically train under 1% of parameters, making it feasible on a single GPU.
            </p>
            <CodeBlock code={CODE_LORA} />
          </div>

          <div>
            <h3 className="text-base font-black text-[var(--text-primary)]">5 · Pushing to the Hub</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
              Share your fine-tuned model (weights + tokenizer + config + model card) in one call.
              The repo is versioned with Git-LFS under the hood.
            </p>
            <CodeBlock code={CODE_PUSH} />
          </div>

          <div>
            <h3 className="text-base font-black text-[var(--text-primary)]">6 · Multi-GPU training with Accelerate</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
              Wrap your existing training loop with <code>Accelerator</code>. No conditional{" "}
              <code>if cuda</code> blocks — the same script runs on a laptop or an 8-GPU node.
            </p>
            <CodeBlock code={CODE_ACCELERATE} />
          </div>
        </div>
      </section>

      {/* Auto class cheat-sheet */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Auto class cheat-sheet
        </h2>
        <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed">
          Always prefer <code>Auto*</code> over architecture-specific classes unless you are
          deliberately targeting a single architecture.
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm text-left text-[var(--text-secondary)] border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-subtle)]">
                <th className="py-3 pr-8 font-black text-[var(--text-primary)] uppercase tracking-wider text-xs">Class</th>
                <th className="py-3 font-black text-[var(--text-primary)] uppercase tracking-wider text-xs">Use for</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {[
                ["AutoTokenizer", "Any tokenizer matching the checkpoint"],
                ["AutoConfig", "Inspect hyperparams without loading weights"],
                ["AutoModel", "Bare model — raw hidden states, no task head"],
                ["AutoModelForSequenceClassification", "Text classification / regression"],
                ["AutoModelForTokenClassification", "NER, POS tagging"],
                ["AutoModelForQuestionAnswering", "Extractive QA (span prediction)"],
                ["AutoModelForSeq2SeqLM", "Summarisation, translation, T5-style tasks"],
                ["AutoModelForCausalLM", "GPT-style auto-regressive generation"],
                ["AutoModelForMaskedLM", "BERT-style masked-language modelling"],
                ["AutoModelForImageClassification", "Vision classification"],
                ["AutoModelForSpeechSeq2Seq", "ASR (e.g. Whisper)"],
                ["AutoProcessor", "Multimodal (image+text, audio+text) preprocessing"],
              ].map(([cls, desc]) => (
                <tr key={cls}>
                  <td className="py-3 pr-8 font-mono text-xs text-[var(--text-primary)]">{cls}</td>
                  <td className="py-3 text-sm">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Tokenizer internals */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Tokenizer internals you need to know
        </h2>
        <div className="mt-6 space-y-5 text-sm text-[var(--text-secondary)] leading-relaxed">
          {[
            {
              title: "Token IDs vs tokens vs text",
              body: "The tokenizer splits text into sub-word tokens, maps them to integer IDs, and optionally adds special tokens ([CLS], [SEP], etc.). Decode with tokenizer.decode(ids, skip_special_tokens=True).",
            },
            {
              title: "Padding and truncation",
              body: 'padding="longest" pads to the longest sequence in the batch. padding="max_length" pads to the model\'s maximum context window. truncation=True silently drops tokens beyond max_length — always set it explicitly.',
            },
            {
              title: "Return tensors",
              body: 'Pass return_tensors="pt" for PyTorch, "tf" for TensorFlow, or "np" for NumPy. Omit it for plain Python lists (useful for inspection).',
            },
            {
              title: "Attention mask",
              body: "The tokenizer automatically produces attention_mask tensors (1 = real token, 0 = padding). Always pass the mask to the model so padding tokens are ignored during attention.",
            },
            {
              title: "Fast vs slow tokenizers",
              body: "HuggingFace ships both a Rust-backed fast tokenizer and a Python slow one. The fast version is 10-100x faster and required for some post-processing features (offset mapping for NER, word IDs). It is loaded by default when available.",
            },
          ].map(({ title, body }) => (
            <div key={title}>
              <h3 className="font-black text-[var(--text-primary)]">{title}</h3>
              <p className="mt-1">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Datasets deep-dive */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Datasets — common operations
        </h2>
        <CodeBlock code={CODE_DATASETS_OPS} />
      </section>

      {/* Evaluate */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Evaluating models
        </h2>
        <CodeBlock code={CODE_EVALUATE} />
      </section>

      {/* Hub and Spaces */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Hub and Spaces workflow
        </h2>
        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-base font-black text-[var(--text-primary)]">Model cards</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
              A <code>README.md</code> with YAML front-matter becomes your model card. Declare{" "}
              <code>language</code>, <code>license</code>, <code>tags</code>,{" "}
              <code>datasets</code>, and <code>metrics</code> so the Hub can index and filter
              your model correctly.
            </p>
          </div>
          <div>
            <h3 className="text-base font-black text-[var(--text-primary)]">huggingface_hub client</h3>
            <CodeBlock code={CODE_HUB_CLIENT} />
          </div>
          <div>
            <h3 className="text-base font-black text-[var(--text-primary)]">Spaces (Gradio demo)</h3>
            <CodeBlock code={CODE_SPACES} />
          </div>
        </div>
      </section>

      {/* Common pitfalls */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Common pitfalls — in depth
        </h2>
        <div className="mt-6 space-y-5 text-sm text-[var(--text-secondary)] leading-relaxed">
          {[
            {
              title: "Tokenizer / model mismatch",
              body: "Loading a GPT-2 tokenizer with a BERT model produces silently wrong results. Always use the same checkpoint ID for both. If in doubt, check model.config._name_or_path.",
            },
            {
              title: "CUDA out-of-memory",
              body: "Reduce per_device_train_batch_size, enable gradient checkpointing (model.gradient_checkpointing_enable()), or use fp16=True in TrainingArguments. LoRA / PEFT is often the cleanest solution for large models.",
            },
            {
              title: "pipeline default model changes",
              body: "Hugging Face occasionally changes the default model behind a pipeline task. Pin an explicit model= argument in production to avoid silent regressions after package upgrades.",
            },
            {
              title: "Slow tokenisation in .map()",
              body: "Run .map() with batched=True and num_proc > 1. The fast tokenizer processes thousands of sequences per second; the slow one is orders of magnitude slower at scale.",
            },
            {
              title: "Forgetting model.eval() at inference",
              body: "Dropout and batch-normalisation layers behave differently in training vs eval mode. Always call model.eval() before inference and wrap with torch.no_grad() to save memory.",
            },
            {
              title: "Version incompatibilities",
              body: "Pin versions in requirements.txt: transformers, datasets, tokenizers, accelerate, and your PyTorch/CUDA build must be mutually compatible. The HF release notes list known constraints.",
            },
          ].map(({ title, body }) => (
            <div key={title}>
              <h3 className="font-black text-[var(--text-primary)]">{title}</h3>
              <p className="mt-1">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick-reference */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Quick-reference
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            { label: "Docs", href: "https://huggingface.co/docs/transformers", text: "huggingface.co/docs/transformers" },
            { label: "Model Hub", href: "https://huggingface.co/models", text: "huggingface.co/models" },
            { label: "Datasets Hub", href: "https://huggingface.co/datasets", text: "huggingface.co/datasets" },
            { label: "Spaces", href: "https://huggingface.co/spaces", text: "huggingface.co/spaces" },
            { label: "PEFT docs", href: "https://huggingface.co/docs/peft", text: "huggingface.co/docs/peft" },
            { label: "Evaluate docs", href: "https://huggingface.co/docs/evaluate", text: "huggingface.co/docs/evaluate" },
            { label: "Accelerate docs", href: "https://huggingface.co/docs/accelerate", text: "huggingface.co/docs/accelerate" },
            { label: "Course (free)", href: "https://huggingface.co/learn/nlp-course", text: "huggingface.co/learn/nlp-course" },
          ].map(({ label, href, text }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 rounded-[1.5rem] bg-[var(--bg-secondary)]/40 border border-[var(--border-subtle)] p-5 hover:border-[var(--border-emphasis)] transition-colors"
            >
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[var(--text-primary)] mt-0.5 w-20 shrink-0">
                {label}
              </span>
              <span className="text-xs text-[var(--text-secondary)] font-mono break-all">{text}</span>
            </a>
          ))}
        </div>
      </section>

    </FrameworkLessonLayout>
  );
}