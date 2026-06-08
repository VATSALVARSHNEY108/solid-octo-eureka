import LinkedListLessonStudio, { type LessonScenario } from "@/components/LinkedListLessonStudio";

const scenario: LessonScenario = {
  profile: {
    eyebrow: "Linked List Structure - Circular List",
    definition:
      "A circular linked list replaces the final null with a tail-to-head link, so traversal can continue around the ring.",
    time: "Traversal O(n)",
    space: "O(n)",
    mode: "structure",
    variant: "circular-singly-file",
    cards: [
      { title: "No Null Tail", body: "The last node points back to head instead of ending at null." },
      { title: "Ring Traversal", body: "Algorithms must stop after returning to the start node.", highlight: true },
      { title: "Tail Access", body: "Keeping a tail pointer makes insertion after tail efficient." },
      { title: "Use Cases", body: "Round-robin scheduling and repeated cycles naturally match circular lists." },
    ],
    code: ["tail.next = head", "curr = head", "do visit(curr)", "curr = curr.next", "while curr != head"],
  },
  nodes: [
    { id: "N1", value: "A", x: 110, y: 215 },
    { id: "N2", value: "B", x: 250, y: 180 },
    { id: "N3", value: "C", x: 430, y: 180 },
    { id: "N4", value: "D", x: 570, y: 215 },
  ],
  links: [
    { from: "N1", to: "N2" },
    { from: "N2", to: "N3" },
    { from: "N3", to: "N4" },
    { from: "N4", to: "N1", kind: "loop", label: "tail.next" },
  ],
  steps: [
    { message: "Start at head and visit the first node normally.", line: 1, active: ["N1"], pointers: { head: "N1", current: "N1" } },
    { message: "Follow next links around the chain.", line: 3, active: ["N2", "N3"], done: ["N1"], pointers: { current: "N3", previous: "N2" } },
    { message: "The tail does not point to null; it points back to head.", line: 0, active: ["N4", "N1"], pointers: { tail: "N4", "tail.next": "N1" } },
    { message: "Stop when traversal returns to head, otherwise the loop never ends.", line: 4, done: ["N1", "N2", "N3", "N4"], pointers: { current: "N1", stop: "current == head" } },
  ],
};

export default function Lesson() {
  return <LinkedListLessonStudio lessonId="circular-linked-list" title="Circular Linked List" scenario={scenario} />;
}
