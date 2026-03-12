import { describe, expect, it } from "vitest";
import {
  getCytoscapeStylesheet,
  mapGraphDataToElements,
  stringToColor,
} from "./graphUtils";

describe("graphUtils", () => {
  it("generates deterministic colors from a string", () => {
    const a = stringToColor("project");
    const b = stringToColor("project");
    const c = stringToColor("work");

    expect(a).toEqual(b);
    expect(a.base).toMatch(/^hsl\(\d{1,3}, 70%, 60%\)$/);
    expect(c.h).not.toBe(a.h);
  });

  it("maps backend graph data into cytoscape elements", () => {
    const elements = mapGraphDataToElements({
      nodes: [
        { id: "a.md", label: "A", exists: true, orphan: false, tags: ["tag1"] },
        { id: "b.md", label: "B", exists: false, orphan: true, tags: [] },
      ],
      edges: [{ source: "a.md", target: "b.md", broken: true }],
    });

    expect(elements).toHaveLength(3);

    const firstNode = elements[0];
    expect(firstNode.data?.id).toBe("a.md");
    expect(firstNode.data?.baseColor).toMatch(/^hsl\(/);
    expect(firstNode.classes).toBe("");

    const secondNode = elements[1];
    expect(secondNode.classes).toBe("orphan");
    expect(secondNode.data?.baseColor).toBeUndefined();

    const edge = elements[2];
    expect(edge.data?.id).toBe("a.md->b.md");
    expect(edge.data?.broken).toBe(true);
  });

  it("builds a stylesheet with core selectors", () => {
    const stylesheet = getCytoscapeStylesheet();
    const selectors = stylesheet.map((rule) => rule.selector);

    expect(stylesheet.length).toBeGreaterThan(0);
    expect(selectors).toContain("node");
    expect(selectors).toContain("edge");
    expect(selectors).toContain("node.orphan");
  });
});
