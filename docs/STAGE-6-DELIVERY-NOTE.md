# BRIDGIO — Stage 6 — Delivery Note

**Stage:** 6 only — consistency polish across the dashboard, builder and player;
no new features, screens, routes or navigation.
**Branch:** `opencode-stage6`, branched from `main` at `7006222` (PR #9 merge).
**Docs refresh commit:** `01c6518` — docs-only LIVE_RULES sync, committed before
any Stage 6 code.
**Date:** 2026-11-03
**Status:** Delivered on the branch. **NOT verified by Muse yet. NOT merged to
`main`. NOT final, locked or externally ready. No Stage 7 work started.**
**Model:** DeepSeek V4.1 Flash Free — provider `tokenharbor`, exact listed model
id `deepseek-v4.1-flash:free`.

---

## 0. Docs refresh gate

The LIVE_RULES status line was read before building. It records Stage 5 as
**VERIFIED PASS** and **MERGED** through PR #9, merge commit `7006222`, with
Stage 6 authorised. The gate passed.

The docs refresh is a standalone commit and touches `docs/BRIDGIO-LIVE_RULES.md`
only:

```text
01c6518 docs(stage6): sync LIVE_RULES with stage 5 merge status (main 7006222)
```

No code, test, asset or config file is in that commit. `BRIDGIO-LIVE_RULES.md`
was not edited again in Stage 6 and does **not** claim Stage 6 verified or merged.

The five owner locks were not reopened: dark-band cream 75% / border 24% / hover
8% / cream focus ring, Alexandria Bold as 600 and Nunito 700 max, `?as` preview
role kept, student Lessons/Progress unassigned, small-header breakpoints
unchanged.

---

## 1. What changed

Stage 6 changes styling, shared class names and string plumbing only. It adds no
screen, route, feature, adapter method or contract field.

| File | Change |
| --- | --- |
| `src/styles/app.css` | Link hover no longer wine; one `.loading-note` replaces the three per-screen loading classes; `.dashboard__section-head` / `.dashboard__count` / `.dashboard__section-lead` renamed to `.section-head` / `.count-chip` / `.section-lead`; disabled controls use the 8% overlay over paper; `.button--small` uses the label type size; `.grounding__kind` aligned to chip metrics. |
| `src/styles/tokens.css` | `--disabled-bg` replaced by `--disabled-overlay: rgba(44, 7, 6, 0.08)` per token sheet §1. No other token changed. |
| `src/content/strings.ts` | `const B = brand.name` and `const M = assistant.nameAr` are the single swap points; every Arabic string that names BRIDGIO or Mohsen interpolates them. Stage 6 head, stage banner and English footer copy. |
| `src/content/strings.centralisation.test.ts` | New guard: no Arabic copy in `src/components` or `src/routes`; the key named mentions are built from the two swap points. Mock seed/refusal data and test fixtures are intentionally outside the guard. |
| `src/components/dashboard/TeacherDashboard.tsx` | Loading notes use `.loading-note`; section head, count chip and section lead use the shared classes. |
| `src/components/player/StudentTestPlayer.tsx` | Loading notes use `.loading-note`; the test list uses `.section-head`, `.count-chip`, `.section-lead`. |
| `src/components/player/TestRunner.tsx` | Loading note uses `.loading-note`. |
| `src/components/builder/StepChooseSource.tsx` | The three inline loading notes use `.loading-note`. |
| `src/components/builder/StepDraftQuestions.tsx` | Draft count uses `.count-chip`. |
| `src/components/builder/StepReviewQuestions.tsx` | Review loading note uses `.loading-note`; draft count uses `.count-chip`. |
| `src/components/builder/StepPublish.tsx` | Review loading note uses `.loading-note`. |
| `src/components/builder/TestBuilder.tsx` | Session loading note uses `.loading-note`. |
| `docs/screenshots/stage6-*.png` | 8 Arabic desktop/phone captures, listed in §6. |
| `docs/STAGE-6-DELIVERY-NOTE.md` | This note. |
| `README.md`, `docs/README.md` | Stage status line updated to Stage 6 delivered — not merged, not verified. |

---

## 2. Deviations fixed — before / after

1. **Link hover is no longer wine.**
   - *Before:* `.app-list--links .screen-link:hover` set the text to
     `--bridgio-error` (`#7E1A2B`). Hover is an affordance, not an error, and the
     wine colour is reserved for failures.
   - *After:* hover applies the existing `--hover-bg` maroon wash
     (`rgba(44, 7, 6, 0.04)`) and leaves the text colour alone. No new hex.

2. **Loading-note consolidation.**
   - *Before:* `.dashboard__loading`, `.builder__loading` and `.player__loading`
     were three identical rules, and each screen used its own class.
   - *After:* one `.loading-note` rule in `app.css`, used by the dashboard,
     builder, player list and runner loading states. Same padding, paper surface,
     hairline border and muted text as before, so the visual result is unchanged
     while the pattern is now genuinely shared.

3. **`section-head` / `count-chip` / `section-lead` renames.**
   - *Before:* shared section structure was named with a dashboard prefix
     (`.dashboard__section-head`, `.dashboard__count`,
     `.dashboard__section-lead`), and the builder and player imported those
     dashboard names.
   - *After:* neutral shared classes `.section-head`, `.count-chip` and
     `.section-lead` are used by the dashboard, the player test list and the
     builder draft/review counts. No old name remains in `src`. Visual rules are
     unchanged.

4. **Disabled background is a token-sheet overlay.**
   - *Before:* `--disabled-bg: rgba(255, 246, 232, 0.92)` — a near-paper value
     that did not follow token sheet §1.
   - *After:* `--disabled-overlay: rgba(44, 7, 6, 0.08)`, layered as
     `linear-gradient(var(--disabled-overlay), var(--disabled-overlay)),
     var(--bridgio-paper)` for disabled step buttons, disabled choice cards and
     disabled buttons. Token sheet §1 defines disabled as paper plus maroon at
     8%; no brand colour is invented.

5. **Small button uses the label type size.**
   - *Before:* `.button--small` reduced the label to
     `--font-body-small-size`, which mixed body copy and control type.
   - *After:* `.button--small` keeps its tighter padding but uses
     `--font-label-size` from the token sheet §2 button/label scale. Size
     hierarchy now comes from padding, not from leaving the control type scale.

6. **Grounding chip metrics match the other chips.**
   - *Before:* `.grounding__kind` used 1 px vertical padding, a 1 px border,
     `--text-muted` and default line height, so it read smaller and fainter than
     `.status-chip`.
   - *After:* 2 px / `--space-3` padding, 1.5 px border, `--text-secondary` and
     `line-height: 1.45`, matching the status-chip metrics. Tags now read as one
     pattern across dashboard, builder and player.

7. **Strings centralisation via `B` / `M`.**
   - *Before:* `Bridgio` and `محسن` were typed literally in many strings (page
     titles, footer, builder headings, player/Mohsen labels).
   - *After:* `const B = brand.name` and `const M = assistant.nameAr` in
     `src/content/strings.ts`; every Arabic mention interpolates `${B}` or
     `${M}`. Renaming the working names is one edit in the two consts plus the
     matching artwork file name. The new guard test fails if Arabic copy is
     hard-coded in a component or route, or if the key named mentions stop using
     the swap points.

8. **Token fix / audit.**
   - *Before:* the CSS relied on `--disabled-bg` and the Stage 6 edits introduced
     no definition check, so a missing custom property would have failed silently.
   - *After:* every `var()` in `app.css` — 47 distinct names, including
     `--hover-bg` and the new `--disabled-overlay` — is defined in `tokens.css`.
     Nothing was made up and no token was added beyond the corrected
     `--disabled-overlay`.

---

## 3. What was deliberately not changed

- No new screen, route, navigation item, feature or adapter method.
- No new contract field; every Mentingo endpoint remains **PROPOSED**.
- Adapter + mock only; no backend, network call or secret was added.
- No intelligent marking, scoring, grades, correct/incorrect UI or answer review.
- No price, subscription, installments or payment UI.
- No Learn-to-Hire, certificate, exotic/foreign-language flow or Future Layer.
- No dark theme, theme switcher or new brand asset.
- No new auth screen, user model or role system; `?as` is unchanged.
- No student Lessons or Progress screens — they stay explicit, unassigned
  placeholders.
- No Mohsen mascot poses; neutral inline icons + words stay.
- No favicon from the wordmark, no deployment or hosting, no Stage 7 work.
- The five owner locks and the Stage 2–5 feature structure are untouched.
- Mock seed/answer/refusal strings stay demo data and are deliberately outside
  the centralisation guard.
- The three open questions below are listed, not fixed.

---

## 4. Consistency and strings

**Shared control patterns.** Buttons keep one pill geometry and 44 px minimum
target; the small variant changes padding only. Inputs, chips, status chips and
grounding tags use the existing radii, borders and type tokens. Progress is still
shown as the existing bar with a text label; no new progress widget was added.

**One loading treatment.** The dashboard, builder and player now share
`.loading-note`; there is no screen-specific loading skin left.

**One section structure.** `.section-head` (heading + count), `.count-chip`
(number) and `.section-lead` (intro line) are shared by the dashboard and the
player list, and the count chip is reused in the builder draft/review previews.

**Two name swap points.** `B` and `M` in `src/content/strings.ts` are the only
places the working names enter copy. The English internal-build footer is also
built from `B` and `M`.

---

## 5. Verification (run in this session)

```text
npm test         → 9 files, 71 tests passed
                   (includes the new strings.centralisation guard)
npm run typecheck → pass (tsc --noEmit)
npm run build    → pass: client + SSR bundles, post-build typecheck pass
```

Additional checks:

- **Old classes:** `dashboard__loading`, `builder__loading`, `player__loading`,
  `dashboard__section-head`, `dashboard__count`, `dashboard__section-lead` and
  `disabled-bg` return zero matches in `src`.
- **Tokens:** all 47 `var()` names used in `app.css` are defined in
  `tokens.css`; missing list is empty. `--hover-bg` and `--disabled-overlay` are
  both defined.
- **Encoding:** no UTF-8 mojibake signatures (the a-circumflex/euro and
  A-circumflex/section pairs), no U+FFFD and no BOM in the working tree; `—`,
  `§`, `≥` and curly quotes are intact.
- **Built preview:** dashboard and builder verified on the seeded teacher build;
  the player verified on the seeded student build (`VITE_MOCK_SESSION=student`,
  the existing demo method from Stages 4–5), with `?as=teacher` / `?as=student`
  kept on every URL.
- **RTL / language:** every captured page renders `lang="ar" dir="rtl"`.
- **No horizontal overflow:** `documentElement.scrollWidth === clientWidth` at
  1440 × 1000 and 390 × 844 (phone files are 780 px wide = 390 CSS px at 2×).
- **Console:** zero errors on every captured surface and viewport.

`VITE_*` is inlined at build time, so the teacher and student captures come from
two builds of the same branch. Both use the mock adapter; no live Mentingo
connection is claimed.

---

## 6. Arabic screenshots

All captures are Arabic and RTL. Phone files are 780 px wide = 390 CSS px at 2×.

| File | Size | Content |
| --- | --- | --- |
| `docs/screenshots/stage6-desktop-dashboard.png` | 1440 × 1836 | Teacher dashboard, shared section/count/lead pattern |
| `docs/screenshots/stage6-desktop-builder.png` | 1440 × 1000 | Builder step 1, shared disabled step buttons and input |
| `docs/screenshots/stage6-desktop-player.png` | 1440 × 1000 | Player test list with shared section head, count chip and lead |
| `docs/screenshots/stage6-desktop-player-runner.png` | 1440 × 1220 | Runner with shared buttons, progress and Mohsen panel |
| `docs/screenshots/stage6-phone-dashboard.png` | 780 × 5034 | Dashboard, phone |
| `docs/screenshots/stage6-phone-builder.png` | 780 × 2284 | Builder step 1, phone |
| `docs/screenshots/stage6-phone-player.png` | 780 × 1990 | Player test list, phone |
| `docs/screenshots/stage6-phone-player-runner.png` | 780 × 3570 | Runner + Mohsen panel stacked, phone |

---

## 7. Stage 6 gate self-check

- [x] Polish only: buttons, inputs, tags/chips and progress patterns applied
      consistently across dashboard, builder and player.
- [x] Deviations found in Stages 1–5 fixed: hover colour, duplicated loading
      skins, prefixed shared class names, disabled background, small-button type
      size, grounding chip metrics, token audit.
- [x] All Arabic UI strings centralised; BRIDGIO / Mohsen swappable from `B` / `M`
      in one file, guarded by a test.
- [x] Arabic-first, full RTL, light theme; five owner locks and all LOCKED
      colours/fonts unchanged.
- [x] `?as` preview switch kept.
- [x] Adapter + mock only; no new contract field or adapter method; every
      endpoint **PROPOSED**.
- [x] No new screen, route, navigation item, marking, scores/grades, price,
      installments, Learn-to-Hire, exotic-language flow, dark theme, new
      auth/user model, Lessons/Progress screen, wordmark favicon or deployment.
- [x] `npm test` 9 files / 71 tests pass; `npm run typecheck` passes;
      `npm run build` passes (client + SSR + post-build typecheck).
- [x] Built preview at desktop and phone: `lang="ar" dir="rtl"`, no horizontal
      overflow, no console errors.
- [x] Arabic desktop + phone screenshots for dashboard, builder and player.
- [ ] Muse verification.
- [ ] Merge to `main` (owner decision; not done here).

---

## 8. Open questions

1. **H2 weight:** headings render at weight 700 while the token sheet names
   SemiBold. The Bold file stands in for SemiBold (the existing Stage 1 font
   deviation). Keep 700, or add a real SemiBold file later?
2. **Delete-in-progress wording:** the delete state reuses `strings.saving`
   ("جارٍ الحفظ..."). Should it get its own "جارٍ الحذف..." label?
3. **Error sentences as EmptyNote titles:** the builder uses
   `classesError` / `materialsError` / `unitsError` sentences as `EmptyNote`
   titles with a generic body. Keep that shape, or shorten the titles and move
   the sentence into the body?

---

## 9. Integration checklist (Mentingo)

| Check | Status |
| --- | --- |
| Adapter + mock only | Yes — no live backend claimed |
| New contract fields | None |
| New adapter methods | None |
| Every endpoint | **PROPOSED** |
| `?as` preview switch | Kept, UI state only |
| Marking / scores / grades | Not built |
| Price / installments | Not built |
| Learn-to-Hire / certificates | Not built |
| Exotic / foreign-language flows | Not built |
| Dark theme | Not built |
| New auth / user / role model | Not built (Mentingo-owned) |
| Student Lessons / Progress screens | Not built — unassigned placeholders |
| Deployment / hosting | Not done — Stage 7 |

The existing adapter surface from Stages 2–5 is unchanged:
`auth.getSession`, `teachers.getDashboard`, `classrooms.listForTeacher`,
`classrooms.get`, `materials.listForTeacher`, `tests.get`, `tests.createDraft`,
`tests.publish`, `questions.listForTest`, `questions.update`,
`questions.delete`, `students.getProfile`, `tests.listForClass`,
`attempts.listForStudent`, `attempts.start`, `attempts.get`,
`attempts.saveAnswer`, `attempts.submit`, `mohsen.draftQuestions` and
`mohsen.ask`. All remain **PROPOSED**; swapping to the real backend stays
config-only (`VITE_API_ADAPTER=http`, `VITE_API_URL`).