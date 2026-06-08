import FrameworkLessonLayout, {
  type FrameworkLessonMeta,
} from "@/components/frameworks/FrameworkLessonLayout";

const meta: FrameworkLessonMeta = {
  subjectId: "artificial-intelligence",
  topicId: "frameworks",
  lessonId: "Pandas",
  title: "Pandas",
  tagline:
    "Pandas is the tabular data workhorse: load, clean, join, reshape, and summarize datasets before modeling.",
  install: {
    steps: [
      "Create a virtual environment (recommended) and activate it.",
      "Install: `pip install pandas`.",
      "Verify: `python -c \"import pandas as pd; print(pd.__version__)\"`.",
    ],
    notes: ["For speed + smaller files, prefer Parquet over CSV when you can."],
  },
  helloWorld: {
    code: `import pandas as pd

df = pd.DataFrame({"age": [18, None, 34], "visits": [1, 0, 3]})
df["age"] = df["age"].fillna(df["age"].median())
df["visits"] = df["visits"].clip(lower=1)
print(df)`,
    notes: ["Pandas is usually the prep stage; models happen in sklearn/PyTorch/TF."],
  },
  bestFor: [
    "Cleaning messy CSV/JSON data into a modeling-ready table.",
    "Joins + aggregations (SQL-like tasks in Python).",
    "Feature engineering for classical ML.",
  ],
  notFor: [
    "GPU tensor training or autodiff (use PyTorch/TF).",
    "Huge datasets that don't fit memory (consider DuckDB/Polars/Spark).",
  ],
  pitfalls: [
    "Chained indexing (can lead to silent copies). Prefer .loc for assignment.",
    "Mixed dtypes due to missing values; check .dtypes and cast intentionally.",
    "Row-wise .apply(...) loops are slow; prefer vectorized ops/groupby.",
    "Train/test leakage: fit preprocessing on train only (use sklearn pipelines).",
  ],
  related: [
    {
      title: "NumPy",
      href: "/curriculum/artificial-intelligence/frameworks/NumPy",
      desc: "Pandas columns are backed by NumPy arrays.",
    },
    {
      title: "scikit-learn",
      href: "/curriculum/artificial-intelligence/frameworks/ScikitLearn",
      desc: "Use pipelines to package preprocessing + a model safely.",
    },
    {
      title: "Hugging Face",
      href: "/curriculum/artificial-intelligence/frameworks/HuggingFace",
      desc: "For NLP datasets and transformer models.",
    },
  ],
  prev: { title: "NumPy", lessonId: "NumPy" },
  next: { title: "scikit-learn", lessonId: "ScikitLearn" },
};

// ── Code snippets ────────────────────────────────────────────────────────────

const CODE_IO = `import pandas as pd

# ── Reading ───────────────────────────────────────────────────
df = pd.read_csv("data.csv")
df = pd.read_csv("data.csv", usecols=["age","salary"], dtype={"age": "Int32"})
df = pd.read_json("data.json")
df = pd.read_parquet("data.parquet")          # fast, typed, compressed
df = pd.read_excel("data.xlsx", sheet_name=0)
df = pd.read_sql("SELECT * FROM users", con=engine)  # SQLAlchemy engine

# ── Writing ───────────────────────────────────────────────────
df.to_csv("out.csv", index=False)
df.to_parquet("out.parquet", index=False)
df.to_json("out.json", orient="records", lines=True)

# ── Quick inspection ──────────────────────────────────────────
df.shape          # (rows, cols)
df.dtypes         # column types
df.head(5)        # first 5 rows
df.tail(5)        # last 5 rows
df.info()         # dtypes + non-null counts
df.describe()     # stats for numeric columns
df.sample(10)     # random sample`;

