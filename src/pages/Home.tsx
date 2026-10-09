import Nav from "@/components/layout/Nav"
import SkipLink from "@/components/layout/SkipLink"
import Seo from "@/components/Seo"
import Footer from "@/components/layout/Footer"
import Hero from "@/components/home/Hero"
import AboutStrip from "@/components/home/AboutStrip"
import CoreServices from "@/components/home/CoreServices"
import FeaturedProjects from "@/components/home/FeaturedProjects"
import WhyChooseUs from "@/components/home/WhyChooseUs"
import ServiceAreas from "@/components/ui/ServiceAreas"
import Reveal from "@/components/ui/Reveal"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* The homepage carries the office, the service catalogue and the
          areas served; the organisation and website nodes ship on every page
          in the site-wide graph. See `src/data/routes.ts`. */}
      <Seo route="/" />
      {/* Home composes its own chrome rather than using PageWrapper, because
          the hero sits *under* a transparent header. That is why it also has
          to carry the skip link and the main landmark itself — without them
          this was the one route with neither, and it is the most visited. */}
      <SkipLink />
      <Nav />
      <main id="main">
        <Hero />
        <Reveal><AboutStrip /></Reveal>
        <Reveal><CoreServices /></Reveal>
        <Reveal><FeaturedProjects /></Reveal>
        <Reveal><WhyChooseUs /></Reveal>
        <Reveal><ServiceAreas /></Reveal>
      </main>
      <Footer
        cta={{
          title: "Let's build something amazing together.",
          subtitle: "Free site visit, itemised quote, and a completion date in writing.",
          buttonText: "Contact Us Today",
          buttonHref: "/contact",
        }}
      />
    </div>
  )
}
