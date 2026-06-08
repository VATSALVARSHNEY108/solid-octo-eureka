import LinkedListLessonStudio, { type LessonScenario } from "@/components/LinkedListLessonStudio";

const scenario: LessonScenario = {
  profile: {
    eyebrow: "Linked List Operations - Delete By Value",
    definition:
      "Deletion By Value searches for the first node with the requested data, tracks its predecessor, and bypasses the match.",
    time: "O(n)",
    space: "O(1)",
    mode: "delete",
    variant: "delete-value-file",
    cards: [
      { title: "Search First", body: "The algorithm walks until current.data equals the target value." },
      { title: "Track Previous", body: "Previous is needed because singly linked nodes cannot move backward.", highlight: true },
      { title: "Bypass Match", body: "prev.next skips current and points to current.next." },
      { title: "Missing Value", body: "If traversal reaches null, the list is unchanged." },
    ],
    code: ["prev = null; curr = head", "while curr and curr.val != key:", "  prev = curr; curr = curr.next", "if curr: prev.next = curr.next"],
  },
  nodes: [
    { id: "N1", value: "6", x: 90, y: 230 },
    { id: "N2", value: "14", x: 210, y: 230 },
    { id: "N3", value: "27", x: 330, y: 230 },
    { id: "N4", value: "14", x: 450, y: 230 },
    { id: "N5", value: "35", x: 570, y: 230 },
  ],
  steps: [
    { message: "Search for value 27 from the head.", line: 0, active: ["N1"], pointers: { key: "27", prev: "null", curr: "N1" } },
    { message: "Current is not 27, so advance prev and curr together.", line: 1, active: ["N2"], done: ["N1"], pointers: { prev: "N1", curr: "N2" } },
    { message: "The target value is found at current.", line: 1, active: ["N2", "N3"], pointers: { prev: "N2", curr: "N3", found: "true" } },
    { message: "Bypass the matching node.", line: 3, active: ["N2", "N4"], warn: ["N3"], pointers: { "prev.next": "N4", removed: "N3" } },
    { message: "Only the first matching node is removed.", line: 3, done: ["N1", "N2", "N4", "N5"], warn: ["N3"], pointers: { remaining14: "N4" } },
  ],
};

export default function Lesson() {
  return <LinkedListLessonStudio lessonId="deletion-by-value" title="Deletion By Value" scenario={scenario} />;
}
