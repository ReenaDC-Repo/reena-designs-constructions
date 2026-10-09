/**
 * The 19 delivery steps, written as stages of a building coming into being.
 *
 * Each entry drives one frame of the build simulator: `blurb` says what
 * physically happens on site, and `gain` is what the client actually walks away
 * with at that step — the reason the step is worth paying for.
 */

export type Stage = {
  n: number
  label: string
  phase: 1 | 2 | 3 | 4
  blurb: string
  gain: string
}

export const PHASE_META = [
  { n: 1, name: "Design & Approval", tag: "Phase 01", steps: "01–05" },
  { n: 2, name: "Sanction & Costing", tag: "Phase 02", steps: "06–10" },
  { n: 3, name: "Construction", tag: "Phase 03", steps: "11–15" },
  { n: 4, name: "Finish & Handover", tag: "Phase 04", steps: "16–19" },
] as const

export const STAGES: Stage[] = [
  { n: 1, label: "Consultation", phase: 1, blurb: "We sit down with your plot, your budget and how you actually want to live.", gain: "A clear brief — and an honest view of what your budget will build." },
  { n: 2, label: "Site Inspection", phase: 1, blurb: "Our engineers survey the land, levels, access and soil before promising anything.", gain: "No nasty surprises after the foundation is poured." },
  { n: 3, label: "Planning", phase: 1, blurb: "The plot is set out — setbacks, orientation, footprint and circulation.", gain: "Every square foot is accounted for before a rupee is spent." },
  { n: 4, label: "Architectural Design", phase: 1, blurb: "The building takes shape on paper: plans, sections and elevations.", gain: "You see your home before it exists." },
  { n: 5, label: "Structural Design", phase: 1, blurb: "Columns, beams and slabs are engineered and load calculations signed off.", gain: "A frame designed to stand, not merely to look right." },

  { n: 6, label: "3D Elevation", phase: 2, blurb: "The design is rendered in three dimensions, material by material.", gain: "You approve the finished look, not a guess." },
  { n: 7, label: "Govt Approval", phase: 2, blurb: "We prepare and file the sanction drawings with the municipality.", gain: "A legally sanctioned building — we queue, not you." },
  { n: 8, label: "Cost Estimation", phase: 2, blurb: "Every material grade and quantity is itemised into a fixed contract.", gain: "One number that does not move halfway through." },
  { n: 9, label: "Material Procurement", phase: 2, blurb: "ISI-grade cement, certified TMT steel, brick and sand arrive on site.", gain: "The grade you paid for is the grade that turns up." },
  { n: 10, label: "Foundation Work", phase: 2, blurb: "Excavation, footings and plinth — the part nobody sees and everything rests on.", gain: "Ground you can build twenty years of life on." },

  { n: 11, label: "Construction", phase: 3, blurb: "Columns rise, slabs are cast, walls close in. The building becomes real.", gain: "Weekly progress photographs, so you watch it happen." },
  { n: 12, label: "Electrical Installation", phase: 3, blurb: "Conduits, wiring and points are routed inside the walls to a drawn layout.", gain: "Switches where you need them, not where it was convenient." },
  { n: 13, label: "Plumbing Work", phase: 3, blurb: "Supply and drainage lines are laid, pressure-tested before anything is closed.", gain: "Leaks found now, not in your first monsoon." },
  { n: 14, label: "Flooring & Tiling", phase: 3, blurb: "Floors are levelled and laid, joints set out from the room centre.", gain: "Surfaces that line up wherever the eye lands." },
  { n: 15, label: "Painting & Finishing", phase: 3, blurb: "Putty, primer and finish coats; edges cut clean by hand.", gain: "The finish that decides whether it all looks expensive." },

  { n: 16, label: "Interior Design", phase: 4, blurb: "Joinery, lighting layers and material palette are installed to the 3D design.", gain: "Rooms detailed to the millimetre, not improvised." },
  { n: 17, label: "Furniture & Decor", phase: 4, blurb: "Loose furniture, soft goods and the last decorative layer go in.", gain: "A home you can move into, not a shell." },
  { n: 18, label: "Quality Inspection", phase: 4, blurb: "A full snag walk against the specification, with every defect logged and closed.", gain: "We find the faults before you do." },
  { n: 19, label: "Project Handover", phase: 4, blurb: "Keys, warranties and documents handed over — on the contracted date.", gain: "Your home. On time. As drawn." },
]
