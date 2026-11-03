import { createFileRoute } from '@tanstack/react-router'
import { NotBuiltScreen } from '~/components/NotBuiltScreen'

/**
 * Stage 1 placeholder ONLY ("My Classes" from the teacher nav). Teacher classes
 * belong to the Stage 2 dashboard scope.
 */
export const Route = createFileRoute('/teacher/classes')({
  component: () => <NotBuiltScreen id="teacher-classes" />,
})
