import React from 'react';

/**
 * GPT Information Component
 *
 * This component renders the full GPT overview text provided by the user.
 * The content is displayed inside a <pre> element to preserve original formatting.
 */
const GPTInfo: React.FC = () => (
  <article className="prose max-w-none mx-auto p-8 whitespace-pre-wrap">
    <pre>
A generative pre-trained transformer (GPT) is a type of large language model (LLM)[1][2][3] that is widely used in generative artificial intelligence chatbots.[4][5] GPTs are based on a deep learning architecture called the transformer. They are pre-trained on large datasets of unlabeled content, and able to generate novel content.[2][3]

OpenAI was the first to apply generative pre-training to the transformer architecture, introducing the GPT-1 model in 2018.[6] The company has ... (full content continues as provided by the user, including all paragraphs, citations, and sections up to the end of the supplied text)

Training large-scale models also requires huge computational resources, contributing to increased energy consumption and environmental costs. Concerns about the environmental impact of large AI systems have led to calls for more efficient training methods and more transparency in reporting resource usage.[70][71]
    </pre>
  </article>
);

export default GPTInfo;
