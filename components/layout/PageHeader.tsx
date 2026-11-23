"use client";

import { useRouter } from "next/navigation";
import { Breadcrumbs } from "./Breadcrumbs";

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  showBack = true,
}: {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
  showBack?: boolean;
}) {
  const router = useRouter();
  return (
    <div className="mb-6 pl-4">
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
      <div className="flex items-center gap-3 pl-4">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/80 text-green-950 shadow-sm hover:bg-white"
            aria-label="Go back"
          >
            ←
          </button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-green-950">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}