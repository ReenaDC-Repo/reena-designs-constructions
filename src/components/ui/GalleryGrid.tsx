import ProjectCard from "./ProjectCard"
import { gallerySrcSet, type GalleryImage } from "@/data/galleryData"
import { CARD_SIZES } from "@/data/images"

/**
 * A wall of photographs.
 *
 * Full-bleed and divided by `gap-px` hairline seams rather than a row of
 * gapped, rounded cards — the same ledger the rest of the site uses. For a
 * gallery it also means the imagery reads as one continuous body of work
 * instead of a set of separate objects.
 */
export default function GalleryGrid({ images }: { images: GalleryImage[]; title?: string }) {
  return (
    <div className="grid grid-cols-2 gap-px border-y border-hairline bg-hairline md:grid-cols-3 lg:grid-cols-4">
      {images.map(({ src, alt }, i) => (
        /* The alt text is written per photograph in `galleryData` rather than
           generated from the index here. It is what a search engine and a
           screen reader both index the image by, and twenty copies of one
           sentence with the number changed serve neither. */
        <ProjectCard
          key={src}
          img={src}
          srcSet={gallerySrcSet(src)}
          sizes={CARD_SIZES}
          alt={alt}
          priority={i < 4}
        />
      ))}
    </div>
  )
}
