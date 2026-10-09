import { useState, useRef, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import v4Logo from "@/imports/V4.png"
import { NAV_LINKS, SITE_CONTAINER, type NavChild, type NavDropdownItem } from "./constants"

function hasChildren(item: NavDropdownItem): item is NavChild {
  return "children" in item && Array.isArray(item.children)
}

function DropdownMenu({ items }: { items: readonly NavDropdownItem[] }) {
  return (
    <div className="absolute top-full left-0 z-50 min-w-56 pt-2">
      <div className="border-[1.5px] border-hairline bg-white py-2 shadow-2xl">
        {items.map((item) =>
          hasChildren(item) ? (
            <div key={item.label} className="group/sub relative">
              <Link
                to={item.children[0].href}
                className="font-600 flex items-center justify-between px-4 py-2.5 text-sm text-navy transition-colors hover:bg-orange-50"
              >
                {item.label}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M4 2l4 4-4 4" stroke="#999" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </Link>
              {/* `focus-within` matters as much as `hover` here — without it the
                  submenu could only ever be opened with a mouse. */}
              <div className="absolute left-full top-0 hidden min-w-48 border-[1.5px] border-hairline bg-white py-2 shadow-xl group-hover/sub:block group-focus-within/sub:block">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    to={child.href}
                    className="block px-4 py-2.5 text-sm text-slate-600 transition-colors hover:bg-orange-50"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Link
              key={item.href}
              to={item.href}
              className="block px-4 py-2.5 text-sm text-slate-600 transition-colors hover:bg-orange-50"
            >
              {item.label}
            </Link>
          ),
        )}
      </div>
    </div>
  )
}

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const [openMobileGroup, setOpenMobileGroup] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const dropWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMenuOpen(false)
    setDropOpen(false)
    setOpenMobileGroup(null)
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Escape closes the dropdown, and a click outside dismisses it — a
  // hover-only menu strands keyboard users with no way back out.
  useEffect(() => {
    if (!dropOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDropOpen(false)
    }
    const onPointerDown = (e: PointerEvent) => {
      if (!dropWrapRef.current?.contains(e.target as Node)) setDropOpen(false)
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onPointerDown)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("pointerdown", onPointerDown)
    }
  }, [dropOpen])

  const isHomePage = location.pathname === "/"
  const hasBg = scrolled || !isHomePage

  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href)

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        hasBg ? "bg-white/95 shadow-[0_8px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className={`${SITE_CONTAINER} flex items-center justify-between py-1.5`}>
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5" aria-label="Reena Designs & Constructions — home">
          <img
            src={v4Logo}
            alt=""
            width={58}
            height={58}
            className="h-[58px] w-[58px] object-contain"
          />
          <div>
            <div className={`allura text-[28px] leading-none ${hasBg ? "text-brand-ink" : "text-brand"}`}>Reena</div>
            <div
              /* Theme orange. On the white scrolled bar it uses brand-ink, the
                 darker orange the site uses for small text on light grounds —
                 #FF5E00 at 9px on white is too faint to read. */
              className={`poppins text-[9px] leading-tight font-medium tracking-[0.14em] ${hasBg ? "text-brand-ink" : "text-brand"}`}
            >
              DESIGNS &amp; CONSTRUCTIONS
            </div>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) =>
            link.dropdown ? (
              <div
                key={link.label}
                ref={dropWrapRef}
                className="relative"
                onMouseEnter={() => setDropOpen(true)}
                onMouseLeave={() => setDropOpen(false)}
                onFocus={() => setDropOpen(true)}
              >
                <Link
                  to={link.href}
                  aria-haspopup="true"
                  aria-expanded={dropOpen}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  onClick={() => setDropOpen(false)}
                  className={`font-500 relative flex items-center gap-1 pb-0.5 text-sm transition-colors ${
                    isActive(link.href) ? "text-brand-ink" : hasBg ? "text-slate-800" : "text-white"
                  }`}
                >
                  {link.label}
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                    className={`transition-transform duration-200 ${dropOpen ? "rotate-180" : ""}`}
                  >
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  {isActive(link.href) && (
                    <span className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-brand" />
                  )}
                </Link>
                {dropOpen && <DropdownMenu items={link.dropdown} />}
              </div>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`font-500 relative pb-0.5 text-sm transition-colors ${
                  isActive(link.href) ? "text-brand-ink" : hasBg ? "text-slate-800" : "text-white"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-brand" />
                )}
              </Link>
            ),
          )}
        </div>

        {/* CTA */}
        <Link
          to="/contact"
          className="btn-orange montserrat font-700 hidden items-center gap-2 px-5 py-2.5 text-sm md:flex"
        >
          Contact Us
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M2.5 5.5A1.5 1.5 0 013.8 4h.7c.5 0 1 .65.8 1.1L4.5 7a1.5 1.5 0 00.35 1.6l.6.6a7 7 0 002.35 1.65l.6.6A1.5 1.5 0 009.9 10.5l1.9-.8c.45-.2 1.1.3 1.1.8v.7A1.5 1.5 0 0111.5 12.6C5.6 12.1 2 6.8 2.5 5.5z"
              fill="currentColor"
            />
          </svg>
        </Link>

        {/* Burger */}
        <button
          type="button"
          className={`p-2 md:hidden ${hasBg ? "text-navy" : "text-white"}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            {menuOpen ? (
              <path d="M3 3l16 16M19 3L3 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu — driven by NAV_LINKS rather than a hand-written copy.
          The previous hardcoded list had drifted: Architecture Gallery, 3D
          Design, Before & After and Client Testimonials all existed as routes
          and in the desktop dropdown, but were unreachable on a phone. */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="flex flex-col gap-1 border-t border-slate-200 bg-white/97 px-6 py-4 md:hidden"
        >
          {NAV_LINKS.map((link) =>
            link.dropdown ? (
              <div key={link.label}>
                <button
                  type="button"
                  onClick={() => setOpenMobileGroup((g) => (g === link.label ? null : link.label))}
                  aria-expanded={openMobileGroup === link.label}
                  className="font-500 flex w-full items-center justify-between py-2 text-sm text-slate-700"
                >
                  {link.label}
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                    className={`transition-transform ${openMobileGroup === link.label ? "rotate-180" : ""}`}
                  >
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
                {openMobileGroup === link.label && (
                  <div className="flex flex-col gap-1 border-l-2 border-brand pl-4">
                    <Link to={link.href} className="py-1.5 text-sm text-slate-500">
                      Overview
                    </Link>
                    {link.dropdown.flatMap((item) =>
                      hasChildren(item)
                        ? item.children.map((child) => (
                            <Link key={child.href} to={child.href} className="py-1.5 text-sm text-slate-500">
                              {child.label}
                            </Link>
                          ))
                        : [
                            <Link key={item.href} to={item.href} className="py-1.5 text-sm text-slate-500">
                              {item.label}
                            </Link>,
                          ],
                    )}
                  </div>
                )}
              </div>
            ) : (
              <Link key={link.href} to={link.href} className="font-500 py-2 text-sm text-slate-700">
                {link.label}
              </Link>
            ),
          )}
          <Link to="/contact" className="btn-orange montserrat font-700 mt-2 px-5 py-2.5 text-center text-sm">
            Contact Us
          </Link>
        </div>
      )}
    </nav>
  )
}
