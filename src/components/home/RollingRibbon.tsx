import { Link } from "react-router-dom"
import { Phone, Mail } from "lucide-react"

// Repeated entries for seamless infinite loop across all display widths
const RIBBON_1_ITEMS = Array(16).fill("CONTACT US")
const RIBBON_2_ITEMS = Array(16).fill("FREE QUOTE")

export default function RollingRibbon() {
  return (
    <div className="relative z-30 w-full overflow-hidden py-8 md:py-12 select-none">
      {/* Ribbon 1: Cream/Tan tape angled downwards (-2.2deg) */}
      <div className="relative z-30 w-[130%] -left-[15%] -rotate-[2.2deg] shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <Link
          to="/contact"
          aria-label="Contact Reena Designs & Constructions"
          className="group block overflow-hidden bg-[#ede4d4] border-y border-stone-400/40 py-2 md:py-2.5 transition-colors hover:bg-[#f6eee0]"
        >
          <div className="flex w-max animate-ribbon-left pause-on-hover">
            {/* First half */}
            <div className="flex shrink-0 items-center gap-6 md:gap-8 px-4">
              {RIBBON_1_ITEMS.map((text, idx) => (
                <div key={`r1-a-${idx}`} className="inline-flex items-center gap-2 md:gap-2.5">
                  <Phone
                    size={13}
                    strokeWidth={2.8}
                    className="text-[#1a2332] shrink-0"
                    aria-hidden="true"
                  />
                  <span className="montserrat font-800 text-[11px] md:text-[13px] tracking-[0.24em] uppercase text-[#1a2332] whitespace-nowrap">
                    {text}
                  </span>
                </div>
              ))}
            </div>

            {/* Duplicate half for seamless infinite loop */}
            <div className="flex shrink-0 items-center gap-6 md:gap-8 px-4" aria-hidden="true">
              {RIBBON_1_ITEMS.map((text, idx) => (
                <div key={`r1-b-${idx}`} className="inline-flex items-center gap-2 md:gap-2.5">
                  <Phone
                    size={13}
                    strokeWidth={2.8}
                    className="text-[#1a2332] shrink-0"
                    aria-hidden="true"
                  />
                  <span className="montserrat font-800 text-[11px] md:text-[13px] tracking-[0.24em] uppercase text-[#1a2332] whitespace-nowrap">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Link>
      </div>

      {/* Ribbon 2: Dark slate/navy tape angled upwards (+1.8deg), crossing Ribbon 1 */}
      <div className="relative z-20 w-[130%] -left-[15%] -mt-3.5 md:-mt-5 rotate-[1.8deg] shadow-[0_8px_25px_rgba(0,0,0,0.65)]">
        <Link
          to="/contact"
          aria-label="Request a Free Quote"
          className="group block overflow-hidden bg-[#181f2c] border-y border-white/15 py-2 md:py-2.5 transition-colors hover:bg-[#20293a]"
        >
          <div className="flex w-max animate-ribbon-right pause-on-hover">
            {/* First half */}
            <div className="flex shrink-0 items-center gap-6 md:gap-8 px-4">
              {RIBBON_2_ITEMS.map((text, idx) => (
                <div key={`r2-a-${idx}`} className="inline-flex items-center gap-2 md:gap-2.5">
                  <Mail
                    size={13}
                    strokeWidth={2.6}
                    className="text-[#ede4d4] shrink-0"
                    aria-hidden="true"
                  />
                  <span className="montserrat font-800 text-[11px] md:text-[13px] tracking-[0.24em] uppercase text-[#ede4d4] whitespace-nowrap">
                    {text}
                  </span>
                </div>
              ))}
            </div>

            {/* Duplicate half for seamless infinite loop */}
            <div className="flex shrink-0 items-center gap-6 md:gap-8 px-4" aria-hidden="true">
              {RIBBON_2_ITEMS.map((text, idx) => (
                <div key={`r2-b-${idx}`} className="inline-flex items-center gap-2 md:gap-2.5">
                  <Mail
                    size={13}
                    strokeWidth={2.6}
                    className="text-[#ede4d4] shrink-0"
                    aria-hidden="true"
                  />
                  <span className="montserrat font-800 text-[11px] md:text-[13px] tracking-[0.24em] uppercase text-[#ede4d4] whitespace-nowrap">
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
