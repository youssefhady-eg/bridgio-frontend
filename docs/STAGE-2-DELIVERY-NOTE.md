# BRIDGIO — Stage 2 — Delivery Note

**Stage:** 2 only — teacher dashboard
**Branch:** `opencode-stage2`, branched from `main` at `bc1a812`
**Date:** 2026-11-03
**Status:** Built and self-verified. **NOT verified by Muse yet. NOT merged to
`main`. NOT final, locked, or externally ready. No Stage 3 work started.**
**Model:** DeepSeek V4.1 Flash Free — provider `opencode`, exact listed model id
`deepseek-v4.1-flash-free`.

---

## 0. Docs refresh gate (done before any code)

The LIVE_RULES status line was checked before building. It reads:

> Stage 1 VERIFIED PASS and MERGED 2026-11-03 (code PASS + docs-fix PASS) … Owner
> locks LOCKED AS BUILT 2026-11-03 … Stage 2 is authorised.

That passes the gate (docs-fix PASS + all five locks locked as built), so the
docs refresh was committed first:

```text
41f8da2 docs: sync LIVE_RULES with post-merge status and owner locks (stage 2 pre-build)
```

- Only `docs/BRIDGIO-LIVE_RULES.md` changed versus `main` (5 insertions, 1
  deletion). The other three live docs were already current on `main`.
- Owner instruction followed: the exact 42,130-byte LIVE_RULES file was copied
  **outside the repo** to `C:\Users\Youssef Hady\Desktop\LIVE_RULES-current.md`
  before branch work. MD5 `25215661B1F8AD0E727051BDDC6DAB5A`, status line intact.
  (Git's `core.autocrlf` checks the committed file out as CRLF; the committed
  blob and the external copy are the original LF content.)
- No code was changed in this commit.

Owner locks were not re-opened: dark-band cream 75% / border 24% / hover 8% /
cream focus ring, Alexandria Bold as 600 and Nunito 700 max, `?as` preview role
kept, student Lessons/Progress unassigned, small-header breakpoints unchanged.

---

## 1. What changed

**Teacher dashboard** at `/teacher/dashboard` (the teacher landing screen), built
only from the token sheet + the Stage 0 adapter/mock.

| File | Change |
| --- | --- |
| `src/api/queries.ts` | Added `teacherDashboardQueryOptions(teacherId)` — one adapter call through the existing query-key factory. |
| `src/routes/teacher.dashboard.tsx` | Replaced the Stage 1 placeholder with the real route: loader prefetches the session then the dashboard aggregate, so SSR already contains the data. |
| `src/components/dashboard/TeacherDashboard.tsx` | Screen: hero (time-saved copy), quick totals, classes, recent tests, student progress, empty/loading/error states. |
| `src/components/dashboard/format.ts` | Display-only helpers: percentage clamp, Arabic-Indic counts/percentages, Arabic dates, page-level empty check. |
| `src/components/dashboard/format.test.ts` | 4 new tests for those helpers (33 total, up from 29). |
| `src/components/dashboard/icons.tsx` | Small inline SVG status/section icons; no icon font or image asset. |
| `src/components/dashboard/StatusChip.tsx` | Status chip, always icon + word. |
| `src/components/dashboard/ProgressBar.tsx` | RTL-aware progress bar with ARIA values. |
| `src/components/dashboard/EmptyNote.tsx` | Empty/error note, icon + word. |
| `src/content/strings.ts` | Centralised Stage 2 copy (draft Arabic), dashboard/placeholder wording, Stage 2 banner, English footer line. |
| `src/styles/app.css` | Dashboard layout appended; locked colours, proposed spacing/radii, sticker cards, light theme only. |
| `src/routes/index.tsx` | Teacher `/` now redirects to `/teacher/dashboard` (preserving `?as=teacher`); student preview keeps the shell overview. |
| `docs/STAGE-2-DELIVERY-NOTE.md` | This note. |
| `README.md`, `docs/README.md` | Status pointers and artefact list. |
| `docs/screenshots/stage2-*.png` | Arabic captures, listed in §7. |

No adapter contract, type, mock seed, font, brand asset or config value was
changed. The Stage 0 interface is untouched.

### Why this counts as "teacher lands on the dashboard"

`/` with the default teacher role redirects to `/teacher/dashboard?as=teacher`.
`?as=student` keeps the shell overview because student screens begin at Stage 4.
The preview-role switch remains UI state only; no auth or user model was added.

---

## 2. Data path — adapter/mock only

The screen imports only query options from `src/api/`; no component calls
`fetch`, imports the mock directly, or contains class/test/student data.

