# BRIDGIO — Required Pages and Their UI (Catalogue for Owner Choice)

**Date:** 2026-11-09
**Base:** `main` `d6a4217` + branch `feat/port-lovable-polish` tip `1992169`
**Purpose:** every page this project needs, what its UI is today, and what
the owner still has to choose. Nothing here is a build order until the owner
picks it.

## How to read this

- **Real** — built and working on mock data.
- **Placeholder** — route exists, screen says "not assigned yet" or shows
  only a skeleton. No feature behind it.
- **Missing** — no route, no screen. Needs a decision before any build.
- **Blocked** — needs Mentingo (auth, backend data, or RBAC) before it can
  be real.

## 1. Teacher

| Page | Route | Status | What its UI should do |
|---|---|---|---|
| Dashboard | `/teacher/dashboard` | Real, feels empty | One screen: classes, recent tests, student progress, what needs attention. See §4. |
| My Classes | `/teacher/classes` | Placeholder | Class list + class detail (students, units, lessons, tests in that class). |
| Tests | `/teacher/tests` | Real | Test list + 4-step test builder (details → questions → settings → review/publish). |
| Test detail / edit | — | Missing | One test: questions, publish state, edit after publish, results link. Builder today only offers "start a new test" after publish. |
| Question bank | — | Missing | Reusable questions across tests. |
| Students | `/teacher/students` | Placeholder | Student list + student detail (progress, submissions, scores). |
| Material upload | — | Missing | Teacher uploads material Mohsen grounds on. No upload/management screen exists. |

## 2. Student

| Page | Route | Status | What its UI should do |
|---|---|---|---|
| My Tests | `/student/tests` | Real | Test list + test player with Mohsen panel. After submit today: back to list only — no results, review, attempt history, or retake. |
| Test results / review | — | Missing | Score, per-question review, retake. Scores are backend-supplied; the frontend must not calculate them. |
| Lessons | `/student/lessons` | Placeholder | Lessons the teacher assigned. Explicitly unassigned — no stage promised. |
| Progress | `/student/progress` | Placeholder | The student's own progress. Explicitly unassigned — no stage promised. |

## 3. Parent

| Page | Route | Status | What its UI should do |
|---|---|---|---|
| Progress | `/parent/progress` | Real | Child's progress: units, completion, scores. |
| Tests | `/parent/tests` | Real | Child's tests: upcoming, submitted. |
| Results | `/parent/results` | Real | Submissions, completion, test results **and scores** (backend-supplied). |
| Messages | `/parent/messages` | Real (popup pattern) | Message the Assistant and Teachers, in-app, in the AI Chat / Assistant popup pattern. Transport and notifications are backend decisions, still open. |

## 4. Teacher Assistant (human role, not Mohsen)

| Page | Route | Status | What its UI should do |
|---|---|---|---|
| Dashboard / Classes / Tests / Students | teacher routes | **Not accessible** | Sidebar shows only granted items, but they point at teacher routes that require a teacher mock session. An assistant clicking them gets the honest no-session note, not content. **Owner choice needed:** dedicated assistant screens, or make teacher routes RBAC-aware. Do not demo assistant content until decided. |

## 5. Shared / shell

| Page | Route | Status | What its UI should do |
|---|---|---|---|
| Home / landing | `/` | Placeholder list | Today: a list of built screens. A real landing (product home, first-run hook) is a separate decision. |
| Sign-in / sign-up / profile / settings / password reset | — | Missing, blocked | Mentingo auth. Method and transport unconfirmed. No identity is displayed anywhere today. |
| Mohsen chat (global) | popup | Partial | Mohsen panel inside the player + header trigger sharing the messages popup. No separate global AI chat backend. |
| Help / Guide | — | Missing | Guide page (pinned utility in the sidebar plan). |
| Present mode | — | Missing | Walk real product views by navigation (Analytica-style present). |
| Notifications | — | Missing | No notifications anywhere today. |
| Search | — | Missing | No search anywhere today. |

## 6. The three UI issues the owner raised 2026-11-09

### 6.1 Dashboard feels empty

Why: the dashboard shows only 3 count cards, 2 class cards, 3 recent
tests, and 3 students — and two of the four nav destinations behind it
(Classes, Students) are placeholders, so the dashboard is a summary of
screens that do not exist yet. It reads as a shell, not a workspace.

Choices (pick one — this is the owner's call):
- **A. Fill it with what already exists.** Denser two-column dashboard:
  recent activity, tests needing attention (drafts, unpublished), students
  with lowest progress first, quick actions (create test, view students).
  No new screens, no new data.
- **B. Add a "today" strip.** Classes today, tests due, students needing
  attention — the morning-dashboard idea from the Analytica spec, adapted.
  Needs the owner to define "today" for a teacher.
- **C. Keep it minimal, but design the emptiness.** Proper empty states
  with one clear action each, instead of a half-filled grid. Only honest
  if the class/student screens stay placeholders.

### 6.2 Dark mode — removed, and its colouring was not good

History: Claude added a dark theme in PRs #16–17. The owner rejected
its colouring on 2026-11-06 ("I don't like the Coloring of the dark
theme"). The Lovable port then removed it entirely, so the product is
light-only today. The removal is correct for the rejected palette; it
is not a verdict on dark mode as an idea.

Choices (pick one):
- **A. Stay light-only.** No dark theme, no toggle. Simplest, current state.
- **B. A proper dark theme, redesigned.** New palette, designed from the
  locked brand (maroon/cream/red) rather than inverting the light theme,
  approved by the owner from screenshots before any code merges.
  This is a separate design pass, not restoring the rejected palette.
- **C. System-preference dark only.** Same redesigned palette as B, but
  no toggle — it follows the device setting.

### 6.3 Collapse icon does not appear until I scroll (desktop)

Root cause, confirmed in code: the desktop sidebar is `position: sticky;
top: 0; height: 100dvh`, but it starts **below** the 72 px header, so its
bottom — where the collapse toggle lives in the sidebar foot — sits 72 px
below the viewport fold. You have to scroll to see it.

Fix (one rule, in `polish.css` at `@media (min-width: 1024px)`):
```css
.app-sidebar {
  top: var(--header-h);
  height: calc(100dvh - var(--header-h));
}
```
`--header-h` is already 72 px in `polish.css`. This pins the toggle to
the bottom of the visible sidebar. It is separate from the 5rem collapse
fix already in tip `1992169`, which is still awaiting its live re-check.

## 7. What is NOT in this catalogue (locked out, do not add without an owner decision)

Intelligent marking, student-player scores/grades, price, installments,
Learn-to-Hire flows, exotic-language flows, fake-order/COD verification.
