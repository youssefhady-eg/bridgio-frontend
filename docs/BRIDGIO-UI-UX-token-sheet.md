# BRIDGIO — UI & UX Token Sheet (MVP)

**Status: WORKING token sheet for building the MVP UI, 2026-11-01.**
Source: BRIDGIO Brand Guidelines v1.4 (40 slides, verified, adopted 2026-11-01) + Short Brand Guide v1.5. Previous bases v1.3, v1.3-2 and v1.3-fixed are superseded; v1.2-2 is not to be used at all.
Scope: Egyptian high-school teachers and their students first. Arabic-first, light theme only.
Future layer (exotic languages 18–28, Learn-to-Hire) is NOT in MVP UI scope, except where a component is explicitly labelled Future Layer.

**How to read the labels — do not blur them:**
- **LOCKED** = already decided in the brand guideline / guide. Use as-is.
- **PROPOSED FOR UI** = not in the brand guideline, derived from locked colours/fonts so building does not wait. Owner locks these in one approval, or changes them — they are not brand locks until then.
- **TBD — DO NOT INVENT** = still needs an illustrator / owner decision. The interim rule below lets UI proceed without inventing it.

---

## 1. Colours

### LOCKED
- Brand red: `#D51C1D`
- Accent red (inside logo artwork only, sparingly for fills/emphasis, never as a second primary): `#F41920`
- Cream (background): `#F9ECD9` — the deck also uses `#F9EEDC` for the logo fill; use `#F9ECD9` as the app background, `#F9EEDC` only inside logo artwork.
- Paper (surface): `#FFF6E8`
- Maroon / ink: `#2C0706`
- Logo outline dark: `#471E1B`
- Status — Success: `#1F7A57` · Info: `#2A62B0` · Warning: `#F2A93B` **fill only** · Error: wine `#7E1A2B`
- Old error red `#A8141A` is removed from v1.3 (0 occurrences). Do not pull it from the old theme, and do not use it in UI.

### Colour rules — LOCKED
- Body text: maroon on cream, 15.8:1. This is the default text pairing.
- Brand red is NOT status red. In quizzes and marking, red must not automatically mean "wrong".
- `#F41920` on cream is 3.65:1 — never for text.
- `#D51C1D` on cream is 4.49:1, cream on `#D51C1D` is 4.56:1 — headlines / large bold text only, never small body copy.
- Status: always icon + word, never colour alone. Warning is fill only with maroon text (9.2:1); never amber text on cream (1.71:1).
- Mascot on red: Mohsen's body is the same red as the brand, so he loses his silhouette on a red background. Use cream or dark backgrounds for mascot poses. Do not put a pose directly on brand red.

### PROPOSED FOR UI — neutrals and borders (derived, not new brand colours)
Use opacity over the locked colours, so no new brand hex is invented:
- Text primary: maroon `#2C0706`
- Text secondary: maroon at 70% — `rgba(44, 7, 6, 0.70)`
- Text muted / caption: maroon at 55% — `rgba(44, 7, 6, 0.55)`
- Border / divider: maroon at 12% — `rgba(44, 7, 6, 0.12)`
- Card border / outline: maroon at 18% — `rgba(44, 7, 6, 0.18)`, or a 1–2 px solid maroon outline in sticker style (see §4).
- Disabled background: paper `#FFF6E8` with maroon at 8% overlay; disabled text: maroon at 40%.
- Hover background: maroon at 4% over paper/cream.
- Focus ring: maroon `#2C0706`, 2 px, offset 2 px (see §6).

