import { BlockMath, InlineMath } from "react-katex";

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/40 px-2 py-1 font-mono text-[0.9em] text-[var(--text-primary)]">
      {children}
    </code>
  );
}

function CodeBlock({
  title,
  children
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5">
      {title ? (
        <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-secondary)]">
          {title}
        </div>
      ) : null}
      <pre className="mt-3 overflow-x-auto rounded-[1.25rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/25 p-5 text-xs leading-relaxed text-[var(--text-secondary)]">
        <code className="font-mono">{children}</code>
      </pre>
    </div>
  );
}

function MetricTable() {
  return (
    <div className="mt-6 overflow-x-auto rounded-[1.25rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/15">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-[var(--border-subtle)]">
          <tr className="text-[10px] uppercase tracking-[0.35em] text-[var(--text-secondary)]">
            <th className="px-5 py-4 font-black">Metric</th>
            <th className="px-5 py-4 font-black">Best For</th>
            <th className="px-5 py-4 font-black">Notes</th>
          </tr>
        </thead>
        <tbody className="text-[var(--text-secondary)]">
          <tr className="border-b border-[var(--border-subtle)]">
            <td className="px-5 py-4 font-semibold text-[var(--text-primary)]">Cosine</td>
            <td className="px-5 py-4">Normalized embeddings (text similarity)</td>
            <td className="px-5 py-4">Often implemented as 1 - dot(a, b)</td>
          </tr>
          <tr className="border-b border-[var(--border-subtle)]">
            <td className="px-5 py-4 font-semibold text-[var(--text-primary)]">Euclidean (L2)</td>
            <td className="px-5 py-4">Image/spatial embeddings</td>
            <td className="px-5 py-4">Distance grows unbounded</td>
          </tr>
          <tr>
            <td className="px-5 py-4 font-semibold text-[var(--text-primary)]">Dot Product</td>
            <td className="px-5 py-4">Maximum inner product search</td>
            <td className="px-5 py-4">Common when vectors already normalized</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function IndexTable() {
  return (
    <div className="mt-6 overflow-x-auto rounded-[1.25rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/15">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-[var(--border-subtle)]">
          <tr className="text-[10px] uppercase tracking-[0.35em] text-[var(--text-secondary)]">
            <th className="px-5 py-4 font-black">Index Type</th>
            <th className="px-5 py-4 font-black">Build</th>
            <th className="px-5 py-4 font-black">Query</th>
            <th className="px-5 py-4 font-black">Memory</th>
            <th className="px-5 py-4 font-black">Accuracy</th>
          </tr>
        </thead>
        <tbody className="text-[var(--text-secondary)]">
          <tr className="border-b border-[var(--border-subtle)]">
            <td className="px-5 py-4 font-semibold text-[var(--text-primary)]">Flat</td>
            <td className="px-5 py-4">Fast</td>
            <td className="px-5 py-4">Slow</td>
            <td className="px-5 py-4">Low</td>
            <td className="px-5 py-4">100%</td>
          </tr>
          <tr className="border-b border-[var(--border-subtle)]">
            <td className="px-5 py-4 font-semibold text-[var(--text-primary)]">IVF</td>
            <td className="px-5 py-4">Medium</td>
            <td className="px-5 py-4">Fast</td>
            <td className="px-5 py-4">Medium</td>
            <td className="px-5 py-4">95–99%</td>
          </tr>
          <tr className="border-b border-[var(--border-subtle)]">
            <td className="px-5 py-4 font-semibold text-[var(--text-primary)]">HNSW</td>
            <td className="px-5 py-4">Slow</td>
            <td className="px-5 py-4">Very Fast</td>
            <td className="px-5 py-4">High</td>
            <td className="px-5 py-4">95–99%</td>
          </tr>
          <tr>
            <td className="px-5 py-4 font-semibold text-[var(--text-primary)]">PQ</td>
            <td className="px-5 py-4">Medium</td>
            <td className="px-5 py-4">Fast</td>
            <td className="px-5 py-4">Very Low</td>
            <td className="px-5 py-4">90–95%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function VectorDatabase() {
  return (
    <section className="px-12 py-24">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] px-5 py-2 text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-secondary)]">
            <span className="inline-block size-2 rounded-full bg-[var(--text-primary)]" />
            Generative AI
          </div>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl text-[var(--text-primary)]">
            Vector Databases
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-[var(--text-secondary)]">
            Vector databases are essential infrastructure for AI apps: semantic search,
            recommendations, and retrieval-augmented generation (RAG). This lesson walks through
            the architecture, indexing strategies, and a minimal “build-it-yourself” implementation
            so you can reason about performance, scalability, and cost.
          </p>
        </header>

        <div className="mt-16 grid gap-10 sm:grid-cols-12">
          <div className="sm:col-span-7 space-y-10">
            <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
              <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
                What makes vector databases different
              </h2>
              <p className="mt-5 text-[var(--text-secondary)] leading-relaxed">
                Traditional databases excel at exact matching and structured queries. Vector
                databases solve a different problem: finding items that are{" "}
                <span className="text-[var(--text-primary)] font-semibold">similar</span> to a query,
                not identical. After you convert text/images/audio into{" "}
                <InlineCode>embeddings</InlineCode> (dense vectors), you need fast similarity search
                over millions (or billions) of vectors.
              </p>
              <div className="mt-7 rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/15 p-6">
                <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-secondary)]">
                  Mental model
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                  <span className="font-semibold text-[var(--text-primary)]">Query</span> → embed to
                  vector → search index → top‑K ids → fetch stored text/metadata → optional rerank →
                  return filtered results.
                </p>
              </div>
            </section>

            <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
              <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
                Core components (production architecture)
              </h2>
              <p className="mt-5 text-[var(--text-secondary)] leading-relaxed">
                A production-ready system is a pipeline of services. Even if you use Pinecone,
                Weaviate, Milvus, or FAISS-based stacks, the same building blocks show up.
              </p>
              <ul className="mt-6 space-y-3 text-[var(--text-secondary)] leading-relaxed">
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">Data ingestion:</span>{" "}
                  parse raw data → chunk → attach metadata.
                </li>
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">Embedding model:</span>{" "}
                  converts chunks into vectors (batching matters).
                </li>
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">Storage layer:</span>{" "}
                  persists vectors + metadata (often separate from index).
                </li>
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">Index builder:</span>{" "}
                  builds/updates ANN structures.
                </li>
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">Search engine:</span>{" "}
                  answers top‑K similarity queries with filters.
                </li>
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">Post-processing:</span>{" "}
                  filtering, reranking, grouping, deduplication.
                </li>
              </ul>
            </section>

            <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
              <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
                1) Embedding layer
              </h2>
              <p className="mt-5 text-[var(--text-secondary)] leading-relaxed">
                Vectors are generated before they reach the database. The most important practical
                optimization is <span className="font-semibold text-[var(--text-primary)]">batching</span>{" "}
                (embedding 32+ texts at once is much faster than one-by-one).
              </p>
              <CodeBlock title="embedding_service.py">{`# Handles conversion of raw data into vector embeddings
import numpy as np
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Any

class EmbeddingService:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.model = SentenceTransformer(model_name)
        self.dimension = self.model.get_sentence_embedding_dimension()

    def embed_text(self, text: str) -> np.ndarray:
        return self.model.encode(text, normalize_embeddings=True)

    def embed_batch(self, texts: List[str]) -> np.ndarray:
        return self.model.encode(
            texts,
            normalize_embeddings=True,
            batch_size=32,
            show_progress_bar=False
        )

    def get_dimension(self) -> int:
        return self.dimension`}</CodeBlock>
            </section>

            <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
              <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
                2) Distance metrics
              </h2>
              <p className="mt-5 text-[var(--text-secondary)] leading-relaxed">
                The metric impacts retrieval quality and speed. A common setup is cosine distance
                with normalized embeddings for text.
              </p>
              <div className="mt-6 rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/15 p-6">
                <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-secondary)]">
                  Formulas
                </div>
                <div className="mt-4 space-y-4 text-sm text-[var(--text-secondary)]">
                  <div className="flex flex-col gap-2">
                    <div className="font-semibold text-[var(--text-primary)]">
                      Cosine similarity / distance
                    </div>
                    <BlockMath math={"\\cos(\\theta)=\\frac{a\\cdot b}{\\lVert a\\rVert\\,\\lVert b\\rVert}"} />
                    <BlockMath math={"d_{\\text{cos}}(a,b)=1-\\cos(\\theta)"} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="font-semibold text-[var(--text-primary)]">Euclidean (L2)</div>
                    <BlockMath math={"d_{2}(a,b)=\\lVert a-b\\rVert_{2}=\\sqrt{\\sum_i (a_i-b_i)^2}"} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="font-semibold text-[var(--text-primary)]">Dot product</div>
                    <BlockMath math={"s(a,b)=a\\cdot b=\\sum_i a_i b_i"} />
                  </div>
                  <p className="leading-relaxed">
                    In the toy code below, we convert distance to a similarity score as{" "}
                    <InlineMath math={"\\text{score}=1-\\text{distance}"} /> (a simple convention; many
                    systems return distance directly).
                  </p>
                </div>
              </div>
              <MetricTable />
              <CodeBlock title="distance_metrics.py">{`# Implements common distance functions for vector similarity
import numpy as np
from enum import Enum
from typing import Callable

class DistanceMetric(Enum):
    COSINE = "cosine"
    EUCLIDEAN = "euclidean"
    DOT_PRODUCT = "dot_product"

def cosine_distance(a: np.ndarray, b: np.ndarray) -> float:
    dot = np.dot(a, b)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    return 1 - (dot / (norm_a * norm_b))

def euclidean_distance(a: np.ndarray, b: np.ndarray) -> float:
    return np.linalg.norm(a - b)

def dot_product_distance(a: np.ndarray, b: np.ndarray) -> float:
    return -np.dot(a, b)

def get_distance_function(metric: DistanceMetric) -> Callable:
    functions = {
        DistanceMetric.COSINE: cosine_distance,
        DistanceMetric.EUCLIDEAN: euclidean_distance,
        DistanceMetric.DOT_PRODUCT: dot_product_distance
    }
    return functions[metric]`}</CodeBlock>
            </section>

            <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
              <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
                3) Indexing strategies
              </h2>
              <p className="mt-5 text-[var(--text-secondary)] leading-relaxed">
                The index is the heart of the system. Flat search is exact but slow at scale.
                Approximate Nearest Neighbor (ANN) indexes trade a bit of accuracy for huge speedups.
              </p>
              <IndexTable />
              <CodeBlock title="vector_index.py">{`# Minimal vector index (flat search with metric support)
import numpy as np
from dataclasses import dataclass
from typing import List, Tuple, Optional, Dict, Any

@dataclass
class VectorRecord:
    id: str
    vector: np.ndarray
    metadata: Dict[str, Any]

class VectorIndex:
    def __init__(self, dimension: int, metric: str = "cosine", index_type: str = "flat"):
        self.dimension = dimension
        self.metric = metric
        self.index_type = index_type
        self.vectors: List[VectorRecord] = []
        self.id_to_index: Dict[str, int] = {}

    def add(self, id: str, vector: np.ndarray, metadata: Dict[str, Any] = None):
        if vector.shape[0] != self.dimension:
            raise ValueError(f"Expected dimension {self.dimension}, got {vector.shape[0]}")
        if self.metric == "cosine":
            vector = vector / np.linalg.norm(vector)
        record = VectorRecord(id=id, vector=vector, metadata=metadata or {})
        self.id_to_index[id] = len(self.vectors)
        self.vectors.append(record)

    def search(self, query_vector: np.ndarray, k: int = 10, filter_fn: Optional[callable] = None):
        if self.metric == "cosine":
            query_vector = query_vector / np.linalg.norm(query_vector)
        results = []
        for record in self.vectors:
            if filter_fn and not filter_fn(record.metadata):
                continue
            distance = self._calculate_distance(query_vector, record.vector)
            results.append((record.id, distance, record.metadata))
        results.sort(key=lambda x: x[1])
        return results[:k]

    def _calculate_distance(self, a: np.ndarray, b: np.ndarray) -> float:
        if self.metric == "cosine":
            return 1 - np.dot(a, b)
        elif self.metric == "euclidean":
            return np.linalg.norm(a - b)
        else:
            return -np.dot(a, b)`}</CodeBlock>
            </section>

            <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
              <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
                4) Metadata filtering (hybrid search)
              </h2>
              <p className="mt-5 text-[var(--text-secondary)] leading-relaxed">
                Real systems rarely do “pure” vector search. You typically filter by category, date
                range, user ID, permissions, or other structured fields—then run vector similarity
                within that subset.
              </p>
              <CodeBlock title="filter_builder.py">{`# Creates composable filters for metadata-based filtering
from typing import Dict, Any, Callable, List
from dataclasses import dataclass

@dataclass
class FilterCondition:
    field: str
    operator: str
    value: Any

class FilterBuilder:
    def __init__(self):
        self.conditions: List[FilterCondition] = []

    def equals(self, field: str, value: Any) -> "FilterBuilder":
        self.conditions.append(FilterCondition(field, "eq", value))
        return self

    def greater_than(self, field: str, value: Any) -> "FilterBuilder":
        self.conditions.append(FilterCondition(field, "gt", value))
        return self

    def less_than(self, field: str, value: Any) -> "FilterBuilder":
        self.conditions.append(FilterCondition(field, "lt", value))
        return self

    def in_list(self, field: str, values: List[Any]) -> "FilterBuilder":
        self.conditions.append(FilterCondition(field, "in", values))
        return self

    def build(self) -> Callable[[Dict[str, Any]], bool]:
        conditions = self.conditions.copy()
        def filter_fn(metadata: Dict[str, Any]) -> bool:
            for cond in conditions:
                value = metadata.get(cond.field)
                if value is None:
                    return False
                if cond.operator == "eq" and value != cond.value:
                    return False
                elif cond.operator == "gt" and value <= cond.value:
                    return False
                elif cond.operator == "lt" and value >= cond.value:
                    return False
                elif cond.operator == "in" and value not in cond.value:
                    return False
            return True
        return filter_fn`}</CodeBlock>
            </section>

            <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
              <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
                Putting it all together (toy vector DB)
              </h2>
              <p className="mt-5 text-[var(--text-secondary)] leading-relaxed">
                This combines embedding + index + filtering into a minimal service. In production,
                you’d swap the flat search for an ANN engine and separate storage from compute.
              </p>
              <CodeBlock title="vector_database.py">{`from embedding_service import EmbeddingService
from vector_index import VectorIndex
from filter_builder import FilterBuilder
from typing import List, Dict, Any, Optional

class VectorDatabase:
    def __init__(self, collection_name: str, dimension: int = 384):
        self.collection_name = collection_name
        self.embedding_service = EmbeddingService()
        self.index = VectorIndex(dimension=dimension, metric="cosine", index_type="flat")

    def upsert(self, id: str, text: str, metadata: Dict[str, Any] = None):
        vector = self.embedding_service.embed_text(text)
        full_metadata = {"text": text, **(metadata or {})}
        self.index.add(id, vector, full_metadata)

    def query(self, query_text: str, k: int = 10, filter_builder: Optional[FilterBuilder] = None):
        query_vector = self.embedding_service.embed_text(query_text)
        filter_fn = filter_builder.build() if filter_builder else None
        results = self.index.search(query_vector, k=k, filter_fn=filter_fn)
        return [
            {"id": id, "score": 1 - distance, "metadata": metadata}
            for id, distance, metadata in results
        ]

if __name__ == "__main__":
    db = VectorDatabase("documents")
    db.upsert("doc1", "Python is great for machine learning", {"category": "tech"})
    db.upsert("doc2", "TensorFlow and PyTorch are popular ML frameworks", {"category": "tech"})
    db.upsert("doc3", "The weather is sunny today", {"category": "general"})

    filt = FilterBuilder().equals("category", "tech")
    results = db.query("deep learning frameworks", k=2, filter_builder=filt)
    for r in results:
        print(f"Score: {r['score']:.3f} - {r['metadata']['text']}")`}</CodeBlock>
            </section>

            <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
              <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
                Scaling considerations
              </h2>
              <ul className="mt-6 space-y-3 text-[var(--text-secondary)] leading-relaxed">
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">Sharding:</span>{" "}
                  partition vectors across nodes (hash by id or partition by metadata).
                </li>
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">Replication:</span>{" "}
                  keep copies of indexes for read scalability and failover.
                </li>
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">Caching:</span>{" "}
                  cache frequent queries and results.
                </li>
                <li>
                  <span className="font-semibold text-[var(--text-primary)]">Async indexing:</span>{" "}
                  queue upserts and batch index updates.
                </li>
              </ul>
            </section>
          </div>

          <aside className="sm:col-span-5 space-y-6">
            <div className="rounded-[2rem] bg-[var(--bg-secondary)]/30 border border-[var(--border-subtle)] p-8 sm:p-10">
              <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-secondary)]">
                takeaways
              </div>
              <h2 className="mt-4 text-xl font-black tracking-tight text-[var(--text-primary)]">
                Key takeaways
              </h2>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                <li>
                  Choose distance metric based on your embedding model (cosine is common for text).
                </li>
                <li>
                  Pick an index type that matches latency vs accuracy vs memory constraints.
                </li>
                <li>Plan for metadata filtering early (hybrid search).</li>
                <li>
                  For real-world facts, use retrieval + grounding; don’t rely on prompting alone.
                </li>
              </ul>
            </div>

            <div className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
              <h2 className="text-xl font-black tracking-tight text-[var(--text-primary)]">
                Where this connects to RAG
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                A vector DB is the retrieval engine behind RAG. It stores chunk embeddings + metadata
                so you can pull the most relevant context for a user query, then feed that context
                into your LLM to generate grounded answers.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
