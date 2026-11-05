/**
 * Arabic number–noun agreement for UI copy.
 *
 * A counted noun in Arabic changes with the number, so a fixed plural reads as
 * wrong for 1 and 2 ("١ أسئلة", "٢ أسئلة") and for 11+ in formal Arabic:
 *
 *   1      → the singular with "واحد"      سؤال واحد
 *   2      → the dual, with no digit        سؤالان
 *   3–10   → digit + plural                 ٣ أسئلة
 *   11+    → digit + singular               ١١ سؤالًا
 *   0      → digit + plural                 ٠ أسئلة
 *
 * Teacher copy is formal (MSA) and student copy is Egyptian casual, so each
 * noun carries its own `NounForms` per register (see `strings.ts`). Counts of
 * 100 and above are not special-cased: they use the `many` form.
 *
 * Display only: it never touches the value that goes to the API.
 */

export interface NounForms {
  /** Complete phrase for exactly one, e.g. "سؤال واحد". */
  one: string
  /** Complete phrase for exactly two, e.g. "سؤالان". */
  two: string
  /** Noun used after the digit for 0 and 3–10, e.g. "أسئلة". */
  few: string
  /** Noun used after the digit for 11 and above, e.g. "سؤالًا". */
  many: string
}

const arabicDigits = new Intl.NumberFormat('ar-EG', { maximumFractionDigits: 0 })

/** Whole, non-negative count; anything else counts as 0. */
function wholeCount(value: number): number {
  return Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0
}

/** The counted phrase for `count`, e.g. 2 → "سؤالان", 3 → "٣ أسئلة". */
export function countPhrase(count: number, forms: NounForms): string {
  const n = wholeCount(count)
  if (n === 1) return forms.one
  if (n === 2) return forms.two
  const noun = n >= 11 ? forms.many : forms.few
  return `${arabicDigits.format(n)} ${noun}`
}

const westernDigits = new Intl.NumberFormat('en', { maximumFractionDigits: 0 })

/** English count phrase: "1 question", "3 questions". Bad counts print 0. */
export function englishCount(
  count: number,
  singular: string,
  plural: string,
): string {
  const n = wholeCount(count)
  return `${westernDigits.format(n)} ${n === 1 ? singular : plural}`
}
