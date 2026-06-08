"use client";

import Head from "next/head";

export default function RAG() {
  return (
    <>
      <Head>
        <title>Retrieval‑Augmented Generation (RAG)</title>
        <meta name="description" content="Learn the architecture of Retrieval‑Augmented Generation (RAG) with a detailed visual diagram." />
      </Head>
      <section className="px-12 py-24 flex flex-col items-center bg-primary text-primary">
        <h1 className="text-3xl font-semibold mb-6">Retrieval‑Augmented Generation (RAG)</h1>
        <p className="max-w-3xl text-base mb-8" style={{ color: "var(--color-text-secondary)" }}>
  Retrieval‑augmented generation (RAG) is a technique that enables large language models (LLMs) to retrieve and incorporate new information from external data sources.<sup>[1]</sup> With RAG, LLMs first refer to a specified set of documents, then respond to user queries. These documents supplement information from the LLM's pre‑existing training data.<sup>[2]</sup> This allows LLMs to use domain‑specific and/or updated information that is not available in the training data.<sup>[2]</sup> For example, this enables LLM‑based chatbots to access internal company data or generate responses based on authoritative sources.
</p>

<h2 className="text-2xl font-semibold mb-4 mt-6" style={{ color: "var(--color-text-primary)" }}>Why RAG improves LLMs</h2>
<p className="max-w-3xl text-base mb-8" style={{ color: "var(--color-text-secondary)" }}>
  RAG improves LLMs by incorporating information retrieval before generating responses.<sup>[3]</sup> Unlike LLMs that rely on static training data, RAG pulls relevant text from databases, uploaded documents, or web sources.<sup>[1]</sup> According to Ars Technica, "RAG is a way of improving LLM performance, in essence by blending the LLM process with a web search or other document look‑up process to help LLMs stick to the facts." This method helps reduce AI hallucinations,<sup>[3]</sup> which have caused chatbots to describe policies that don't exist or recommend nonexistent legal cases to lawyers seeking citations.<sup>[4]</sup>
</p>

<h2 className="text-2xl font-semibold mb-4 mt-6" style={{ color: "var(--color-text-primary)" }}>Limitations of RAG</h2>
<p className="max-w-3xl text-base mb-8" style={{ color: "var(--color-text-secondary)" }}>
  While RAG reduces the need to retrain LLMs with new data, saving computational and financial costs,<sup>[1]</sup> it does not solve all problems. LLMs can still generate misinformation even when pulling from factually correct sources if they misinterpret the context. MIT Technology Review gives the example of an AI‑generated response stating, "The United States has had one Muslim president, Barack Hussein Obama," a misinterpretation of a title.<sup>[2]</sup> Additionally, RAG does not guarantee that models will recognize when they lack sufficient information, leading to confident but incorrect answers.<sup>[1]</sup>
</p>

<h2 className="text-2xl font-semibold mb-4 mt-6" style={{ color: "var(--color-text-primary)" }}>Process</h2>
<p className="max-w-3xl text-base mb-8" style={{ color: "var(--color-text-secondary)" }}>
  Retrieval‑augmented generation enhances LLMs by adding an information‑retrieval mechanism. First, raw data is converted into embeddings and stored in a vector database. Given a user query, a retriever selects the most relevant documents, which are then used to augment the original query in the prompt. The LLM generates its answer based on both the query and the retrieved documents. Optional steps such as re‑ranking, context selection, and fine‑tuning can further improve output quality.<sup>[2][3]</sup>
</p>

<h2 className="text-2xl font-semibold mb-4 mt-6" style={{ color: "var(--color-text-primary)" }}>Key Stages</h2>
<ul className="list-disc pl-6 mb-8" style={{ color: "var(--color-text-secondary)" }}>
  <li>Encoding: Convert text to dense or sparse vectors and store them in a vector store.</li>
  <li>Retrieval: Use similarity search (e.g., ANN) to fetch relevant documents.</li>
  <li>Reranking: Refine results with models like RankGPT.</li>
  <li>Generation: Combine retrieved passages with the user query and feed them to the LLM.</li>
</ul>

<h2 className="text-2xl font-semibold mb-4 mt-6" style={{ color: "var(--color-text-primary)" }}>Applications</h2>
<p className="max-w-3xl text-base mb-8" style={{ color: "var(--color-text-secondary)" }}>
  RAG is used wherever generated responses need to be grounded in up‑to‑date information, such as internal company chatbots, healthcare assistants, and legal advisory tools. By grounding answers in external sources, RAG improves factual accuracy and allows citations for verification.
</p>
        <img
          src="/rag-architecture.png"
          alt="RAG architecture diagram"
          className="w-full max-w-5xl border rounded shadow-lg"
        />
      </section>
    </>
  );
}
