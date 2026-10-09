import { Link } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"
import PageWrapper from "@/components/layout/PageWrapper"
import Seo from "@/components/Seo"
import { routeSeo } from "@/data/routes"
import PageHeader from "@/components/ui/PageHeader"
import SectionTitle from "@/components/ui/SectionTitle"
import { SITE_CONTAINER } from "@/components/layout/constants"
import pressMics from "@/imports/testimonials-press-mics.jpg"
import skyline from "@/imports/construction-skyline.jpg"
import draftTable from "@/imports/about-drafting-table.jpg"
import headerScene from "@/imports/whats-included-header.jpg"
import drawingInterior from "@/imports/about-drawing-to-interior.jpg"
import interiorCover from "@/imports/interior-living-kitchen-white.jpg"

/**
 * The gallery index.
 *
 * Each entry shows the first photograph of the gallery it opens, rather than a
 * drawn icon. This is a portfolio index — the work itself is the reason to
 * click, and eight line-art glyphs told a visitor nothing about what was behind
 * them. The covers come from the galleries' own data, so a gallery and its
 * cover cannot drift apart.
 */
const GALLERIES = [
  {
    label: "Interior Design",
    blurb: "Residential and commercial fit-outs, room by room.",
    href: "/our-work/interior/residential",
    img: interiorCover,
  },
  {
    label: "Exterior Design",
    blurb: "Elevations, facades and street presence.",
    href: "/our-work/exterior",
    img: skyline,
  },
  {
    label: "Architecture Gallery",
    blurb: "Form, massing and material studies.",
    href: "/our-work/architecture",
    img: draftTable,
  },
  {
    label: "3D Design & Elevation",
    blurb: "Visualisations approved before a brick is laid.",
    href: "/our-work/3d-design",
    img: headerScene,
  },
  {
    label: "Renovation Projects",
    blurb: "Retrofits and full-property makeovers.",
    href: "/our-work/renovation",
    img: drawingInterior,
  },
  {
    label: "Client Testimonials",
    blurb: "Client stories — coming soon.",
    href: "/our-work/testimonials",
    img: pressMics,
  },
] as const

const PAGE = routeSeo("/our-work")

export default function OurWork() {
  return (
    <PageWrapper
      cta={{
        title: "Want something like this built?",
        subtitle: "Free site visit, itemised quote, and a completion date in writing.",
        buttonText: "Start Your Project",
        buttonHref: "/contact",
      }}
    >
      <Seo route="/our-work" />
      <PageHeader
        title={PAGE.heading}
        subtitle={PAGE.subheading}
        crumbs={PAGE.crumbs}
        backdrop
      />

      <section className={`${SITE_CONTAINER} py-14 lg:py-16`}>
        <SectionTitle title="BROWSE THE GALLERIES" align="left" className="mb-4" />
        <p className="max-w-2xl text-sm leading-7 text-slate-500">
          {GALLERIES.length} galleries covering everything we build — from the elevation drawings a
          project starts as to the finished rooms it ends up being.
        </p>
      </section>

      {/* Full-bleed and divided by hairline seams, the ledger used across the
          site. Eight covers fill the four-column grid exactly. */}
      <div className="grid gap-px border-y border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4">
        {GALLERIES.map(({ label, blurb, href, img }) => (
          <Link
            key={label}
            to={href}
            className="group relative isolate flex aspect-[4/3] flex-col justify-end overflow-hidden p-6"
          >
            <img
              src={img}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Legibility wash, weighted to the bottom where the label sits, so
                the photograph still reads across the rest of the tile. */}
            <span
              className="absolute inset-0 -z-10 bg-gradient-to-t from-navy via-navy/55 to-transparent transition-opacity duration-500 group-hover:from-navy/95"
              aria-hidden="true"
            />

            <span
              className="h-0.5 w-9 rounded-full bg-brand transition-all duration-500 group-hover:w-14"
              aria-hidden="true"
            />
            <h3 className="montserrat font-800 mt-3.5 text-[15px] leading-snug text-white">{label}</h3>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/65">{blurb}</p>

            <span className="montserrat font-700 mt-3 inline-flex items-center gap-1 text-[12px] text-orange-300 transition duration-500 md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
              View gallery
              <ArrowUpRight size={13} strokeWidth={2.4} aria-hidden="true" />
            </span>
          </Link>
        ))}

      </div>
    </PageWrapper>
  )
}