| Adapter method | Used for | Status | Mocked |
| --- | --- | --- | --- |
| `auth.getSession` | Teacher identity for the dashboard call | **PROPOSED** — Mentingo auth transport unconfirmed | Yes |
| `teachers.getDashboard` | `teacher`, `classes`, `recentTests`, `studentProgress`, `totals` | **PROPOSED** — Mentingo to implement on restore/rebuild | Yes |

Contract fields consumed: `TeacherDashboard.teacher.displayName`,
`classes[]` (`name`, `subjectName`, `gradeLevel`, `studentCount`, `unitCount`,
`lessonCount`, `certificateNote`), `recentTests[]` (`title`, `classroomName`,
`status`, `questionCount`, `updatedAt`), `studentProgress[]`
(`student.displayName`, `classroomName`, `progressPercent`, `completedUnits`,
`totalUnits`, `lastActiveAt`), `totals` (classes, students, published/draft
tests). No field was added to the contract.

`VITE_API_ADAPTER`, `VITE_API_URL` and `VITE_MOCK_SCENARIO` remain the only
switches (mock is the default). No live Mentingo connection is claimed.

---

## 3. What was NOT built

- No My Classes, Tests or Students feature screens — those nav links stay
  labelled placeholders. Stage 2 only adds the dashboard.
- No test builder, question editor, student player or Mohsen Q&A panel.
- No intelligent marking, score, grade or correct/incorrect UI (progress is
  course/unit progress only).
- No price, subscription, installments or payment UI.
- No Learn-to-Hire, exotic/foreign-language flow, certificate flow or Future
  Layer screen.
- No dark theme, theme switcher or second theme.
- No auth screen, user model, role system or session persistence beyond the
  existing mock session.
- No new fonts, images, brand assets, paid service or library.
- No deployment, hosting, Stage 3 work or merge to `main`.

---

## 4. Token-sheet compliance

**LOCKED values used verbatim:** red `#D51C1D`, cream `#F9ECD9`, paper
`#FFF6E8`, maroon `#2C0706`, success `#1F7A57`, info `#2A62B0`, warning fill
`#F2A93B` (fill only, maroon text), error wine `#7E1A2B`. Card radius 24 px,
pill chips/buttons, 2 px sticker outline on cards, no drop shadows. Arabic-first
RTL, light theme only. Teacher copy is MSA formal and leads with time saved
(“وفّر وقت المتابعة”), not hiring promises.

**PROPOSED FOR UI values used as-is and labelled proposed here:** neutrals
(text 70% / muted 55% / border 12% / card border 18% / hover 4% / disabled),
app type scale (hero 32, H1 28, H2 22, H3 18, body 16, small 14, label 15,
caption 12), spacing 4/8/12/16/24/32/48/64, input/sheet radii, 44 px touch
targets, 2 px focus ring (cream on the dark band). None is presented as a brand
lock.

**Owner locks kept as built:** dark-band cream secondary 75%, border 24%, hover
8%, cream focus ring; Alexandria Bold declared as 600; Nunito 700 max; `?as`
preview role; Lessons/Progress unassigned; header breakpoints unchanged.

**No new hex value was introduced.** Status chips use opacities/outlines of the
locked success and warning colours; inner dividers use the proposed 1.5 px
border, outer cards keep the 2 px sticker outline.

### Deviations from the token sheet / things to note

1. **No Mohsen pose in empty states.** The token sheet pairs the empty state
   with the “Mohsen wakes up” pose, but the reactions sheet is Stage 5 per
   LIVE_RULES §7 (“Stages 2–4 add no new files”). Stage 2 uses a neutral inline
   icon + word. The pose is deferred, not invented.
2. **Arabic-Indic digits.** Counts, percentages and dates render with
   `Intl` (`ar-EG`) as ٣ / ٤٢٪ / ٣١ أكتوبر ٢٠٢٦. The token sheet does not lock a
   numeral system; this is a display choice for owner review, not a brand token.
3. **`/` redirects teachers to the dashboard.** The Stage 1 shell overview is
   now only the `?as=student` preview landing. This is a routing change, not a
   screen; listed in open questions in case the owner wants `/` kept as an
   overview.
4. **Recent tests are non-interactive.** There is no test-detail screen until
   Stage 3, so rows are not links rather than dead links.
5. **Font-weight substitutions** are the already-locked Stage 1 behaviour
   (Alexandria Bold as 600, Nunito 700 max), unchanged here.

---

## 5. States

- **Empty (page):** when there are no classes, no tests and no progress, a
  single empty note shows the token wording “لا يوجد شيء هنا بعد” with an icon +
  text explanation.
