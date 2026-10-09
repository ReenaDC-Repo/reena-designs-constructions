import PageWrapper from "@/components/layout/PageWrapper"
import PageHeader from "@/components/ui/PageHeader"
import Seo from "@/components/Seo"
import { routeSeo } from "@/data/routes"
import FAQ from "@/components/ui/FAQ"

/**
 * Dedicated FAQ page.
 *
 * The accordion used to sit halfway down the homepage, where ten questions of
 * copy pushed the enquiry CTA below a very long scroll and none of it could be
 * linked to directly. On its own route it earns a canonical URL, carries the
 * FAQPage structured data by itself, and is reachable from the footer of every
 * page.
 */

const PAGE = routeSeo("/faq")

export default function Faq() {
  return (
    <PageWrapper
      cta={{
        title: "Still have a question?",
        subtitle: "Send it to an engineer and get a straight answer, with no obligation.",
        buttonText: "Talk to an Engineer",
        buttonHref: "/contact",
      }}
    >
      <Seo route="/faq" />
      <PageHeader
        title={PAGE.heading}
        subtitle={PAGE.subheading}
        crumbs={PAGE.crumbs}
      />

      {/* The section carries its own heading block and padding, so it needs no
          wrapper of its own — only the label is suppressed, because the page
          header above already says the same words. */}
      <FAQ showLabel={false} />
    </PageWrapper>
  )
}
