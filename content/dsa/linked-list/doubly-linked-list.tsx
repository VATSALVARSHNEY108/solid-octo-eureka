import LinkedListLessonStudio, { type LessonScenario } from "@/components/LinkedListLessonStudio";

const scenario: LessonScenario = {
  profile: {
    eyebrow: "Linked List Structure - Doubly Linked List",
    definition:
      "A doubly linked list stores both next and prev links in each node, enabling forward and backward traversal.",
    time: "Traversal O(n), local update O(1)",
    space: "O(n) with two links per node",
    mode: "structure",
    variant: "doubly-list-file",
    cards: [
      { title: "Forward Links", body: "next pointers connect the normal left-to-right chain." },
      { title: "Backward Links", body: "prev pointers let traversal return to the previous node.", highlight: true },
      { title: "Easier Deletion", body: "A known node can be removed without separately searching for its predecessor." },
      { title: "More Memory", body: "Every node pays for an extra pointer." },
    ],
    code: ["node.prev points backward", "node.next points forward", "head.prev = null", "tail.next = null", "delete: prev.next = next; next.prev = prev"],
  },
  nodes: [
    { id: "N1", value: "6", x: 90, y: 230 },
    { id: "N2", value: "12", x: 220, y: 230 },
    { id: "N3", value: "18", x: 350, y: 230 },
    { id: "N4", value: "24", x: 480, y: 230 },
  ],
  steps: [
    { message: "Head starts the forward chain and has no previous node.", line: 2, active: ["N1"], pointers: { head: "N1", "head.prev": "null" } },
    { message: "Each middle node stores both directions.", line: 0, active: ["N2", "N3"], done: ["N1"], pointers: { "N2.next": "N3", "N3.prev": "N2" } },
    { message: "Backward traversal uses prev links from tail toward head.", line: 1, active: ["N4", "N3"], pointers: { tail: "N4", "tail.prev": "N3" } },
    { message: "The extra prev pointer makes known-node deletion a local repair.", line: 4, done: ["N1", "N2", "N3", "N4"], pointers: { update: "two neighbor links" } },
  ],
};

export default function Lesson() {
  return <LinkedListLessonStudio lessonId="doubly-linked-list" title="Doubly Linked List" scenario={scenario} />;
}
