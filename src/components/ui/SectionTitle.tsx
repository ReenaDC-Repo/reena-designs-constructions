/**
 * The site's section heading, in one place.
 *
 * There were eleven different h2 treatments across the app and six
 * byte-identical local `Heading` functions — one each in About, Services,
 * Contact, OurWork, WhatsIncluded and TestimonialsPage. The homepage ran its
 * section headers up to `lg:text-6xl` while every interior page used
 * `text-xl md:text-2xl`, so the same level in the document was rendered at two
 * and a half times the size depending on which route you were on.
 *
 * Two steps now, and the difference between them is a rule rather than an
 * accident:
 *
 *   display — the homepage's full-bleed section headers, which sit alone above
 *             a strip of photography and carry the page's rhythm.
 *   section — everything else. Interior pages carry many more sections, and a
 *             display-sized heading on each one shouts.
 */
interface SectionTitleProps {
  title: string
  /** Small uppercase kicker rendered above the heading — good for keyword-rich context lines. */
  eyebrow?: string
  /** Supporting sentence rendered below the heading. */
  subtitle?: string
  align?: "center" | "left"
  accentBar?: boolean
  /** Inverts the palette for use on a dark section. */
  onDark?: boolean
  /** See the note above. Defaults to the interior-page step. */
  level?: "display" | "section"
  /** Trailing margin. Some callers sit directly above their own copy block. */
  className?: string
}

/**
 * Two steps, 36px and 24px at their largest.
 *
 * The display step is deliberately not the 60px the two homepage strips used
 * to run at — against a 24px section step that was a two-and-a-half-times gap,
 * and it made every other homepage heading (which sat around 30px) look like a
 * mistake in between. At 36px it is still unmistakably the louder of the two
 * and every existing heading lands within a step of where it already was.
 *
 * No `uppercase` here on purpose: the titles that want caps are already
 * written in caps ("OUR CORE SERVICES"), and forcing it would have shouted
 * AboutStrip's sentence-case headline.
 */
const SIZE = {
  display: "montserrat font-900 text-2xl md:text-3xl lg:text-4xl",
  section: "montserrat font-800 text-xl md:text-2xl",
} as const

/** Caps need a little air; sentence case does not. Montserrat's own
 *  -0.01em is right for the latter and too tight for the former. */
const isAllCaps = (s: string) => s === s.toUpperCase()

export default function SectionTitle({
  title,
  eyebrow,
  subtitle,
  align = "center",
  accentBar = false,
  onDark = false,
  level = "section",
  className = "mb-10",
}: SectionTitleProps) {
  const centered = align === "center"

  return (
    <div className={`${className} ${centered ? "text-center" : "text-left"}`}>
      {eyebrow && (
        <p
          className={`montserrat font-700 mb-2 text-[11px] tracking-[0.3em] uppercase ${
            onDark ? "text-orange-400" : "text-brand-ink"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <div className={`section-title-row ${centered ? "" : "justify-start"}`}>
        {accentBar && <div className="h-0.5 w-10 flex-none rounded-full bg-brand" />}
        <h2
          className={`${SIZE[level]} ${isAllCaps(title) ? "tracking-wide" : ""} ${
            onDark ? "text-white" : "text-navy"
          }`}
        >
          {title}
        </h2>
      </div>
      {subtitle && (
        <p
          className={`mt-3 leading-relaxed ${level === "display" ? "text-sm sm:text-base md:text-lg" : "text-sm"} ${
            onDark ? "text-white/70" : "text-slate-600"
          } ${centered ? "mx-auto max-w-2xl" : "max-w-2xl"}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
