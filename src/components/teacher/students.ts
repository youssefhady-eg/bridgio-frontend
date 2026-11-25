import type { StudentProgressSnapshot } from '~/api/types'

/**
 * One row per student, keeping the enrolment with the lowest progress — the one
 * that most needs the teacher's attention. Input order is preserved, so the
 * caller keeps the adapter's ordering; a student who appears once is returned
 * unchanged.
 *
 * Pure presentation logic: no value is computed, only selected.
 */
export function dedupeByStudent(
  rows: readonly StudentProgressSnapshot[],
): StudentProgressSnapshot[] {
  const byStudent = new Map<string, StudentProgressSnapshot>()
  for (const row of rows) {
    const current = byStudent.get(row.student.id)
    if (!current || row.progressPercent < current.progressPercent) {
      byStudent.set(row.student.id, row)
    }
  }
  return [...byStudent.values()]
}