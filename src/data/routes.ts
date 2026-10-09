/**
 * Every indexable route, and everything a search engine reads about it.
 *
 * This is the single source for each page's <title>, meta description,
 * canonical path, visible <h1>, breadcrumb trail and JSON-LD. Three consumers
 * read it, so they cannot drift apart:
 *
 *   - `<Seo route="…">` writes the head at runtime.
 *   - `scripts/gen-sitemap.mjs` writes public/sitemap.xml and robots.txt.
 *   - `scripts/prerender.mjs` stamps the same head, heading and JSON-LD into
 *     dist/<route>/index.html for crawlers that never run JavaScript.
 *
 * The two build scripts load this file through Vite, so it may import
 * anything the app can — but nothing here may touch the DOM.
 *
 * Writing rules, enforced by `validateRoutes()` at build time:
 *
 *   - `title` is the complete <title>, brand included, at most 60 characters.
 *     Past that Google truncates with an ellipsis, and the part it cuts is the
 *     brand. The search term goes first, the town next, the brand last.
 *   - `description` is 110–160 characters: long enough to be used verbatim
 *     rather than replaced with a scraped sentence, short enough not to be cut.
 *   - Every title and description is unique across the site. Two URLs with the
 *     same title compete with each other for the same query.
 *   - `heading` + `subheading` together are the page's one <h1>. The heading is
 *     the short label the design shows large; the subheading carries the search
 *     term so the h1 says what the page is about, in words a visitor can see.
 */
import { SITE } from "./siteInfo"
import { FAQS } from "./faq"
import { exteriorImgs, archImgs, d3Imgs, renoImgs, type GalleryImage } from "./galleryData"
import {
  type Json,
  breadcrumbSchema,
  faqEntities,
  imageGallerySchema,
  localBusinessSchema,
  organizationSchema,
  pageGraph,
  serviceAreaSchema,
  serviceCatalogSchema,
  serviceSchema,
  websiteSchema,
  webPageSchema,
} from "./structuredData"

export type Crumb = { label: string; href?: string }

export type RouteSeo = {
  path: string
  /** The complete document title, brand included. */
  title: string
  description: string
  /** Large visible label of the <h1>. */
  heading: string
  /** Keyword-bearing second line of the <h1>. */
  subheading?: string
  crumbs: Crumb[]
  /** schema.org type of the page node: WebPage, AboutPage, CollectionPage, … */
  pageType?: string
  /** Page-specific JSON-LD nodes, added after the WebPage and BreadcrumbList. */
  schema?: (route: RouteSeo) => Json[]
  /** Photographs shown on the page, listed in the image sitemap. */
  images?: readonly GalleryImage[]
  /** Source files whose last commit date becomes the sitemap `lastmod`. */
  sources: string[]
  changefreq: "weekly" | "monthly" | "yearly"
  priority: string
}

const HOME: Crumb = { label: "Home", href: "/" }
const OUR_WORK: Crumb = { label: "Our Work", href: "/our-work" }

/** Shared files every gallery route is built from. */
const GALLERY_SOURCES = ["src/pages/GalleryPage.tsx", "src/data/galleryData.ts"]

function gallery(
  path: string,
  heading: string,
  crumb: string,
  name: string,
  title: string,
  subheading: string,
  description: string,
  images: readonly GalleryImage[],
): RouteSeo {
  return {
    path,
    title,
    description,
    heading,
    subheading,
    crumbs: [HOME, OUR_WORK, { label: crumb }],
    pageType: "CollectionPage",
    images,
    schema: (r) => (images.length ? [imageGallerySchema(r.path, name, r.description, [...images])] : []),
    sources: GALLERY_SOURCES,
    changefreq: "monthly",
    priority: "0.6",
  }
}

