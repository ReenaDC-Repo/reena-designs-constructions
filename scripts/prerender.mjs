/**
 * Stamps a per-route HTML shell into dist/.
 *
 * The problem this solves
 * ----------------------
 * This is a client-rendered SPA: every URL is served the same index.html, and
 * the correct title, description and canonical are written by <Seo> after
 * React mounts. Googlebot does execute JavaScript, so it eventually sees the
 * right head — but "eventually" is the operative word, rendering sits in a
 * second queue behind the initial crawl, and the first thing recorded for
 * eighteen distinct URLs is eighteen copies of the homepage title.
 *
 * Every other crawler is worse. Facebook, WhatsApp, LinkedIn, X and Slack do
 * not run JavaScript at all: before this step, sharing a link to /services in
 * a WhatsApp group produced the homepage's card, every time, for every page on
 * the site. For a business that gets found by people forwarding a link to a
 * relative, that is not a small loss.
 *
 * What it does
 * ------------
 * After `vite build`, each route in src/data/routes.ts gets its own copy of
 * the built shell at dist/<route>/index.html with the head rewritten: title,
 * description, keywords, canonical, hreflang, the full set of Open Graph and
 * Twitter card tags, and the page's JSON-LD graph (WebPage, BreadcrumbList,
 * FAQPage, ImageGallery, Service…). The site-wide organisation graph in the
 * shell is regenerated from the same builders, so the hand-written fallback in
 * index.html can never ship stale. The JavaScript bundle is unchanged and still
 * renders the real page — <Seo> then writes the same values from the same
 * table, so the two never disagree.
 *
 * Why it works on the host
 * ------------------------
 * Both static hosts this deploys to check for a real file before applying the
 * SPA fallback: Netlify's `/* → /index.html 200` rewrite runs only when no
 * matching file exists, and public/.htaccess carries the matching
 * `RewriteCond ... -f` guard (extended for this to cover <dir>/index.html).
 * So /services is served the stamped shell, while an unknown path still falls
 * through to the root one and React renders the 404.
 *
 * This is not server-side rendering. The <noscript> block carries the page's
 * <h1> (the same heading and subheading the page renders), its breadcrumb
 * trail, its description and a link to every other page — enough that a
 * non-rendering crawler gets real text and a crawlable link graph rather than
 * an empty div, and deliberately no more than the page itself says. Actual
 * prerendering (a headless browser writing the rendered DOM into each shell)
 * is the next step up, and the place to go if Search Console ever reports
 * these pages as thin.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, resolve, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadRoutes } from './load-routes.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'dist')
const shellPath = join(dist, 'index.html')

if (!existsSync(shellPath)) {
  console.error('prerender: dist/index.html not found — run `vite build` first.')
  process.exit(1)
}

const { ROUTES, routeGraph, siteGraph, canonicalUrl, keywordsFor, SITE_NAME, ORIGIN } = await loadRoutes()

/** Escapes a string for use inside an HTML attribute or text node. */
const esc = (s) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const shell = readFileSync(shellPath, 'utf8')

/**
 * Replaces a meta tag's content, or appends the tag if the shell has none.
 *
 * The Figma plugin injects `description`, `og:title` and `og:description` at
 * the end of the head with unquoted-ish formatting of its own, while the tags
 * written by hand in index.html are self-closed — so the pattern has to match
 * both shapes rather than assume one.
 */
function setMeta(html, attr, name, content) {
  const pattern = new RegExp(
    `(<meta\\s+${attr}=["']${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']\\s+content=["'])[^"']*(["']\\s*/?>)`,
    'i',
  )
  if (pattern.test(html)) return html.replace(pattern, `$1${esc(content)}$2`)
  return html.replace('</head>', `    <meta ${attr}="${name}" content="${esc(content)}" />\n  </head>`)
}

