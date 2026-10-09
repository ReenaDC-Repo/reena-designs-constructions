import { useEffect, type RefObject } from "react"

/**
 * Eases every top-level <section> inside `root` in as it scrolls into view.
 *
 * The homepage wraps its sections in <Reveal> one by one; the inner pages get
 * the same motion from here instead, so a new section on any page animates
 * without anyone remembering to wrap it. Only the outermost sections are
 * animated — a section inside another rides along with its parent rather than
 * arriving twice.
 *
 * The reveal replays on every pass: a section hides again once it has left the
 * viewport entirely, and eases back in from whichever side it re-enters — from
 * below when scrolling down, from above when scrolling back up. Once in view
 * it rests at `transform: none`, so nothing stays transformed in a way that
 * would break `position: sticky` or fixed children. With reduced motion
 * requested, nothing is hidden at all.
 */
export default function useSectionReveal(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const sections = Array.from(el.querySelectorAll<HTMLElement>("section")).filter(
      (s) => !s.parentElement?.closest("section"),
    )

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const target = entry.target as HTMLElement
          if (entry.isIntersecting) {
            target.classList.add("is-revealed")
          } else {
            // Left the viewport: reset, remembering which side it went out of
            // so the next entrance comes from that direction.
            target.classList.remove("is-revealed")
            target.classList.toggle("reveal-from-above", entry.boundingClientRect.top < 0)
          }
        }
      },
      { threshold: 0 },
    )

    for (const section of sections) {
      section.classList.add("reveal-section")
      io.observe(section)
    }

    return () => {
      io.disconnect()
      for (const section of sections) section.classList.remove("reveal-section", "is-revealed", "reveal-from-above")
    }
  }, [root])
}
