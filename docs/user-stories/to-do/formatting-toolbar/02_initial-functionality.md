# Implement Initial Toolbar Button: Bold

As a user, when the toolbar is visible, I should see a **Bold button** that allows me to apply bold formatting to text.

Clicking the button should toggle bold formatting for the selected text.

If my cursor is inside bold text, the button should appear **active**.

Clicking the button again should remove the formatting.

This story intentionally focuses on **only one formatting tool** so the core toolbar architecture can be implemented correctly.

Once bold works, additional tools will reuse the same patterns.

---

# Toolbar State

Before implementing buttons, create a **toolbarState object**.

This state tracks which formatting tools are active.

Do **not rely on CSS pseudo states like `:active`**.

Those only represent mouse interaction, not editor formatting state.

Example structure:

```ts
type ToolbarState = {
  bold: boolean
}
```

Example React state:

```
const [toolbarState, setToolbarState] = useState({
  bold: false
})
```

---

## Why explicit toolbar state is important

The toolbar must reflect the **actual formatting state of the editor**.

Examples:

| Situation                                     | Bold button state |
| --------------------------------------------- | ----------------- |
| Cursor inside bold text                       | active            |
| Bold formatting applied via keyboard shortcut | active            |
| Bold formatting removed                       | inactive          |

This cannot be handled with CSS alone.

The state must be synchronized with the editor.

---

# Acceptance Criteria

When the toolbar appears:

* the **Bold button is visible**
* no other buttons are shown

When clicking the Bold button with:

### A cursor only

The editor inserts:

```
**** 
```

with the cursor placed between the asterisks.

Example result:

```
**|**
```

(where `|` represents the cursor).

---

### Selected text

Example selection:

```
hello world
```

Clicking bold transforms it to:

```
**hello world**
```

---

### Removing bold

If text is already bold:

```
**hello world**
```

Clicking the bold button removes the formatting:

```
hello world
```

---

### Cursor inside bold text

If the cursor is inside:

```
**hello |world**
```

The **Bold button should appear active**.

Clicking it should remove the formatting.

---

### Keyboard shortcut (optional)

If keyboard shortcuts already exist:

```
Cmd + B
Ctrl + B
```

They should update the toolbar state.

If keyboard shortcuts are not implemented yet, this can be treated as a **stretch goal**.

---

# Important Implementation Note

The reason we implement **only the bold button first** is not because the rest are difficult.

It is because the first formatting command establishes:

* the command pattern
* the editor transaction logic
* the toolbar state system
* the UI button pattern

Once those pieces are working, most other tools become much simpler to add because they will reuse a lot of the same code and patterns.

Once finished, you should create a list of the next formatting tools to implement, in order of importance. And also, designate which ones are for MVP and which ones are stretch goals. For instance:

* headings - MVP
* orders lists - MVP
* unordered lists - MVP
* italic - MVP
* checklist - stretch goal
* quote blocks - stretch goal
* links - stretch goal (because it is a little more complex)
* image insert - stretch goal
* code blocks - stretch goal
