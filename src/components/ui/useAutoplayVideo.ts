import { useEffect, useState, type RefObject } from "react"

/**
 * Starts a muted background video, and reports when the device refuses to.
 *
 * React sets `muted` as a DOM property, never as the HTML attribute, and
 * mobile Safari and Chrome decide whether `autoplay` is allowed from the
 * attribute — so a React-rendered `<video autoPlay muted>` can sit frozen on
 * its first frame. This sets both, then calls `play()` explicitly.
 *
 * Low Power Mode (iOS) and Data Saver (Android) reject every video autoplay,
 * and no page can override that. They do not stop animated images, so the
 * hook returns `blocked` and the caller swaps in an animated WebP of the same
 * clip. A video still paused after a few seconds counts as blocked too: some
 * browsers leave `play()` pending rather than rejecting it.
 */
export default function useAutoplayVideo(
  ref: RefObject<HTMLVideoElement | null>,
  /** Re-run when the clip changes (e.g. phone ↔ desktop source). */
  src: string,
  enabled = true,
): boolean {
  const [blocked, setBlocked] = useState(false)

  useEffect(() => {
    const video = ref.current
    if (!video || !enabled) return
    setBlocked(false)

    video.muted = true
    video.defaultMuted = true
    video.setAttribute("muted", "")
    video.setAttribute("playsinline", "")

    let cancelled = false
    const block = () => {
      if (!cancelled) setBlocked(true)
    }
    video.play().catch(block)
    const stallCheck = window.setTimeout(() => {
      // `paused` stays false while an allowed play() is still buffering, so a
      // slow connection is not mistaken for a block.
      if (video.paused) block()
    }, 4000)

    return () => {
      cancelled = true
      window.clearTimeout(stallCheck)
    }
  }, [ref, src, enabled])

  return blocked
}
