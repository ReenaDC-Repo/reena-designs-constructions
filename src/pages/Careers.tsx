import PageWrapper from "@/components/layout/PageWrapper"
import Seo from "@/components/Seo"
import { routeSeo } from "@/data/routes"
import PageHeader from "@/components/ui/PageHeader"
import SectionTitle from "@/components/ui/SectionTitle"
import { SITE_CONTAINER } from "@/components/layout/constants"
import { SITE } from "@/data/siteInfo"

const WHY_JOIN = [
  "Named material grades and fixed contracts — you are not asked to defend a corner cut on-site",
  "Your own crew and engineers on every project, not subcontracted labour",
  "Work across residential, commercial, renovation and interior fit-outs — not one repeated job",
  "A practice built over 30+ years and 250+ handovers, still run out of Medinipur",
] as const

/**
 * Categories, not a live job board.
 *
 * A small firm's hiring need moves faster than a marketing page — publishing
 * named vacancies here would go stale within a quarter. These are the roles
 * we take applications for on an ongoing basis; whether a seat is open right
 * now is answered on the call, not on this page.
 */
const ROLES = [
  {
    title: "Site Engineer / Site Supervisor",
    copy: "Runs day-to-day execution on a live site — quality, sequencing and the crews working it.",
  },
  {
    title: "Draughtsman / CAD Designer",
    copy: "Working drawings, sanction plans and 3D elevations in AutoCAD, from an architect's brief.",
  },
  {
    title: "Interior Designer",
    copy: "Residential and commercial fit-outs, from concept through to a quoted material specification.",
  },
  {
    title: "Structural Engineer",
    copy: "Load calculations, reinforcement detailing and sign-off on every structural drawing we issue.",
  },
  {
    title: "Trainee / Apprentice",
    copy: "For recent graduates and AutoCAD trainees — see our course on the Learn With Us page.",
  },
] as const

const PAGE = routeSeo("/careers")

export default function Careers() {
  return (
    <PageWrapper
      cta={{
        title: "Don't see your role listed?",
        subtitle: "Send your resume anyway — we keep every application on file for the next opening.",
        buttonText: "Get in Touch",
        buttonHref: "/contact",
      }}
    >
      <Seo route="/careers" />
      <PageHeader title={PAGE.heading} subtitle={PAGE.subheading} crumbs={PAGE.crumbs} />

      <section className="py-14 lg:py-20">
        <div className={SITE_CONTAINER}>
          <div className="max-w-2xl">
            <SectionTitle title="Build with a team that names its own standards" align="left" className="mb-6" />
            <p className="text-sm leading-7 text-slate-500">
              We hire engineers, designers and draughtsmen who would rather stand behind a finished
              build than explain away a shortcut. If that is how you already work, we would like to
              hear from you.
            </p>
          </div>

          <ul className="mt-9 grid gap-x-10 gap-y-3 border-t border-hairline pt-7 sm:grid-cols-2">
            {WHY_JOIN.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-slate-600">
                <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-brand" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-surface py-14 lg:py-20">
        <div className={SITE_CONTAINER}>
          <SectionTitle
            title="ROLES WE HIRE FOR"
            align="left"
            subtitle="Ongoing categories, not a fixed vacancy list — call to ask what is open right now."
            className="mb-10"
          />

          <ul className="divide-y divide-hairline border-y border-hairline">
            {ROLES.map((role) => (
              <li key={role.title} className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-8">
                <h3 className="montserrat font-700 w-full flex-none text-sm text-navy sm:w-64">
                  {role.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-slate-500">{role.copy}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className={`${SITE_CONTAINER} max-w-2xl`}>
          <SectionTitle title="HOW TO APPLY" align="left" className="mb-6" />
          <p className="text-sm leading-7 text-slate-500">
            Send your resume and the role you are applying for to{" "}
            <a href={`mailto:${SITE.email}`} className="font-600 text-brand-ink underline underline-offset-2">
              {SITE.email}
            </a>{" "}
            or call{" "}
            <a href={SITE.phoneHref} className="font-600 text-brand-ink underline underline-offset-2">
              {SITE.phones[0]}
            </a>
            . We reply to every application, even when there is nothing open at the time.
          </p>
        </div>
      </section>
    </PageWrapper>
  )
}
