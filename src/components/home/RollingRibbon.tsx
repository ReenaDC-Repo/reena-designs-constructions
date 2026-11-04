import { Link } from "react-router-dom"
import { Sparkles, Phone, Mail } from "lucide-react"

// Repeated entries for seamless infinite loop across all display widths
const RIBBON_1_ITEMS = [
  "DIWALI DHAMAKA OFFER • 5-15 NOVEMBER",
  "GHAR ROSHAN • SAPNE ROSHAN",
  "CALL 094707 72111",
  "ARCHITECTURAL DESIGN",
  "PREMIUM INTERIORS",
  "CIVIL CONSTRUCTION",
  "DIWALI DHAMAKA OFFER • 5-15 NOVEMBER",
  "GHAR ROSHAN • SAPNE ROSHAN",
  "CALL 094707 72111",
  "ARCHITECTURAL DESIGN",
  "PREMIUM INTERIORS",
  "CIVIL CONSTRUCTION",
]

const RIBBON_2_ITEMS = [
  "DIWALI DHAMAKA OFFER • 5-15 NOV",
  "FREE 3D CONSULTATION",
  "REQUEST A FREE QUOTE",
  "30+ YEARS LEGACY",
  "100% TRANSPARENCY",
  "ON-TIME DELIVERY",
  "DIWALI DHAMAKA OFFER • 5-15 NOV",
  "FREE 3D CONSULTATION",
  "REQUEST A FREE QUOTE",
  "30+ YEARS LEGACY",
  "100% TRANSPARENCY",
  "ON-TIME DELIVERY",
]

export default function RollingRibbon() {
  return (
    <div className="relative z-30 w-full overflow-hidden py-8 md:py-12 select-none">
      {/* Ribbon 1: Warm Saffron (#FF9E2C) tape angled downwards (-2.2deg) */}
      <div className="relative z-30 w-[130%] -left-[15%] -rotate-[2.2deg] shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <Link
          to="/contact"
          aria-label="Contact Reena Design & Construction"
          className="group block overflow-hidden bg-gradient-to-r from-[#FF9E2C] via-[#FFB35A] to-[#FF9E2C] border-y border-[#C5A059]/60 py-2 md:py-2.5 transition-colors hover:brightness-105"
        >
          <div className="flex w-max animate-ribbon-left pause-on-hover">
            {/* First half */}
            <div className="flex shrink-0 items-center gap-6 md:gap-8 px-4">
              {RIBBON_1_ITEMS.map((text, idx) => (
                <div key={`r1-a-${idx}`} className="inline-flex items-center gap-2 md:gap-2.5">
                  {text.includes("CALL") ? (
                    <Phone
                      size={13}
                      strokeWidth={2.8}
                      className="text-[#0F0F12] shrink-0"
                      aria-hidden="true"
                    />
                  ) : (
                    <Sparkles
                      size={13}
                      strokeWidth={2.8}
                      className="text-[#E65100] shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  <span className="montserrat font-900 text-[11px] md:text-[13px] tracking-[0.24em] uppercase text-[#0F0F12] whitespace-nowrap">
                    {text}
                  </span>
                </div>
              ))}
            </div>

            {/* Duplicate half for seamless infinite loop */}
            <div className="flex shrink-0 items-center gap-6 md:gap-8 px-4" aria-hidden="true">
              {RIBBON_1_ITEMS.map((text, idx) => (
                <div key={`r1-b-${idx}`} className="inline-flex items-center gap-2 md:gap-2.5">
                  {text.includes("CALL") ? (
                    <Phone
                      size={13}
                      strokeWidth={2.8}
                      className="text-[#0F0F12] shrink-0"
                      aria-hidden="true"
                    />
                  ) : (
                    <Sparkles
                      size={13}
                      strokeWidth={2.8}
                      className="text-[#E65100] shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  <span className="montserrat font-900 text-[11px] md:text-[13px] tracking-[0.24em] uppercase text-[#0F0F12] whitespace-nowrap">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Link>
      </div>

      {/* Ribbon 2: Brushed Champagne Gold (#C5A059) tape angled upwards (+1.8deg) */}
      <div className="relative z-20 w-[130%] -left-[15%] -mt-3.5 md:-mt-5 rotate-[1.8deg] shadow-[0_8px_25px_rgba(197,160,89,0.35)]">
        <Link
          to="/contact"
          aria-label="Request a Free Quote"
          className="group block overflow-hidden bg-gradient-to-r from-[#B89047] via-[#E2D1AC] to-[#B89047] border-y border-[#93712B] py-2 md:py-2.5 transition-colors hover:brightness-105"
        >
          <div className="flex w-max animate-ribbon-right pause-on-hover">
            {/* First half */}
            <div className="flex shrink-0 items-center gap-6 md:gap-8 px-4">
              {RIBBON_2_ITEMS.map((text, idx) => (
                <div key={`r2-a-${idx}`} className="inline-flex items-center gap-2 md:gap-2.5">
                  {text.includes("DIWALI") ? (
                    <Sparkles
                      size={13}
                      strokeWidth={2.8}
                      className="text-[#93712B] shrink-0"
                      aria-hidden="true"
                    />
                  ) : (
                    <Mail
                      size={13}
                      strokeWidth={2.6}
                      className="text-[#2A1D05] shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  <span className="montserrat font-900 text-[11px] md:text-[13px] tracking-[0.24em] uppercase text-[#2A1D05] whitespace-nowrap">
                    {text}
                  </span>
                </div>
              ))}
            </div>

            {/* Duplicate half for seamless infinite loop */}
            <div className="flex shrink-0 items-center gap-6 md:gap-8 px-4" aria-hidden="true">
              {RIBBON_2_ITEMS.map((text, idx) => (
                <div key={`r2-b-${idx}`} className="inline-flex items-center gap-2 md:gap-2.5">
                  {text.includes("DIWALI") ? (
                    <Sparkles
                      size={13}
                      strokeWidth={2.8}
                      className="text-[#93712B] shrink-0"
                      aria-hidden="true"
                    />
                  ) : (
                    <Mail
                      size={13}
                      strokeWidth={2.6}
                      className="text-[#2A1D05] shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  <span className="montserrat font-900 text-[11px] md:text-[13px] tracking-[0.24em] uppercase text-[#2A1D05] whitespace-nowrap">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
