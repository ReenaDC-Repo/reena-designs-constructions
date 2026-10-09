import { useState } from "react"
import { Plus, Folder, FolderOpen, Check } from "lucide-react"
import PageWrapper from "@/components/layout/PageWrapper"
import Seo from "@/components/Seo"
import { routeSeo } from "@/data/routes"
import PageHeader from "@/components/ui/PageHeader"
import SectionTitle from "@/components/ui/SectionTitle"
import { SITE_CONTAINER } from "@/components/layout/constants"
import { COURSES } from "@/data/courses"
import ToolBadge from "@/components/ui/ToolBadge"
import { SITE } from "@/data/siteInfo"
import draftingTable from "@/imports/about-drafting-table.jpg"
import headerStrip from "@/imports/learn-header-strip.png"
import drawingToInterior from "@/imports/about-drawing-to-interior.jpg"
import livingTvWalnut from "@/imports/interior-living-tv-walnut.jpeg"
import masterBedroom from "@/imports/interior-master-bedroom.jpeg"
import kitchenLShaped from "@/imports/interior-kitchen-l-shaped.jpeg"
import poojaRoom from "@/imports/interior-pooja-room.jpeg"
import bedroomBlush from "@/imports/interior-bedroom-blush.jpeg"

const WHY = [
  "Taught by the same architects and engineers who draught our live projects",
  "Small batches, hands-on through every module — not lecture-only",
  "Practice files drawn from real building, structural and MEP drawings",
  "A certificate of completion on finishing the course",
] as const

/**
 * Work from the studio.
 *
 * Every image here is the company's own — drawings and renders produced on the
 * software these courses teach — so a prospective student sees the standard
 * the training is aimed at, not stock photography of someone else's screen.
 * `wide` tiles span two columns on large screens to break the grid's rhythm.
 */
const STUDIO_WORK = [
  {
    src: drawingToInterior,
    kind: "Model to render",
    title: "Open-plan living, line drawing to finished render",
    alt: "The same living space shown half as a line drawing and half as a finished photorealistic render",
    wide: true,
  },
  {
    src: draftingTable,
    kind: "Working drawing",
    title: "Drawing up a floor plan",
    alt: "A member of our team drawing a floor plan by hand with a scale rule at the drafting table",
  },
  {
    src: livingTvWalnut,
    kind: "Interior render",
    title: "Fluted walnut feature wall",
    alt: "Render of a living room feature wall with fluted walnut columns and a gold-veined marble panel",
  },
  {
    src: masterBedroom,
    kind: "Interior render",
    title: "Marble and rose-gold master bedroom",
    alt: "Render of a master bedroom with a marble-finish wardrobe and an upholstered headboard wall",
  },
  {
    src: kitchenLShaped,
    kind: "Interior render",
    title: "L-shaped modular kitchen",
    alt: "Render of an L-shaped modular kitchen with grey cabinets and a glass-fronted crockery unit",
    wide: true,
  },
  {
    src: poojaRoom,
    kind: "Interior render",
    title: "Pooja room with backlit niche",
    alt: "Render of a pooja room with a lit carved niche, brass lamps and patterned wallpaper",
  },
  {
    src: bedroomBlush,
    kind: "Interior render",
    title: "Blush-toned bedroom suite",
    alt: "Render of a bedroom in blush tones with a tufted headboard and a chandelier",
  },
] as const

/**
 * Courses grouped into folders, in the order each group first appears in
 * `COURSES` — so "Draughting" (AutoCAD) leads, matching the order the rest
 * of the page already introduces the tools in.
 */
const FOLDERS = COURSES.reduce<{ group: string; courses: typeof COURSES[number][] }[]>((acc, course) => {
  const folder = acc.find((f) => f.group === course.group)
  if (folder) folder.courses.push(course)
  else acc.push({ group: course.group, courses: [course] })
  return acc
}, [])

const PAGE = routeSeo("/learn-from-us")

