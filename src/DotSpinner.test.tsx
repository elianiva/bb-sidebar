// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { DotSpinner } from "./DotSpinner";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("DotSpinner", () => {
  it("draws an eight-dot ring at the requested size", () => {
    const { container } = render(<DotSpinner size={20} />);
    const svg = container.querySelector("[data-dot-spinner]");
    expect(svg?.getAttribute("width")).toBe("20");
    expect(svg?.getAttribute("height")).toBe("20");
    expect(svg?.querySelectorAll("circle")).toHaveLength(8);
  });

  it("staggers each dot's animation around the cycle", () => {
    const { container } = render(<DotSpinner />);
    const begins = [...container.querySelectorAll("animate")].map((node) =>
      node.getAttribute("begin"),
    );
    expect(begins).toEqual([
      "0s",
      "-0.125s",
      "-0.25s",
      "-0.375s",
      "-0.5s",
      "-0.625s",
      "-0.75s",
      "-0.875s",
    ]);
  });

  it("hides the animation from assistive technology", () => {
    const { container } = render(<DotSpinner />);
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });

  it("renders static dots with no animation under reduced motion", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    const { container } = render(<DotSpinner />);
    expect(container.querySelectorAll("circle")).toHaveLength(8);
    expect(container.querySelectorAll("animate")).toHaveLength(0);
  });
});
