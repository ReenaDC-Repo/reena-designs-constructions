import { useEffect, useRef } from "react"

/**
 * Hero artwork — one building, drawn twice.
 *
 * The same geometry is rendered as a finished solid and as a working drawing,
 * and a vertical build line wipes between them: everything behind the line is
 * built, everything ahead of it is still on paper. That is the whole idea of
 * the company in one image, so it is real geometry rather than a decorative
 * squiggle — every face, floor plate, mullion and dimension below is projected
 * from a single 3D model.
 *
 * ## Projection
 *
 * A 30° dimetric ("isometric") projection. The camera sits over +X/+Y looking
 * down, so for any box the visible faces are always the top, the X = x1 face
 * and the Y = y1 face — which is what lets `faces()` return three polygons
 * without a depth sort. Model units are metres; `U` is the pixels-per-metre
 * scale.
 *
 * ## The wipe
 *
 * Two clip rects sit back to back, one covering everything left of the origin
 * and one everything right of it, and both are translated by the same amount.
 * Moving them moves the seam without moving the artwork, so the building never
 * shifts — only the line between built and drawn does. The seam graphics carry
 * the same class, so they ride along with it.
 */

const COS30 = Math.cos(Math.PI / 6)
const U = 22 // px per metre
const OX = 560
const OY = 520

type V3 = [number, number, number]
type Box = { x0: number; y0: number; z0: number; x1: number; y1: number; z1: number }

/** Model metres → sheet coordinates. */
function project(x: number, y: number, z: number): [number, number] {
  return [OX + (x - y) * COS30 * U, OY + ((x + y) * 0.5 - z) * U]
}

const at = ([x, y, z]: V3) => {
  const [a, b] = project(x, y, z)
  return `${a.toFixed(1)},${b.toFixed(1)}`
}

const poly = (pts: V3[]) => pts.map(at).join(" ")

const seg = (a: V3, b: V3) => {
  const [x1, y1] = project(...a)
  const [x2, y2] = project(...b)
  return `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`
}

/**
 * The three faces of a box that face the camera.
 *
 * `top` is the roof, `east` the X = x1 wall and `south` the Y = y1 wall. The
 * other three are always hidden in this projection, which is why they are not
 * generated at all.
 */
function faces(b: Box) {
  return {
    top: [
      [b.x0, b.y0, b.z1],
      [b.x1, b.y0, b.z1],
      [b.x1, b.y1, b.z1],
      [b.x0, b.y1, b.z1],
    ] as V3[],
    east: [
      [b.x1, b.y0, b.z0],
      [b.x1, b.y1, b.z0],
      [b.x1, b.y1, b.z1],
      [b.x1, b.y0, b.z1],
    ] as V3[],
    south: [
      [b.x0, b.y1, b.z0],
      [b.x1, b.y1, b.z0],
      [b.x1, b.y1, b.z1],
      [b.x0, b.y1, b.z1],
    ] as V3[],
  }
}

/** Box corners, indexed 0–3 on the bottom and 4–7 on the top. */
function corners(b: Box): V3[] {
  return [
    [b.x0, b.y0, b.z0],
    [b.x1, b.y0, b.z0],
    [b.x1, b.y1, b.z0],
    [b.x0, b.y1, b.z0],
    [b.x0, b.y0, b.z1],
    [b.x1, b.y0, b.z1],
    [b.x1, b.y1, b.z1],
    [b.x0, b.y1, b.z1],
  ]
}

/** The nine edges the camera can see. */
const SEEN: [number, number][] = [
  [1, 2],
  [2, 3],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 4],
  [1, 5],
  [2, 6],
  [3, 7],
]

/** The three that run behind the mass — drafted dashed, as they would be. */
const HIDDEN: [number, number][] = [
  [0, 1],
  [0, 3],
  [0, 4],
]

const edgesOf = (b: Box, which: [number, number][]) => {
  const c = corners(b)
  return which.map(([i, j]) => seg(c[i], c[j])).join("")
}

// ── The model ────────────────────────────────────────────────────────
// A podium with a tower over it, a parapet, a lift overrun and a plant
// enclosure. Storey height 2m, so the roof slab lands at +14.00 over podium
// level and the overrun at +17.00.

