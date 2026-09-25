// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { act } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { BrailleSpinner } from "./BrailleSpinner";

const FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("BrailleSpinner", () => {
  it("starts on the first frame and cycles one frame per interval", () => {
    vi.useFakeTimers();
    render(<BrailleSpinner />);
    expect(screen.getByText(FRAMES[0])).toBeDefined();
    act(() => {
      vi.advanceTimersByTime(80);
    });
    expect(screen.getByText(FRAMES[1])).toBeDefined();
    expect(screen.queryByText(FRAMES[0])).toBeNull();
  });

  it("wraps around after the last frame", () => {
    vi.useFakeTimers();
    render(<BrailleSpinner />);
    act(() => {
      vi.advanceTimersByTime(80 * FRAMES.length);
    });
    expect(screen.getByText(FRAMES[0])).toBeDefined();
  });

  it("stays on the first frame under reduced motion", () => {
    vi.useFakeTimers();
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    render(<BrailleSpinner />);
    act(() => {
      vi.advanceTimersByTime(80 * FRAMES.length);
    });
    expect(screen.getByText(FRAMES[0])).toBeDefined();
    expect(screen.queryByText(FRAMES[1])).toBeNull();
  });

  it("hides the animation from assistive technology", () => {
    vi.useFakeTimers();
    const { container } = render(<BrailleSpinner />);
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });

  it("clears its interval on unmount", () => {
    vi.useFakeTimers();
    const clearSpy = vi.spyOn(window, "clearInterval");
    const view = render(<BrailleSpinner />);
    view.unmount();
    expect(clearSpy).toHaveBeenCalledTimes(1);
  });
});

