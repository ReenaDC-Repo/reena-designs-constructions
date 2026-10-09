const MAX = 5

/**
 * A rating out of five.
 *
 * Previously this rendered exactly `rating` stars and nothing else, so a
 * 3-star review drew three stars and read as a perfect score. All five are
 * always drawn; the unearned ones stay grey.
 */
export default function StarRating({ rating, max = MAX }: { rating: number; max?: number }) {
  const filled = Math.max(0, Math.min(Math.round(rating), max))

  return (
    <div className="flex gap-1" role="img" aria-label={`Rated ${filled} out of ${max}`}>
      {Array.from({ length: max }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill={i < filled ? "var(--color-brand)" : "#dbe1ea"}
          aria-hidden="true"
        >
          <path d="M8 1.5l2 4.5L15 7l-3.5 3.4.8 5L8 13l-4.3 2.4.8-5L1 7l5-.5L8 1.5z" />
        </svg>
      ))}
    </div>
  )
}