const PODIUM: Box = { x0: 0, y0: 0, z0: 0, x1: 14, y1: 10, z1: 3 }
const TOWER: Box = { x0: 2, y0: 1, z0: 3, x1: 11, y1: 8, z1: 17 }
const PARAPET: Box = { x0: 1.8, y0: 0.8, z0: 17, x1: 11.2, y1: 8.2, z1: 17.7 }
const OVERRUN: Box = { x0: 7.6, y0: 4.6, z0: 17.7, x1: 10.4, y1: 7.4, z1: 20.2 }
const PLANT: Box = { x0: 3, y0: 2, z0: 17.7, x1: 5.6, y1: 4.2, z1: 19 }
const CANOPY: Box = { x0: 4.6, y0: 10, z0: 2.35, x1: 9, y1: 11.3, z1: 2.55 }

const GROUND: V3[] = [
  [-2.5, -2.5, 0],
  [16.5, -2.5, 0],
  [16.5, 12.5, 0],
  [-2.5, 12.5, 0],
]

/** Storey levels from podium roof to tower roof. */
const LEVELS = [3, 5, 7, 9, 11, 13, 15, 17]

/** Where the height dimension line stands, in plan. */
const DIM_X = 13.6
const DIM_Y = -1.4

/** Column grid, in metres from the podium's back corner. */
const GRID_X = [2, 5, 8, 11]
const GRID_Y = [1, 4.5, 8]

