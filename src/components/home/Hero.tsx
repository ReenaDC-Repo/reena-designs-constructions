import { useEffect, useRef, useState } from "react"
// import { Link } from "react-router-dom"
// import { ArrowRight } from "lucide-react"
// import SiteSearch from "@/components/ui/SiteSearch"
// import { SITE_CONTAINER } from "@/components/layout/constants"
import useAutoplayVideo from "@/components/ui/useAutoplayVideo"

const PHONE_QUERY = "(max-width: 767px)"

/** Phones get a 720p, silent cut of the showreel (~170 KB against 3.9 MB):
 *  they play it twice at once (backdrop + showreel), often on mobile data. */
const HERO_SRC = "/hero-v2.mp4?v=2"
const HERO_SRC_PHONE = "/hero-v2-mobile.mp4?v=2"
const HERO_POSTER = "/hero-v2-poster.jpg?v=2"
/** Same clip as an animated image, shown when the device refuses to autoplay
 *  video (Low Power Mode, Data Saver) — those modes do not stop images. */
const HERO_ANIMATED = "/hero-v2-anim.webp?v=2"

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

  const src = isPhone ? HERO_SRC_PHONE : HERO_SRC
  const showreelRef = useRef<HTMLVideoElement>(null)
  const blocked = useAutoplayVideo(showreelRef, src)

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
      className="relative flex h-[100svh] min-h-[100svh] w-full overflow-hidden bg-black"
    >
      {/* Full screen video */}
      <div className="absolute inset-0 h-full w-full">
        <video
          ref={showreelRef}
          className="pointer-events-none h-full w-full object-cover"
          src={src}
          poster={HERO_POSTER}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        {blocked && (
          <img
            src={HERO_ANIMATED}
            alt=""
            aria-hidden="true"
            className="pointer-events-none h-full w-full object-cover"
          />
        )}
      </div>

      {/* Scrim commented out per request: video colour stays 100% intact with no over cover colour */}
      {/*
      <div className="pointer-events-none absolute inset-0 z-[1] hidden bg-navy/20 md:block" />
      <div className="pointer-events-none absolute inset-0 z-[1] hidden bg-gradient-to-l from-navy/85 via-navy/40 to-transparent md:block" />
      */}
      {/* Drafting rule along the foot of the sheet. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-px bg-white/15" />

      {/* Hero headline and CTA buttons commented out per user request */}
      {/*
      <div
        className={`${SITE_CONTAINER} relative z-10 flex w-full flex-1 flex-col justify-center pt-9 pb-14 md:block md:flex-none md:pt-32 md:pb-20 md:[@media(min-height:820px)]:py-36`}
      >
        <div className="max-w-xl md:ml-auto md:max-w-[62%] md:text-right">
          <h1 className="montserrat font-900 text-[28px] leading-[1] tracking-[-0.035em] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)] sm:text-4xl md:text-5xl md:leading-[0.95] md:tracking-[-0.04em] [@media(min-height:820px)]:md:text-6xl">
            <span className="mb-2.5 block [font-family:Inter,sans-serif] text-[10px] font-semibold uppercase leading-normal tracking-[0.16em] min-[390px]:tracking-[0.24em] text-orange-400 drop-shadow-none md:mb-3 md:text-xs md:tracking-[0.35em] md:[@media(min-height:820px)]:mb-5">
              Construction &amp; Interior Design Company
            </span>
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
      */}
    </section>
  )
}

/*
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
*/
