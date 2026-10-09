import { useEffect, useRef, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import {
  MapPin,
  Clock,
  Loader2,
  AlertCircle,
  ArrowUpRight,
  ArrowRight,
  Navigation,
} from "lucide-react"
import PageWrapper from "@/components/layout/PageWrapper"
import PageHeader from "@/components/ui/PageHeader"
import SectionTitle from "@/components/ui/SectionTitle"
import Seo from "@/components/Seo"
import { routeSeo } from "@/data/routes"
import { SITE_CONTAINER } from "@/components/layout/constants"
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
  WhatsAppIcon,
  WhatsAppSolidIcon,
  MobileIcon,
  GmailIcon,
  CHANNEL_COLORS,
} from "@/components/ui/SocialIcons"
import { SITE, ACTIVE_SOCIAL_LINKS } from "@/data/siteInfo"
import ServiceAreas from "@/components/ui/ServiceAreas"

/** The real trademark marks, not a letter standing in for one. */
const SOCIAL_MARKS = {
  Facebook: FacebookIcon,
  Instagram: InstagramIcon,
  LinkedIn: LinkedinIcon,
  YouTube: YoutubeIcon,
  WhatsApp: WhatsAppIcon,
} as const

/**
 * Where enquiries are posted. Set VITE_CONTACT_ENDPOINT to a form backend
 * (Formspree, Web3Forms, Basin, or your own handler) at build time.
 *
 * When it is unset the form falls back to opening the visitor's mail client
 * with the enquiry pre-filled. That is not ideal, but it is honest: the
 * previous version showed "Message Sent!" while doing nothing at all, so every
 * enquiry the site ever received was silently discarded.
 */
const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined

/** The message under a field that has failed validation. */
function FieldError({ id, message }: { id: string; message: string }) {
  if (!message) return null
  return (
    <p id={id} className="mt-1.5 text-[12px] leading-snug text-red-700">
      {message}
    </p>
  )
}

const PROJECT_TYPES = [
  { value: "residential", label: "Residential Construction" },
  { value: "commercial", label: "Commercial Construction" },
  { value: "interior", label: "Interior Design" },
  { value: "renovation", label: "Renovation" },
  { value: "turnkey", label: "Turnkey Solutions" },
]

const EMPTY = { name: "", phone: "", email: "", projectType: "", message: "" }

type Field = keyof typeof EMPTY

/**
 * Field rules.
 *
 * Validation was the browser's `required` attribute alone — one bubble at a
 * time, gone on the next click, and no way to see at a glance which fields
 * still needed attention.
 *
 * Phone is required and email is not, which is the reverse of how this form
 * was set up. This is a construction firm in Paschim Medinipur whose own
 * contact panels put "Call the office" first; a homeowner sending plot
 * details expects a callback, and insisting on an email address loses the
 * enquiries from people who do not use one.
 */
const REQUIRED: Field[] = ["name", "phone", "message"]

function validate(field: Field, value: string): string {
  const v = value.trim()
  if (REQUIRED.includes(field) && !v) {
    return {
      name: "Please tell us your name.",
      phone: "We need a number to call you back on.",
      message: "Tell us a little about the project.",
    }[(field as "name" | "phone" | "message")]
  }
  if (field === "phone" && v && v.replace(/\D/g, "").length < 10) {
    return "That does not look like a complete phone number."
  }
  if (field === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
    return "Check the email address — it looks incomplete."
  }
  return ""
}

type Status = "idle" | "sending" | "sent" | "error"

/** Static facts — the things you read rather than act on. */
const DETAILS = [
  { Icon: MapPin, label: "Head office", value: SITE.addressLines },
  { Icon: Clock, label: "Office hours", value: SITE.hours },
] as const

/**
 * The location map, mounted only once it scrolls into view.
 *
 * `loading="lazy"` is not enough here. Leaflet inside the OpenStreetMap embed
 * measures its container once, at load, and never re-measures — so the iframe
 * came up sized against a stale, narrower layout and painted the map into the
 * left quarter of a full-bleed band, leaving the rest blank. Mounting the
 * iframe ourselves when it enters the viewport means it is created at its real
 * width, and still defers the third-party request off the initial page load.
 */
