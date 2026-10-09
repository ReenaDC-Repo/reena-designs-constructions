import PageWrapper from "@/components/layout/PageWrapper"
import Seo from "@/components/Seo"
import { routeSeo } from "@/data/routes"
import PageHeader from "@/components/ui/PageHeader"
import SectionTitle from "@/components/ui/SectionTitle"
import RollingRibbon from "@/components/home/RollingRibbon"
import { SITE_CONTAINER } from "@/components/layout/constants"
import headerScene from "@/imports/whats-included-header.jpg"

const stock = (id: string) => `/stock/${id}-800x1000.jpg`

/** Pricing a build off the drawings — the section's own subject, not a stock
 *  building. Two crops: the desktop band is far wider than the phone one. */
const QUOTE_PHOTO = "photo-1608303588026-884930af2559"
const QUOTE_IMG = `/stock/${QUOTE_PHOTO}-1400x900.jpg`
const QUOTE_IMG_SM = `/stock/${QUOTE_PHOTO}-1400x900.jpg`

/**
 * The four heads that carry a structural build's cost.
 *
 * `group` is the eyebrow above each panel. It carries real information — it is
 * also what keeps Labour from reading as a mistake in a list of materials.
 */
const LINE_ITEMS = [
  {
    group: "Structure",
    title: "Sand",
    copy: "Screened river sand and M-sand, silt-tested before it is allowed into mortar or structural concrete.",
    img: stock("photo-1785791516517-aae4ca2fcfcb"),
    imgAlt: "A graded cone of screened sand beside the conveyor that stacked it",
  },
  {
    group: "Structure",
    title: "TMT Bar",
    copy: "Certified Fe 500D and Fe 550D steel, cut and bent to the structural drawing rather than to whatever is on the truck.",
    img: stock("photo-1763771420303-0f11ccf613d1"),
    imgAlt: "Bundled TMT reinforcement bars",
  },
  {
    group: "Structure",
    title: "Bricks",
    copy: "First-class kiln bricks or AAC blocks, checked for compressive strength and water absorption on delivery.",
    img: stock("photo-1632758821813-eb8248651745"),
    imgAlt: "Kiln bricks stacked in courses on site",
  },
  {
    group: "Execution",
    title: "Labour",
    copy: "Masons, bar-benders, carpenters, electricians, plumbers and painters — our own crews, supervised by our engineers.",
    img: stock("photo-1704005445445-2747074be8ac"),
    imgAlt: "A mason spreading a mortar bed along a brick course with a trowel",
  },
] as const

const QUOTE_STATS = [
  { value: "4", label: "Cost heads" },
  { value: "0", label: "Hidden extras" },
  { value: "1", label: "Fixed price" },
] as const

/** Stated plainly, because the surprise is what damages trust — not the exclusion. */
const NOT_INCLUDED = [
  "Land cost, registration and stamp duty",
  "Municipal sanction and approval fees",
  "Electricity, water and sewerage connection deposits",
  "Borewell, compound wall and landscaping, unless separately quoted",
  "Loose furniture, appliances and soft furnishings",
] as const

const PAGE = routeSeo("/whats-included")

