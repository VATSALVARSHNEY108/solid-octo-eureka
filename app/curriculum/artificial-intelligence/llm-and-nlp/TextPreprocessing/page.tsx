// page.tsx – Server component wrapper for TextPreprocessing
import TextPreprocessing from "@/content/artificial-intelligence/llm-and-nlp/TextPreprocessing";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Pre‑processing – NLP Lesson",
  description: "Interactive simulation of common text preprocessing steps: normalization, punctuation removal, tokenization.",
};

export default function Page() {
  return <TextPreprocessing />;
}
