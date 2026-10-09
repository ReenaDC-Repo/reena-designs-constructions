import { useEffect, useId, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, ArrowRight, CornerDownLeft } from "lucide-react"
import { SITE } from "@/data/siteInfo"
import { FAQS } from "@/data/faq"

/**
 * Hero search.
 *
 * A real index of the site rather than a decorative input: every entry
 * resolves to a route that exists, so pressing Enter always lands somewhere
 * useful. It is a combobox, which means it owes the keyboard everything the
 * mouse gets — arrows to move, Enter to open, Escape to dismiss — and it owes
 * a screen reader `aria-activedescendant`, because moving a visual highlight
 * is not the same as moving focus.
 *
 * The index is built from two layers, not just page titles, because
 * visitors do not search for page titles:
 *  1. Every route on the site (`PAGES`), with the terms someone would type to
 *     reach it — "modular kitchen" for the residential interior page, "rate"
 *     or "per sq ft" for the enquiry form.
 *  2. Every FAQ question (`FAQS`), so "warranty" or "home loan" surfaces the
 *     exact answer rather than a generic page.
 * Both funnel through the same fuzzy, multi-word scorer, so results from
 * different layers rank against each other on relevance, not on which layer
 * they came from.
 */
type Entry = {
  label: string
  href: string
  kind: string
  keys: string[]
  /** Extra searchable text shown as a one-line snippet under the result. */
  snippet?: string
}

const PAGES: Entry[] = [
  {
    label: "Home",
    href: "/",
    kind: "Page",
    keys: ["home", "homepage", "main", "start"],
  },
  {
    label: "Get a free quote",
    href: "/contact",
    kind: "Enquiry",
    keys: ["quote", "quotation", "estimate", "cost", "price", "rate", "per sq ft", "budget", "enquiry", "contact", "call", "phone", "whatsapp", "email", "site visit"],
  },
  {
    label: "What's Included",
    href: "/whats-included",
    kind: "Costs",
    keys: ["cement", "sand", "tmt", "steel", "bar", "bricks", "labour", "labor", "material", "materials", "grade", "included", "cost heads", "exclusions", "isi"],
  },
  {
    label: "Our Services",
    href: "/services",
    kind: "Overview",
    keys: ["services", "what we do", "disciplines", "offerings", "capabilities"],
  },
  {
    label: "Building Construction",
    href: "/services",
    kind: "Service",
    keys: ["construction", "build", "house", "home", "residential", "commercial", "structure", "rcc", "frame", "civil"],
  },
  {
    label: "Architectural Design",
    href: "/services",
    kind: "Service",
    keys: ["architect", "architecture", "drawing", "plan", "planning", "sanction", "approval", "elevation", "design"],
  },
  {
    label: "Structural Engineering",
    href: "/services",
    kind: "Service",
    keys: ["structural", "engineer", "load", "seismic", "column", "beam", "foundation", "footing"],
  },
  {
    label: "Renovation & Remodeling",
    href: "/our-work/renovation",
    kind: "Service",
    keys: ["renovation", "remodel", "remodeling", "remodelling", "retrofit", "makeover", "repair", "old house"],
  },
  {
    label: "Residential Interior",
    href: "/our-work/interior/residential",
    kind: "Interiors",
    keys: ["interior", "interiors", "modular kitchen", "kitchen", "bedroom", "wardrobe", "living room", "pooja", "false ceiling"],
  },
  {
    label: "Commercial Interior",
    href: "/our-work/interior/commercial",
    kind: "Interiors",
    keys: ["office", "commercial", "showroom", "retail", "workspace", "shop", "hotel", "institutional"],
  },
  {
    label: "Our Work",
    href: "/our-work",
    kind: "Gallery",
    keys: ["our work", "gallery", "galleries", "portfolio", "photos", "pictures"],
  },
  {
    label: "Exterior Design Gallery",
    href: "/our-work/exterior",
    kind: "Gallery",
    keys: ["exterior", "facade", "elevation design", "front design", "outside"],
  },
  {
    label: "Architecture Gallery",
    href: "/our-work/architecture",
    kind: "Gallery",
    keys: ["architecture gallery", "drawings", "working drawing", "blueprint"],
  },
  {
    label: "3D Design & Elevation",
    href: "/our-work/3d-design",
    kind: "Gallery",
    keys: ["3d", "render", "rendering", "elevation", "visualisation", "visualization", "front design"],
  },
  {
    label: "Client Testimonials (coming soon)",
    href: "/our-work/testimonials",
    kind: "Trust",
    keys: ["testimonial", "testimonials", "review", "reviews", "client", "rating", "feedback", "what clients say"],
  },
  {
    label: "Learn With Us",
    href: "/learn-from-us",
    kind: "Training",
    keys: [
      "autocad", "course", "courses", "training", "learn", "draughting", "cad", "2d", "3d", "class", "batch",
      "revit", "sketchup", "primavera", "p6", "blenderbim", "blender", "bim", "staad", "staad.pro", "etabs",
      "lumion", "v-ray", "vray", "rendering software", "structural analysis", "scheduling",
    ],
  },
  {
    label: "Careers",
    href: "/careers",
    kind: "Company",
    keys: ["career", "careers", "job", "jobs", "vacancy", "vacancies", "hiring", "apply", "work with us", "resume"],
  },
  {
    label: "Common Questions",
    href: "/faq",
    kind: "Help",
    keys: ["faq", "faqs", "question", "questions", "how long", "timeline", "warranty", "payment", "emi", "home loan"],
  },
  {
    label: "About Us",
    href: "/about",
    kind: "Company",
    keys: ["about", "who", "who we are", "team", "company", "experience", "years", "iso", "story", "values"],
  },
  {
    label: "Privacy Policy",
    href: "/privacy",
    kind: "Legal",
    keys: ["privacy", "data", "personal information"],
  },
  {
    label: "Cookie Policy",
    href: "/cookies",
    kind: "Legal",
    keys: ["cookie", "cookies", "browser storage"],
  },
]

