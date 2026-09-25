import { useEffect, useState } from "react";
import { cn } from "./lib/utils";

/**
 * A braille spinner: the classic terminal frames `⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏`
 * cycling at an 80ms cadence.
 *
 * One character, no assets, no dependencies, and crisp at any size — the
 * right shape for a 2xs status slot where a pixel-grid animation would be a
 * blurry smudge. Pair it with a static text label (kept outside this
 * component) so the meaning stays readable and screen-reader output stays
 * quiet: this span is `aria-hidden`, and the label carries the `aria-label`.
 *
 * Under `prefers-reduced-motion` it renders the first frame statically and
 * never starts the interval.
 */
const BRAILLE_FRAMES = [
  "⠋",
  "⠙",
  "⠹",
  "⠸",
  "⠼",
  "⠴",
  "⠦",
  "⠧",
  "⠇",
  "⠏",
] as const;

const FRAME_INTERVAL_MS = 80;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function BrailleSpinner({ className }: { className?: string }) {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = window.setInterval(() => {
      setFrame((current) => (current + 1) % BRAILLE_FRAMES.length);
    }, FRAME_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span aria-hidden="true" className={cn("inline-block", className)}>
      {BRAILLE_FRAMES[frame]}
    </span>
  );
}
