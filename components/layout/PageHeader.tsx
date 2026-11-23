"use client";

import { useRouter } from "next/navigation";

export function PageHeader({
  showBack = true,
}: {
  showBack?: boolean;
}) {
  const router = useRouter();
  return (
    <div className="mb-6">
      {showBack && (
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="pl-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/80 text-green-950 shadow-sm hover:bg-white"
            aria-label="Go back"
          >
            ←
          </button>
        </div>
      )}
    </div>
  );
}