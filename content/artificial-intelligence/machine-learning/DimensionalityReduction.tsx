import MLLessonTemplate from "./_shared/MLLessonTemplate";

export default function DimensionalityReduction() {
  return (
    <>
      <MLLessonTemplate
        title="Dimensionality Reduction"
        summary="Dimensionality reduction is a technique used to reduce the number of features in a dataset while preserving important information. It transforms high‑dimensional data into a lower‑dimensional space for simpler representation."
        keyIdeas={[
          "Reduces computation time",
          "Prevents overfitting by removing irrelevant data",
          "Improves data visualization and understanding",
        ]}
        workflow={[
          "Identify high‑dimensional data",
          "Choose a reduction method (selection or extraction)",
          "Apply the technique (e.g., PCA, feature selection)",
          "Validate that important information is preserved",
          "Iterate and fine‑tune dimensionality",
        ]}
        useCases={[
          "Text categorization",
          "Image retrieval",
          "Gene expression analysis",
          "Intrusion detection",
        ]}
      />

      {/* Detailed Content Sections */}
      <section className="max-w-6xl mx-auto mt-12 px-6 md:px-10">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Introduction</h2>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          Dimensionality reduction is a technique used to reduce the number of features in a dataset while preserving important
          information. It transforms high‑dimensional data into a lower‑dimensional space for simpler representation.
        </p>
        <p className="text-[var(--text-secondary)] mt-2"><strong>Last Updated:</strong> 2 May, 2026</p>
      </section>

      <section className="max-w-6xl mx-auto mt-8 px-6 md:px-10">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Why Dimensionality Reduction?</h2>
        <ul className="list-disc pl-6 text-[var(--text-secondary)] space-y-2">
          <li>Reduces computation time by lowering the number of features.</li>
          <li>Helps prevent overfitting by removing irrelevant data.</li>
          <li>Improves data visualization and understanding.</li>
        </ul>
        <div className="mt-4 flex justify-center">
          <img
            src="/assets/avantages_and_disadvantages_of_dimensionality_reduction.webp"
            alt="Advantages and disadvantages of Dimensionality Reduction"
            className="max-w-full h-auto rounded"
          />
        </div>
      </section>

      <section className="max-w-6xl mx-auto mt-8 px-6 md:px-10">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Illustrative Example</h2>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          Imagine a dataset where each data point exists in a 3D space defined by axes X, Y and Z. If most of the variance occurs
          along X and Y, the Z‑dimension contributes little to understanding the structure of the data.
        </p>
        <p className="text-[var(--text-secondary)] mt-2">
          Before reduction the data lives in 3D (X, Y, Z) with high redundancy. After applying dimensionality reduction the data can be
          represented in lower‑dimensional spaces such as the X‑Y plane, preserving the meaningful structure while discarding the
          negligible Z information.
        </p>
        <p className="text-[var(--text-secondary)] mt-2">
          This process makes analysis more efficient, speeds up computation, and improves visualisation while minimizing
          redundancy.
        </p>
      </section>

      <section className="max-w-6xl mx-auto mt-8 px-6 md:px-10">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Techniques</h2>
        <h3 className="text-xl font-semibold mt-4 text-[var(--text-primary)]">1. Feature Selection</h3>
        <p className="text-[var(--text-secondary)] leading-relaxed">Feature selection chooses the most relevant features without altering them.</p>
        <ul className="list-disc pl-6 text-[var(--text-secondary)] space-y-1 mt-2">
          <li>Filter methods – rank features by relevance to the target.</li>
          <li>Wrapper methods – use model performance as the selection criterion.</li>
          <li>Embedded methods – integrate selection into model training.</li>
          <li>Missing‑value ratio – drop variables with excessive missing data.</li>
          <li>Backward elimination – iteratively remove least significant features.</li>
          <li>Forward selection – start with one feature and add incrementally.</li>
          <li>Random forest importance – automatically evaluate and keep important features.</li>
        </ul>
        <h3 className="text-xl font-semibold mt-6 text-[var(--text-primary)]">2. Feature Extraction</h3>
        <p className="text-[var(--text-secondary)] leading-relaxed">Feature extraction creates new features by combining or transforming the original ones.</p>
        <ul className="list-disc pl-6 text-[var(--text-secondary)] space-y-1 mt-2">
          <li>Principal Component Analysis (PCA) – converts correlated variables into uncorrelated components.</li>
          <li>Factor Analysis – groups variables by correlation.
          </li>
          <li>Independent Component Analysis (ICA) – finds statistically independent components.
          </li>
        </ul>
      </section>

      <section className="max-w-6xl mx-auto mt-8 px-6 md:px-10">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Real‑World Use Cases</h2>
        <ul className="list-disc pl-6 text-[var(--text-secondary)] space-y-2">
          <li>Text categorization – reduces word‑feature space for accurate document classification.</li>
          <li>Image retrieval – compresses visual features (color, texture, shape) for efficient search.</li>
          <li>Gene expression analysis – identifies key genes for disease classification.</li>
          <li>Intrusion detection – selects important network activity features to spot threats.</li>
        </ul>
      </section>

      <section className="max-w-6xl mx-auto mt-8 px-6 md:px-10">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Advantages</h2>
        <ul className="list-disc pl-6 text-[var(--text-secondary)] space-y-1">
          <li>Reduces computation time as models process fewer features.</li>
          <li>Makes data easier to visualize and understand patterns.</li>
          <li>Helps reduce overfitting and improves model generalisation.</li>
        </ul>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-6 mb-4">Disadvantages</h2>
        <ul className="list-disc pl-6 text-[var(--text-secondary)] space-y-1">
          <li>May lead to loss of important information.</li>
          <li>Choosing the right number of dimensions can be challenging.</li>
          <li>Excessive reduction can negatively affect model accuracy.</li>
        </ul>
      </section>
    </>
  );
}
