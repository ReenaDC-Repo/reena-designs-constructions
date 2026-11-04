import { useCallback, useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"
import { SITE_CONTAINER } from "@/components/layout/constants"
import RollingRibbon from "./RollingRibbon"
import SectionTitle from "@/components/ui/SectionTitle"
import { INTERIOR_PROJECTS } from "@/data/interiorProjects"

/**
 * The firm's own interior designs — the same 3D renders and copy as the
 * residential interiors portfolio, so nothing here is stock imagery presented
 * as our work. The copy says "designed", not "completed": these are renders.
 * Only the landscape images are used; the two portrait ones crop to a sliver
 * of the room in a full-bleed slide.
 */
const FEATURED_IDS = [
  "master-bedroom",
  "living-tv-walnut",
  "kitchen-l-shaped",
  "pooja-room",
  "living-kitchen-warm",
  "bedroom-blush",
  "living-kitchen-white",
]

const PROJECTS = FEATURED_IDS.map((id) => {
  const p = INTERIOR_PROJECTS.find((x) => x.id === id)!
  return { title: p.title, type: `3D Interior Design · ${p.room}`, blurb: p.summary, img: p.img }
})

const PROJECT_URL = "/our-work/interior/residential"

const AUTOPLAY_MS = 6000

export default function FeaturedProjects() {
  const [active, setActive] = useState(0)
  /* Two different reasons the slider can be stopped, kept apart.

     `stopped` is the visitor's explicit choice and persists until they undo
     it. `hovered` is transient. Collapsing both into one `paused` flag meant
     the only way to stop the carousel was to keep a pointer on it — which a
     phone cannot do at all, so on touch the thing simply could not be
     paused. That is a WCAG 2.2.2 failure for any motion running past five
     seconds, and this runs on a six-second loop through seven slides. */
  const [stopped, setStopped] = useState(false)
  const [hovered, setHovered] = useState(false)
  const paused = stopped || hovered
  const [warm, setWarm] = useState(false)
  const regionRef = useRef<HTMLDivElement>(null)
  const timer = useRef<number | null>(null)
  const touchStartRef = useRef<number | null>(null)

  /* Read once and kept in state rather than checked inside the autoplay
     effect, so the slider responds if the visitor changes the setting
     mid-session instead of staying however it was on mount. */
  const [reduceMotion, setReduceMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  )
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onChange = () => setReduceMotion(mq.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  const go = useCallback((next: number) => {
    setActive((next + PROJECTS.length) % PROJECTS.length)
  }, [])

  /**
   * Fetch every photograph once the slider comes into view.
   */
  useEffect(() => {
    const el = regionRef.current
    if (!el || warm) return
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        for (const p of PROJECTS) {
          const pre = new Image()
          pre.decoding = "async"
          pre.src = p.img
        }
        setWarm(true)
        io.disconnect()
      },
      { rootMargin: "300px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [warm])

  /**
   * Autoplay, held back whenever the visitor is engaged with the slider.
   */
  useEffect(() => {
    if (paused || reduceMotion) return

    const tick = () => setActive((i) => (i + 1) % PROJECTS.length)
    timer.current = window.setInterval(tick, AUTOPLAY_MS)

    const onVisibility = () => {
      if (document.hidden && timer.current !== null) {
        clearInterval(timer.current)
        timer.current = null
      } else if (!document.hidden && timer.current === null) {
        timer.current = window.setInterval(tick, AUTOPLAY_MS)
      }
    }
    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      if (timer.current !== null) clearInterval(timer.current)
      timer.current = null
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [paused, reduceMotion])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(active + 1) }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(active - 1) }
  }

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current === null) return
    const diff = touchStartRef.current - e.changedTouches[0].clientX
    if (diff > 45) {
      go(active + 1)
    } else if (diff < -45) {
      go(active - 1)
    }
    touchStartRef.current = null
  }

  return (
    <section
      id="featured-work"
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #141416 0%, #1C1B20 50%, #121214 100%)",
        borderTop: "1px solid rgba(197, 160, 89, 0.3)",
      }}
    >
      {/* Subtle warm architectural ambient glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-96 blur-3xl opacity-20"
        style={{
          background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(197,160,89,0.25) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Two Crossed Rolling Ribbons in high z-index over FEATURED WORK */}
      <div className="relative pt-4 md:pt-6">
        <RollingRibbon />
      </div>

      {/* Centered Heading in middle */}
      <div className={`${SITE_CONTAINER} relative z-10 pt-4 pb-10 md:pt-6 md:pb-14`}>
        <SectionTitle
          level="display"
          onDark
          title="FEATURED WORK"
          subtitle="Living rooms, bedrooms, kitchens and pooja rooms designed by our in-house team, resolved in 3D down to the joinery, lighting and finishes."
          className=""
        />
      </div>

      {/* Full-bleed showcase slider with slight top blend */}
      <div
        ref={regionRef}
        className="relative h-[34rem] overflow-hidden bg-[#1A1203] md:h-[44rem]"
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured projects"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        {/* Soft top blend directly into carousel */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#1C1303] via-[#1C1303]/60 to-transparent z-10"
          aria-hidden="true"
        />

        {PROJECTS.map((p, i) => {
          const isActive = i === active
          return (
            <div
              key={p.title}
              className={`absolute inset-0 transition-opacity duration-[1100ms] ease-out ${
                isActive ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
              aria-hidden={!isActive}
            >
              {/* Still frame */}
              <img
                src={p.img}
                alt={`${p.title} — 3D interior design by Reena Design & Construction`}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                className="h-full w-full object-cover"
              />

              {/* Gradient dissolve: warm antique bronze */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#241A05] via-[#241A05]/80 to-[#241A05]/20 md:bg-gradient-to-l md:from-[#241A05] md:via-[#241A05]/75 md:to-transparent"
                aria-hidden="true"
              />

              {/* Copy on right half */}
              <div className={`${SITE_CONTAINER} absolute inset-0 flex items-end pb-24 md:items-center md:pb-0`}>
                <div
                  className={`w-full transition-all duration-700 ease-out md:ml-auto md:w-1/2 md:max-w-lg md:pl-6 ${
                    isActive ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  }`}
                >
                  <div className="montserrat font-700 mb-3 md:mb-4 flex items-center gap-3 text-[11px] tracking-[0.28em] uppercase text-gold-light">
                    <span className="h-px w-8 bg-gold-light/70" aria-hidden="true" />
                    {p.type}
                  </div>
                  <h3 className="montserrat font-800 text-3xl leading-[1.1] text-white md:text-5xl">
                    {p.title}
                  </h3>
                  <p className="mt-4 md:mt-6 max-w-md text-xs md:text-sm leading-6 md:leading-7 text-white/75">
                    {p.blurb}
                  </p>
                  <Link
                    to={PROJECT_URL}
                    className="montserrat font-700 group mt-6 md:mt-8 inline-flex items-center gap-2 border-b-2 border-primary pb-1.5 text-[13px] text-white transition-colors duration-300 hover:text-gold-light"
                    tabIndex={isActive ? 0 : -1}
                  >
                    See our interior designs
                    <ArrowRight
                      size={14}
                      strokeWidth={2.2}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </div>
            </div>
          )
        })}

        {/* Two quiet arrows are the only chrome on the slider. */}
        <div className={`${SITE_CONTAINER} pointer-events-none absolute inset-x-0 bottom-6 md:bottom-10 z-20`}>
          <div className="pointer-events-auto flex items-center gap-2 md:gap-3">
            {!reduceMotion && (
              <button
                type="button"
                onClick={() => setStopped((v) => !v)}
                aria-label={stopped ? "Resume the project slideshow" : "Pause the project slideshow"}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/70 backdrop-blur-sm transition duration-300 hover:border-primary hover:bg-primary hover:text-neutral-deep md:h-12 md:w-12"
              >
                {stopped
                  ? <Play size={16} strokeWidth={2} aria-hidden="true" />
                  : <Pause size={16} strokeWidth={2} aria-hidden="true" />}
              </button>
            )}
            <button
              type="button"
              onClick={() => go(active - 1)}
              aria-label="Previous project"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/70 backdrop-blur-sm transition duration-300 hover:border-brand hover:bg-brand hover:text-neutral-deep md:h-12 md:w-12"
            >
              <ChevronLeft size={18} strokeWidth={2} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(active + 1)}
              aria-label="Next project"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/70 backdrop-blur-sm transition duration-300 hover:border-primary hover:bg-primary hover:text-neutral-deep md:h-12 md:w-12"
            >
              <ChevronRight size={18} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Position line */}
        <div className="absolute inset-x-0 bottom-0 z-20 h-px bg-white/15" aria-hidden="true">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary transition-[width] duration-700 ease-out"
            style={{ width: `${((active + 1) / PROJECTS.length) * 100}%` }}
          />
        </div>
      </div>
    </section>
  )
}
