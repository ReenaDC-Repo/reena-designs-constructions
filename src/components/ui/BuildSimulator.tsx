import { useCallback, useEffect, useRef, useState } from "react"
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw, Check } from "lucide-react"
import BuildScene from "./BuildScene"
import { STAGES, PHASE_META } from "@/data/buildStages"

const TOTAL = STAGES.length
const TICK = 2800

/**
 * Interactive build simulator.
 * Redesigned in the precision architectural design language of Reena Designs & Constructions:
 * clean technical framing, executive client deliverables, and an interactive CAD timeline.
 */
export default function BuildSimulator() {
  const [step, setStep] = useState(1)
  const [playing, setPlaying] = useState(true)
  const timer = useRef<number | null>(null)

  const stage = STAGES[step - 1]
  const phase = PHASE_META[stage.phase - 1]
  const pct = Math.round((step / TOTAL) * 100)

  // Respect user preference for reduced motion
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(false)
  }, [])

  useEffect(() => {
    if (!playing) return
    timer.current = window.setInterval(() => setStep((s) => (s >= TOTAL ? 1 : s + 1)), TICK)
    return () => {
      if (timer.current !== null) clearInterval(timer.current)
    }
  }, [playing])

  // Manual navigation pauses auto-play
  const goTo = useCallback((n: number) => {
    setPlaying(false)
    setStep(Math.min(Math.max(n, 1), TOTAL))
  }, [])

  return (
    <div
      className="overflow-hidden border border-slate-200 bg-white shadow-xl shadow-slate-900/5 transition-all"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") goTo(step + 1)
        if (e.key === "ArrowLeft") goTo(step - 1)
      }}
      tabIndex={0}
      role="group"
      aria-label="Interactive build process simulator"
    >
      {/* ── Architectural Viewport Top Bar ─────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-surface px-5 py-3.5 sm:px-7">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 bg-orange-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-ink border border-orange-200/60">
            {phase.tag}
          </span>
          <span className="hidden text-slate-300 sm:inline">|</span>
          <span className="montserrat font-700 text-xs tracking-wider text-navy uppercase">
            {phase.name}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${playing ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
            <span className="font-mono text-[11px] font-semibold text-slate-500">
              {playing ? "SIMULATION ACTIVE" : "PAUSED"}
            </span>
          </div>
          <span className="rounded bg-slate-200/70 px-2 py-0.5 font-mono text-[11px] font-bold text-navy">
            {String(step).padStart(2, "0")} / {TOTAL}
          </span>
        </div>
      </div>

      {/* ── Main View: Scene & Readout ─────────────────────────── */}
      <div className="grid lg:grid-cols-[1.38fr_1fr]">
        {/* Scene Viewport */}
        <div className="relative flex items-center justify-center border-b border-slate-200 bg-slate-50/40 p-4 sm:p-6 lg:border-b-0 lg:border-r lg:p-8">
          <BuildScene step={step} />
        </div>

        {/* Readout Column */}
        <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-9">
          <div>
            {/* Stage Counter & Kicker */}
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-6 rounded-full bg-brand" aria-hidden="true" />
              <span className="montserrat font-700 text-[10.5px] uppercase tracking-[0.22em] text-brand-ink">
                Stage {String(step).padStart(2, "0")} of {TOTAL}
              </span>
            </div>

            {/* Stage Title */}
            <h3 className="montserrat font-800 mt-2.5 text-2xl leading-tight text-navy" aria-live="polite">
              {stage.label}
            </h3>

            {/* Stage Description */}
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {stage.blurb}
            </p>

            {/* Client Deliverable Assurance Card */}
            <div className="mt-6 border border-slate-200/90 bg-slate-50/80 p-4.5 transition-all">
              <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.16em] text-brand-ink">
                <Check size={13} strokeWidth={2.8} aria-hidden="true" />
                <span>Client Deliverable</span>
              </div>
              <p className="mt-1 text-[13.5px] font-medium leading-relaxed text-navy">
                {stage.gain}
              </p>
            </div>

            {/* Overall Progress Gauge */}
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-500">Total Project Progress</span>
                <span className="montserrat font-800 text-brand-ink">{pct}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full transition-[width] duration-500 ease-out"
                  style={{
                    width: `${pct}%`,
                    background: "linear-gradient(90deg, var(--color-brand-light), var(--color-brand))",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? "Pause simulation" : "Play simulation"}
                className="btn-orange montserrat font-700 gap-2 px-4 py-2.5 text-xs shadow-xs active:scale-95"
              >
                {playing ? <Pause size={13} strokeWidth={2.5} /> : <Play size={13} strokeWidth={2.5} />}
                {playing ? "Pause" : "Play"}
              </button>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => goTo(step - 1)}
                  disabled={step === 1}
                  aria-label="Previous stage"
                  className="inline-flex h-9 w-9 items-center justify-center border border-slate-200 bg-white text-navy transition hover:border-brand hover:text-brand disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-navy"
                >
                  <ChevronLeft size={16} strokeWidth={2.4} />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(step + 1)}
                  disabled={step === TOTAL}
                  aria-label="Next stage"
                  className="inline-flex h-9 w-9 items-center justify-center border border-slate-200 bg-white text-navy transition hover:border-brand hover:text-brand disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-navy"
                >
                  <ChevronRight size={16} strokeWidth={2.4} />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setStep(1)
                setPlaying(true)
              }}
              title="Restart from step one"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-brand"
            >
              <RotateCcw size={13} strokeWidth={2.2} />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Bottom Phase & Stage Navigator ─────────────────────── */}
      <div className="border-t border-slate-200 bg-slate-50/60 p-3 sm:p-6">
        <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {PHASE_META.map((p) => {
            const steps = STAGES.filter((s) => s.phase === p.n)
            const isCurrentPhase = stage.phase === p.n
            const doneInPhase = steps.filter((s) => s.n < step).length

            return (
              <div
                key={p.n}
                className={`border p-3 transition-colors sm:p-3.5 ${
                  isCurrentPhase
                    ? "border-brand/40 bg-white shadow-xs"
                    : "border-slate-200/80 bg-white/70 hover:border-slate-300"
                }`}
              >
                {/*
                  Tag, phase name and count.

                  One flex row that rewraps rather than two fixed rows: on a
                  phone the name sits inline after the tag, and from `sm` up
                  `basis-full` pushes it onto a line of its own — the original
                  desktop layout. Four stacked cards each spending a row on a
                  tag and another on a name filled a phone viewport before a
                  single stage pill came into view.
                */}
                <div className="mb-2 flex flex-wrap items-baseline gap-x-2 sm:mb-0">
                  <span
                    className={`montserrat font-800 text-[10px] uppercase tracking-[0.16em] ${
                      isCurrentPhase ? "text-brand-ink" : "text-navy"
                    }`}
                  >
                    {p.tag}
                  </span>

                  <span className="min-w-0 flex-1 truncate text-[11px] font-semibold text-slate-600 sm:order-last sm:mt-2.5 sm:mb-3 sm:basis-full sm:flex-none">
                    {p.name}
                  </span>

                  <span className="ml-auto font-mono text-[9.5px] font-semibold text-slate-600">
                    {doneInPhase}/{steps.length}
                  </span>
                </div>

                {/* Stage Pills */}
                <div className="flex gap-1 sm:gap-1.5">
                  {steps.map((s) => {
                    const passed = s.n < step
                    const current = s.n === step

                    return (
                      <button
                        key={s.n}
                        type="button"
                        onClick={() => goTo(s.n)}
                        title={`Stage ${String(s.n).padStart(2, "0")}: ${s.label}`}
                        aria-label={`Go to stage ${s.n}: ${s.label}`}
                        aria-current={current}
                        className={`h-6 flex-1 rounded-md text-[9.5px] font-bold transition-all sm:h-7 sm:text-[10px] ${
                          current
                            ? "bg-brand text-white shadow-xs scale-105 ring-2 ring-brand/30"
                            : passed
                            ? "bg-orange-100/80 text-brand-ink hover:bg-orange-200/80"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200/80 hover:text-navy"
                        }`}
                      >
                        {String(s.n).padStart(2, "0")}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
