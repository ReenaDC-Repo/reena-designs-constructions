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
  const ambientRef = useRef<HTMLVideoElement>(null)
  const blocked = useAutoplayVideo(showreelRef, src)
  useAutoplayVideo(ambientRef, src, isPhone && !blocked)

  return (
    // Video starts flush at top on mobile so it seamlessly shows through
    // the liquid glassmorphic floating nav bar.
    <section
      id="home"
      className="relative w-full overflow-hidden bg-black pt-0 md:h-[100svh] md:min-h-[100svh]"
    >
      {/* Video Container: Natural 16:9 aspect on mobile; full-bleed on desktop */}
      <div className="relative aspect-video w-full overflow-hidden md:aspect-auto md:absolute md:inset-0 md:h-full">
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
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          />
        )}
      </div>

      {/* Drafting rule along the foot of the sheet in metallic gold & saffron */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-1 bg-gradient-to-r from-primary via-secondary to-tertiary" />
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
