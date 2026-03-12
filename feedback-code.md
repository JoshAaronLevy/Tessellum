# Code Review

## High Priority Issues

### Fix `any` Type Usage

There are 32 instances of `any` type usage across the codebase. If the professor or person grading your work cares about TypeScript and type safety, this is a critical issue to address. No matter how good the functionality is, people who are sticklers about it will absolutely ding you **hard** for this.

**Suggestion**: Time box this. Search for `any` in your codebase and go through each one, spending no more than 5 minutes on each instance. For some, it will be a simple fix (e.g., replacing `any` with a specific type or interface). For others, it may require a bit more thought to define the correct types. But the key is to not get bogged down in trying to make it perfect. Just make it good enough and move on to the next one. You can always come back and try finish refining types later if you have time. Or if they are very difficult fixes, you can at least add a comment indicating that you had difficulty fixing it, and will revisit it before the next release. The point here is to show that you both did put in the effort, and that you do care about code quality.

### Fix TitleBar Critical Bug

The `TitleBar` component has a critical bug where the `appWindow` variable is defined inside the component, which made the app freeze up the moment it opened for me, because it was checking the `appWindow` hundreds of times per second. The fix is to move the `appWindow` variable outside of the component so that it is only initialized once, and also update the `useEffect` dependency array to include `appWindow` to ensure it is properly referenced.

**NOTE**: I have already made this fix in the codebase, and you can see it more clearly in the pull request I made.

### Fix Build Errors

The build command fails due to errors in `src/plugins/api/CommandAPI.ts` and `src/plugins/api/UIAPI.ts`. The errors state that `_app is defined but its value is never read.` But you can't just remove the lines without breaking the constructor. These need to be fixed for the project to be considered complete and functional.

**NOTE**: I have already made this fix in the codebase, and you can see it more clearly in the pull request I made.

### ABSOLUTE MUST: Front-End Tests (Minimal is Fine)

**IMPORTANT**: This is one of the things that often makes or breaks a junior dev landing a job. You do not need to spend a ton of time and effort on creating insanely thorough tests with high code coverage percentages. But you need just the basics.

Think of it like this. You need **just enough** tests in the front-end to demonstrate that you understand and acknowledge the importance of having tests in your code. I don't care how fancy the rest of the app is. When it comes to hiring a junior dev (which I/we have done many times), we will pick the dev with a simple, solid app with some core tests over the dev with a fancy, complicated app with no tests any day of the week.

**NOTE**: I added some base, core tests in this branch for you to look at to see what I'm talking about.

## Other Improvements (Not Critical. But totally set you apart)

### Update/Improve README.md

A great README.md should showcase what the app is, why you should use it (why Tessellum over other notetaking apps), and list core features with visual aids (GIFs are best. JPGs are an acceptable backup). And your logo is totally awesome. SO PUT IT IN THE README!! I'd fail you just for not putting such a cool logo at the top of your README.md (kidding, of course. But you gotta add it).

You do NOT need to spend extensive time on this. You can just install Kap on your computer and spend 10 or so minutes grabbing 3-5 second clips of cool features in the app. You can even borrow the source code from some awesome examples out there. Here are my faves:

- If you want something that's high-level highlights with a sweet visual presentation, check [reach](https://github.com/dmunish/reach/blob/main/README.md)

- If you feel like you need to go deep into the weeds to explain how it works, different features, etc., that's ok. Just make it presentable, like with [Enquirer](https://github.com/enquirer/enquirer/blob/master/README.md)

- If there's a lot of content, but a variety of sections or topics and you want to make it easy to navigate, organized, and still aesthetically pleasing, check out [supabase-plus](https://github.com/dsplce-co/supabase-plus#readme)

- And if you absolutely hate my fave examples, that's totally fine. Check out [awesome-readme](https://github.com/matiassingers/awesome-readme). It's basically a repo that just showcases a list of like 100+ great README examples and pick one that you like

### Add ToDo or Release Notes File

There are two types of tech employees: coders and developers. This is a nice touch because it emphasizes the type of employee you are. A coder (the vast majority of other students), will come up with an idea and run as fast as they can with it, trying to cram as many features in as possible before a deadline. They don't realize that an app with 10 features, but 8 they use, is more valuable to a user than one with 50 features, and 10 they use. Even though they technically use more features in the latter one, it is always a much worse user experience. Even talented coders with high standards put their focus into being able to write the cleanest code out there. But they often overlook the UI and UX details that make the user either keep coming back, or immediately delete the app and move on. **A great coder can write the cleanest code. A great developer solves problems with code.** There's a huge difference. And that difference separates you from over 90% of job applicants.

So for this file, just have a section with a handful of checkboxes with a mix of technical things you aim to do, as well as features and bug fixes you plan to implement in the next release (even if it's after the project is over). An example can be as simple as this:

```md
# Release Notes

## Upcoming [v0.3.1]

### Planned Release Date: [03/31/2026]

### Core Updates

- [ ] Fix remaining `any` type uses
- [ ] Implement `Husky` to ensure lint and tests are run and need to pass in order to push code changes
- [ ] Update the base styling to add more visual distinction between the sidebar and editor area
- [ ] Improve state performance, to open the app in the previous window size, and open the last note that was open when the app is closed

### Stretch Goals

- [ ] Add a WYSIWYG Markdown editor with a vertical toolbar on the right side of the editor
- [ ] Add a tabbed interface to the editor to allow users to have multiple notes open at once
```