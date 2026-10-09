import { Link } from "react-router-dom"
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowUpRight,
  ArrowUp,
  ArrowRight,
  ShieldCheck,
} from "lucide-react"
import {
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
  CHANNEL_COLORS,
} from "@/components/ui/SocialIcons"
import v4Logo from "@/imports/V4.png"
import architectArt from "@/imports/architect-drawing.png"
import { SITE_CONTAINER } from "./constants"
import { SITE } from "@/data/siteInfo"

export interface FooterCTAProps {
  title: string
  subtitle?: string
  buttonText: string
  buttonHref: string
  badgeText?: string
}

export interface FooterProps {
  cta?: FooterCTAProps | null
  overlapped?: boolean
}

const STATS = [
  { value: "250+", label: "Delivered" },
  { value: "30+", label: "Years Experience" },
  { value: "200+", label: "Clients Served" },
] as const

/**
 * A drafting registration mark, the kind that sits outside the trim on a
 * printed drawing. Four of them frame the CTA button so it reads as a detail
 * called out on a plan rather than a plain web button — the same language as
 * the blueprint grid behind the footer.
 */
function CropMark({ position }: { position: string }) {
  return (
    <span className={`pointer-events-none absolute h-2.5 w-2.5 ${position}`} aria-hidden="true">
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-slate-300 transition-colors duration-300 group-hover/spec:bg-orange-400" />
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-slate-300 transition-colors duration-300 group-hover/spec:bg-orange-400" />
    </span>
  )
}

const [ADDRESS_LINE_1, ADDRESS_LINE_2] = SITE.addressLines.split("\n")

const EXPLORE_LINKS = [
  ["Home", "/"],
  ["About Us", "/about"],
  ["Services", "/services"],
  ["What's Included", "/whats-included"],
  ["Learn With Us", "/learn-from-us"],
  ["Our Work", "/our-work"],
  ["Testimonials", "/our-work/testimonials"],
  ["FAQ", "/faq"],
  ["Careers", "/careers"],
  ["Contact Us", "/contact"],
] as const

const SERVICE_LINKS = [
  ["Building Construction", "/services"],
  ["Architectural Design", "/services"],
  ["Residential Interior", "/our-work/interior/residential"],
  ["Commercial Interior", "/our-work/interior/commercial"],
  ["Renovation & Remodeling", "/our-work/renovation"],
  ["3D Design & Elevation", "/our-work/3d-design"],
] as const

const SOCIAL_LIST = [
  { label: "Facebook", href: "https://www.facebook.com/share/19WNR4c5Ru/", Icon: FacebookIcon, colour: CHANNEL_COLORS.Facebook },
  { label: "Instagram", href: "https://www.instagram.com/reenadesignconstruction?stkn=OGF0cnQ1eW1lenZ2", Icon: InstagramIcon, colour: CHANNEL_COLORS.Instagram },
  { label: "WhatsApp", href: SITE.whatsappHref, Icon: WhatsAppIcon, colour: CHANNEL_COLORS.WhatsApp },
]

