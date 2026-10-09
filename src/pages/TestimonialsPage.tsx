import { Link } from "react-router-dom"
import { ArrowRight, Quote } from "lucide-react"
import PageWrapper from "@/components/layout/PageWrapper"
import Seo from "@/components/Seo"
import { routeSeo } from "@/data/routes"
import PageHeader from "@/components/ui/PageHeader"
import SectionTitle from "@/components/ui/SectionTitle"
import { SITE_CONTAINER } from "@/components/layout/constants"

/* Coming soon. The quotes that were here were placeholder copy, not reviews
   collected from real clients, so they are not published anywhere on the
   site — this page, the site search or the chat assistant — until genuine
   client accounts are in. */

const PAGE = routeSeo("/our-work/testimonials")

export default function TestimonialsPage() {
  return (
    <PageWrapper
      cta={{
        title: "Ready to start your project?",
        subtitle: "Free site visit, itemised quote, and a completion date in writing.",
        buttonText: "Start Your Project",
        buttonHref: "/contact",
      }}
    >
      <Seo route="/our-work/testimonials" />
      <PageHeader
        title={PAGE.heading}
        subtitle={PAGE.subheading}
        crumbs={PAGE.crumbs}
        backdrop
      />

      <section className={`${SITE_CONTAINER} py-16 lg:py-24`}>
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <Quote
            size={28}
            strokeWidth={2}
            aria-hidden="true"
            className="mb-6 rotate-180 text-orange-200"
          />
          <SectionTitle title="COMING SOON" className="mb-4" />
          <p className="text-sm leading-7 text-slate-500">
            We are collecting accounts from our clients in their own words. Their stories will be
            published here shortly.
          </p>
          <Link
            to="/our-work"
            className="montserrat font-700 group mt-8 inline-flex items-center gap-2 border-b-2 border-brand pb-1.5 text-[13px] text-navy transition-colors duration-300 hover:text-brand"
          >
            Browse our work in the meantime
            <ArrowRight
              size={14}
              strokeWidth={2.2}
              className="transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </section>
    </PageWrapper>
  )
}
