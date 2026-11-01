import type {
  ClassroomId,
  IsoDateTime,
  MaterialId,
  SubjectId,
  UnitId,
  UserId,
} from './common'

/**
 * Fixed Egyptian curriculum (proposed projection).
 *
 * PROPOSED — Mentingo to implement on restore/rebuild.
 * The exact curriculum source and identifiers are unconfirmed; they must not be
 * hard-coded in UI components. All curriculum data arrives through the adapter.
 */
export interface CurriculumSubject {
  id: SubjectId
  name: string
  gradeLevel: string
  unitCount: number
}

/**
 * PROPOSED — Mentingo to implement on restore/rebuild.
 */
export interface CurriculumUnit {
  id: UnitId
  subjectId: SubjectId
  subjectName: string
  title: string
  description: string | null
  order: number
  lessonCount: number
}

/**
 * Teacher-uploaded material used to ground Mohsen.
 *
 * PROPOSED — Mentingo to implement on restore/rebuild.
 * Binary upload / storage is UNCONFIRMED and is an integration gap. The contract
 * exposes ingestion state and extracted text; extraction is a server concern.
 */
export type MaterialKind = 'text' | 'pdf' | 'image' | 'link'
export type MaterialStatus = 'processing' | 'ready' | 'failed'

export interface Material {
  id: MaterialId
  teacherId: UserId
  classroomId: ClassroomId
  unitId: UnitId | null
  title: string
  kind: MaterialKind
  status: MaterialStatus
  /** Extracted text available for grounding once status is `ready`. */
  textContent: string | null
  sourceUrl: string | null
  wordCount: number | null
  createdAt: IsoDateTime
}

/**
 * PROPOSED — Mentingo to implement on restore/rebuild.
 * Metadata-only creation for Stage 0/3. Binary upload is not part of this contract.
 */
export interface CreateMaterialInput {
  teacherId: UserId
  classroomId: ClassroomId
  unitId: UnitId | null
  title: string
  kind: MaterialKind
  textContent: string | null
  sourceUrl: string | null
}
