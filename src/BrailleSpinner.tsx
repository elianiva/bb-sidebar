import { cn } from "./lib/utils";

/**
 * A terminal-style braille spinner (`⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏`), drawn as pixel
 * squares in proper SVG instead of text.
 *
 * The classic sequence only ever touches the top three rows, so the grid
 * is exactly that: 2×3, every square animating, no dead cells. Squares
 * instead of circles keep the pixelated feel, and vector shapes stay
 * crisp at any size — text glyphs depend on whatever braille coverage
 * the system font happens to have.
 *
 * Frame cycling is SMIL (`<animate>` with discrete steps), so the motion is
 * self-contained in the element with no timers and no global CSS. `fill`
 * defaults to `currentColor` so the caller's tone class paints it.
 *
 * Under `prefers-reduced-motion` the first frame renders statically with no
 * animation elements. The whole figure is `aria-hidden`: it always pairs
 * with a text label that owns the accessible name.
 */
const FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const FRAME_COUNT = FRAMES.length;
const CYCLE_SECONDS = (FRAME_COUNT * 80) / 1000;

// Braille bit i (0-5) is dot i+1. Dots 1-3 run down the left column,
// 4-6 down the right — the whole grid, since the sequence never leaves it.
const DOT_CELLS = [
  { col: 0, row: 0 },
  { col: 0, row: 1 },
  { col: 0, row: 2 },
  { col: 1, row: 0 },
  { col: 1, row: 1 },
  { col: 1, row: 2 },
];

const SQUARE = 3;
const GAP = 1;
const CELL_WIDTH = 2 * SQUARE + GAP;
const CELL_HEIGHT = 3 * SQUARE + 2 * GAP;

function dotOn(frame: string, dotIndex: number): boolean {
  const code = (frame.codePointAt(0) ?? 0x2800) - 0x2800;
  return (code & (1 << dotIndex)) !== 0;
}

const KEY_TIMES = Array.from(
  { length: FRAME_COUNT },
  (_, index) =>
    // Discrete steps switch exactly on frame boundaries; keep the fraction
    // exact so no frame lingers or drops.
    `${index / FRAME_COUNT}`,
).join(";");

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function BrailleSpinner({
  size = 14,
  className,
}: {
  /** Rendered height in pixels; the width follows the 7:11 cell ratio. */
  size?: number;
  className?: string;
}) {
  const animated = !prefersReducedMotion();
  return (
    <svg
      width={(size * CELL_WIDTH) / CELL_HEIGHT}
      height={size}
      viewBox={`0 0 ${CELL_WIDTH} ${CELL_HEIGHT}`}
      fill="currentColor"
      aria-hidden="true"
      data-braille-spinner=""
      className={cn("shrink-0", className)}
    >
      {DOT_CELLS.map((cell, dotIndex) => (
        <rect
          key={dotIndex}
          x={cell.col * (SQUARE + GAP)}
          y={cell.row * (SQUARE + GAP)}
          width={SQUARE}
          height={SQUARE}
        >
          {animated ? (
            <animate
              attributeName="opacity"
              values={FRAMES.map((frame) =>
                dotOn(frame, dotIndex) ? "1" : "0.15",
              ).join(";")}
              keyTimes={KEY_TIMES}
              dur={`${CYCLE_SECONDS}s`}
              calcMode="discrete"
              repeatCount="indefinite"
            />
          ) : null}
        </rect>
      ))}
    </svg>
  );
}
