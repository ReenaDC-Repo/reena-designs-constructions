import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Home, Hammer, Images, Sofa, Phone, Compass } from "lucide-react"
import PageWrapper from "@/components/layout/PageWrapper"
import Seo from "@/components/Seo"
import { SITE_CONTAINER } from "@/components/layout/constants"

const DESTINATIONS = [
  { label: "Home", href: "/", Icon: Home, copy: "Back to the start" },
  { label: "Services", href: "/services", Icon: Hammer, copy: "Everything we offer" },
  { label: "Our Work", href: "/our-work", Icon: Images, copy: "Completed projects" },
  { label: "Interiors", href: "/our-work/interior/residential", Icon: Sofa, copy: "Residential interiors" },
  { label: "Contact", href: "/contact", Icon: Phone, copy: "Talk to an engineer" },
]

/** Blocky technical numerals, drawn as outlines rather than set as text so the
 *  draw-on animation can measure them with `getTotalLength()`. */
const FOUR = "M70 0H100V110H120V140H100V180H70V140H0V110Z"
const ZERO_OUTER = "M0 30A30 30 0 0 1 30 0H70A30 30 0 0 1 100 30V150A30 30 0 0 1 70 180H30A30 30 0 0 1 0 150Z"
const ZERO_INNER = "M30 42V138H70V42Z"

