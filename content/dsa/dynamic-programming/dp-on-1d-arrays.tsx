import { TheorySection } from "@/components/TheorySection";

export default function DpOn1DArraysLesson() {
  return (
    <main style={{ background: "#0a0d14", minHeight: "100vh" }}>
      <TheorySection
        title="DP on 1D Arrays"
        definition="This pattern uses a one-dimensional DP array to track answers for prefixes, positions, or counts in linear problems."
        timeComplexity="O(N)"
        spaceComplexity="O(N)"
        keyPoints={[
          "Common examples include Fibonacci, climbing stairs, house robber, and subset sum.",
          "The index usually represents how much of the input has been processed.",
          "Some solutions scan left-to-right, while others need a reverse pass to avoid reuse.",
          "Many 1D DP solutions can be compressed to O(1) space after the recurrence is clear."
        ]}
        breadcrumbs="DYNAMIC PROGRAMMING › PATTERNS"
      />
    </main>
  );
}
