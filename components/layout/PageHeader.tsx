"use client";

import { useRouter } from "next/navigation";

export function PageHeader({
  showBack = true,
  title,
  subtitle,
}: {
  showBack?: boolean;
  title?: string;
  subtitle?: string;
}) {
  const router = useRouter();
  return (
    <div className="mb-6 pl-4">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/80 text-green-950 shadow-sm hover:bg-white transition-colors"
            aria-label="Go back"
          >
            <span className="text-xl leading-none">←</span>
          </button>
        )}
        <div>
          {title && <h1 className="text-2xl font-bold text-green-950">{title}</h1>}
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}