import { queryOptions } from '@tanstack/react-query'
import { api } from './index'
import { queryKeys } from './query-keys'
import type { UserId } from './types'

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
