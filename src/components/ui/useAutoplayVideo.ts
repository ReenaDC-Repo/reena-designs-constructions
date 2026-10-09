import { useEffect, type RefObject } from "react"

/**
 * Starts a muted background video on phones that will not do it themselves.
 *
 * React sets `muted` as a DOM property, never as the HTML attribute, and
 * mobile Safari and Chrome decide whether `autoplay` is allowed from the
 * attribute — so a React-rendered `<video autoPlay muted>` can sit frozen on
 * its first frame. This sets both, then calls `play()` explicitly.
 *
 * Low Power Mode (iOS) and Data Saver (Android) reject every autoplay. The
 * first tap or key press on the page is a user gesture, which is allowed to
 * start playback, so the video retries then instead of staying still.
 */
export default function useAutoplayVideo(
  ref: RefObject<HTMLVideoElement | null>,
  /** Re-run when the clip changes (e.g. phone ↔ desktop source). */
  src: string,
  enabled = true,
) {
  useEffect(() => {
    const video = ref.current
    if (!video || !enabled) return

    video.muted = true
    video.defaultMuted = true
    video.setAttribute("muted", "")
    video.setAttribute("playsinline", "")

    const events = ["touchend", "pointerup", "keydown"] as const
    const removeRetry = () => events.forEach((e) => window.removeEventListener(e, retry))
    const retry = () => {
      video.play().then(removeRetry, () => {})
    }

    video.play().catch(() => {
      events.forEach((e) => window.addEventListener(e, retry, { passive: true }))
    })

    return removeRetry
  }, [ref, src, enabled])
}
