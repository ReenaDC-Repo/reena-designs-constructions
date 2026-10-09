import PageWrapper from "@/components/layout/PageWrapper"
import PageHeader from "@/components/ui/PageHeader"
import Seo from "@/components/Seo"
import { routeSeo } from "@/data/routes"
import { SITE_CONTAINER } from "@/components/layout/constants"
import { SITE } from "@/data/siteInfo"
import LegalDocument, { LegalLink, LegalList, type LegalSection } from "@/components/ui/LegalDocument"

/**
 * Privacy Policy.
 *
 * Structured around India's Digital Personal Data Protection Act, 2023 (notice,
 * purpose limitation, data principal rights, grievance redressal) and the
 * reasonable-security duty under section 43A of the Information Technology
 * Act, 2000 and the SPDI Rules, 2011.
 *
 * Every statement here describes what the site actually does. Keep it that
 * way: update this page *before* adding analytics, a CRM, a form processor
 * (VITE_CONTACT_ENDPOINT), chat software or any other third-party script —
 * and change EFFECTIVE when the text changes.
 */
const EFFECTIVE = "9 October 2026"

const mail = <LegalLink to={`mailto:${SITE.email}`}>{SITE.email}</LegalLink>
const phone = <LegalLink to={SITE.phoneHref}>{SITE.phones[0]}</LegalLink>
const address = `${SITE.address.street}, ${SITE.address.region} ${SITE.address.postalCode}, India`