const CODE_SELECTION = `import pandas as pd

# Column selection
df["age"]                      # Series
df[["age", "salary"]]          # DataFrame (double brackets)

# Row selection by label (use .loc for all assignment)
df.loc[0]                      # single row by index label
df.loc[0:4, "age":"salary"]    # label slice (inclusive on both ends)

# Row selection by integer position
df.iloc[0]                     # first row
df.iloc[0:5, 0:3]             # first 5 rows, first 3 cols

# Boolean filtering
df[df["age"] > 30]
df[(df["age"] > 30) & (df["salary"] < 80_000)]
df[df["city"].isin(["Mumbai", "Delhi"])]
df[df["name"].str.startswith("A")]

# Safe assignment — always use .loc, never chain
df.loc[df["age"] > 30, "senior"] = True`;

const CODE_MISSING = `import pandas as pd

# Detect
df.isnull().sum()                    # count nulls per column
df.isnull().mean()                   # fraction missing per column
df[df["age"].isnull()]               # rows where age is missing

# Drop
df.dropna()                          # drop any row with a null
df.dropna(subset=["age", "salary"])  # drop only if these cols are null
df.dropna(thresh=3)                  # keep rows with at least 3 non-nulls

# Fill
df["age"].fillna(df["age"].median())
df["city"].fillna("Unknown")
df.ffill()                           # forward-fill (time series)
df.bfill()                           # backward-fill

# Interpolate (numeric, time series)
df["price"].interpolate(method="linear")`;

const CODE_DTYPES_CAST = `import pandas as pd

df.dtypes                            # inspect all dtypes

# Cast
df["age"]    = df["age"].astype("Int32")        # nullable integer
df["score"]  = df["score"].astype("float32")
df["label"]  = df["label"].astype("category")   # saves memory for low-cardinality

# Dates
df["date"] = pd.to_datetime(df["date"])
df["date"] = pd.to_datetime(df["date"], format="%Y-%m-%d")

# Numeric coercion (turns bad strings into NaN instead of raising)
df["revenue"] = pd.to_numeric(df["revenue"], errors="coerce")`;

const CODE_CLEAN = `import pandas as pd

# Rename columns
df.rename(columns={"oldname": "newname"}, inplace=True)
df.columns = df.columns.str.lower().str.replace(" ", "_")  # normalize all

# Drop duplicates
df.drop_duplicates()
df.drop_duplicates(subset=["user_id"])

# Drop columns
df.drop(columns=["noise_col", "id"])

# Clip outliers
df["salary"] = df["salary"].clip(lower=0, upper=300_000)

# Reset index after filtering
df = df[df["age"] > 18].reset_index(drop=True)

# Sort
df.sort_values("salary", ascending=False)
df.sort_values(["country", "salary"], ascending=[True, False])`;

const CODE_FEATURE_ENG = `import pandas as pd

# Arithmetic features
df["bmi"] = df["weight"] / (df["height"] / 100) ** 2
df["log_salary"] = df["salary"].apply(lambda x: x ** 0.5)  # last resort

# Binning
df["age_group"] = pd.cut(df["age"], bins=[0,18,35,60,100],
                          labels=["teen","young","mid","senior"])
df["age_bucket"] = pd.qcut(df["age"], q=4, labels=False)   # quartile bins

# One-hot encoding
df = pd.get_dummies(df, columns=["city", "gender"], drop_first=True)

# Label encoding
df["label_enc"] = df["category"].astype("category").cat.codes

# String features
df["name_len"]   = df["name"].str.len()
df["first_word"] = df["text"].str.split().str[0]
df["contains_ai"] = df["text"].str.contains("AI", case=False)

# Date features
df["year"]    = df["date"].dt.year
df["month"]   = df["date"].dt.month
df["weekday"] = df["date"].dt.dayofweek
df["is_weekend"] = df["weekday"].isin([5, 6])`;

const CODE_GROUPBY = `import pandas as pd

# Basic aggregation
df.groupby("country")["salary"].mean()
df.groupby("country")["salary"].agg(["mean", "median", "std", "count"])

# Multiple columns
df.groupby(["country", "gender"])["salary"].mean()

# Named aggregations (pandas >= 0.25)
df.groupby("country").agg(
    avg_salary=("salary", "mean"),
    max_age=("age", "max"),
    n_users=("user_id", "count"),
)

# Transform — same shape as input (for feature engineering)
df["salary_vs_country_mean"] = df.groupby("country")["salary"].transform("mean")
df["salary_rank"] = df.groupby("country")["salary"].rank(pct=True)

# Filter groups
df.groupby("country").filter(lambda g: len(g) > 100)`;

