/**
 * Skip to content.
 *
 * Off-screen until it takes focus, then it lands in the top-left corner above
 * the fixed header. `sr-only` alone is not enough — the link has to become
 * visible when focused, or a sighted keyboard user tabs onto something they
 * cannot see.
 *
 * `z-[70]` puts it over the header (z-50) and the assistant (z-[60]), both of
 * which are fixed and would otherwise paint on top of it.
 */
export default function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:bg-navy focus:px-4 focus:py-2.5 focus:text-sm focus:font-bold focus:text-white focus:outline-2 focus:outline-offset-2 focus:outline-brand"
    >
      Skip to content
    </a>
  )
}
