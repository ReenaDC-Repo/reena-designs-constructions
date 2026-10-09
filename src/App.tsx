import { lazy, Suspense } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import ScrollToTop from "./components/layout/ScrollToTop"
import PreLoader from "./components/layout/PreLoader"
import Home from "./pages/Home"
import GalleryPage from "./pages/GalleryPage"
import {
  exteriorImgs,
  archImgs,
  d3Imgs,
  renoImgs,
} from "./data/galleryData"

/**
 * Every route except the homepage is split out of the main bundle.
 *
 * All twelve pages used to be static imports, so a visitor landing on "/"
 * downloaded the interiors lightbox, the build simulator, the 404 artwork and
 * the assistant's entire knowledge base before the hero could paint. Home
 * stays eager because it is the overwhelmingly common entry point and lazily
 * loading it would only add a round trip.
 */
const About = lazy(() => import("./pages/About"))
const Services = lazy(() => import("./pages/Services"))
const WhatsIncluded = lazy(() => import("./pages/WhatsIncluded"))
const OurWork = lazy(() => import("./pages/OurWork"))
const InteriorResidential = lazy(() => import("./pages/InteriorResidential"))
const InteriorCommercial = lazy(() => import("./pages/InteriorCommercial"))
const TestimonialsPage = lazy(() => import("./pages/TestimonialsPage"))
const Contact = lazy(() => import("./pages/Contact"))
const Faq = lazy(() => import("./pages/Faq"))
const Privacy = lazy(() => import("./pages/Privacy"))
const Cookies = lazy(() => import("./pages/Cookies"))
const Terms = lazy(() => import("./pages/Terms"))
const LearnFromUs = lazy(() => import("./pages/LearnFromUs"))
const Careers = lazy(() => import("./pages/Careers"))
const NotFound = lazy(() => import("./pages/NotFound"))

/**
 * Floating chrome, also split out.
 *
 * Neither is needed to render or read a page: the banner appears 1.2s in, and
 * the assistant carries a 300-line knowledge base that only matters once
 * someone opens it. Keeping them in the entry chunk meant every visitor
 * downloaded all of it before the hero could paint.
 */
const ChatBot = lazy(() => import("./components/ui/ChatBot"))
const CookieBanner = lazy(() => import("./components/layout/CookieBanner"))

/** Holds the viewport height while a route chunk arrives, so the footer does
 *  not jump up the page and back down again. */
function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white" role="status" aria-live="polite">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-brand" />
      <span className="sr-only">Loading…</span>
    </div>
  )
}

/**
 * The five galleries differ only by intro copy and image set; their title,
 * heading and breadcrumbs live in `src/data/routes.ts`.
 *
 * The `intro` is not decoration. Without it each of these routes is a heading,
 * a project count and a grid of photographs — near-identical markup on five
 * URLs, which is how a set of pages gets folded together as duplicates and
 * dropped from the index. A paragraph that names the work and the district
 * gives each one something of its own to rank for.
 */
const GALLERIES = [
  {
    path: "/our-work/exterior",
    images: exteriorImgs,
    intro:
      "Front elevations, facade treatments, boundary walls and landscaping for independent houses, apartment blocks and commercial buildings across Medinipur, Kharagpur and Paschim Medinipur. Every elevation is drawn and approved before the first course goes up.",
  },
  {
    path: "/our-work/architecture",
    images: archImgs,
    intro:
      "Site-responsive planning, massing studies and sanction-ready working drawings prepared in-house. Our architects handle the municipal and panchayat filing across Paschim Medinipur, so approvals are part of the build rather than your problem.",
  },
  {
    path: "/our-work/3d-design",
    images: d3Imgs,
    intro:
      "3D front elevation and exterior visualisation, produced before construction starts so you approve the finished building rather than a floor plan. Material, colour and detail changes cost nothing at this stage and a great deal later.",
  },
  {
    path: "/our-work/renovation",
    images: renoImgs,
    intro:
      "Home renovation, structural retrofits, floor additions and full-property remodelling across Medinipur and the surrounding district — modernising ageing buildings without compromising the structure holding them up.",
  },
]

export default function App() {
  return (
    <>
      <PreLoader />
      {/* Every navigation starts at the top of the new page. */}
      <ScrollToTop />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/whats-included" element={<WhatsIncluded />} />
          <Route path="/our-work" element={<OurWork />} />
          <Route path="/our-work/interior" element={<Navigate to="/our-work/interior/residential" replace />} />
          <Route path="/our-work/interior/residential" element={<InteriorResidential />} />
          <Route path="/our-work/interior/commercial" element={<InteriorCommercial />} />

          {GALLERIES.map(({ path, images, intro }) => (
            <Route key={path} path={path} element={<GalleryPage route={path} images={images} intro={intro} />} />
          ))}

          <Route path="/our-work/testimonials" element={<TestimonialsPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/learn-from-us" element={<LearnFromUs />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      {/* Mounted outside <Routes> so they survive navigation and stay pinned
          to the viewport on every page. `null` fallback: there is nothing
          useful to show in the corner while these load. */}
      <Suspense fallback={null}>
        <ChatBot />
        <CookieBanner />
      </Suspense>
    </>
  )
}
