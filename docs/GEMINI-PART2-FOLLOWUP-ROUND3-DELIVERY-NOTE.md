# BRIDGIO — Part 2 follow-up, round 3 — delivery note

Branch `gemini/ui-refresh`. Baseline (and still current) commit `0456449`.
Push only — no PR, no merge.

Covers the round-3 brief, one item only: **§2.1 student drawer subtitle must not
clip in English**.

> **Status: NOT REPRODUCED — no source change was made.**
>
> The brief (live gate 2026-11-26, preview `4wmqi6rvq`, 1919 CSS px) reports the
> EN subtitle starting with a sliced glyph at the drawer's left edge. I could
> not reproduce that on the dev server at `0456449`, **nor on the exact preview
> build the gate cites** (`4wmqi6rvq`). In every combination measured the
> subtitle is fully visible on one line, inside the drawer, with a ~69 px gap to
> the close button, and the at-risk table is un-scrolled. Because the brief's
> prime suspect is explicitly *"unverified — reproduce live and confirm before
> fixing"*, and the brief says *"if the item cannot be verified live … do not
> invent a measurement and do not mark it done"*, this round delivers **evidence
> and a report only**. §2.1 is **not marked done**; no fix was invented.

---

## Gates

Re-run on the working tree (unchanged from baseline):

| Gate | Baseline `0456449` | This round |
| --- | --- | --- |
| `npm test` | 181/181 (19 files) | **181/181 (19 files)** |
| `npm run typecheck` (`tsc --noEmit`) | clean | **clean** (`exit 0`) |
| `npm run build` | clean | **clean** (`✓ built in 1.31s`, exit 0) |

No new contract methods, no new dependencies, no test edited/skipped/weakened.
The working tree is byte-identical to `0456449` (this note and its screenshots
are the only additions).

---

## §2.1 — EN drawer subtitle: reproduction attempt and measurements

### Reported symptom (from the brief)

> opening a student drawer from the dashboard at-risk table in EN, the subtitle
> starts with a sliced glyph at the drawer's left edge — the line's start is cut
> off. Full subtitle text: `الصف الثالث الثانوي — أ · Last active: 29 October
> 2026`. In AR the same subtitle is fully visible.

### What was actually measured (live, headless Chromium over CDP)

Four viewport/language combinations, drawer opened from the dashboard **at-risk**
table; the students-page drawer was checked identically as a control.

| case | viewport | subtitle box `[x … right]` w | lines | `textMinX` vs box left | `textMaxRight` vs box right | overflow L/R | gap to close btn |
| --- | --- | --- | --- | --- | --- | --- | --- |
| EN dashboard | 1919 | `[1476 … 1806.16]` 330.16 | 1 | **equal** (1476) | **equal** (1806.16) | false / false | 68.84 px |
| EN dashboard | 1535 | `[1092 … 1421.2]` 329.2 | 1 | **equal** (1092) | **equal** (1421.2) | false / false | 69.8 px |
| AR dashboard | 1919 | `[168.86 … 443]` 274.14 | 1 | inside | inside | false / false | (opposite side) |
| AR dashboard | 1535 | `[169.66 … 443]` 273.34 | 1 | inside | inside | false / false | (opposite side) |
| EN students page | 1919 | `[1476 … 1806.16]` 330.16 | 1 | equal | equal | false / false | 68.84 px |
| EN students page | 1535 | `[1092 … 1421.2]` 329.2 | 1 | equal | equal | false / false | 69.8 px |

`sub.scrollWidth == sub.clientWidth` in every case (330/330, 329/329, 274/274,
273/273) — there is no overflow to slice. Computed `direction` is `ltr` in EN
and `rtl` in AR, matching the page; `unicode-bidi: isolate`.

### The exact live-gate build was also measured

The preview the brief cites (`4wmqi6rvq`) is still reachable, and its shipped
CSS bundle **already contains the §2.10 mechanism**:

```
/* /assets/teacher-views-D4F3wyyA.css  (preview 4wmqi6rvq) */
.tv-drawer-heading{min-width:0}
.tv-drawer-heading .tv-cell-sub{overflow-wrap:anywhere}
```

Measured on that preview, EN from the at-risk table: subtitle `[1476 … 1806.16]`,
330.16 px, 1 line, `scrollWidth == clientWidth == 330`, no overflow, ~69 px to
the close button. So the reported defect is absent on the very build the gate
ran on, not just on `0456449`.

### At-risk table stays un-scrolled

| case | `wrap` client/scroll | `scrollLeft` | after opening drawer |
| --- | --- | --- | --- |
| EN 1919 | 747 / 747 | 0 | 747 / 747, `scrollLeft` **0**, body `scrollLeft` 0 |
| EN 1535 | 710 / 710 | 0 | 710 / 710, `scrollLeft` **0**, body `scrollLeft` 0 |

### Why the EN line can *look* like it starts with a sliced glyph

The subtitle has an LTR base with an embedded RTL run, so the logical string
`الصف الثالث الثانوي — أ · Last active: …` paints visual-L→R as
`أ — الصف الثالث الثانوي · Last active: …`. The **leftmost** glyph is therefore
`أ` — the *last* character of the Arabic run. Measured positions (EN 1919):

