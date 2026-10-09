// The `xl:px-28` step is gone with the SideDock — that extra gutter existed
// only so the fixed rail on the left edge could not overlap page content.
// Content now uses the same rhythm at every breakpoint.
export const SITE_CONTAINER = "mx-auto w-full max-w-[1700px] px-8 sm:px-9 lg:px-14"

/** A leaf link in the Our Work dropdown. */
export type NavLeaf = { label: string; href: string }

/** A dropdown entry that opens a submenu of its own. */
export type NavChild = { label: string; children: readonly NavLeaf[] }

export type NavDropdownItem = NavLeaf | NavChild

export type NavLink = {
  label: string
  href: string
  dropdown?: readonly NavDropdownItem[]
}

/**
 * The navigation, in one place.
 *
 * Both the desktop dropdown and the mobile menu render from this array. They
 * used to be maintained separately, and the mobile copy fell four routes
 * behind — which meant a phone visitor could not reach the Architecture,
 * 3D Design, Before & After or Testimonials galleries at all.
 */
export const NAV_LINKS: readonly NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "What's Included", href: "/whats-included" },
  { label: "Learn with us", href: "/learn-from-us" },
  {
    label: "Our Work",
    href: "/our-work",
    dropdown: [
      {
        label: "Interior Design",
        children: [
          { label: "Residential Interior", href: "/our-work/interior/residential" },
          { label: "Commercial Interior", href: "/our-work/interior/commercial" },
        ],
      },
      { label: "Exterior Design", href: "/our-work/exterior" },
      { label: "Architecture Gallery", href: "/our-work/architecture" },
      { label: "3D Design & Elevation", href: "/our-work/3d-design" },
      { label: "Renovation Projects", href: "/our-work/renovation" },
      { label: "Client Testimonials", href: "/our-work/testimonials" },
    ],
  },
] as const
