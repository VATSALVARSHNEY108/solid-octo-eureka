import LinkedListLessonStudio, { type LessonScenario } from "@/components/LinkedListLessonStudio";

const scenario: LessonScenario = {
  profile: {
    eyebrow: "Linked List Algorithms - Digit Addition",
    definition:
      "Add Two Numbers walks two reverse-order digit lists together, creates one output digit per step, and carries overflow into the next node.",
    time: "O(max(n,m))",
    space: "O(max(n,m))",
    mode: "arithmetic",
    variant: "add-two-numbers-file",
    cards: [
      { title: "Two Digit Streams", body: "The upper chain represents l1 and l2 as alternating digit nodes for a compact simulation." },
      { title: "Carry Is State", body: "Carry survives between nodes, so each step depends on the previous sum.", highlight: true },
      { title: "Result Nodes", body: "A new result node is appended for each computed digit." },
      { title: "Uneven Lengths", body: "When one list ends, the other list and carry still continue." },
    ],
    code: ["carry = 0", "while l1 or l2 or carry:", "  total = l1.val + l2.val + carry", "  append(total % 10)", "  carry = total // 10", "  advance inputs"],
  },
  nodes: [
    { id: "N1", value: "2", x: 90, y: 175 },
    { id: "N2", value: "4", x: 230, y: 175 },
    { id: "N3", value: "3", x: 370, y: 175 },
    { id: "N4", value: "5", x: 90, y: 275 },
    { id: "N5", value: "6", x: 230, y: 275 },
  ],
  links: [
    { from: "N1", to: "N2", label: "l1" },
    { from: "N2", to: "N3", label: "l1" },
    { from: "N4", to: "N5", label: "l2" },
  ],
  steps: [
    { message: "Read l1 digit 2 and l2 digit 5 with carry 0.", line: 1, active: ["N1", "N4"], pointers: { l1: "N1", l2: "N4", carry: "0" } },
    { message: "2 + 5 + 0 gives result digit 7.", line: 3, active: ["N1", "N4"], done: ["R1"], pointers: { total: "7", append: "7", carry: "0" } },
    { message: "Advance to the next digit pair: 4 and 6.", line: 5, active: ["N2", "N5"], done: ["R1"], pointers: { l1: "N2", l2: "N5", carry: "0" } },
    { message: "4 + 6 creates digit 0 and carries 1.", line: 4, active: ["N2", "N5"], done: ["R1", "R2"], pointers: { total: "10", append: "0", carry: "1" } },
    { message: "Only l1 has digit 3 left, so 3 + carry 1 creates final digit 4.", line: 2, active: ["N3"], done: ["R1", "R2", "R3"], pointers: { l1: "N3", l2: "null", carry: "1", result: "7 -> 0 -> 4" } },
  ],
};

export default function Lesson() {
  return <LinkedListLessonStudio lessonId="add-two-numbers" title="Add Two Numbers" scenario={scenario} />;
}
