import { Link } from "react-router-dom"
import PageWrapper from "@/components/layout/PageWrapper"
import PageHeader from "@/components/ui/PageHeader"
import Seo from "@/components/Seo"
import { routeSeo } from "@/data/routes"
import { SITE_CONTAINER } from "@/components/layout/constants"
import { SITE } from "@/data/siteInfo"

/**
 * Cookie notice.
 *
 * This page describes the site's real behaviour: it stores exactly one item,
 * locally, to remember whether the banner was answered. If analytics is ever
 * enabled (site.json → analytics.googleAnalyticsId), the table below and the
 * consent gate in CookieBanner both have to be updated to match.
 */
const STORED = [
  {
    name: "rdc-cookie-choice",
    kind: "Local storage (not a cookie)",
    purpose:
      "Remembers that you answered the cookie notice, so it does not reappear on every page you visit.",
    life: "Until you clear your browser storage",
  },
]

const PAGE = routeSeo("/cookies")

export default function Cookies() {
  return (
    <PageWrapper>
      <Seo route="/cookies" />
      <PageHeader title={PAGE.heading} subtitle={PAGE.subheading} crumbs={PAGE.crumbs} />

      <div className={`${SITE_CONTAINER} py-14`}>
        <div className="max-w-2xl">
          <div className="mb-9 border border-emerald-200 bg-emerald-50 p-5">
            <p className="text-sm leading-7 text-emerald-900">
              <strong className="font-semibold">In short:</strong> this website sets no advertising
              cookies, no analytics cookies and no tracking pixels. It stores one item in your
              browser, listed below, and that item never leaves your device.
            </p>
          </div>

          <section className="mb-9">
            <h2 className="montserrat font-800 mb-3 text-sm tracking-wider uppercase text-navy">
              What we store
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[34rem] border-collapse text-left text-[13px]">
                <thead>
                  <tr className="border-b border-hairline">
                    {["Name", "Type", "Purpose", "Expires"].map((h) => (
                      <th key={h} className="montserrat font-700 py-2.5 pr-4 text-xs uppercase tracking-wider text-slate-500">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {STORED.map((row) => (
                    <tr key={row.name} className="border-b border-slate-100 align-top">
                      <td className="py-3 pr-4 font-mono text-[12px] text-navy">{row.name}</td>
                      <td className="py-3 pr-4 text-slate-500">{row.kind}</td>
                      <td className="py-3 pr-4 leading-6 text-slate-500">{row.purpose}</td>
                      <td className="py-3 pr-4 text-slate-500">{row.life}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-9">
            <h2 className="montserrat font-800 mb-3 text-sm tracking-wider uppercase text-navy">
              Third-party requests
            </h2>
            <p className="mb-3 text-sm leading-7 text-slate-500">
              Some page content is served from other domains: Google Fonts provides the typeface,
              Unsplash provides some gallery photographs, and OpenStreetMap renders the map on our
              Contact page. Your browser contacts those services directly to fetch that content, so
              they can see your IP address. None of them set an identifying cookie on our behalf.
            </p>
          </section>

          <section className="mb-9">
            <h2 className="montserrat font-800 mb-3 text-sm tracking-wider uppercase text-navy">
              Changing your answer
            </h2>
            <p className="text-sm leading-7 text-slate-500">
              Clearing this site's data in your browser settings removes the stored answer, and the
              notice will appear again on your next visit. Declining costs you nothing — no part of
              this site depends on it.
            </p>
          </section>

          <p className="text-sm leading-7 text-slate-500">
            For anything else about your information, see our{" "}
            <Link to="/privacy" className="font-semibold text-brand-ink underline">
              Privacy Policy
            </Link>{" "}
            or email{" "}
            <a href={`mailto:${SITE.email}`} className="font-semibold text-brand-ink underline">
              {SITE.email}
            </a>
            .
          </p>

          <p className="mt-12 border-t border-hairline pt-6 text-xs text-slate-500">
            Last updated {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long" })}.
          </p>
        </div>
      </div>
    </PageWrapper>
  )
}
