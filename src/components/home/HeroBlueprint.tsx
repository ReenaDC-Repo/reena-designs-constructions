import { useEffect, useRef } from "react"

/**
 * Hero blueprint artwork.
 *
 * A wide site drawing that spans the whole hero rather than sitting in a panel
 * on the right: a tower block with footings and roof plant, a pitched-roof
 * house, a working tower crane, a truss bridge over water, a road in plan, a
 * magnified footing detail, contour lines, column grid bubbles, a scale bar,
 * compass and title block.
 *
 * Two animations run over it:
 *
 *  - **Draw-on.** Every line is dashed to its own measured length and starts
 *    fully offset, then draws in on a stagger, so the sheet appears to be
 *    drafted rather than simply appearing.
 *  - **Flow.** A bright segment then travels selected paths. Both effects need
 *    each path's true length, so the lengths are measured from the live DOM
 *    with `getTotalLength()` and written back as CSS custom properties. That is
 *    what keeps the pulse a constant speed and constant physical length on
 *    every line — hard-coded dash arrays make short lines strobe and long ones
 *    crawl.
 */

/** Warren truss web between two chords. */
function truss(x0: number, x1: number, top: number, bottom: number, panels: number) {
  const step = (x1 - x0) / panels
  const d: string[] = []
  for (let i = 0; i < panels; i++) {
    const a = x0 + i * step
    const b = a + step
    d.push(i % 2 === 0 ? `M${a} ${bottom}L${b} ${top}` : `M${a} ${top}L${b} ${bottom}`)
    if (i > 0) d.push(`M${a} ${top}L${a} ${bottom}`)
  }
  return d.join("")
}

/** Cross-bracing for a lattice mast or jib. */
function lattice(x0: number, x1: number, y0: number, y1: number, step: number) {
  const d: string[] = []
  for (let y = y0; y < y1; y += step) {
    d.push(`M${x0} ${y}L${x1} ${y + step}`, `M${x1} ${y}L${x0} ${y + step}`, `M${x0} ${y}L${x1} ${y}`)
  }
  return d.join("")
}

/** 45° hatch ticks along a horizontal line — the standard "earth" symbol. */
function hatch(x0: number, x1: number, y: number, step: number, len: number) {
  const d: string[] = []
  for (let x = x0; x <= x1; x += step) d.push(`M${x} ${y}l${-len} ${len}`)
  return d.join("")
}

const GROUND = 560

