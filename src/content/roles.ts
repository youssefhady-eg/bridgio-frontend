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