import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import SiteSearch from "@/components/ui/SiteSearch"
import { SITE_CONTAINER } from "@/components/layout/constants"

const PHONE_QUERY = "(max-width: 767px)"

export default function Hero() {
  // Only phones get the ambient backdrop. False during prerender, so the
  // static HTML never carries a second <video>.
  const [isPhone, setIsPhone] = useState(
    () => typeof window !== "undefined" && window.matchMedia(PHONE_QUERY).matches,
  )
  useEffect(() => {
    const mq = window.matchMedia(PHONE_QUERY)
    const onChange = () => setIsPhone(mq.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  return (
    // `min-h-screen` is 100vh, which on iOS Safari is measured against the
    // collapsed chrome — so the hero ran under the URL bar and the CTAs sat
    // below the fold. `100svh` is the small-viewport height, which is the one
    // actually visible on load.
    //
    // Two layouts share this markup:
    //  - From `md`: the showreel is a full-bleed background behind the copy.
    //  - Below `md`: the showreel is 16:9, and any portrait crop of it threw
    //    most of the frame away. So it plays whole, edge to edge at 16:9,
    //    with the copy below it over an "ambient" backdrop — a blurred,
    //    darkened second copy of the same clip that fills the screen and shifts
    //    colour with it. The page reads as one composed sheet rather than a
    //    video strip floating on flat navy.
    <section
      id="home"
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-navy md:flex-row md:items-center"
    >
      {/* Ambient backdrop, phones only — rendered conditionally so a desktop
          never decodes a second video. */}
      {isPhone && (
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
          <video
            className="h-full w-full scale-125 object-cover opacity-70 blur-2xl"
            src="/hero.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/55 via-navy/75 to-navy" />
        </div>
      )}

      {/* The showreel. Muted + playsInline are both required for autoplay to
          be allowed on iOS.

          Phone: edge to edge at 16:9, directly below the fixed nav (~70px), so
          `object-cover` crops nothing. From `md`: it fills the section.

          These layers sit at z-0/z-1 rather than behind the section: the app
          shell is `bg-white`, and a negative z-index here paints *under* that
          ancestor background, which hid the video entirely. */}
      <div className="relative z-[1] w-full pt-[70px] md:absolute md:inset-0 md:z-0 md:pt-0">
        <div className="relative aspect-video w-full overflow-hidden md:aspect-auto md:h-full">
          <video
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            src="/hero.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Scrim, desktop only — on a phone the copy sits below the video, not
          on it. Two passes: a flat wash so nothing in the footage can wash the
          type out, and a stronger gradient on the side the copy sits on. */}
      <div className="pointer-events-none absolute inset-0 z-[1] hidden bg-navy/45 md:block" />
      <div className="pointer-events-none absolute inset-0 z-[1] hidden bg-gradient-to-l from-navy/80 via-navy/40 to-transparent md:block" />
      {/* Drafting rule along the foot of the sheet. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-px bg-white/15" />

      {/* A laptop at 600–768px tall has to fit the same eight elements as a
          27" display. Fixed `py-28/36` pushed the CTAs off the bottom there,
          so the padding and the headline both step down by viewport *height*,
          not width — a short window is not a narrow one. */}
      <div
        className={`${SITE_CONTAINER} relative z-10 flex w-full flex-1 flex-col justify-center pt-9 pb-14 md:block md:flex-none md:pt-32 md:pb-20 md:[@media(min-height:820px)]:py-36`}
      >
        <div className="max-w-xl md:ml-auto md:max-w-[62%] md:text-right">
          {/* Two lines, not three. The stacked "creating" had no punctuation
              holding it to either half, so the headline read as three
              fragments rather than one phrase. */}
          {/* The eyebrow is the first line of the h1 rather than a separate
              paragraph. The slogan below it names no service and no town, and
              as the homepage's only h1 it told a search engine nothing; the
              eyebrow says what the company is and where, in the same words as
              the title tag. Same look as before — only the element changed. */}
          <h1 className="montserrat font-900 text-[28px] leading-[1] tracking-[-0.035em] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)] sm:text-4xl md:text-5xl md:leading-[0.95] md:tracking-[-0.04em] [@media(min-height:820px)]:md:text-6xl">
            <span className="mb-2.5 block [font-family:Inter,sans-serif] text-[10px] font-semibold uppercase leading-normal tracking-[0.16em] min-[390px]:tracking-[0.24em] text-orange-400 drop-shadow-none md:mb-3 md:text-xs md:tracking-[0.35em] md:[@media(min-height:820px)]:mb-5">
              Construction &amp; Interior Design Company
            </span>
            {/* Words rise into place one after another, then the two orange
                words catch a single highlight. CSS only (`.hero-word` in
                index.css), and static under prefers-reduced-motion. The text
                content is unchanged, so the h1 still reads as one phrase. */}
            <HeroWord i={0}>Your</HeroWord>{" "}
            <HeroWord i={1} accent>
              vision
            </HeroWord>
            <HeroWord i={1}>,</HeroWord>
            <span className="mt-2 block">
              <HeroWord i={2}>Our</HeroWord>{" "}
              <HeroWord i={3} accent>
                creation
              </HeroWord>
            </span>
          </h1>
          {/* Search, then the two CTAs.
              A visitor who already knows what they want should not have to
              guess which of eight nav items hides it; one who does not still
              has the buttons. `md:items-end` keeps the field's right edge on
              the same line as the headline's. */}
          <div className="mt-5 flex flex-col gap-4 md:mt-6 md:items-end md:[@media(min-height:820px)]:mt-8 md:[@media(min-height:820px)]:gap-6">
            <SiteSearch />

            <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:items-center sm:gap-4 md:justify-end">
              <Link
                to="/contact"
                className="btn-orange group gap-1.5 whitespace-nowrap px-3 py-2.5 text-[13px] shadow-lg shadow-orange-500/30 sm:gap-2 sm:px-6 sm:py-3 sm:text-sm"
              >
                Get a Free Quote
                <ArrowRight
                  size={16}
                  strokeWidth={2.2}
                  className="hidden transition-transform duration-300 group-hover:translate-x-1 min-[390px]:block"
                  aria-hidden="true"
                />
              </Link>
              <Link
                to="/our-work"
                className="btn-outline gap-2 whitespace-nowrap border-white/40 bg-white/10 px-3 py-2.5 text-[13px] text-white backdrop-blur-sm hover:border-orange-400 hover:bg-white/20 hover:text-white sm:px-6 sm:py-3 sm:text-sm"
              >
                Explore Projects
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/** One masked word of the headline. `i` sets its place in the stagger. */
function HeroWord({ i, accent = false, children }: { i: number; accent?: boolean; children: string }) {
  return (
    <span className="hero-word">
      <span
        className={`hero-word-inner${accent ? " hero-word-accent text-orange-500" : ""}`}
        style={{ "--i": i } as React.CSSProperties}
      >
        {children}
      </span>
    </span>
  )
}
