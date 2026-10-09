import { useEffect, useState, type ReactNode } from "react"
import v4Logo from "@/imports/V4.png"
import { SITE, ACTIVE_SOCIAL_LINKS } from "@/data/siteInfo"

/**
 * Pre-launch countdown.
 *
 * Until LAUNCH_AT the whole site is replaced by a countdown; at zero the page
 * reloads itself and the real site mounts (with the logo intro). Nothing has
 * to be deployed at launch time — after LAUNCH_AT this component renders its
 * children immediately and can be deleted at leisure.
 *
 * Time comes from the server's `Date` header, not the visitor's clock, so a
 * phone set a few minutes wrong neither opens early nor counts past zero.
 *
 * Demo: append `?launch-demo=15` to any URL to run a 15-second countdown in
 * that tab only (kept in sessionStorage so the post-reload page knows the
 * demo has launched). `?launch-demo=off` clears it.
 */
export const LAUNCH_AT = Date.parse("2026-10-10T10:00:00+05:30")

const DEMO_KEY = "launch-demo-at"
const RELOADED_KEY = "launch-reloaded-for"

function readSession(key: string) {
  try {
    return sessionStorage.getItem(key)
  } catch {
    return null
  }
}

function writeSession(key: string, value: string | null) {
  try {
    if (value === null) sessionStorage.removeItem(key)
    else sessionStorage.setItem(key, value)
  } catch {
    /* private mode — the demo simply will not survive the reload */
  }
}

/** The launch instant for this tab: the real one, or a demo override. */
function resolveTarget(): number {
  const url = new URL(window.location.href)
  const demo = url.searchParams.get("launch-demo")
  if (demo !== null) {
    url.searchParams.delete("launch-demo")
    window.history.replaceState(null, "", url.pathname + url.search + url.hash)
    const seconds = Number(demo)
    if (demo === "off" || !Number.isFinite(seconds) || seconds <= 0) {
      writeSession(DEMO_KEY, null)
    } else {
      const at = Date.now() + seconds * 1000
      writeSession(DEMO_KEY, String(at))
      return at
    }
  }
  const stored = Number(readSession(DEMO_KEY))
  return stored > 0 ? stored : LAUNCH_AT
}

const pad = (n: number) => String(n).padStart(2, "0")

