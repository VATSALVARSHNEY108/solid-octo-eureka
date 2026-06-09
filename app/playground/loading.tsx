import TetrisLoading from "@/components/ui/tetris-loader";

export default function PlaygroundLoading() {
  return (
    <div className="flex h-screen flex-col bg-[var(--bg-primary)] items-center justify-center p-6">
      <TetrisLoading size="lg" speed="normal" loadingText="Loading Playground..." />
    </div>
  );
}
