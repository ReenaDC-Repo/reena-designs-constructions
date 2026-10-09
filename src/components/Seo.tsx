import { useEffect } from "react"
import { SITE } from "@/data/siteInfo"
import { keywordsFor } from "@/data/seo"
import { routeSeo, routeGraph, canonicalUrl } from "@/data/routes"

type SeoProps =
  | {
      /**
       * Path of the page's entry in `src/data/routes.ts`. Title, description,
       * canonical and JSON-LD all come from there, so the runtime head is
       * identical to the prerendered one.
       */
      route: string
      /** Social card image. Absolute URL, or a path resolved against the origin. */
      image?: string
      title?: never
      description?: never
      noindex?: never
    }
  | {
      /** For pages with no route entry — the 404. */
      route?: never
      title: string
      description: string
      noindex?: boolean
      image?: string
    }

/**
 * Per-route document head.
 *
 * Without this every one of the site's routes shipped the single title and
 * description from `.figma/make/site.json`, so /services, /contact and eight
 * gallery pages all competed in search as the same page. A local-search site
 * cannot afford that.
 *
 * Tags are created once and then mutated by key, rather than removed and
 * re-added on every navigation — a crawler that snapshots mid-update would
 * otherwise catch a head with no canonical at all. Only `robots` is torn down
 * on unmount, because it is the one tag whose absence is the correct default.
 */
function upsertMeta(key: "name" | "property", value: string, content: string) {
  const selector = `meta[${key}="${value}"]`
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement("meta")
    el.setAttribute(key, value)
    document.head.appendChild(el)
  }
  el.content = content
  return el
}

/** Sets the href on a <link>, creating it from the selector's attributes. */
function upsertLink(selector: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(selector)
  if (!el) {
    el = document.createElement("link")
    for (const [, attr, value] of selector.matchAll(/\[(\w+)="([^"]+)"\]/g)) el.setAttribute(attr, value)
    document.head.appendChild(el)
  }
  el.href = href
}

/**
 * The page's JSON-LD, carried in one script element that is reused across
 * navigations.
 *
 * It has to be *replaced*, not appended: React Router keeps the document
 * alive, so appending would leave /contact shipping the /services graph as
 * well, and two `@id`-clashing nodes in one document is how a rich result gets
 * dropped rather than doubled. The prerendered HTML shell writes its graph
 * into an element with this same id, so the first client render overwrites it
 * instead of duplicating it.
 */
const JSONLD_ID = "seo-page-jsonld"

function upsertJsonLd(schema: object | object[] | undefined) {
  const existing = document.getElementById(JSONLD_ID)
  if (!schema) {
    existing?.remove()
    return
  }
  const el = existing ?? document.createElement("script")
  if (!existing) {
    el.id = JSONLD_ID
    ;(el as HTMLScriptElement).type = "application/ld+json"
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(schema)
}

export default function Seo(props: SeoProps) {
  const entry = props.route ? routeSeo(props.route) : undefined
  const title = entry?.title ?? props.title ?? SITE.name
  const description = entry?.description ?? props.description ?? ""
  const noindex = !entry && !!props.noindex
  const image = props.image ?? entry?.images?.[0]?.src
  const schemaJson = entry ? JSON.stringify(routeGraph(entry)) : ""
  const path = entry?.path

  useEffect(() => {
    const fullTitle = title.includes("Reena Designs") ? title : `${title} | ${SITE.name}`
    const socialImage = image
      ? image.startsWith("http")
        ? image
        : `${SITE.origin}${image}`
      : `${SITE.origin}${SITE.ogImagePath}`

    document.title = fullTitle

    upsertMeta("name", "description", description)
    upsertMeta("property", "og:title", fullTitle)
    upsertMeta("property", "og:description", description)
    upsertMeta("property", "og:image", socialImage)
    upsertMeta("name", "twitter:title", fullTitle)
    upsertMeta("name", "twitter:description", description)
    upsertMeta("name", "twitter:image", socialImage)

    const terms = path ? keywordsFor(path) : undefined
    if (terms) upsertMeta("name", "keywords", terms)

    /*
      The canonical comes from the route table, never from `location`. A
      visitor who arrives on /Services/ or /services?utm_source=whatsapp is
      shown the page, but every one of those variants names /services as the
      URL to index. A page with no entry (the 404) gets no canonical at all —
      pointing one at a URL that does not exist is worse than having none.
    */
    const linkSelectors = [
      'link[rel="canonical"]',
      'link[rel="alternate"][hreflang="en-IN"]',
      'link[rel="alternate"][hreflang="x-default"]',
    ]
    if (path) {
      const url = canonicalUrl(path)
      upsertMeta("property", "og:url", url)
      for (const selector of linkSelectors) upsertLink(selector, url)
    } else {
      for (const selector of linkSelectors) document.head.querySelector(selector)?.remove()
      document.head.querySelector('meta[property="og:url"]')?.remove()
    }

    upsertJsonLd(schemaJson ? (JSON.parse(schemaJson) as object) : undefined)

    // The static tag in index.html says "index, follow". A noindex page has to
    // override it while mounted and hand it back on the way out, or the next
    // route inherits the noindex.
    const robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]')
    const previousRobots = robots?.content ?? null
    if (robots) {
      robots.content = noindex
        ? "noindex, follow"
        : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    }

    return () => {
      if (robots && previousRobots !== null) robots.content = previousRobots
    }
  }, [title, description, noindex, path, image, schemaJson])

  return null
}
