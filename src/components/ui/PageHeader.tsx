import Breadcrumb from "./Breadcrumb"
import { SITE_CONTAINER } from "@/components/layout/constants"
import skyline from "@/imports/construction-skyline.jpg"

interface PageHeaderProps {
  title: string
  /**
   * Second line of the <h1>, carrying the page's search term ("Home interior
   * design in Medinipur"). The large title is a two-word label; without this
   * the page's only h1 says nothing a search engine can match a query to.
   * It is part of the heading itself, visible, not hidden copy.
   */
  subtitle?: string
  crumbs: { label: string; href?: string }[]
  /**
   * Renders the header as a tall dark band with the construction skyline
   * blended into it, instead of the flat grey strip. Opt-in per page.
   */
  backdrop?: boolean
  /**
   * Swaps the default skyline strip for a full scene.
   *
   * Only the artwork changes — the navy gradient, the scrim and the band's
   * height are shared with every other backdrop header, so a page using this
   * still reads as the same component rather than a one-off.
   */
  scene?: string
  /** Swaps the default skyline for another wide silhouette strip. */
  strip?: string
}

export default function PageHeader({ title, subtitle, crumbs, backdrop = false, scene, strip }: PageHeaderProps) {
  if (!backdrop) {
    return (
      <div className="px-6 py-10" style={{ background: "#f7f7f7", borderBottom: "1px solid #e8e8e8" }}>
        <div className={`${SITE_CONTAINER} page-header-intro`}>
          <Breadcrumb items={crumbs} />
          <h1 className="montserrat font-900 text-3xl text-navy md:text-4xl">
            {title}
            {subtitle && (
              <span className="font-600 [font-family:Inter,sans-serif] mt-2 block text-base normal-case tracking-normal text-slate-600 md:text-lg">
                {subtitle}
              </span>
            )}
          </h1>
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative isolate overflow-hidden"
      style={{ background: "linear-gradient(160deg, var(--color-navy) 0%, #24365c 55%, #1e2d4e 100%)" }}
    >
      {scene ? (
        /*
          A scene, rather than the strip below.

          The strip is 10:1 and sits along the bottom at its own aspect ratio.
          A picture with sky in it is nowhere near that wide, so it is cropped
          to the band instead — anchored to the bottom, because the machinery
          and the workers are what identify it and a centre crop takes them
          first. Only the top edge is masked, enough to soften the cut into the
          navy without washing out the sky.
        */
        <img
          src={scene}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full select-none object-cover object-bottom"
          style={{
            maskImage: "linear-gradient(to top, #000 0%, #000 93%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to top, #000 0%, #000 93%, transparent 100%)",
          }}
        />
      ) : (
        /*
          The artwork is a wide silhouette strip, so it sits along the bottom at
          its own aspect ratio rather than being stretched to cover the band —
          `object-cover` would crop the machinery out of a strip this shallow.
          Only its upper edge is masked, which softens the cut across the
          building tops into the navy instead of leaving a hard orange line. The
          artwork's own sunset does the lighting; there is no separate glow
          behind it.
        */
        <img
          src={strip ?? skyline}
          alt=""
          aria-hidden="true"
          width={1983}
          height={192}
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-auto w-full select-none"
          style={{
            maskImage: "linear-gradient(to top, #000 0%, #000 62%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to top, #000 0%, #000 62%, transparent 100%)",
          }}
        />
      )}

      {/*
        Legibility scrim. The title sits over the excavator and the lower
        buildings, which are the darkest part of the artwork but also the
        busiest — this keeps the type crisp without dimming the skyline on the
        right, where there is nothing to read.
      */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to right, rgba(26,39,68,0.99) 0%, rgba(26,39,68,0.92) 26%, rgba(26,39,68,0.62) 55%, rgba(26,39,68,0.24) 80%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      <div className={`${SITE_CONTAINER} page-header-intro relative py-10 md:py-12 lg:py-14`}>
        <Breadcrumb items={crumbs} onDark />
        <h1 className="montserrat font-900 text-3xl text-white md:text-4xl lg:text-5xl">
          {title}
          {subtitle && (
            <span className="font-600 [font-family:Inter,sans-serif] mt-3 block text-base normal-case tracking-normal text-white/80 md:text-lg">
              {subtitle}
            </span>
          )}
        </h1>
      </div>
    </div>
  )
}
