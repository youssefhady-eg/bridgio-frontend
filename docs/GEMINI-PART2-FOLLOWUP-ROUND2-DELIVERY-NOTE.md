# BRIDGIO — Part 2 follow-up, round 2 — delivery note

Branch `gemini/ui-refresh`. Baseline commit `327680a`. Push only — no PR, no
merge.

Covers the round-2 brief (§2.1–§2.5), the **rail collapse/expand animation**
add-on, and the **no underlines anywhere** add-on.

---

## Gates

Re-run on the working tree after every change below:

| Gate | Baseline `327680a` | After this round |
| --- | --- | --- |
| `npm test` | 181/181 (19 files) | **181/181 (19 files)** |
| `npm run typecheck` (`tsc --noEmit`) | clean | **clean** |
| `npm run build` | clean | **clean** (`✓ built in 751ms`, exit 0) |

No new contract methods, no new dependencies. No existing test was edited,
skipped or weakened.

---

## §2.1 — At-risk table fits (EN/AR, 1536 + 1919, filtered + unfiltered) — evidence (a)

**Before (live).** `.tv-td-primary` had no width cap, so the English meta
`Last active: 29 October 2026` forced the at-risk table to its min-content width
and pushed the Action column and Follow-up button past the panel edge:

- 1536 px: wrap client 711 vs scroll **808** → horizontal scroll; table ~808 px.
- 1919 px: wrap client 748 vs scroll **809** → horizontal scroll.
- Column widths (EN) ≈ Student 275.4 / Class 175.3 / Mastery 138 /
  Last score 109.6 / Action 109.8.

**Fix.** Cap only the primary (Student) cell so the other columns keep their
natural widths and stay whole, and the primary line truncates with the cell's
existing ellipsis:

- `src/components/dashboard/TeacherDashboard.tsx`: added the modifier class
  `tv-table--at-risk` to the at-risk `<table>`.
- `src/styles/teacher-views.css`: new rule
  `@media (min-width: 769px) { .tv-table--at-risk .tv-td-primary { max-width: 170px } }`.

The cap is desktop-only; the ≤768 px card layout is a block list and keeps its
full width. The at-risk **filter/KPI logic was not touched**.

**After (live, measured at the exact viewports via headless Chromium).** Every
case: no horizontal scroll, `Action` header whole, `Follow up` / `متابعة`
button whole, separator present (see §2.2):

| case | rows | wrap client/scroll | h-scroll | Action th (client/scroll) | Follow-up (client/scroll) |
| --- | --- | --- | --- | --- | --- |
| EN 1536 all | 2 | 710 / 710 | false | 111 / 111 whole | 80 / 80 whole |
| EN 1536 filtered (ب) | 1 | 710 / 710 | false | 111 / 111 whole | 80 / 80 whole |
| EN 1919 all | 2 | 747 / 747 | false | 117 / 117 whole | 80 / 80 whole |
| EN 1919 filtered (ب) | 1 | 747 / 747 | false | 117 / 117 whole | 80 / 80 whole |
| AR 1536 all | 2 | 710 / 710 | false | 90 / 90 whole | 51 / 51 whole |
| AR 1536 filtered (ب) | 1 | 710 / 710 | false | 90 / 90 whole | 51 / 51 whole |
| AR 1919 all | 2 | 747 / 747 | false | 95 / 95 whole | 51 / 51 whole |
| AR 1919 filtered (ب) | 1 | 747 / 747 | false | 95 / 95 whole | 51 / 51 whole |

No column was dropped and no string was changed.

---

## §2.2 — Title/sub separator in single-line primary cells — evidence (b)

**Before (live).** The at-risk primary cell's `innerText` was the concatenation
`عمر خالدLast active: 29 October 2026` — no visible or extractable separator
(and the same shape in the drafts, bank and materials cells).

**Fix.** An explicit text separator `{' · '}` is now rendered between the title
and the sub-line in every primary cell that has both parts:

- `TeacherDashboard.tsx` — at-risk row and drafts row.
- `QuestionBank.tsx` — title + model-answer `details` (separator only rendered
  when the condition is true, so no dangling separator).
- `MaterialLibrary.tsx` — title + unit.

Primary cells that have a **title only** (tests list, student list, latest
submissions) are intentionally unchanged. Rows stay 42 px single-line and the
`details[open]` block behaviour is unchanged.

**After (live, text extraction).**

