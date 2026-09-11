/**
 * The wing motif, reduced to a rule.
 *
 * The logo already carries a full pair of wings. Repeating literal wing art
 * across the page would read as clip-art, so the motif survives here as a
 * single swept divider: two feathered strokes rising from a centre point.
 */
export default function WingRule({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`wing-rule ${className}`.trim()}
      viewBox="0 0 1200 14"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M0 12h470c40 0 80-3 118-9M1200 12H730c-40 0-80-3-118-9"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M540 8c22-4 42-5 60-5s38 1 60 5"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
