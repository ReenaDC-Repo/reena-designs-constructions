import { SITE_CONTAINER } from "@/components/layout/constants"
import SectionTitle from "@/components/ui/SectionTitle"
import CountUp from "@/components/ui/CountUp"

const stats = [
  { num: "250+", label: "Projects delivered", sub: "Across Paschim Medinipur & India" },
  { num: "30+", label: "Years of experience", sub: "A legacy since the 1990s" },
  { num: "100%", label: "Quality assurance", sub: "Engineer-supervised, ISI-grade material" },
]

export default function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="relative bg-surface py-12 md:py-16">
      <div className={SITE_CONTAINER}>
        {/* Top Header Row — small, refined typography */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-8 pb-8 border-b border-slate-200/80">
          <div>
            <SectionTitle
              level="display"
              align="left"
              eyebrow="Why choose us"
              title="A TRACK RECORD YOU CAN AUDIT"
              className="mb-0"
            />
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md leading-relaxed md:text-right">
            We publish the numbers because they hold up. Fixed timelines, transparent costing and engineer-supervised quality control on every site we run.
          </p>
        </div>

        {/* Metric Spec Ledger — completely unboxed, no cards, hairline dividers */}
        {/* The gap used to be dropped at `md` while the dividing rules did not
            arrive until `lg` — so across the whole tablet range the four
            figures sat in a 2×2 block with no gutter and no rule, touching.
            The gap now runs until the dividers take over, which is also where
            the cell padding (`lg:px-7`) arrives to hold the type off them. */}
        <div className="mt-8 grid grid-cols-1 gap-6 divide-slate-200/80 sm:grid-cols-3 sm:gap-0 sm:divide-x">
          {stats.map(({ num, label, sub }) => (
            <div key={label} className="sm:first:pl-0 sm:px-7">
              <div className="mb-2">
                <span className="montserrat font-700 text-[11px] tracking-wider uppercase text-slate-600">
                  {label}
                </span>
              </div>
              <div className="montserrat font-900 text-2xl sm:text-3xl tracking-tight text-navy">
                <CountUp value={num} />
              </div>
              <p className="mt-1 text-[12px] leading-relaxed text-slate-500">
                {sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
