/**
 * Client testimonials, in one place.
 *
 * These lived in two files with two different sets of words. Rajesh Mehta,
 * Priya Dutta and Amit Banerjee each appeared on the homepage carousel *and*
 * on /our-work/testimonials — with different job titles and completely
 * different quotes. Priya Dutta was "Director, Dutta & Associates" on one page
 * and "Business Owner" on the other; Amit Banerjee was a "Property Owner" and
 * a "Property Developer". A visitor who read the homepage and then followed
 * the link saw the same three people testify twice, differently, which is the
 * kind of detail that costs a contractor the enquiry.
 *
 * The homepage's versions won: they name the project, the town and a specific
 * outcome, where the testimonials page's were interchangeable praise.
 *
 * Same reasoning as `siteInfo.ts` — one copy, so the two surfaces cannot drift
 * apart again.
 *
 * NOTE FOR THE OWNER: these are marketing copy, not collected reviews. Before
 * adding `aggregateRating` or `review` structured data to the site, they need
 * to be genuine reviews gathered from real customers — Google's policy
 * requires it, and marking up invented ones risks a manual action against the
 * whole domain. See the note in index.html.
 */

export type Testimonial = {
  name: string
  /** Job title or relationship — "Homeowner", "Director, Dutta & Associates". */
  role: string
  /** The town the work was done in. */
  place: string
  /** What was built, in a few words. Shown alongside the role. */
  project: string
  rating: number
  quote: string
}

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    name: "Rajesh Mehta",
    role: "Homeowner",
    place: "Medinipur",
    project: "3,200 sq ft residence",
    rating: 5,
    quote:
      "Reena Designs & Constructions handed over our home eleven days ahead of the contracted date, and the finish matched the 3D elevation almost exactly. Costing stayed where it started — no revised estimates halfway through.",
  },
  {
    name: "Priya Dutta",
    role: "Director, Dutta & Associates",
    place: "Kharagpur",
    project: "Office fit-out",
    rating: 5,
    quote:
      "They ran our office renovation around a live workday without losing a single hour of business. The site engineer sent progress photographs every evening. That level of communication is rare in this trade.",
  },
  {
    name: "Amit Banerjee",
    role: "Property Owner",
    place: "Ghatal",
    project: "Structural renovation",
    rating: 5,
    quote:
      "I had three quotes. Reena's was not the cheapest, but it was the only one that itemised every material grade. Eighteen months on, not one snag has resurfaced. Worth every rupee.",
  },
  {
    name: "Sunita Ghosh",
    role: "Homeowner",
    place: "Medinipur",
    project: "Full interior fit-out",
    rating: 5,
    quote:
      "The interior design team understood our brief perfectly. Our home looks exactly like we envisioned — beautiful and functional.",
  },
  {
    name: "Vikram Sharma",
    role: "Corporate Client",
    place: "Kharagpur",
    project: "Three commercial projects",
    rating: 5,
    quote:
      "We have partnered with Reena on three commercial projects. Each time delivered with zero structural issues and on schedule.",
  },
  {
    name: "Anita Roy",
    role: "Homeowner",
    place: "Belda",
    project: "Heritage renovation",
    rating: 5,
    quote:
      "The renovation of our 20-year-old home was done with great care. They preserved the heritage elements while modernising the interiors.",
  },
] as const

/** The three the homepage carousel shows. */
export const FEATURED_TESTIMONIALS = TESTIMONIALS.slice(0, 3)
