// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { BrailleSpinner } from "./BrailleSpinner";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("BrailleSpinner", () => {
  it("draws a 2x4 pixel grid at the requested height", () => {
    const { container } = render(<BrailleSpinner size={15} />);
    const svg = container.querySelector("[data-braille-spinner]");
    expect(svg?.getAttribute("height")).toBe("15");
    expect(svg?.getAttribute("viewBox")).toBe("0 0 7 15");
    expect(svg?.querySelectorAll("rect")).toHaveLength(8);
  });

  it("steps every square through the ten braille frames", () => {
    const { container } = render(<BrailleSpinner />);
    const animations = [...container.querySelectorAll("animate")];
    expect(animations).toHaveLength(8);
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
  });

  it("hides the animation from assistive technology", () => {
    const { container } = render(<BrailleSpinner />);
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });

  it("renders the first frame statically under reduced motion", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    const { container } = render(<BrailleSpinner />);
    expect(container.querySelectorAll("rect")).toHaveLength(8);
    expect(container.querySelectorAll("animate")).toHaveLength(0);
  });
});
