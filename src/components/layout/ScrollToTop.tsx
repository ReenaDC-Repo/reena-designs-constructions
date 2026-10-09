import { useEffect } from "react"
import { useLocation } from "react-router-dom"

/**
 * Resets the viewport to the top of the page on every navigation.
 *
 * React Router keeps the window's scroll position across route changes, so
 * following a footer link would drop you into the middle of the next page.
 *
 * Two details matter here:
 *
 *  - `index.css` sets `html { scroll-behavior: smooth }`, which would turn every
 *    navigation into a long animated scroll back up. The behaviour is forced to
 *    `auto` for the jump and restored immediately afterwards.
 *  - `history.scrollRestoration` is set to `manual` so the browser does not
 *    reapply a remembered position on back/forward and undo the reset.
 *
 * An in-page `#anchor` still wins, so links that target a section keep working.
 */
export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation()

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual"
    }
    return () => {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "auto"
      }
    }
  }, [])

  useEffect(() => {
    const html = document.documentElement
    // The inline property belongs to this component alone, so it is removed
    // rather than restored to a captured value — capturing would eventually
    // read back our own override and strand it permanently.
    html.style.scrollBehavior = "auto"

    // An explicit behaviour on the call overrides the CSS rule outright. The
    // inline override alone is not enough: the restore below can land before
    // the scroll is committed, leaving the browser to animate the whole way
    // back up the page instead of jumping.
    const instant = { behavior: "instant" as ScrollBehavior }

    // A single jump is not enough. As the outgoing page unmounts and the new
    // one's images and fonts settle, the browser's scroll anchoring nudges the
    // position back down by a few pixels, landing just short of the top. The
    // jump is re-asserted after layout settles — unless the visitor has already
    // started scrolling, in which case leave them where they are.
    let owned = true
    const release = () => {
      owned = false
    }
    // Only keys that actually scroll count — otherwise typing in the assistant
    // would cancel the re-assert and leave the page a few pixels off the top.
    const SCROLL_KEYS = new Set([" ", "PageUp", "PageDown", "Home", "End", "ArrowUp", "ArrowDown"])
    const onKey = (e: KeyboardEvent) => {
      if (SCROLL_KEYS.has(e.key)) release()
    }
    const opts = { passive: true, once: true } as const
    window.addEventListener("wheel", release, opts)
    window.addEventListener("touchmove", release, opts)
    window.addEventListener("keydown", onKey)

    const jump = () => {
      if (!owned) return
      const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
      if (target) {
        target.scrollIntoView({ ...instant, block: "start" })
      } else {
        window.scrollTo({ top: 0, left: 0, ...instant })
      }
    }

    jump()
    const settle = window.setTimeout(jump, 0)
    // Drop the override on a macrotask rather than a frame — rAF never fires in
    // a background tab. The cleanup also drops it, so a navigation that lands
    // before the timeout cannot leave smooth scrolling switched off.
    const finish = window.setTimeout(() => {
      jump()
      html.style.removeProperty("scroll-behavior")
    }, 220)

    return () => {
      clearTimeout(settle)
      clearTimeout(finish)
      window.removeEventListener("wheel", release)
      window.removeEventListener("touchmove", release)
      window.removeEventListener("keydown", onKey)
      html.style.removeProperty("scroll-behavior")
    }
  }, [pathname, search, hash])

  return null
}