/** Every FAQ answer, searchable and linking straight to the FAQ page. */
const FAQ_ENTRIES: Entry[] = FAQS.map((f) => ({
  label: f.q,
  href: "/faq",
  kind: "FAQ",
  keys: [],
  snippet: f.a,
}))

const INDEX: Entry[] = [...PAGES, ...FAQ_ENTRIES]

/** Bounded Levenshtein distance — the strings here are never more than a word or two long. */
function editDistance(a: string, b: string): number {
  const m = a.length
  const n = b.length
  if (Math.abs(m - n) > 2) return 3
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1])
    }
  }
  return dp[m][n]
}

/**
 * Score a single search token against one field's word list, tolerating
 * short typos ("kichen" still finds "kitchen") without letting fuzzy matches
 * outrank a real one.
 */
function bestWordScore(words: string[], token: string, exact: number, prefix: number, substring: number, fuzzy: number): number {
  let best = 0
  for (const w of words) {
    if (w === token) return exact
    if (w.startsWith(token)) best = Math.max(best, prefix)
    else if (w.includes(token)) best = Math.max(best, substring)
    else if (token.length >= 4 && Math.abs(w.length - token.length) <= 1 && editDistance(w, token) === 1) {
      best = Math.max(best, fuzzy)
    }
  }
  return best
}

/** How well one query token matches one entry, across label, keys and snippet. */
function tokenScore(entry: Entry, token: string): number {
  const labelWords = entry.label.toLowerCase().split(/\s+/)
  const labelWhole = [entry.label.toLowerCase()]
  let score = bestWordScore(labelWhole, token, 100, 88, 62, 0)
  score = Math.max(score, bestWordScore(labelWords, token, 95, 78, 55, 42))
  score = Math.max(score, bestWordScore(entry.keys, token, 90, 76, 48, 38))
  if (entry.snippet) {
    const snippetWords = entry.snippet.toLowerCase().split(/\s+/)
    score = Math.max(score, bestWordScore(snippetWords, token, 40, 32, 24, 0))
  }
  return score
}

/**
 * Rank an entry against the whole query. Every token has to hit *something*
 * for the entry to count — otherwise a two-word query like "kitchen weather"
 * would still surface the kitchen page on the strength of one matching word,
 * which looks broken rather than smart. Coverage then scales the total, so a
 * query that fully matches beats one that only partially does.
 */
function score(entry: Entry, tokens: string[]): number {
  let total = 0
  let matched = 0
  for (const t of tokens) {
    const s = tokenScore(entry, t)
    if (s > 0) {
      matched++
      total += s
    }
  }
  if (matched === 0) return 0
  if (matched < tokens.length) total *= 0.35
  return total
}

const SUGGESTED = ["Modular kitchen", "Cost per sq ft", "3D elevation", "Warranty", "Ongoing projects"]

