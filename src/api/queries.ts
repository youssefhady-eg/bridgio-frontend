import { queryOptions } from '@tanstack/react-query'
import { api } from './index'
import { queryKeys } from './query-keys'
import type { ClassroomId, TestId, UserId } from './types'

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

export const testQuestionsQueryOptions = (testId: TestId) =>
  queryOptions({
    queryKey: queryKeys.tests.questions(testId),
    queryFn: () => api.questions.listForTest({ testId }),
    staleTime: 0,
  })