export default function Footer({ cta }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer
      className="relative overflow-hidden text-white"
      style={{
        background: "linear-gradient(165deg, #0d1527 0%, #111c35 55%, #080d19 100%)",
      }}
    >
      {/* Blueprint grid background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "linear-gradient(to bottom, #000 0%, #000 70%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, #000 0%, #000 70%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* Subtle warm orange ambient light */}
      <div
        className="pointer-events-none absolute -left-20 top-0 h-[360px] w-[360px] rounded-full blur-3xl opacity-15"
        style={{ background: "radial-gradient(circle, rgba(255,94,0,0.35) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      {/* ── Integrated Pre-Footer CTA (if provided) ────────────────── */}
      {cta && (
        <div className="relative isolate">
          {/* 50/50 background split: top half is white to match page content, bottom half is #0d1527 to match footer */}
          {/* The upper half is `surface`, not white, so it continues the grey
              the last page section ends on instead of inserting a white stripe
              between that grey and the navy footer. The card itself stays
              white, which is what makes it read as lifted off the band. */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-surface" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[#0d1527]" aria-hidden="true" />

          {/* Padding stays symmetric so the card keeps straddling the 50/50
              split, and is deep enough that the figure standing proud of the
              card's top edge is not clipped by the footer's overflow. */}
          <div className={`${SITE_CONTAINER} relative z-10 py-10 sm:py-14`}>
            {/* A single-line strip rather than a stacked block: one statement,
                one action. The pale ground is a deliberate break from the navy
                blueprint panels used elsewhere — sitting between a white page
                and a near-black footer, a light bar reads as a divider you act
                on rather than as another dark section competing with both. */}
            {/* No `overflow-hidden`: the figure stands on the strip's bottom
                edge and rises clear of its top. The brand colour moves from an
                absolutely-placed bar to a left border so it still follows the
                corner radius without clipping. */}
            <div className="relative border border-l-4 border-slate-200/70 border-l-orange-500 bg-white px-6 py-5 shadow-[0_20px_50px_-24px_rgba(8,13,25,0.55)] sm:px-8 lg:px-10">
              {/* Purely decorative, so it is hidden from assistive tech and
                  dropped below sm where there is no room for it. */}
              <img
                src={architectArt}
                alt=""
                width={153}
                height={320}
                loading="lazy"
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-6 hidden h-[124px] w-auto select-none sm:block"
              />

              <div className="flex flex-col gap-5 sm:pl-[76px] lg:flex-row lg:items-center lg:justify-between lg:gap-10">
                <div className="flex min-w-0 items-center gap-4">
                  <p className="min-w-0 text-[15px] leading-6">
                    <span className="montserrat font-800 text-navy">{cta.title}</span>
                    {cta.subtitle && <span className="text-slate-500"> — {cta.subtitle}</span>}
                  </p>
                </div>

                <div className="flex flex-none flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-end">
                  {/* Shown on mobile too. Hiding the number below `md` put the
                      one action a phone is actually for behind a page
                      navigation; it is now a full-width tap target there and
                      collapses to an inline line beside the button on desktop. */}
                  <a
                    href={SITE.phoneHref}
                    className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap border border-slate-200 px-4 py-3 text-[13px] text-slate-600 transition-colors hover:border-navy hover:text-navy sm:border-0 sm:px-0 sm:py-0 sm:text-slate-500"
                  >
                    <Phone size={13} className="text-brand" aria-hidden="true" />
                    <strong className="font-600 text-navy">{SITE.phones[0]}</strong>
                  </a>

                  {/* No padding on the wrapper: it shrink-wraps the button, so
                      each mark centres exactly on a corner and the button's edge
                      runs through it — the marks belong to the button rather
                      than floating around it. They stay put while the button
                      lifts away on hover. */}
                  <span className="group/spec relative inline-flex">
                    <CropMark position="-left-[5px] -top-[5px]" />
                    <CropMark position="-right-[5px] -top-[5px]" />
                    <CropMark position="-bottom-[5px] -left-[5px]" />
                    <CropMark position="-bottom-[5px] -right-[5px]" />

                    <Link
                      to={cta.buttonHref}
                      className="btn-orange montserrat font-700 group inline-flex w-full items-center justify-center gap-2 whitespace-nowrap px-7 py-3.5 text-sm shadow-[0_10px_24px_-8px_rgba(255,94,0,0.7)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-8px_rgba(255,94,0,0.85)]"
                    >
                      {cta.buttonText}
                      <ArrowRight
                        size={16}
                        strokeWidth={2.2}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Compact Footer Grid ───────────────────────────────── */}
      <div className={`${SITE_CONTAINER} relative z-10 py-10 lg:py-12`}>
        {/* `grid-cols-2` from the smallest size: stacked single-column, the
            Explore and Services lists ran to fourteen rows of thumb-scrolling
            before the address came into view. Side by side they halve that,
            and the brand block and office details still span the full width. */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1.1fr_1.3fr] lg:gap-10">
          {/* Column 1: Brand & Overview */}
          <div className="col-span-2 lg:col-span-1 lg:pr-4">
            <Link to="/" className="mb-4 inline-flex items-center gap-2.5">
              <img
                src={v4Logo}
                alt="Reena Designs & Constructions logo"
                width={42}
                height={42}
                loading="lazy"
                className="h-10 w-10 object-contain"
              />
              <div>
                <div className="allura text-[26px] leading-none text-orange-400">Reena</div>
                <div className="poppins text-[9px] font-semibold uppercase tracking-[0.16em] text-orange-400">
                  Designs &amp; Constructions
                </div>
              </div>
            </Link>

            <p className="mb-4 max-w-sm text-xs leading-relaxed text-white/65">
              Medinipur's design-led construction firm. Turnkey civil building, architecture,
              and interior design under fixed contractual handover timelines.
            </p>

            {/* Compact Stats */}
            <div className="grid grid-cols-3 gap-2 border-y border-white/[0.08] py-3 my-4 max-w-sm">
              {STATS.map(({ value, label }) => (
                <div key={label}>
                  <div className="montserrat font-800 text-base text-white">{value}</div>
                  <div className="text-[10px] uppercase tracking-wider text-white/65">{label}</div>
                </div>
              ))}
            </div>

            {/* Social channels */}
            <div className="flex items-center gap-2">
              {/* Each mark lights up in its own brand colour rather than all
                  five going orange — the row was previously indistinguishable
                  on hover. The colour is handed in as a custom property so
                  hover and keyboard focus share one definition. */}
              {SOCIAL_LIST.map(({ label, href, Icon, colour }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${SITE.name} on ${label}`}
                  className="flex h-9 w-9 items-center justify-center bg-white/[0.06] text-white/55 ring-1 ring-white/10 transition duration-200 hover:-translate-y-0.5 hover:bg-(--c) hover:text-white hover:ring-(--c) focus-visible:bg-(--c) focus-visible:text-white focus-visible:ring-(--c)"
                  style={{ "--c": colour } as React.CSSProperties}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Explore Navigation */}
          <div>
            <h2 className="montserrat font-800 mb-3.5 text-[11px] uppercase tracking-[0.18em] text-white">
              Explore
              <span className="mt-2 block h-0.5 w-6 rounded-full bg-orange-500" aria-hidden="true" />
            </h2>
            <ul className="space-y-2">
              {EXPLORE_LINKS.map(([label, href]) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="group inline-flex items-center gap-1 text-xs text-white/60 transition-colors duration-200 hover:text-white"
                  >
                    <span>{label}</span>
                    <ArrowUpRight
                      size={11}
                      strokeWidth={2.2}
                      aria-hidden="true"
                      className="opacity-0 -translate-x-1 transition-all duration-200 group-hover:translate-x-0 group-hover:text-orange-400 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h2 className="montserrat font-800 mb-3.5 text-[11px] uppercase tracking-[0.18em] text-white">
              Services
              <span className="mt-2 block h-0.5 w-6 rounded-full bg-orange-500" aria-hidden="true" />
            </h2>
            <ul className="space-y-2">
              {SERVICE_LINKS.map(([label, href]) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="group inline-flex items-center gap-1 text-xs text-white/60 transition-colors duration-200 hover:text-white"
                  >
                    <span>{label}</span>
                    <ArrowUpRight
                      size={11}
                      strokeWidth={2.2}
                      aria-hidden="true"
                      className="opacity-0 -translate-x-1 transition-all duration-200 group-hover:translate-x-0 group-hover:text-orange-400 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Office Info.
              Spans both columns on mobile — the address, phone numbers and
              hours are the reason most phone visitors reach the footer at all,
              and squeezing them into a half-width column wrapped every line. */}
          <div className="col-span-2 lg:col-span-1">
            <h2 className="montserrat font-800 mb-3.5 text-[11px] uppercase tracking-[0.18em] text-white">
              Head Office
              <span className="mt-2 block h-0.5 w-6 rounded-full bg-orange-500" aria-hidden="true" />
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin size={14} className="mt-0.5 flex-none text-orange-400" />
                <div className="leading-relaxed text-white/65">
                  <div>{ADDRESS_LINE_1}</div>
                  <div>{ADDRESS_LINE_2}</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone size={14} className="mt-0.5 flex-none text-orange-400" />
                <div className="space-y-0.5">
                  {SITE.phones.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:${phone.replace(/\s+/g, "")}`}
                      className="block text-white/65 transition-colors hover:text-white"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail size={14} className="flex-none text-orange-400" />
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-white/65 transition-colors hover:text-white"
                >
                  {SITE.email}
                </a>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock size={14} className="mt-0.5 flex-none text-orange-400" />
                <div className="text-white/65">
                  <div>{SITE.hours}</div>
                </div>
              </div>

              {/* Regulatory Assurance */}
              <div className="mt-3 border border-white/10 bg-white/[0.03] p-2.5">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-orange-300">
                  <ShieldCheck size={13} className="text-orange-400" />
                  <span>Licensed Civil Engineers</span>
                </div>
                <p className="mt-0.5 text-[10.5px] leading-4 text-white/65">
                  Municipal approval compliant sanction drawings &amp; structural safety.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Legal Bar ───────────────────────────────────────── */}
      <div className="relative z-10 border-t border-white/[0.08] bg-black/25">
        <div
          className={`${SITE_CONTAINER} flex flex-col items-center justify-between gap-3 py-4 text-center md:flex-row md:text-left`}
        >
          <div className="text-xs text-white/65">
            <span>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link
              to="/privacy"
              className="text-xs text-white/65 transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>
            <Link
              to="/cookies"
              className="text-xs text-white/65 transition-colors hover:text-white"
            >
              Cookie Policy
            </Link>
            <Link
              to="/terms"
              className="text-xs text-white/65 transition-colors hover:text-white"
            >
              Terms &amp; Conditions
            </Link>

            <button
              onClick={scrollToTop}
              type="button"
              className="group inline-flex items-center gap-1 border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-white/65 transition duration-200 hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-white cursor-pointer"
              aria-label="Scroll back to top"
            >
              <span>Top</span>
              <ArrowUp
                size={11}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 text-orange-400"
              />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

