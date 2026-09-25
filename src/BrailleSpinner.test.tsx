// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { BrailleSpinner } from "./BrailleSpinner";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("BrailleSpinner", () => {
  it("draws a 2x3 pixel grid at the requested height", () => {
    const { container } = render(<BrailleSpinner size={14} />);
    const svg = container.querySelector("[data-braille-spinner]");
    expect(svg?.getAttribute("height")).toBe("14");
    expect(svg?.getAttribute("viewBox")).toBe("0 0 7 11");
    expect(svg?.querySelectorAll("rect")).toHaveLength(6);
  });

  it("steps every square through the ten braille frames", () => {
    const { container } = render(<BrailleSpinner />);
    const animations = [...container.querySelectorAll("animate")];
    expect(animations).toHaveLength(6);
    for (const node of animations) {
      expect(node.getAttribute("calcMode")).toBe("discrete");
      expect(node.getAttribute("dur")).toBe("0.8s");
      // One opacity step per frame.
      expect(node.getAttribute("values")?.split(";")).toHaveLength(10);
    }
    // The top-left square is filled in the first frame (⠋) and empty in
    // the fourth (⠸): the schedule actually walks the classic sequence.
    expect(animations[0]?.getAttribute("values")?.split(";")).toEqual([
      "1",
      "1",
      "1",
      "0.15",
      "0.15",
      "0.15",
      "0.15",
      "1",
      "1",
      "1",
    ]);
    // Every square lights up at least once: no dead cells.
    for (const node of animations) {
      expect(node.getAttribute("values")).toContain("1");
    }
  });

  it("hides the animation from assistive technology", () => {
    const { container } = render(<BrailleSpinner />);
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });

  it("renders the first frame statically under reduced motion", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    const { container } = render(<BrailleSpinner />);
    expect(container.querySelectorAll("rect")).toHaveLength(6);
    expect(container.querySelectorAll("animate")).toHaveLength(0);
  });
});
