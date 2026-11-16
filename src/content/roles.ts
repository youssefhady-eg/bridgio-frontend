import type { User } from '~/api/types'
import type { PreviewRoleId } from './strings'

/**
 * Role label for the signed-in user.
 *
 * The backend may supply `User.gender` (PROPOSED). When it is `'female'` the
 * screen uses the female label from the central strings (for example
 * "المعلمة"); when it is `null` (not supplied) the neutral label is kept, so
 * the UI never guesses a gender. English has no grammatical gender in these
 * labels, so both label sets are identical there.
 */
export function roleLabel(
  user: Pick<User, 'role' | 'gender'>,
  labels: Record<PreviewRoleId, string>,
  femaleLabels: Record<PreviewRoleId, string>,
): string {
  return user.gender === 'female' ? femaleLabels[user.role] : labels[user.role]
}

/**
 * Dashboard heading for the signed-in user ("لوحة المعلمة" / "لوحة المعلم").
 *
 * Same rule as `roleLabel`: the female form is used only when the backend
 * supplies `gender: 'female'`; a null (or male) gender keeps the existing
 * string, so the UI never guesses a gender. English has no grammatical gender
 * here, so both forms are identical there.
 */
export function dashboardLabel(
  user: Pick<User, 'gender'>,
  labels: { title: string; titleFemale: string },
): string {
  return user.gender === 'female' ? labels.titleFemale : labels.title
}

/**
 * Dashboard name inside a sentence (the Help link label and the Guide step).
 *
 * When a session user is known the label follows their gender, exactly like
 * `dashboardLabel` ("لوحة المعلمة" / "لوحة المعلم"); with no session it falls
 * back to the neutral name ("لوحة التحكم"), so the page never guesses.
 */
export function dashboardLinkLabel(
  user: Pick<User, 'gender'> | null,
  labels: { title: string; titleFemale: string; titleNeutral: string },
): string {
  if (!user) return labels.titleNeutral
  return user.gender === 'female' ? labels.titleFemale : labels.title
}