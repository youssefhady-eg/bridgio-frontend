import { queryOptions } from '@tanstack/react-query'
import { api } from './index'
import { queryKeys } from './query-keys'

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
