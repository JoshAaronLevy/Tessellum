# Code Review

First off: this is a really strong capstone direction.

There is a lot here that is genuinely impressive, especially for a student project: local-first storage, a Markdown editor, graph view, templates, wikilinks, a plugin system, Tauri desktop app structure, and some thoughtful UX ideas already in place. That is not small stuff.

To keep things manageable, I organized the feedback by priority. If you only have limited time before the demo, start from the top and work your way down.

---

# Stage 1: 🚨 Fix This IMMEDIATELY (Demo-Blocking)

## TitleBar resize listener bug (causes runaway event loop)

When I first launched the app, it immediately froze the UI and started hammering the call stack.

Within about 20–30 seconds there were **thousands of calls firing**, and it started impacting my entire machine (other apps stopped responding). This kind of issue is extremely problematic, especially in a desktop app, because your app completely froze instantly (I was stuck on the opening page no matter what), I had very limited ability to open dev tools and debug, because it was happening so fast and just locked up the app, and drastically slowed down other apps on my machine, because of the CPU overload.

I do NOT want this to happen to you when you are demoing it. That would be crushing, especially with such a promising project.

### The root cause

The issue comes from the `useEffect` in `TitleBar.tsx`.

The original code listens to the window resize event like this:

```ts
const unlisten = appWindow.listen('tauri://resize', checkMaximized);
```

Every resize event calls `checkMaximized`, which calls:

```
await appWindow.isMaximized()
setIsMaximized(...)
```

This combination can easily create a **feedback loop** where the window state update triggers another resize event, which calls the effect again, which triggers another update, and so on.

In practice this resulted in:

* thousands of repeated calls
* massive event spam
* the UI completely freezing

This is a **show-stopping bug** because it can happen immediately when the app launches.

If this happens during your presentation demo, the entire app could freeze before you can show anything.

### How I fixed it in this branch

Instead of constantly listening to resize events, the fix simply checks the window state when the component mounts and when the maximize button is pressed.

That removes the event loop entirely.

Example of the safer pattern:

```ts
const appWindow = getCurrentWindow();

useEffect(() => {
  const checkMaximized = async () => {
    try {
      const maximized = await appWindow.isMaximized();
      setIsMaximized(maximized);
    } catch (e) {
      console.error(e);
    }
  };

  checkMaximized();
}, [appWindow]);
```

Then the maximize button explicitly updates the state after toggling:

```
await appWindow.toggleMaximize()
setIsMaximized(await appWindow.isMaximized())
```

This should be fixed **before anything else**.

---

# Stage 2: highest-value fixes

After fixing the TitleBar issue above, these are the next most important improvements.

---

## 1) Prevent losing edits when switching notes or closing the app

Right now the editor saves on a debounce (`setTimeout(..., 1000)`).

That part is fine. The problem is what happens if the user:

* types something
* immediately clicks another note
* closes the app
* switches views quickly

A pending save can get cleared before it writes, which means the user can lose their most recent changes.

That kind of bug hurts trust fast in a note-taking app.

### What to do

* Flush pending saves when switching notes.
* Flush on editor blur if there are unsaved changes.
* Flush on app close/unmount if possible.
* Consider tracking `isDirty` for real and using it to control save behavior.

### Why this matters

A note app can survive small UI issues.

It **cannot survive “sometimes my text disappears.”**

---

## 2) Be careful with vault watchers / repeated refresh work

Opening a vault triggers:

* `watch_vault`
* a full file tree refresh
* file change listeners
* periodic syncs

This works, but systems like this can easily end up doing **more work than intended**.

Risks include:

* duplicate watchers
* redundant full refreshes
* graph reloads on every change
* sluggish performance as vaults grow

### What to do

* Ensure watchers are cleaned up when vaults change.
* Debounce bursts of file events.
* Prefer targeted updates instead of full refreshes where possible.

### Why this matters

Performance issues often feel minor early, then get dramatically worse as the project grows.

---

## 3) Fix note creation from graph nodes so files are created in the correct location

Double-clicking a missing graph node creates a new note.

That’s a great feature idea.

But the current implementation seems to derive the note title from the filename and then call `create_note` in a way that can create the new file **in the wrong location**.

For example, if the node represents something nested, the file may not be created in the intended folder.

### What to do

* Preserve path information when creating notes from graph nodes.
* If a node only has a name, create it in a clearly defined default location.
* If it represents a path, pass that path to the backend.

### Why this matters

This is exactly the kind of feature people try during a demo.

When it works, it feels magical.
When it creates files in random places, it feels broken.

---

## 4) Fix modal flow so failed actions do not look successful

`InputModal` currently closes immediately on submit.

That means if a create/rename action fails asynchronously, the modal may disappear before the user can correct the input.

### What to do