export default function HeroStructure() {
  const ref = useRef<SVGSVGElement>(null)

  /**
   * Dash geometry for the draw-on, measured rather than guessed.
   *
   * `.bp-draw` dashes each line to its own length so it appears to be drafted;
   * that only works if the length is the path's real one, so it is read off the
   * live DOM and written back as a custom property. Hard-coded arrays make
   * short lines snap and long ones crawl.
   */
  useEffect(() => {
    const svg = ref.current
    if (!svg) return
    const drawn = Array.from(svg.querySelectorAll<SVGGeometryElement>(".bp-draw"))
    drawn.forEach((el, i) => {
      let len = 900
      try {
        len = Math.max(el.getTotalLength(), 1)
      } catch {
        /* getTotalLength is unsupported for this shape — keep the fallback. */
      }
      el.style.setProperty("--dl", `${len.toFixed(1)}`)
      if (!el.style.getPropertyValue("--dd")) {
        el.style.setProperty("--dd", `${(i % 26) * 0.05}s`)
      }
    })
  }, [])

  const podium = faces(PODIUM)
  const tower = faces(TOWER)
  const parapet = faces(PARAPET)
  const overrun = faces(OVERRUN)
  const plant = faces(PLANT)
  const canopy = faces(CANOPY)

  /** Glazing bands: one ribbon per storey on each visible tower wall. */
  const glazing: { face: "east" | "south"; pts: V3[] }[] = []
  const mullions: string[] = []
  for (const z of LEVELS.slice(0, -1)) {
    const a = z + 0.45
    const b = z + 1.7
    glazing.push({
      face: "east",
      pts: [
        [TOWER.x1, TOWER.y0 + 0.3, a],
        [TOWER.x1, TOWER.y1 - 0.3, a],
        [TOWER.x1, TOWER.y1 - 0.3, b],
        [TOWER.x1, TOWER.y0 + 0.3, b],
      ],
    })
    glazing.push({
      face: "south",
      pts: [
        [TOWER.x0 + 0.3, TOWER.y1, a],
        [TOWER.x1 - 0.3, TOWER.y1, a],
        [TOWER.x1 - 0.3, TOWER.y1, b],
        [TOWER.x0 + 0.3, TOWER.y1, b],
      ],
    })
    for (let y = TOWER.y0 + 1.3; y < TOWER.y1 - 0.3; y += 1.3) {
      mullions.push(seg([TOWER.x1, y, a], [TOWER.x1, y, b]))
    }
    for (let x = TOWER.x0 + 1.3; x < TOWER.x1 - 0.3; x += 1.3) {
      mullions.push(seg([x, TOWER.y1, a], [x, TOWER.y1, b]))
    }
  }

  /** Floor plates, drawn on the drawing side as the slab edge at each level. */
  const plates = LEVELS.map((z) =>
    [
      seg([TOWER.x1, TOWER.y0, z], [TOWER.x1, TOWER.y1, z]),
      seg([TOWER.x0, TOWER.y1, z], [TOWER.x1, TOWER.y1, z]),
    ].join(""),
  )

  /** Columns carried down through the podium and on into the footings. */
  const columns = GRID_X.flatMap((x) =>
    GRID_Y.map((y) => seg([x, y, TOWER.z1], [x, y, -1.6])),
  )

  /** Pad footings under every column, as they would be shown below datum. */
  const footings = GRID_X.flatMap((x) =>
    GRID_Y.map((y) => {
      const pad: Box = { x0: x - 0.7, y0: y - 0.7, z0: -1.6, x1: x + 0.7, y1: y + 0.7, z1: -1.1 }
      return edgesOf(pad, SEEN)
    }),
  )

  return (
    <svg
      ref={ref}
      viewBox="0 0 1400 820"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full"
      aria-hidden="true"
    >
      <defs>
        {/* Two rects, back to back, translated together. Everything left of
            the seam is clipped to `hs-built`, everything right to `hs-paper`. */}
        <clipPath id="hs-built" clipPathUnits="userSpaceOnUse">
          <rect className="hs-wipe" x="-1400" y="-200" width="1400" height="1220" />
        </clipPath>
        <clipPath id="hs-paper" clipPathUnits="userSpaceOnUse">
          <rect className="hs-wipe" x="0" y="-200" width="1400" height="1220" />
        </clipPath>

        <pattern id="hs-mesh" width="46" height="46" patternUnits="userSpaceOnUse">
          <path d="M46 0H0v46" fill="none" stroke="var(--color-navy)" strokeWidth="0.5" opacity="0.07" />
        </pattern>

        <linearGradient id="hs-glass" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#93b4d8" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#6f93bd" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="hs-glass-s" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#c7dcf2" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#5d7ea6" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="hs-seam" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-brand)" stopOpacity="0" />
          <stop offset="50%" stopColor="var(--color-brand)" stopOpacity="0.16" />
          <stop offset="100%" stopColor="var(--color-brand)" stopOpacity="0" />
        </linearGradient>

        <filter id="hs-soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>

      {/* Drafting mesh across the whole sheet. */}
      <rect width="1400" height="820" fill="url(#hs-mesh)" />

      {/* ── Built half ───────────────────────────────────────────── */}
      <g clipPath="url(#hs-built)">
        {/* Contact shadow. Offset toward the camera, blurred, and kept weak —
            the ground is paper-white, not a studio floor. */}
        <polygon
          points={poly([
            [PODIUM.x0 + 1.6, PODIUM.y0 + 1.6, 0],
            [PODIUM.x1 + 3.2, PODIUM.y0 + 1.6, 0],
            [PODIUM.x1 + 3.2, PODIUM.y1 + 3.2, 0],
            [PODIUM.x0 + 1.6, PODIUM.y1 + 3.2, 0],
          ])}
          fill="var(--color-navy)"
          opacity="0.13"
          filter="url(#hs-soft)"
        />

        {/* Site slab */}
        <polygon points={poly(GROUND)} fill="#eef1f6" />
        <polygon points={poly(GROUND)} fill="none" stroke="var(--color-navy)" strokeWidth="0.8" opacity="0.16" />

        {/* Podium */}
        <polygon points={poly(podium.top)} fill="#dfe5ef" />
        <polygon points={poly(podium.east)} fill="#c3cddd" />
        <polygon points={poly(podium.south)} fill="#a9b6ca" />

        {/* Entrance void and canopy — the podium needs a way in or it reads as
            a plinth rather than a building. */}
        <polygon
          points={poly([
            [5, PODIUM.y1, 0],
            [8.6, PODIUM.y1, 0],
            [8.6, PODIUM.y1, 2.2],
            [5, PODIUM.y1, 2.2],
          ])}
          fill="#4a5a74"
        />
        <polygon points={poly(canopy.top)} fill="var(--color-brand)" opacity="0.9" />
        <polygon points={poly(canopy.south)} fill="#c94b00" />
        <polygon points={poly(canopy.east)} fill="#e05400" />

        {/* Tower */}
        <polygon points={poly(tower.east)} fill="#cfd8e6" />
        <polygon points={poly(tower.south)} fill="#b4c0d3" />

        {/* Glazing ribbons */}
        {glazing.map((g, i) => (
          <polygon
            key={i}
            points={poly(g.pts)}
            fill={g.face === "east" ? "url(#hs-glass)" : "url(#hs-glass-s)"}
          />
        ))}
        <g stroke="#eef3f9" strokeWidth="0.7" opacity="0.55">
          <path d={mullions.join("")} />
        </g>

        {/* Roof build-up */}
        <polygon points={poly(parapet.east)} fill="#c3cddd" />
        <polygon points={poly(parapet.south)} fill="#a9b6ca" />
        <polygon points={poly(parapet.top)} fill="#e4e9f1" />
        <polygon points={poly(overrun.east)} fill="#c8d2e0" />
        <polygon points={poly(overrun.south)} fill="#aeb9cd" />
        <polygon points={poly(overrun.top)} fill="#e8ecf3" />
        <polygon points={poly(plant.east)} fill="#cbd4e1" />
        <polygon points={poly(plant.south)} fill="#b0bbcd" />
        <polygon points={poly(plant.top)} fill="#e8ecf3" />

        {/* Every silhouette edge, so the solid reads crisply rather than as
            flat colour meeting flat colour. */}
        <g stroke="var(--color-navy)" strokeWidth="0.9" opacity="0.34" strokeLinejoin="round">
          <path d={edgesOf(PODIUM, SEEN)} />
          <path d={edgesOf(TOWER, SEEN)} />
          <path d={edgesOf(PARAPET, SEEN)} />
          <path d={edgesOf(OVERRUN, SEEN)} />
          <path d={edgesOf(PLANT, SEEN)} />
        </g>
      </g>

      {/* ── Drawn half ───────────────────────────────────────────── */}
      <g clipPath="url(#hs-paper)">
        <g
          stroke="var(--color-navy)"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        >
          {/* Site plan grid, in the ground plane. */}
          <g strokeWidth="0.6" opacity="0.2">
            {Array.from({ length: 11 }, (_, i) => -2.5 + i * 2).map((x) => (
              <path key={`gx${x}`} className="bp-draw" d={seg([x, -2.5, 0], [x, 12.5, 0])} />
            ))}
            {Array.from({ length: 9 }, (_, i) => -2.5 + i * 2).map((y) => (
              <path key={`gy${y}`} className="bp-draw" d={seg([-2.5, y, 0], [16.5, y, 0])} />
            ))}
          </g>

          {/* Site boundary. */}
          <g strokeWidth="1" opacity="0.45">
            <path
              className="bp-draw"
              d={GROUND.map((v, i) => seg(v, GROUND[(i + 1) % GROUND.length])).join("")}
            />
          </g>

          {/* Below datum: columns carried down to pad footings. */}
          <g strokeWidth="0.7" opacity="0.3" strokeDasharray="5 4">
            <path d={columns.join("")} />
          </g>
          <g strokeWidth="0.7" opacity="0.34">
            <path d={footings.join("")} />
          </g>

          {/* The mass, in line. */}
          <g strokeWidth="1.15" opacity="0.6">
            <path className="bp-draw" d={edgesOf(PODIUM, SEEN)} />
            <path className="bp-draw" d={edgesOf(TOWER, SEEN)} />
            <path className="bp-draw" d={edgesOf(PARAPET, SEEN)} />
            <path className="bp-draw" d={edgesOf(OVERRUN, SEEN)} />
            <path className="bp-draw" d={edgesOf(PLANT, SEEN)} />
          </g>

          {/* Edges running behind the mass. */}
          <g strokeWidth="0.7" opacity="0.28" strokeDasharray="6 5">
            <path d={edgesOf(PODIUM, HIDDEN)} />
            <path d={edgesOf(TOWER, HIDDEN)} />
          </g>

          {/* Floor plates and the glazing module, set out but not yet built. */}
          <g strokeWidth="0.75" opacity="0.4">
            <path className="bp-draw" d={plates.join("")} />
          </g>
          <g strokeWidth="0.5" opacity="0.24">
            <path d={mullions.join("")} />
          </g>

          {/* Overall dimension along the podium's south edge. */}
          <g strokeWidth="0.8" opacity="0.5">
            <path d={seg([PODIUM.x0, PODIUM.y1 + 3.4, 0], [PODIUM.x1, PODIUM.y1 + 3.4, 0])} />
            <path d={seg([PODIUM.x0, PODIUM.y1 + 2.9, 0], [PODIUM.x0, PODIUM.y1 + 3.9, 0])} />
            <path d={seg([PODIUM.x1, PODIUM.y1 + 2.9, 0], [PODIUM.x1, PODIUM.y1 + 3.9, 0])} />
          </g>

          {/* Height dimension, run up the right of the tower.
              It started on the left, which is the built half for most of the
              wipe's travel — a level ladder that is clipped away whenever the
              seam moves is not a dimension, it is a flicker. */}
          <g strokeWidth="0.8" opacity="0.5">
            <path d={seg([DIM_X, DIM_Y, 0], [DIM_X, DIM_Y, TOWER.z1])} />
            {[0, TOWER.z1].map((z) => (
              <path key={z} d={seg([DIM_X - 0.5, DIM_Y, z], [DIM_X + 0.5, DIM_Y, z])} />
            ))}
            {LEVELS.map((z) => (
              <path key={`t${z}`} d={seg([DIM_X - 0.25, DIM_Y, z], [DIM_X + 0.25, DIM_Y, z])} opacity="0.6" />
            ))}
            {/* Witness lines back to the slab edges they measure. */}
            {LEVELS.map((z) => (
              <path key={`w${z}`} d={seg([TOWER.x1, TOWER.y0, z], [DIM_X, DIM_Y, z])} strokeDasharray="3 4" opacity="0.3" />
            ))}
          </g>

          {/* Column grid bubbles, on their own extension lines. */}
          <g strokeWidth="0.6" opacity="0.4">
            {GRID_X.map((x) => (
              <path key={`bx${x}`} d={seg([x, TOWER.y1, 0], [x, PODIUM.y1 + 2.2, 0])} strokeDasharray="4 3" />
            ))}
          </g>
        </g>

        {/* Bubbles and annotation. Text fades rather than draws — a letterform
            drawn stroke-by-stroke reads as a glitch, not as drafting. */}
        <g fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" className="select-none">
          {GRID_X.map((x, i) => {
            const [cx, cy] = project(x, PODIUM.y1 + 2.6, 0)
            return (
              <g key={`bub${x}`} className="bp-fade" style={{ ["--dd" as string]: `${1 + i * 0.08}s`, ["--o" as string]: "0.55" }}>
                <circle cx={cx} cy={cy} r="9.5" fill="none" stroke="var(--color-navy)" strokeWidth="0.8" />
                <text
                  x={cx}
                  y={cy + 3.4}
                  textAnchor="middle"
                  fontSize="9.5"
                  fill="var(--color-navy)"
                  letterSpacing="0.5"
                >
                  {String.fromCharCode(65 + i)}
                </text>
              </g>
            )
          })}

          <g fill="var(--color-navy)" fontSize="10.5" letterSpacing="1.4" className="bp-fade" style={{ ["--dd" as string]: "1.35s", ["--o" as string]: "0.5" }}>
            <text x={project(7, PODIUM.y1 + 4.6, 0)[0]} y={project(7, PODIUM.y1 + 4.6, 0)[1]} textAnchor="middle">
              42.00 m
            </text>
          </g>

          <g fill="var(--color-navy)" fontSize="10" letterSpacing="1.2" className="bp-fade" style={{ ["--dd" as string]: "1.5s", ["--o" as string]: "0.48" }}>
            {LEVELS.map((z, i) => {
              const [tx, ty] = project(DIM_X, DIM_Y, z)
              return (
                <text key={`lv${z}`} x={tx + 10} y={ty + 3.2}>
                  {`+${(z - 3).toFixed(2)}`}
                  {i === LEVELS.length - 1 ? "  ROOF" : ""}
                </text>
              )
            })}
          </g>

          {/*
            Notes block, in sheet coordinates rather than model ones.

            It is drawing furniture, not part of the building, so it belongs to
            the page — and it has to live right of the seam's furthest travel
            (880) or the wipe would erase it half the time, which is exactly
            what the height ladder used to do from the other side. That leaves
            one clear strip: below the site plan, left of the copy column. The
            obvious spot beside the ladder is not available — it is already
            under the search field at every viewport this hero is used at.
          */}
          <g className="bp-fade" style={{ ["--dd" as string]: "1.7s", ["--o" as string]: "0.5" }}>
            <rect
              x="898"
              y="688"
              width="196"
              height="88"
              fill="none"
              stroke="var(--color-navy)"
              strokeWidth="0.8"
              opacity="0.35"
            />
            <path d="M898 710h196" stroke="var(--color-navy)" strokeWidth="0.8" opacity="0.35" />
            <text x="908" y="704" fill="var(--color-navy)" fontSize="9.5" letterSpacing="2.2">
              GENERAL NOTES
            </text>
            <g fill="var(--color-navy)" fontSize="10" letterSpacing="1.1">
              <text x="908" y="729">01 · RCC FRAME — M30</text>
              <text x="908" y="746">02 · Fe 550D REINFORCEMENT</text>
              <text x="908" y="763">03 · DGU 24mm GLAZING</text>
            </g>
          </g>
        </g>
      </g>

      {/* ── The build line ───────────────────────────────────────── */}
      <g className="hs-wipe">
        <rect x="-34" y="0" width="68" height="820" fill="url(#hs-seam)" />
        <path
          d="M0 90V742"
          stroke="var(--color-brand)"
          strokeWidth="1.3"
          strokeDasharray="9 7"
          opacity="0.62"
        />
        <path d="M-6 90h12M-6 742h12" stroke="var(--color-brand)" strokeWidth="1.6" opacity="0.7" />
        <g
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          fontSize="10"
          letterSpacing="2"
          fill="var(--color-brand)"
          opacity="0.72"
        >
          <text x="10" y="82">
            BUILD LINE
          </text>
        </g>
      </g>
    </svg>
  )
}
