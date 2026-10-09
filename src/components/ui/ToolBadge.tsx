import { TOOL_ICONS } from "@/data/toolIcons"

/**
 * A software mark on a square tile in the product's colour.
 *
 * Decorative: the tool's name always sits next to it in text, so the tile is
 * hidden from assistive technology rather than announced twice.
 */
export default function ToolBadge({ tool, size = 48 }: { tool: string; size?: number }) {
  const icon = TOOL_ICONS[tool]
  if (!icon) return null
  if (icon.kind === "image") {
    return (
      <img
        src={icon.src}
        alt=""
        aria-hidden="true"
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        className="inline-block flex-none object-cover shadow-sm"
        style={{ width: size, height: size }}
      />
    )
  }
  return (
    <span
      className="inline-grid flex-none place-items-center shadow-sm"
      style={{ width: size, height: size, background: icon.color }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" width={size * 0.56} height={size * 0.56} fill="#fff">
        <path d={icon.path} />
      </svg>
    </span>
  )
}