| table | EN | AR |
| --- | --- | --- |
| at-risk | `عمر خالد · Last active: 29 October 2026` | `عمر خالد · آخر نشاط: ٢٩ أكتوبر ٢٠٢٦` |
| drafts | `مراجعة التكامل · الصف الثالث الثانوي — أ · 1 question` | `مراجعة التكامل · الصف الثالث الثانوي — أ · سؤال واحد` |
| question bank | `ما العلاقة بين التكامل والاشتقاق؟ · Show the model answer` | `ما العلاقة بين التكامل والاشتقاق؟ · عرض نموذج الإجابة` |
| materials | `مذكرة التفاضل — قواعد الاشتقاق · التفاضل: المشتقات` | `مذكرة التفاضل — قواعد الاشتقاق · التفاضل: المشتقات` |

---

## §2.3 — Materials-note literal space — evidence (c)

The brief asked for a literal space between `uploadGapTitle` and the note body.
**Finding (reported honestly):** the source already had
`{copy.uploadGapTitle} {copy.uploadGapBody}` with a literal JSX space (present at
`7bd75b8` and `327680a`), and the live extraction already showed a space — the
"no space" claim in the earlier follow-up note could not be reproduced. The
space has been made explicit (`{copy.uploadGapTitle}{' '}{copy.uploadGapBody}`)
so the DOM always carries a real text node between the two strings. **Wording
was not rewritten.** The before/after DOM text is identical:

- EN: `File upload is not available yet You can add a text material or a link. Uploading PDF and image files is not available yet.`
- AR: `رفع الملفات غير متاح بعد يمكنك إضافة مادة نصية أو رابط. رفع ملفات PDF والصور غير متاح بعد.`

---

## §2.4 — "+" on the three head buttons — evidence (d)

A `+` prefix was added to the head-button labels (AR + EN), label change only:

| key | AR | EN |
| --- | --- | --- |
| `dashboard.newTest` (dashboard head) | `اختبار جديد` → `+ اختبار جديد` | `New test` → `+ New test` |
| `testsList.newTest` (tests head) | `اختبار جديد` → `+ اختبار جديد` | `New test` → `+ New test` |
| `questionBank.newQuestion` (bank head) | `سؤال جديد` → `+ سؤال جديد` | `New question` → `+ New question` |
| `materialLibrary.upload` (materials head) | `رفع مادة` → `+ رفع مادة` | `Upload material` → `+ Upload material` |

`classes.newTest` (`اختبار لصف` / `Test for a class`) was **not** changed.
Live extraction of the head buttons confirms the `+` renders first in both
directions (in RTL the `+` sits at the visual start, at the right).

Screenshots: `gemini-part2-round2-head-newtest-{en,ar}.png`,
`…-head-newquestion-{en,ar}.png`, `…-head-uploadmaterial-{en,ar}.png`.

---

## §2.5 — Owner-supplied touch icon — evidence (e)

**§0 hard gate.** The owner-supplied icon must be SHA-256
`ace05d53ecb80ab14a6f3773dd0d36eceaa72e5aad85a92789f543210d4b6fa4`, 1033 bytes,
180×180. At the start of this round both `docs/apple-touch-icon.png` and
`public/apple-touch-icon.png` were the builder's derived render (4293 bytes,
SHA `23c46352…`), so the gate failed and §2.5 was reported blocked. The owner
then supplied the correct file at `docs/apple-touch-icon.png`; it verifies as
1033 bytes, 180×180, SHA-256 `ace05d53…d4b6fa4`.

**Action.** Copied `docs/apple-touch-icon.png` → `public/apple-touch-icon.png`
byte-for-byte (no re-render). It is referenced as `/apple-touch-icon.png` in
`src/routes/__root.tsx`.

**After (served).** `GET http://localhost:3000/apple-touch-icon.png` → HTTP 200,
`image/png`, 1033 bytes, 180×180, SHA-256 `ace05d53…d4b6fa4`, PNG colour type 2
(RGB, no alpha) → full-bleed art with no transparent margin and no baked
rounded-corner mask.

---

## §4 — Round-2 add-ons (same session)

### §4.1 — Rail collapse/expand animates

**Before.** `.app-shell` switched `grid-template-columns` between
`var(--sidebar-w)` (236 px) and `var(--sidebar-w-collapsed)` (58 px) with **no
transition on the property** — an instant snap. The round-6 `@property --rail-p`
mechanism was removed in the Option 1 port and nothing replaced it.