/** Replaces the href on a <link rel=…> (optionally narrowed by hreflang). */
function setLink(html, rel, href, hreflang) {
  const hreflangPart = hreflang ? `\\s+hreflang=["']${hreflang}["']` : ''
  const pattern = new RegExp(`(<link\\s+rel=["']${rel}["']${hreflangPart}\\s+href=["'])[^"']*(["'])`, 'i')
  if (pattern.test(html)) return html.replace(pattern, `$1${esc(href)}$2`)
  const tag = hreflang
    ? `<link rel="${rel}" hreflang="${hreflang}" href="${esc(href)}" />`
    : `<link rel="${rel}" href="${esc(href)}" />`
  return html.replace('</head>', `    ${tag}\n  </head>`)
}

/** JSON for a <script> body. `</` would end the element early. */
const jsonForScript = (value) => JSON.stringify(value).replace(/</g, '\\u003c')

/**
 * Replaces the body of the <script> with this id, or appends one to the head.
 */
function setJsonLd(html, id, value) {
  const tag = `<script type="application/ld+json" id="${id}">${jsonForScript(value)}</script>`
  const pattern = new RegExp(`<script[^>]*\\bid=["']${id}["'][^>]*>[\\s\\S]*?</script>`, 'i')
  if (pattern.test(html)) return html.replace(pattern, () => tag)
  return html.replace('</head>', `    ${tag}\n  </head>`)
}

/**
 * The text a non-rendering crawler sees.
 *
 * Kept to what the page itself says — its heading, its trail, its description,
 * and the site's navigation. Stuffing extra copy in here that the rendered page
 * does not contain would be cloaking, which is a far more expensive problem
 * than the one this file exists to fix.
 */
function noscriptBlock(route) {
  const heading = route.subheading
    ? `${esc(route.heading)} — ${esc(route.subheading)}`
    : esc(route.heading)
  const trail = route.crumbs
    .map((c, i) =>
      c.href && i < route.crumbs.length - 1 ? `<a href="${c.href}">${esc(c.label)}</a>` : esc(c.label),
    )
    .join(' / ')
  const links = ROUTES.filter((r) => r.path !== route.path)
    .map((r) => `<li><a href="${r.path}">${esc(r.crumbs[r.crumbs.length - 1].label)}</a></li>`)
    .join('')
  return `<noscript><div>${route.crumbs.length > 1 ? `<nav aria-label="Breadcrumb">${trail}</nav>` : ''}<h1>${heading}</h1><p>${esc(route.description)}</p><nav aria-label="Site"><ul>${links}</ul></nav><p>${esc(SITE_NAME)} — Medinipur, Paschim Medinipur, West Bengal 721101, India.</p></div></noscript>`
}

function render(route) {
  const url = canonicalUrl(route.path)
  const title = route.title
  const image = route.images?.[0]?.src ?? `${ORIGIN}/og-image.png`

  let html = shell.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(title)}</title>`)

  html = setMeta(html, 'name', 'description', route.description)
  const keywords = keywordsFor(route.path)
  if (keywords) html = setMeta(html, 'name', 'keywords', keywords)
  html = setMeta(html, 'property', 'og:title', title)
  html = setMeta(html, 'property', 'og:description', route.description)
  html = setMeta(html, 'property', 'og:url', url)
  html = setMeta(html, 'property', 'og:image', image)
  html = setMeta(html, 'name', 'twitter:title', title)
  html = setMeta(html, 'name', 'twitter:description', route.description)
  html = setMeta(html, 'name', 'twitter:image', image)

  html = setLink(html, 'canonical', url)
  html = setLink(html, 'alternate', url, 'en-IN')
  html = setLink(html, 'alternate', url, 'x-default')

  html = setJsonLd(html, 'seo-site-jsonld', siteGraph())
  html = setJsonLd(html, 'seo-page-jsonld', routeGraph(route))

  html = html.replace('<div id="root"></div>', `<div id="root"></div>\n    ${noscriptBlock(route)}`)

  return html
}

let written = 0
for (const route of ROUTES) {
  const html = render(route)
  const outDir = route.path === '/' ? dist : join(dist, route.path)
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'index.html'), html)
  written++
}

console.log(`prerender — ${written} route shells stamped into dist/`)
