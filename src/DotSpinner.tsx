import { cn } from "./lib/utils";

/**
 * A dot-ring spinner: eight dots on a circle fading in sequence, drawn as
 * proper SVG so it stays crisp at any size.
 *
 * The animation is SMIL (`<animate>`), not CSS: this plugin ships no global
 * stylesheet for keyframes, and SMIL keeps the motion self-contained in the
 * element. `fill` defaults to `currentColor` so the caller's tone class
 * paints it.
 *
 * Under `prefers-reduced-motion` the dots render statically at full opacity
 * with no animation elements. The whole figure is `aria-hidden`: it always
 * pairs with a text label that owns the accessible name.
 */
const DOT_COUNT = 8;
const CYCLE_SECONDS = 1;
const CENTER = 8;
const RING_RADIUS = 6;
const DOT_RADIUS = 1.5;

const DOTS = Array.from({ length: DOT_COUNT }, (_, index) => {
  const angle = (index / DOT_COUNT) * Math.PI * 2 - Math.PI / 2;
  return {
    cx: Math.round((CENTER + RING_RADIUS * Math.cos(angle)) * 100) / 100,
    cy: Math.round((CENTER + RING_RADIUS * Math.sin(angle)) * 100) / 100,
    // Negative begins start each dot partway through the cycle, so the ring
    // reads as rotating from the first frame instead of fading in together.
    begin: index === 0 ? "0s" : `-${index * (CYCLE_SECONDS / DOT_COUNT)}s`,
  };
});

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function DotSpinner({
  size = 14,
  className,
}: {
  /** Rendered width and height in pixels. */
  size?: number;
  className?: string;
}) {
  const animated = !prefersReducedMotion();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      data-dot-spinner=""
      className={cn("shrink-0", className)}
    >
      {DOTS.map((dot) => (
        <circle key={dot.begin} cx={dot.cx} cy={dot.cy} r={DOT_RADIUS}>
          {animated ? (
            <animate
              attributeName="opacity"
              values="1;0.15;1"
              keyTimes="0;0.5;1"
              dur={`${CYCLE_SECONDS}s`}
              begin={dot.begin}
              repeatCount="indefinite"
            />
          ) : null}
        </circle>
      ))}
    </svg>
  );
}
