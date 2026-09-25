import type {
  PluginSidebarThread,
  PluginSidebarThreadIndicator,
} from "@get-bb/plugin-sdk/app";
import { cn } from "./lib/utils";
import { BrailleSpinner } from "./BrailleSpinner";
import { relativeTimeLabel } from "./relative-time";

/**
 * The row's trailing slot: one fixed width, right-aligned, on every row.
 *
 * Fixed rather than intrinsic because both ages and live-status labels vary in
 * width. The slot holds "Needs you" without dragging the project column back
 * and forth as a thread changes state.
 */
export const STATUS_SLOT_CLASS = "flex w-16 shrink-0 items-center justify-end";

/**
 * The box every trailing glyph sits in, whatever its artwork measures.
 *
 * The status glyph, the provider glyph and a shelf's chevron all end a line at
 * the same inset, but they are drawn at different sizes. A shared box centres
 * each one on the same vertical axis, so right-aligning the boxes lines the
 * icons up instead of leaving them one or two pixels apart.
 */
export const TRAILING_GLYPH_BOX_CLASS =
  "flex size-3.5 shrink-0 items-center justify-center";

/**
 * Status OR age, never both: the glyph already implies the row is current, and
 * the age only earns its place once the thread has nothing to say.
 */
export function StatusOrTime({
  thread,
  now,
}: {
  thread: PluginSidebarThread;
  /** Quantized clock, shared by every row in one render. */
  now: number;
}) {
  const status = shortStatus(thread.indicator);
  if (status !== null) {
    return (
      // A fragment: the parents lay the slot out with flex, and the label
      // span stays exactly the label text so exact-text lookups keep
      // matching. The spinner is aria-hidden; the label owns the name.
      <>
        {status.animated ? (
          <BrailleSpinner className="mr-1 text-2xs" />
        ) : null}
        <span
          aria-label={thread.indicatorLabel ?? status.label}
          className={cn(
            "max-w-full truncate text-2xs font-medium",
            status.className,
          )}
        >
          {status.label}
        </span>
      </>
    );
  }
  return (
    <span className="tabular-nums text-2xs text-muted-foreground">
      {relativeTimeLabel(thread.updatedAt, now)}
    </span>
  );
}

function shortStatus(indicator: PluginSidebarThreadIndicator): {
  label: string;
  className: string;
  /** Live work gets the braille spinner beside its label. */
  animated: boolean;
} | null {
  switch (indicator) {
    case "unread-error":
      return {
        label: "Failed",
        className: statusToneClass(indicator),
        animated: false,
      };
    case "waiting-for-input":
      return {
        label: "Needs you",
        className: statusToneClass(indicator),
        animated: false,
      };
    case "unread-success":
      return {
        label: "Unread",
        className: statusToneClass(indicator),
        animated: false,
      };
    case "runtime":
      return {
        label: "Working",
        className: statusToneClass(indicator),
        animated: true,
      };
    case "workflow":
      return {
        label: "Workflow",
        className: statusToneClass(indicator),
        animated: true,
      };
    case "background-agent":
      return {
        label: "Agent",
        className: statusToneClass(indicator),
        animated: true,
      };
    case "background-command":
      return {
        label: "Command",
        className: statusToneClass(indicator),
        animated: true,
      };
    case "plan-mode":
      return {
        label: "Planning",
        className: statusToneClass(indicator),
        animated: true,
      };
    case "goal":
      return {
        label: "Goal",
        className: statusToneClass(indicator),
        animated: true,
      };
    case "draft":
      return {
        label: "Draft",
        className: statusToneClass(indicator),
        animated: false,
      };
    case "working-draft":
      return {
        label: "Drafting",
        className: statusToneClass(indicator),
        animated: false,
      };
    case "none":
      return null;
    default:
      return null;
  }
}

/** Status palette shared by cards and child-thread chips. */
export function statusToneClass(
  indicator: PluginSidebarThreadIndicator,
): string {
  switch (indicator) {
    case "unread-error":
      return "text-red-700 dark:text-red-300";
    case "waiting-for-input":
      return "text-indigo-600 dark:text-indigo-300";
    case "unread-success":
      return "text-emerald-700 dark:text-emerald-300";
    case "runtime":
    case "workflow":
    case "background-agent":
    case "background-command":
    case "plan-mode":
    case "goal":
      return "text-sky-600 dark:text-sky-400";
    case "draft":
    case "working-draft":
      return "text-amber-700 dark:text-amber-300";
    case "none":
    default:
      return "text-muted-foreground";
  }
}