export default function HeroBlueprint() {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = ref.current
    if (!svg) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    // Measure every animated line so the dash maths is exact.
    const draws = Array.from(svg.querySelectorAll<SVGGeometryElement>(".bp-draw"))
    draws.forEach((el, i) => {
      let len = 1200
      try {
        len = Math.max(el.getTotalLength(), 1)
      } catch {
        /* getTotalLength is unsupported for this shape — keep the fallback. */
      }
      el.style.setProperty("--dl", `${len}`)
      // Stagger by the element's own order unless it carries an explicit delay.
      if (!el.style.getPropertyValue("--dd")) {
        el.style.setProperty("--dd", `${(i % 40) * 0.045}s`)
      }
    })

    // One pulse speed and one cycle length for the whole drawing.
    const SPEED = 300 // px per second
    const CYCLE = 5.5 // seconds

    const flows = Array.from(svg.querySelectorAll<SVGGeometryElement>(".bp-flow"))
    flows.forEach((el) => {
      let len = 900
      try {
        len = Math.max(el.getTotalLength(), 1)
      } catch {
        /* keep the fallback */
      }
      const seg = parseFloat(el.style.getPropertyValue("--seg")) || 90
      const travel = len + seg
      const active = travel / SPEED
      // Pad the gap with idle distance so a short line waits its turn instead
      // of flashing repeatedly while a long one is still mid-travel.
      const duration = Math.max(CYCLE, active)
      const idle = Math.max(0, duration * SPEED - travel)

      el.style.setProperty("--fl", `${len.toFixed(1)}`)
      el.style.setProperty("--gap", `${(travel + idle).toFixed(1)}`)
      el.style.setProperty("--end", `${(-(seg + idle)).toFixed(1)}`)
      el.style.setProperty("--fd", `${duration.toFixed(2)}s`)
    })

    if (reduced) {
      flows.forEach((el) => el.classList.add("bp-flow-live"))
      return
    }

    // Hold the flow back until the linework has finished drawing.
    const t = window.setTimeout(() => {
      flows.forEach((el) => el.classList.add("bp-flow-live"))
    }, 2200)
    return () => clearTimeout(t)
  }, [])

  return (
    <svg
      ref={ref}
      viewBox="0 0 1600 780"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <pattern id="hb-fine" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M10 0H0v10" fill="none" stroke="var(--color-navy)" strokeWidth="0.3" opacity="0.05" />
        </pattern>
        <pattern id="hb-grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M50 0H0v50" fill="none" stroke="var(--color-navy)" strokeWidth="0.5" opacity="0.09" />
        </pattern>
        <linearGradient id="hb-ink" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-navy)" stopOpacity="0.3" />
          <stop offset="30%" stopColor="var(--color-navy)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--color-navy)" stopOpacity="0.62" />
        </linearGradient>
        <marker id="hb-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0 0l7 3.5L0 7z" fill="var(--color-navy)" opacity="0.45" />
        </marker>
        <clipPath id="hb-detail-clip">
          <circle cx="1447" cy="286" r="76" />
        </clipPath>
      </defs>

      {/* Sheet */}
      <rect width="1600" height="780" fill="url(#hb-fine)" />
      <rect width="1600" height="780" fill="url(#hb-grid)" />

      <g stroke="url(#hb-ink)" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* ── Sheet border ──────────────────────────────────── */}
        <g strokeWidth="1" opacity="0.35">
          <path className="bp-draw" d="M28 28h1544v724H28z" style={{ ["--dd" as string]: "0s" }} />
          <path className="bp-draw" d="M28 70h24M28 710h24M1548 70h24M1548 710h24M70 28v24M70 728v24M1530 28v24M1530 728v24" style={{ ["--dd" as string]: "0.1s" }} />
        </g>

        {/* ── Contours (left, behind the headline) ──────────── */}
        <g strokeWidth="0.8" opacity="0.22">
          {[0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              className="bp-draw"
              d={`M60 ${300 + i * 34}q90 ${-40 - i * 6} 190 ${-6}t185 ${18 + i * 4}`}
              strokeDasharray="0"
              style={{ ["--dd" as string]: `${0.2 + i * 0.09}s` }}
            />
          ))}
        </g>

        {/* ── Compass ───────────────────────────────────────── */}
        <g strokeWidth="1" opacity="0.5">
          <circle className="bp-draw" cx="118" cy="132" r="26" style={{ ["--dd" as string]: "0.3s" }} />
          <circle className="bp-draw" cx="118" cy="132" r="18" strokeDasharray="3 4" style={{ ["--dd" as string]: "0.36s" }} />
          <path className="bp-draw" d="M118 110l9 26-9-7-9 7z" style={{ ["--dd" as string]: "0.42s" }} />
          <path className="bp-draw" d="M92 132h-8M144 132h8M118 158v8" style={{ ["--dd" as string]: "0.46s" }} />
        </g>
        <text className="bp-fade" x="118" y="102" fill="var(--color-navy)" fontSize="10" fontFamily="monospace" textAnchor="middle" style={{ ["--dd" as string]: "0.5s", ["--o" as string]: 0.6 }}>
          N
        </text>

        {/* ── Column grid bubbles ───────────────────────────── */}
        <g strokeWidth="0.9" opacity="0.5">
          {[
            [392, "A"],
            [478, "B"],
            [564, "C"],
            [650, "D"],
          ].map(([x, label], i) => (
            <g key={label as string}>
              <circle className="bp-draw" cx={x as number} cy="196" r="13" style={{ ["--dd" as string]: `${0.5 + i * 0.06}s` }} />
              <path className="bp-draw" d={`M${x} 209v${GROUND - 209}`} strokeDasharray="6 6" strokeWidth="0.6" opacity="0.5" style={{ ["--dd" as string]: `${0.56 + i * 0.06}s` }} />
              <text className="bp-fade" x={x as number} y="200" fill="var(--color-navy)" fontSize="10" fontFamily="monospace" textAnchor="middle" style={{ ["--dd" as string]: `${0.62 + i * 0.06}s`, ["--o" as string]: 0.65 }}>
                {label}
              </text>
            </g>
          ))}
        </g>

        {/* ── Tower block ───────────────────────────────────── */}
        <g strokeWidth="1.3">
          <path className="bp-draw" d={`M360 250h200v${GROUND - 250}h-200z`} style={{ ["--dd" as string]: "0.7s" }} />
          {[290, 330, 370, 410, 450, 490, 530].map((y, i) => (
            <path key={y} className="bp-draw" d={`M360 ${y}h200`} strokeWidth="0.85" opacity="0.7" style={{ ["--dd" as string]: `${0.86 + i * 0.045}s` }} />
          ))}
          {[266, 306, 346, 386, 426, 466, 506].map((y, r) =>
            [374, 424, 474, 524].map((x, c) => (
              <rect
                key={`${x}-${y}`}
                className="bp-draw"
                x={x}
                y={y}
                width="32"
                height="18"
                strokeWidth="0.55"
                opacity="0.45"
                style={{ ["--dd" as string]: `${1.05 + r * 0.03 + c * 0.015}s` }}
              />
            )),
          )}
          {/* Parapet, water tank and solar panels */}
          <path className="bp-draw" d="M348 250h224" strokeWidth="2" style={{ ["--dd" as string]: "0.78s" }} />
          <path className="bp-draw" d="M470 250v-30h46v30" strokeWidth="1.1" style={{ ["--dd" as string]: "1.2s" }} />
          <path className="bp-draw" d="M470 234h46" strokeWidth="0.7" opacity="0.6" style={{ ["--dd" as string]: "1.26s" }} />
          <path className="bp-draw" d="M382 250v-16l52-14v16z" strokeWidth="0.9" opacity="0.8" style={{ ["--dd" as string]: "1.32s" }} />
          <path className="bp-draw" d="M394 244l50-13M406 247l50-13" strokeWidth="0.45" opacity="0.5" style={{ ["--dd" as string]: "1.38s" }} />
        </g>

        {/* ── House ─────────────────────────────────────────── */}
        <g strokeWidth="1.3">
          <path className="bp-draw" d={`M612 400h172v${GROUND - 400}h-172z`} style={{ ["--dd" as string]: "0.95s" }} />
          <path className="bp-draw" d="M598 400l100-62 100 62" strokeWidth="1.7" style={{ ["--dd" as string]: "1.02s" }} />
          <path className="bp-draw" d="M698 338v-24M688 314h20" strokeWidth="0.9" style={{ ["--dd" as string]: "1.1s" }} />
          <path className="bp-draw" d="M756 356h18v30h-18z" strokeWidth="0.9" style={{ ["--dd" as string]: "1.14s" }} />
          <path className="bp-draw" d={hatch(624, 776, 392, 22, 12)} strokeWidth="0.45" opacity="0.4" style={{ ["--dd" as string]: "1.2s" }} />
          <rect className="bp-draw" x="632" y="422" width="44" height="32" strokeWidth="0.8" style={{ ["--dd" as string]: "1.24s" }} />
          <path className="bp-draw" d="M654 422v32M632 438h44" strokeWidth="0.45" opacity="0.55" style={{ ["--dd" as string]: "1.28s" }} />
          <rect className="bp-draw" x="712" y="422" width="44" height="32" strokeWidth="0.8" style={{ ["--dd" as string]: "1.32s" }} />
          <path className="bp-draw" d="M734 422v32M712 438h44" strokeWidth="0.45" opacity="0.55" style={{ ["--dd" as string]: "1.36s" }} />
          <path className="bp-draw" d={`M674 494h42v${GROUND - 494}h-42z`} strokeWidth="1" style={{ ["--dd" as string]: "1.4s" }} />
          {/* Stair to entrance */}
          <path className="bp-draw" d="M660 560v-8h14v-8h14v-8h14" strokeWidth="0.7" opacity="0.65" style={{ ["--dd" as string]: "1.44s" }} />
        </g>

        {/* ── Landscape ─────────────────────────────────────── */}
        <g strokeWidth="0.9" opacity="0.45">
          {[840, 878].map((x, i) => (
            <g key={x}>
              <circle className="bp-draw" cx={x} cy="512" r="18" strokeDasharray="4 4" style={{ ["--dd" as string]: `${1.5 + i * 0.08}s` }} />
              <path className="bp-draw" d={`M${x} 530v30`} style={{ ["--dd" as string]: `${1.56 + i * 0.08}s` }} />
            </g>
          ))}
        </g>

        {/* ── Tower crane ───────────────────────────────────── */}
        <g strokeWidth="1.2">
          <path className="bp-draw" d="M952 176v384M986 176v384" strokeWidth="1.4" style={{ ["--dd" as string]: "0.6s" }} />
          <path className="bp-draw" d={lattice(952, 986, 176, 552, 32)} strokeWidth="0.55" opacity="0.7" style={{ ["--dd" as string]: "0.75s" }} />
          <path className="bp-draw" d="M930 560h78M938 560l10-18h44l10 18" strokeWidth="1.2" style={{ ["--dd" as string]: "0.9s" }} />
          <rect className="bp-draw" x="944" y="146" width="50" height="30" strokeWidth="1.2" style={{ ["--dd" as string]: "0.66s" }} />
          <path className="bp-draw" d="M969 146v-32" strokeWidth="1.2" style={{ ["--dd" as string]: "0.7s" }} />
          {/* Jib */}
          <path className="bp-draw" d="M700 112h620M700 132h620" strokeWidth="1.2" style={{ ["--dd" as string]: "0.5s" }} />
          <path
            className="bp-draw"
            d={Array.from({ length: 31 }, (_, i) => {
              const a = 700 + i * 20
              return i % 2 === 0 ? `M${a} 132L${a + 20} 112` : `M${a} 112L${a + 20} 132`
            }).join("")}
            strokeWidth="0.5"
            opacity="0.7"
            style={{ ["--dd" as string]: "0.62s" }}
          />
          <path className="bp-draw" d="M969 114L742 112M969 114L1256 112" strokeWidth="0.75" opacity="0.8" style={{ ["--dd" as string]: "0.8s" }} />
          <rect className="bp-draw" x="706" y="132" width="36" height="26" strokeWidth="1.1" style={{ ["--dd" as string]: "0.86s" }} />
          {/* Trolley, rope, hook, slung beam */}
          <rect className="bp-draw" x="1148" y="130" width="18" height="8" strokeWidth="1" style={{ ["--dd" as string]: "1.0s" }} />
          <path className="bp-draw" d="M1157 138v122" strokeDasharray="4 4" strokeWidth="0.8" style={{ ["--dd" as string]: "1.06s" }} />
          <path className="bp-draw" d="M1157 260a6 6 0 1 0 6 6" strokeWidth="1.2" style={{ ["--dd" as string]: "1.14s" }} />
          <path className="bp-draw" d="M1157 260L1100 292M1157 260L1214 292" strokeWidth="0.75" style={{ ["--dd" as string]: "1.2s" }} />
          <rect className="bp-draw" x="1084" y="292" width="146" height="15" strokeWidth="1.2" style={{ ["--dd" as string]: "1.26s" }} />
          <path className="bp-draw" d="M1084 299.5h146" strokeDasharray="3 3" strokeWidth="0.5" opacity="0.7" style={{ ["--dd" as string]: "1.32s" }} />
        </g>

        {/* ── Truss bridge ──────────────────────────────────── */}
        <g strokeWidth="1.3">
          <path className="bp-draw" d="M980 380h420" strokeWidth="1.3" style={{ ["--dd" as string]: "1.1s" }} />
          <path className="bp-draw" d="M980 460h420" strokeWidth="1.9" style={{ ["--dd" as string]: "1.16s" }} />
          <path className="bp-draw" d="M974 472h432" strokeWidth="0.85" opacity="0.7" style={{ ["--dd" as string]: "1.22s" }} />
          <path className="bp-draw" d="M980 380v80M1400 380v80" strokeWidth="1.4" style={{ ["--dd" as string]: "1.28s" }} />
          <path className="bp-draw" d={truss(980, 1400, 380, 460, 12)} strokeWidth="0.7" opacity="0.75" style={{ ["--dd" as string]: "1.34s" }} />
          {/* Piers */}
          <path className="bp-draw" d={`M1030 472v${GROUND - 472}M1070 472v${GROUND - 472}M1030 ${GROUND}h40M1034 472l-4 88M1066 472l4 88`} strokeWidth="1.05" style={{ ["--dd" as string]: "1.42s" }} />
          <path className="bp-draw" d={`M1320 472v${GROUND - 472}M1360 472v${GROUND - 472}M1320 ${GROUND}h40M1324 472l-4 88M1356 472l4 88`} strokeWidth="1.05" style={{ ["--dd" as string]: "1.48s" }} />
          {/* Water */}
          <path className="bp-draw" d="M1100 516q18-6 36 0t36 0 36 0 36 0 36 0" strokeWidth="0.6" opacity="0.3" style={{ ["--dd" as string]: "1.54s" }} />
          <path className="bp-draw" d="M1112 532q18-6 36 0t36 0 36 0 36 0 36 0" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.22" style={{ ["--dd" as string]: "1.6s" }} />
        </g>

        {/* ── Ground line + footings ────────────────────────── */}
        <g>
          <path className="bp-draw" d={`M40 ${GROUND}h1520`} strokeWidth="2" style={{ ["--dd" as string]: "0.4s" }} />
          <path className="bp-draw" d={hatch(52, 1552, GROUND, 24, 11)} strokeWidth="0.6" opacity="0.4" style={{ ["--dd" as string]: "0.55s" }} />
          {/* Pad footings under the tower and house */}
          {[380, 470, 550, 640, 760].map((x, i) => (
            <path
              key={x}
              className="bp-draw"
              d={`M${x - 20} ${GROUND}v22h40v-22`}
              strokeWidth="0.85"
              strokeDasharray="5 4"
              opacity="0.5"
              style={{ ["--dd" as string]: `${1.6 + i * 0.05}s` }}
            />
          ))}
        </g>

        {/* ── Road in plan ──────────────────────────────────── */}
        <g>
          <path className="bp-draw" d="M40 604h1090M40 686h1090" strokeWidth="1.4" style={{ ["--dd" as string]: "0.45s" }} />
          <path className="bp-draw" d="M40 612h1090M40 678h1090" strokeWidth="0.55" opacity="0.45" style={{ ["--dd" as string]: "0.6s" }} />
          <path className="bp-draw" d="M40 645h1090" strokeWidth="0.75" strokeDasharray="20 16" opacity="0.5" style={{ ["--dd" as string]: "0.7s" }} />
          <path
            className="bp-draw"
            d={Array.from({ length: 36 }, (_, i) => `M${58 + i * 30} 604v-7M${58 + i * 30} 686v7`).join("")}
            strokeWidth="0.55"
            opacity="0.35"
            style={{ ["--dd" as string]: "0.8s" }}
          />
          {/* Vehicles */}
          <g strokeWidth="0.85" opacity="0.55">
            <rect className="bp-draw" x="228" y="618" width="54" height="19" rx="3" style={{ ["--dd" as string]: "1.6s" }} />
            <path className="bp-draw" d="M243 618v19M267 618v19" strokeWidth="0.45" style={{ ["--dd" as string]: "1.66s" }} />
            <rect className="bp-draw" x="640" y="653" width="62" height="20" rx="3" style={{ ["--dd" as string]: "1.72s" }} />
            <path className="bp-draw" d="M657 653v20M685 653v20" strokeWidth="0.45" style={{ ["--dd" as string]: "1.78s" }} />
          </g>
          <path className="bp-draw" d="M104 604v82" strokeWidth="0.75" markerEnd="url(#hb-arrow)" markerStart="url(#hb-arrow)" opacity="0.7" style={{ ["--dd" as string]: "1.84s" }} />
        </g>

        {/* ── Magnified footing detail ──────────────────────── */}
        <g>
          <circle className="bp-draw" cx="1447" cy="286" r="76" strokeWidth="1.1" opacity="0.6" style={{ ["--dd" as string]: "1.7s" }} />
          <path className="bp-draw" d="M1385 240L1240 300" strokeWidth="0.7" strokeDasharray="5 4" opacity="0.45" style={{ ["--dd" as string]: "1.76s" }} />
          <g clipPath="url(#hb-detail-clip)" strokeWidth="0.9" opacity="0.75">
            <path className="bp-draw" d="M1412 250h70v34h22v42h-114v-42h22z" style={{ ["--dd" as string]: "1.82s" }} />
            <path className="bp-draw" d={hatch(1382, 1512, 326, 14, 9)} strokeWidth="0.45" opacity="0.5" style={{ ["--dd" as string]: "1.9s" }} />
            <path className="bp-draw" d="M1424 250v76M1470 250v76" strokeWidth="0.4" strokeDasharray="3 3" opacity="0.6" style={{ ["--dd" as string]: "1.96s" }} />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <circle key={i} className="bp-draw" cx={1394 + i * 20} cy="300" r="2.6" strokeWidth="0.7" style={{ ["--dd" as string]: `${2 + i * 0.03}s` }} />
            ))}
          </g>
        </g>

        {/* ── Dimensions ────────────────────────────────────── */}
        <g strokeWidth="0.8" opacity="0.8">
          <path className="bp-draw" d="M322 250v310M316 250h12M316 560h12" style={{ ["--dd" as string]: "1.5s" }} />
          <path className="bp-draw" d="M360 224h200M360 218v12M560 218v12" style={{ ["--dd" as string]: "1.56s" }} />
          <path className="bp-draw" d="M980 344h420M980 338v12M1400 338v12" style={{ ["--dd" as string]: "1.62s" }} />
          <path className="bp-draw" d="M1406 380h34M1406 460h34" strokeDasharray="3 3" opacity="0.6" style={{ ["--dd" as string]: "1.68s" }} />
        </g>

        {/* ── Section mark ──────────────────────────────────── */}
        <g strokeWidth="0.95" opacity="0.55">
          <circle className="bp-draw" cx="880" cy="645" r="13" style={{ ["--dd" as string]: "1.9s" }} />
          <path className="bp-draw" d="M880 632v-16M880 658v16" strokeDasharray="4 3" style={{ ["--dd" as string]: "1.94s" }} />
        </g>

        {/* ── Scale bar ─────────────────────────────────────── */}
        <g strokeWidth="0.9" opacity="0.6">
          <path className="bp-draw" d="M1160 726h160v10h-160z" style={{ ["--dd" as string]: "2s" }} />
          <path className="bp-draw" d="M1200 726v10M1240 726v10M1280 726v10" style={{ ["--dd" as string]: "2.04s" }} />
        </g>

        {/* ── Title block ───────────────────────────────────── */}
        <g strokeWidth="1" opacity="0.7">
          <path className="bp-draw" d="M1160 604h400v98h-400z" style={{ ["--dd" as string]: "2.05s" }} />
          <path className="bp-draw" d="M1160 646h400M1400 604v98" style={{ ["--dd" as string]: "2.1s" }} />
        </g>
      </g>

      {/* ── Text annotations ────────────────────────────────── */}
      <g fontFamily="monospace">
        <text className="bp-fade" x="308" y="405" fill="var(--color-brand)" fontSize="12" fontWeight="bold" textAnchor="middle" transform="rotate(-90 308 405)" style={{ ["--dd" as string]: "1.9s", ["--o" as string]: 0.92 }}>
          18.40 m
        </text>
        <text className="bp-fade" x="460" y="218" fill="var(--color-navy)" fontSize="10" textAnchor="middle" style={{ ["--dd" as string]: "1.95s", ["--o" as string]: 0.6 }}>
          12.00
        </text>
        <text className="bp-fade" x="1190" y="338" fill="var(--color-brand)" fontSize="12" fontWeight="bold" textAnchor="middle" style={{ ["--dd" as string]: "2s", ["--o" as string]: 0.92 }}>
          SPAN L = 47.00 m
        </text>
        <text className="bp-fade" x="1448" y="376" fill="var(--color-navy)" fontSize="9" textAnchor="middle" style={{ ["--dd" as string]: "2.15s", ["--o" as string]: 0.6 }}>
          DETAIL 1 — PAD FOOTING (1:20)
        </text>
        <text className="bp-fade" x="1450" y="374" fill="none" fontSize="9" style={{ ["--o" as string]: 0 }} />
        <text className="bp-fade" x="96" y="645" fill="var(--color-brand)" fontSize="10" fontWeight="bold" textAnchor="middle" transform="rotate(-90 96 645)" style={{ ["--dd" as string]: "2.05s", ["--o" as string]: 0.9 }}>
          7.50 m
        </text>
        <text className="bp-fade" x="880" y="649" fill="var(--color-navy)" fontSize="10" textAnchor="middle" style={{ ["--dd" as string]: "2.1s", ["--o" as string]: 0.7 }}>
          A
        </text>
        <text className="bp-fade" x="1446" y="386" fill="none" fontSize="1" style={{ ["--o" as string]: 0 }} />
        <text className="bp-fade" x="1160" y="720" fill="var(--color-navy)" fontSize="8" style={{ ["--dd" as string]: "2.2s", ["--o" as string]: 0.5 }}>
          0
        </text>
        <text className="bp-fade" x="1316" y="720" fill="var(--color-navy)" fontSize="8" style={{ ["--dd" as string]: "2.2s", ["--o" as string]: 0.5 }}>
          20 m
        </text>
        <text className="bp-fade" x="1174" y="630" fill="var(--color-navy)" fontSize="10.5" style={{ ["--dd" as string]: "2.25s", ["--o" as string]: 0.78 }}>
          REENA DESIGNS &amp; CONSTRUCTIONS
        </text>
        <text className="bp-fade" x="1174" y="676" fill="var(--color-navy)" fontSize="9" style={{ ["--dd" as string]: "2.3s", ["--o" as string]: 0.5 }}>
          SITE PLAN / ELEVATION
        </text>
        <text className="bp-fade" x="1414" y="630" fill="var(--color-brand)" fontSize="9.5" fontWeight="bold" style={{ ["--dd" as string]: "2.3s", ["--o" as string]: 0.85 }}>
          SCALE 1:100
        </text>
        <text className="bp-fade" x="1414" y="676" fill="var(--color-navy)" fontSize="9" style={{ ["--dd" as string]: "2.35s", ["--o" as string]: 0.5 }}>
          DWG-01 / REV C
        </text>
        <text className="bp-fade" x="1470" y="500" fill="var(--color-navy)" fontSize="9" textAnchor="end" style={{ ["--dd" as string]: "2.35s", ["--o" as string]: 0.45 }}>
          MEDINIPUR · PASCHIM MEDINIPUR
        </text>
      </g>

      {/* ── Flow overlays ───────────────────────────────────── */}
      <g fill="none" strokeLinecap="round" stroke="var(--color-brand)">
        <path className="bp-flow" d="M40 645h1090" strokeWidth="2.6" style={{ ["--dd" as string]: "0s", ["--seg" as string]: "150" }} />
        <path className="bp-flow" d={`M40 ${GROUND}h1520`} strokeWidth="2.1" style={{ ["--dd" as string]: "0.6s", ["--seg" as string]: "160" }} />
        <path className="bp-flow" d="M700 122h620" strokeWidth="2.2" style={{ ["--dd" as string]: "0.3s", ["--seg" as string]: "110" }} />
        <path className="bp-flow" d="M969 176v384" strokeWidth="1.8" style={{ ["--dd" as string]: "1.1s", ["--seg" as string]: "80" }} />
        <path className="bp-flow" d="M1157 138v122" strokeWidth="1.7" style={{ ["--dd" as string]: "1.7s", ["--seg" as string]: "50" }} />
        <path className="bp-flow" d="M974 460h432" strokeWidth="2.4" style={{ ["--dd" as string]: "0.9s", ["--seg" as string]: "110" }} />
        <path className="bp-flow" d="M1400 380H980" strokeWidth="1.8" style={{ ["--dd" as string]: "1.9s", ["--seg" as string]: "90" }} />
        <path className="bp-flow" d="M348 250h224" strokeWidth="2" style={{ ["--dd" as string]: "1.3s", ["--seg" as string]: "70" }} />
        <path className="bp-flow" d="M360 560V250" strokeWidth="1.8" style={{ ["--dd" as string]: "1.5s", ["--seg" as string]: "80" }} />
        <path className="bp-flow" d="M598 400l100-62 100 62" strokeWidth="1.9" style={{ ["--dd" as string]: "1.05s", ["--seg" as string]: "60" }} />
      </g>

      {/* ── Joint nodes ─────────────────────────────────────── */}
      <g>
        {[
          [360, 250],
          [560, 250],
          [698, 338],
          [969, 114],
          [1157, 260],
          [980, 380],
          [1400, 380],
          [980, 460],
          [1400, 460],
          [969, 560],
          [1447, 286],
        ].map(([cx, cy], i) => (
          <circle
            key={`${cx}-${cy}`}
            className="bp-node"
            cx={cx}
            cy={cy}
            r="3.6"
            fill="#ffffff"
            stroke="var(--color-brand)"
            strokeWidth="1.5"
            style={{ ["--dd" as string]: `${1.9 + i * 0.09}s` }}
          />
        ))}
      </g>
    </svg>
  )
}
