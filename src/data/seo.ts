/**
 * Keywords, service areas and structured-data builders.
 *
 * Everything a search engine reads *about* a page — as opposed to the copy on
 * it — is defined here so the wording stays consistent across the head tags,
 * the JSON-LD and the on-page "areas we serve" block. A local-search site loses
 * ranking when the same business describes itself three different ways.
 *
 * On keywords: `<meta name="keywords">` has not been a Google ranking factor
 * for years, and nothing here is written expecting it to be. The value of
 * keeping the list is that it forces the page's actual target terms to be
 * written down, which is what the title, description, headings and body copy
 * are then checked against. Bing and several AI crawlers do still read it.
 */

/**
 * Towns and cities the company actually takes work in.
 *
 * These drive both the `areaServed` graph and the on-page service-area block.
 * "Construction company in Kharagpur" is a far cheaper term to rank for than
 * "construction company in West Bengal", and a page that names the town is the
 * only thing that can rank for it. Do not pad this list with places the
 * company will not travel to — a service area that cannot be served is the
 * kind of thing that earns a manual action, and it wastes the visit anyway.
 */
export const SERVICE_AREAS = [
  { name: "Medinipur", note: "Head office — Paschim Medinipur" },
  { name: "Kharagpur", note: "Residential & commercial builds" },
  { name: "Ghatal", note: "Homes, renovation & interiors" },
  { name: "Chandrakona", note: "Independent house construction" },
  { name: "Garhbeta", note: "Turnkey building projects" },
  { name: "Salboni", note: "Civil construction & RCC work" },
  { name: "Keshpur", note: "Home construction & remodelling" },
  { name: "Debra", note: "Residential construction" },
  { name: "Daspur", note: "Interiors & renovation" },
  { name: "Sabang", note: "Independent homes" },
  { name: "Pingla", note: "Building construction" },
  { name: "Narayangarh", note: "Homes & shop interiors" },
  { name: "Belda", note: "Construction & 3D elevation" },
  { name: "Dantan", note: "Residential builds" },
  { name: "Jhargram", note: "Construction & architecture" },
  { name: "Tamluk", note: "Purba Medinipur projects" },
  { name: "Haldia", note: "Commercial & industrial interiors" },
  { name: "Bankura", note: "Building construction" },
  { name: "Kolkata", note: "Interior design & fit-out" },
  { name: "Howrah", note: "Commercial interiors" },
] as const

/** Just the place names, for `areaServed` and keyword strings. */
export const SERVICE_AREA_NAMES = SERVICE_AREAS.map((a) => a.name)

/**
 * The services, in the wording used on /services, plus the complete package
 * they add up to.
 *
 * Duplicated as data (rather than imported from the page) so the JSON-LD can
 * be built without pulling a route chunk into the entry bundle.
 */
export const SERVICE_CATALOG = [
  {
    name: "Civil Construction",
    description:
      "Complete construction solutions for residential, commercial, government, and non-government projects.",
    slug: "/services",
  },
  {
    name: "AutoCAD Drawing",
    description:
      "Accurate and detailed AutoCAD drawings to support proper planning and execution.",
    slug: "/services",
  },
  {
    name: "Interior Design",
    description:
      "Functional and aesthetic interior solutions designed to suit your space and requirements.",
    slug: "/our-work/interior/residential",
  },
  {
    name: "Exterior Design",
    description:
      "Professional exterior design solutions that enhance the look and overall appeal of your property.",
    slug: "/our-work/3d-design",
  },
  {
    name: "Materials & Manpower",
    description:
      "Reliable construction materials and skilled manpower for smooth project execution.",
    slug: "/services",
  },
  {
    name: "Finishing Works",
    description:
      "Quality finishing services to bring every project together with attention to detail.",
    slug: "/services",
  },
  {
    name: "Complete Construction Solutions",
    description:
      "From drawing and planning to construction, interiors, exteriors, finishing, and final handover, we provide a complete package under one roof.",
    slug: "/services",
  },
] as const

/**
 * Per-route target terms.
 *
 * Each entry is what the page is genuinely trying to win, in descending order
 * of intent. Local modifiers come first because "construction company in
 * Medinipur" converts and "construction company" does not — a firm this size is
 * never going to outrank a national contractor on the head term, and does not
 * need to.
 */
