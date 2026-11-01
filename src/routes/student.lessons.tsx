import { createFileRoute } from '@tanstack/react-router'
import { NotBuiltScreen } from '~/components/NotBuiltScreen'

/**
 * Stage 1 placeholder ONLY ("Lessons" from the student nav). No lessons flow
 * is scheduled in the stage plan yet — flagged in the delivery note.
 */
export const Route = createFileRoute('/student/lessons')({
  component: () => <NotBuiltScreen id="student-lessons" />,
})