export default function WhatsIncluded() {
  return (
    <PageWrapper
      cta={{
        title: "Want this itemised for your plot?",
        subtitle: "A free site visit, then a quotation with every grade named.",
        buttonText: "Get a Free Quote",
        buttonHref: "/contact",
      }}
    >
      <Seo route="/whats-included" />
      <PageHeader
        title={PAGE.heading}
        subtitle={PAGE.subheading}
        crumbs={PAGE.crumbs}
        backdrop
        scene={headerScene}
      />

      {/* ── Why the list exists ───────────────────────────────────── */}
      <section className="relative overflow-hidden py-14 lg:py-20">
        {/* Artwork pinned to the right edge and dissolving sideways into the
            copy — the same treatment the About and Services pages open with.
            `overflow-hidden` clips this image only; the ribbon that overhangs
            from the section below is a child of that section, so it paints over
            this one rather than being cut by it. */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[55%] select-none md:block lg:w-[50%]"
          style={{
            maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.18) 18%, #000 48%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.18) 18%, #000 48%)",
          }}
        >
          <img
            src={QUOTE_IMG}
            alt="Working drawings, schedules and a calculator laid out while a build is priced line by line"
            width={1400}
            height={900}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div className={`${SITE_CONTAINER} relative z-10 grid items-center gap-10 md:grid-cols-2`}>
          <div className="max-w-xl">
            <SectionTitle title="EVERY LINE IN THE QUOTATION" align="left" className="mb-8" />

            <div className="flex flex-col gap-4 text-sm leading-7 text-slate-500">
              <p>
                A per-square-foot rate hides more than it tells you. Four heads carry most of a
                structural build's cost, and your quotation names the grade and the brand class of
                each — so a substitution on site is a contract breach, not a judgement call.
              </p>
              <p>
                The figure is fixed for the duration of the build. Nothing on this page becomes an
                extra halfway through, and anything that is not on it is listed further down.
              </p>
            </div>

            <dl className="mt-9 flex flex-wrap gap-x-12 gap-y-5 border-t border-hairline pt-7">
              {QUOTE_STATS.map(({ value, label }) => (
                <div key={label}>
                  <dd className="montserrat font-900 text-2xl leading-none text-navy">{value}</dd>
                  <dt className="mt-2 text-[10.5px] uppercase tracking-[0.16em] text-slate-600">
                    {label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>

          {/* Mobile: no mask — nothing sits beside the image on a phone for it
              to dissolve into, so a side fade only ate its edges. */}
          <div className="md:hidden">
            <div className="relative -mx-8 overflow-hidden sm:-mx-9">
              <img
                src={QUOTE_IMG_SM}
                alt="Working drawings, schedules and a calculator laid out while a build is priced line by line"
                width={1100}
                height={720}
                loading="lazy"
                decoding="async"
                className="h-56 w-full object-cover sm:h-64"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── The four heads ───────────────────────────────────────── */}
      {/* Navy rather than the light surface the homepage strip sits on. The
          panel wash is `from-navy`, so on this ground the bottom of every
          photograph resolves into the section itself instead of stopping at a
          seam, and `.svc-blend` fades their top edges up into the same colour.
          The band is the section; there is no box around it. */}
      <section className="flow-root bg-navy">
        {/*
          The homepage's crossed CONTACT US / FREE QUOTE tapes, pulled up so
          they straddle the seam rather than sit inside the navy.

          The negative margin lifts the ribbon by roughly half its own height,
          which puts the crossing point on the boundary itself — the tapes read
          as laid across the join between the two sections, which is what tape
          does.

          `flow-root` on the section is load-bearing. Without it this margin is
          adjoining the section's own top edge, so it collapses through and
          drags the whole navy block up with it — the ribbon never moves
          relative to the section and stays entirely inside the blue.
          `flow-root` makes the section a block formatting context, which stops
          the collapse without clipping anything.

          Nothing here may clip: no `overflow-hidden` on the section, or the
          half hanging over the white would be cut off. It paints over the
          section above simply by coming later in the document.
        */}
        <div className="relative -mt-14 md:-mt-[4.75rem]">
          <RollingRibbon />
        </div>

        <div className={SITE_CONTAINER}>
          <SectionTitle title="MATERIALS & EXECUTION" align="left" className="mb-8" onDark />
        </div>

        {/*
          The same full-bleed photographic strip the homepage uses for its core
          services: four photographs blended into one another with the copy laid
          over them, deliberately outside SITE_CONTAINER so it runs edge to edge.

          Images and text are separate layers rather than nested per panel. The
          panels overlap by design — that is what produces the blend — and if the
          photographs lived inside each panel, a panel's image would paint over
          its neighbour's text.

          `overflow-hidden` clips the 2.5rem overhang the end panels have no
          neighbour to land on, which would otherwise spill past the page edge
          and give the whole site a horizontal scrollbar.
        */}
        <div className="relative isolate overflow-hidden md:h-[27rem]">
          {/* Layer 1 — the photography. */}
          <div className="absolute inset-0 hidden md:flex" aria-hidden="true">
            {LINE_ITEMS.map(({ title, img }) => (
              <div
                key={title}
                className="relative flex-1"
              >
                {/* The overhang lives on this wrapper, not on the image: for a
                    replaced element `width: auto` resolves to the intrinsic
                    width, so insets on the <img> itself are ignored. */}
                <span className="absolute inset-y-0 -left-10 -right-10 block">
                  <img
                    src={img}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    /* `max-w-none` is required: index.css caps every image at
                       100% by default, which would undo the overhang. */
                    className="svc-blend h-full w-full max-w-none object-cover"
                  />
                </span>
              </div>
            ))}
          </div>

          {/* Layer 2 — the copy, each panel carrying its own legibility wash. */}
          <div className="relative flex h-full flex-col md:flex-row">
            {LINE_ITEMS.map(({ group, title, copy, img, imgAlt }) => (
              <article
                key={title}
                className="group relative flex min-h-[16rem] flex-1 flex-col justify-end gap-3 p-7 transition duration-500 md:min-h-0 md:p-6 md:pb-8 md:first:pl-9 md:last:pr-9 lg:first:pl-14 lg:last:pr-14"
              >

                {/* The panel's own artwork on a phone, where the strip is a
                    column and there is no neighbour to blend into. Plain
                    `object-cover`, no `.svc-blend`: that mask's horizontal fade
                    is there to cross-dissolve into the panel beside it. Same
                    `src` as the desktop layer, so this costs a second element
                    and not a second download. */}
                <span className="absolute inset-0 overflow-hidden md:hidden" aria-hidden="true">
                  <img
                    src={img}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </span>
                {/* Legibility wash, per panel rather than one across the strip —
                    a strip-wide gradient runs top-to-bottom once the panels
                    stack on mobile, washing out the first and blackening the
                    last. */}
                <span
                  /* The stops differ by breakpoint. A desktop panel is 27rem
                  tall with the copy in its bottom third, so a wash running
                  the full height leaves most of the photograph clear. A
                  phone panel is a fraction of that and the copy fills it, so
                  the same wash covered the picture completely — here it
                  holds solid only up to 52%, under the text, and clears
                  above it. */
                  className="absolute inset-0 bg-gradient-to-t from-navy from-46% via-navy/35 via-76% to-transparent transition duration-500 group-hover:from-navy/85 group-hover:via-navy/20 md:from-0% md:via-navy/60 md:via-50%"
                  aria-hidden="true"
                />

                {/* Hairline seams, so the four panels do not read as one
                    undivided photograph. */}
                <span
                  className="absolute inset-y-6 left-0 hidden w-px bg-white/12 group-first:hidden md:block"
                  aria-hidden="true"
                />

                <span className="relative flex flex-col gap-3">
                  <span className="text-[10.5px] uppercase tracking-[0.16em] text-white/70">
                    {group}
                  </span>

                  <span
                    className="h-0.5 w-9 rounded-full bg-brand transition-all duration-500 group-hover:w-14"
                    aria-hidden="true"
                  />

                  <h3 className="montserrat font-800 text-[15px] leading-snug text-white">
                    {title}
                  </h3>

                  {/* `min-h` sets the floor, `line-clamp` the ceiling. With the
                      panels bottom aligned, copy of differing length otherwise
                      puts the titles on different baselines — and a floor set
                      much above the longest entry leaves the whole block
                      hovering clear of the panel base. */}
                  <p className="text-[13px] leading-relaxed text-white/70 md:line-clamp-4 md:min-h-[4rem]">
                    {copy}
                  </p>

                  {/* The photographs are decorative in layer 1; this is where
                      their description actually reaches a screen reader. */}
                  <span className="sr-only">{imgAlt}</span>
                </span>
              </article>
            ))}
          </div>
        </div>

      </section>

      {/* ── The exclusions ────────────────────────────────────────── */}
      <section className="py-14 lg:py-20">
        <div className={SITE_CONTAINER}>
          <div className="grid gap-10 md:grid-cols-2 md:gap-16">
            <div className="max-w-md">
              <SectionTitle title="WHAT IS NOT INCLUDED" align="left" className="mb-8" />
              <p className="-mt-4 text-sm leading-7 text-slate-500">
                Every builder has exclusions. Most of them appear after the contract is signed. Here
                are ours, before it is — and each one is priced separately if you would rather we
                handled it.
              </p>
            </div>

            <ul className="divide-y divide-hairline border-y border-hairline">
              {NOT_INCLUDED.map((item) => (
                <li key={item} className="flex items-start gap-4 py-4">
                  <span
                    className="mt-2 h-0.5 w-5 flex-none rounded-full bg-slate-300"
                    aria-hidden="true"
                  />
                  <span className="text-[13px] leading-relaxed text-slate-500">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}