- **Empty (section):** classes, recent tests and student progress each have
  their own empty note, so one missing list never hides the others.
- **Loading:** “جارٍ تحميل لوحتك…” in a paper panel with `role="status"`.
- **Error:** wine-outlined note with the token error line (“من جهتنا، لا من
  جهتك…”) and `role="alert"`; no retry control is promised.
- **No teacher session:** explicit note that Mentingo owns sign-in and it is not
  connected yet — no invented sign-in flow.
- Status is always icon + word; colour is never the only signal.

Empty data is reproducible without code changes:
`VITE_MOCK_SCENARIO=empty npm run dev`.

---

## 6. Verification (run in this session)

```text
npm test        → 5 files, 33 tests passed (29 existing + 4 dashboard helpers)
npm run typecheck → pass (tsc --noEmit)
npm run build   → pass: client + SSR bundles
npm run preview → 200 on /teacher/dashboard; SSR HTML contains the Arabic
                  class data and lang="ar" dir="rtl"
```

Additional checks:

- `/` with teacher preview redirects to `/teacher/dashboard?as=teacher`.
- `/?as=student` still renders the shell overview; student nav unchanged.
- Headless captures at 1440, 900 and 390 px wide; document scroll width equals
  the viewport at 390 px (no horizontal overflow).
- `?as` switch, nav and Stage 1 header visuals unchanged at all three widths.
- Empty scenario rendered at desktop and phone.

---

## 7. Arabic screenshots

| File | Size | Content |
| --- | --- | --- |
| `docs/screenshots/stage2-desktop.png` | 1440 × 1000 | Seeded dashboard, teacher, desktop |
| `docs/screenshots/stage2-desktop-full.png` | 1440 × 1818 | Full-page seeded dashboard |
| `docs/screenshots/stage2-phone.png` | 390 × 844 | Seeded dashboard, phone |
| `docs/screenshots/stage2-empty-desktop.png` | 1440 × 1000 | Empty scenario, desktop |
| `docs/screenshots/stage2-empty-phone.png` | 390 × 844 | Empty scenario, phone |
| `docs/screenshots/stage2-tablet.png` | 900 × 1000 | Header/breakpoint check, tablet |

---

## 8. Stage 2 gate self-check

- [x] App runs locally with no console errors (browser console clean).
- [x] Dashboard data comes through `src/api/` only; no hard-coded data in
      components, no `fetch` in components.
- [x] Copy, colours, fonts and spacing follow the token sheet; proposed values
      labelled proposed; no invented token.
- [x] Empty state works for no classes / no tests (page-level and per-section).
- [x] Arabic-first, RTL, light theme only.
- [x] Preview-role switch kept; no auth/user model added.
- [x] No marking, price, installments, Learn-to-Hire, exotic flows or dark
      theme, built or promised.
- [x] Runnable build + Arabic desktop/phone screenshots + this note.

---

## 9. Open questions

1. **Landing route:** is `/` → teacher dashboard right, or should `/` remain the
   shell overview and the dashboard stay at `/teacher/dashboard` only?
2. **Numerals:** keep Arabic-Indic digits (٣، ٤٢٪، ٣١ أكتوبر) for counts and
   dates, or switch to Western digits while keeping Arabic labels?
3. **Empty-state Mohsen:** confirm a neutral icon is acceptable for the Stage 2
   gate, with the reactions-sheet pose arriving in Stage 5.
4. **Progress metric:** the dashboard shows class/unit progress percentage, not
   test results. Confirm that is the intended “progress at a glance” metric now
   that marking is out of scope.
5. **Recent tests:** should rows stay non-interactive until Stage 3, or is a
   read-only test summary expected earlier?
6. **Unassigned screens:** My Classes and Students remain placeholders that say
   the data is shown on the dashboard only; Lessons/Progress stay “not assigned
   yet — no promises”. Confirm the wording is acceptable.
7. **Auth gap:** Mentingo auth transport/session mechanism is still unconfirmed;
   the dashboard currently depends on the mock teacher session.

---

## 10. Integration checklist (Mentingo)

| Screen | Adapter methods | Confirmed Mentingo concept? | Mocked now |
| --- | --- | --- | --- |
| Teacher dashboard | `auth.getSession` | No — auth method unconfirmed (gap) | Yes |
| Teacher dashboard | `teachers.getDashboard` | No — PROPOSED aggregate over users/classes/tests/progress | Yes |

No endpoint is presented as a confirmed Mentingo endpoint. Swapping to the real
backend remains config-only (`VITE_API_ADAPTER=http`, `VITE_API_URL`), with the
contract unchanged.
