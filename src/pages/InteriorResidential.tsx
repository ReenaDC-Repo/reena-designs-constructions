import { useEffect, useMemo, useRef, useState } from "react"
import {
  X,
  Layers,
  ListChecks,
  Ruler,
  Sparkles,
  Lightbulb,
  PencilRuler,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react"
import { Link } from "react-router-dom"
import PageWrapper from "@/components/layout/PageWrapper"
import Seo from "@/components/Seo"
import { routeSeo } from "@/data/routes"
import PageHeader from "@/components/ui/PageHeader"
import SubNav from "@/components/ui/SubNav"
import FilterTabs from "@/components/ui/FilterTabs"
import SectionTitle from "@/components/ui/SectionTitle"
import { SITE_CONTAINER } from "@/components/layout/constants"
import { INTERIOR_PROJECTS, ROOM_TABS, type Room } from "@/data/interiorProjects"

const APPROACH = [
  {
    Icon: PencilRuler,
    title: "Measured & drawn first",
    copy: "Every unit is drawn to your site's real dimensions before a single board is cut, so nothing is improvised on site.",
  },
  {
    Icon: Layers,
    title: "Specified materials",
    copy: "Shutters, cores, hardware and stone are named in your quote — you know the grade you are paying for.",
  },
  {
    Icon: Lightbulb,
    title: "Lighting designed in",
    copy: "Cove, task and accent circuits are planned with the joinery, not added afterwards as an afterthought.",
  },
  {
    Icon: Ruler,
    title: "Factory-finished",
    copy: "Cabinetry is machine-cut and edge-banded off site, then installed — a cleaner finish and a faster handover.",
  },
]

const PAGE = routeSeo("/our-work/interior/residential")

export default function InteriorResidential() {
  const [active, setActive] = useState<Room>("Living Room")
  const [openId, setOpenId] = useState<string | null>(null)

  /**
   * Focus bookkeeping for the specification dialog.
   *
   * `panel` receives focus when the dialog opens, so a keyboard user lands
   * inside it rather than continuing from wherever they were in the page
   * behind. `opener` remembers which card was clicked, so closing returns them
   * to exactly that card instead of the top of the document.
   */
  const panel = useRef<HTMLDivElement>(null)
  const opener = useRef<HTMLElement | null>(null)

  const openSpec = (id: string, event: React.MouseEvent<HTMLElement>) => {
    opener.current = event.currentTarget
    setOpenId(id)
  }

  const closeSpec = () => {
    setOpenId(null)
    opener.current?.focus()
  }

  const visible = useMemo(
    () => INTERIOR_PROJECTS.filter((p) => p.room === active),
    [active],
  )

  const openIndex = visible.findIndex((p) => p.id === openId)
  const openProject = openIndex >= 0 ? visible[openIndex] : null

  // Step through the projects currently in view, wrapping at both ends.
  const step = (dir: number) => {
    if (openIndex < 0) return
    setOpenId(visible[(openIndex + dir + visible.length) % visible.length].id)
  }

  // Close on Escape and drive the lightbox from the arrow keys; lock background
  // scroll while it is open so the page behind does not move.
  useEffect(() => {
    if (!openProject) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeSpec()
        return
      }
      if (e.key === "ArrowRight") step(1)
      if (e.key === "ArrowLeft") step(-1)

      // Trap Tab inside the dialog. Without this the focus ring walks off into
      // the page behind, which is still rendered and still scrollable-to — the
      // dialog would be modal in appearance only.
      if (e.key !== "Tab" || !panel.current) return
      const focusable = panel.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    panel.current?.focus()
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [openProject, openIndex, visible.length])

  return (
    <PageWrapper
      cta={{
        title: "Want an interior like this at home?",
        subtitle: "Send your floor plan for a 3D concept and a fixed quote.",
        buttonText: "Book a Free Consultation",
        buttonHref: "/contact",
      }}
    >
      <Seo route="/our-work/interior/residential" />
      <PageHeader
        title={PAGE.heading}
        subtitle={PAGE.subheading}
        crumbs={PAGE.crumbs}
        backdrop
      />

      <div className={`${SITE_CONTAINER} py-12`}>
        <SubNav
          tabs={[
            { label: "Residential Interior", href: "/our-work/interior/residential" },
            { label: "Commercial Interior", href: "/our-work/interior/commercial" },
          ]}
        />

        <div className="mb-10 max-w-3xl">
          <p className="montserrat font-700 mb-3 text-[11px] uppercase tracking-[0.3em] text-brand-ink">
            Residential interior design in Medinipur & across India
          </p>
          <h2 className="montserrat font-800 text-xl leading-snug md:text-2xl text-navy">
            Interiors detailed to the millimetre, built to last
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-500">
            Living rooms, bedrooms, modular kitchens and pooja rooms — designed in 3D, quoted by
            named material grade, and executed by our own carpentry and electrical teams. Browse a
            selection of completed residential interiors below, each with its full material
            specification and scope of work.
          </p>
        </div>

        <FilterTabs
          tabs={ROOM_TABS}
          active={active}
          onSelect={(t) => setActive(t as Room)}
        />

        {/* ── Project grid ─────────────────────────────────────── */}
        {/* One control per project: the whole card is the button, rather than
            an image button and a separate text link both opening the same
            dialog. That was two tab stops and two targets for one action. */}
        <div className="-mx-8 grid gap-px border-y border-hairline bg-hairline sm:-mx-9 sm:grid-cols-2 lg:-mx-14 lg:grid-cols-3">
          {visible.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={(e) => openSpec(p.id, e)}
              aria-label={`Open the full specification for ${p.title}`}
              className="group flex flex-col bg-white text-left transition-colors duration-300 hover:bg-surface focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-orange-500"
            >
              <span className="relative block aspect-[4/3] overflow-hidden">
                <img
                  src={p.img}
                  alt={`${p.title} — ${p.room.toLowerCase()} interior design by Reena Designs & Constructions, Medinipur`}
                  width={600}
                  height={450}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span
                  className="montserrat font-700 absolute left-0 top-0 bg-brand px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-white"
                  aria-hidden="true"
                >
                  {p.room}
                </span>
              </span>

              <span className="flex flex-1 flex-col p-6 lg:p-7">
                <span
                  className="h-0.5 w-9 flex-none rounded-full bg-brand transition-all duration-500 group-hover:w-14"
                  aria-hidden="true"
                />
                <span className="montserrat font-800 mt-4 block text-[15px] leading-snug text-navy">
                  {p.title}
                </span>
                <span className="mt-2 block text-[13px] leading-relaxed text-slate-500">
                  {p.summary}
                </span>

                {/* Two named materials and a count, rather than three chips and
                    a "+2 more" chip — the count is not a material and reading
                    it as one made the row longer without saying more. */}
                <span className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[11px] text-slate-500">
                  {p.materials.slice(0, 2).map((m) => (
                    <span key={m} className="border border-slate-200 px-2 py-1 font-semibold">
                      {m}
                    </span>
                  ))}
                  {p.materials.length > 2 && (
                    <span className="text-slate-500">+{p.materials.length - 2} more</span>
                  )}
                </span>

                <span className="montserrat font-700 mt-auto inline-flex items-center gap-1.5 pt-6 text-[12px] text-brand-ink">
                  Full specification
                  <ChevronRight
                    size={13}
                    strokeWidth={2.4}
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </span>
            </button>
          ))}
        </div>

        {/* ── How we work ──────────────────────────────────────── */}
        <section className="mt-20">
          <SectionTitle
            eyebrow="Our approach"
            title="HOW WE DETAIL AN INTERIOR"
            subtitle="The reason these rooms photograph well is that the decisions were made on paper, in order, before anyone arrived on site."
          />
          <div className="grid gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-4">
            {APPROACH.map(({ Icon, title, copy }) => (
              <div key={title} className="flex flex-col gap-3.5 bg-white p-7">
                <Icon size={20} strokeWidth={1.8} className="text-brand" aria-hidden="true" />
                <h3 className="montserrat font-800 text-sm text-navy">{title}</h3>
                <p className="text-[13px] leading-relaxed text-slate-500">{copy}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── Specification sheet ───────────────────────────────── */}
      {openProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy-deep/80 p-0 backdrop-blur-sm sm:p-6"
          onClick={closeSpec}
          role="presentation"
        >
          <div
            ref={panel}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="spec-title"
            className="relative flex max-h-[94vh] w-full max-w-6xl flex-col bg-white shadow-2xl outline-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Sheet header ─────────────────────────────────── */}
            <div className="flex flex-none items-center justify-between gap-4 border-b border-hairline px-6 py-3.5 lg:px-8">
              <div className="flex min-w-0 items-center gap-4">
                <span className="montserrat font-700 bg-brand px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white">
                  {openProject.room}
                </span>
                {/* Position in the current filter, so stepping through with the
                    arrow keys has a sense of where it ends. */}
                <span className="montserrat font-700 text-[11px] tabular-nums tracking-[0.16em] text-slate-600">
                  {String(openIndex + 1).padStart(2, "0")} / {String(visible.length).padStart(2, "0")}
                </span>
              </div>

              <div className="flex flex-none items-center gap-1">
                {visible.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => step(-1)}
                      aria-label="Previous project"
                      className="inline-flex h-9 w-9 items-center justify-center border border-slate-200 text-slate-600 transition-colors hover:border-navy hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                    >
                      <ChevronLeft size={16} strokeWidth={2.2} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => step(1)}
                      aria-label="Next project"
                      className="inline-flex h-9 w-9 items-center justify-center border border-slate-200 text-slate-600 transition-colors hover:border-navy hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                    >
                      <ChevronRight size={16} strokeWidth={2.2} aria-hidden="true" />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={closeSpec}
                  aria-label="Close specification"
                  className="ml-1 inline-flex h-9 w-9 items-center justify-center border border-slate-200 text-slate-600 transition-colors hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                >
                  <X size={16} strokeWidth={2.2} aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Not `flex-1`: the grid takes its natural height so the sheet
                ends where the spec ends. Stretching it to the 94vh cap left
                dead space under the CTA and squeezed the photograph into a tall
                slot that cropped most of the room out of frame. */}
            <div className="grid min-h-0 lg:grid-cols-[1.25fr_1fr]">
              {/*
                The photograph fills this box absolutely rather than sitting in
                flow. These are portrait sources (640x960), and `h-full` inside
                an auto-height grid row resolves against nothing — so the image
                fell back to its intrinsic height, became the tallest thing in
                the row, and pushed the sheet past its own cap. Positioned
                absolutely it takes the row's height instead of setting it, and
                `object-cover` crops it to whatever shape the spec column ends
                up being.
              */}
              <div className="relative min-h-[14rem] bg-slate-100 sm:min-h-[20rem] lg:min-h-0">
                <img
                  src={openProject.img}
                  alt={`${openProject.title} — ${openProject.room.toLowerCase()} interior by Reena Designs & Constructions`}
                  /* Eager: the visitor has just clicked to open this, so
                     deferring it only shows them an empty panel. */
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
              </div>

              {/* Sized to fit rather than to scroll: the spec is short enough
                  to read at a glance, and a scrollbar inside a modal hides half
                  of it behind an interaction. `overflow-y-auto` stays only as a
                  fallback for very short viewports. */}
              <div className="flex min-h-0 flex-col overflow-y-auto p-6 lg:p-8">
                <h3
                  id="spec-title"
                  className="montserrat font-800 flex-none text-lg leading-snug text-navy lg:text-xl"
                >
                  {openProject.title}
                </h3>

                <p className="mt-3 flex-none text-[13px] leading-6 text-slate-600">
                  {openProject.detail}
                </p>

                {/* Side by side rather than stacked: ten rows in a column was
                    what made this sheet taller than the screen. */}
                <div className="mt-6 grid flex-none gap-x-8 gap-y-6 sm:grid-cols-2">
                  <div>
                    <div className="montserrat font-800 flex items-center gap-2 border-b border-hairline pb-2 text-[10.5px] uppercase tracking-[0.18em] text-navy">
                      <Sparkles size={12} strokeWidth={2} className="text-brand" aria-hidden="true" />
                      Materials
                    </div>
                    {/* A ruled list rather than a cloud of pills: this is a
                        specification, and a spec is read line by line. */}
                    <ul className="divide-y divide-hairline">
                      {openProject.materials.map((m) => (
                        <li key={m} className="py-2 text-[12.5px] leading-relaxed text-slate-600">
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="montserrat font-800 flex items-center gap-2 border-b border-hairline pb-2 text-[10.5px] uppercase tracking-[0.18em] text-navy">
                      <ListChecks size={12} strokeWidth={2} className="text-brand" aria-hidden="true" />
                      Scope of work
                    </div>
                    <ol className="divide-y divide-hairline">
                      {openProject.scope.map((item, i) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 py-2 text-[12.5px] leading-relaxed text-slate-600"
                        >
                          <span
                            className="montserrat font-800 mt-px flex-none text-[10px] tabular-nums text-brand-ink"
                            aria-hidden="true"
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          {item}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                {/* The dialog previously ended with no action at all — the one
                    place a visitor is most convinced is the one place they
                    could do nothing. */}
                <Link
                  to={`/contact?project=${encodeURIComponent(openProject.title)}`}
                  className="btn-orange montserrat font-700 group mt-7 inline-flex w-full flex-none items-center justify-center gap-2 px-6 py-3.5 text-sm"
                >
                  Enquire about this room
                  <ArrowRight
                    size={16}
                    strokeWidth={2.2}
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  )
}
