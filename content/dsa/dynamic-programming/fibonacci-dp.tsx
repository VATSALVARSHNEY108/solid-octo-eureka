import { TheorySection } from "@/components/TheorySection";

export default function FibonacciDpLesson() {
  return (
    <main style={{ background: "#0a0d14", minHeight: "100vh" }}>
      <TheorySection
        title="Fibonacci DP"
        definition="Fibonacci is the classic example of overlapping subproblems, making it the cleanest introduction to memoization and tabulation."
        timeComplexity="O(N)"
        spaceComplexity="O(1) or O(N)"
        keyPoints={[
          "Naive recursion repeats the same work many times.",
          "Memoization stores previously computed values in a cache.",
          "Tabulation builds the sequence bottom-up from the smallest terms.",
          "The same recurrence appears in many real DP problems."
        ]}
        breadcrumbs="DYNAMIC PROGRAMMING › 1D ARRAYS"
      />
    </main>
  );
}
