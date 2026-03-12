# UI Feedback

First: the app already has a strong foundation.

The overall concept is cool, the branding is memorable, and the product direction feels more thoughtful than the average student project. The goal now is not to reinvent the UI. It is to make the current experience feel more polished, more obvious, and more confidence-inspiring.

So I’d focus on a handful of changes that make the app easier to understand in the first 10 seconds.

---

## Biggest UI wins to prioritize first

### 1) Merge the welcome screen and the real app shell

Right now the “Open Tessellum / Open Vault” screen adds an extra step before the user gets into the actual product.

For a note-taking app, that creates friction right at the moment when the user should feel momentum.

**Recommendation:**
- Keep the main app shell visible immediately.
- If no vault is open yet, show a clean empty state inside the editor area.
- Put the primary action there: `Open Vault`.
- Also add an `Open Vault` or `Switch Vault` action in the sidebar/header.

That gives you the best of both worlds:
- lower friction for the user,
- and a more polished “real app” feel.

**Additional Notes**:

If this opening screen is a placeholder for a future feature where it's like a feature stepper for users (they click next through a handful of highlights of what they can do with it) before they use the app, I actually strongly advise against this approach for these reasons:
  - The vast majority of users just quickly try skip to the end to get into the app as quickly as possible, and can even find these annoying nowadays.
  - A good UX dev will create a really slick feature stepper when opening the app. But a great UX dev will design their app in a way that makes even non-technical users have an easy time playing around with it and discovering options and features on their own.
  - **Exceptions**: If you do really want an opening screen like this, it can be useful if it has a list of the 5 or 10 most recent projects a user has worked on (sorted by newest first) that they can click on and resume quickly and easily, along with a button above it to create a new vault. OR if you plan on having this restricted behind an auth wall at some stage, where users absolutely must be signed up or logged in to use the app at all, then this can be a good and effective login/signup page.

---

### 2) Make the sidebar feel like a real navigation area

The sidebar is functional, but visually it still feels a little too close to the editor area. Not close in proximity or distance, but rather it doesn't REALLY FEEL like a standalone element.

**Easy upgrades with big payoff:**
- give the sidebar a slightly different background than the editor.
- add the app logo at the very top of the sidebar.
- show the current vault/project name near the top (above the file tree and folders, but below the button to create new file).
- tighten spacing consistency between icons, labels, and buttons.

This will instantly make the app feel more intentional and easier to scan.

---

### 3) Add a clear “Switch/Open Vault” action

Once a vault is open, there should be an obvious way to switch to a different one.

Right now the app remembers the last folder, which is good, but users also need a clear escape hatch.

**Recommendation:**
Add a top-level action such as:
- `Open Vault`
- `Switch Vault`
- or `Open Folder`

Put it somewhere obvious in the sidebar or header.

---

### 4) Make sure every visible button earns its place

A few buttons look clickable but don’t do anything yet.

That weakens trust fast.

If something is not implemented yet, either:
- hide it for now (I recommend this over anything else).
- or disable it and label it clearly as coming soon.

This especially applies to things like:
- back / forward
- search
- settings
- trash

For a demo, fewer working controls is much better than more fake ones. Also, your app is solid as it is, and you have plenty of time to strengthen it. You should be feeling good enough about the stuff you've done that does work to not feel like you need the phantom buttons in order for it to look like a good or real app.

---

### 5) Rework the “New File” split button

This is one of the clearest UX mismatches.

The chevron implies extra options, but the main button behavior and dropdown behavior are not communicating that cleanly yet.

**Two good options:**

**Option A — simplest:**
- make `New File` a normal button.
- remove the chevron until there is a true dropdown.

**Option B — better long-term:**
- rename it to `Add New`.
- use the dropdown for `File`, `Folder`, and `From Template`.
- remove redundant buttons next to it.

If time is short, do Option A. It is the fastest path to cleaner UX.

---

## Polishing changes that would noticeably improve the experience

### 6) Reopen the last note automatically

This is a small feature with a very “desktop app” payoff.

If the app already remembers the vault, it should ideally also remember:
- the last opened note,
- maybe the last expanded folders,
- and optionally the last view.

That makes the app feel thoughtful instead of temporary.

---

### 7) Persist window size/position

This is not required for the capstone, but it is a great polish feature if you have time.

Desktop users love when an app opens where they left it.

It is one of those details that people rarely praise explicitly, but they definitely feel it when it is missing.

---

### 8) Add stronger visual focus to the editor area

The editor is already minimal, which is good. But there is a line where “minimal” starts to feel “empty.” And if it feels empty, it feels unimportant, which can make users feel unsure about where to start, or at minimum, their attention is not being drawn to the most important part of the app.

The blank writing area could use just a little more intention, especially when no note is open yet or a new note is empty.

