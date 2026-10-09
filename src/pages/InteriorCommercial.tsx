import PageWrapper from "@/components/layout/PageWrapper"
import Seo from "@/components/Seo"
import { routeSeo } from "@/data/routes"
import PageHeader from "@/components/ui/PageHeader"
import SubNav from "@/components/ui/SubNav"
import { SITE_CONTAINER } from "@/components/layout/constants"

const INTRO =
  "Offices, restaurants, retail floors and hotels fitted out on commercial timelines — sequenced around your trading hours so the doors stay open."

const PAGE = routeSeo("/our-work/interior/commercial")

export default function InteriorCommercial() {
  return (
    <PageWrapper
      cta={{
        title: "Planning a commercial fit-out?",
        subtitle: "Free site visit, itemised quote, and a completion date in writing.",
        buttonText: "Talk to Our Team",
        buttonHref: "/contact",
      }}
    >
      <Seo route="/our-work/interior/commercial" />
      <PageHeader
        title={PAGE.heading}
        subtitle={PAGE.subheading}
        crumbs={PAGE.crumbs}
        backdrop
      />

      <section className={`${SITE_CONTAINER} pt-10 pb-20`}>
        <SubNav
          tabs={[
            { label: "Residential Interior", href: "/our-work/interior/residential" },
            { label: "Commercial Interior", href: "/our-work/interior/commercial" },
          ]}
        />

        <p className="mb-9 max-w-2xl text-sm leading-7 text-slate-500">{INTRO}</p>

        <div className="border border-hairline bg-surface px-6 py-16 text-center">
          <p className="montserrat font-800 text-2xl text-navy">Coming soon</p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
            We are preparing photographs of our commercial interiors. Please check back shortly, or
            get in touch and we will happily share examples.
          </p>
        </div>
      </section>
    </PageWrapper>
  )
}
