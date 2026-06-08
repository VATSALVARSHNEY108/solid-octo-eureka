import { TheorySection } from "@/components/TheorySection";

export default function MaximumSubarraySumLesson() {
  return (
    <main style={{ background: "#0a0d14", minHeight: "100vh" }}>
      <TheorySection
        title="Maximum Subarray Sum"
        definition="Find the contiguous subarray with the largest sum. This is the problem statement behind Kadane's algorithm and one of the most important array-to-DP bridges."
        timeComplexity="O(N)"
        spaceComplexity="O(1)"
        keyPoints={[
          "Track the best sum ending at the current index.",
          "If the running sum becomes negative, restart from the current value.",
          "Negative numbers are part of the problem, not a special case to avoid.",
          "This pattern appears in profit, scoring, and signal-processing problems."
        ]}
        breadcrumbs="DATA STRUCTURES › ARRAYS"
      />
    </main>
  );
}
