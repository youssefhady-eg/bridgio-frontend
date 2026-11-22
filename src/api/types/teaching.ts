import type { User } from './auth'
import type {
  AttemptId,
  ClassroomId,
  IsoDateTime,
  SubjectId,
  TestId,
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
  /**
   * PROPOSED — Part 2 (2026-11-22). Backend mean of the class's student
   * mastery; null when the class has no students. Never computed by the UI.
   */
  averageMasteryPercent: number | null
  /** PROPOSED — Part 2. Students below 55% mastery. */
  atRiskCount: number
  /**
   * PROPOSED — Part 2. Units every enrolled student has completed (100% each).
   * Never derived from a percentage in the UI.
   */
  unitsDone: number
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
  /**
   * PROPOSED — Part 2. Score of the student's most recent submitted attempt in
   * this class, backend-supplied; null when there is none or it is unscored.
   */
  lastScorePercent: number | null
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
  /**
   * PROPOSED — Part 2. Score of the most recent submitted attempt in this
   * class, backend-supplied; null when there is none or it is unscored.
   */
  lastScorePercent: number | null
}

/**
 * PROPOSED — Part 2. One recent submission row for the teacher dashboard.
 * Every value is supplied by the backend; the dashboard never marks an answer.
 */
export interface TeacherSubmission {
  id: AttemptId
  studentId: UserId
  studentName: string
  testId: TestId
  testTitle: string
  submittedAt: IsoDateTime
  /** Backend-supplied; null renders as unavailable, never as zero. */
  scorePercent: number | null
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
  /** PROPOSED — Part 2. Mean student mastery; null when there are no students. */
  averageMasteryPercent: number | null
  /** PROPOSED — Part 2. Students below 55% mastery. */
  atRiskCount: number
  /** PROPOSED — Part 2. Per-class mean mastery (null when the class is empty). */
  averageMasteryByClass: {
    classroomId: ClassroomId
    averageMasteryPercent: number | null
  }[]
  /** PROPOSED — Part 2. Submitted attempts across the teacher's tests. */
  submittedAttemptsCount: number
  /** PROPOSED — Part 2. Submitted attempts that carry a backend score. */
  scoredSubmissionsCount: number
  /** PROPOSED — Part 2. The 5 most recent submissions, newest first. */
  recentSubmissions: TeacherSubmission[]
  /** PROPOSED — Part 2. Mean mastery per curriculum unit in the teacher's classes. */
  unitMastery: {
    unitId: UnitId
    unitName: string
    masteryPercent: number
  }[]
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