export const ROUTES: RouteSeo[] = [
  {
    path: "/",
    title: "Construction & Interior Design in Medinipur | Reena Designs",
    description:
      "Design-led house construction, architecture, interiors and renovation in Medinipur, Paschim Medinipur. 250+ projects, 30+ years, completion date in contract.",
    heading: "Your vision, Our creation",
    subheading: "Construction & Interior Design Company",
    crumbs: [HOME],
    schema: (r) => [
      localBusinessSchema(),
      serviceCatalogSchema(r.path),
      serviceAreaSchema(r.path),
    ],
    sources: ["src/pages/Home.tsx", "src/components/home"],
    changefreq: "monthly",
    priority: "1.0",
  },
  {
    path: "/about",
    title: "About Us: Medinipur Builders Since the 1990s | Reena Designs",
    description:
      "The architects, engineers and designers behind Reena Designs & Constructions: our story, values and the team building across Paschim Medinipur.",
    heading: "ABOUT US",
    subheading: "Architects, engineers & builders in Paschim Medinipur since the 1990s",
    crumbs: [HOME, { label: "About Us" }],
    pageType: "AboutPage",
    sources: ["src/pages/About.tsx"],
    changefreq: "yearly",
    priority: "0.8",
  },
  {
    path: "/services",
    title: "Construction & Interior Design Services | Reena Designs",
    description:
      "Residential and commercial construction, architecture, structural engineering, renovation, interiors, 3D elevation and turnkey delivery from one Medinipur team.",
    heading: "OUR SERVICES",
    subheading: "Construction, architecture & interior design in Medinipur",
    crumbs: [HOME, { label: "Services" }],
    pageType: "CollectionPage",
    schema: (r) => [serviceCatalogSchema(r.path), serviceAreaSchema(r.path)],
    sources: ["src/pages/Services.tsx"],
    changefreq: "monthly",
    priority: "0.9",
  },
  {
    path: "/whats-included",
    title: "What's in a House Construction Quote? | Reena Designs",
    description:
      "Sand, TMT bar, bricks and labour — the four heads that carry a house construction quotation in West Bengal, every grade named, plus what is not included.",
    heading: "WHAT'S INCLUDED",
    subheading: "Materials, grades & labour in your construction quotation",
    crumbs: [HOME, { label: "What's Included" }],
    sources: ["src/pages/WhatsIncluded.tsx"],
    changefreq: "monthly",
    priority: "0.8",
  },
  {
    path: "/our-work",
    title: "Our Work — Construction & Interior Portfolio | Reena Designs",
    description:
      "Completed and ongoing construction, architecture, interior, 3D elevation and renovation projects across Medinipur, Kharagpur and Paschim Medinipur.",
    heading: "OUR WORK",
    subheading: "Construction & interior design portfolio, Paschim Medinipur",
    crumbs: [HOME, { label: "Our Work" }],
    pageType: "CollectionPage",
    sources: ["src/pages/OurWork.tsx"],
    changefreq: "monthly",
    priority: "0.8",
  },
  {
    path: "/our-work/interior/residential",
    title: "Home Interior Designer in Medinipur | Reena Designs",
    description:
      "Living rooms, bedrooms, modular kitchens and pooja rooms designed in 3D, quoted by material grade and built by our own carpenters and electricians in Medinipur.",
    heading: "RESIDENTIAL INTERIOR",
    subheading: "Home interior design in Medinipur",
    crumbs: [HOME, OUR_WORK, { label: "Interior Design" }, { label: "Residential Interior" }],
    pageType: "CollectionPage",
    schema: (r) => [
      serviceSchema(
        "Residential Interior Design",
        "Home interior design and fit-out — living rooms, bedrooms, modular kitchens, wardrobes, false ceilings, lighting and pooja rooms — designed in 3D and executed by in-house carpentry and electrical teams.",
        r.path,
      ),
      serviceAreaSchema(r.path),
    ],
    sources: ["src/pages/InteriorResidential.tsx", "src/data/interiorProjects.ts"],
    changefreq: "monthly",
    priority: "0.8",
  },
  {
    path: "/our-work/interior/commercial",
    title: "Commercial Interior Design in Medinipur | Reena Designs",
    description:
      "Office, restaurant, retail, hotel and institutional interiors delivered on commercial timelines with minimal disruption, across Medinipur, Kharagpur and Bengal.",
    heading: "COMMERCIAL INTERIOR",
    subheading: "Office, retail & hotel interiors in West Bengal",
    crumbs: [HOME, OUR_WORK, { label: "Interior Design" }, { label: "Commercial Interior" }],
    pageType: "CollectionPage",
    schema: (r) => [
      serviceSchema(
        "Commercial Interior Design",
        "Office, restaurant, retail, showroom, hotel and institutional interior design and fit-out, delivered on commercial timelines with minimal disruption to trading.",
        r.path,
      ),
      serviceAreaSchema(r.path),
    ],
    sources: ["src/pages/InteriorCommercial.tsx"],
    changefreq: "monthly",
    priority: "0.8",
  },

  gallery(
    "/our-work/exterior",
    "EXTERIOR DESIGN",
    "Exterior Design",
    "Exterior design gallery",
    "House Exterior & Facade Design, Medinipur | Reena Designs",
    "House elevation & facade design in Medinipur",
    "Front elevations, facades, boundary walls and landscaping for houses, apartments and commercial buildings in Medinipur, Kharagpur and Paschim Medinipur.",
    exteriorImgs,
  ),
  gallery(
    "/our-work/architecture",
    "ARCHITECTURE GALLERY",
    "Architecture Gallery",
    "Architecture gallery",
    "Architect & House Plans in Medinipur | Reena Designs",
    "House plans & sanction drawings in Paschim Medinipur",
    "Site-responsive house plans, massing studies and sanction-ready drawings, with municipal and panchayat approvals filed for you across Paschim Medinipur.",
    archImgs,
  ),
  gallery(
    "/our-work/3d-design",
    "3D DESIGN & ELEVATION",
    "3D Design & Elevation",
    "3D design and elevation gallery",
    "3D Front Elevation Design in Medinipur | Reena Designs",
    "3D front elevation design before construction starts",
    "3D front elevation and exterior visualisation, so you approve the finished building before construction starts in Medinipur and across West Bengal.",
    d3Imgs,
  ),
  gallery(
    "/our-work/renovation",
    "RENOVATION PROJECTS",
    "Renovation Projects",
    "Renovation projects gallery",
    "Home Renovation Contractor in Medinipur | Reena Designs",
    "Home renovation & remodelling in Medinipur",
    "Home renovation, structural retrofits, floor additions and full remodelling across Medinipur — modernising older buildings without weakening the structure.",
    renoImgs,
  ),

  {
    path: "/our-work/testimonials",
    title: "Client Testimonials — Builders in Medinipur | Reena Designs",
    description:
      "Client testimonials for Reena Designs & Constructions are coming soon: homeowners and business owners on building with us, in their own words.",
    heading: "CLIENT TESTIMONIALS",
    subheading: "Coming soon",
    crumbs: [HOME, OUR_WORK, { label: "Client Testimonials" }],
    sources: ["src/pages/TestimonialsPage.tsx"],
    changefreq: "monthly",
    priority: "0.7",
  },
  {
    path: "/learn-from-us",
    title: "AutoCAD, Revit & SketchUp Training Medinipur | Reena Designs",
    description:
      "Learn AutoCAD, Revit, SketchUp, Primavera P6, STAAD.Pro, ETABS, Lumion and V-Ray from working architects and engineers at our design studio in Medinipur.",
    heading: "LEARN WITH US",
    subheading: "AutoCAD, Revit & design software training in Medinipur",
    crumbs: [HOME, { label: "Learn With Us" }],
    sources: ["src/pages/LearnFromUs.tsx", "src/data/courses.ts"],
    changefreq: "monthly",
    priority: "0.5",
  },
  {
    path: "/careers",
    title: "Construction & Design Jobs in Medinipur | Reena Designs",
    description:
      "Open roles at Reena Designs & Constructions in site engineering, draughting, interior design and structural engineering, based in Medinipur, Paschim Medinipur.",
    heading: "CAREERS",
    subheading: "Construction & design jobs in Medinipur",
    crumbs: [HOME, { label: "Careers" }],
    sources: ["src/pages/Careers.tsx"],
    changefreq: "monthly",
    priority: "0.5",
  },
  {
    path: "/contact",
    title: "Contact Us — Free Site Visit in Medinipur | Reena Designs",
    description: `Talk to us about your build: free site visit across Paschim Medinipur, an itemised quotation and a written completion date. Call ${SITE.phones[0]}.`,
    heading: "CONTACT US",
    subheading: "Free site visit & itemised quote in Paschim Medinipur",
    crumbs: [HOME, { label: "Contact Us" }],
    pageType: "ContactPage",
    /* The office node lives here as well as on the homepage: this is the page a
       "contractor near me" result lands on, and it is where the address, hours
       and map pin are actually rendered. */
    schema: (r) => [localBusinessSchema(), serviceAreaSchema(r.path)],
    sources: ["src/pages/Contact.tsx", "src/data/siteInfo.ts"],
    changefreq: "yearly",
    priority: "0.9",
  },
  {
    path: "/faq",
    title: "House Construction FAQ — Cost & Approvals | Reena Designs",
    description:
      "Straight answers on house construction cost, timelines, municipal approvals, materials, payment stages and warranty in Medinipur, Paschim Medinipur.",
    heading: "FREQUENTLY ASKED QUESTIONS",
    subheading: "House construction cost, timelines & approvals in Medinipur",
    crumbs: [HOME, { label: "FAQ" }],
    pageType: "FAQPage",
    sources: ["src/pages/Faq.tsx", "src/data/faq.ts"],
    changefreq: "monthly",
    priority: "0.8",
  },
  {
    path: "/privacy",
    title: "Privacy Policy | Reena Designs & Constructions",
    description: `How ${SITE.name} collects, uses, shares and protects your personal data under India's DPDP Act, and how to exercise your rights.`,
    heading: "PRIVACY POLICY",
    subheading: "How we collect, use and protect your personal data",
    crumbs: [HOME, { label: "Privacy Policy" }],
    sources: ["src/pages/Privacy.tsx", "src/components/ui/LegalDocument.tsx"],
    changefreq: "yearly",
    priority: "0.3",
  },
  {
    path: "/cookies",
    title: "Cookie Policy | Reena Designs & Constructions",
    description: `What ${SITE.name} stores in your browser: no advertising or analytics cookies, only one local record of your cookie choice.`,
    heading: "COOKIE POLICY",
    crumbs: [HOME, { label: "Cookie Policy" }],
    sources: ["src/pages/Cookies.tsx"],
    changefreq: "yearly",
    priority: "0.3",
  },
  {
    path: "/terms",
    title: "Terms & Conditions | Reena Designs & Constructions",
    description: `The terms for using the ${SITE.name} website: enquiries and quotations, project agreements, intellectual property and governing law.`,
    heading: "TERMS & CONDITIONS",
    subheading: "The terms that apply when you use this website",
    crumbs: [HOME, { label: "Terms & Conditions" }],
    sources: ["src/pages/Terms.tsx", "src/components/ui/LegalDocument.tsx"],
    changefreq: "yearly",
    priority: "0.3",
  },
]

