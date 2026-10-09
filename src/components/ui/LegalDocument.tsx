import type { ReactNode } from "react"
import { Link } from "react-router-dom"

export type LegalSection = {
  /** Anchor id, so a clause can be linked to directly (/privacy#your-rights). */
  id: string
  title: string
  content: ReactNode
}

/**
 * Shared layout for the Privacy Policy and the Terms & Conditions.
 *
 * Numbered sections with a contents list, so a visitor — or a client's lawyer —
 * can cite "clause 7" and jump straight to it. The contents list is sticky from
 * `lg` up and sits above the text on smaller screens.
 */
export default function LegalDocument({
  effective,
  summary,
  sections,
}: {
  /** Human-readable effective date, e.g. "9 October 2026". Fixed, not the
   *  render date: a policy's date has to change only when the text does. */
  effective: string
  summary: ReactNode
  sections: LegalSection[]
}) {
  return (
    <div className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14">
      <nav aria-label="Contents" className="lg:sticky lg:top-28 lg:self-start">
        <p className="montserrat font-800 mb-3 text-[11px] uppercase tracking-[0.18em] text-navy">
          Contents
        </p>
        <ol className="flex flex-col gap-1.5 border-l border-hairline pl-4 text-[13px] leading-snug">
          {sections.map((s, i) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="text-slate-500 transition-colors hover:text-brand-ink">
                {i + 1}. {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="max-w-3xl">
        <p className="mb-6 text-xs uppercase tracking-[0.16em] text-slate-500">
          Effective {effective}
        </p>

        <div className="mb-12 border-l-2 border-brand bg-surface p-5 text-sm leading-7 text-slate-600">
          {summary}
        </div>

        <div className="flex flex-col gap-11">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-28">
              <h2 className="montserrat font-800 mb-4 text-base text-navy">
                <span className="mr-2 text-brand">{i + 1}.</span>
                {s.title}
              </h2>
              <div className="legal-body flex flex-col gap-3.5 text-sm leading-7 text-slate-600">
                {s.content}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-14 border-t border-hairline pt-6 text-xs leading-6 text-slate-500">
          Effective {effective}. See also our{" "}
          <Link to="/privacy" className="font-semibold text-brand-ink underline underline-offset-2">
            Privacy Policy
          </Link>
          ,{" "}
          <Link to="/terms" className="font-semibold text-brand-ink underline underline-offset-2">
            Terms &amp; Conditions
          </Link>{" "}
          and{" "}
          <Link to="/cookies" className="font-semibold text-brand-ink underline underline-offset-2">
            Cookie Policy
          </Link>
          .
        </p>
      </div>
    </div>
  )
}

/** A bulleted list styled for legal copy. */
export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="flex list-disc flex-col gap-2 pl-5 marker:text-brand">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  )
}

/** Inline link styled for legal copy. Internal paths use the router. */
export function LegalLink({ to, children }: { to: string; children: ReactNode }) {
  const cls = "font-semibold text-brand-ink underline underline-offset-2"
  return to.startsWith("/") ? (
    <Link to={to} className={cls}>
      {children}
    </Link>
  ) : (
    <a href={to} className={cls} target={to.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
      {children}
    </a>
  )
}