export default function LearnFromUs() {
  const [activeFolder, setActiveFolder] = useState(0)
  // Keyed by course title rather than index, so switching folders does not
  // leave a stale index pointing at an unrelated course in the new folder.
  const [openCourse, setOpenCourse] = useState<string | null>(FOLDERS[0].courses[0].title)

  return (
    <PageWrapper
      cta={{
        title: "Ready to start a batch?",
        subtitle: "Call or write in and we will confirm the next available seat.",
        buttonText: "Talk to Us",
        buttonHref: "/contact",
      }}
    >
      <Seo route="/learn-from-us" />
      <PageHeader
        title={PAGE.heading}
        subtitle={PAGE.subheading}
        crumbs={PAGE.crumbs}
        backdrop
        strip={headerStrip}
      />

      {/* ── Why train with us ─────────────────────────────────────── */}
      <section className="py-14 lg:py-20">
        <div className={SITE_CONTAINER}>
          <div className="max-w-2xl">
            <SectionTitle
              title="Learn drawing and design on the software we build with"
              align="left"
              className="mb-6"
            />
            <p className="text-sm leading-7 text-slate-500">
              Every drawing, model, analysis and schedule this company runs on — sanction plans,
              structural design, 3D elevations, site programmes — is produced in-house on AutoCAD,
              Autodesk Revit, SketchUp, Primavera P6, BlenderBIM, STAAD.Pro, ETABS, Lumion and V-Ray.
              Ten full courses, taught on the same tools our own team works in daily, open to
              students, junior draughtsmen, engineers and site staff moving into design or planning
              work.
            </p>
          </div>

          <ul className="mt-9 grid gap-x-10 gap-y-3 border-t border-hairline pt-7 sm:grid-cols-2">
            {WHY.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-slate-600">
                <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-brand" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>

          {/* The ten tools, by mark — the first thing a student scanning
              for "do they teach Revit?" looks for. */}
          <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5" aria-label="Software taught">
            {COURSES.map((course) => (
              <li
                key={course.title}
                className="flex items-center gap-3 border border-hairline bg-white px-3 py-2.5"
              >
                <ToolBadge tool={course.title} size={36} />
                <span className="min-w-0">
                  <span className="montserrat font-700 block truncate text-[13px] text-navy">{course.title}</span>
                  <span className="block text-[11px] text-slate-400">{course.group}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── The courses ───────────────────────────────────────────── */}
      {/* Filed into folders by discipline rather than one flat list of ten:
          a visitor who wants structural software has no reason to scroll past
          rendering courses to find it. The active folder's tab sits flush
          with the panel beneath it — the rest read as folders behind it in a
          drawer — and each course inside still opens on demand, because a
          folder full of fifteen-module syllabi laid out flat is exactly the
          wall of text folders exist to avoid. */}
      <section className="bg-surface py-14 lg:py-20">
        <div className={SITE_CONTAINER}>
          <SectionTitle
            title="THE COURSES"
            align="left"
            subtitle="Ten full syllabi, filed by discipline. Open a folder, then a course, to see every module."
            className="mb-10"
          />

          {/* Folder tabs */}
          <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Course disciplines">
            {FOLDERS.map((folder, fi) => {
              const isActive = activeFolder === fi
              return (
                <button
                  key={folder.group}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    setActiveFolder(fi)
                    setOpenCourse(folder.courses[0].title)
                  }}
                  className={`montserrat font-700 relative z-10 flex items-center gap-2 border px-4 py-2.5 text-[12.5px] transition-colors ${
                    isActive
                      ? "-mb-px border-hairline border-b-white bg-white text-brand-ink"
                      : "border-transparent bg-slate-200/60 text-slate-500 hover:bg-slate-200"
                  }`}
                  style={{ borderTopLeftRadius: "6px", borderTopRightRadius: "6px" }}
                >
                  {isActive ? (
                    <FolderOpen size={14} strokeWidth={2.2} className="flex-none text-brand" aria-hidden="true" />
                  ) : (
                    <Folder size={14} strokeWidth={2.2} className="flex-none text-slate-400" aria-hidden="true" />
                  )}
                  {folder.group}
                  <span className="text-[10px] tabular-nums text-slate-400">{folder.courses.length}</span>
                </button>
              )
            })}
          </div>

          {/* Folder contents */}
          <div className="divide-y divide-hairline border border-hairline bg-white">
            {FOLDERS[activeFolder].courses.map((course, i) => {
              const isOpen = openCourse === course.title
              return (
                <div key={course.title}>
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpenCourse(isOpen ? null : course.title)}
                      aria-expanded={isOpen}
                      aria-controls={`course-panel-${course.title}`}
                      className="group flex w-full items-start gap-4 px-5 py-5 text-left sm:px-7"
                    >
                      <span
                        className="montserrat font-800 mt-0.5 flex-none text-[11px] tabular-nums transition-colors"
                        style={{ color: isOpen ? "var(--color-brand)" : "#cbd5e1" }}
                        aria-hidden="true"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      <span
                        className={`flex-none transition-[filter,opacity] duration-300 ${
                          isOpen ? "" : "opacity-85 grayscale-[30%] group-hover:opacity-100 group-hover:grayscale-0"
                        }`}
                      >
                        <span className="sm:hidden">
                          <ToolBadge tool={course.title} size={40} />
                        </span>
                        <span className="hidden sm:inline">
                          <ToolBadge tool={course.title} size={52} />
                        </span>
                      </span>

                      <span className="flex-1">
                        <span className="montserrat font-700 block text-[15px] leading-snug transition-colors" style={{ color: isOpen ? "var(--color-brand-ink)" : "var(--color-navy)" }}>
                          {course.title}
                        </span>
                        <span className="mt-1.5 block text-[13px] leading-relaxed text-slate-500">
                          {course.tagline}
                        </span>
                      </span>

                      <span
                        className={`mt-0.5 inline-flex h-7 w-7 flex-none items-center justify-center rounded-full border transition-all duration-300 ${
                          isOpen
                            ? "rotate-45 border-orange-300 bg-orange-50 text-orange-600"
                            : "border-slate-200 text-slate-500 group-hover:border-orange-300 group-hover:text-orange-500"
                        }`}
                        aria-hidden="true"
                      >
                        <Plus size={14} strokeWidth={2.4} />
                      </span>
                    </button>
                  </h3>

                  <div
                    id={`course-panel-${course.title}`}
                    className="grid transition-[grid-template-rows] duration-400 ease-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 pb-5 sm:px-7 sm:pl-14">
                        <p className="montserrat font-800 mb-2.5 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                          You will be able to produce
                        </p>
                        <ul className="flex flex-wrap gap-2">
                          {course.produces.map((item) => (
                            <li
                              key={item}
                              className="flex items-center gap-1.5 border border-orange-200 bg-orange-50 px-2.5 py-1 text-[12px] text-brand-ink"
                            >
                              <Check size={12} strokeWidth={2.6} className="flex-none text-brand" aria-hidden="true" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <p className="montserrat font-800 mb-2.5 px-5 text-[11px] uppercase tracking-[0.18em] text-slate-400 sm:px-7 sm:pl-14">
                        Syllabus
                      </p>
                      <ol className="grid gap-x-8 gap-y-2.5 px-5 pb-7 sm:grid-cols-2 sm:px-7 sm:pl-14">
                        {course.modules.map((module, mi) => (
                          <li
                            key={module}
                            className="flex items-baseline gap-3 text-[13px] leading-relaxed text-slate-600"
                          >
                            <span className="montserrat font-700 w-5 flex-none text-[11px] tabular-nums text-slate-400">
                              {String(mi + 1).padStart(2, "0")}
                            </span>
                            {module}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Work from the studio ─────────────────────────────────── */}
      <section className="py-14 lg:py-20">
        <div className={SITE_CONTAINER}>
          <SectionTitle
            title="WORK FROM OUR STUDIO"
            align="left"
            subtitle="Drawings and renders our own team produces on the software these courses teach — the standard every batch works towards."
            className="mb-10"
          />
          <ul className="grid grid-flow-dense grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {STUDIO_WORK.map((work) => (
              <li
                key={work.title}
                className={`group relative overflow-hidden border border-hairline bg-slate-100 ${
                  "wide" in work && work.wide ? "lg:col-span-2" : ""
                }`}
              >
                <img
                  src={work.src}
                  alt={work.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-60 w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] lg:h-72"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/90 via-navy/50 to-transparent px-4 pt-12 pb-4">
                  <span className="montserrat font-800 text-[10.5px] uppercase tracking-[0.18em] text-orange-400">
                    {work.kind}
                  </span>
                  <p className="font-600 mt-1 text-sm leading-snug text-white">{work.title}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── How to enrol ──────────────────────────────────────────── */}
      <section className="bg-surface py-14 lg:py-20">
        <div className={`${SITE_CONTAINER} max-w-2xl`}>
          <SectionTitle title="HOW TO ENROL" align="left" className="mb-6" />
          <p className="text-sm leading-7 text-slate-500">
            Batches are small and run at our Medinipur studio. Call{" "}
            <a href={SITE.phoneHref} className="font-600 text-brand-ink underline underline-offset-2">
              {SITE.phones[0]}
            </a>{" "}
            or write to{" "}
            <a href={`mailto:${SITE.email}`} className="font-600 text-brand-ink underline underline-offset-2">
              {SITE.email}
            </a>{" "}
            to check the next start date and fees for any course above.
          </p>
        </div>
      </section>
    </PageWrapper>
  )
}
