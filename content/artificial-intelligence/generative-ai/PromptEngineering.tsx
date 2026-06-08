function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/40 px-2 py-1 font-mono text-[0.9em] text-[var(--text-primary)]">
      {children}
    </code>
  );
}

function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre className="mt-4 overflow-x-auto rounded-[1.25rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/25 p-5 text-xs leading-relaxed text-[var(--text-secondary)]">
      <code className="font-mono">{children}</code>
    </pre>
  );
}

export default function PromptEngineering() {
  return (
    <section className="px-12 py-24">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] px-5 py-2 text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-secondary)]">
            <span className="inline-block size-2 rounded-full bg-[var(--text-primary)]" />
            Generative AI
          </div>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl text-[var(--text-primary)]">
            Prompt Engineering
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-[var(--text-secondary)]">
            Prompt engineering is the craft of converting intent into reliable model behavior.
            Think of it as designing the “program” a language model runs: instructions, constraints,
            context, and examples—packaged so the model can follow them consistently.
          </p>
        </header>

        <div className="mt-16 grid gap-10 sm:grid-cols-12">
          <div className="sm:col-span-7 space-y-10">
            <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
              <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
                The core mental model
              </h2>
              <ul className="mt-6 space-y-3 text-[var(--text-secondary)] leading-relaxed">
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">You’re not “asking”:</span>{" "}
                  you’re specifying a task interface. Make inputs/outputs explicit.
                </li>
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">Models pattern-match:</span>{" "}
                  show the pattern you want (format + examples) and they’ll imitate it.
                </li>
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">Reliability comes from structure:</span>{" "}
                  separate instructions, context, and constraints so the model can’t confuse them.
                </li>
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">Token budget is real:</span>{" "}
                  include only the context that changes the decision.
                </li>
              </ul>
            </section>

            <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
              <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
                A good prompt has 5 parts
              </h2>
              <p className="mt-5 text-[var(--text-secondary)] leading-relaxed">
                You can treat prompts like a template with stable sections. Use headings or
                delimiters so the model doesn’t blend your policy, context, and user content.
              </p>
              <ol className="mt-6 space-y-4 list-decimal pl-5 text-[var(--text-secondary)]">
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">Role:</span> what the
                  assistant should be (reviewer, tutor, debugger).
                </li>
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">Objective:</span> the
                  success criteria in plain language.
                </li>
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">Context:</span> the
                  relevant data (docs, constraints, examples).
                </li>
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">Rules:</span>{" "}
                  boundaries—what to avoid, how to handle uncertainty, what to ask.
                </li>
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">Output format:</span>{" "}
                  the exact shape you want (JSON schema, bullet list, table).
                </li>
              </ol>
              <CodeBlock>{`ROLE
- You are a careful technical writer.

OBJECTIVE
- Convert the notes into a clean lesson.

CONTEXT
- Notes: \"\"\" ... \"\"\"

RULES
- If information is missing, ask 1 clarifying question.
- Do not invent citations.

OUTPUT
- Return Markdown with: title, summary, sections, checklist.`}</CodeBlock>
            </section>

            <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
              <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
                High-leverage patterns
              </h2>
              <div className="mt-6 space-y-8">
                <div>
                  <h3 className="text-lg font-black tracking-tight text-[var(--text-primary)]">
                    1) Constrain the space
                  </h3>
                  <p className="mt-3 text-[var(--text-secondary)] leading-relaxed">
                    Tell the model what it must use and what it must not use. If you have a
                    reference document, instruct “answer only from the reference” and define a
                    fallback behavior when the reference is insufficient.
                  </p>
                  <CodeBlock>{`Use ONLY the reference text below.
If the answer is not in the reference, say: \"Not found in reference.\"

REFERENCE:
\"\"\" ... \"\"\"`}</CodeBlock>
                </div>

                <div>
                  <h3 className="text-lg font-black tracking-tight text-[var(--text-primary)]">
                    2) Few-shot the format
                  </h3>
                  <p className="mt-3 text-[var(--text-secondary)] leading-relaxed">
                    Provide 1–3 examples of the exact output format. This helps more than long
                    explanations.
                  </p>
                  <CodeBlock>{`Convert each item into JSON.

Example input:
\"Fix login bug\"
Example output:
{\"title\":\"Fix login bug\",\"type\":\"bug\",\"priority\":\"high\"}

Now convert:
\"Add multimodal lesson\"`}</CodeBlock>
                </div>

                <div>
                  <h3 className="text-lg font-black tracking-tight text-[var(--text-primary)]">
                    3) Ask for checks, not thoughts
                  </h3>
                  <p className="mt-3 text-[var(--text-secondary)] leading-relaxed">
                    Instead of “think step-by-step”, request a short checklist the model must
                    satisfy. It improves consistency without requiring the model to expose private
                    reasoning.
                  </p>
                  <CodeBlock>{`Before answering, verify:
1) You followed the output schema.
2) You included all required fields.
3) You did not add assumptions.
Then provide the final answer only.`}</CodeBlock>
                </div>

                <div>
                  <h3 className="text-lg font-black tracking-tight text-[var(--text-primary)]">
                    4) Use “fields” for tool usage
                  </h3>
                  <p className="mt-3 text-[var(--text-secondary)] leading-relaxed">
                    When building agentic systems, treat the prompt as an API. Add explicit fields
                    like <InlineCode>tools</InlineCode>, <InlineCode>inputs</InlineCode>,{" "}
                    <InlineCode>constraints</InlineCode>, and <InlineCode>expected_output</InlineCode>{" "}
                    to make calls predictable.
                  </p>
                  <CodeBlock>{`Return JSON:
{
  \"needs_tool\": boolean,
  \"tool_name\": \"search\" | \"calculator\" | null,
  \"tool_args\": object | null,
  \"final_answer\": string
}`}</CodeBlock>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
              <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
                Reduce hallucinations (practical)
              </h2>
              <p className="mt-5 text-[var(--text-secondary)] leading-relaxed">
                You can’t “prompt” your way out of uncertainty, but you can make the model admit it
                earlier and verify claims more often.
              </p>
              <ul className="mt-6 space-y-3 text-[var(--text-secondary)] leading-relaxed">
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">Demand sources:</span>{" "}
                  “quote from the provided reference” (or explicitly say “no sources available”).
                </li>
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">Force abstention:</span>{" "}
                  “If unknown, say ‘I don’t know’ and ask one question.”
                </li>
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">Split tasks:</span>{" "}
                  extraction first, then reasoning. (e.g., “extract facts → then answer”.)
                </li>
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">Use retrieval:</span>{" "}
                  for real-world facts, prefer RAG over stuffing everything into the prompt.
                </li>
              </ul>
              <CodeBlock>{`Answer using ONLY the \"FACTS\" list.
If FACTS is insufficient, respond with:
1) \"Insufficient facts.\"
2) The single most important missing fact you need.

FACTS:
- ...`}</CodeBlock>
            </section>
          </div>

          <aside className="sm:col-span-5 space-y-6">
            <div className="rounded-[2rem] bg-[var(--bg-secondary)]/30 border border-[var(--border-subtle)] p-8 sm:p-10">
              <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-secondary)]">
                prompt_template
              </div>
              <h2 className="mt-4 text-xl font-black tracking-tight text-[var(--text-primary)]">
                Copy-paste prompt
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                Use this as a default starting point for most tasks. It’s short, structured, and
                forces clarity.
              </p>
              <CodeBlock>{`ROLE
- You are a helpful assistant.

TASK
- ...

CONTEXT
- ...

CONSTRAINTS
- If you are unsure, say so.
- Do not invent facts.

OUTPUT FORMAT
- ...`}</CodeBlock>
            </div>

            <div className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
              <h2 className="text-xl font-black tracking-tight text-[var(--text-primary)]">
                Common mistakes
              </h2>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">Vague success:</span>{" "}
                  “make it good” with no rubric.
                </li>
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">Mixed content:</span>{" "}
                  instructions and user text are not separated.
                </li>
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">No format:</span>{" "}
                  the model chooses its own structure.
                </li>
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">Too much context:</span>{" "}
                  irrelevant paste reduces quality.
                </li>
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">No evaluation:</span>{" "}
                  you don’t check outputs against examples.
                </li>
              </ul>
            </div>

            <div className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
              <h2 className="text-xl font-black tracking-tight text-[var(--text-primary)]">
                A lightweight evaluation loop
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                Prompt engineering becomes real when you treat prompts like code: test on a small
                set of representative inputs, compare to a rubric, iterate.
              </p>
              <ol className="mt-5 space-y-3 text-sm leading-relaxed text-[var(--text-secondary)] list-decimal pl-5">
                <li>Collect 10–30 real examples.</li>
                <li>Define a rubric (correctness, format, safety, tone).</li>
                <li>Run the prompt on all examples.</li>
                <li>Fix the biggest failure mode first.</li>
                <li>Lock the prompt and version it.</li>
              </ol>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
