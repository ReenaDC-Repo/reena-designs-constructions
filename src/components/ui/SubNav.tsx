import { Link, useLocation } from "react-router-dom"

type SubNavTab = { label: string; href: string }

/**
 * Section tabs.
 *
 * Two things changed here. These were plain `<a href>` elements, so every tab
 * click tore down the SPA and re-downloaded the whole bundle — `<Link>` keeps
 * it client-side. And `active` used to be passed in by hand from each of the
 * four calling pages, which is state the router already knows; deriving it
 * means a tab can never be mislabelled after a route rename.
 */
export default function SubNav({ tabs }: { tabs: SubNavTab[] }) {
  const { pathname } = useLocation()

  return (
    <nav aria-label="Section" className="mb-8 flex gap-6 border-b border-hairline">
      {tabs.map((tab) => {
        const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`)
        return (
          <Link
            key={tab.href}
            to={tab.href}
            aria-current={active ? "page" : undefined}
            className={`montserrat font-700 -mb-px border-b-2 pb-3 text-sm transition-colors ${
              active
                ? "border-brand text-navy"
                : "border-transparent text-slate-500 hover:text-slate-600"
            }`}
          >
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