const CODE_MERGE = `import pandas as pd

# Merge (SQL JOIN equivalent)
result = pd.merge(users, orders, on="user_id", how="left")
result = pd.merge(users, orders, left_on="id", right_on="user_id", how="inner")

# Concat (stack vertically or horizontally)
combined = pd.concat([df_2022, df_2023], ignore_index=True)
wide     = pd.concat([df_features, df_labels], axis=1)

# join (index-based merge)
df1.join(df2, how="left")

# Common how values:
# inner  — keep rows that match in both
# left   — keep all left rows; NaN for missing right
# outer  — keep all rows from both
# right  — keep all right rows; NaN for missing left`;

const CODE_RESHAPE = `import pandas as pd

# Pivot table (aggregation + reshape)
pivot = df.pivot_table(
    values="sales",
    index="month",
    columns="product",
    aggfunc="sum",
    fill_value=0,
)

# Melt (wide -> long)
long = pd.melt(df, id_vars=["user_id"], value_vars=["jan","feb","mar"],
               var_name="month", value_name="sales")

# Stack / unstack (multi-index)
stacked   = df.stack()      # columns -> innermost index level
unstacked = stacked.unstack()

# Explode (list column -> rows)
df["tags"] = df["tags"].str.split(",")
df = df.explode("tags").reset_index(drop=True)`;

const CODE_TIMESERIES = `import pandas as pd

df = pd.read_csv("prices.csv", parse_dates=["date"], index_col="date")

# Resample (downsample to monthly)
monthly = df["close"].resample("ME").mean()

# Rolling stats
df["ma_7"]  = df["close"].rolling(7).mean()
df["std_30"] = df["close"].rolling(30).std()

# Lag / lead features
df["prev_close"] = df["close"].shift(1)
df["next_close"] = df["close"].shift(-1)

# Percent change
df["returns"] = df["close"].pct_change()

# Date range index
idx = pd.date_range("2024-01-01", periods=365, freq="D")`;

const CODE_INTEROP = `import pandas as pd
import numpy as np

# To / from NumPy
arr = df.to_numpy()            # loses column names
arr = df["salary"].values      # underlying NumPy array (may share memory)
df2 = pd.DataFrame(arr, columns=df.columns)

# To sklearn
from sklearn.preprocessing import StandardScaler
X = df[["age","salary"]].to_numpy()
X_scaled = StandardScaler().fit_transform(X)

# To PyTorch
import torch
tensor = torch.tensor(df[["age","salary"]].values, dtype=torch.float32)

# To HuggingFace Dataset
from datasets import Dataset
hf_ds = Dataset.from_pandas(df)`;

// ── Sub-components ───────────────────────────────────────────────────────────

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="mt-4 rounded-xl bg-[var(--bg-secondary)]/60 border border-[var(--border-subtle)] p-5 text-xs leading-relaxed overflow-x-auto text-[var(--text-primary)]">
      <code>{code}</code>
    </pre>
  );
}