export default function NotFound() {
  const svgRef = useRef<SVGSVGElement>(null)

  // Measure each line so it draws itself in, matching the hero blueprint.
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    svg.querySelectorAll<SVGGeometryElement>(".bp-draw").forEach((el, i) => {
      let len = 900
      try {
        len = Math.max(el.getTotalLength(), 1)
      } catch {
        /* shape does not support measurement — keep the fallback */
      }
      el.style.setProperty("--dl", `${len}`)
      if (!el.style.getPropertyValue("--dd")) el.style.setProperty("--dd", `${i * 0.06}s`)
    })
  }, [])

  return (
    <PageWrapper>
      {/* Head handling moved to the shared <Seo> component. The hand-rolled
          version appended a second robots tag alongside the one in index.html;
          Seo mutates the existing tag instead, so the page is unambiguously
          noindex while mounted and hands the value back on the way out. */}
      <Seo
        title="Page not found"
        description="That page does not exist. Find our services, project galleries and contact details here."
        noindex
      />
      <section className="relative overflow-hidden bg-white py-20 lg:py-28">
        {/* Drafting grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(26,39,68,0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(26,39,68,0.055) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(110% 90% at 50% 40%, #000 35%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(110% 90% at 50% 40%, #000 35%, transparent 100%)",
          }}
        />

        <div className={`${SITE_CONTAINER} relative grid items-center gap-14 lg:grid-cols-2`}>
          {/* ── Drawn 404 ─────────────────────────────────────── */}
          <div>
            <svg
              ref={svgRef}
              viewBox="0 0 560 320"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Error 404 — the requested page does not exist"
              className="h-auto w-full max-w-[560px]"
            >
              <defs>
                <linearGradient id="nf-ink" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--color-navy)" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="var(--color-navy)" stopOpacity="0.72" />
                </linearGradient>
              </defs>

              <g stroke="url(#nf-ink)" fill="none" strokeLinejoin="round" strokeLinecap="round">
                {/* Numerals */}
                <g strokeWidth="2.4">
                  <path className="bp-draw" d={FOUR} transform="translate(40 60)" style={{ ["--dd" as string]: "0s" }} />
                  <path className="bp-draw" d={ZERO_OUTER} transform="translate(216 60)" style={{ ["--dd" as string]: "0.18s" }} />
                  <path className="bp-draw" d={ZERO_INNER} transform="translate(216 60)" style={{ ["--dd" as string]: "0.34s" }} />
                  <path className="bp-draw" d={FOUR} transform="translate(376 60)" style={{ ["--dd" as string]: "0.5s" }} />
                </g>

                {/* Hatching inside the zero — the void */}
                <g strokeWidth="0.7" opacity="0.4">
                  <path
                    className="bp-draw"
                    d={Array.from({ length: 9 }, (_, i) => `M${248 + i * 12} 198l18 -18`).join("")}
                    style={{ ["--dd" as string]: "0.6s" }}
                  />
                </g>

                {/* Dimension chain across the numerals */}
                <g strokeWidth="0.9" opacity="0.8">
                  <path className="bp-draw" d="M40 268h456M40 262v12M496 262v12" style={{ ["--dd" as string]: "0.72s" }} />
                  <path className="bp-draw" d="M20 60v180M14 60h12M14 240h12" style={{ ["--dd" as string]: "0.8s" }} />
                </g>

                {/* Ground line + earth hatch */}
                <g>
                  <path className="bp-draw" d="M20 296h520" strokeWidth="1.8" style={{ ["--dd" as string]: "0.66s" }} />
                  <path
                    className="bp-draw"
                    d={Array.from({ length: 26 }, (_, i) => `M${30 + i * 20} 296l-9 10`).join("")}
                    strokeWidth="0.7"
                    opacity="0.45"
                    style={{ ["--dd" as string]: "0.88s" }}
                  />
                </g>

                {/* Detail bubble on the missing sheet */}
                <g strokeWidth="1" opacity="0.55">
                  <circle className="bp-draw" cx="500" cy="86" r="30" strokeDasharray="5 5" style={{ ["--dd" as string]: "0.94s" }} />
                </g>
              </g>

              {/* Annotations */}
              <g fontFamily="monospace">
                <text x="268" y="256" fill="var(--color-brand)" fontSize="12" fontWeight="bold" textAnchor="middle" opacity="0.9">
                  SHEET NOT IN SET
                </text>
                <text x="12" y="150" fill="var(--color-navy)" fontSize="10" textAnchor="middle" transform="rotate(-90 12 150)" opacity="0.5">
                  DWG-404
                </text>
                <text x="500" y="90" fill="var(--color-navy)" fontSize="10" textAnchor="middle" opacity="0.55">
                  REV —
                </text>
              </g>

              {/* Travelling pulse along the ground line */}
              <path
                className="bp-flow bp-flow-live"
                d="M20 296h520"
                stroke="var(--color-brand)"
                strokeWidth="2.2"
                style={{ ["--fl" as string]: "520", ["--seg" as string]: "90", ["--gap" as string]: "1650", ["--end" as string]: "-1130", ["--fd" as string]: "5.5s" }}
              />
            </svg>
          </div>

          {/* ── Copy ──────────────────────────────────────────── */}
          <div>
            <p className="montserrat font-700 mb-3 text-[11px] uppercase tracking-[0.3em] text-brand-ink">
              Error 404
            </p>
            <h1 className="montserrat font-800 text-3xl leading-tight md:text-4xl text-navy">
              This drawing isn't in the set
            </h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-slate-500">
              The page you asked for doesn't exist — it may have been moved, renamed, or the link
              you followed was mistyped. Nothing is broken on your side. Here is where everything
              actually lives.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/"
                className="btn-navy montserrat font-700 group gap-2 px-6 py-3.5"
              >
                Back to home
                <ArrowRight size={15} strokeWidth={2.2} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link
                to="/contact"
                className="btn-outline montserrat font-700 gap-2 px-6 py-3.5"
              >
                <Compass size={15} strokeWidth={2} aria-hidden="true" />
                Tell us what you were looking for
              </Link>
            </div>

            {/* Quick destinations */}
            <div className="mt-10">
              <div className="montserrat font-800 mb-3 text-[10px] uppercase tracking-[0.22em] text-slate-600">
                Jump to
              </div>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {DESTINATIONS.map(({ label, href, Icon, copy }) => (
                  <Link
                    key={href}
                    to={href}
                    className="group flex items-center gap-3 border border-slate-200 bg-white px-4 py-3 transition duration-300 hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-lg hover:shadow-slate-900/5"
                  >
                    <span className="inline-flex h-9 w-9 flex-none items-center justify-center bg-orange-50 text-brand-ink transition duration-300 group-hover:bg-orange-500 group-hover:text-white">
                      <Icon size={16} strokeWidth={1.9} aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="montserrat font-800 block text-[13px] text-navy">
                        {label}
                      </span>
                      <span className="block truncate text-[11px] text-slate-600">{copy}</span>
                    </span>
                    <ArrowRight
                      size={14}
                      strokeWidth={2.2}
                      className="ml-auto flex-none text-slate-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-orange-500"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}