function MapEmbed() {
  const holder = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = holder.current
    if (!el) return
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      // Start loading just before it is on screen, so the map is painted by
      // the time it actually arrives.
      { rootMargin: "300px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={holder}
      /* 380px is close to half a phone viewport spent on a map that is only
         confirming a town. It keeps its full height from `lg` up. */
      className="h-[260px] w-full bg-surface sm:h-[320px] lg:h-[380px]"
    >
      {visible && (
        <iframe
          title="Reena Designs & Constructions on the map — Medinipur, West Bengal"
          src="https://www.openstreetmap.org/export/embed.html?bbox=87.185%2C22.385%2C87.455%2C22.455&layer=mapnik&marker=22.4257%2C87.3199"
          className="h-full w-full border-0 grayscale-[35%]"
          referrerPolicy="no-referrer-when-downgrade"
        />
      )}
    </div>
  )
}

const PAGE = routeSeo("/contact")

export default function Contact() {
  // Project cards link here as /contact?project=Sunrise%20Villa. Seeding the
  // message means the visitor does not have to retype which build they are
  // asking about, and the enquiry arrives with that context attached.
  const [params] = useSearchParams()
  const project = params.get("project")

  const [form, setForm] = useState(() =>
    project
      ? { ...EMPTY, message: `I would like to know more about ${project}.\n\n` }
      : EMPTY,
  )
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState("")
  /* Errors are only shown once a field has been left, so the form does not
     scold someone who has not finished typing yet. Submitting marks every
     field as touched, which is what surfaces the whole set at once. */
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({})
  const errors = Object.fromEntries(
    (Object.keys(EMPTY) as Field[]).map((f) => [f, validate(f, form[f])]),
  ) as Record<Field, string>
  const showError = (f: Field) => (touched[f] ? errors[f] : "")

  /**
   * Honeypot. A field no human sees and no human fills, so anything that
   * arrives with it populated is a bot — dropped without a network call and
   * without telling the sender, which is what stops them tuning around it.
   */
  const honeypot = useRef<HTMLInputElement>(null)

  const set = (key: keyof typeof EMPTY) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }))

  const mailtoFallback = () => {
    const chosen =
      PROJECT_TYPES.find((p) => p.value === form.projectType)?.label ??
      "Not specified"
    const body = [
      `Name: ${form.name}`,
      `Phone: ${form.phone || "Not provided"}`,
      `Email: ${form.email}`,
      `Project type: ${chosen}`,
      "",
      form.message,
    ].join("\n")
    window.location.href =
      `mailto:${SITE.email}` +
      `?subject=${encodeURIComponent(`Website enquiry — ${form.name}`)}` +
      `&body=${encodeURIComponent(body)}`
  }

  const handle = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === "sending") return

    // Reveal every outstanding error rather than only the first one the
    // browser would have stopped on.
    setTouched(
      Object.fromEntries((Object.keys(EMPTY) as Field[]).map((f) => [f, true])),
    )
    if (Object.values(errors).some(Boolean)) return

    if (honeypot.current?.value) {
      setStatus("sent")
      return
    }

    setStatus("sending")
    setError("")

    if (!ENDPOINT) {
      mailtoFallback()
      setStatus("sent")
      return
    }

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...form,
          projectType:
            PROJECT_TYPES.find((p) => p.value === form.projectType)?.label ??
            form.projectType,
          source: window.location.href,
          submittedAt: new Date().toISOString(),
        }),
      })
      if (!res.ok) throw new Error(`Server responded ${res.status}`)
      setForm(EMPTY)
      setTouched({})
      setStatus("sent")
    } catch (err) {
      // Never claim success on a failure — the visitor needs to know their
      // enquiry did not arrive, and needs a way to reach us regardless.
      setError(err instanceof Error ? err.message : "Something went wrong")
      setStatus("error")
    }
  }

  const sending = status === "sending"

  /** The three ways to reach a person, each the whole panel rather than a link inside one. */
  const CHANNELS = [
    {
      // Self-coloured handset rather than a tintable outline, so the accent
      // colour below only drives the arrow and the hover rule.
      Icon: MobileIcon,
      colour: CHANNEL_COLORS.Phone,
      label: "Call the office",
      value: SITE.phones[0],
      note: SITE.hours,
      href: SITE.phoneHref,
      external: false,
    },
    {
      // The solid WhatsApp glyph rather than a generic speech bubble — it is
      // the one channel people recognise by its logo before its label, and the
      // filled mark holds up at this size where the outlined one thins out.
      Icon: WhatsAppSolidIcon,
      colour: CHANNEL_COLORS.WhatsApp,
      label: "WhatsApp",
      value: SITE.whatsappNumber,
      note: "Send plans, photos or a voice note",
      href: SITE.whatsappHref,
      external: true,
    },
    {
      Icon: GmailIcon,
      colour: CHANNEL_COLORS.Email,
      label: "Email us",
      value: SITE.email,
      note: "We reply the same working day",
      href: `mailto:${SITE.email}`,
      external: false,
    },
  ]

  return (
    <PageWrapper>
      <Seo route="/contact" />
      <PageHeader
        title={PAGE.heading}
        subtitle={PAGE.subheading}
        crumbs={PAGE.crumbs}
        backdrop
      />

      {/* ── Channels ──────────────────────────────────────────────────
          Full-bleed and divided by hairline seams, the same ledger the
          Services page uses. Each panel is a single link, so the whole tile is
          the tap target rather than the few words inside it — which matters
          most on a phone, where these are the primary actions. */}
      <section className="border-b border-hairline bg-surface">
        <div className="grid gap-px bg-hairline sm:grid-cols-3">
          {CHANNELS.map(
            ({ Icon, colour, label, value, note, href, external }) => (
              <a
                key={label}
                href={href}
                {...(external
                  ? { target: "_blank", rel: "noreferrer noopener" }
                  : {})}
                className="group relative flex items-center gap-5 bg-surface p-7 transition-colors duration-300 hover:bg-white lg:gap-6 lg:p-8"
              >
                {/* The mark stands on its own in its brand colour — no tinted
                  tile behind it. `color` is set here so each icon, drawn with
                  `currentColor`, picks the channel colour up. */}
                <span
                  className="flex flex-none items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ color: colour }}
                  aria-hidden="true"
                >
                  <Icon size={28} />
                </span>

                {/* The text block takes the remaining width so the arrow can sit
                  hard against the right edge — laid out as a column, the panels
                  left a third of themselves empty. */}
                <span className="min-w-0 flex-1">
                  <span className="montserrat font-700 block text-[10.5px] uppercase tracking-[0.22em] text-slate-600">
                    {label}
                  </span>
                  <span className="montserrat font-800 mt-1.5 block truncate text-[17px] text-navy">
                    {value}
                  </span>
                  <span className="mt-1 block text-[12.5px] leading-relaxed text-slate-500">
                    {note}
                  </span>
                </span>

                <ArrowUpRight
                  size={18}
                  strokeWidth={2.4}
                  aria-hidden="true"
                  style={{ color: colour }}
                  className="flex-none translate-x-0 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
                />

                {/* A rule in the channel's colour that draws itself across the
                  panel on hover, so the whole tile reads as the target rather
                  than the words inside it. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                  style={{ background: colour }}
                />
              </a>
            ),
          )}
        </div>
      </section>

      {/* ── Enquiry ───────────────────────────────────────────────── */}
      <section className={`${SITE_CONTAINER} py-14 lg:py-20`}>
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* Left: what happens next, and the static facts. */}
          <div>
            <SectionTitle
              title="TELL US ABOUT YOUR PROJECT"
              align="left"
              className="mb-8"
            />

            <div className="flex flex-col gap-4 text-sm leading-7 text-slate-500">
              <p>
                Send us the plot details, a floor plan, or just a rough idea of
                what you want to build. We will come back with a free site visit
                across Paschim Medinipur, an itemised quotation naming every
                material grade, and a completion date in writing.
              </p>
              <p>
                No obligation, and no revised estimates halfway through the
                build.
              </p>
            </div>

            <dl className="mt-9 flex flex-col gap-6 border-t border-hairline pt-8">
              {DETAILS.map(({ Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3.5">
                  <Icon
                    size={16}
                    strokeWidth={2}
                    className="mt-0.5 flex-none text-brand"
                    aria-hidden="true"
                  />
                  <div>
                    <dt className="montserrat font-700 mb-1 text-[10.5px] uppercase tracking-[0.2em] text-slate-600">
                      {label}
                    </dt>
                    <dd className="text-sm leading-relaxed whitespace-pre-line text-slate-700">
                      {value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>

            {ACTIVE_SOCIAL_LINKS.length > 0 && (
              <div className="mt-8 border-t border-hairline pt-8">
                <div className="montserrat font-700 mb-3 text-[10.5px] uppercase tracking-[0.2em] text-slate-600">
                  Follow us
                </div>
                <div className="flex gap-2.5">
                  {ACTIVE_SOCIAL_LINKS.map(({ label, url }) => {
                    const Mark =
                      SOCIAL_MARKS[(label as keyof typeof SOCIAL_MARKS)]
                    const colour =
                      CHANNEL_COLORS[(label as keyof typeof CHANNEL_COLORS)]
                    if (!Mark) return null
                    return (
                      <a
                        key={label}
                        href={url}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={`${SITE.name} on ${label}`}
                        /* The mark's own colour is handed in as a custom
                           property, so hover and keyboard focus both resolve to
                           it in CSS rather than through mouse handlers — which
                           would have left keyboard users with no feedback. */
                        className="flex h-11 w-11 items-center justify-center border border-slate-300 text-slate-500 sm:h-9 sm:w-9 transition-all duration-300 hover:-translate-y-0.5 hover:border-(--c) hover:text-(--c) focus-visible:border-(--c) focus-visible:text-(--c) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--c)"
                        style={{ "--c": colour } as React.CSSProperties}
                      >
                        <Mark size={15} />
                      </a>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right: the form. */}
          <div className="border border-slate-200 bg-white p-7 lg:p-9">
            <h3 className="montserrat font-800 mb-6 text-sm uppercase tracking-wider text-navy">
              Send us a message
            </h3>

            {/* Status is announced rather than only shown, so a screen-reader
                user learns the enquiry landed without hunting for the panel. */}
            <div aria-live="polite" className="sr-only">
              {status === "sent" ? "Your message has been sent." : ""}
              {status === "error" ? "Your message could not be sent." : ""}
            </div>

            {status === "sent" ? (
              <div className="flex flex-col items-center border border-hairline bg-surface py-12 text-center">
                <div
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-full"
                  style={{
                    background: "#fff4ef",
                    border: "2px solid var(--color-brand)",
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 12l6 6L20 6"
                      stroke="var(--color-brand)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h4 className="montserrat font-800 mb-2 text-lg text-navy">
                  {ENDPOINT ? "Message sent" : "Your email is ready"}
                </h4>
                <p className="mb-5 max-w-xs text-sm text-slate-500">
                  {ENDPOINT
                    ? "We will respond within one business day."
                    : "Your mail app should have opened with the enquiry filled in — press send and we will reply within one business day."}
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="btn-outline montserrat font-700"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form
                onSubmit={handle}
                noValidate
                className="flex flex-col gap-4"
              >
                <p className="-mt-1 text-[12px] text-slate-500">
                  Fields marked <span className="text-red-600">*</span> are
                  required.
                </p>
                {/* Off-screen rather than display:none — a bot reading the DOM
                    fills what it can see in the markup, and `hidden` is the
                    first thing they learn to skip. */}
                <input
                  ref={honeypot}
                  type="text"
                  name="company_website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute left-[-9999px] h-0 w-0 opacity-0"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="montserrat font-600 mb-1.5 flex items-center gap-1 text-xs text-slate-600"
                    >
                      Your name
                      <span className="text-red-600" aria-hidden="true">
                        *
                      </span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Full name"
                      aria-invalid={showError("name") ? true : undefined}
                      aria-describedby={
                        showError("name") ? "name-error" : undefined
                      }
                      onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                      className="field"
                      disabled={sending}
                      value={form.name}
                      onChange={(e) => set("name")(e.target.value)}
                    />
                    <FieldError id="name-error" message={showError("name")} />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="montserrat font-600 mb-1.5 flex items-center gap-1 text-xs text-slate-600"
                    >
                      Phone number
                      <span className="text-red-600" aria-hidden="true">
                        *
                      </span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder="+91 76791 24694"
                      aria-invalid={showError("phone") ? true : undefined}
                      aria-describedby={
                        showError("phone") ? "phone-error" : undefined
                      }
                      onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                      className="field"
                      disabled={sending}
                      value={form.phone}
                      onChange={(e) => set("phone")(e.target.value)}
                    />
                    <FieldError id="phone-error" message={showError("phone")} />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="montserrat font-600 mb-1.5 flex items-center gap-1 text-xs text-slate-600"
                  >
                    Email address
                    <span className="font-400 text-slate-500">(optional)</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    aria-invalid={showError("email") ? true : undefined}
                    aria-describedby={
                      showError("email") ? "email-error" : undefined
                    }
                    onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                    className="field"
                    disabled={sending}
                    value={form.email}
                    onChange={(e) => set("email")(e.target.value)}
                  />
                  <FieldError id="email-error" message={showError("email")} />
                </div>

                <div>
                  <label
                    htmlFor="projectType"
                    className="montserrat font-600 mb-1.5 flex items-center gap-1 text-xs text-slate-600"
                  >
                    Project type
                  </label>
                  <select
                    id="projectType"
                    name="projectType"
                    className="field"
                    disabled={sending}
                    value={form.projectType}
                    onChange={(e) => set("projectType")(e.target.value)}
                  >
                    <option value="">Select project type…</option>
                    {PROJECT_TYPES.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="montserrat font-600 mb-1.5 flex items-center gap-1 text-xs text-slate-600"
                  >
                    Your message
                    <span className="text-red-600" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Plot size, location, budget range, or anything you already know…"
                    aria-invalid={showError("message") ? true : undefined}
                    aria-describedby={
                      showError("message") ? "message-error" : undefined
                    }
                    onBlur={() => setTouched((t) => ({ ...t, message: true }))}
                    className="field resize-none"
                    disabled={sending}
                    value={form.message}
                    onChange={(e) => set("message")(e.target.value)}
                  />
                  <FieldError
                    id="message-error"
                    message={showError("message")}
                  />
                </div>

                {status === "error" && (
                  <div
                    role="alert"
                    className="flex items-start gap-2.5 border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700"
                  >
                    <AlertCircle
                      size={16}
                      strokeWidth={2}
                      className="mt-px flex-none"
                      aria-hidden="true"
                    />
                    <span>
                      Your message could not be sent ({error}). Please call{" "}
                      <a
                        href={SITE.phoneHref}
                        className="font-semibold underline"
                      >
                        {SITE.phones[0]}
                      </a>{" "}
                      or email{" "}
                      <a
                        href={`mailto:${SITE.email}`}
                        className="font-semibold underline"
                      >
                        {SITE.email}
                      </a>
                      .
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="btn-orange montserrat font-700 mt-1 gap-2 py-3.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {sending ? (
                    <>
                      <Loader2
                        size={15}
                        strokeWidth={2.4}
                        className="animate-spin"
                        aria-hidden="true"
                      />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send Message
                      <ArrowRight
                        size={15}
                        strokeWidth={2.2}
                        aria-hidden="true"
                      />
                    </>
                  )}
                </button>

                <p className="text-[11.5px] leading-relaxed text-slate-600">
                  We use your details only to answer this enquiry, and never
                  sell them or use them for advertising. See our{" "}
                  <Link to="/privacy" className="font-semibold text-brand-ink underline underline-offset-2">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── Location ──────────────────────────────────────────────────
          No heading: a pinned map of the office needs no label, and the
          heading plus its padding left an empty band above it. */}
      <section className="relative border-t border-hairline">
        <MapEmbed />
        {/* `SITE.mapUrl` was already defined and already used by the
            structured data; the page itself never offered it, so anyone
            wanting to drive here had to retype the address. */}
        <a
          href={SITE.mapUrl}
          target="_blank"
          rel="noreferrer noopener"
          /* Clear of the foot of the frame: OpenStreetMap's attribution runs
             along the bottom edge and their licence requires it stay legible,
             so the button sits above it rather than over it. */
          className="btn-navy montserrat font-700 absolute right-4 bottom-10 gap-2 px-4 py-2.5 text-[13px] shadow-lg"
        >
          <Navigation size={14} strokeWidth={2.2} aria-hidden="true" />
          Get directions
        </a>
      </section>

      <ServiceAreas />
    </PageWrapper>
  )
}