### CSS variables — copy this block
```css
:root {
  --bridgio-red: #D51C1D;
  --bridgio-red-accent: #F41920; /* logo artwork only */
  --bridgio-cream: #F9ECD9;
  --bridgio-paper: #FFF6E8;
  --bridgio-maroon: #2C0706;
  --bridgio-maroon-outline: #471E1B;
  --bridgio-success: #1F7A57;
  --bridgio-info: #2A62B0;
  --bridgio-warning-fill: #F2A93B;
  --bridgio-error: #7E1A2B;
  --text-primary: #2C0706;
  --text-secondary: rgba(44, 7, 6, 0.70);
  --text-muted: rgba(44, 7, 6, 0.55);
  --border: rgba(44, 7, 6, 0.12);
  --border-strong: rgba(44, 7, 6, 0.18);
}
```

---

## 2. Typography

### LOCKED
- Latin display / headings: Sora, Bold / SemiBold (500–700). Never for long paragraphs or tiny UI labels.
- Latin body / labels: Nunito, Regular to ExtraBold (400–800).
- Arabic display / headings: Alexandria Bold.
- Arabic body (long reading): Baloo Bhaijaan 2 Regular (400).
- Arabic UI labels: Alexandria (per guide §7: Alexandria remains for Arabic display/UI, Baloo for longer Arabic reading).
- Fredoka: banned everywhere.
- Never retype the wordmark in any font. The wordmark is custom bubble lettering, not Sora.

### PROPOSED FOR UI — app type scale
The deck's 120 / 72 / 44 / 32 / 24 px scale is a presentation scale, NOT an app scale. Use this app scale instead (PROPOSED FOR UI):
- Hero / page title: 32 px, Sora Bold / Alexandria Bold, line-height 1.2
- H1 (screen title): 28 px, Sora Bold / Alexandria Bold, 1.25
- H2 (section): 22 px, Sora SemiBold / Alexandria Bold, 1.3
- H3 (card title): 18 px, Sora SemiBold / Alexandria Bold, 1.35
- Body: 16 px, Nunito / Baloo Bhaijaan 2, 1.55
- Body small: 14 px, Nunito / Baloo Bhaijaan 2, 1.5
- Label / button: 15 px, Nunito SemiBold / Alexandria SemiBold, 1.4
- Caption: 12 px, Nunito / Baloo Bhaijaan 2, 1.45
- Arabic + English on one screen: test side-by-side early. Sora + Alexandria Bold are both geometric, so bilingual headings should read as one system.

### Text colour by size — LOCKED rule, applied to UI
- Small body / label text: maroon on cream/paper only.
- Brand red text: large bold only (18 px+ bold). Never small brand-red body text.
- Small CTA buttons: use maroon background + cream text (15.8:1), not brand-red background, unless the button text is 18 px+ bold.

---

## 3. Spacing, radius, layout

### LOCKED (from deck)
- Cards: 24 px corners.
- Tags: pills.
- Logo clear space: x on every side, where x = height of the letter B in the logo. Minimum logo width: 200 px / 50 mm.

### PROPOSED FOR UI
- Spacing base: 4 px. Scale: 4, 8, 12, 16, 24, 32, 48, 64.
- Card radius: 24 px. Input radius: 12 px. Modal / sheet radius: 24 px. Chip / tag / pill radius: 999 px.
- Button radius: 999 px (pill, as in the teacher example Submit button). Secondary button: pill outline, maroon border.
- Touch target: minimum 44 px height for buttons, inputs and list rows.
- Shadows: none as a brand device. Use the sticker style: solid surface + 1–2 px maroon outline, not drop shadows. If a shadow is technically needed for a modal, use one soft maroon-tinted shadow and mark it as an exception, not a brand pattern.
- Layout: Arabic-first RTL. Header placement flips in RTL, but the logo lockup NEVER mirrors — Mohsen stays on the same side of BRIDGIO as in the original.
- Light theme only for MVP. No dark mode is specified in the guideline — do not invent one.

---

## 4. Logo and Mohsen in product UI