- `الصف` (the logical first word) → `x 1574.13 … 1604.55` (right end of the Arabic run)
- `أ` (the logical last character) → `x 1476 … 1479.45` (flush at the box's inline-start edge)

`أ` sits exactly on the subtitle box's left edge (`textMinX == sub.x`) because the
Arabic run is right-tight: the table inset is the *whole* run, so a **crop tight to
the text box** (e.g. a devtools node screenshot of `.tv-cell-sub`) shows the
leading `أ` flush against the image edge and reads as "cut off", while the live
layout has 17 px of drawer padding to its left (`drawer left 1459 → box left 1476`).

There is **no clipping boundary at the drawer's left edge**: the chain
`.tv-cell-sub → .tv-drawer-heading → .tv-panel-head → .tv-drawer → .tv-backdrop`
is `overflow: visible` at every step; the nearest clipping ancestors are
`.app-shell` (`overflow: hidden`) and `body` (`overflow-x: clip`), both at the
**viewport** edge (0…1919), not the drawer edge.

### No font-fallback trigger either

The subtitle stack is `Inter, "Bridgio Body", system-ui, …`. `Inter` is Latin-only
(`unicode-range` limited to Latin/punctuation), so the Arabic run falls through to
`Bridgio Body`'s Arabic face, `BalooBhaijaan2` (`unicode-range: U+6?? …`).
Measured string width across the whole stack at 1919 (usable heading width
≈ 389 px): Inter 317.5, `Bridgio Body`/Baloo 295.6, **Alexandria (widest tested)
346.1**, Segoe UI 322, Tahoma 324, Arial 304.5. Nothing approaches overflow, and
forcing an RTL base on the subtitle still leaves it on one line (330 px, no
overflow). Forcing the font to 26 px (≈ 2× ) makes it wrap cleanly to two fully
visible lines — i.e. the §2.10 `overflow-wrap` mechanism works when it is needed.

### Evidence (enlarged crops, all showing the full subtitle inside the drawer)

Dev server, `0456449`, owner DPR (`dsf: 2`):

- `screenshots/gemini-part2-round3-verified-en-1919.png` — drawer heading, EN 1919
- `screenshots/gemini-part2-round3-verified-en-1535.png` — drawer heading, EN 1535
- `screenshots/gemini-part2-round3-verified-ar-1919.png` — drawer heading, AR 1919
- `screenshots/gemini-part2-round3-verified-ar-1535.png` — drawer heading, AR 1535
- `screenshots/gemini-part2-round3-leftedge-en-1919.png` — cropped to the subtitle
  box, EN 1919 (left edge: `أ` whole, not sliced)
- `screenshots/gemini-part2-round3-leftedge-en-1535.png` — same, EN 1535
- `screenshots/gemini-part2-round3-leftedge-ar-1919.png` — same, AR 1919
- `screenshots/gemini-part2-round3-leftedge-ar-1535.png` — same, AR 1535

Exact live-gate build (`4wmqi6rvq`), EN/AR:

- `screenshots/gemini-part2-round3-preview-before-en-1919.png`
- `screenshots/gemini-part2-round3-preview-before-en-1535.png`
- `screenshots/gemini-part2-round3-preview-before-ar-1919.png`

Stressed mechanism (font forced to 26 px — wraps to two fully visible lines):

- `screenshots/gemini-part2-round3-forced-en-1535.png`
- `screenshots/gemini-part2-round3-forced-ar-1919.png`

Earlier rounds' probes on the same HEAD:

- `screenshots/gemini-part2-round3-drawer-head-before-{en,ar}-{1919,1535}.png`
- `screenshots/gemini-part2-round3-subglyph-before-{en,ar}-{1919,1535}.png`
- `screenshots/gemini-part2-round3-subglyph-before-students-en-{1919,1535}.png`

Because no defect was reproduced, there is **no before/after delta**: the
"before" crops above *are* the current state. The forced-font crops are included
as the closest thing to an "after" — they demonstrate that the existing §2.10
mechanism wraps a too-long line to two lines rather than clipping.

---

## Conclusion

- **What changed:** nothing. No source file was edited this round.
- **Reproduced cause:** none — the symptom did not reproduce on the dev server
  (`0456449`) or on the live-gate preview (`4wmqi6rvq`), in EN or AR, at 1919 or
  1535 CSS px.
- The existing §2.10 mechanism (`min-width: 0` on `.tv-drawer-heading` +
  `overflow-wrap: anywhere` on its `.tv-cell-sub`) already covers the EN case;
  it is present in both `0456449` and the cited preview bundle.
- **§2.1 is not marked done.** If the live gate really did observe a sliced
  glyph, the missing ingredient is not in the code at `0456449` — the next step
  is the gate screenshot and the browser/zoom/DPR at which it was taken (the
  LIVE_RULES note records the owner's Chrome at `devicePixelRatio: 2`; layout is
  DPR-independent, so a *measurement* is needed, not a crop). No code change will
  be made against an unreproduced symptom, per the brief.

---

## Conflicts with `docs/BRIDGIO-LIVE_RULES.md`

None. The brief's §2.1 acceptance criterion ("subtitle fully visible in EN and AR
at 1919 and 1535, at-risk table un-scrolled, no clipping at either drawer edge")
is satisfied live at `0456449`; it simply was not achieved by a *new* change,
because the §2.10 change already satisfies it. Reported here rather than guessed
at, per the rules.
