import PageWrapper from "@/components/layout/PageWrapper"
import PageHeader from "@/components/ui/PageHeader"
import Seo from "@/components/Seo"
import { routeSeo } from "@/data/routes"
import { SITE_CONTAINER } from "@/components/layout/constants"
import { SITE } from "@/data/siteInfo"
import LegalDocument, { LegalLink, LegalList, type LegalSection } from "@/components/ui/LegalDocument"

/**
 * Terms & Conditions for use of the website.
 *
 * These govern the website and pre-contract dealings only. Every project is
 * governed by its own signed agreement, which these terms say takes
 * precedence — keep it that way rather than putting project terms here.
 * Change EFFECTIVE when the text changes.
 */
const EFFECTIVE = "9 October 2026"

const mail = <LegalLink to={`mailto:${SITE.email}`}>{SITE.email}</LegalLink>
const phone = <LegalLink to={SITE.phoneHref}>{SITE.phones[0]}</LegalLink>
const address = `${SITE.address.street}, ${SITE.address.region} ${SITE.address.postalCode}, India`

const SECTIONS: LegalSection[] = [
  {
    id: "acceptance",
    title: "Acceptance of these terms",
    content: (
      <>
        <p>
          These Terms &amp; Conditions (“Terms”) govern your use of this website, operated by{" "}
          {SITE.name} (“we”, “us”, “our”) of {address}. By using the website you agree to these Terms.
          If you do not agree, please do not use the website.
        </p>
        <p>
          These Terms form an electronic record under the Information Technology Act, 2000 and do not
          require a physical or digital signature.
        </p>
      </>
    ),
  },
  {
    id: "website-information",
    title: "Information on this website",
    content: (
      <>
        <p>
          The content on this website — including descriptions of services, processes, timelines,
          materials, cost guidance and answers in our FAQ and chat assistant — is general information
          to help you understand how we work. It is not professional, engineering, legal or financial
          advice for your particular site or project.
        </p>
        <p>
          Every plot, design and requirement is different. Advice you can rely on is given only after a
          site assessment, and only under a written engagement. We take care to keep the website
          accurate and up to date, but we do not guarantee that every detail is complete, current or
          free of error, and we may change it at any time without notice.
        </p>
      </>
    ),
  },
  {
    id: "images",
    title: "Images, renders and illustrations",
    content: (
      <p>
        Many images on this website are 3D design visualisations or illustrations, not photographs of
        completed work. They show design intent. Actual colours, materials, finishes, lighting and
        furnishings can differ because of site conditions, product availability and the choices made
        during your project. What will be built for you is defined only by the drawings and
        specifications in your signed agreement.
      </p>
    ),
  },
  {
    id: "quotations",
    title: "Enquiries, site visits and quotations",
    content: (
      <>
        <LegalList
          items={[
            "Sending an enquiry, booking a site visit or receiving a quotation does not create a contract, and places no obligation on you or on us.",
            "Site visits are free where we say so on this website or when booking; any visit outside that offer will be agreed with you in advance.",
            "A quotation is valid for the period stated on it. It is based on the information and site conditions known at the time, and may need revision if the scope, drawings, site conditions or statutory requirements change before an agreement is signed.",
            "We may decline any enquiry or project at our discretion.",
          ]}
        />
      </>
    ),
  },
  {
    id: "project-agreements",
    title: "Project agreements take precedence",
    content: (
      <p>
        All design, construction, interior and other project work is carried out only under a
        separate written agreement signed by you and us. That agreement sets out the scope, price,
        payment schedule, timeline, warranties and responsibilities of both parties. If anything in
        these Terms conflicts with your project agreement, the project agreement prevails.
      </p>
    ),
  },
  {
    id: "approvals",
    title: "Building approvals",
    content: (
      <p>
        Where we prepare drawings and file applications for building approval with a municipality,
        panchayat or other authority on your behalf, the decision to grant, refuse or delay approval,
        and the time taken, rests with that authority. We will prepare and file documents with due care,
        but we cannot guarantee the outcome or timing of any government decision.
      </p>
    ),
  },
  {
    id: "courses",
    title: "Training courses",
    content: (
      <p>
        Course descriptions on this website are for information. Start dates, batch sizes, fees,
        attendance requirements, refunds and certification are confirmed in writing at enrolment, and
        those enrolment terms govern your course. Completing a course does not guarantee employment or
        any professional licence.
      </p>
    ),
  },
  {
    id: "careers",
    title: "Careers and recruitment",
    content: (
      <>
        <p>
          Sending an application does not guarantee an interview or employment. Any offer of
          employment is made only in writing, on our letterhead, by an authorised person.
        </p>
        <p>
          <strong className="text-navy">We never charge a fee</strong> for applications, interviews,
          training or job offers. If anyone asks you for money in our name, do not pay, and report it to
          us at {mail}.
        </p>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "Intellectual property",
    content: (
      <>
        <p>
          The website and its content — text, designs, drawings, 3D renders, photographs, graphics, the
          “{SITE.name}” name and logo, and the layout of the site — belong to us or to our licensors,
          and are protected by the Copyright Act, 1957, the Trade Marks Act, 1999 and other applicable
          laws.
        </p>
        <p>
          You may view the website and print or save pages for your personal, non-commercial use, for
          example to consider our services. You may not copy, reproduce, republish, modify, sell or use
          our designs, drawings or images for any other purpose, or present them as your own work,
          without our prior written permission.
        </p>
        <p>
          Ownership and permitted use of drawings and designs prepared for a client are set out in that
          client’s project agreement.
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    content: (
      <>
        <p>When using this website, you agree not to:</p>
        <LegalList
          items={[
            "use it for any unlawful, fraudulent or harmful purpose, or in breach of these Terms;",
            "send false, misleading or impersonating information through our forms or contact details;",
            "send spam, unsolicited advertising or malicious code;",
            "attempt to gain unauthorised access to the website, its servers or any connected system, or interfere with its operation or security;",
            "scrape, harvest or collect content or data from the website by automated means without our written permission; or",
            "use the website or its content to create a competing service, or in any way that damages our name or reputation.",
          ]}
        />
      </>
    ),
  },
  {
    id: "third-party-links",
    title: "Third-party links and services",
    content: (
      <p>
        The website links to and uses services run by others, such as Google Maps, OpenStreetMap,
        WhatsApp, Facebook and Instagram. We do not control them and are not responsible for their
        content, availability or practices. Your use of them is governed by their own terms and privacy
        policies.
      </p>
    ),
  },
  {
    id: "disclaimer",
    title: "Disclaimer",
    content: (
      <p>
        The website is provided “as is” and “as available”. To the fullest extent permitted by law, we
        make no warranty that it will be uninterrupted, secure, error-free or free of viruses, or that
        any information on it is suitable for your purpose. Warranties for work we carry out are given
        only in your project agreement.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Limitation of liability",
    content: (
      <>
        <p>
          To the fullest extent permitted by law, we are not liable for any indirect, incidental,
          special or consequential loss, or for any loss of profit, revenue, data or opportunity,
          arising from your use of, or inability to use, this website or from reliance on its content.
        </p>
        <p>
          Nothing in these Terms excludes or limits any liability that cannot be excluded or limited
          under Indian law, or affects your rights as a consumer under the Consumer Protection Act,
          2019. Our liability for project work is governed by your project agreement.
        </p>
      </>
    ),
  },
  {
    id: "indemnity",
    title: "Indemnity",
    content: (
      <p>
        You agree to indemnify us against any claim, loss or reasonable expense (including legal fees)
        arising from your breach of these Terms or your misuse of the website.
      </p>
    ),
  },
  {
    id: "privacy",
    title: "Privacy",
    content: (
      <p>
        How we handle your personal data is explained in our{" "}
        <LegalLink to="/privacy">Privacy Policy</LegalLink> and{" "}
        <LegalLink to="/cookies">Cookie Policy</LegalLink>, which form part of these Terms.
      </p>
    ),
  },
  {
    id: "governing-law",
    title: "Governing law and disputes",
    content: (
      <>
        <p>
          These Terms are governed by the laws of India. If a dispute arises, please contact us first —
          we will try in good faith to resolve it amicably within 30 days.
        </p>
        <p>
          Subject to any dispute-resolution clause in a project agreement, and to your rights to
          approach a consumer commission under the Consumer Protection Act, 2019, the courts at
          Paschim Medinipur, West Bengal, will have exclusive jurisdiction over any dispute arising
          from these Terms or your use of the website.
        </p>
      </>
    ),
  },
  {
    id: "general",
    title: "General",
    content: (
      <LegalList
        items={[
          <>
            <strong className="text-navy">Changes.</strong> We may update these Terms from time to
            time. The current version, with its effective date, is always on this page, and applies from
            the date it is published.
          </>,
          <>
            <strong className="text-navy">Severability.</strong> If any provision is found invalid or
            unenforceable, the rest of these Terms remain in full effect.
          </>,
          <>
            <strong className="text-navy">No waiver.</strong> If we do not enforce a provision
            straight away, we have not given up our right to enforce it later.
          </>,
          <>
            <strong className="text-navy">Entire agreement.</strong> These Terms, with the Privacy and
            Cookie Policies, are the whole agreement between you and us about use of the website. They
            do not replace any project or enrolment agreement.
          </>,
        ]}
      />
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    content: (
      <p>
        For any question about these Terms, email {mail}, call {phone} ({SITE.hours}), or write to us
        at {address}.
      </p>
    ),
  },
]

const PAGE = routeSeo("/terms")

export default function Terms() {
  return (
    <PageWrapper>
      <Seo route="/terms" />
      <PageHeader title={PAGE.heading} subtitle={PAGE.subheading} crumbs={PAGE.crumbs} />

      <div className={`${SITE_CONTAINER} py-14 lg:py-20`}>
        <LegalDocument
          effective={EFFECTIVE}
          sections={SECTIONS}
          summary={
            <>
              <strong className="text-navy">In short:</strong> this website gives general information
              about our services. It is not a contract or professional advice. Enquiries and quotations
              are free and create no obligation, and all project work is governed by a separate signed
              agreement. Our designs and images belong to us, and these Terms are governed by Indian law.
            </>
          }
        />
      </div>
    </PageWrapper>
  )
}
