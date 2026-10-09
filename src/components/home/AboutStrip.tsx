import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { SITE_CONTAINER } from "@/components/layout/constants"
import SectionTitle from "@/components/ui/SectionTitle"
import drawingImg from "@/imports/about-drawing-to-interior.jpg"

const PILLARS = [
  {
    title: "Design-led",
    copy: "Architecture and interiors resolved before a single brick is laid.",
  },
  {
    title: "Self-executed",
    copy: "Our own site engineers and crews — no subcontracted guesswork.",
  },
  {
    title: "Accountable",
    copy: "Fixed-cost contracts, staged billing and a written handover date.",
  },
]

// Two-directional composite mask for the artwork:
// Horizontal pass: Dissolves the drawing softly on the left so technical blueprint lines emerge seamlessly out of the background.
// Vertical pass: Dissolves top and bottom edges so the artwork blends directly into the surrounding sections without hard lines.
const ARTWORK_MASK = {
  maskImage:
    "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.12) 14%, rgba(0,0,0,0.6) 32%, #000 52%), linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)",
  WebkitMaskImage:
    "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.12) 14%, rgba(0,0,0,0.6) 32%, #000 52%), linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)",
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in",
} as const

export default function AboutStrip() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-surface py-20 md:py-28">
      {/* Background blend artwork: Full-height, borderless, box-less image that dissolves into the section canvas */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[64%] select-none md:block lg:w-[58%]">
        <img
          src={drawingImg}
          alt="Architectural visualisation of a living space, resolving from a line drawing on the left into the finished, furnished interior on the right"
          width={1672}
          height={752}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-center"
          style={ARTWORK_MASK}
        />
        {/* Soft warm light bloom so the building sits naturally in warm daylight */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(75% 65% at 76% 48%, rgba(255,94,0,0.08) 0%, transparent 72%)",
          }}
          aria-hidden="true"
        />
      </div>

      <div className={`${SITE_CONTAINER} relative z-10 grid items-center gap-12 md:grid-cols-2`}>
        {/* Left Column: Clear Story & Focused Pillars */}
        <div className="max-w-xl">
          <SectionTitle
            level="display"
            align="left"
            eyebrow="About Reena Designs & Constructions"
            title="Top trusted Construction and Design Company"
            className="mb-0"
          />
          <div className="mt-3.5 h-0.5 w-16 rounded-full bg-brand" />

          <div className="mt-6 space-y-3 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
            <p>
              At Reena Design and Construction, we handle projects from initial planning to final
              handover, combining construction, design, materials, and skilled manpower in one
              complete solution.
            </p>
            <p>
              Our work includes civil construction, AutoCAD drawings, interior and exterior
              design, finishing works, material management, and project execution.
            </p>
            <p>
              We focus on delivering every project with quality workmanship, attention to detail,
              and smooth execution—turning plans and designs into completed spaces that are ready
              to use.
            </p>
          </div>

          {/* 3 Pillars in a clean, uncluttered layout */}
          <ul className="mt-8 space-y-4">
            {PILLARS.map(({ title, copy }) => (
              <li key={title}>
                <div className="montserrat font-700 text-sm text-navy">{title}</div>
                <div className="mt-0.5 text-[13px] leading-relaxed text-slate-500">{copy}</div>
              </li>
            ))}
          </ul>

          {/* CTA button & 15+ years stat */}
          <div className="mt-9 flex flex-wrap items-center gap-6">
            <Link
              to="/about"
              className="btn-outline montserrat font-700 group gap-2"
            >
              Know More About Us
              <ArrowRight
                size={15}
                strokeWidth={2.2}
                className="transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>

            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
              <span className="montserrat font-900 text-3xl leading-none text-brand-ink">30+</span>
              <span className="text-[11px] leading-tight font-semibold text-slate-500">
                Years building
                <br />
                across India
              </span>
            </div>
          </div>
        </div>

        {/* Mobile: no mask. The desktop artwork dissolves sideways into the copy
            beside it; stacked on a phone there is nothing either side of it to
            blend into, so the fade only ate the image's edges. */}
        <div className="md:hidden">
          <div className="relative -mx-8 overflow-hidden sm:-mx-9">
            <img
              src={drawingImg}
              alt="Architectural visualisation of a living space, resolving from a line drawing on the left into the finished, furnished interior on the right"
              width={1672}
              height={752}
              loading="lazy"
              decoding="async"
              className="h-64 sm:h-72 w-full object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
