import { createFileRoute } from '@tanstack/react-router'
import { NotBuiltScreen } from '~/components/NotBuiltScreen'

/**
 * Stage 1 placeholder ONLY ("Students" from the teacher nav). Student progress
 * views belong to the Stage 2 dashboard scope.
 */
export const Route = createFileRoute('/teacher/students')({
  component: () => <NotBuiltScreen id="teacher-students" />,
})
