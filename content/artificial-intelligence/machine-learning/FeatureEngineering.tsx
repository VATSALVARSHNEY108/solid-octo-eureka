
import MLLessonTemplate from "./_shared/MLLessonTemplate";

export default function FeatureEngineering() {
  return (
    <>
      <MLLessonTemplate
        title="Feature Engineering"
        summary="Feature Engineering is the process of selecting, creating or modifying features like input variables or data to help machine learning models learn patterns more effectively. It involves transforming raw data into meaningful inputs that improve model accuracy and performance."
        keyIdeas={[
          "Select, create, and modify features to capture predictive signals",
          "Handle missing values, encode categories, and scale numbers",
          "Feature creation, transformation, extraction, and selection improve models",
          "Iterative refinement based on model feedback leads to optimal features"
        ]}
        workflow={[
          "Identify raw data sources and objectives",
          "Clean data: handle missing values and outliers",
          "Encode categorical variables and scale numerical features",
          "Create new features via domain knowledge or automated methods",
          "Select the most relevant features using statistical or model‑based techniques",
          "Iterate: evaluate model performance and refine features"
        ]}
        useCases={[
          "Predictive modeling",
          "Customer segmentation",
          "Anomaly detection",
          "Recommendation systems",
          "Time‑series forecasting"
        ]}
      />

      {/* Detailed Content Sections */}
      <section className="max-w-6xl mx-auto mt-12 px-6 md:px-10">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
          Importance of Feature Engineering
        </h2>

        <ul className="list-disc pl-6 text-[var(--text-secondary)] space-y-2">
          <li>
            Improve accuracy: Choosing the right features helps the model
            learn better, leading to more accurate predictions.
          </li>
          <li>
            Reduce overfitting: Using fewer, more important features helps
            the model avoid memorizing the data and perform better on new
            data.
          </li>
          <li>
            Boost interpretability: Well‑chosen features make it easier to
            understand how the model makes its predictions.
          </li>
          <li>
            Enhance efficiency: Focusing on key features speeds up the
            model’s training and prediction process, saving time and
            resources.
          </li>
        </ul>
      </section>

      <section className="max-w-6xl mx-auto mt-8 px-6 md:px-10">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
          Processes Involved in Feature Engineering
        </h2>

        <ol className="list-decimal pl-6 text-[var(--text-secondary)] space-y-2">
          <li>
            <strong>Feature Creation</strong>: Generate new features from
            domain knowledge or data patterns.

            <ul className="list-disc pl-6 mt-1">
              <li>Domain‑specific: Based on industry knowledge.</li>
              <li>Data‑driven: Recognize patterns in the data.</li>
              <li>Synthetic: Combine existing features.</li>
            </ul>
          </li>

          <li>
            <strong>Feature Transformation</strong>: Adjust features to
            improve learning.

            <ul className="list-disc pl-6 mt-1">
              <li>Normalization &amp; Scaling – Align feature ranges.</li>
              <li>Encoding – One‑hot encode categorical variables.</li>
              <li>Mathematical transforms – Logarithmic for skewed data.</li>
            </ul>
          </li>

          <li>
            <strong>Feature Extraction</strong>: Reduce dimensionality (e.g.,
            PCA) or aggregate features.

            <ul className="list-disc pl-6 mt-1">
              <li>
                Dimensionality reduction preserves important information while
                shrinking feature space.
              </li>
              <li>Aggregation &amp; Combination simplify the model.</li>
            </ul>
          </li>

          <li>
            <strong>Feature Selection</strong>: Choose a subset of relevant
            features.

            <ul className="list-disc pl-6 mt-1">
              <li>Filter methods – Correlation based.</li>
              <li>Wrapper methods – Model‑performance based.</li>
              <li>Embedded methods – Integrated into training.</li>
            </ul>
          </li>

          <li>
            <strong>Feature Scaling</strong>: Ensure equal contribution.

            <ul className="list-disc pl-6 mt-1">
              <li>Min‑Max scaling to [0,1].</li>
              <li>Standard scaling (mean 0, variance 1).</li>
            </ul>
          </li>
        </ol>
      </section>

      <section className="max-w-6xl mx-auto mt-8 px-6 md:px-10">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
          Common Techniques
        </h2>

        <h3 className="text-xl font-semibold mt-4 text-[var(--text-primary)]">
          1. One‑Hot Encoding
        </h3>

        <pre className="bg-[var(--bg-primary)] p-4 rounded overflow-x-auto text-[var(--text-secondary)]">
          <code>{`import pandas as pd

data = {'Color': ['Red', 'Blue', 'Green', 'Blue']}
df = pd.DataFrame(data)

df_encoded = pd.get_dummies(df, columns=['Color'], prefix='Color')

print(df_encoded)`}</code>
        </pre>

        <h3 className="text-xl font-semibold mt-4 text-[var(--text-primary)]">
          2. Binning
        </h3>

        <pre className="bg-[var(--bg-primary)] p-4 rounded overflow-x-auto text-[var(--text-secondary)]">
          <code>{`import pandas as pd

data = {'Age': [23, 45, 18, 34, 67, 50, 21]}
df = pd.DataFrame(data)

bins = [0, 20, 40, 60, 100]
labels = ['0-20', '21-40', '41-60', '61+']

df['Age_Group'] = pd.cut(df['Age'], bins=bins, labels=labels, right=False)

print(df)`}</code>
        </pre>

        <h3 className="text-xl font-semibold mt-4 text-[var(--text-primary)]">
          3. Text Data Preprocessing
        </h3>

        <pre className="bg-[var(--bg-primary)] p-4 rounded overflow-x-auto text-[var(--text-secondary)]">
          <code>{`import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from sklearn.feature_extraction.text import CountVectorizer

texts = ["This is a sample sentence.", "Text data preprocessing is important."]

stop_words = set(stopwords.words('english'))
stemmer = PorterStemmer()
vectorizer = CountVectorizer()

def preprocess_text(text):
    words = text.split()
    words = [stemmer.stem(word) for word in words if word.lower() not in stop_words]
    return " ".join(words)

cleaned_texts = [preprocess_text(text) for text in texts]
X = vectorizer.fit_transform(cleaned_texts)

print("Cleaned Texts:", cleaned_texts)
print("Vectorized Text:", X.toarray())`}</code>
        </pre>

        <h3 className="text-xl font-semibold mt-4 text-[var(--text-primary)]">
          4. Feature Splitting
        </h3>

        <pre className="bg-[var(--bg-primary)] p-4 rounded overflow-x-auto text-[var(--text-secondary)]">
          <code>{`import pandas as pd

data = {
  'Full_Address': [
    '123 Elm St, Springfield, 12345',
    '456 Oak Rd, Shelbyville, 67890'
  ]
}

df = pd.DataFrame(data)

df[['Street', 'City', 'Zipcode']] = df['Full_Address'].str.extract(
    r'([0-9]+\\s[\\w\\s]+),\\s([\\w\\s]+),\\s(\\d+)'
)

print(df)`}</code>
        </pre>

        <p className="mt-4 text-[var(--text-secondary)]">
          Tools for Feature Engineering include Featuretools, TPOT,
          DataRobot, Alteryx, and H2O.ai.
        </p>
      </section>
    </>
  );
}

