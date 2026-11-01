import { createFileRoute } from '@tanstack/react-router'
import { NotBuiltScreen } from '~/components/NotBuiltScreen'

/**
 * Stage 1 placeholder ONLY. The teacher dashboard itself is Stage 2 — building
 * it here would violate the stage gate ("No feature screens yet").
 */
export const Route = createFileRoute('/teacher/dashboard')({
  component: () => <NotBuiltScreen id="teacher-dashboard" />,
})