const BY_PATH = new Map(ROUTES.map((r) => [r.path, r]))

/** The entry for a path. Throws on an unknown one — a typo should fail loudly. */
export function routeSeo(path: string): RouteSeo {
  const route = BY_PATH.get(path)
  if (!route) throw new Error(`No SEO entry for route "${path}" in src/data/routes.ts`)
  return route
}

/** The entry for a path, or undefined. */
export function findRoute(path: string): RouteSeo | undefined {
  return BY_PATH.get(path)
}

/** Absolute canonical URL. The root keeps its slash; nothing else has one. */
export const canonicalUrl = (path: string) => `${SITE.origin}${path}`

/**
 * The page's full JSON-LD graph: the WebPage node, its BreadcrumbList, and the
 * route's own nodes. The organisation and the website are not repeated here —
 * they ship once per document in the site-wide graph in the HTML shell, and
 * every node below points at them by `@id`.
 */
export function routeGraph(route: RouteSeo): Json {
  const hasBreadcrumb = route.crumbs.length > 1
  const page = webPageSchema({
    path: route.path,
    name: route.title,
    description: route.description,
    type: route.pageType,
    hasBreadcrumb,
    primaryImage: route.images?.[0]?.src,
    extra: route.pageType === "FAQPage" ? { mainEntity: faqEntities(FAQS) } : undefined,
  })
  return pageGraph(
    page,
    ...(hasBreadcrumb ? [breadcrumbSchema(route.path, route.crumbs)] : []),
    ...(route.schema?.(route) ?? []),
  )
}

