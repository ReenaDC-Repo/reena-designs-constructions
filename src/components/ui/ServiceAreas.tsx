import { Link } from "react-router-dom"
import { MapPin, Phone } from "lucide-react"
import { SITE_CONTAINER } from "@/components/layout/constants"
import { SERVICE_AREAS } from "@/data/seo"
import { SITE } from "@/data/siteInfo"

/**
 * Where the company works.
 *
 * This is the site's only piece of copy that names the towns individually, and
 * it is here for a specific reason. "Construction company in Medinipur" is one
 * query with a handful of serious competitors; "house construction in Belda",
 * "interior designer in Ghatal" and eighteen more like them are queries almost
 * nobody has written a page for. A search engine cannot return a page for a
 * town the page never mentions, so a firm that travels across the district and
 * says only "West Bengal" is invisible for every one of those searches.
 *
 * The block is deliberately plain text with real links rather than a decorative
 * map: the town names have to be in the rendered HTML to count, and each tile
 * links somewhere real so the section carries internal link weight instead of
 * being a dead keyword list. That distinction matters — a wall of place names
 * that links nowhere and says nothing is exactly the doorway-page pattern
 * Google penalises. Every name here is a place the company genuinely works.
 *
 * The natural next step, when there is time for it, is a real page per major
 * town (/areas/kharagpur and so on) carrying that town's own projects,
 * testimonials and travel notes. That outranks a shared block every time. This
 * section is the version that can ship today and still be honest.
 */
export default function ServiceAreas({
  /** Set on pages that already carry a lot of chrome, to drop the intro copy. */
  compact = false,
}: {
  compact?: boolean
} = {}) {
  return (
    <section className="relative overflow-hidden border-y border-hairline bg-[#f7f7f7] py-16 lg:py-20">
      {/* The drafting grid used across the site, faded out at the edges. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(26,39,68,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(26,39,68,0.05) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(100% 80% at 50% 30%, #000 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(100% 80% at 50% 30%, #000 30%, transparent 100%)",
        }}
      />

      <div className={`${SITE_CONTAINER} relative`}>
        <div className="montserrat font-800 mb-4 flex items-center gap-3 text-[13px] uppercase tracking-[0.2em] text-brand-ink">
          <MapPin size={17} strokeWidth={2.2} aria-hidden="true" />
          Areas We Serve
          <span className="h-px flex-1 bg-gradient-to-r from-orange-400 to-transparent" />
        </div>

        <h2 className="montserrat font-800 max-w-3xl text-xl leading-snug text-navy md:text-2xl">
          Construction, architecture and interior design across Paschim Medinipur and West Bengal
        </h2>

        {!compact && (
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-500">
            Our office is in Medinipur and our site teams travel across the district daily. We build
            independent houses, apartments, shops and offices — and take on renovation, 3D elevation
            and interior fit-out work — in each of the towns below. If yours is not listed, call{" "}
            <a href={SITE.phoneHref} className="font-600 text-navy underline decoration-orange-400 underline-offset-4">
              {SITE.phones[0]}
            </a>{" "}
            and ask; if we can reach the site, we will quote it.
          </p>
        )}

        {/* Hairline grid, matching the galleries. Each town is a real link
            rather than a bare string, so the section passes weight through to
            the pages that convert. */}
        <ul className="mt-9 grid grid-cols-2 gap-px border border-hairline bg-hairline sm:grid-cols-3 lg:grid-cols-4">
          {SERVICE_AREAS.map(({ name, note }) => (
            <li key={name}>
              <Link
                to="/contact"
                className="group flex h-full flex-col justify-between gap-1 bg-white p-4 transition-colors duration-200 hover:bg-navy"
              >
                <span className="montserrat font-800 text-[13.5px] text-navy transition-colors duration-200 group-hover:text-white">
                  {name}
                </span>
                <span className="text-[11.5px] leading-4 text-slate-500 transition-colors duration-200 group-hover:text-white/60">
                  {note}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Service terms in prose rather than a second keyword grid. A crawler
            reads this the same way; a client reads it as a sentence. */}
        <p className="mt-8 max-w-4xl text-[13px] leading-7 text-slate-500">
          Work we take on in these areas includes{" "}
          <Link to="/services" className="text-navy underline decoration-slate-300 underline-offset-4 hover:decoration-orange-400">
            residential and commercial construction
          </Link>
          ,{" "}
          <Link to="/our-work/architecture" className="text-navy underline decoration-slate-300 underline-offset-4 hover:decoration-orange-400">
            architectural design and sanction drawings
          </Link>
          , RCC and structural engineering,{" "}
          <Link to="/our-work/renovation" className="text-navy underline decoration-slate-300 underline-offset-4 hover:decoration-orange-400">
            home renovation and remodelling
          </Link>
          ,{" "}
          <Link to="/our-work/interior/residential" className="text-navy underline decoration-slate-300 underline-offset-4 hover:decoration-orange-400">
            residential interiors and modular kitchens
          </Link>
          ,{" "}
          <Link to="/our-work/interior/commercial" className="text-navy underline decoration-slate-300 underline-offset-4 hover:decoration-orange-400">
            office, shop and restaurant interiors
          </Link>
          ,{" "}
          <Link to="/our-work/3d-design" className="text-navy underline decoration-slate-300 underline-offset-4 hover:decoration-orange-400">
            3D elevation and front elevation design
          </Link>{" "}
          and full{" "}
          <Link to="/services" className="text-navy underline decoration-slate-300 underline-offset-4 hover:decoration-orange-400">
            turnkey delivery
          </Link>
          . Every quotation is itemised by material grade — see{" "}
          <Link to="/whats-included" className="text-navy underline decoration-slate-300 underline-offset-4 hover:decoration-orange-400">
            what is included
          </Link>{" "}
          — and the completion date is written into the contract.
        </p>

        <a
          href={SITE.phoneHref}
          className="btn-navy montserrat font-700 mt-7 gap-2"
        >
          <Phone size={15} strokeWidth={2.2} aria-hidden="true" />
          Book a free site visit — {SITE.phones[0]}
        </a>
      </div>
    </section>
  )
}
