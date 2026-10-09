import { Link } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"
import { SITE_CONTAINER } from "@/components/layout/constants"
import SectionTitle from "@/components/ui/SectionTitle"
import draftingTable from "@/imports/about-drafting-table.jpg"
import drawingToInterior from "@/imports/about-drawing-to-interior.jpg"
import interiorImg from "@/imports/interior-master-bedroom.jpeg"
import remodelImg from "@/imports/interior-living-tv-walnut.jpeg"

/* No stock photography: every panel uses the firm's own imagery — the branded
   drafting-table shot, in-house 3D interior renders and the drawing-to-finish
   illustrations used on the About page. */
const drawingToBuilding = "/about-drawing-to-building.jpg"

const SERVICES = [
  {
    title: "Building Construction",
    href: "/services",
    copy: "Structurally engineered residential and commercial builds, executed to IS-code standards with third-party tested materials.",
    img: draftingTable,
    imgAlt: "A Reena Designs & Constructions architect drawing up a working elevation",
  },
  {
    title: "Architectural Design",
    href: "/services",
    copy: "Site-responsive planning, working drawings and municipal-ready documentation — sanctioned faster, built cleaner.",
    img: drawingToBuilding,
    imgAlt: "A house shown half as a line drawing and half as the finished building",
  },
  {
    title: "Interior Design",
    href: "/our-work/interior/residential",
    copy: "Bespoke residential and workspace interiors, detailed down to the joinery, lighting layer and material palette.",
    img: interiorImg,
    imgAlt: "3D interior design of a master bedroom with a marble-finish wardrobe and upholstered headboard wall",
  },
  {
    title: "Renovation & Remodeling",
    href: "/our-work/renovation",
    copy: "Structural retrofits and full-home makeovers that modernise ageing property without compromising its frame.",
    img: remodelImg,
    imgAlt: "3D design for a living-room makeover with fluted walnut panels and a gold-vein marble feature wall",
  },
  {
    title: "Turnkey Solutions",
    href: "/contact",
    copy: "One accountable contract from drawing board to handover — a single team, one timeline, one fixed cost.",
    // Drawing on one side, finished room on the other: the whole of what a
    // turnkey contract covers, in one frame.
    img: drawingToInterior,
    imgAlt: "An interior shown half as a line drawing and half as the finished room",
  },
]

export default function CoreServices() {
  return (
    <section id="services" className="relative bg-surface pt-16 md:pt-20">
      {/* The homepage's display step. "Five core services", not "five
          disciplines" — the full list lives on the Services page; this strip
          shows the five a visitor is most likely to be shopping for, so the
          subtitle names no second number for the two to disagree on. */}
      <div className={`${SITE_CONTAINER} relative z-10 pb-10 md:pb-14`}>
        <SectionTitle
          level="display"
          title="OUR CORE SERVICES"
          subtitle="Five core services from our complete construction package — construction, architecture, interiors, renovation and turnkey delivery."
          className=""
        />
      </div>

      {/*
        Full-bleed strip: five images side by side, each in its own slot with
        a hard edge, divided by hairline seams, with the copy sitting on top.
        Deliberately outside SITE_CONTAINER so it runs edge to edge. No blend
        between panels or into the section — every image ends cleanly.

        Images and text are separate layers rather than nested per panel, so
        the desktop images can be laid out as one row independently of the
        captions above them.
      */}
      <div className="relative isolate overflow-hidden md:h-[27rem]">
        {/*
          Layer 1 — the images, desktop only.

          These bands are equal-height `flex-1` children of a box stretched to
          the whole strip, while the captions are sized by their own copy. Side
          by side that is the same thing; stacked on a phone it is not — the
          band boundaries drift away from the caption boundaries and each
          caption ends up over a slice of its neighbour's photograph. On a phone
          each panel carries its own image instead.
        */}
        <div className="absolute inset-0 hidden md:flex" aria-hidden="true">
          {SERVICES.map(({ title, img }) => (
            <div key={title} className="relative flex-1">
              <span className="absolute inset-0 block">
                <img
                  src={img}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full max-w-none object-cover"
                />
              </span>
            </div>
          ))}
        </div>

        {/* Layer 2 — the copy, each panel carrying its own legibility wash. */}
        <div className="relative flex h-full flex-col md:flex-row">
          {SERVICES.map(({ title, href, copy, img, imgAlt }) => (
            <Link
              key={title}
              to={href}
              className="group relative flex min-h-[16rem] flex-1 flex-col justify-end gap-3 p-7 transition duration-500 md:min-h-0 md:p-6 md:pb-8 md:first:pl-9 md:last:pr-9 lg:first:pl-14 lg:last:pr-14"
            >
              {/* The panel's own artwork on a phone, where the strip is a
                  column. Same `src` as the desktop layer, so this costs a
                  second element and not a second download. */}
              <span className="absolute inset-0 overflow-hidden md:hidden" aria-hidden="true">
                <img
                  src={img}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </span>
              {/*
                Legibility wash, per panel rather than one across the strip.

                A single strip-wide gradient was wrong once the panels stack:
                on mobile it ran top-to-bottom across all five bands, so the
                first was washed out and the last nearly black. Per panel it
                behaves identically in a row and in a column.

                It also eases straight from the bottom edge rather than
                holding a flat colour for its first quarter — that flat run was
                a solid navy band under the captions, which is the slab look
                the imagery is meant to replace. Now only the last pixel is
                full strength and the photograph reads through everywhere else.
                Hover lifts it further.
              */}
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

              {/* Hairline seams between the five panels. */}
              <span
                className="absolute inset-y-6 left-0 hidden w-px bg-white/12 group-first:hidden md:block"
                aria-hidden="true"
              />

              <span className="relative flex flex-col gap-3">
                {/* A short rule in place of the icon badge — enough to anchor
                    the title without putting a symbol back. */}
                <span
                  className="h-0.5 w-9 rounded-full bg-brand transition-all duration-500 group-hover:w-14"
                  aria-hidden="true"
                />

                <h3 className="montserrat font-800 text-[15px] leading-snug text-white">{title}</h3>

                {/*
                  The copy block is pinned to exactly five lines: `min-h` sets
                  the floor, `line-clamp` the ceiling. With the panels bottom
                  aligned, copy of differing length otherwise put the five
                  titles on five different baselines, and a bare `min-h` only
                  held until a narrower viewport rewrapped the text past it.
                */}
                <p className="text-[13px] leading-relaxed text-white/70 md:line-clamp-5 md:min-h-[7rem]">
                  {copy}
                </p>

                {/* The images are decorative in both layers, so this is
                    where their description actually reaches a screen reader.
                    It used to be the link's `aria-label`, which meant anyone
                    navigating by links heard the image caption where the
                    destination should have been. */}
                <span className="sr-only">{imgAlt}</span>

                <span className="montserrat font-700 inline-flex items-center gap-1 text-[12px] text-orange-300 transition duration-500 md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                  Explore
                  <ArrowUpRight size={13} strokeWidth={2.4} aria-hidden="true" />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
