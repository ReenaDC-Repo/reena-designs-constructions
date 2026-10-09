import PageWrapper from "@/components/layout/PageWrapper"
import Seo from "@/components/Seo"
import { routeSeo } from "@/data/routes"
import PageHeader from "@/components/ui/PageHeader"
import SectionTitle from "@/components/ui/SectionTitle"
import BuildSimulator from "@/components/ui/BuildSimulator"
import { SITE_CONTAINER } from "@/components/layout/constants"
import ServiceAreas from "@/components/ui/ServiceAreas"

const SERVICES = [
  {
    title: "Civil Construction",
    copy: "Complete construction solutions for residential, commercial, government, and non-government projects.",
  },
  {
    title: "AutoCAD Drawing",
    copy: "Accurate and detailed AutoCAD drawings to support proper planning and execution.",
  },
  {
    title: "Interior Design",
    copy: "Functional and aesthetic interior solutions designed to suit your space and requirements.",
  },
  {
    title: "Exterior Design",
    copy: "Professional exterior design solutions that enhance the look and overall appeal of your property.",
  },
  {
    title: "Materials & Manpower",
    copy: "Reliable construction materials and skilled manpower for smooth project execution.",
  },
  {
    title: "Finishing Works",
    copy: "Quality finishing services to bring every project together with attention to detail.",
  },
] as const

/** The package the six services add up to; spans two cells in the grid. */
const COMPLETE_PACKAGE = {
  title: "Complete Construction Solutions",
  copy: "From drawing and planning to construction, interiors, exteriors, finishing, and final handover, we provide a complete package under one roof.",
} as const

const CAPABILITY_STATS = [
  { value: `${SERVICES.length}`, label: "Disciplines" },
  { value: "In-house", label: "Every stage" },
  { value: "1", label: "Contract" },
] as const

const PAGE = routeSeo("/services")

export default function Services() {
  return (
    <PageWrapper
      cta={{
        title: "Ready to start your project?",
        subtitle: "Itemised quote, named materials, and a fixed completion date.",
        buttonText: "Get a Free Quote",
        buttonHref: "/contact",
      }}
    >
      {/* Each discipline is emitted as its own `Service`
          entity, which is what lets a query naming a service and a town
          ("renovation contractor in Ghatal") match a page whose copy never
          uses that exact phrase. */}
      <Seo route="/services" />
      <PageHeader
        title={PAGE.heading}
        subtitle={PAGE.subheading}
        crumbs={PAGE.crumbs}
        backdrop
      />

      {/* ── Full-service capability ───────────────────────────────── */}
      <section className="relative overflow-hidden py-14 lg:py-20">
        {/* Artwork pinned to the right edge, dissolving sideways into the copy. */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[55%] select-none md:block lg:w-[50%]"
          style={{
            maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.18) 18%, #000 48%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.18) 18%, #000 48%)",
          }}
        >
          <img
            src="/stock/photo-1541888946425-d81bb19240f5-1400x900.jpg"
            alt="A site crew marking out the slab on a live construction site"
            width={1400}
            height={900}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div className={`${SITE_CONTAINER} relative z-10 grid items-center gap-10 md:grid-cols-2`}>
          <div className="max-w-xl">
            <SectionTitle title="FULL-SERVICE CAPABILITY" align="left" className="mb-8" />

            <div className="flex flex-col gap-4 text-sm leading-7 text-slate-500">
              <p>
                We provide complete construction solutions under one roof—from AutoCAD drawings and
                civil construction to interior &amp; exterior design, materials, skilled manpower,
                finishing, and final project handover.
              </p>
              <p>
                With decades of experience and a strong legacy, we manage every stage of the
                project with a focus on quality, reliability, and seamless execution.
              </p>
            </div>

            <dl className="mt-9 flex flex-wrap gap-x-12 gap-y-5 border-t border-hairline pt-7">
              {CAPABILITY_STATS.map(({ value, label }) => (
                <div key={label}>
                  <dd className="montserrat font-900 text-2xl leading-none text-navy">{value}</dd>
                  <dt className="mt-2 text-[10.5px] uppercase tracking-[0.16em] text-slate-600">
                    {label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>

          {/* Mobile: no mask — nothing sits beside the image on a phone for it
              to dissolve into, so a side fade only ate its edges. */}
          <div className="md:hidden">
            <div className="relative -mx-8 overflow-hidden sm:-mx-9">
              <img
                src="/stock/photo-1541888946425-d81bb19240f5-1400x900.jpg"
                alt="A site crew marking out the slab on a live construction site"
                width={1100}
                height={720}
                loading="lazy"
                decoding="async"
                className="h-64 w-full object-cover sm:h-72"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── The services ──────────────────────────────────────────── */}
      <section className="border-y border-hairline bg-surface py-14 lg:py-16">
        <div className={SITE_CONTAINER}>
          <SectionTitle title="SERVICES WE PROVIDE" align="left" className="mb-8" />
        </div>

        {/* Full-bleed, divided by hairline seams rather than boxed into cards —
            the same ledger the About page uses. Four to a row; the complete
            package spans the last two cells so the second row closes flush. */}
        <div className="grid gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map(({ title, copy }) => (
            <article key={title} className="group flex flex-col gap-3.5 bg-surface p-7 lg:p-8">
              <span
                className="h-0.5 w-9 flex-none rounded-full bg-brand transition-all duration-500 group-hover:w-14"
                aria-hidden="true"
              />
              <h3 className="montserrat font-800 text-[15px] leading-snug text-navy">{title}</h3>
              <p className="text-[13px] leading-relaxed text-slate-500">{copy}</p>
            </article>
          ))}
          <article className="group flex flex-col gap-3.5 bg-surface p-7 sm:col-span-2 lg:p-8">
            <span
              className="h-0.5 w-9 flex-none rounded-full bg-brand transition-all duration-500 group-hover:w-14"
              aria-hidden="true"
            />
            <h3 className="montserrat font-800 text-[15px] leading-snug text-navy">
              {COMPLETE_PACKAGE.title}
            </h3>
            <p className="max-w-3xl text-[13px] leading-relaxed text-slate-500">
              {COMPLETE_PACKAGE.copy}
            </p>
          </article>
        </div>
      </section>

      {/* ── Process ───────────────────────────────────────────────── */}
      <section className="py-14 lg:py-20">
        <div className={SITE_CONTAINER}>
          <SectionTitle title="WATCH YOUR BUILDING TAKE SHAPE" align="left" className="mb-8" />
          <p className="-mt-4 mb-10 max-w-2xl text-sm leading-7 text-slate-500">
            Nineteen steps, four phases, one documented sequence — from bare plot to keys in your
            hand. Press play, or step through it yourself.
          </p>
          <BuildSimulator />
        </div>
      </section>

      <ServiceAreas compact />
    </PageWrapper>
  )
}
