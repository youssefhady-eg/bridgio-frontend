import { createFileRoute } from '@tanstack/react-router'
import { NotBuiltScreen } from '~/components/NotBuiltScreen'

/**
 * Stage 1 placeholder ONLY ("Tests" from the teacher nav). The test builder
 * (4 steps + question editor) is Stage 3 — not built here.
 */
export const Route = createFileRoute('/teacher/tests')({
  component: () => <NotBuiltScreen id="teacher-tests" />,
})
