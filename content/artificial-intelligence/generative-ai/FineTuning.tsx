export default function FineTuning() {
  return (
    <section className="px-12 py-24">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] px-5 py-2 text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-secondary)]">
            <span className="inline-block size-2 rounded-full bg-[var(--text-primary)]" />
            Generative AI
          </div>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl text-[var(--text-primary)]">
            Fine-Tuning
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-[var(--text-secondary)]">
            Fine-tuning allows a pre-trained model to adapt to a new task. This approach uses the
            knowledge gained from training a model on a large dataset and applying it to a smaller,
            domain-specific dataset. Fine-tuning involves adjusting the weights of the model&apos;s
            layers or updating certain parts of the model to improve its performance on the new
            task.
          </p>
        </header>

        <div className="mt-16 grid gap-10 sm:grid-cols-12">
          <div className="sm:col-span-7 space-y-10">
            <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
              <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
                Transfer learning mindset
              </h2>
              <p className="mt-5 text-[var(--text-secondary)] leading-relaxed">
                Fine-tuning is used in transfer learning where a model trained on one similar task
                is reused for another task often with minimal changes. The underlying assumption is
                that the model has already learned useful features in the original task that can be
                transferred and adapted to the new task, hence reducing the need for training a
                model from scratch.
              </p>
            </section>

            <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
              <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
                Working of fine-tuning
              </h2>
              <p className="mt-4 text-[var(--text-secondary)] leading-relaxed">
                Fine-tuning typically involves the following steps:
              </p>
              <ol className="mt-6 space-y-4 list-decimal pl-5 text-[var(--text-secondary)]">
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">
                    Select a pre-trained model:
                  </span>{" "}
                  Choose a model trained on a large, diverse dataset (e.g., BERT for NLP, VGG/ResNet
                  for image tasks, GPT-style models for text generation).
                </li>
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">
                    Freeze initial layers:
                  </span>{" "}
                  Earlier layers capture general features (edges/textures in images, basic language
                  patterns in text). Freezing them reduces compute by training fewer parameters.
                </li>
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">
                    Update later layers:
                  </span>{" "}
                  Later layers specialize; fine-tune them to the new task (e.g., sentiment analysis
                  head for a language model).
                </li>
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">
                    Use a smaller learning rate:
                  </span>{" "}
                  Adjust weights gently so pretrained knowledge isn&apos;t overwritten.
                </li>
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">
                    Evaluate and refine:
                  </span>{" "}
                  Check performance, then tune learning rate, unfreeze more layers, or adjust data
                  augmentation until results stabilize.
                </li>
              </ol>
            </section>

            <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
              <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
                Applications
              </h2>
              <ul className="mt-6 space-y-3 text-[var(--text-secondary)]">
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">Domain adaptation:</span>{" "}
                  adapt a general pretrained model (e.g., GPT, BERT) to medical, legal, or finance.
                </li>
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">Task specialization:</span>{" "}
                  improve performance on sentiment analysis, QA, or NER.
                </li>
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">
                    Language/style customization:
                  </span>{" "}
                  support specific languages, dialects, or writing styles.
                </li>
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">Personalization:</span>{" "}
                  reflect user preferences, vocabulary, or tone.
                </li>
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">Data efficiency:</span>{" "}
                  teach new knowledge from a small dataset without training from scratch.
                </li>
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">Edge deployment:</span>{" "}
                  compress and fine-tune smaller models for mobile/IoT.
                </li>
              </ul>
            </section>
          </div>

          <aside className="sm:col-span-5 space-y-6">
            <div className="rounded-[2rem] bg-[var(--bg-secondary)]/30 border border-[var(--border-subtle)] p-8 sm:p-10">
              <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-secondary)]">
                training_deep_learning_model
              </div>
              <h2 className="mt-4 text-xl font-black tracking-tight text-[var(--text-primary)]">
                Visual intuition
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                Big dataset → learn general features → reuse common layers → fine-tune custom layers
                on a small dataset for your target task.
              </p>
              <div className="mt-6 rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-6">
                <div className="text-xs font-black uppercase tracking-[0.3em] text-[var(--text-secondary)]">
                  Diagram placeholder
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                  If you want, I can add your diagram as an image asset (e.g.{" "}
                  <span className="font-mono">public/images/fine-tuning/transfer-learning.png</span>)
                  and render it here.
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
              <h2 className="text-xl font-black tracking-tight text-[var(--text-primary)]">
                Advantages
              </h2>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">
                    Limited dataset:
                  </span>{" "}
                  achieve strong performance with fewer examples.
                </li>
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">
                    Domain-specific expertise:
                  </span>{" "}
                  adapt to specialized data (legal/medical) for better accuracy.
                </li>
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">Saves time:</span>{" "}
                  faster than training from scratch for time-sensitive projects.
                </li>
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">
                    Better generalization:
                  </span>{" "}
                  reduces overfitting risk compared to training only on tiny datasets.
                </li>
              </ul>
            </div>

            <div className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
              <h2 className="text-xl font-black tracking-tight text-[var(--text-primary)]">
                Challenges
              </h2>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">Overfitting:</span>{" "}
                  still possible if the new dataset is too small or lacks diversity.
                </li>
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">
                    Computational constraints:
                  </span>{" "}
                  large models can still be expensive to fine-tune.
                </li>
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">
                    Choosing layers to tune:
                  </span>{" "}
                  deciding what to freeze vs train can be tricky and model-dependent.
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
