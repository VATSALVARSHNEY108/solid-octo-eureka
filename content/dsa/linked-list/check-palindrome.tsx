import LinkedListLessonStudio, { type LessonScenario } from "@/components/LinkedListLessonStudio";

const scenario: LessonScenario = {
  profile: {
    eyebrow: "Linked List Algorithms - Palindrome Check",
    definition:
      "Check Palindrome finds the middle, reverses the second half, then compares mirrored nodes without copying the whole list.",
    time: "O(n)",
    space: "O(1)",
    mode: "traverse",
    variant: "palindrome-file",
    cards: [
      { title: "Find Center", body: "Slow and fast pointers locate the midpoint in one pass." },
      { title: "Reverse Half", body: "The second half is reversed so both ends can be compared forward.", highlight: true },
      { title: "Compare Pairs", body: "Left and right pointers must match at every step." },
      { title: "Restore Optional", body: "Production code may reverse the second half again to preserve the list." },
    ],
    code: ["mid = slowFast(head)", "right = reverse(mid.next)", "left = head", "while right:", "  if left.val != right.val: false", "  advance both"],
  },
  nodes: [
    { id: "N1", value: "r", x: 90, y: 230 },
    { id: "N2", value: "a", x: 210, y: 230 },
    { id: "N3", value: "d", x: 330, y: 230 },
    { id: "N4", value: "a", x: 450, y: 230 },
    { id: "N5", value: "r", x: 570, y: 230 },
  ],
  steps: [
    { message: "Slow and fast pointers scan to locate the middle node.", line: 0, active: ["N3"], pointers: { slow: "N3", fast: "N5", middle: "N3" } },
    { message: "Reverse the second half so comparison can move forward from both sides.", line: 1, active: ["N4", "N5"], pointers: { rightHead: "N5", reversed: "r -> a" } },
    { message: "Compare the outside pair: r equals r.", line: 3, active: ["N1", "N5"], done: ["N3"], pointers: { left: "N1", right: "N5", match: "true" } },
    { message: "Compare the next pair: a equals a.", line: 3, active: ["N2", "N4"], done: ["N1", "N5"], pointers: { left: "N2", right: "N4", match: "true" } },
    { message: "All mirrored pairs matched, so the list is a palindrome.", line: 5, done: ["N1", "N2", "N3", "N4", "N5"], pointers: { result: "true" } },
  ],
};

export default function Lesson() {
  return <LinkedListLessonStudio lessonId="check-palindrome" title="Check Palindrome" scenario={scenario} />;
}
