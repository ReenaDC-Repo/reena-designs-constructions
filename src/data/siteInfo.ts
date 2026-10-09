/**
 * Single source of truth for the company's name, address and phone (NAP),
 * social profiles and canonical origin.
 *
 * These details were previously repeated across Footer, Contact, the assistant
 * knowledge base and index.html — nine copies of the same phone number, which
 * is exactly how a business ends up publishing a number it no longer answers.
 * Local SEO also penalises inconsistent NAP, so it has to come from one place.
 */

/*
 * ─── BEFORE THIS SITE GOES LIVE ─────────────────────────────────────────────
 *
 * The five values marked REPLACE below are placeholders. They are sequential
 * dummy digits and they are wired into the footer, the contact page, the CTA
 * hotline, every `tel:` link, the WhatsApp deep link and the LocalBusiness
 * structured data — so until they are real, every conversion path on the site
 * reaches nobody.
 *
 * Also outstanding, and needing information only you have:
 *
 *   1. VITE_CONTACT_ENDPOINT — unset, so the enquiry form falls back to
 *      opening the visitor's mail client. On a phone that often does nothing
 *      at all. Point it at Formspree, Web3Forms, Basin or your own handler;
 *      the submit path, error state and honeypot are already written for it.
 *
 *   2. Project photography — the 26 images across the featured slider, both
 *      project listings and the five galleries are Unsplash stock, captioned
 *      with specific names, square footages and completion dates. Four real
 *      handovers will outperform nine invented ones, and they are the only
 *      thing on the page a prospect can verify.
 *
 *   3. A cost band for /whats-included — the page targets "house construction
 *      cost West Bengal" and contains no figure. One honest range, with a line
 *      on what moves it, is the difference between answering the visitor's
 *      question and sending them to a competitor.
 *
 *   4. Certification numbers — ISO 9001:2015, IGBC, BIS and CIDC are claimed
 *      on the About page with nothing to verify them against. Add the
 *      registration number under each, and remove any that are aspirational.
 *
 *   5. The About page story and team photographs — currently generic
 *      contractor-brochure copy and four sets of initials, on the page where a
 *      prospect decides whether to call.
 * ───────────────────────────────────────────────────────────────────────────
 */

export const SITE = {
  name: "Reena Designs & Constructions",
  /** Canonical origin, no trailing slash. Override per deploy with VITE_SITE_URL. */
  origin: (import.meta.env.VITE_SITE_URL || "https://reenabuild.com").replace(/\/+$/, ""),
  /** REPLACE — placeholder. */
  email: "Reena.dc65@gmail.com",
  /** REPLACE — placeholder, sequential dummy digits. */
  phones: ["+91 76791 24694"],
  /** E.164 for tel: links — no spaces, no punctuation. */
  /** REPLACE — must match phones[0]. */
  phoneHref: "tel:+917679124694",
  /** REPLACE — placeholder. */
  whatsappNumber: "+91 76791 24694",
  /** REPLACE — the number in this URL must match whatsappNumber. */
  whatsappHref: "https://wa.me/917679124694?text=Hello%20Reena%20Designs%2C%20I%20would%20like%20to%20inquire%20about%20a%20construction%20or%20interior%20project.",
  hours: "Mon – Sat · 9:00 AM – 9:00 PM",
  address: {
    street: "Near Sitala Mandir, Rangamati",
    locality: "Rangamati, Medinipur",
    region: "Paschim Medinipur, West Bengal",
    postalCode: "721101",
    country: "IN",
  },
  /** Rendered as one block wherever the full address is shown. */
  addressLines: "Near Sitala Mandir, Rangamati, Paschim Medinipur, 721101\nWest Bengal, India",
  /**
   * Office coordinates, for `geo` in the LocalBusiness graph and the
   * geo.position / ICBM meta tags.
   *
   * Google does not rank a business by these — proximity is computed from the
   * verified Business Profile — but they disambiguate "Medinipur" (which is
   * also spelt Midnapore and Midnapur, and shares a name with nothing else
   * nearby) for every other crawler that reads the page. Replace with the
   * exact office pin once the Business Profile is claimed.
   */
  geo: { lat: 22.4257, lng: 87.3199 },
  /** Deep link to the office pin. Swap for the Business Profile short link
   *  (g.page/…) as soon as the listing is verified — that link is what ties
   *  the site and the profile together for Google. */
  mapUrl: "https://www.google.com/maps/search/?api=1&query=22.4257,87.3199",
  /** Year the practice started, for `foundingDate`. */
  foundingYear: "1990",
  /** Absolute paths, resolved against `origin` where schema needs a URL. */
  logoPath: "/apple-touch-icon.png",
  ogImagePath: "/og-image.png",
} as const

/**
 * Social profiles.
 */
export const SOCIAL_LINKS: { label: string; url: string }[] = [
  { label: "Facebook", url: "https://www.facebook.com/share/19WNR4c5Ru/" },
  { label: "Instagram", url: "https://www.instagram.com/reenadesignconstruction?stkn=OGF0cnQ1eW1lenZ2" },
]

/** Only the profiles that have actually been published. */
export const ACTIVE_SOCIAL_LINKS = SOCIAL_LINKS.filter((s) => s.url !== "")
