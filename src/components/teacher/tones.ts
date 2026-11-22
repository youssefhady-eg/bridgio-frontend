import type { Lang } from '~/shell/lang'
import { formatPercent } from '~/components/dashboard/format'

/**
 * Mastery tone rule (demo `toneOf`, docs/gemini-demo.html line 1022):
 *   >= 75 → success, >= 55 → warning, below 55 → danger.
 *
 * This is the mastery rule only. Question difficulty has its own easy/medium/
 * hard mapping (see `difficultyTone`) and must never share this function.
 */
export type Tone = 'success' | 'warning' | 'danger'

export function masteryTone(percent: number): Tone {
  if (percent >= 75) return 'success'
  if (percent >= 55) return 'warning'
  return 'danger'
}

/** Question difficulty tone — deliberately separate from `masteryTone`. */
export function difficultyTone(difficulty: 'easy' | 'medium' | 'hard'): Tone {
  if (difficulty === 'easy') return 'success'
  if (difficulty === 'medium') return 'warning'
  return 'danger'
}

/**
 * A score the backend has not produced yet renders as an em dash, never as 0%.
 * The dashboard, the tests list and the student drawer all read scores through
 * this one function so the rule cannot drift between screens.
 */
export function scoreText(
  scorePercent: number | null,
  lang: Lang,
  unavailable: string,
): string {
  return scorePercent === null
    ? unavailable
    : formatPercent(scorePercent, lang)
}

/**
 * Height in px for one bar in the drawer's "last three tests" chart. The demo
 * scales a 0–100 score into a 0–58 px plot (`Math.round(score * 0.58)`, line
 * 1995) so three bars plus their labels fit the 110 px panel body. A null score
 * has no bar at all (the caller skips it); a real score keeps a visible 3 px
 * stub so zero is drawn, not hidden.
 */
export function scoreBarHeight(scorePercent: number): number {
  const clamped = Math.max(0, Math.min(100, scorePercent))
  return Math.max(3, Math.round(clamped * 0.58))
}