**Ideas:**
- a subtle empty-state prompt,
- a tiny hint row with Markdown shortcuts,
- a soft placeholder that encourages the first sentence,
- a more deliberate empty-state layout when nothing is selected.

This helps reduce that “staring at a giant blank white rectangle” feeling.

**Awesome Bonus**:
- Add a Markdown-focused WYSIWYG editor, for users who don't know Markdown syntax, but want to be able to do things like different headings, bold, italic, etc.
  - How to impress with this: WYSIWYG editors are used so much, they often feel like they detract from the aesthetic value, because they are rarely presented in a way that is aesthetically impressive, along with also feeling "out of the way" (they often feel "in the way" of where the user wants to be working). The solution? Instead of a boring old horizontal formatting bar across the top, make it a vertical one on the far right of the screen that scrolls with the user. This way, you still are offering this feature and functionality, but in a way that is more visually interesting, thought-out, and impressive in general.

---

### 9) Improve spacing and alignment consistency

This sounds small, but it matters more than people think.

I’d specifically tighten:
- spacing between file/folder icons and labels
- button padding consistency
- alignment of sidebar controls
- visual rhythm between header, tree, and footer sections

A student project can look dramatically more mature just by getting spacing consistent.

---

### 10) Make the current vault context more obvious

Show the current vault/project name clearly above the file tree.

That does two useful things:
- it grounds the user,
- and it makes the app feel more complete.

For a tool built around opening a folder/vault, the current vault should be visible, not implied.

---

## Feature ideas worth considering only after the core polish

### Templates

Template support is already a nice differentiator.

A strong next step would be:
- keep user templates in `.tessellum/templates`,
- but also ship a few built-in starter templates.

That helps first-time users immediately understand the value.

Good starter templates might be:
- daily note
- meeting notes
- project brief
- reading notes
- task list

You can also sprinkle in a couple fun or personality-driven templates. A lot of modern apps do this because it makes the product feel more approachable and enjoyable to explore. It doesn’t make the app less serious — in many cases it actually makes people use it more, because it feels like a tool made by humans instead of a sterile productivity machine.

Since this app will likely be used by students and younger users, a few lighthearted templates can make the first-time experience more memorable and might even encourage people to experiment with the app a bit more.

A few ideas:

- “Procrastination Plan” – why do we only have to have lists for things we will do? This template lets a user make a list of things they should do, but won't do, and what they will likely do instead. They are only allowed to check something off as `Complete` if they procrastinated and did something else instead. If they completed a task on time and responsibly, then it's considered a failure.
- "Meeting/Classroom Reality Check" - this is a template with some serious sections that are very usable in a meeting or classroom context, but also has some fun sections that make it a little more fun. For instance, there can be several placeholder sections, but with each section, there is a subsection titled `What I was actually thinking about during this part...` where a user can jot down the random and funny things they were thinking about instead of paying attention.

The key is not to add dozens of these — just 2–3 playful ones alongside the practical templates. It adds a little personality and makes the app feel more alive when someone first opens it.

---

### Graph view presentation

Graph view is a presentation feature as much as a functional one.

That means it should feel especially polished during a demo.

A few improvements that would help:
- clearer empty/loading states,
- a little more structure in the panel/header,
- confidence that clicking or double-clicking nodes always behaves predictably.

This is one of the features that can make people say “whoa,” so it is worth tightening.

---

### Themes

Not just dark/light, but a few tasteful named themes like:
- Warm Paper
- Graphite
- Ocean

This is a smart stretch feature because it adds personality without requiring the user to configure fifty settings.

But I would still put it after the core UX fixes above.

---

### Tabs / multi-note workflow

This could become a genuinely strong power-user feature if the app grows.

But for the capstone, I would only touch this if the core note flow is already really stable. Multi-tab note editing adds complexity quickly.

---

## One presentational note for the demo

Your logo is strong. Use it more.

I would:
- put it in the sidebar/header,
- put it in the README,
- and use the icon-only version for the app icon.

That kind of brand consistency makes the whole project feel more finished.

---

## Suggested order of UI work

If I were prioritizing this before a demo, I’d do:

1. Merge the welcome flow into the main app shell.
2. Add a clear `Open/Switch Vault` action.
3. Clean up the sidebar header and show the current vault name.
4. Fix/remove dead buttons.
5. Simplify the `New File` split-button behavior.
6. Reopen the last note automatically.
7. Improve empty-state/editor visual focus.
8. Add extra polish like window persistence and themes if time remains.

That gives you the biggest UX improvement for the least risk.

---

## Final thought

The nice thing here is that the UI does **not** need a dramatic redesign. It mainly needs a tighter first-run flow, clearer navigation, and a handful of polish passes.

That is very fixable.

And once those things are in place, the app will feel much more like a real desktop product and much less like a school project — which is exactly where you want to land before the final demo.