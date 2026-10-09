import { useEffect, useRef, useState, type ReactNode } from "react"

type RevealProps = {
  children: ReactNode
  className?: string
  /** ms to hold before starting, so siblings can stagger instead of arriving together. */
  delay?: number
}

/**
 * Fades and lifts its content in the first time it scrolls into view.
 *
 * A plain `<div>` wrapper rather than a hook, so a homepage section can be
 * wrapped at the call site (`<Reveal><Testimonials /></Reveal>`) without the
 * section itself needing to know it is being animated. Replays on every pass —
 * the content hides once it is fully out of view and eases back in from the
 * side it re-enters — and does nothing when the visitor has asked for reduced
 * motion.
 */
export default function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [fromAbove, setFromAbove] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true)
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
        } else {
          setVisible(false)
          setFromAbove(entry.boundingClientRect.top < 0)
        }
      },
      { threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : `translateY(${fromAbove ? -64 : 64}px)`,
        transition: "opacity 1s cubic-bezier(0.22,1,0.36,1), transform 1s cubic-bezier(0.22,1,0.36,1)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