export default function SiteSearch() {
  const navigate = useNavigate()
  const listId = useId()
  const [q, setQ] = useState("")
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const wrap = useRef<HTMLDivElement>(null)

  const results = useMemo(() => {
    const tokens = q.trim().toLowerCase().split(/\s+/).filter(Boolean)
    if (tokens.length === 0 || tokens.every((t) => t.length < 2)) return []
    return INDEX.map((e) => ({ e, s: score(e, tokens) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 8)
      .map((r) => r.e)
  }, [q])

  // A click outside dismisses the list. Without it the panel stays open over
  // the hero after the visitor has moved on.
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("pointerdown", onDown)
    return () => document.removeEventListener("pointerdown", onDown)
  }, [open])

  useEffect(() => setActive(0), [q])

  const go = (entry?: Entry) => {
    const target = entry ?? results[active]
    if (target) {
      setOpen(false)
      setQ("")
      navigate(target.href)
      return
    }
    // Nothing matched: hand the words to the enquiry form rather than dropping
    // them, so the visitor does not have to type the question twice.
    if (q.trim()) navigate(`/contact?project=${encodeURIComponent(q.trim())}`)
  }

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (!results.length) return
      e.preventDefault()
      setOpen(true)
      setActive((i) => (e.key === "ArrowDown" ? (i + 1) % results.length : (i - 1 + results.length) % results.length))
      return
    }
    if (e.key === "Enter") {
      e.preventDefault()
      go()
      return
    }
    if (e.key === "Escape") setOpen(false)
  }

  const typed = q.trim().length >= 2
  const showList = open && results.length > 0
  /* Nothing matched. The Enter key already does something sensible — it hands
     the words to the enquiry form rather than dropping them — but silently, so
     the visitor got a field that appeared to ignore them. Saying so, and
     saying what Enter will do, turns a dead end into an offer. */
  const showEmpty = open && typed && results.length === 0

  return (
    <div ref={wrap} className="relative w-full max-w-lg">
      <div
        className="flex items-center gap-3 border border-slate-300 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm transition focus-within:border-brand focus-within:ring-2 focus-within:ring-orange-500/20"
        role="combobox"
        aria-expanded={showList || showEmpty}
        aria-owns={listId}
        aria-haspopup="listbox"
      >
        <Search size={17} strokeWidth={2.2} className="flex-none text-slate-500" aria-hidden="true" />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
          type="text"
          /* 16px on a phone: anything smaller makes iOS Safari zoom the
             viewport in on focus and never zoom back out. */
          className="min-w-0 flex-1 bg-transparent text-base text-navy outline-none placeholder:text-slate-400 sm:text-sm"
          placeholder="Search anything — kitchen, warranty, cost per sq ft, 3D elevation…"
          aria-label="Search the site"
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showList ? `${listId}-${active}` : undefined}
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => go()}
          aria-label="Search"
          className="btn-orange montserrat font-700 flex-none px-3.5 py-2 text-[12px]"
        >
          <ArrowRight size={14} strokeWidth={2.4} aria-hidden="true" />
        </button>
      </div>

      {showEmpty && (
        <div className="absolute top-full left-0 z-50 mt-2 w-full border border-slate-200 bg-white px-4 py-3 shadow-2xl">
          <p className="text-[13px] leading-relaxed text-slate-600">
            No page matches “<span className="font-600 text-navy">{q.trim()}</span>”.
          </p>
          <p className="mt-1 text-[12px] leading-relaxed text-slate-500">
            Press Enter and we will put it straight into an enquiry, or call{" "}
            <a href={SITE.phoneHref} className="font-600 text-brand-ink underline underline-offset-2">
              {SITE.phones[0]}
            </a>
            .
          </p>
        </div>
      )}

      {showList && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Search results"
          className="absolute top-full left-0 z-50 mt-2 max-h-[70vh] w-full overflow-y-auto overflow-x-hidden border border-slate-200 bg-white py-1.5 shadow-2xl"
        >
          {results.map((r, i) => (
            <li key={`${r.kind}-${r.label}-${r.href}`} id={`${listId}-${i}`} role="option" aria-selected={i === active}>
              <button
                type="button"
                /* `onMouseDown` rather than `onClick`: the input's blur fires
                   first and would close the list out from under the click. */
                onMouseDown={(e) => {
                  e.preventDefault()
                  go(r)
                }}
                onMouseEnter={() => setActive(i)}
                className={`flex w-full flex-col gap-0.5 px-4 py-2.5 text-left transition-colors ${
                  i === active ? "bg-orange-50" : "bg-white"
                }`}
              >
                <span className="flex w-full items-center gap-3">
                  <span className="montserrat font-700 min-w-0 flex-1 truncate text-[13px] text-navy">
                    {r.label}
                  </span>
                  <span className="flex-none text-[10px] uppercase tracking-[0.16em] text-slate-600">
                    {r.kind}
                  </span>
                  {i === active && (
                    <CornerDownLeft size={13} strokeWidth={2.2} className="flex-none text-brand" aria-hidden="true" />
                  )}
                </span>
                {r.snippet && (
                  <span className="line-clamp-1 pl-0 text-[11.5px] leading-snug text-slate-500">{r.snippet}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Openers, so the field is not a blank box the visitor has to guess at.
          They stand down once there are real results — two rows of things to
          click, one of them stale, is worse than one.
          Kept to a single row: the field is sized so all five fit on a
          laptop, and on a phone the row scrolls sideways rather than wrapping. */}
      <div className="no-scrollbar mt-3 flex flex-nowrap items-center gap-2 overflow-x-auto" hidden={showList || showEmpty}>
        {SUGGESTED.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setQ(s)
              setOpen(true)
            }}
            /* White on a translucent dark fill, not slate-on-white: these sit
               over the hero video, where the old light chip lost both its
               border and its label against the footage. */
            className="shrink-0 whitespace-nowrap border border-white/35 bg-white/10 px-2.5 py-1 text-[11px] text-white/90 backdrop-blur-sm transition hover:border-orange-400 hover:bg-white/20 hover:text-white"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