### LOCKED
- Full lockup only. No wordmark-only file exists. Do not cut the mascot off the wordmark (his hand overlaps the B), do not retype the wordmark, do not stretch, recolour or add effects.
- Colour lockup on light backgrounds; B&W lockup for single-colour / print / certificates.
- For mascot-only uses: use a pose from the 16-pose reactions sheet, not a cut-out of the lockup.
- Mohsen: empty states, streaks, quiz feedback, help — not on every screen.
- Mascot mode (delight) vs Assistant mode (trust): in Assistant mode Mohsen is more careful and verifiable than playful. If the assistant gives a wrong curriculum answer, mascot trust drops too.

### Interim rules — so UI does not wait (PROPOSED FOR UI, TBD for final)
- Large header / sidebar / splash / onboarding: full lockup, as in the guide.
- Small header slot (16–32 px) / favicon / app icon: **TBD — DO NOT INVENT a final mark.** Interim for internal build only: use "Bridgio" set in Sora as text (not presented as the logo), or a Mohsen pose inside a red rounded card as in the v1.3 teacher example. Do not use the full lockup in a 16–32 px slot, and do not use the withdrawn derived wordmark.
- Transparent mascot cutouts: **TBD.** The reactions sheet supplied is on a solid red background, for stickers/social, not for dropping onto light screens. Interim: show poses only inside red or cream cards (sticker style), never as a transparent overlay, until the illustrator supplies transparent, individually named cutouts.
- Clean wordmark: **TBD.** Full lockup only until the illustrator supplies a separate, clean wordmark file.
- Mohsen loading animation: **TBD.** The dark-swirl pose is to be animated as the progressive/loading Mohsen, but it is still a static image in v1.3. Interim: use the static loading pose with a standard progress indicator, and label the animation as pending.

---

## 5. MVP components (teacher-first)

Build these first. Everything else is Future Layer or later.

- **Header / nav:** full lockup (large) or interim small-slot rule above; teacher nav: Dashboard, My Classes, Tests, Students; student nav: My Tests, Lessons, Progress.
- **Teacher dashboard:** classes, recent tests, student progress at a glance. Lead copy with time saved, not with hiring promises.
- **Test builder (the v1.3 teacher example, as a real flow):**
  1. Choose material or a curriculum unit.
  2. Mohsen drafts questions.
  3. Teacher reviews and edits (every generated question is editable/deletable before publishing).
  4. Publish to the class.
- **Student test player:** Question 1, options A/B, Submit, progress, Mohsen Q&A panel on the same screen.
- **Mohsen Q&A panel:** answers curriculum questions grounded in the teacher's material + fixed curriculum only. Show the grounding (material/unit) with the answer. No ungrounded chat. If Mohsen does not know from the material, say so — do not guess.
- **Buttons:** primary (maroon bg, cream text, pill), secondary (pill outline, maroon text), danger/error actions use wine `#7E1A2B`, never brand red for "wrong".
- **Inputs:** 12 px radius, maroon border on focus, label above input, helper text below. Email example in the deck is a pattern, not a required field.
- **Tags / chips:** pills, as in the deck.
- **Progress:** progress bar + "Unit 3 · 64%" pattern from the deck; streak and lesson-count patterns from the dashboard examples, applied to teacher/student progress, not to exotic-language streaks.
- **States:** Empty ("Nothing here yet" + Mohsen wakes up pattern), Error ("Our side, not yours. Try again in a moment."), Success ("Unit complete. Nice. Next unit is ready when you are.") — all with icon + word for status, never colour alone.
- **Course card:** as in the deck (title, units/lessons, certificate note) — for teacher classes/units in MVP, not for German A1 etc. in MVP.

### NOT in MVP UI
- Exotic-language courses, native-mentor flows, Jobs / Learn-to-Hire matching, certificates for German A1 etc. Those are Future Layer examples in the deck. Keep their pills/labels if they appear in a demo, do not build them as MVP product flows.
- Intelligent marking: explicitly NOT in the high-school-teacher prototype (owner decision 2026-10-28). Do not build or promise it in UI copy.
- Installments in this phase: teacher subscription only, per student per month. Do not build installment UI for this phase.