const SECTIONS: LegalSection[] = [
  {
    id: "about",
    title: "About this policy",
    content: (
      <>
        <p>
          This Privacy Policy explains how {SITE.name} (“we”, “us”, “our”) collects, uses, shares
          and protects personal data when you visit this website, contact us, apply for a job, enquire
          about a course, or engage us for a project.
        </p>
        <p>
          For the purposes of the Digital Personal Data Protection Act, 2023 (“DPDP Act”), we are the
          Data Fiduciary for the personal data described here, and you are the Data Principal. This
          policy should be read with our <LegalLink to="/terms">Terms &amp; Conditions</LegalLink> and{" "}
          <LegalLink to="/cookies">Cookie Policy</LegalLink>.
        </p>
      </>
    ),
  },
  {
    id: "who-we-are",
    title: "Who we are and how to reach us",
    content: (
      <>
        <p>
          {SITE.name} is a construction, architecture and interior design firm based at {address}.
        </p>
        <p>
          For any question about this policy or about personal data we hold, email {mail}, call {phone}{" "}
          ({SITE.hours}), or write to us at the address above, marked “Privacy”.
        </p>
      </>
    ),
  },
  {
    id: "what-we-collect",
    title: "Personal data we collect",
    content: (
      <>
        <p>
          <strong className="text-navy">Information you give us.</strong> We only collect what you
          choose to send:
        </p>
        <LegalList
          items={[
            <>
              <strong className="text-navy">Enquiries</strong> — through the Contact page form: your
              name, email address, phone number, the type of project and your message. The form opens
              your own email app to send the enquiry to us, unless stated otherwise on the form.
            </>,
            <>
              <strong className="text-navy">Calls, emails and WhatsApp messages</strong> — your name,
              number or address, and whatever you tell us about your project.
            </>,
            <>
              <strong className="text-navy">Job applications</strong> — your CV and the details in it
              (education, work history, contact details), sent to us by email.
            </>,
            <>
              <strong className="text-navy">Course enquiries</strong> — your contact details and the
              course you are interested in.
            </>,
            <>
              <strong className="text-navy">Project information</strong> — if you become a client: the
              site address, land and property documents, drawings, identity and ownership documents
              needed for approvals, and payment and billing details. This is collected offline, under
              your project agreement, not through this website.
            </>,
          ]}
        />
        <p>
          <strong className="text-navy">Information collected automatically.</strong> Our hosting
          provider records standard technical logs for every request (IP address, browser and device
          type, page requested, date and time) to deliver the site and protect it from abuse. We do not
          use these logs to identify you. The site stores one item in your browser to remember your
          cookie choice — see the <LegalLink to="/cookies">Cookie Policy</LegalLink>.
        </p>
        <p>
          <strong className="text-navy">What we do not collect.</strong> This website runs no
          analytics, advertising or tracking cookies, no tracking pixels and no fingerprinting. The
          chat assistant on the site runs entirely in your browser: what you type into it is not sent
          to us or to anyone else. We do not buy personal data, and we do not obtain it from data
          brokers.
        </p>
        <p>
          Please do not send us sensitive information we have not asked for — such as health details,
          bank passwords or full identity numbers — through the website or by email.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "How we use your data, and on what basis",
    content: (
      <>
        <p>We use personal data only for the specific purpose it was given for:</p>
        <LegalList
          items={[
            "To reply to your enquiry, arrange a site visit and prepare a quotation.",
            "To plan, design, obtain approvals for, build and hand over your project, and to provide after-handover support and warranty service.",
            "To issue invoices, receive payments and keep accounts.",
            "To consider your job application or course enquiry.",
            "To keep the website secure and working.",
            "To meet our legal, tax and regulatory obligations, and to establish or defend legal claims.",
          ]}
        />
        <p>
          We process this data either with your consent — which you give by contacting us with the
          information for that purpose — or for a legitimate use recognised by section 7 of the DPDP
          Act, such as information you have voluntarily provided for a specified purpose, or compliance
          with law. Where we rely on consent, you may withdraw it at any time (see section 9);
          withdrawal does not affect processing already carried out.
        </p>
        <p>
          We will not send you marketing messages unless you have asked for them, and every such
          message will tell you how to stop them. We do not sell or rent personal data, we do not use it
          for advertising, and we do not make decisions about you by automated means alone.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Who we share it with",
    content: (
      <>
        <p>We share personal data only where it is needed, and only as much as is needed:</p>
        <LegalList
          items={[
            <>
              <strong className="text-navy">Service providers</strong> who process data on our behalf:
              our website host (Vercel), our email provider (Google), and — if you message us there —
              WhatsApp. They may only use the data to provide their service to us.
            </>,
            <>
              <strong className="text-navy">People working on your project</strong>, such as
              consulting engineers, surveyors, soil-testing laboratories and specialist contractors, to
              the extent needed for your project.
            </>,
            <>
              <strong className="text-navy">Government authorities</strong> — the municipality,
              panchayat or development authority that processes your building approvals, when we file
              them on your behalf.
            </>,
            <>
              <strong className="text-navy">Legal and professional advisers</strong>, and authorities
              where the law requires disclosure, or to protect our rights, our clients or the public.
            </>,
            <>
              <strong className="text-navy">A successor business</strong>, if our firm is reorganised,
              merged or sold, under the same protections set out in this policy.
            </>,
          ]}
        />
      </>
    ),
  },
  {
    id: "transfers",
    title: "Storage and transfers outside India",
    content: (
      <p>
        Some of our service providers, including our website host and email provider, may store or
        process data on servers outside India. Where this happens, it is done in line with section 16
        of the DPDP Act and any restrictions notified by the Government of India, and with providers
        that maintain recognised security standards.
      </p>
    ),
  },
  {
    id: "retention",
    title: "How long we keep it",
    content: (
      <LegalList
        items={[
          <>
            <strong className="text-navy">Enquiries</strong> that do not become projects: up to two
            years from our last contact, so we can pick up the conversation if you come back, then
            deleted.
          </>,
          <>
            <strong className="text-navy">Job applications</strong>: up to one year, unless you ask us
            to delete yours sooner.
          </>,
          <>
            <strong className="text-navy">Client and project records</strong>: for the duration of the
            project and its warranty period, and afterwards for as long as tax, accounting, contract
            and building-regulation laws require.
          </>,
          <>
            <strong className="text-navy">Technical logs</strong>: for the short period set by our
            hosting provider.
          </>,
        ]}
      />
    ),
  },
  {
    id: "security",
    title: "How we protect it",
    content: (
      <>
        <p>
          We follow reasonable security practices, as required by section 43A of the Information
          Technology Act, 2000 and the rules made under it. This website is served only over encrypted
          HTTPS. Access to personal data is limited to the people who need it for the purposes above,
          and project documents are kept securely.
        </p>
        <p>
          No method of storage or transmission is completely secure. If a personal data breach occurs,
          we will inform the Data Protection Board of India and the people affected, as the law
          requires, and take steps to contain it.
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights",
    content: (
      <>
        <p>Under the DPDP Act, you have the right to:</p>
        <LegalList
          items={[
            "obtain a summary of the personal data we hold about you and how we have used it;",
            "have inaccurate or incomplete data corrected, completed or updated;",
            "have your data erased once it is no longer needed for its purpose, unless the law requires us to keep it;",
            "withdraw your consent at any time — as easily as you gave it;",
            "have a grievance addressed by us (section 10); and",
            "nominate another person to exercise these rights on your behalf in the event of your death or incapacity.",
          ]}
        />
        <p>
          To use any of these rights, email {mail} or call {phone}. We may ask you to confirm your
          identity first, so that we never give your data to someone else. We will respond within 30
          days. There is no charge.
        </p>
      </>
    ),
  },
  {
    id: "grievances",
    title: "Grievance Officer",
    content: (
      <>
        <p>
          If you have a concern about how we handle your personal data, please contact our Grievance
          Officer:
        </p>
        <p className="border border-hairline bg-white p-4">
          Grievance Officer, {SITE.name}
          <br />
          {address}
          <br />
          Email: {mail} · Phone: {phone}
        </p>
        <p>
          We will acknowledge your grievance within 3 working days and aim to resolve it within 30
          days. If you are not satisfied with our response, you may complain to the Data Protection
          Board of India.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    content: (
      <p>
        This website is not directed at children, and we do not knowingly collect personal data from
        anyone under 18. If you are under 18 and interested in one of our courses, please ask a parent
        or guardian to contact us for you. If you believe a child has sent us personal data, contact us
        and we will delete it.
      </p>
    ),
  },
  {
    id: "third-party",
    title: "Third-party services and links",
    content: (
      <>
        <p>
          A few parts of this website load content from other providers. When they load, your browser
          connects to that provider, which can see your IP address and browser details:
        </p>
        <LegalList
          items={[
            <>
              <strong className="text-navy">Google Fonts</strong> supplies the typefaces on every page.
            </>,
            <>
              <strong className="text-navy">OpenStreetMap</strong> supplies the map on the Contact page;
              it loads only when you scroll to it.
            </>,
          ]}
        />
        <p>
          The site also links to Google Maps, WhatsApp, Facebook and Instagram. Those services are
          governed by their own privacy policies, not this one, and we are not responsible for how they
          handle your data.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    content: (
      <p>
        We will update this policy whenever the way we handle personal data changes — for example,
        before adding any analytics or new service. The revised version will be published on this page
        with a new effective date. If a change materially affects how we use data you have already
        given us, we will tell you directly where we can.
      </p>
    ),
  },
]

const PAGE = routeSeo("/privacy")

export default function Privacy() {
  return (
    <PageWrapper>
      <Seo route="/privacy" />
      <PageHeader title={PAGE.heading} subtitle={PAGE.subheading} crumbs={PAGE.crumbs} />

      <div className={`${SITE_CONTAINER} py-14 lg:py-20`}>
        <LegalDocument
          effective={EFFECTIVE}
          sections={SECTIONS}
          summary={
            <>
              <strong className="text-navy">In short:</strong> we collect only what you send us —
              usually your name, contact details and project details — and use it only to answer you
              and deliver your project. We do not sell it, we do not use it for advertising, and this
              website runs no tracking or analytics. You can ask us to see, correct or delete your data
              at any time by writing to {mail}.
            </>
          }
        />
      </div>
    </PageWrapper>
  )
}
