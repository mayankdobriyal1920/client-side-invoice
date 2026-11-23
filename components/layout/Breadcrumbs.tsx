import Link from "next/link";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-3 text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <span className="text-green-700">/</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-text hover:underline">{item.label}</Link>
            ) : (
              <span className="font-medium text-text">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}