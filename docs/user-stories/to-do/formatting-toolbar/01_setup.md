# Creating the Formatting Toolbar Container and Visibility State

As a user, when I am **not editing a note**, I should not see any formatting toolbar.

When I click into the editor and the editor enters **edit mode**, I should see a **vertical formatting toolbar appear on the right side of the screen**.

The toolbar should adhere to the following:

Style:
* be a rectangular container that can hold multiple formatting buttons (maybe start with 25px wide and 75px tall)
* have a background color that is a **little** darker than the page background (maybe something like `#f1f1f1`)
* have a thin border to visually separate it from the page (e.g. `1px solid #d1d1d1`)
* optional: have a subtle shadow to make it feel like a floating element (e.g. `box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)`)

Placement:
* be vertically oriented
* remain visible while I scroll
* stay centered vertically in the viewport
* disappear again when I leave edit mode

This ensures the toolbar is available when editing, but never distracts from reading.

---

## Acceptance Criteria

When the editor is **not focused**:

* the toolbar is not rendered

When the editor **enters edit mode**:

* the toolbar container appears
* the toolbar is positioned on the **right side of the page**
* the toolbar is **vertically oriented**
* the toolbar stays visible while scrolling

When the editor **loses focus or exits edit mode**:

* the toolbar disappears

---

## Suggested Component Structure

The toolbar should be a **separate component from the editor**.

This keeps editor logic and UI logic cleanly separated.

Recommended structure:

```
EditorShell
├── MarkdownEditor (CodeMirror)
├── EditorToolbarContainer
│   └── EditorToolbar
│       └── ToolbarButton(s)
```

Or visually:

```
EditorShell
 ├─ EditorArea
 │   └─ CodeMirror Editor
 │
 └─ ToolbarRail (sticky)
     └─ ToolbarContainer
         └─ ToolbarButtons
```

### Suggested Component Names

| Component        | Purpose                |
| ---------------- | ---------------------- |
| `EditorShell`    | layout wrapper         |
| `MarkdownEditor` | CodeMirror instance    |
| `EditorToolbar`  | toolbar UI             |
| `ToolbarButton`  | individual tool button |

---

## Suggested CSS Layout

The toolbar should **not live inside the editor DOM**.

Instead it should live in the **layout container** so it can be positioned easily.

Example layout approach:

```
.editor-shell
  display: grid
  grid-template-columns: 1fr 72px
```

Toolbar rail:

```
.editor-toolbar
  position: sticky
  top: 50%
  transform: translateY(-50%)
```

Key CSS properties to experiment with:

| Property                      | Why                     |
| ----------------------------- | ----------------------- |
| `position: sticky`            | keeps toolbar visible   |
| `top: 50%`                    | centers vertically      |
| `transform: translateY(-50%)` | true vertical centering |
| `flex-direction: column`      | vertical layout         |
| `gap`                         | spacing between buttons |

---

## Suggested Data Flow

The editor should control whether the toolbar is visible.

Example logic:

```
isEditorFocused → showToolbar
```

Possible implementation:

```
const [isEditing, setIsEditing] = useState(false)
```

Events:

```
editor focus → setIsEditing(true)
editor blur → setIsEditing(false)
```

## Stretch Goal: Animated State Transitions

For a polished feel, consider adding simple animations when the toolbar appears and disappears. This can be achieved with CSS transitions or a library like Framer Motion. And should be simple, like the toolbar either fading in or sliding in from the side. But this is a stretch goal and not required for the initial implementation. I would only consider this if things like this are things you love to do and want to practice, and if the core functionality is already solid.