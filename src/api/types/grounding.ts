import type { ClassroomId, MaterialId, TestId, UnitId } from './common'

/**
 * Grounding reference shown next to every Mohsen answer and every Mohsen-drafted
 * question. Mohsen answers only from teacher-uploaded material plus the fixed
 * Egyptian curriculum. There is no ungrounded chat.
 *
 * PROPOSED — Mentingo to implement on restore/rebuild.
 */
export interface GroundingRef {
  kind: 'material' | 'curriculum_unit'
  materialId: MaterialId | null
  unitId: UnitId | null
  /** Human-readable label for the UI, e.g. the material title or unit title. */
  label: string
  /** Short excerpt that supports the answer. Null when no excerpt is available. */
  excerpt: string | null
}

/** Scope that a Mohsen question or draft request is allowed to use. */
export interface GroundingScope {
  classroomId: ClassroomId | null
  testId: TestId | null
  materialIds: MaterialId[]
  unitId: UnitId | null
}
