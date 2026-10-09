import type { ReactNode } from "react"

/**
 * Modern Architectural Elevation Drawing.
 * Renders the 19 stages of construction as an executive architectural CAD draft:
 * from raw survey, setbacks and blueprint lines to reinforced concrete frame,
 * MEP threading, modern timber-and-glass facade, and final illuminated handover.
 */

const GROUND = 392

/** Shows its children only while `step` is within [from, until]. */
function L({
  step,
  from,
  until,
  children,
}: {
  step: number
  from: number
  until?: number
  children: ReactNode
}) {
  const on = step >= from && (until === undefined || step <= until)
  return <g className={`transition-opacity duration-500 ${on ? "opacity-100" : "pointer-events-none opacity-0"}`}>{children}</g>
}

export default function BuildScene({ step }: { step: number }) {
  return (
    <svg
      viewBox="0 0 760 480"
      role="img"
      aria-label={`Architectural elevation at step ${step} of 19`}
      className="h-auto w-full select-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Drafting canvas background */}
        <linearGradient id="cad-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#f1f5f9" />
        </linearGradient>

        {/* Contemporary building wall finishes */}
        <linearGradient id="cad-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f1f5f9" />
        </linearGradient>
        <linearGradient id="cad-charcoal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#253452" />
          <stop offset="100%" stopColor="#1a2744" />
        </linearGradient>
        <linearGradient id="cad-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e0edf9" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#c5ddf5" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="cad-warm-light" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE8D1" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#FFC896" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="cad-sun" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFA048" />
          <stop offset="100%" stopColor="#FF5E00" />
        </linearGradient>
        <pattern id="cad-timber" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="#a4683a" />
          <line x1="0" y1="2" x2="8" y2="2" stroke="#874e24" strokeWidth="1" />
          <line x1="0" y1="6" x2="8" y2="6" stroke="#874e24" strokeWidth="1" />
        </pattern>
        <pattern id="cad-hatch" width="10" height="10" patternUnits="userSpaceOnUse">
          <line x1="0" y1="10" x2="10" y2="0" stroke="#cbd5e1" strokeWidth="0.8" />
        </pattern>
      </defs>

      {/* Canvas background */}
      <rect width="760" height="480" fill="url(#cad-sky)" rx="16" />

      {/* Technical CAD grid */}
      <g opacity="0.45">
        {Array.from({ length: 20 }, (_, i) => (
          <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="480" stroke="#1a2744" strokeWidth="0.5" opacity="0.06" />
        ))}
        {Array.from({ length: 13 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 40} x2="760" y2={i * 40} stroke="#1a2744" strokeWidth="0.5" opacity="0.06" />
        ))}
      </g>

      {/* Technical title block / elevation markers */}
      <g opacity="0.45" className="text-[9px] font-mono">
        <text x="32" y="36" fill="#1a2744" fontWeight="600">DWG: ELEVATION - FRONT (EAST)</text>
        <text x="32" y="49" fill="#64748b">SCALE 1:100 · UNITS [METRES]</text>
      </g>

      {/* Datum level markers */}
      <g opacity={step >= 3 ? 0.7 : 0.25} className="text-[8.5px] font-mono transition-opacity duration-500">
        <line x1="660" y1="140" x2="736" y2="140" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="3 3" />
        <text x="664" y="135" fill="#64748b">+7.20m ROOF</text>

        <line x1="660" y1="266" x2="736" y2="266" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="3 3" />
        <text x="664" y="261" fill="#64748b">+3.60m LVL 1</text>

        <line x1="660" y1={GROUND} x2="736" y2={GROUND} stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="3 3" />
        <text x="664" y={GROUND - 5} fill="#64748b">±0.00m PLINTH</text>
      </g>

      {/* ── Sun (Step 19 Handover) ───────────────────────────────── */}
      <L step={step} from={19}>
        <circle cx="658" cy="76" r="26" fill="url(#cad-sun)" opacity="0.9" />
        <g stroke="#FF5E00" strokeWidth="2" strokeLinecap="round" opacity="0.5">
          <path d="M658 36v-12M658 128v12M618 76h-12M698 76h12M630 48l-8-8M686 104l8 8M686 48l8-8M630 104l-8 8" />
        </g>
      </L>

      {/* ── Natural Ground Line ──────────────────────────────────── */}
      <line x1="32" y1={GROUND} x2="728" y2={GROUND} stroke="#1a2744" strokeWidth="1.8" opacity="0.5" />
      <g stroke="#1a2744" strokeWidth="0.75" opacity="0.2">
        {Array.from({ length: 36 }, (_, i) => (
          <line key={i} x1={40 + i * 19} y1={GROUND} x2={30 + i * 19} y2={GROUND + 10} />
        ))}
      </g>

      {/* ── Step 1: Consultation & Boundary ──────────────────────── */}
      <L step={step} from={1}>
        <g>
          {/* Plot boundary with dashed perimeter */}
          <path
            d={`M90 ${GROUND} l42 -36 h504 l42 36`}
            stroke="#1a2744"
            strokeWidth="1.2"
            strokeDasharray="6 5"
            opacity="0.4"
          />
          {/* North indicator compass rose */}
          <g transform="translate(680, 72)" opacity="0.6">
            <circle cx="0" cy="0" r="16" stroke="#1a2744" strokeWidth="1" fill="none" />
            <polygon points="0,-12 4,0 -4,0" fill="#FF5E00" />
            <polygon points="0,12 4,0 -4,0" fill="#94a3b8" />
            <text x="0" y="-15" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1a2744">N</text>
          </g>
        </g>
      </L>

      {/* ── Step 2: Site Survey ──────────────────────────────────── */}
      <L step={step} from={2} until={9}>
        <g>
          {/* Surveyor benchmarks */}
          <g stroke="#FF5E00" strokeWidth="1.5">
            <path d="M148 392v-24M600 392v-24M374 360v-16" />
            <circle cx="148" cy="364" r="3.5" fill="#FF5E00" />
            <circle cx="600" cy="364" r="3.5" fill="#FF5E00" />
          </g>
          {/* Electronic Total Station on tripod */}
          <g stroke="#1a2744" strokeWidth="1.5" opacity="0.65">
            <path d="M648 392l11-34M670 392l-11-34M659 358v-8" />
            <rect x="648" y="336" width="22" height="14" rx="2" fill="#fff" stroke="#1a2744" strokeWidth="1.2" />
            <circle cx="659" cy="343" r="3" fill="#FF5E00" stroke="none" />
          </g>
        </g>
      </L>

      {/* ── Step 3: Planning Dimensions ─────────────────────────── */}
      <L step={step} from={3} until={9}>
        <g opacity="0.8">
          <line x1="148" y1="418" x2="600" y2="418" stroke="#1a2744" strokeWidth="1" />
          <path d="M148 412v12M600 412v12M144 422l8-8M596 422l8-8" stroke="#1a2744" strokeWidth="1.2" />
          <rect x="330" y="408" width="90" height="20" rx="4" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
          <text x="375" y="422" fill="#FF5E00" fontSize="11" fontFamily="monospace" fontWeight="700" textAnchor="middle">
            18.50 m PLOT
          </text>
        </g>
      </L>

      {/* ── Steps 4–9: Ghosted Contemporary Villa Blueprint ───────── */}
      <L step={step} from={4} until={10}>
        <g stroke="#1a2744" strokeWidth="1.3" strokeDasharray="5 4" opacity="0.45">
          {/* Ground floor volume */}
          <rect x="200" y="266" width="350" height="126" />
          {/* First floor cantilevered volume */}
          <rect x="175" y="140" width="375" height="126" />
          {/* Roof parapet slab */}
          <rect x="170" y="128" width="385" height="12" />
          {/* Cantilever balcony slab */}
          <rect x="175" y="258" width="165" height="8" />
        </g>
      </L>

      {/* ── Step 5: Structural Grid Axes ─────────────────────────── */}
      <L step={step} from={5} until={10}>
        <g stroke="#FF5E00" strokeWidth="1" strokeDasharray="4 4" opacity="0.75">
          <line x1="220" y1="110" x2="220" y2="440" />
          <line x1="360" y1="110" x2="360" y2="440" />
          <line x1="510" y1="110" x2="510" y2="440" />
          {/* Grid coordinate markers */}
          <g opacity="0.9" fill="#ffffff" stroke="#FF5E00" strokeWidth="1.2">
            <circle cx="220" cy="100" r="9" />
            <circle cx="360" cy="100" r="9" />
            <circle cx="510" cy="100" r="9" />
            <text x="220" y="103" fill="#1a2744" fontSize="9" fontWeight="bold" textAnchor="middle" stroke="none">A</text>
            <text x="360" y="103" fill="#1a2744" fontSize="9" fontWeight="bold" textAnchor="middle" stroke="none">B</text>
            <text x="510" y="103" fill="#1a2744" fontSize="9" fontWeight="bold" textAnchor="middle" stroke="none">C</text>
          </g>
        </g>
      </L>

      {/* ── Step 6: 3D Facade Elevation Mockup ───────────────────── */}
      <L step={step} from={6} until={10}>
        <g opacity="0.5">
          {/* Large panoramic window outlines */}
          <rect x="220" y="286" width="130" height="88" stroke="#1a2744" strokeWidth="1" strokeDasharray="3 3" />
          <rect x="200" y="156" width="140" height="88" stroke="#1a2744" strokeWidth="1" strokeDasharray="3 3" />
          <rect x="375" y="156" width="145" height="88" stroke="#1a2744" strokeWidth="1" strokeDasharray="3 3" />
        </g>
      </L>

      {/* ── Step 7: Architectural Municipality Sanction Seal ──────── */}
      <L step={step} from={7} until={10}>
        <g transform="translate(480, 60)">
          <rect x="0" y="0" width="180" height="66" rx="6" fill="#ffffff" stroke="#16a34a" strokeWidth="2" opacity="0.95" />
          <rect x="3" y="3" width="174" height="60" rx="4" fill="none" stroke="#16a34a" strokeWidth="0.8" strokeDasharray="4 2" opacity="0.7" />
          <text x="90" y="24" fill="#16a34a" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle" letterSpacing="1.2">
            MUNICIPAL SANCTION
          </text>
          <text x="90" y="40" fill="#16a34a" fontSize="8.5" fontFamily="monospace" textAnchor="middle">
            PASCHIM MEDINIPUR · PERMIT APPROVED
          </text>
          <text x="90" y="54" fill="#15803d" fontSize="8" fontFamily="monospace" fontWeight="600" textAnchor="middle">
            PLAN NO. RDC/2026/0491
          </text>
        </g>
      </L>

      {/* ── Step 8: Cost Schedule & Fixed BOQ Seal ───────────────── */}
      <L step={step} from={8} until={10}>
        <g transform="translate(68, 140)">
          <rect x="0" y="0" width="170" height="64" rx="8" fill="#1a2744" opacity="0.95" />
          <rect x="2" y="2" width="166" height="60" rx="6" fill="none" stroke="#FF5E00" strokeWidth="1" opacity="0.6" />
          <text x="85" y="24" fill="#ffffff" fontSize="9" fontFamily="monospace" fontWeight="600" textAnchor="middle" opacity="0.85" letterSpacing="0.8">
            ITEMISED FIXED CONTRACT
          </text>
          <text x="85" y="43" fill="#FF5E00" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            BOQ LOCKED ✓
          </text>
          <text x="85" y="56" fill="#94a3b8" fontSize="7.5" fontFamily="monospace" textAnchor="middle">
            ZERO VARIATION GUARANTEE
          </text>
        </g>
      </L>

      {/* ── Step 9: Certified Materials On Site ──────────────────── */}
      <L step={step} from={9} until={15}>
        <g>
          {/* TMT Steel Rods */}
          <g stroke="#334155" strokeWidth="2.4" opacity="0.8">
            <line x1="70" y1={GROUND - 6} x2="160" y2={GROUND - 6} />
            <line x1="70" y1={GROUND - 11} x2="160" y2={GROUND - 11} />
            <line x1="75" y1={GROUND - 16} x2="155" y2={GROUND - 16} />
          </g>
          {/* Steel tie badge */}
          <rect x="80" y={GROUND - 32} width="66" height="13" rx="3" fill="#1a2744" opacity="0.85" />
          <text x="113" y={GROUND - 23} fill="#FF5E00" fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            Fe 550D TMT
          </text>

          {/* Masonry block stack */}
          {[0, 1, 2].map((r) =>
            [0, 1, 2, 3].map((c) => (
              <rect
                key={`b-${r}-${c}`}
                x={580 + c * 20 + (r % 2 ? 6 : 0)}
                y={GROUND - 10 - r * 10}
                width="18"
                height="8"
                rx="1"
                fill="#94a3b8"
                stroke="#64748b"
                strokeWidth="0.6"
              />
            )),
          )}
        </g>
      </L>

      {/* ── Step 10: Foundation & Plinth Beam ────────────────────── */}
      <L step={step} from={10}>
        <g>
          {/* Isolated RCC Footings below ground */}
          <rect x="206" y={GROUND} width="46" height="32" rx="2" fill="#64748b" opacity="0.5" stroke="#475569" strokeWidth="1" />
          <rect x="346" y={GROUND} width="46" height="32" rx="2" fill="#64748b" opacity="0.5" stroke="#475569" strokeWidth="1" />
          <rect x="496" y={GROUND} width="46" height="32" rx="2" fill="#64748b" opacity="0.5" stroke="#475569" strokeWidth="1" />
          {/* Tie beam / plinth slab */}
          <rect x="180" y={GROUND - 12} width="390" height="12" rx="2" fill="#475569" opacity="0.85" />
          <text x="375" y={GROUND - 3} fill="#ffffff" fontSize="7.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            RCC PLINTH BEAM M25
          </text>
        </g>
      </L>

      {/* ── Steps 11–14: RCC Frame & Scaffolding ──────────────────── */}
      <L step={step} from={11} until={14}>
        <g>
          {/* Concrete columns */}
          <rect x="214" y="140" width="16" height={GROUND - 152} fill="#64748b" opacity="0.75" />
          <rect x="354" y="140" width="16" height={GROUND - 152} fill="#64748b" opacity="0.75" />
          <rect x="504" y="140" width="16" height={GROUND - 152} fill="#64748b" opacity="0.75" />

          {/* Slabs */}
          <rect x="175" y="260" width="375" height="12" fill="#475569" opacity="0.8" />
          <rect x="170" y="132" width="385" height="12" fill="#475569" opacity="0.8" />

          {/* Exterior modular scaffolding */}
          <g stroke="#FF5E00" strokeWidth="1.2" opacity="0.65">
            <line x1="165" y1="124" x2="165" y2={GROUND} />
            <line x1="565" y1="124" x2="565" y2={GROUND} />
            <line x1="165" y1="170" x2="565" y2="170" />
            <line x1="165" y1="225" x2="565" y2="225" />
            <line x1="165" y1="295" x2="565" y2="295" />
            <line x1="165" y1="355" x2="565" y2="355" />
            {/* Cross bracing */}
            <line x1="165" y1="170" x2="565" y2="225" strokeWidth="0.6" opacity="0.4" />
            <line x1="565" y1="170" x2="165" y2="225" strokeWidth="0.6" opacity="0.4" />
          </g>
        </g>
      </L>

      {/* ── Steps 10–14: Sleek Tower Crane ───────────────────────── */}
      <L step={step} from={10} until={14}>
        <g stroke="#1a2744" strokeWidth="1.4" opacity="0.75">
          <line x1="616" y1={GROUND} x2="616" y2="80" />
          <line x1="634" y1={GROUND} x2="634" y2="80" />
          <path
            d={Array.from({ length: 10 }, (_, i) => `M616 ${100 + i * 28}L634 ${128 + i * 28}M634 ${100 + i * 28}L616 ${128 + i * 28}`).join("")}
            strokeWidth="0.6"
            opacity="0.5"
          />
          {/* Horizontal boom */}
          <line x1="480" y1="74" x2="720" y2="74" strokeWidth="1.8" />
          <line x1="480" y1="84" x2="720" y2="84" strokeWidth="1" />
          <polygon points="625,50 616,74 634,74" fill="#1a2744" />
          {/* Crane hoist cable */}
          <line x1="530" y1="84" x2="530" y2="150" stroke="#FF5E00" strokeDasharray="3 3" strokeWidth="1.2" />
          <rect x="518" y="150" width="24" height="8" fill="#FF5E00" rx="1" />
        </g>
      </L>

      {/* ── Step 12: Electrical Conduits & Points ───────────────── */}
      <L step={step} from={12}>
        <g stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" opacity={step >= 15 ? 0.35 : 0.95}>
          {/* Main distribution line */}
          <path d="M230 380v-45h50v-40h45" fill="none" />
          <path d="M375 260v-60h65v-25" fill="none" />
          {/* Electrical junction and switch points */}
          <circle cx="280" cy="335" r="3.5" fill="#f59e0b" stroke="none" />
          <circle cx="325" cy="295" r="3.5" fill="#f59e0b" stroke="none" />
          <circle cx="440" cy="200" r="3.5" fill="#f59e0b" stroke="none" />
        </g>
      </L>

      {/* ── Step 13: Concealed Plumbing Pipelines ────────────────── */}
      <L step={step} from={13}>
        <g stroke="#0284c7" strokeWidth="2.2" strokeLinecap="round" opacity={step >= 15 ? 0.35 : 0.95}>
          <path d="M490 392v-85h-40v-35" fill="none" />
          <path d="M490 260v-75h-30" fill="none" />
          {/* Valve and pressure gauge */}
          <circle cx="450" cy="307" r="3.5" fill="#0284c7" stroke="none" />
          <circle cx="460" cy="185" r="3.5" fill="#0284c7" stroke="none" />
        </g>
      </L>

      {/* ── Step 14: Precision Tile Grid ─────────────────────────── */}
      <L step={step} from={14}>
        <g opacity="0.45" stroke="#1a2744" strokeWidth="0.8">
          <line x1="180" y1={GROUND - 2} x2="550" y2={GROUND - 2} strokeWidth="1.2" />
          {Array.from({ length: 15 }, (_, i) => (
            <line key={`tile-${i}`} x1={200 + i * 23} y1={GROUND - 12} x2={200 + i * 23} y2={GROUND - 2} />
          ))}
        </g>
      </L>

      {/* ── Steps 15+: Finished Luxury Modern Architecture ───────── */}
      <L step={step} from={15}>
        <g>
          {/* Ground floor main walls */}
          <rect x="200" y="266" width="350" height="126" fill="url(#cad-wall)" stroke="#1a2744" strokeWidth="1.4" />

          {/* First floor cantilever facade */}
          <rect x="175" y="140" width="375" height="126" fill="url(#cad-wall)" stroke="#1a2744" strokeWidth="1.4" />

          {/* Flat roof architectural parapet & fascia band */}
          <rect x="168" y="126" width="389" height="14" rx="2" fill="url(#cad-charcoal)" />

          {/* Mid-level architectural slab band */}
          <rect x="170" y="260" width="385" height="10" rx="2" fill="url(#cad-charcoal)" />

          {/* Timber slat accent panels on right facade */}
          <rect x="420" y="146" width="120" height="108" fill="url(#cad-timber)" stroke="#874e24" strokeWidth="1" />

          {/* Cantilever balcony glass railing */}
          <rect x="175" y="228" width="175" height="32" fill="#e0edf9" fillOpacity="0.45" stroke="#1a2744" strokeWidth="1.2" />
          <line x1="175" y1="228" x2="350" y2="228" stroke="#1a2744" strokeWidth="2" />
          <line x1="233" y1="228" x2="233" y2="260" stroke="#1a2744" strokeWidth="0.8" opacity="0.6" />
          <line x1="291" y1="228" x2="291" y2="260" stroke="#1a2744" strokeWidth="0.8" opacity="0.6" />

          {/* Floor-to-ceiling glass windows (first floor) */}
          <rect x="195" y="152" width="145" height="74" fill="url(#cad-glass)" stroke="#1a2744" strokeWidth="1.4" />
          <line x1="267" y1="152" x2="267" y2="226" stroke="#1a2744" strokeWidth="1.2" />

          {/* Ground floor expansive glass facade */}
          <rect x="215" y="280" width="210" height="102" fill="url(#cad-glass)" stroke="#1a2744" strokeWidth="1.4" />
          <line x1="285" y1="280" x2="285" y2="382" stroke="#1a2744" strokeWidth="1.2" />
          <line x1="355" y1="280" x2="355" y2="382" stroke="#1a2744" strokeWidth="1.2" />

          {/* Modern grand entrance door with teak finish */}
          <rect x="455" y="282" width="60" height="100" rx="2" fill="#78350f" stroke="#1a2744" strokeWidth="1.4" />
          <rect x="502" y="322" width="4" height="26" rx="2" fill="#f8fafc" />

          {/* Architectural porch canopy over door */}
          <rect x="440" y="276" width="90" height="6" rx="1" fill="url(#cad-charcoal)" />
        </g>
      </L>

      {/* ── Step 16: Interior Warm Lighting Atmosphere ───────────── */}
      <L step={step} from={16}>
        <g>
          {/* Warm interior room illumination */}
          <rect x="197" y="154" width="141" height="70" fill="url(#cad-warm-light)" opacity="0.85" />
          <rect x="217" y="282" width="206" height="98" fill="url(#cad-warm-light)" opacity="0.85" />
          {/* Architectural pendant light silhouette */}
          <line x1="267" y1="154" x2="267" y2="182" stroke="#1a2744" strokeWidth="1.2" />
          <circle cx="267" cy="186" r="6" fill="#f59e0b" opacity="0.9" />
          <line x1="320" y1="282" x2="320" y2="310" stroke="#1a2744" strokeWidth="1.2" />
          <circle cx="320" cy="314" r="6" fill="#f59e0b" opacity="0.9" />
        </g>
      </L>

      {/* ── Step 17: Landscaping, Planters & Stone Pathway ─────────── */}
      <L step={step} from={17}>
        <g>
          {/* Contemporary entrance stone pavers */}
          <g fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" opacity="0.85">
            <rect x="435" y="392" width="100" height="8" rx="2" />
            <rect x="425" y="402" width="120" height="8" rx="2" />
            <rect x="415" y="412" width="140" height="8" rx="2" />
          </g>

          {/* Architectural potted planters */}
          <g>
            <rect x="555" y="362" width="24" height="28" rx="2" fill="#334155" />
            <circle cx="567" cy="342" r="18" fill="#15803d" opacity="0.85" />
            <circle cx="567" cy="336" r="13" fill="#16a34a" opacity="0.9" />

            <rect x="155" y="364" width="22" height="26" rx="2" fill="#334155" />
            <circle cx="166" cy="348" r="16" fill="#15803d" opacity="0.85" />
          </g>
        </g>
      </L>

      {/* ── Step 18: Quality Assurance Snag Clear Inspection ──────── */}
      <L step={step} from={18} until={18}>
        <g>
          {[
            { x: 268, y: 190, label: "STRUCTURAL QA" },
            { x: 480, y: 190, label: "FACADE QA" },
            { x: 320, y: 330, label: "JOINERY QA" },
            { x: 485, y: 330, label: "MEP VERIFIED" },
          ].map(({ x, y, label }) => (
            <g key={label} transform={`translate(${x}, ${y})`}>
              <circle cx="0" cy="0" r="14" fill="#16a34a" />
              <path d="M-6 0l4 4 8-8" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <rect x="-42" y="18" width="84" height="15" rx="3" fill="#1a2744" opacity="0.95" />
              <text x="0" y="29" fill="#ffffff" fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                {label} ✓
              </text>
            </g>
          ))}
        </g>
      </L>

      {/* ── Step 19: Official Project Handover ─────────────────────── */}
      <L step={step} from={19}>
        <g transform="translate(560, 255)">
          {/* Handover key badge */}
          <rect x="-10" y="0" width="160" height="78" rx="8" fill="#1a2744" opacity="0.95" />
          <rect x="-8" y="2" width="156" height="74" rx="6" fill="none" stroke="#FF5E00" strokeWidth="1.2" opacity="0.8" />

          {/* Brass Key icon */}
          <g transform="translate(24, 38)" stroke="#FF5E00" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <circle cx="0" cy="0" r="9" />
            <line x1="8" y1="0" x2="28" y2="0" />
            <line x1="20" y1="0" x2="20" y2="7" />
            <line x1="26" y1="0" x2="26" y2="6" />
          </g>

          <text x="75" y="32" fill="#ffffff" fontSize="10.5" fontFamily="monospace" fontWeight="bold">
            HANDED OVER
          </text>
          <text x="75" y="47" fill="#FF5E00" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
            ON SCHEDULE · ON BUDGET
          </text>
          <text x="75" y="60" fill="#94a3b8" fontSize="7.5" fontFamily="monospace">
            KEYS & WARRANTIES ISSUED
          </text>
        </g>
      </L>
    </svg>
  )
}
