import { describe, expect, it } from "vitest";
import {
  ensureMarkdownExtension,
  getNameWithoutExtension,
  getParentFromTarget,
  getParentPath,
} from "./pathUtils";

describe("pathUtils", () => {
  it("gets parent path for unix and windows style paths", () => {
    expect(getParentPath("notes/daily/today.md")).toBe("notes/daily");
    expect(getParentPath("notes\\daily\\today.md")).toBe("notes\\daily");
  });

  it("returns empty string when no parent exists", () => {
    expect(getParentPath("readme.md")).toBe("");
  });

  it("resolves parent from file and directory metadata", () => {
    const file = {
      path: "notes/ideas.md",
      filename: "ideas.md",
      is_dir: false,
      size: 10,
      last_modified: 1,
    };

    const folder = {
      path: "notes/archive",
      filename: "archive",
      is_dir: true,
      size: 0,
      last_modified: 1,
    };

    expect(getParentFromTarget(file)).toBe("notes");
    expect(getParentFromTarget(folder)).toBe("notes/archive");
  });

  it("handles markdown extension helpers", () => {
    expect(getNameWithoutExtension("doc.md", false)).toBe("doc");
    expect(getNameWithoutExtension("folder", true)).toBe("folder");
    expect(ensureMarkdownExtension("Doc", false)).toBe("Doc.md");
    expect(ensureMarkdownExtension("doc.MD", false)).toBe("doc.MD");
    expect(ensureMarkdownExtension("assets", true)).toBe("assets");
  });
});
