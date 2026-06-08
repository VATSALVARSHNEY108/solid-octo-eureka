import LinkedListLessonStudio, { type LessonScenario } from "@/components/LinkedListLessonStudio";

const scenario: LessonScenario = {
  profile: {
    eyebrow: "Linked List Operations - DLL Deletion",
    definition:
      "Deletion in DLL removes a node by repairing both neighbor links: previous.next and next.previous.",
    time: "O(1) when node is known",
    space: "O(1)",
    mode: "delete",
    variant: "delete-dll-file",
    cards: [
      { title: "Two Neighbors", body: "The target can see both previous and next nodes." },
      { title: "Forward Repair", body: "previous.next skips the target.", highlight: true },
      { title: "Backward Repair", body: "next.prev also skips the target." },
      { title: "Boundary Nodes", body: "Head and tail deletions update external head/tail pointers." },
    ],
    code: ["prev = target.prev", "next = target.next", "prev.next = next", "next.prev = prev", "detach target"],
  },
  nodes: [
    { id: "N1", value: "4", x: 90, y: 230 },
    { id: "N2", value: "12", x: 220, y: 230 },
    { id: "N3", value: "20", x: 350, y: 230 },
    { id: "N4", value: "28", x: 480, y: 230 },
  ],
  steps: [
    { message: "The target has both previous and next links.", line: 0, active: ["N2", "N3", "N4"], pointers: { prev: "N2", target: "N3", next: "N4" } },
    { message: "Repair the forward link: prev.next skips target.", line: 2, active: ["N2", "N4"], warn: ["N3"], pointers: { "prev.next": "N4" } },
    { message: "Repair the backward link: next.prev skips target.", line: 3, active: ["N4", "N2"], warn: ["N3"], pointers: { "next.prev": "N2" } },
    { message: "Detach the removed node from both directions.", line: 4, done: ["N1", "N2", "N4"], warn: ["N3"], pointers: { "target.prev": "null", "target.next": "null" } },
  ],
};

export default function Lesson() {
  return <LinkedListLessonStudio lessonId="deletion-in-dll" title="Deletion In Dll" scenario={scenario} />;
}
