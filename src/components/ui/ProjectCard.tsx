import type { ReactNode } from "react"

interface ProjectCardProps {
  img: string
  alt: string
  /** Set on the first row of a grid so the largest visible image is not deferred. */
  priority?: boolean
  /** Candidate widths, so a phone does not download a desktop-sized crop. */
  srcSet?: string
  /** The slot's rendered width per breakpoint. Required for `srcSet` to help. */
  sizes?: string
  children?: ReactNode
}

/**
 * A photograph, optionally with a metadata block under it.
 *
 * The image sits in a fixed 4:3 box rather than a pixel height, so every card
 * in a row is the same shape at every breakpoint — the old fixed `height` left
 * the grid ragged once the columns narrowed. The zoom on hover is on the image
 * alone; the card itself does not move, because these now sit shoulder to
 * shoulder in a hairline grid where a lifting card would break the seams.
 */
export default function ProjectCard({ img, alt, priority = false, srcSet, sizes, children }: ProjectCardProps) {
  return (
    <article className="proj-card group">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={img}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      {children && <div className="flex flex-1 flex-col p-5">{children}</div>}
    </article>
  )
}
