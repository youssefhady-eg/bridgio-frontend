import { createFileRoute } from '@tanstack/react-router'
import { NotBuiltScreen } from '~/components/NotBuiltScreen'

/**
 * Stage 1 placeholder ONLY ("Progress" from the student nav). Progress
 * patterns come with the later stages; nothing is built here.
 */
export const Route = createFileRoute('/student/progress')({
  component: () => <NotBuiltScreen id="student-progress" />,
})
