/**
 * Loads src/data/routes.ts into a build script.
 *
 * The route table is TypeScript that imports other app modules through the
 * `@` alias and reads `import.meta.env`, so plain Node cannot import it. A
 * throwaway Vite server in middleware mode transforms it exactly as the app
 * build would, with the project's own config — then shuts down. Nothing is
 * served and no port is opened.
 *
 * Fails the build if `validateRoutes()` reports anything: an over-long title or
 * a duplicated description is cheaper to fix here than in Search Console.
 */
import { createServer } from 'vite'

export async function loadRoutes() {
  const server = await createServer({
    configFile: new URL('../vite.config.ts', import.meta.url).pathname,
    server: { middlewareMode: true, hmr: false, watch: null },
    appType: 'custom',
    optimizeDeps: { noDiscovery: true, include: [] },
    logLevel: 'error',
  })
  try {
    const mod = await server.ssrLoadModule('/src/data/routes.ts')
    const { keywordsFor } = await server.ssrLoadModule('/src/data/seo.ts')
    const { SITE } = await server.ssrLoadModule('/src/data/siteInfo.ts')
    const problems = mod.validateRoutes()
    if (problems.length) {
      console.error('\nRoute SEO metadata failed validation (src/data/routes.ts):\n' + problems.map((p) => `  • ${p}`).join('\n') + '\n')
      process.exit(1)
    }
    return { ...mod, keywordsFor, SITE_NAME: SITE.name, ORIGIN: SITE.origin }
  } finally {
    await server.close()
  }
}
