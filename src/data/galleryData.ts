/**
 * Gallery imagery.
 *
 * The Exterior, Architecture, 3D Design and Renovation galleries are empty
 * and show "Coming soon" until the company's own project photographs are
 * ready. Add them as `{ src, alt }` pairs, importing the files from
 * `src/imports` the way `interiorProjects.ts` does, and the grid appears
 * again automatically. Write the alt text for the actual project.
 */
export type GalleryImage = {
  src: string
  /** Describes the photograph. Never left blank — these are content, not decoration. */
  alt: string
}

/** No responsive candidates for locally bundled images. */
export const gallerySrcSet = (_src: string): string | undefined => undefined

export const exteriorImgs: GalleryImage[] = []
export const archImgs: GalleryImage[] = []
export const d3Imgs: GalleryImage[] = []
export const renoImgs: GalleryImage[] = []
