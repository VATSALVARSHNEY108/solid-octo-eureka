"use client";

import StackQueueLessonLab from "@/components/StackQueueLessonLab";

export default function PracticePatternsQueueLesson() {
  return (
    <StackQueueLessonLab
      lessonId="practice-patterns-queue"
      title="Practice Patterns Queue"
      definition="A queue is a linear data structure that follows FIFO (First-In-First-Out): enqueue at the rear, dequeue from the front."
      timeComplexity="O(1) Core Operations"
      spaceComplexity="O(N) Total Storage"
      keyPoints={['FIFO access pattern', 'Enqueue adds to the rear', 'Dequeue removes from the front']}
    />
  );
}
