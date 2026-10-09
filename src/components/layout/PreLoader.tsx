import { useEffect, useRef, useState } from "react"

/**
 * Full-screen logo animation shown on every fresh page load.
 *
 * It plays the clip through once and then fades out. The overlay is only
 * rendered in the browser (`typeof window`), so the prerendered HTML that
 * crawlers read never contains it. Because it is rendered inside the app and
 * not in index.html, it does not replay on route changes.
 *
 * Two escape hatches so a visitor is never stuck behind it: if the browser
 * refuses to autoplay or the file fails to load, it leaves after 1.5s; and no
 * matter what, it leaves after 20s.
 */
export default function PreLoader() {
  const [visible, setVisible] = useState(typeof window !== "undefined")
  const [leaving, setLeaving] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const finish = () => setLeaving(true)

  useEffect(() => {
    if (!visible) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const hardStop = window.setTimeout(finish, 20000)

    const video = videoRef.current
    if (video) {
      // React never writes the `muted` attribute, which mobile browsers check
      // before allowing autoplay — set it, then start playback explicitly.
      video.muted = true
      video.setAttribute("muted", "")
      video.play().catch(() => window.setTimeout(finish, 1500))
    }

    return () => {
      window.clearTimeout(hardStop)
      document.body.style.overflow = previousOverflow
    }
  }, [visible])

  if (!visible) return null

  return (
    <div
      role="status"
      aria-label="Loading Reena Design & Construction"
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-700 ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      onTransitionEnd={() => leaving && setVisible(false)}
    >
      <video
        ref={videoRef}
        // Phones get a 1080px-wide cut: the 2270px master exceeds what some
        // phone decoders accept, and fails outright on them.
        src={window.matchMedia("(max-width: 767px)").matches ? "/logo-animation-mobile.mp4" : "/logo-animation.mp4"}
        className="h-full w-full object-contain"
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        onEnded={finish}
        onError={() => window.setTimeout(finish, 1500)}
      />
    </div>
  )
}
