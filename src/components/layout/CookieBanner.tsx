import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { Cookie, X, Check } from "lucide-react"

const KEY = "rdc-cookie-choice"

/**
 * Cookie consent notice.
 *
 * The visitor's choice is recorded in localStorage so the banner does not
 * reappear on every navigation, and it is read once on mount rather than kept
 * in React state alone — a page reload has to remember the answer.
 *
 * Dismissing with the close button is treated as "not now": no preference is
 * stored, so the notice returns next visit. Only an explicit Accept or Decline
 * is recorded, which is the behaviour consent rules expect.
 */
export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const exitTimer = useRef<number | null>(null)

  // The exit timeout has to be cancellable, or a fast unmount leaves it to
  // fire into a component that no longer exists.
  useEffect(() => () => {
    if (exitTimer.current !== null) clearTimeout(exitTimer.current)
  }, [])

  useEffect(() => {
    let stored: string | null = null
    try {
      stored = window.localStorage.getItem(KEY)
    } catch {
      /* storage can be blocked entirely — fall through and show the notice */
    }
    if (stored === "accepted" || stored === "declined") return

    // Let the page settle before sliding in, so it does not compete with the
    // hero animation on first paint.
    const t = window.setTimeout(() => setVisible(true), 1200)
    return () => clearTimeout(t)
  }, [])

  const close = (choice?: "accepted" | "declined") => {
    if (choice) {
      try {
        window.localStorage.setItem(KEY, choice)
      } catch {
        /* nothing we can do if storage is unavailable */
      }
    }
    setLeaving(true)
    exitTimer.current = window.setTimeout(() => {
      setVisible(false)
      // Reset, so a later re-show is not stuck in the faded-out exit state.
      setLeaving(false)
    }, 320)
  }

  if (!visible) return null

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className={`fixed bottom-24 left-4 z-[55] transition-all duration-300 sm:bottom-6 sm:left-6 ${
        leaving ? "translate-y-3 opacity-0" : "translate-y-0 opacity-100"
      }`}
      style={{
        // On phones the notice spans nearly the full width, so it is lifted
        // above the assistant pinned bottom-right rather than sitting under it.
        maxWidth: "min(34rem, calc(100vw - 2rem))",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="flex flex-col gap-3 border border-slate-200 bg-white/95 p-4 shadow-2xl shadow-slate-900/15 backdrop-blur-xl sm:flex-row sm:items-center sm:gap-4 sm:py-3 sm:pl-4 sm:pr-3">
        <span
          className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-full"
          style={{ background: "linear-gradient(145deg,#FFE9D6,#FFD0AC)" }}
          aria-hidden="true"
        >
          <Cookie size={19} strokeWidth={2} className="text-orange-600" />
        </span>

        {/* Wording matches what the site actually does. It sets no analytics or
            advertising cookies, so claiming "we use cookies to give you the
            best experience" was both vague and inaccurate — and the link went
            to /contact, where no policy existed. */}
        <p className="flex-1 text-[12.5px] leading-relaxed text-slate-600">
          This site stores one item in your browser to remember this choice. No tracking, no ads.{" "}
          <Link
            to="/cookies"
            className="montserrat font-700 text-slate-800 underline decoration-orange-400 decoration-2 underline-offset-2 hover:text-orange-600"
          >
            Cookie Policy
          </Link>
        </p>

        <div className="flex flex-none items-center gap-2">
          <button
            type="button"
            onClick={() => close("declined")}
            className="montserrat font-700 border border-slate-300 px-3.5 py-2 text-[12px] text-slate-600 transition hover:border-navy hover:text-navy"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => close("accepted")}
            className="btn-orange montserrat font-700 gap-1.5 px-4 py-2 text-[12px] shadow-md shadow-orange-500/25"
          >
            <Check size={13} strokeWidth={3} aria-hidden="true" />
            Accept
          </button>
          <button
            type="button"
            onClick={() => close()}
            aria-label="Dismiss for now"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={15} strokeWidth={2.2} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
