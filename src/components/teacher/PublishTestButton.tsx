import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '~/api'
import { queryKeys } from '~/api/query-keys'
import type { TestSummary, UserId } from '~/api/types'

/**
 * Publish one draft test from a list.
 *
 * `tests.publish` already exists; the button only calls it and refreshes the
 * lists that carry the test (the teacher's tests, the class's published tests
 * and the dashboard aggregate). Nothing is optimistically flipped: the status
 * changes when the adapter confirms it.
 */
export function PublishTestButton({
  teacherId,
  test,
  labels,
}: {
  teacherId: UserId
  test: TestSummary
  labels: {
    publish: string
    publishing: string
    error: string
  }
}) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => api.tests.publish({ teacherId, testId: test.id }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.tests.forTeacher(teacherId),
      })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.tests.forClass(test.classroomId),
      })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.teachers.dashboard(teacherId),
      })
      void queryClient.invalidateQueries({ queryKey: queryKeys.questions.all() })
    },
  })

  return (
    <>
      <button
        type="button"
        className="tv-btn tv-btn-primary tv-btn-sm"
        disabled={mutation.isPending}
        onClick={() => mutation.mutate()}
      >
        {mutation.isPending ? labels.publishing : labels.publish}
      </button>
      {mutation.isError ? (
        <span className="tv-inline-error" role="alert">
          {labels.error}
        </span>
      ) : null}
    </>
  )
}