**Fix.** `src/styles/app.css`: `transition: grid-template-columns var(--ease)`
on `.app-shell` (i.e. `130ms cubic-bezier(0.2, 0, 0, 1)`), which modern browsers
interpolate between the two same-shape track lists. Rail widths (236 / 58) and
the `--ease` value are unchanged; the label/wordmark hide-show and the toggle
position are unchanged. `prefers-reduced-motion` keeps the existing instant
behaviour through the `transition-duration: 0.01ms !important` rule already in
`src/styles/followup.css` / `src/styles/app.css`.

**Live sampling** (headless Chromium, 1280×900, `getBoundingClientRect().width`
sampled every animation frame during a toggle). Computed transition:
`grid-template-columns 0.13s cubic-bezier(0.2, 0, 0, 1)`.

Collapse (expanded → collapsed), 44 frames, ~130 ms:

```
236 → 188.13 → 125.95 → 95.92 → 78.42 → 67.83 → 61.66 → 58.67 → 58
```

Expand (collapsed → expanded), 44 frames, ~122 ms:

```
58 → 106.05 → 168.11 → 198.23 → 215.58 → 226.17 → 232.30 → 235.33 → 236
```

The rail passes through intermediate widths rather than jumping straight from
one value to the other, in **both** directions.

**Reduced motion** (emulated `prefers-reduced-motion: reduce`): collapse
`236 → 58` and expand `58 → 236` with **no intermediate widths** — instant, as
required.

### §4.2 — No underlines anywhere

**Before.** `tests` head button is a `<Link>` (`<a class="tv-btn tv-btn-primary">`)
and `.tv-btn` never set `text-decoration`, so the browser's default link
underline showed through; the same applied to table preview/edit links and any
other anchor with no explicit reset.

**Fix.** `src/styles/app.css`: added a global `a { text-decoration: none; }` to
the base reset block at the top of the file (no global `a` rule existed there
before). No existing per-component `text-decoration: none` rule was removed. A
future component that genuinely needs an underline adds it deliberately, never
by default.

**Live audit** (headless Chromium) — every `<a>` on each page reports
`text-decoration-line: none`; **0 underlined anchors**:

| page | anchors | underlined |
| --- | --- | --- |
| `/teacher/tests` EN | 19 | 0 |
| `/teacher/tests` AR | 19 | 0 |
| `/teacher/dashboard` EN | 17 | 0 |
| `/teacher/question-bank` EN | 14 | 0 |
| `/teacher/materials` EN | 14 | 0 |
| `/teacher/classes` EN | 19 | 0 |
| `/student/home` EN | 14 | 0 |
| `/parent/progress` EN | 11 | 0 |
| `/sign-in` EN | 4 | 0 |
| `/support` EN | 14 | 0 |
| `/guide` EN | 20 | 0 |

**Hover checks** on the tests list, EN and AR — the deepest hovered element is an
anchor and its `text-decoration-line` is `none`:

- head button `a.tv-btn.tv-btn-primary` (`+ New test` / `+ اختبار جديد`)
- row link `tbody a.tv-btn-sm` (`Details` / `التفاصيل`)
- sidebar link `.app-sidebar__link` (`Dashboard` / `لوحة التحكم`)

Screenshots: `gemini-part2-round2-nounderline-{head,row,sidebar}-{en,ar}.png`,
`…-nounderline-{head,row,sidebar}-hover-{en,ar}.png`, and full-page
`…-nounderline-page-{en,ar}.png`.

---

## Conflicts with `docs/BRIDGIO-LIVE_RULES.md`

No new conflict introduced this round. The pre-existing LIVE_RULES notes
(fonts, radius, touch-target) are unchanged and untouched by these items. The
global `a { text-decoration: none; }` is consistent with the rules' "no default
decoration" posture.

## Uncommitted files deliberately excluded

`docs/BRIDGIO-LIVE_RULES.md` is a pre-existing working-copy change and is left
uncommitted. `.agents/`, `docs/BRIDGIO-gemini-apply-prompt.md` and
`skills-lock.json` are untracked and left uncommitted.

## Screenshots — `docs/screenshots/`

- At-risk / "+" head buttons: `gemini-part2-round2-head-newtest-{en,ar}.png`,
  `…-head-newquestion-{en,ar}.png`, `…-head-uploadmaterial-{en,ar}.png`.
- No underlines: `gemini-part2-round2-nounderline-{head,row,sidebar}-{en,ar}.png`
  and their `-hover-` variants, plus `…-nounderline-page-{en,ar}.png`.
