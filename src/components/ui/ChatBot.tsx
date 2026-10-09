import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { Send, X, ArrowRight, Sparkles, RotateCcw } from "lucide-react"
import { matchAnswer, OPENING_CHIPS, type Answer } from "@/data/chatKnowledge"

type Message = {
  id: number
  from: "bot" | "user"
  text: string
  link?: { label: string; href: string }
  at: string
}

const clock = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })

const greeting = (): Message => ({
  id: 0,
  from: "bot",
  text: "Hi there! 👋 I'm Reena's assistant. Ask me about costs, timelines, services, materials — or anything else about building with us.",
  at: clock(),
})

/**
 * Floating assistant.
 *
 * Collapsed, it is a face whose pupils track the cursor. Tracking runs off a
 * single window-level pointermove coalesced into one rAF frame and writes the
 * transform straight to the DOM, so a fast cursor cannot queue a render per
 * event.
 *
 * Mounted once in App, outside <Routes>, so it persists across navigation and
 * stays pinned to the viewport rather than scrolling away with a section.
 */
export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([greeting()])
  const [chips, setChips] = useState<string[]>(OPENING_CHIPS)
  const [typing, setTyping] = useState(false)
  const [draft, setDraft] = useState("")

  const faceRef = useRef<HTMLSpanElement>(null)
  const pupilsRef = useRef<HTMLSpanElement[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const launcherRef = useRef<HTMLButtonElement>(null)
  const frame = useRef<number | null>(null)
  const timers = useRef<number[]>([])
  const nextId = useRef(1)

  // Pupils follow the cursor.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const onMove = (e: PointerEvent) => {
      if (frame.current !== null) return
      frame.current = requestAnimationFrame(() => {
        frame.current = null
        const face = faceRef.current
        if (!face) return
        const b = face.getBoundingClientRect()
        const dx = e.clientX - (b.left + b.width / 2)
        const dy = e.clientY - (b.top + b.height / 2)
        const dist = Math.hypot(dx, dy) || 1
        const travel = Math.min(dist / 28, 3) // clamped so the pupil stays in the eye
        const x = ((dx / dist) * travel).toFixed(2)
        const y = ((dy / dist) * travel).toFixed(2)
        for (const p of pupilsRef.current) {
          if (p) p.style.transform = `translate(${x}px, ${y}px)`
        }
      })
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    return () => {
      window.removeEventListener("pointermove", onMove)
      if (frame.current !== null) cancelAnimationFrame(frame.current)
    }
  }, [])

  // Clear pending reply timers on unmount so they cannot fire into a dead component.
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  // Keep the newest message in view.
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
  }, [messages, typing, open])

  /**
   * Dialog behaviour.
   *
   * The panel looked modal and behaved as though it were not: focus could walk
   * straight out of it into the page behind, and Escape did nothing, so a
   * keyboard user who opened it had to hunt for the close button to get out.
   *
   * This is the same bookkeeping the Residential Interior lightbox already
   * does — Escape to close, Tab trapped inside, focus returned to whatever
   * opened it. Background scroll is deliberately *not* locked here: unlike the
   * lightbox this is a corner panel, not a full-screen overlay, and freezing
   * the page behind a 22rem box would be wrong.
   */
  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
        return
      }
      if (e.key !== "Tab" || !panelRef.current) return
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  // Hand focus back to the launcher on close, so the visitor resumes from
  // where they were rather than at the top of the document.
  const wasOpen = useRef(false)
  useEffect(() => {
    if (wasOpen.current && !open) launcherRef.current?.focus()
    wasOpen.current = open
  }, [open])

  const push = (m: Omit<Message, "id" | "at">) =>
    setMessages((prev) => [...prev, { ...m, id: nextId.current++, at: clock() }])

  const ask = (text: string) => {
    const q = text.trim()
    if (!q || typing) return

    push({ from: "user", text: q })
    setDraft("")
    setChips([])

    const answer: Answer = matchAnswer(q)
    // Greetings and small talk come back at once; substantive answers get a
    // short "typing" beat so the exchange reads like a conversation.
    const delay = answer.instant ? 260 : 620

    setTyping(true)
    const t = window.setTimeout(() => {
      setTyping(false)
      push({ from: "bot", text: answer.text, link: answer.link })
      setChips(answer.next ?? [])
      // Drop the handle once it has fired, so a long conversation does not
      // accumulate a list of dead timer ids for the life of the session.
      timers.current = timers.current.filter((id) => id !== t)
    }, delay)
    timers.current.push(t)
  }

  const reset = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setTyping(false)
    setMessages([greeting()])
    setChips(OPENING_CHIPS)
    setDraft("")
  }

  const setPupil = (i: number) => (el: HTMLSpanElement | null) => {
    if (el) pupilsRef.current[i] = el
  }

  return (
    // Pinned to the viewport, above the fixed nav (z-50), with safe-area inset
    // so it clears the home indicator on iOS.
    <div
      className="fixed bottom-5 right-4 z-[60] sm:bottom-7 sm:right-6"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {/* ── Collapsed launcher ─────────────────────────────────── */}
      {!open && (
        <button
          ref={launcherRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open the assistant and ask a question"
          className="group flex items-center gap-3 rounded-full border border-slate-200 bg-white/95 py-2 pl-2 pr-4 shadow-xl shadow-slate-900/10 backdrop-blur-md transition duration-300 hover:border-orange-300 hover:shadow-2xl sm:pr-5"
        >
          <span
            ref={faceRef}
            className="chat-ping grad-navy relative inline-flex h-10 w-10 flex-none items-center justify-center rounded-full"
          >
            <span className="flex items-center gap-1.5">
              {[0, 1].map((i) => (
                <span key={i} className="relative inline-flex h-3 w-3 items-center justify-center rounded-full bg-white">
                  <span
                    ref={setPupil(i)}
                    className="h-1.5 w-1.5 rounded-full transition-transform duration-100 ease-out"
                    style={{ background: "var(--color-navy)" }}
                  />
                </span>
              ))}
            </span>
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
          </span>
          <span className="hidden text-left sm:block">
            <span className="montserrat font-800 block text-[12px] text-slate-800">Ask us anything</span>
            <span className="block text-[10px] text-slate-600">Costs · timelines · services</span>
          </span>
        </button>
      )}

      {/* ── Expanded panel ─────────────────────────────────────── */}
      {open && (
        /* `h-[30rem]` flat put the header — and with it the close button — off
           the top of the viewport on a landscape phone or with the software
           keyboard raised. `dvh` accounts for the browser chrome that is
           actually showing. */
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Reena assistant"
          className="flex h-[min(30rem,calc(100dvh-6rem))] w-[calc(100vw-2rem)] max-w-[22rem] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        >
          {/* Header */}
          <div
            className="grad-navy relative flex items-center gap-3 px-4 py-3.5"
          >
            <span className="relative inline-flex h-9 w-9 flex-none items-center justify-center rounded-full bg-white/10">
              <span className="flex items-center gap-1">
                {[2, 3].map((i) => (
                  <span key={i} className="relative inline-flex h-2.5 w-2.5 items-center justify-center rounded-full bg-white">
                    <span
                      ref={setPupil(i)}
                      className="h-1 w-1 rounded-full transition-transform duration-100 ease-out"
                      style={{ background: "var(--color-navy)" }}
                    />
                  </span>
                ))}
              </span>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-navy bg-emerald-400" />
            </span>
            <div className="flex-1">
              <div className="montserrat font-800 text-[12.5px] text-white">Reena Assistant</div>
              <div className="flex items-center gap-1.5 text-[10px] text-white/55">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Automated · answers common questions
              </div>
            </div>
            <button
              type="button"
              onClick={reset}
              aria-label="Start a new chat"
              title="Start over"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white"
            >
              <RotateCcw size={13} strokeWidth={2.2} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close the assistant"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <X size={15} strokeWidth={2.2} aria-hidden="true" />
            </button>
          </div>

          {/* Log */}
          <div
            ref={scrollRef}
            className="chat-scroll flex-1 space-y-3 overflow-y-auto px-3.5 py-4"
            style={{ background: "linear-gradient(180deg,#f8fafc 0%,#f1f5f9 100%)" }}
            aria-live="polite"
            aria-relevant="additions"
            aria-atomic="false"
            role="log"
          >
            {messages.map((m) => (
              <div key={m.id} className={`chat-bubble-in flex gap-2 ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                {m.from === "bot" && (
                  <span
                    className="grad-navy mt-auto mb-5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full"
                    aria-hidden="true"
                  >
                    <Sparkles size={11} strokeWidth={2.2} className="text-orange-400" />
                  </span>
                )}
                <div className={`flex max-w-[80%] flex-col ${m.from === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`px-3.5 py-2.5 text-[12.5px] leading-relaxed shadow-sm ${
                      m.from === "user"
                        ? "rounded-2xl rounded-br-md text-white"
                        : "rounded-2xl rounded-bl-md border border-slate-200 bg-white text-slate-600"
                    }`}
                    style={m.from === "user" ? { background: "var(--color-brand)" } : undefined}
                  >
                    {m.text}
                    {m.link && (
                      <Link
                        to={m.link.href}
                        onClick={() => setOpen(false)}
                        className="montserrat font-700 mt-2.5 inline-flex items-center gap-1 rounded-lg bg-orange-50 px-2.5 py-1.5 text-[11px] text-orange-600 transition hover:gap-2 hover:bg-orange-100"
                      >
                        {m.link.label}
                        <ArrowRight size={11} strokeWidth={2.4} aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                  <span className="mt-1 px-1 text-[9.5px] text-slate-600">{m.at}</span>
                </div>
              </div>
            ))}

            {typing && (
              <div className="chat-bubble-in flex items-end gap-2">
                <span
                  className="grad-navy inline-flex h-6 w-6 flex-none items-center justify-center rounded-full"
                  aria-hidden="true"
                >
                  <Sparkles size={11} strokeWidth={2.2} className="text-orange-400" />
                </span>
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-3.5 py-3 shadow-sm">
                  <span className="chat-dot h-1.5 w-1.5 rounded-full bg-slate-400" />
                  <span className="chat-dot h-1.5 w-1.5 rounded-full bg-slate-400" />
                  <span className="chat-dot h-1.5 w-1.5 rounded-full bg-slate-400" />
                  <span className="sr-only">Assistant is typing</span>
                </div>
              </div>
            )}

            {chips.length > 0 && !typing && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {chips.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => ask(c)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-300 hover:text-orange-600"
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              ask(draft)
            }}
            className="flex items-center gap-2 border-t border-slate-100 bg-white px-3 py-2.5"
          >
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type your question…"
              aria-label="Type your question"
              /* 16px on a phone. Under that, iOS Safari zooms the viewport in on
                 focus and never zooms back out — the same trap `.field` and the
                 hero search both fix deliberately, and this one was missed. */
              className="min-w-0 flex-1 rounded-full bg-slate-100 px-4 py-2.5 text-base text-slate-700 outline-none ring-1 ring-transparent transition placeholder:text-slate-500 focus:bg-white focus:ring-orange-300 sm:text-[12.5px]"
            />
            <button
              type="submit"
              disabled={!draft.trim() || typing}
              aria-label="Send message"
              className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-full text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 bg-brand"
            >
              <Send size={15} strokeWidth={2.2} aria-hidden="true" />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
