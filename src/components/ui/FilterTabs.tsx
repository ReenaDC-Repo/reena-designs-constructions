interface FilterTabsProps {
  tabs: readonly string[]
  active: string
  onSelect: (tab: string) => void
}

/**
 * Category filter.
 *
 * Square rather than pill-shaped, to sit with the site's button system, and
 * rendered as a proper tablist so the set is announced as one control instead
 * of a row of unrelated buttons. `aria-pressed` is what tells a screen-reader
 * user which filter is currently applied — colour alone did not.
 */
export default function FilterTabs({ tabs, active, onSelect }: FilterTabsProps) {
  return (
    <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
      {tabs.map((t) => {
        const isActive = active === t
        return (
          <button
            key={t}
            type="button"
            onClick={() => onSelect(t)}
            aria-pressed={isActive}
            className={`montserrat font-700 border px-5 py-2.5 text-[13px] transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 ${
              isActive
                ? "border-navy bg-navy text-white"
                : "border-slate-300 bg-white text-slate-600 hover:border-navy hover:text-navy"
            }`}
          >
            {t}
          </button>
        )
      })}
    </div>
  )
}
