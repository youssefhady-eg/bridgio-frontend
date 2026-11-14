import { queryOptions } from '@tanstack/react-query'
import { api } from './index'
import { queryKeys } from './query-keys'
import type {
  AttemptId,
  ClassroomId,
  ClassroomSummary,
  CurriculumUnit,
  Material,
  MaterialId,
  Question,
  TestId,
  TestSummary,
  UserId,
} from './types'

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

/**
 * Teacher per-test results — `attempts.listForTest`, a PROPOSED Batch 2 method
 * the contract did not have before. TEACHER-ONLY: the mock refuses any other
 * role. Scores in this list are backend-supplied values; nothing here computes
 * one.
 */
export const testAttemptsQueryOptions = (testId: TestId) =>
  queryOptions({
    queryKey: queryKeys.attempts.forTest(testId),
    queryFn: () => api.attempts.listForTest({ testId }),
    staleTime: 0,
  })

/**
 * Frontend-finish screens — every option below wraps an existing Stage 0
 * adapter method. No contract field or adapter method is added; each screen
 * reads its data through this layer only.
 */

/** Class detail roster — `classrooms.listStudents` (PROPOSED, teacher-only). */
export const classroomStudentsQueryOptions = (classroomId: ClassroomId) =>
  queryOptions({
    queryKey: queryKeys.classrooms.students(classroomId),
    queryFn: () => api.classrooms.listStudents({ classroomId }),
    staleTime: 30_000,
  })

/** Teacher test list — `tests.listForTeacher` (PROPOSED, teacher-only). */
export const teacherTestsQueryOptions = (teacherId: UserId) =>
  queryOptions({
    queryKey: queryKeys.tests.forTeacher(teacherId),
    queryFn: () => api.tests.listForTeacher({ teacherId }),
    staleTime: 0,
  })

/**
 * Teacher question bank — composed from existing adapter methods, no contract
 * change.
 *
 * The PROPOSED contract has `questions.listForTest` only, so the bank lists the
 * teacher's tests and then reads each test's full questions: one call per test.
 * That N+1 is the honest cost of not inventing an endpoint; a future
 * `questions.listForTeacher` would collapse it.
 *
 * TEACHER-ONLY: full questions carry `correctOptionId`, so only the teacher
 * bank screen may use this option. Student screens must keep using
 * `studentTestQuestionsQueryOptions`.
 */
export interface QuestionBankGroup {
  test: TestSummary
  questions: Question[]
}

export const teacherQuestionBankQueryOptions = (teacherId: UserId) =>
  queryOptions({
    queryKey: queryKeys.questions.forTeacher(teacherId),
    queryFn: async (): Promise<QuestionBankGroup[]> => {
      const tests = await api.tests.listForTeacher({ teacherId })
      return Promise.all(
        tests.map(async (test) => ({
          test,
          questions: await api.questions.listForTest({ testId: test.id }),
        })),
      )
    },
    staleTime: 0,
  })

/**
 * Teacher material library — composed from existing adapter methods, no
 * contract change.
 *
 * `materials.listForTeacher` supplies the materials, `classrooms.listForTeacher`
 * the class filter, and `classrooms.get` the unit names (and the per-class unit
 * choices for the create form). All are PROPOSED.
 */
export interface MaterialLibraryData {
  materials: Material[]
  classrooms: ClassroomSummary[]
  unitsByClass: Record<ClassroomId, CurriculumUnit[]>
}

export const materialLibraryQueryOptions = (teacherId: UserId) =>
  queryOptions({
    queryKey: queryKeys.materials.library(teacherId),
    queryFn: async (): Promise<MaterialLibraryData> => {
      const [materials, classrooms] = await Promise.all([
        api.materials.listForTeacher({ teacherId }),
        api.classrooms.listForTeacher({ teacherId }),
      ])
      const details = await Promise.all(
        classrooms.map((classroom) =>
          api.classrooms.get({ classroomId: classroom.id }),
        ),
      )
      const unitsByClass: Record<ClassroomId, CurriculumUnit[]> = {}
      for (const detail of details) {
        unitsByClass[detail.id] = detail.units.map((entry) => entry.unit)
      }
      return { materials, classrooms, unitsByClass }
    },
    staleTime: 0,
  })

/** One material's full record — `materials.get` (PROPOSED, teacher-only). */
export const materialDetailQueryOptions = (materialId: MaterialId) =>
  queryOptions({
    queryKey: queryKeys.materials.detail(materialId),
    queryFn: () => api.materials.get({ materialId }),
    staleTime: 0,
  })

/** One student's progress — `students.getProgress` (PROPOSED). */
export const studentProgressQueryOptions = (
  studentId: UserId,
  classroomId?: ClassroomId,
) =>
  queryOptions({
    queryKey: queryKeys.students.progress(studentId, classroomId),
    queryFn: () => api.students.getProgress({ studentId, classroomId }),
    staleTime: 30_000,
  })

/**
 * Teacher Assistant grants — RBAC-owned. The sidebar reads this and renders
 * only the granted items; the frontend never decides grants.
 */
export const capabilitiesQueryOptions = (userId: UserId) =>
  queryOptions({
    queryKey: queryKeys.rbac.capabilities(userId),
    queryFn: () => api.rbac.getCapabilities({ userId }),
    staleTime: 30_000,
  })

/** Parent view — display only, assembled by the backend. */
export const parentProfileQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.parents.profile(),
    queryFn: () => api.parents.getProfile(),
    staleTime: 30_000,
  })

export const parentOverviewQueryOptions = (childId: UserId) =>
  queryOptions({
    queryKey: queryKeys.parents.overview(childId),
    queryFn: () => api.parents.getOverview({ childId }),
    staleTime: 30_000,
  })

/** In-app chat — mock only. Screens never call fetch directly. */
export const messageThreadsQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.messages.threads(),
    queryFn: () => api.messages.listThreads(),
    staleTime: 0,
  })

export const threadMessagesQueryOptions = (threadId: string) =>
  queryOptions({
    queryKey: queryKeys.messages.thread(threadId),
    queryFn: () => api.messages.listMessages({ threadId }),
    staleTime: 0,
  })

/**
 * Notifications — `notifications.listForUser`, a PROPOSED Batch 5 method the
 * contract did not have before. TEACHER-ONLY: the screen and its sidebar entry
 * are shown to the teacher role and the mock returns an empty list for any
 * other role.
 */
export const notificationsQueryOptions = (userId: UserId) =>
  queryOptions({
    queryKey: queryKeys.notifications.forUser(userId),
    queryFn: () => api.notifications.listForUser({ userId }),
    staleTime: 0,
  })

/**
 * Global in-app search — `search.search`, a PROPOSED Batch 5 method. The query
 * is disabled until it has non-whitespace content, so the screen never fires a
 * search for an empty box. TEACHER-ONLY in the mock.
 */
export const searchQueryOptions = (query: string) =>
  queryOptions({
    queryKey: queryKeys.search.results(query),
    queryFn: () => api.search.search({ query }),
    enabled: query.trim().length > 0,
    staleTime: 0,
  })
