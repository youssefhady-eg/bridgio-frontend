import { createFileRoute } from '@tanstack/react-router'
import {
  sessionQueryOptions,
  teacherQuestionBankQueryOptions,
} from '~/api/queries'
import { QuestionBank } from '~/components/teacher/QuestionBank'
import { stringsFor } from '~/shell/useStrings'

/**
 * Teacher question bank at `/teacher/question-bank`.
 *
 * The loader prefetches the session and the composed bank (tests + full
 * questions) so the grouped list renders from cache on SSR. Failures are
 * swallowed so the screen draws its own error/empty notes from the query
 * status. Teacher-only: `questions.listForTest` carries `correctOptionId` and
 * the mock refuses it for a student session.
 */
export const Route = createFileRoute('/teacher/question-bank')({
  head: ({ match }) => ({
    meta: [{ title: stringsFor(match.search.lang).questionBank.headTitle }],
  }),
  loader: async ({ context }) => {
    try {
      const session = await context.queryClient.ensureQueryData(
        sessionQueryOptions(),
      )
      if (session?.user.role === 'teacher') {
        await context.queryClient.ensureQueryData(
          teacherQuestionBankQueryOptions(session.user.id),
        )
      }
    } catch {
      // Query status carries the failure to the screen's error state.
    }
  },
  component: QuestionBank,
})
