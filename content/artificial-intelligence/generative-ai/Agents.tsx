import {
  ArrowRight,
  Bot,
  Brain,
  Code2,
  Database,
  Eye,
  Headphones,
  Search,
  Users,
  Workflow,
  Wrench,
} from "lucide-react";

const coreComponents = [
  {
    icon: Brain,
    title: "Reasoning model",
    desc: "An LLM that interprets goals, plans steps, and decides what to do next.",
  },
  {
    icon: Eye,
    title: "Perception",
    desc: "Inputs from users, documents, APIs, or sensors that ground the agent in context.",
  },
  {
    icon: Wrench,
    title: "Tools",
    desc: "Functions, APIs, and code the agent can call to take real actions in the world.",
  },
  {
    icon: Database,
    title: "Memory",
    desc: "Short and long-term storage for context, past actions, and learned preferences.",
  },
];

const lifecycle = [
  { step: "01", title: "Perceive", desc: "Receive a goal and gather relevant context." },
  { step: "02", title: "Plan", desc: "Break the goal into ordered, actionable steps." },
  { step: "03", title: "Act", desc: "Call tools, run code, or query data sources." },
  { step: "04", title: "Reflect", desc: "Evaluate results, adjust, and iterate until done." },
];

const agentTypes = [
  {
    icon: Bot,
    title: "Reactive agents",
    desc: "Respond to a single prompt with a tool call. Simple, fast, predictable.",
  },
  {
    icon: Workflow,
    title: "Deliberative agents",
    desc: "Plan multi-step workflows and adapt their plan based on intermediate results.",
  },
  {
    icon: Users,
    title: "Multi-agent systems",
    desc: "Specialized agents collaborate, delegate, and review each other's work.",
  },
];

const useCases = [
  { icon: Search, title: "Research assistants", desc: "Browse, summarize, and synthesize sources." },
  { icon: Code2, title: "Coding agents", desc: "Read repos, write patches, and run tests." },
  {
    icon: Headphones,
    title: "Customer support",
    desc: "Resolve tickets by querying internal systems and applying fixes.",
  },
];

export default function Agents() {
  return (
    <section className="px-12 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] px-5 py-2 text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-secondary)]">
            <span className="inline-block size-2 rounded-full bg-[var(--text-primary)]" />
            A primer on agentic AI
          </div>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl text-[var(--text-primary)]">
            Agents in Generative AI
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--text-secondary)]">
            An AI agent uses a language model as a reasoning engine to plan, use tools, and take
            actions toward a goal — not just produce text.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#what"
              className="inline-flex items-center gap-2 rounded-2xl bg-[var(--text-primary)] px-5 py-3 text-[11px] font-black uppercase tracking-[0.3em] text-[var(--bg-primary)] transition-opacity hover:opacity-90"
            >
              Start reading <ArrowRight className="size-4" />
            </a>
            <a
              href="#use-cases"
              className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              See examples →
            </a>
          </div>
        </div>

        <div id="what" className="mt-20 grid gap-12 border-t border-[var(--border-subtle)] pt-16 sm:grid-cols-12">
          <div className="sm:col-span-4">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-secondary)]">
              01 — Definition
            </p>
            <h2 className="mt-4 text-2xl font-black tracking-tight text-[var(--text-primary)] sm:text-3xl">
              What is an AI agent?
            </h2>
          </div>
          <div className="space-y-5 text-base leading-relaxed text-[var(--text-secondary)] sm:col-span-8">
            <p>
              A traditional generative AI model takes a prompt and returns a response. An{" "}
              <span className="text-[var(--text-primary)] font-semibold">agent</span> goes further:
              it pursues a goal over multiple steps, decides which tools to use, observes results,
              and adapts.
            </p>
            <p>
              Think of the LLM as the brain, tools as the hands, and memory as the notebook. Agents
              close the loop between thinking and doing.
            </p>
          </div>
        </div>

        <div className="mt-16 rounded-[2rem] border border-[var(--border-subtle)] overflow-hidden bg-[var(--bg-secondary)]/30">
          <div className="p-10 sm:p-12">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-secondary)]">
              02 — Anatomy
            </p>
            <h2 className="mt-4 text-2xl font-black tracking-tight text-[var(--text-primary)] sm:text-3xl">
              Core components
            </h2>
            <p className="mt-4 text-[var(--text-secondary)]">
              Most agents are built from four building blocks working together.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {coreComponents.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-[1.5rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-7 sm:p-8 shadow-premium"
                >
                  <Icon className="size-5 text-[var(--text-primary)]" strokeWidth={1.5} />
                  <h3 className="mt-5 text-base font-black tracking-tight text-[var(--text-primary)]">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div id="how" className="mt-16 border-t border-[var(--border-subtle)] pt-16">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-secondary)]">
            03 — Lifecycle
          </p>
          <h2 className="mt-4 text-2xl font-black tracking-tight text-[var(--text-primary)] sm:text-3xl">
            How an agent works
          </h2>
          <p className="mt-4 text-[var(--text-secondary)]">
            Every agent runs some variation of a perceive–plan–act–reflect loop.
          </p>

          <ol className="mt-10 grid gap-10 sm:grid-cols-4">
            {lifecycle.map(({ step, title, desc }) => (
              <li key={step} className="border-t-2 border-[var(--text-primary)] pt-5">
                <p className="text-[10px] font-mono text-[var(--text-secondary)]">{step}</p>
                <h3 className="mt-4 text-base font-black tracking-tight text-[var(--text-primary)]">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{desc}</p>
              </li>
            ))}
          </ol>
        </div>

        <div id="types" className="mt-16 rounded-[2rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30 p-10 sm:p-12">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-secondary)]">
            04 — Taxonomy
          </p>
          <h2 className="mt-4 text-2xl font-black tracking-tight text-[var(--text-primary)] sm:text-3xl">
            Types of agents
          </h2>
          <div className="mt-10 space-y-4">
            {agentTypes.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex items-start gap-5 rounded-[1.5rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-7 sm:p-8 shadow-premium"
              >
                <Icon className="mt-1 size-5 shrink-0 text-[var(--text-primary)]" strokeWidth={1.5} />
                <div>
                  <h3 className="text-base font-black tracking-tight text-[var(--text-primary)]">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div id="use-cases" className="mt-16 border-t border-[var(--border-subtle)] pt-16">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-secondary)]">
            05 — In practice
          </p>
          <h2 className="mt-4 text-2xl font-black tracking-tight text-[var(--text-primary)] sm:text-3xl">
            Where agents shine
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {useCases.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 shadow-premium transition-transform duration-300 hover:-translate-y-1"
              >
                <Icon className="size-5 text-[var(--text-primary)]" strokeWidth={1.5} />
                <h3 className="mt-5 text-base font-black tracking-tight text-[var(--text-primary)]">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 rounded-[2rem] bg-[var(--text-primary)] text-[var(--bg-primary)] p-10 sm:p-12 shadow-premium">
          <h2 className="max-w-3xl text-3xl font-black tracking-tight sm:text-4xl">
            Agents turn language models from answer engines into action engines.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--bg-primary)]/70">
            As reasoning improves and tools get richer, agents will quietly handle more of the
            workflows that used to require humans clicking through software.
          </p>
        </div>
      </div>
    </section>
  );
}
