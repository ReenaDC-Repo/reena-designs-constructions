import { Link } from "react-router-dom"

interface BreadcrumbItem {
  label: string
  href?: string
}

/**
 * Page trail.
 *
 * The matching BreadcrumbList structured data is built from the same crumbs in
 * `src/data/routes.ts` and ships in the page graph — including in the
 * prerendered HTML — rather than being appended here as a second script.
 */
export default function Breadcrumb({
  items,
  onDark = false,
}: {
  items: BreadcrumbItem[]
  /** Inverts the palette for a trail sitting on a dark header. */
  onDark?: boolean
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`mb-6 flex items-center gap-2 text-sm ${onDark ? "text-white/35" : "text-slate-400"}`}
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <span key={`${item.label}-${i}`} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {item.href && !isLast ? (
              <Link
                to={item.href}
                className={`hover:underline ${onDark ? "text-white/70" : "text-slate-600"}`}
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current={isLast ? "page" : undefined}
                className={
                  isLast
                    ? `font-600 ${onDark ? "text-white" : "text-navy"}`
                    : onDark
                      ? "text-white/70"
                      : "text-slate-600"
                }
              >
                {item.label}
              </span>
            )}
          </span>
        )
      })}
    </nav>
  )
}