function KeyCard({ title, desc }: { title: string; desc: string }) {
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

export default function Pandas() {
  return (
    <FrameworkLessonLayout meta={meta}>

      {/* What you do with Pandas */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          What you do with Pandas
        </h2>
        <ul className="mt-5 space-y-3 text-[var(--text-secondary)]">
          <li>Read data from CSV, JSON, Parquet, Excel, and SQL.</li>
          <li>Handle missing values, outliers, and type casting.</li>
          <li>Feature engineering: groupby, rolling windows, one-hot encoding.</li>
          <li>Merge multiple tables with joins.</li>
          <li>Reshape wide/long data and build pivot tables.</li>
          <li>Work with time-series indices, resampling, and rolling statistics.</li>
        </ul>
      </section>

      {/* Key concepts */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">Key concepts</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            { title: "DataFrame", desc: "2D table with labeled columns and a row index. The central object in Pandas." },
            { title: "Series", desc: "1D labeled array — a single column or row of a DataFrame, with its own index." },
            { title: "Index", desc: "Row labels that enable alignment across operations and fast label-based lookup." },
            { title: "GroupBy", desc: "Split-apply-combine pattern for aggregation, transformation, and filtering." },
            { title: "MultiIndex", desc: "Hierarchical index for representing grouped or pivoted data cleanly." },
            { title: "dtype", desc: "Each column has a dtype: float64, Int32 (nullable), category, datetime64, object." },
          ].map(({ title, desc }) => (
            <KeyCard key={title} title={title} desc={desc} />
          ))}
        </div>
      </section>

      {/* I/O */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Reading and writing data
        </h2>
        <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed">
          Prefer Parquet over CSV in production pipelines — it preserves dtypes, compresses
          well, and loads 5-10x faster. Use <code>usecols</code> to avoid loading columns you
          do not need.
        </p>
        <CodeBlock code={CODE_IO} />
      </section>

      {/* Selection */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Selecting rows and columns
        </h2>
        <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed">
          Always use <code>.loc</code> for label-based selection and assignment. Chained
          indexing like <code>df[...][...] = value</code> may silently write to a copy instead
          of the original DataFrame.
        </p>
        <CodeBlock code={CODE_SELECTION} />
      </section>

      {/* Missing values */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Handling missing values
        </h2>
        <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed">
          Always audit missing data before modeling. Whether you drop, fill, or impute depends
          on the fraction missing and whether missingness is informative.
        </p>
        <CodeBlock code={CODE_MISSING} />
      </section>

      {/* dtypes */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          dtypes and casting
        </h2>
        <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed">
          Pandas uses <code>object</code> dtype for mixed or string columns, which is slow and
          memory-hungry. Cast strings to <code>category</code> for low-cardinality columns and
          use nullable integer types (<code>Int32</code>, not <code>int32</code>) when nulls are
          possible.
        </p>
        <CodeBlock code={CODE_DTYPES_CAST} />
      </section>

      {/* Cleaning */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Cleaning and reshaping
        </h2>
        <CodeBlock code={CODE_CLEAN} />
      </section>

      {/* Feature engineering */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Feature engineering
        </h2>
        <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed">
          Prefer vectorized column operations over <code>.apply(lambda ...)</code> — they are
          10-100x faster. Reserve <code>.apply()</code> for logic that genuinely cannot be
          expressed with built-in methods.
        </p>
        <CodeBlock code={CODE_FEATURE_ENG} />
      </section>

      {/* GroupBy */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          GroupBy — split, apply, combine
        </h2>
        <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed">
          <code>agg</code> reduces each group to a scalar. <code>transform</code> returns a
          result the same length as the input — perfect for adding group-level features back to
          the original DataFrame without a merge.
        </p>
        <CodeBlock code={CODE_GROUPBY} />
      </section>

      {/* Merge / join */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Merging and joining tables
        </h2>
        <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed">
          <code>pd.merge</code> is the most flexible — it mirrors SQL JOIN syntax.{" "}
          <code>pd.concat</code> stacks DataFrames vertically (more rows) or horizontally (more
          columns). Always verify row counts after a merge to catch fan-out bugs.
        </p>
        <CodeBlock code={CODE_MERGE} />
      </section>

      {/* Reshape */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Reshaping — pivot, melt, stack
        </h2>
        <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed">
          <code>pivot_table</code> converts long format to wide (rows become columns).{" "}
          <code>melt</code> goes the other direction — wide to long — which is often what
          plotting libraries and tidy-data tools expect.
        </p>
        <CodeBlock code={CODE_RESHAPE} />
      </section>

      {/* Time series */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Time-series operations
        </h2>
        <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed">
          Set a <code>DatetimeIndex</code> to unlock <code>resample</code>, <code>rolling</code>,
          and <code>shift</code>. These are the building blocks for lag features, moving
          averages, and seasonality extraction in time-series ML.
        </p>
        <CodeBlock code={CODE_TIMESERIES} />
      </section>

      {/* Quick-reference table */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Method quick-reference
        </h2>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm text-left text-[var(--text-secondary)] border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-subtle)]">
                <th className="py-3 pr-8 font-black text-[var(--text-primary)] uppercase tracking-wider text-xs">Method</th>
                <th className="py-3 font-black text-[var(--text-primary)] uppercase tracking-wider text-xs">What it does</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {[
                ["df.copy()", "Deep copy — prevents accidental mutation of the original"],
                ["df.pipe(fn)", "Chain custom functions: df.pipe(clean).pipe(encode)"],
                ["df.assign(col=expr)", "Add/replace columns without mutation — returns new df"],
                ["df.query('age > 30')", "Filter with a string expression (readable, fast)"],
                ["df.eval('bmi = wt / ht**2')", "Compute expression and add column in one line"],
                ["df.nlargest(5, 'salary')", "Top N rows by column value"],
                ["df.value_counts()", "Frequency table for a Series"],
                ["df.corr()", "Pearson correlation matrix for numeric columns"],
                ["df.memory_usage(deep=True)", "Memory footprint per column in bytes"],
                ["df.select_dtypes('number')", "Keep only numeric columns"],
                ["df.clip(lower, upper)", "Clamp values — good for outlier handling"],
                ["pd.crosstab(a, b)", "Contingency table (frequency cross-tab)"],
              ].map(([method, desc]) => (
                <tr key={method as string}>
                  <td className="py-3 pr-8 font-mono text-xs text-[var(--text-primary)]">{method}</td>
                  <td className="py-3 text-sm">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Interop */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Interoperability
        </h2>
        <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed">
          Pandas sits at the centre of the Python ML stack. Use <code>.to_numpy()</code> or{" "}
          <code>.values</code> to hand data to sklearn and PyTorch, and{" "}
          <code>Dataset.from_pandas(df)</code> to move into HuggingFace Datasets.
        </p>
        <CodeBlock code={CODE_INTEROP} />
      </section>

      {/* Pitfalls */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Common pitfalls — in depth
        </h2>
        <div className="mt-6 space-y-5 text-sm text-[var(--text-secondary)] leading-relaxed">
          {[
            {
              title: "Chained indexing",
              body: "df['col'][mask] = value may silently write to a temporary copy. Always assign through df.loc[mask, 'col'] = value. Pandas will warn about this with SettingWithCopyWarning, but the warning is not always raised.",
            },
            {
              title: "Mixed dtypes and object columns",
              body: "When a column contains NaN alongside integers, Pandas upcasts to float64. Use the nullable integer dtype Int32 (capital I) to keep integers with NaN. String columns default to object — cast to StringDtype or category for memory and speed.",
            },
            {
              title: "Row-wise .apply() is slow",
              body: "apply(fn, axis=1) iterates row by row in Python — effectively a for-loop. Replace with vectorized column arithmetic, .str methods, pd.cut, or numpy ufuncs. If you must apply, try numba or swifter for parallelism.",
            },
            {
              title: "Train/test leakage via preprocessing",
              body: "If you fillna with the column median computed on the full dataset, you are leaking test statistics into training. Always fit imputers, scalers, and encoders on the training split only. Wrap everything in an sklearn Pipeline to enforce this automatically.",
            },
            {
              title: "Forgetting reset_index after filtering",
              body: "Filtering rows preserves the original index labels. Passing such a DataFrame to PyTorch or sklearn can cause subtle misalignment bugs. Call .reset_index(drop=True) after any filter that changes the row set.",
            },
            {
              title: "Memory blowup with large CSVs",
              body: "Reading a large CSV without usecols or dtype hints forces Pandas to load everything as float64 or object. Specify dtypes on read, use category for low-cardinality strings, and consider chunked reading (chunksize=) or switching to Parquet / Polars for large files.",
            },
          ].map(({ title, body }) => (
            <div key={title}>
              <h3 className="font-black text-[var(--text-primary)]">{title}</h3>
              <p className="mt-1">{body}</p>
            </div>
          ))}
        </div>
      </section>

    </FrameworkLessonLayout>
  );
}