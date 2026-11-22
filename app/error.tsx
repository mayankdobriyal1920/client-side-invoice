"use client";
export default function ErrorBoundary({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <button onClick={reset} className="mt-4 px-4 py-2 rounded-xl bg-green-700 text-white">Try again</button>
    </section>
  );
}