import { useState } from "react"
import { Link } from "react-router-dom"
import { Plus, MessageCircleQuestion, ArrowRight } from "lucide-react"
import { FAQS } from "@/data/faq"
import { SITE_CONTAINER } from "@/components/layout/constants"

/**
 * Frequently asked questions.
 *
 * Lives on its own /faq route, linked from the footer of every page. The
 * FAQPage structured data for these questions is part of that route's graph
 * in `src/data/routes.ts`, so it is also present in the prerendered HTML.
 */
export default function FAQ({ showLabel = true }: { showLabel?: boolean } = {}) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="relative overflow-hidden bg-white py-20">
      {/* Drafting wash */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(26,39,68,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(26,39,68,0.05) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(100% 80% at 50% 30%, #000 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(100% 80% at 50% 30%, #000 30%, transparent 100%)",
        }}
      />

      <div className={`${SITE_CONTAINER} relative grid gap-12 lg:grid-cols-[0.85fr_1.15fr]`}>
        {/* ── Heading ─────────────────────────────────────────── */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          {/* Hidden on the dedicated FAQ page, whose <h1> already reads
              "Frequently Asked Questions". */}
          {showLabel && (
            <div className="montserrat font-800 mb-4 flex items-center gap-3 text-[13px] uppercase tracking-[0.2em] text-brand-ink">
              <MessageCircleQuestion size={17} strokeWidth={2.2} aria-hidden="true" />
              Frequently Asked Questions
              <span className="h-px flex-1 bg-gradient-to-r from-orange-400 to-transparent" />
            </div>
          )}

          <h2 className="montserrat font-800 text-xl leading-snug md:text-2xl text-navy">
            The questions we get asked before every build
          </h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-500">
            Straight answers on cost, timelines, approvals and quality — the things worth settling
            before you commit to a contractor.
          </p>

          <div className="mt-7 border border-slate-200 bg-slate-50/70 p-5">
            <p className="text-[13px] leading-relaxed text-slate-600">
              Still unsure about something? Ask our assistant in the corner, or send the question
              to an engineer for a proper answer.
            </p>
            <Link
              to="/contact"
              className="btn-navy montserrat font-700 group mt-4 gap-2"
            >
              Ask our team
              <ArrowRight size={14} strokeWidth={2.2} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* ── Accordion ───────────────────────────────────────── */}
        <div className="divide-y divide-slate-100 border-t border-slate-100">
          {FAQS.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={item.q}>
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    className="group flex w-full items-start gap-4 py-5 text-left"
                  >
                    <span
                      className="montserrat font-800 mt-0.5 flex-none text-[11px] tabular-nums transition-colors"
                      style={{ color: isOpen ? "var(--color-brand)" : "#cbd5e1" }}
                      aria-hidden="true"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="montserrat font-700 flex-1 text-[14.5px] leading-snug transition-colors"
                      style={{ color: isOpen ? "var(--color-brand-ink)" : "var(--color-navy)" }}
                    >
                      {item.q}
                    </span>
                    <span
                      className={`mt-0.5 inline-flex h-7 w-7 flex-none items-center justify-center rounded-full border transition-all duration-300 ${
                        isOpen
                          ? "rotate-45 border-orange-300 bg-orange-50 text-orange-600"
                          : "border-slate-200 text-slate-500 group-hover:border-orange-300 group-hover:text-orange-500"
                      }`}
                      aria-hidden="true"
                    >
                      <Plus size={14} strokeWidth={2.4} />
                    </span>
                  </button>
                </h3>

                {/* Grid-rows trick: animates to the panel's natural height
                    without measuring it or hard-coding a max-height. */}
                <div
                  id={`faq-panel-${i}`}
                  className="grid transition-[grid-template-rows] duration-400 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="pb-6 pl-9 pr-11 text-[13.5px] leading-7 text-slate-500">{item.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
