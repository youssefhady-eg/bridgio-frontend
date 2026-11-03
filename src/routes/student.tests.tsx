import { createFileRoute } from '@tanstack/react-router'
import { NotBuiltScreen } from '~/components/NotBuiltScreen'

/**
 * Stage 1 placeholder ONLY ("My Tests" from the student nav). The student test
 * player is Stage 4 — not built here.
 */
export const Route = createFileRoute('/student/tests')({
  component: () => <NotBuiltScreen id="student-tests" />,
})
