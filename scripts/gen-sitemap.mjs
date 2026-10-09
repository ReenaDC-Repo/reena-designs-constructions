/**
 * Writes public/sitemap.xml, and the Sitemap line of public/robots.txt, from
 * the route table in src/data/routes.ts.
 *
 * Runs as part of `pnpm build`, before `vite build` copies public/ into dist/.
 * Redirect-only paths (/our-work/projects, /our-work/interior) are deliberately
 * absent — a sitemap listing a URL that 301s wastes crawl budget and tells
 * Google the destination is not the canonical one.
 *
 * `lastmod` is the date of the last commit touching the route's own source
 * files, not the build date. A sitemap that stamps today on every URL at every
 * deploy is one Google learns to ignore; a date that only moves when the page
 * did is one it uses to decide what to recrawl. Uncommitted changes count as
 * today.
 *
 * Gallery and project routes also list their photographs with the image
 * sitemap extension, which is how images that load late in a client-rendered
 * grid still get discovered for Google Images.
 *
 * On `changefreq` and `priority`: Google ignores both. They are kept because
 * Bing and Yandex still read them, and they cost nothing.
 */
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadRoutes } from './load-routes.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const { ROUTES, canonicalUrl } = await loadRoutes()
const today = new Date().toISOString().slice(0, 10)

/** & < > in a URL would make the XML unparseable and the sitemap rejected. */
const escapeXml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function git(args) {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  } catch {
    return null
  }
}

function lastModified(sources) {
  const dirty = git(['status', '--porcelain', '--', ...sources])
  if (dirty === null || dirty !== '') return today
  return git(['log', '-1', '--format=%cs', '--', ...sources]) || today
}

const entries = ROUTES.map((route) => {
  const images = (route.images ?? [])
    .map(({ src }) => `\n    <image:image>\n      <image:loc>${escapeXml(src.startsWith('http') ? src : canonicalUrl(src))}</image:loc>\n    </image:image>`)
    .join('')
  return `  <url>
    <loc>${escapeXml(canonicalUrl(route.path))}</loc>
    <lastmod>${lastModified(route.sources)}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>${images}
  </url>`
})

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.join('\n')}
</urlset>
`

writeFileSync(resolve(root, 'public/sitemap.xml'), xml)

// Keep robots.txt pointing at this deploy's origin.
const robotsPath = resolve(root, 'public/robots.txt')
const sitemapUrl = canonicalUrl('/sitemap.xml')
const robots = readFileSync(robotsPath, 'utf8').replace(/^Sitemap:.*$/m, `Sitemap: ${sitemapUrl}`)
writeFileSync(robotsPath, robots)

console.log(`sitemap.xml — ${ROUTES.length} routes → ${sitemapUrl}`)