/** The site-wide nodes every page carries: the organisation and the website. */
export function siteGraph(): Json {
  return pageGraph(organizationSchema(), websiteSchema())
}

/**
 * Build-time checks. Returns a list of problems; the scripts fail on any.
 */
export function validateRoutes(): string[] {
  const problems: string[] = []
  const seen = { title: new Map<string, string>(), description: new Map<string, string>() }
  for (const r of ROUTES) {
    if (r.path !== "/" && (r.path.endsWith("/") || r.path !== r.path.toLowerCase())) {
      problems.push(`${r.path}: paths are lowercase with no trailing slash`)
    }
    if (r.title.length > 60) problems.push(`${r.path}: title is ${r.title.length} chars (max 60)`)
    if (!r.title.includes("Reena Designs")) problems.push(`${r.path}: title is missing the brand`)
    if (r.description.length < 110 || r.description.length > 160) {
      problems.push(`${r.path}: description is ${r.description.length} chars (want 110–160)`)
    }
    for (const key of ["title", "description"] as const) {
      const other = seen[key].get(r[key])
      if (other) problems.push(`${r.path}: ${key} duplicates ${other}`)
      seen[key].set(r[key], r.path)
    }
    if (r.crumbs[r.crumbs.length - 1]?.href && r.path !== "/") {
      problems.push(`${r.path}: the last breadcrumb is the current page and takes no href`)
    }
  }
  return problems
}