export default function LaunchGate({ children }: { children: ReactNode }) {
  const [target] = useState(resolveTarget)
  const isDemo = target !== LAUNCH_AT
  // Server clock minus local clock. Demo targets are set from the local clock,
  // so they ignore it.
  const [offset, setOffset] = useState(0)
  const [now, setNow] = useState(() => Date.now())
  const remaining = target - (now + (isDemo ? 0 : offset))
  const [launched, setLaunched] = useState(() => remaining <= 0)
  const atZero = remaining <= 0

  // Sync to the server clock once.
  useEffect(() => {
    if (launched || isDemo) return
    const sentAt = Date.now()
    fetch("/robots.txt", { method: "HEAD", cache: "no-store" })
      .then((res) => {
        const server = Date.parse(res.headers.get("date") ?? "")
        if (Number.isFinite(server)) {
          // The header has 1s resolution; assume it was stamped mid-flight.
          setOffset(server + 500 - (sentAt + Date.now()) / 2)
        }
      })
      .catch(() => {})
  }, [launched, isDemo])

  // Tick on each wall-clock second, until zero.
  useEffect(() => {
    if (launched || atZero) return
    let timer = 0
    const tick = () => {
      setNow(Date.now())
      timer = window.setTimeout(tick, 1000 - (Date.now() % 1000) + 5)
    }
    tick()
    // Background tabs and sleeping phones throttle timers to once a minute or
    // pause them; catch up the moment the page is looked at again.
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        window.clearTimeout(timer)
        tick()
      }
    }
    document.addEventListener("visibilitychange", onVisible)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener("visibilitychange", onVisible)
    }
  }, [launched, atZero])

  // Zero: hold "We're live!" for a beat, then reload once into the live site.
  // Keyed on `atZero`, not `remaining`, so later ticks cannot cancel it. If a
  // reload somehow lands before the target again (clock jump), open the site
  // in place rather than loop.
  useEffect(() => {
    if (launched || !atZero) return
    if (readSession(RELOADED_KEY) === String(target)) {
      setLaunched(true)
      return
    }
    const t = window.setTimeout(() => {
      writeSession(RELOADED_KEY, String(target))
      window.location.reload()
    }, 1200)
    return () => window.clearTimeout(t)
  }, [launched, atZero, target])

  useEffect(() => {
    if (launched) return
    const previous = document.title
    document.title = `Launching soon | ${SITE.name}`
    return () => {
      document.title = previous
    }
  }, [launched])

  if (launched) return <>{children}</>

  const left = Math.max(0, remaining)
  const totalSeconds = Math.ceil(left / 1000)
  const units = [
    { label: "Days", value: Math.floor(totalSeconds / 86400) },
    { label: "Hours", value: Math.floor(totalSeconds / 3600) % 24 },
    { label: "Minutes", value: Math.floor(totalSeconds / 60) % 60 },
    { label: "Seconds", value: totalSeconds % 60 },
  ]
  const live = totalSeconds === 0

  return (
    <main
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-navy-deep px-6 py-14 text-center text-white"
      style={{
        backgroundImage:
          "linear-gradient(rgba(80,110,170,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(80,110,170,.14) 1px, transparent 1px), linear-gradient(180deg, #111a2e, #23355c)",
        backgroundSize: "40px 40px, 40px 40px, 100% 100%",
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1.5 bg-brand" />

      <img src={v4Logo} alt="" width={96} height={106} className="h-[96px] w-auto object-contain" />
      <div className="allura mt-3 text-[44px] leading-none text-brand">Reena</div>
      <div className="poppins mt-1 text-[11px] font-medium tracking-[0.22em] text-brand-light">
        DESIGN &amp; CONSTRUCTION
      </div>

      <h1 className="montserrat font-800 mt-10 max-w-2xl text-3xl leading-tight text-balance sm:text-5xl">
        {live ? "We're live!" : "Our new website is almost here"}
      </h1>
      <p className="mt-4 max-w-xl text-base text-slate-300 sm:text-lg">
        {live ? (
          "Opening the site…"
        ) : (
          <>
            Launching{" "}
            <span className="font-semibold text-white">
              {isDemo
                ? "in a few seconds (demo)"
                : "Saturday, 10 October 2026 · 10:00 AM IST"}
            </span>
          </>
        )}
      </p>

      <div
        className="mt-10 grid w-full max-w-xl grid-cols-4 gap-2 sm:gap-4"
        role="timer"
        aria-live="off"
        aria-label={`${units.map((u) => `${u.value} ${u.label}`).join(", ")} until launch`}
      >
        {units.map((u) => (
          <div
            key={u.label}
            className={`border-[1.5px] bg-white/5 px-1 py-4 backdrop-blur-sm transition-colors sm:py-6 ${
              live ? "border-brand" : "border-white/15"
            }`}
          >
            <div className="montserrat font-800 text-3xl tabular-nums sm:text-5xl">{pad(u.value)}</div>
            <div className="mt-2 text-[10px] font-semibold tracking-[0.18em] text-slate-400 uppercase sm:text-xs">
              {u.label}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-12 text-sm text-slate-400">Can't wait? We're already taking enquiries.</p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <a href={SITE.phoneHref} className="btn-orange montserrat font-700 px-5 py-2.5 text-sm">
          Call {SITE.phones[0]}
        </a>
        <a
          href={SITE.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="montserrat font-700 border-[1.5px] border-white/30 px-5 py-2.5 text-sm text-white transition-colors hover:border-brand hover:text-brand-light"
        >
          WhatsApp
        </a>
      </div>
      {ACTIVE_SOCIAL_LINKS.length > 0 && (
        <div className="mt-6 flex gap-5 text-sm text-slate-400">
          {ACTIVE_SOCIAL_LINKS.map((s) => (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-brand-light"
            >
              {s.label}
            </a>
          ))}
        </div>
      )}
      <p className="mt-10 text-xs text-slate-500">{SITE.addressLines.split("\n")[0]}</p>
    </main>
  )
}
