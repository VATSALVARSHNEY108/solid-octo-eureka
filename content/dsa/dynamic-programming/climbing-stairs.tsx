import { TheorySection } from "@/components/TheorySection";

export default function ClimbingStairsLesson() {
  return (
    <main style={{ background: "#0a0d14", minHeight: "100vh" }}>
      <TheorySection
        title="Climbing Stairs"
        definition="Count the number of ways to reach the top when each move can be either 1 step or 2 steps."
        timeComplexity="O(N)"
        spaceComplexity="O(1) or O(N)"
        keyPoints={[
          "The recurrence is dp[i] = dp[i - 1] + dp[i - 2].",
          "This is essentially Fibonacci with a story attached.",
          "It teaches counting DP, which is different from minimizing or maximizing DP.",
          "The table can be compressed to two rolling variables."
        ]}
        breadcrumbs="DYNAMIC PROGRAMMING › 1D ARRAYS"
      />
    </main>
  );
}
