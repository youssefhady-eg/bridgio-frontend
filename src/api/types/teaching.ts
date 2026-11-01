import type { User } from './auth'
import type {
  ClassroomId,
  IsoDateTime,
  SubjectId,
  UnitId,
  UserId,
} from './common'
import type { CurriculumUnit } from './curriculum'
import type { TestSummary } from './tests'

/**
 * Teacher / student projections and the teacher dashboard aggregate.
 *
 * PROPOSED — Mentingo to implement on restore/rebuild.
 * These are view models over Mentingo users and courses. They do not create a
 * second user model, and every field must be supplied by the adapter.
 */

export interface TeacherProfile {
  user: User
  subjectIds: SubjectId[]
  gradeLevels: string[]
}

export interface StudentProfile {
  user: User
  gradeLevel: string
  classroomIds: ClassroomId[]
}

export interface ClassroomSummary {
  id: ClassroomId
  name: string
  subjectId: SubjectId
  subjectName: string
  gradeLevel: string
  studentCount: number
  unitCount: number
  lessonCount: number
  /** Deck-style course card note for teacher classes; never a Future Layer flow. */
  certificateNote: string | null
  createdAt: IsoDateTime
}

export interface ClassroomUnit {
  unit: CurriculumUnit
  materialCount: number
  testCount: number
}

export interface ClassroomDetail extends ClassroomSummary {
  teacherId: UserId
  description: string | null
  units: ClassroomUnit[]
}

export interface ClassroomStudent {
  student: User
  progressPercent: number
  lastActiveAt: IsoDateTime | null
}

/** "Student progress at a glance" row for the teacher dashboard. */
export interface StudentProgressSnapshot {
  student: User
  classroomId: ClassroomId
  classroomName: string
  progressPercent: number
  completedUnits: number
  totalUnits: number
  lastActiveAt: IsoDateTime | null
}

export interface TeacherDashboard {
  teacher: User
  classes: ClassroomSummary[]
  recentTests: TestSummary[]
  studentProgress: StudentProgressSnapshot[]
  totals: {
    classes: number
    students: number
    publishedTests: number
    draftTests: number
  }
}

export interface StudentUnitProgress {
  unit: CurriculumUnit
  progressPercent: number
  lessonsCompleted: number
}

export interface StudentProgress {
  student: User
  classroomId: ClassroomId | null
  overallPercent: number
  units: StudentUnitProgress[]
  lastActiveAt: IsoDateTime | null
}
