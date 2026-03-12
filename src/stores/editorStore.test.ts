import { beforeEach, describe, expect, it } from "vitest";
import { useEditorStore } from "./editorStore";

function makeFile(path: string, filename: string) {
  return {
    path,
    filename,
    is_dir: false,
    size: 1,
    last_modified: Date.now(),
  };
}

describe("editorStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useEditorStore.setState({
      vaultPath: null,
      files: [],
      activeNote: null,
      expandedFolders: {},
      isSidebarOpen: true,
      viewMode: "editor",
      isLocalGraphOpen: false,
      selectedGraphNode: null,
    });
  });

  it("persists and clears vault path", () => {
    const { setVaultPath } = useEditorStore.getState();

    setVaultPath("/vault");
    expect(useEditorStore.getState().vaultPath).toBe("/vault");
    expect(localStorage.getItem("vaultPath")).toBe("/vault");

    setVaultPath(null);
    expect(useEditorStore.getState().vaultPath).toBeNull();
    expect(localStorage.getItem("vaultPath")).toBeNull();
  });

  it("toggles folder state and accepts forced expand/collapse", () => {
    const { toggleFolder } = useEditorStore.getState();

    toggleFolder("notes");
    expect(useEditorStore.getState().expandedFolders.notes).toBe(true);

    toggleFolder("notes");
    expect(useEditorStore.getState().expandedFolders.notes).toBe(false);

    toggleFolder("notes", true);
    expect(useEditorStore.getState().expandedFolders.notes).toBe(true);
  });

  it("renames files and updates active note when needed", () => {
    const oldPath = "notes/a.md";
    const newPath = "notes/renamed.md";
    const { renameFile } = useEditorStore.getState();

    useEditorStore.setState({
      files: [makeFile(oldPath, "a.md"), makeFile("notes/b.md", "b.md")],
      activeNote: makeFile(oldPath, "a.md"),
    });

    renameFile(oldPath, newPath, "renamed.md");

    const { files, activeNote } = useEditorStore.getState();
    expect(files.find((f) => f.path === newPath)?.filename).toBe("renamed.md");
    expect(activeNote?.path).toBe(newPath);
    expect(activeNote?.filename).toBe("renamed.md");
  });
});
