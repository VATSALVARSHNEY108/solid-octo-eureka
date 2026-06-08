import LinkedListLessonStudio, { type LessonScenario } from "@/components/LinkedListLessonStudio";

const scenario: LessonScenario = {
  profile: {
    eyebrow: "Linked List Algorithms - Loop Detection",
    definition:
      "Detect Loop uses slow and fast pointers; if the fast pointer laps the slow pointer, the list contains a cycle.",
    time: "O(n)",
    space: "O(1)",
    mode: "cycle",
    variant: "detect-loop-file",
    cards: [
      { title: "Two Speeds", body: "Slow moves one link while fast moves two links." },
      { title: "Meeting Means Cycle", body: "In a loop, fast eventually catches slow.", highlight: true },
      { title: "Null Means Safe", body: "If fast reaches null, the list has no cycle." },
      { title: "No Extra Set", body: "Floyd-style detection avoids storing visited nodes." },
    ],
    code: ["slow = head; fast = head", "while fast and fast.next:", "  slow = slow.next", "  fast = fast.next.next", "  if slow == fast: return true"],
  },
  nodes: [
    { id: "N1", value: "7", x: 90, y: 215 },
    { id: "N2", value: "14", x: 210, y: 215 },
    { id: "N3", value: "21", x: 330, y: 215 },
    { id: "N4", value: "28", x: 450, y: 215 },
    { id: "N5", value: "35", x: 570, y: 215 },
  ],
  steps: [
    { message: "Place slow and fast at head.", line: 0, active: ["N1"], pointers: { slow: "N1", fast: "N1" } },
    { message: "Slow moves one step; fast moves two.", line: 2, active: ["N2", "N3"], pointers: { slow: "N2", fast: "N3" } },
    { message: "Because the tail links back, fast does not reach null.", line: 3, active: ["N3", "N5"], pointers: { slow: "N3", fast: "N5" } },
    { message: "Fast catches slow inside the loop, proving a cycle exists.", line: 4, active: ["N4"], warn: ["N2"], pointers: { slow: "N4", fast: "N4", result: "loop found" } },
  ],
};

export default function Lesson() {
  return <LinkedListLessonStudio lessonId="detect-loop" title="Detect Loop" scenario={scenario} />;
}