---

## 6. Voice, copy and accessibility in UI

### LOCKED
- Student-facing: Egyptian casual Arabic, plus simple English where the product uses it. Calm, encouraging, nonchalant: short sentences, no panic, no hustle talk.
- Teacher / admin / formal: MSA formal, plus clear English for product terms. Respectful, time-saving, direct about what Mohsen can and cannot do.
- Never mix dialects in one message. Casual for students, formal for teachers, parents and certificates.
- Teacher copy: lead with time saved (tests, revision, follow-up), not future hiring promises.
- Student copy: lead with the next small step, not career pressure.
- Taglines in product: primary "From classroom to career." for the long story / decks / sales to teachers about what comes next; soft "Your bridge to what's next." for student-facing product moments; campaign "Learn it. Land it." for exotic campaigns only, never as the main product line.
- Arabic taglines and new v1.3 Arabic (slide 22, teacher slide) are **drafts awaiting approval**. Centralise all UI strings so Arabic wording can be updated in one place when final-checked. Do not hardcode draft Arabic as final in multiple places.
- Running text: "Bridgio" in Latin, logo itself all-caps BRIDGIO, never retyped. In Arabic running text, keep Latin BRIDGIO (per guide §2). No Arabic wordmark.

### PROPOSED FOR UI — accessibility (UX standard, not brand invention)
- Focus visible: 2 px maroon outline, 2 px offset, on every interactive element.
- Minimum touch target 44 px.
- Status always icon + word.
- Do not rely on red/green alone for right/wrong in quizzes — use icon + word + maroon/wine/success pairing as in §1.
- Test Arabic + English side-by-side early on real screens, not only in the deck.

---

## 7. What is still TBD — and how UI proceeds without waiting

| TBD item | Interim rule for MVP UI | Final decision needed from |
|---|---|---|
| Small-size mark / favicon / app icon | Sora text or Mohsen pose in a red card, internal build only | Illustrator (clean small mark) |
| Transparent mascot cutouts | Poses only inside red/cream cards, never transparent overlay | Illustrator |
| Clean wordmark | Full lockup only | Illustrator |
| Secondary / neutral colours | Opacity neutrals in §1 (PROPOSED FOR UI) | Owner lock of §1 proposed values |
| UI type scale / spacing / radius | §2–§3 PROPOSED FOR UI values | Owner lock of §2–§3 proposed values |
| Arabic final wording | Draft strings, centralised, labelled draft | Owner / Arabic reviewer, one pass |
| Mohsen loading animation | Static loading pose + standard progress indicator | Illustrator / motion decision |
| BRIDGIO name / domain / trademark | Working name, internal build only; do not print, buy domains or ship externally on the assumption it is locked | Owner + trademark/domain check |
| Website / handle / company / price | Keep `[website]`, `[@handle]`, `[company name]`, `[price]` as placeholders in UI copy | Owner, "not now" for this phase |

**Name status reminder:** BRIDGIO is a working name for now, not locked final. Mohsen is also a working name and may still change. Centralise both names in UI strings and assets so a rename is a swap, not a rebuild.

---

## 8. Sources and version

- Deck: `BRIDGIO_Brand_Guidelines_v1.4.pptx` (40 slides, adopted 2026-11-01). Cover, slide 22 AR assistant and slide 29 Arabic taglines fixed from v1.3-2; all other slides identical to v1.3-2, render-checked in LibreOffice on slides 1, 22 and 29, PowerPoint check still recommended before external hand-over.
- Guide: `BRIDGIO-short-brand-guide.md` v1.5 (visual HTML guide is still v1.4 — do not use it as current).
- This token sheet does not change the brand guideline. PROPOSED FOR UI values become brand values only if the owner locks them explicitly. TBD items remain TBD until the decision in §7 is made.
