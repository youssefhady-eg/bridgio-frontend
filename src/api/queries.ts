import { queryOptions } from '@tanstack/react-query'
import { api } from './index'
import { queryKeys } from './query-keys'
import type { AttemptId, ClassroomId, TestId, UserId } from './types'

/**
 * Query options for the single API layer. Feature stages add their own options
 * here so components never build raw query functions or call the adapter ad hoc.
 */

export const adapterInfoQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.system.info(),
    queryFn: () => api.system.getInfo(),
    staleTime: Number.POSITIVE_INFINITY,
  })

export const sessionQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.auth.session(),
    queryFn: () => api.auth.getSession(),
    staleTime: 30_000,
  })

/**
 * Stage 2 teacher dashboard aggregate. One adapter call returns classes, recent
 * tests and at-a-glance student progress, so the screen never assembles
 * persistent data itself. PROPOSED — served by the mock in this MVP.
 */
export const teacherDashboardQueryOptions = (teacherId: UserId) =>
  queryOptions({
    queryKey: queryKeys.teachers.dashboard(teacherId),
    queryFn: () => api.teachers.getDashboard({ teacherId }),
    staleTime: 30_000,
  })

/**
 * Stage 3 test builder — step 1 sources.
 *
 * Classes, class units and teacher materials all come from existing Stage 0
 * adapter methods. No new contract fields are introduced, and every endpoint
 * stays PROPOSED — Mentingo to implement on restore/rebuild.
 */
export const teacherClassroomsQueryOptions = (teacherId: UserId) =>
  queryOptions({
    queryKey: queryKeys.classrooms.forTeacher(teacherId),
    queryFn: () => api.classrooms.listForTeacher({ teacherId }),
    staleTime: 30_000,
  })

export const classroomDetailQueryOptions = (classroomId: ClassroomId) =>
  queryOptions({
    queryKey: queryKeys.classrooms.detail(classroomId),
    queryFn: () => api.classrooms.get({ classroomId }),
    staleTime: 30_000,
  })

export const teacherMaterialsQueryOptions = (
  teacherId: UserId,
  classroomId?: ClassroomId,
) =>
  queryOptions({
    queryKey: queryKeys.materials.forTeacher(teacherId, classroomId),
    queryFn: () => api.materials.listForTeacher({ teacherId, classroomId }),
    staleTime: 30_000,
  })

/** Stage 3 step 2/3 — the draft test and its ordered questions. */
export const testQueryOptions = (testId: TestId) =>
  queryOptions({
    queryKey: queryKeys.tests.detail(testId),
    queryFn: () => api.tests.get({ testId }),
    staleTime: 0,
  })

/**
 * TEACHER-ONLY: full questions including `correctOptionId`, for the builder's
 * review/edit steps. Student screens must use `studentTestQuestionsQueryOptions`.
 */
export const testQuestionsQueryOptions = (testId: TestId) =>
  queryOptions({
    queryKey: queryKeys.tests.questions(testId),
    queryFn: () => api.questions.listForTest({ testId }),
    staleTime: 0,
  })

/**
 * Stage 4 student test player.
 *
 * Every option below wraps an existing Stage 0 adapter method; no contract field
 * is added and every endpoint stays PROPOSED. A student's classes come from the
 * profile, their published tests are read per class, and their own attempts are
 * read from the adapter — the player never invents a test or an attempt.
 */
export const studentProfileQueryOptions = (studentId: UserId) =>
  queryOptions({
    queryKey: queryKeys.students.profile(studentId),
    queryFn: () => api.students.getProfile({ studentId }),
    staleTime: 30_000,
  })

export const classTestsQueryOptions = (classroomId: ClassroomId) =>
  queryOptions({
    queryKey: queryKeys.tests.forClass(classroomId),
    queryFn: () => api.tests.listForClass({ classroomId }),
    staleTime: 0,
  })

/**
 * The player's questions: student-safe (no `correctOptionId`) and cached under a
 * separate key from the builder's full questions, so a teacher-loaded answer key
 * can never be served to the player from the shared Query cache.
 */
export const studentTestQuestionsQueryOptions = (testId: TestId) =>
  queryOptions({
    queryKey: queryKeys.tests.studentQuestions(testId),
    queryFn: () => api.questions.listForStudentTest({ testId }),
    staleTime: 0,
  })

export const studentAttemptsQueryOptions = (studentId: UserId) =>
  queryOptions({
    queryKey: queryKeys.attempts.forStudent(studentId),
    queryFn: () => api.attempts.listForStudent({ studentId }),
    staleTime: 0,
  })

export const attemptQueryOptions = (attemptId: AttemptId) =>
  queryOptions({
    queryKey: queryKeys.attempts.detail(attemptId),
    queryFn: () => api.attempts.get({ attemptId }),
    staleTime: 0,
  })