* Let the parent decide when the modal closes.
* Keep the modal open if the async action fails.
* Show the error and let the user fix the value.

### Why this matters

This small change immediately makes the app feel more polished.

---

## 5) Replace obvious `any` usages

There are several `any` types in places like:

* plugin/event APIs
* graph animation config
* frontmatter parsing
* editor helpers

For a capstone project, functionality matters more than perfect typing. But professors often look for TypeScript discipline.

### Recommendation

Time-box this.

Replace the most visible `any`s first:

* public APIs
* shared types
* plugin interfaces
* reusable helpers

That gives the biggest credibility boost for the least effort.

---

# Stage 3: Important fixes after that

## Remove or disable buttons that do nothing yet

There are some UI controls that appear active but do nothing yet.

Examples:

* back / forward
* search
* settings
* trash

A dead button is worse than no button.

### Recommendation

Either:

* hide unfinished buttons for the demo, or
* disable them visually and label them "coming soon".

This is an easy polish win.

---

## Persist more session state

Right now the vault path persists, which is good.

You could also persist:

* last opened note
* sidebar open/closed state
* expanded folders
* selected view mode

That helps the app feel like a real desktop tool instead of a prototype.

---

## Be deliberate about store updates vs backend refreshes

Some actions update local state immediately while also relying on backend watcher refreshes.

That can create duplicate updates or UI flicker.

Try to be consistent about which actions are:

* optimistic updates
* backend-confirmed updates

Consistency here makes bugs easier to reason about.

---

## Revisit effect dependencies and initialization patterns

Some patterns work but are fragile long term.

Examples:

* singleton checks like `(TessellumApp as any)._instance`
* effects depending on `editorRef.current?.view`
* repeated listener setup in components that re-render often

These are not urgent problems, but they are good cleanup targets later.

---

## Add a small set of tests

You do not need huge coverage.

A handful of tests is enough to show good engineering discipline.

Good targets include:

* path helpers
* graph mapping utilities
* rename/path edge cases
* frontmatter parsing
* filename normalization

I added some starter tests in this branch to show how they could look.

---

# Stage 4: Nice improvements that help the project feel complete

## Improve the README

The README currently explains architecture well, which is great.

For a capstone/demo project it should also quickly answer:

* What is Tessellum?
* What makes it interesting?
* What are the core features?
* What does it look like?

Easy upgrades:

* logo at the top
* 3–5 screenshots or GIFs
* a "Key Features" section
* a short "Why I built this" section

This makes the repo feel much more polished.

---

## Add a small roadmap or release notes file

A simple `ROADMAP.md` or `RELEASE-NOTES.md` showing:

* completed features
* near-term fixes
* future ideas

A good example would be something like:

```md
# Release Notes

## v0.1 - Demo Release

### Planned Features

- Update base styling and UI polish in sidebar
- Improve persistence of session state (last opened note, sidebar state, and window size are the priorities)

### Bug Fixes

- Fix TitleBar resize listener bug (causes runaway event loop) - **critical for demo**
- Fix `any` type references

### Technical Improvements

- Implement core front-end tests
- Implement `Husky` to enforce tests are run before commits can be pushed
```

This signals strong product thinking, not frantic coding.

---

# A realistic plan

I know there are some features you want to add before the demo, and you should do so. So let's be smart about how to manage your time.

My suggestion:
 - Before ANYTHING, fix the TitleBar resize bug. That is a demo-blocker and can make the app look completely broken.
 - After that, review the rest of the feedback and order them starting with the things you LEAST want to do first.
  - This is important because you want to get the most painful or least fun stuff out of the way first, so you can build momentum and end on a high note. I only learned this after about 8 years of development. This trick will help you be the best dev you can be, and manage your energy and motivation better.
 - Every day you sit down to work on the project, before writing a single line of code for a feature, knock out just one thing on the list (the thing at the top that you want to do the least).
  - Don't spend more than an hour on it. If it is taking longer, then just commit what you have, then move on to the feature you're excited about. And just commit to coming back to it at the end of implementing the feature for no more than 30 minutes. That way you don't get burned out spinning your wheels and wasting a day on something that isn't rewarding. But you're still staying on top of the important fixes and making steady progress on them.
  - If you get totally blocked on any of these, as long as it's not a bug that will possibly break the demo, then just make a note of it somewhere visible, that way whoever is grading the project can see you're aware of it and can tell you actually did put a lot of effort into trying to fix it, and still plan on fixing it after the demo when you have more time to work on it.

That gives the biggest improvement in reliability and polish, while still letting you build the features you want to show off in the demo, and keeping your motivation high.

---

# Final thoughts

This project has real potential. Just because there are a lot of suggestions and notes does not mean it is a bad idea or the code sucks. If I did think that, I wouldn't have written a review this in-depth. Nice work.