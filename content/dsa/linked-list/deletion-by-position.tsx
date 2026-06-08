import LinkedListLessonStudio, { type LessonScenario } from "@/components/LinkedListLessonStudio";

const scenario: LessonScenario = {
  profile: {
    eyebrow: "Linked List Operations - Delete By Position",
    definition:
      "Deletion By Position first walks to the predecessor of the index, then bypasses the target node without losing the rest of the chain.",
    time: "O(n)",
    space: "O(1)",
    mode: "delete",
    variant: "delete-position-file",
    cards: [
      { title: "Find Predecessor", body: "The pointer must stop one node before the position being deleted." },
      { title: "Keep Target", body: "Store prev.next as target before changing any link.", highlight: true },
      { title: "Bypass", body: "prev.next jumps to target.next." },
      { title: "Bounds Matter", body: "Invalid positions, head deletion, and tail deletion need checks." },
    ],
    code: ["prev = node at position - 1", "target = prev.next", "prev.next = target.next", "target.next = null"],
  },
  nodes: [
    { id: "N1", value: "4", x: 90, y: 230 },
    { id: "N2", value: "9", x: 210, y: 230 },
    { id: "N3", value: "15", x: 330, y: 230 },
    { id: "N4", value: "21", x: 450, y: 230 },
    { id: "N5", value: "30", x: 570, y: 230 },
  ],
  steps: [
    { message: "For position 2, traverse until prev is at position 1.", line: 0, active: ["N2"], done: ["N1"], pointers: { position: "2", prev: "N2" } },
    { message: "The target is prev.next.", line: 1, active: ["N2", "N3"], pointers: { prev: "N2", target: "N3" } },
    { message: "Bypass the target by linking prev to target.next.", line: 2, active: ["N2", "N4"], warn: ["N3"], pointers: { "prev.next": "N4", target: "N3" } },
    { message: "Detach the target node so it no longer points into the list.", line: 3, done: ["N1", "N2", "N4", "N5"], warn: ["N3"], pointers: { "target.next": "null" } },
  ],
};

export default function Lesson() {
  return <LinkedListLessonStudio lessonId="deletion-by-position" title="Deletion By Position" scenario={scenario} />;
}
