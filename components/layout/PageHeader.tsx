"use client";

import { useRouter } from "next/navigation";

export function PageHeader({
  showBack = true,
}: {
  showBack?: boolean;
}) {
  const router = useRouter();
  return (
    <div className="mb-6 pl-4">
      {showBack && (
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/80 text-green-950 shadow-sm hover:bg-white transition-colors"
            aria-label="Go back"
          >
            <span className="text-xl leading-none">←</span>
          </button>
        </div>
      )}
    </div>
  );
}