export const PAGE_KEYWORDS: Record<string, string[]> = {
  "/": [
    "construction company in Medinipur",
    "best construction company in Medinipur",
    "building contractors in Paschim Medinipur",
    "civil contractors Midnapore West Bengal",
    "house construction company near me",
    "turnkey construction company West Bengal",
    "interior designer in Medinipur",
    "architect in Medinipur",
    "home construction cost in West Bengal",
    "residential construction Kharagpur",
  ],
  "/about": [
    "about Reena Designs & Constructions",
    "construction company Medinipur since the 1990s",
    "licensed civil engineers Paschim Medinipur",
    "experienced building contractors West Bengal",
    "architecture and construction firm Medinipur",
    "trusted home builders Midnapore",
  ],
  "/services": [
    "construction services in Medinipur",
    "residential construction contractor Medinipur",
    "commercial construction company West Bengal",
    "architectural design services Medinipur",
    "structural engineering consultant Medinipur",
    "renovation and remodeling contractor Medinipur",
    "interior design services Paschim Medinipur",
    "3D elevation design West Bengal",
    "turnkey construction contractor India",
    "RCC contractor Midnapore",
  ],
  "/whats-included": [
    "house construction cost breakdown West Bengal",
    "construction material rates Medinipur",
    "what is included in construction quotation",
    "cement sand TMT bar grades for house construction",
    "labour cost for house construction in India",
    "itemised construction estimate Medinipur",
    "construction cost per square foot West Bengal",
  ],
  "/our-work": [
    "construction projects in Medinipur",
    "completed building projects Paschim Medinipur",
    "construction company portfolio West Bengal",
    "house design gallery Midnapore",
    "interior design portfolio Medinipur",
  ],
  "/our-work/interior/residential": [
    "residential interior designer in Medinipur",
    "home interior design Paschim Medinipur",
    "modular kitchen Medinipur",
    "bedroom and wardrobe design Medinipur",
    "flat interior design Kharagpur",
    "pooja room design West Bengal",
    "false ceiling and lighting design Midnapore",
  ],
  "/our-work/interior/commercial": [
    "commercial interior designer Medinipur",
    "office interior design West Bengal",
    "shop and showroom interior Kharagpur",
    "restaurant interior designer Medinipur",
    "hotel interior design West Bengal",
    "retail fit-out contractor Medinipur",
  ],
  "/our-work/exterior": [
    "exterior design Medinipur",
    "house front elevation design West Bengal",
    "facade design contractor Medinipur",
    "modern house exterior India",
  ],
  "/our-work/architecture": [
    "architecture firm in Medinipur",
    "architectural design gallery West Bengal",
    "house plan design Paschim Medinipur",
    "sanction drawing architect Medinipur",
  ],
  "/our-work/3d-design": [
    "3D elevation design Medinipur",
    "3D house design West Bengal",
    "front elevation 3D rendering India",
    "3D exterior visualisation Medinipur",
  ],
  "/our-work/renovation": [
    "home renovation contractor Medinipur",
    "house remodeling West Bengal",
    "building renovation Paschim Medinipur",
    "old house renovation cost India",
  ],
  "/our-work/testimonials": [
    "Reena Designs & Constructions reviews",
    "construction company reviews Medinipur",
    "client testimonials builders West Bengal",
    "best rated contractor Paschim Medinipur",
  ],
  "/contact": [
    "contact construction company Medinipur",
    "free site visit construction Paschim Medinipur",
    "construction quote Midnapore",
    "building contractor phone number Medinipur",
    "civil contractor near me West Bengal",
  ],
  "/faq": [
    "house construction cost in Medinipur",
    "how long does house construction take India",
    "municipal building approval West Bengal",
    "construction payment stages India",
    "construction warranty India",
    "questions to ask a building contractor",
  ],
}

/** Comma-joined keyword string for the `keywords` meta tag. */
export function keywordsFor(pathname: string): string | undefined {
  const list = PAGE_KEYWORDS[pathname]
  return list?.join(", ")
}
